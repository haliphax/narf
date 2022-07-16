<script lang="ts">
import { Component } from 'vue';
import store from '../store/index';

const Actions: Component = {
	computed: {
		story() { return store.state.story; },
	},
	methods: {
		reveal() { store.dispatch('reveal'); },
	},
};

export default Actions;
</script>

<template>
	<ul class="unstyled">
		<li>
			<button @click="reveal" :disabled="story.revealed">Reveal</button>
		</li>
	</ul>
</template>
