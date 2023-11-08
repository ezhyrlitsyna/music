<template>
  <div>
    <div
      v-if="loginInProgress"
      class="text-white text-center font-bold p-4 rounded mb-4"
      :class="loginAlertClasses"
    >
      {{ loginText }}
    </div>

    <vee-form :validationSchema="loginSchema" @submit="login">
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          name="email"
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <error-message class="text-red-600" name="email" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          name="password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <error-message class="text-red-600" name="password" />
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>
<script>
import {mapActions} from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:6|max:16'
      },
      loginInProgress: false,
      loginText: 'Authorization in progress.Wait',
      loginAlertClasses: 'bg-blue-500',
      loginFormIsValid: false
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async login(values) {
			this.loginInProgress = true
      this.loginFormIsValid = true
      this.loginAlertClasses = 'bg-blue-500'
      this.loginText = 'Authorization in progress.Wait'

      try{

      await this.authenticate(values)
      }
      catch(error){
        this.loginFormIsValid = false
        this.loginAlertClasses = 'bg-red-500'
        this.loginText = 'Invalid login'
        return
      }

      this.loginAlertClasses = 'bg-green-500'
      this.loginText = 'Authorization has finished successfully'
      window.location.reload()
    }
  }
}
</script>
