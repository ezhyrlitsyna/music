import { defineStore } from 'pinia';
import { Howl } from 'howler';

import { formatDurationTime } from '@/helpers/dateTimeHelper';

export default defineStore('player', {
	state: () => ({
		currentSong: {},
		sound: {},
		seek: '00:00',
		duration: '00:00',
		playerProgress: '0%',
	}),
	getters: {
		isPlaying: (state) => {
			if (state.sound.playing) {
				return state.sound.playing();
			}

			return false;
		}
	},
	actions: {
		setCurrentSong(song) {
			if (this.sound instanceof Howl) {
				this.sound.unload();
			}

			this.currentSong = song;

			this.sound = new Howl({
				src: [song.url],
				html5: true,
			});

			this.sound.play();

			this.sound.on('play', () => {
				requestAnimationFrame(this.progress);
			}
			);
		},
		toggleAudio() {
			if (!this.sound.playing) return

			if (this.sound.playing()) {
				this.sound.pause();
			} else {
				this.sound.play();
			}
		},
		progress() {
			this.seek = formatDurationTime(this.sound.seek());
			this.duration = formatDurationTime(this.sound.duration());

			this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;

			if (this.sound.playing()) {
				requestAnimationFrame(this.progress);
			}
		},
		updateSeek(event) {
			if (!this.sound.playing) return

			const { width, x } = event.currentTarget.getBoundingClientRect();

			const clickX = event.clientX - x;
			const percentage = clickX / width;
			const seconds = this.sound.duration() * percentage;

			this.sound.seek(seconds);
			this.sound.once('seek', this.progress)
		}
	},
});