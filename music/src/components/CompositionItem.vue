<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click.prevent="deleteSong">
        <i class="fa fa-times"/>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"/>
      </button>
    </div>
    <div v-show="showForm">
      <vee-form :validationSchema="schema" :initialValues="song" @submit="edit">
      <div v-if="show_alert" class="text-bold p-4 mb-2 text-white rounded text-center" :class="alert_variant">
        {{ alert_message }}
      </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t('manage.song_title') }}</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('manage.enter_song_title')"
            @input="updateUnsavedFlag(true)"
          />
					<error-message class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t('manage.genre') }}</label>
          <vee-field
						name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('manage.enter_genre')"
            @input="updateUnsavedFlag(true)"
          />
					<error-message class="text-red-600" name="genre" />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600" :disabled="in_submission">{{ $t('manage.submit') }}</button>
        <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600" :disabled="in_submission" @click.prevent="showForm = false">{{ $t('manage.go_back') }}</button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songCollection, storage } from '@/includes/firebase'
export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    }
  },
  data() {
    return {
      showForm: false,
			schema: {
				modified_name: 'required',
				genre: 'alpha_spaces'
			},
			in_submission: false,
			show_alert: false,
			alert_message: this.$i18n.t('manage.updating'),
			alert_variant: 'bg-blue-600'
    }
  },
	methods: {
		async edit(values) {
			this.in_submission = true
      this.show_alert = true
      this.alert_message = this.$i18n.t('manage.updating')
      this.alert_variant = 'bg-blue-600'

      try {
        await songCollection.doc(this.song.id).update(values)
      } catch (error) {
        this.alert_message = this.$i18n.t('manage.error_updating')
        this.alert_variant = 'bg-red-500'
        return
      }

      this.updateSong(this.index, values)
      this.updateUnsavedFlag(false)

      this.in_submission = false
      this.alert_message = this.$i18n.t('manage.success_updating')
      this.alert_variant = 'bg-green-500'
		},
    async deleteSong() {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)

      await songRef.delete()
      await songCollection.doc(this.song.id).delete()

      this.removeSong(this.index)

    }
	}
}
</script>
