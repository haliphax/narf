<script lang="ts">
import { Component } from "vue";
import store from "../store/index";

const Actions: Component = {
	methods: {
		reveal() {
			store.dispatch("story.reveal");
		},
	},
};

export default Actions;
</script>

<template>
	<ul class="unstyled">
		<li>
			<button @click="reveal" :disabled="$store.state.story.revealed">
				Reveal
			</button>
		</li>
	</ul>
</template>
