<script lang="ts">
import { defineComponent } from "vue";

const Actions = defineComponent({
	methods: {
		reveal() {
			if (
				this.$store.state.story.story?.owner !== this.$store.state.session.id &&
				!confirm("You are not the owner of this story. Are you sure?")
			) {
				return;
			}

			this.$store.dispatch("story.reveal");
		},
	},
});

export default Actions;
</script>

<template>
	<ul class="unstyled">
		<li>
			<button :disabled="$store.state.story.story?.revealed" @click="reveal">
				<span aria-hidden="true">👀</span>
				Reveal
			</button>
		</li>
	</ul>
</template>
