<script lang="ts">
import { Component } from 'vue';
import DarkMode from './darkmode.vue';

const App: Component = {
	components: {
		DarkMode,
	},
};

export default App;
</script>

<template>
	<DarkMode></DarkMode>
	<router-view></router-view>
</template>
