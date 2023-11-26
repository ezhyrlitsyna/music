<template>
  <AppHeader />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <AppPlayer />

  <AppAuth />
</template>
<script>
import { mapWritableState } from 'pinia'
import { auth } from '@/includes/firebase'
import useUserStore from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/AppPlayer.vue'
export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
},
  computed: {
    ...mapWritableState(useUserStore, ['userIsLoggedIn'])
  },
  created() {
    if (auth.currentUser) this.userIsLoggedIn = true
  }
}
</script>
<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
