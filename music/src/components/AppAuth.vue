<template>
  <div class="fixed z-50 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800/75 backdrop-blur-sm"/>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">{{ $t('auth.your_account') }}</p>
            <div class="modal-close cursor-pointer z-50" @click="closeModal">
              <i class="fas fa-times"/>
            </div>
          </div>

          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'login',
                  'hover:text-blue-600': tab === 'registration'
                }"
                @click.prevent="tab = 'login'"
              >
                {{ $t('auth.login') }}
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'registration',
                  'hover:text-blue-600': tab === 'login'
                }"
                @click.prevent="tab = 'registration'"
              >
                {{ $t('auth.register') }}
              </a>
            </li>
          </ul>

         <LoginForm v-show="tab === 'login'"/>
         <RegistrationForm v-show="tab === 'registration'"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapWritableState } from 'pinia'
import LoginForm from '@/components/LoginForm.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import useModalStore from '@/stores/modal'

export default {
  name: 'AppAuth',
  components: {
    LoginForm,
    RegistrationForm,
},
  data() {
    return {
      tab: 'login',
    }
  },
  computed: {
    ...mapState(useModalStore, ['hiddenClass']),
    ...mapWritableState(useModalStore, ['isOpened'])
  },
  methods: {
    closeModal() {
      this.isOpened = false
    },
  }
}
</script>
