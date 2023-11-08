<template>
  <div>
    <div
      v-if="registerInProgress"
      class="text-white text-center font-bold p-4 rounded mb-4"
      :class="registerAlertClasses"
    >
      {{ registerText }}
    </div>
    <vee-form :validationSchema="schema" @submit="register">
      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <vee-field
          type="text"
          name="name"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name"
        />
        <error-message class="text-red-600" name="name" />
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          name="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <error-message class="text-red-600" name="email" />
      </div>
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field
          type="number"
          name="age"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        />
        <error-message class="text-red-600" name="age" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          type="password"
          name="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <error-message class="text-red-600" name="password" />
      </div>
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field
          type="password"
          name="confirmedPassword"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password"
        />
        <error-message class="text-red-600" name="confirmedPassword" />
      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <vee-field
          as="select"
          name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="Antarctica">Antarctica</option>
        </vee-field>
        <error-message class="text-red-600" name="country" />
      </div>
      <!-- TOS -->
      <div class="mb-3 pl-6">
        <vee-field
          name="tos"
          value="false"
          type="checkbox"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        />
        <label class="inline-block">Accept terms of service</label>
        <error-message class="text-red-600 block" name="tos" />
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="registerFormIsValid"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>
<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'RegistrationForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email',
        age: 'required|min_value:18|max_value:120',
        password: 'required|min:6|max:16',
        confirmedPassword: 'required|confirmed:@password',
        country: 'required|excluded:Antarctica',
        tos: 'required'
      },
      registerInProgress: false,
      registerText: 'Registration in progress.Wait',
      registerAlertClasses: 'bg-blue-500',
      registerFormIsValid: false
    }
  },
  methods: {
    ...mapActions(useUserStore, { createUser: 'register' }),
    throwError() {
      this.registerFormIsValid = false
      this.registerAlertClasses = 'bg-red-500'
      this.registerText = 'An unexpected error occurred. Please try again later'
    },
    async register(values) {
      this.registerInProgress = true
      this.registerFormIsValid = true
      this.registerAlertClasses = 'bg-blue-500'
      this.registerText = 'Registration in progress.Wait'

      try {
       await this.createUser(values)
      } catch (error) {
        return this.throwError()
      }

      this.registerAlertClasses = 'bg-green-500'
      this.registerText = 'Registration has finished successfully'
      window.location.reload()

    }
  }
}
</script>
