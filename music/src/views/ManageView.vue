<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <AppUploader :addSong="addSong"/>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"/>
          </div>
          <div class="p-6">
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.id"
              :song="song"
              :index="index"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
// import useUserStore from '@/stores/user'
import AppUploader from '@/components/AppUploader.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songCollection, auth } from '../includes/firebase'
export default {
  name: 'ManageView',
  components: {
    AppUploader,
    CompositionItem
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    },
    addSong(doc) {
      let song = {
        id: doc.id,
        ...doc.data()
      }
      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave (to, from, next) {
    if(!this.unsavedFlag) {
      next()
    } else {
      const isLeave = confirm('You have unsaved changes. Are you sure you want to leave this page?')
      next(isLeave)
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   const store = useUserStore()
  //   if (store.userIsLoggedIn) {
  //     next()
  //   } else {
  //     next({ name: 'HomePage' })
  //   }
  //   next()
  // }
  async created() {
    const snapshot = await songCollection.where('uid', '==', auth.currentUser.uid).get()
    snapshot.forEach(this.addSong)
  }
}
</script>
