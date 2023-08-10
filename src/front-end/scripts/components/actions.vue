<script lang="ts">
import { defineComponent } from "vue";
import store from "../store/index";

const Actions = defineComponent({
	methods: {
		reveal() {
			store.dispatch("story.reveal");
		},
	},
});

export default Actions;
</script>

<template>
	<ul class="unstyled">
		<li>
			<button :disabled="$store.state.story.story?.revealed" @click="reveal">
				Reveal
			</button>
		</li>
	</ul>
</template>
