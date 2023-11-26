<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      />
      <div class="container mx-auto flex items-center">
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="setCurrentSong(song)"
        >
          <i class="fas" :class="{'fa-play': !isPlaying, 'fa-pause': isPlaying }" />
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div v-if="song.genre">{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Comments ({{ song.comments_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl" />
        </div>
        <div class="p-6">
          <div
            v-if="comment_show_alert"
            class="text-white text-center font-bold p-4 mb-4 rounded"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form :validationSchema="schema" @submit="addComment" v-if="userIsLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            />
            <error-message name="comment" class="text-red-600" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <select
            v-model="sortType"
            v-if="comments.length >= 2"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <ul class="container mx-auto" id="comment">
      <li
        v-for="comment in sortedComments"
        :key="comment.id"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <div class="mb-5">
          <div class="font-bold">{{ comment.created_by }}</div>
          <time>{{ formatTimeAgo(comment.created_at) }}</time>
        </div>

        <p>
          {{ comment.text }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia'

import { songCollection, commentCollection, auth } from '@/includes/firebase'

import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

import { formatTimeAgo } from '@/helpers/dateTimeHelper.js'
export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_message: 'Updating comment...',
      comment_alert_variant: 'bg-blue-600',
      comments: [],
      sortType: 'latest', //[latest, oldest]
      formatTimeAgo
    }
  },
  computed: {
    ...mapState(useUserStore, ['userIsLoggedIn']),
    ...mapState(usePlayerStore, ['isPlaying']),
    sortedComments() {
      return [...this.comments].sort((a, b) => {
        if (this.sortType === 'latest') {
          return new Date(b.created_at) - new Date(a.created_at)
        }
        return new Date(a.created_at) - new Date(b.created_at)
      })
    }
  },
  methods: {
		...mapActions(usePlayerStore, ['setCurrentSong']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_alert_message = 'Updating comment...'
      this.comment_alert_variant = 'bg-blue-600'
      this.comment_show_alert = true

      let comment = {
        created_at: new Date().toString(),
        created_by: auth.currentUser.displayName,
        created_by_id: auth.currentUser.uid,
        song_id: this.song.id,
        text: values.comment
      }
      await commentCollection.add(comment)
			this.song.comments_count += 1
			await songCollection.doc(this.song.id).update({
				comments_count: this.song.comments_count
			})

      this.getComments()

      this.comment_in_submission = false
      this.comment_alert_message = 'Comment updated!'
      this.comment_alert_variant = 'bg-green-500'
      setTimeout(() => {
        this.comment_show_alert = false
      }, 3000)

      resetForm()
    },
    async getComments() {
      const snapshots = await commentCollection.where('song_id', '==', this.song.id).get()

      this.comments = []

      snapshots.forEach((snapshot) => {
        this.comments.push({
          id: snapshot.id,
          ...snapshot.data()
        })
      })
    }
  },
  watch: {
    sortType(newVal) {
			if ( newVal === this.$route.query.sort ) return
      this.$router.push({ query: { sort: newVal } })
    }
  },
  async created() {
    const snapshot = await songCollection.doc(this.$route.params.id).get()

    if (!snapshot.exists) {
      this.$router.push({ name: 'HomePage' })
      return
    }

		const { sort } = this.$route.query

		this.sortType = sort === 'latest' || sort === 'oldest' ? sort : 'latest'

    this.song = {
      id: snapshot.id,
      ...snapshot.data()
    }
    this.getComments()
  }
}
</script>
