<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="no-active"
        :to="{ name: 'HomePage' }"
      >
        {{ $t('header.music') }}
      </router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li>
            <router-link
              class="px-2 text-white"
              :to="{ name: 'AboutPage' }"
            >
              {{ $t('header.about') }}
            </router-link>
          </li>
          <template v-if="!userIsLoggedIn">
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="toggleAuthModal"
              >
                {{ $t('auth.login') }} / {{ $t('auth.register') }}
              </a>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'ManagePage' }"
              >
                {{ $t('header.manage') }}
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="signOut"
              >
                {{ $t('header.logout') }}
              </a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="changeLocal"
            >
              {{ currentLocale }}
            </a>
          </li>
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
    ...mapWritableState(useUserStore, ['userIsLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'en' ? 'EN' : 'UA'
    }
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
    },
    changeLocal() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'uk' : 'en'
    }
  }
}
</script>
