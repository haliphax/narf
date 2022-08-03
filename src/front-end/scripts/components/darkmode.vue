<script lang="ts">
import { Component } from 'vue';
import store from '../store';

const settings = store.state.session.settings;

const DarkMode: Component = {
	methods: {
		toggle() {
			const val = document.body.classList.toggle('dark-mode');

			store.commit('session.settings.darkMode', val);
		},
	},
	mounted() {
		if (matchMedia('prefers-color-scheme: dark').matches || settings.darkMode)
			this.toggle();
	},
};

export default DarkMode;
</script>

<template>
	<label for="darkmode">
		Dark mode
		<span class="tog">
			<input id="darkmode" type="checkbox"
				:checked="$store.state.session.settings.darkMode" @click="toggle()">
			<i></i>
		</span>
	</label>
</template>

<style type="less" scoped>
label {
	float: right;
}
</style>
