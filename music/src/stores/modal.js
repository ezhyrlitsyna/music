import {defineStore} from 'pinia'

export default defineStore('modal', {
	state: () => ({
		isOpened: false,
	}),
	getters: {
		hiddenClass(state) {
			return !state.isOpened ? 'hidden' : ''
		}
	}
})