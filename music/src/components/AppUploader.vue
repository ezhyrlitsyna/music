<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('manage.upload') }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid mb-4"
				:class="{
					'bg-green-400 border-green-400 border-solid text-white': isDragOver
				}"
				@drag.prevent.stop=""
				@dragstart.prevent.stop=""
				@dragend.prevent.stop="isDragOver = false"
				@dragover.prevent.stop="isDragOver = true"
				@dragenter.prevent.stop="isDragOver = true"
				@dragleave.prevent.stop="isDragOver = false"
				@drop.prevent.stop="upload($event)"
			>
        <h5>{{ $t('manage.drop_files')}}</h5>
      </div>
      <label class="bg-green-400 rounded p-2 text-white" for="files"
      >
        {{ $t('manage.choose_files') }}
        <input
          class="hidden"
          id="files"
          type="file"
          multiple
          @change="upload($event)"
        />
      </label>
      <hr class="my-6" />
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <div
          class="font-bold text-sm"
          :class="upload.textClass"
        >
          <i :class="upload.icon"/> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
            />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storage, auth, songCollection } from '@/includes/firebase'
export default {
  name: 'AppUploader',
  props: {
    addSong: {
      type: Function,
    }
  },
	data() {
		return {
			isDragOver: false,
      uploads: []
		}
	},
	methods: {
		upload(event) {
			this.isDragOver = false

			const files = event.dataTransfer ? [...event.dataTransfer.files] : [...event.target.files]

			files.forEach((file) => {
				if (file.type !== 'audio/mpeg') {
					return
				}

				const storageRef = storage.ref() // music-e6dac.appspot.com
				const songRef = storageRef.child(`songs/${file.name}`) //music-e6dac.appspot.com/songs/example.mp3

        const task = songRef.put(file)

        const uploadIndex = this.uploads.push({
          name: file.name,
          task,
          currentProgress: 0,
          variant: 'bg-blue-400',
          textClass: '',
          icon: 'fas fa-spinner fa-spin'
        }) - 1

        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          this.uploads[uploadIndex].currentProgress = progress

        }, (error) => {
          this.uploads[uploadIndex].variant = 'bg-red-400'
          this.uploads[uploadIndex].textClass = 'text-red-400'
          this.uploads[uploadIndex].icon = 'fas fa-times'
          console.log(error)

        }, async() => {

          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name,
            genre: '',
            comments_count: 0,
          }

          song.url = await task.snapshot.ref.getDownloadURL()

          const songRef = await songCollection.add(song)
          const songSnapshot = await songRef.get()

          this.addSong(songSnapshot)

          this.uploads[uploadIndex].variant = 'bg-green-400'
          this.uploads[uploadIndex].textClass = 'text-green-400'
          this.uploads[uploadIndex].icon = 'fas fa-check'
        })
			})
		}
	},
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  }
}
</script>
