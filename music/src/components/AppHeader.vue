<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="no-active"
        :to="{ name: 'HomePage' }"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link
              class="px-2 text-white"
              :to="{ name: 'AboutPage' }"
            >
              About
            </router-link>
          </li>
          <template v-if="!userIsLoggedIn">
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="toggleAuthModal"
              >
                Login / Register
              </a>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'ManagePage' }"
              >
                Manage
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="signOut"
              >
                Logout
              </a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
import { mapStores, mapWritableState } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
export default {
  name: 'AppHeader',
  computed: {
    ...mapStores(useModalStore, useUserStore),
    ...mapWritableState(useModalStore, ['isOpened']),
    ...mapWritableState(useUserStore, ['userIsLoggedIn'])
  },
  methods: {
    toggleAuthModal() {
      this.isOpened = !this.isOpened
    },
    signOut() {
      this.userStore.signOut()
      if (this.$route.meta?.requiresAuth) {
        this.$router.push({ name: 'HomePage' })
      }
    }
  }
}
</script>
