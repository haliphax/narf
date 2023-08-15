<script lang="ts">
import { defineComponent } from "vue";
import store from "../store/index";

const Actions = defineComponent({
	methods: {
		reveal() {
			if (
				store.state.story.story?.owner !== store.state.session.id &&
				!confirm("You are not the owner of this story. Are you sure?")
			) {
				return;
			}

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
