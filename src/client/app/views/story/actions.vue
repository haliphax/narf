<script lang="ts">
import { defineComponent } from "vue";
import { StoryStoreState } from "./types";

const Actions = defineComponent({
	computed: {
		storyState() {
			return (this.$store.state as unknown as StoryStoreState).story;
		},
	},
	async mounted() {
		this.$store.subscribeAction(async (a) => {
			if (!(a.type === "confirmed" && a.payload === "reveal")) {
				return;
			}

			await this.$store.dispatch("story.reveal");
			await this.$store.dispatch("story.load");
		});
	},
	methods: {
		async copyUrl() {
			await window.navigator.clipboard.writeText(window.location.href);
			await this.$store.dispatch("alert", {
				text: "The room URL has been copied to your clipboard!",
			});
		},
		async reveal() {
			const message =
				this.storyState.story?.owner === this.$store.state.session.id
					? "Are you ready to reveal the votes?"
					: "You are not the owner of this story. Are you sure?";

			await this.$store.dispatch("confirm", { id: "reveal", text: message });
		},
	},
});

export default Actions;
</script>

<template>
	<ul class="x">
		<li>
			<button @click="copyUrl">
				<span aria-hidden="true">📋</span>
				Share
			</button>
		</li>
		<li>
			<button :disabled="storyState.story?.revealed ?? true" @click="reveal">
				<span aria-hidden="true">👀</span>
				Reveal
			</button>
		</li>
	</ul>
</template>

<style lang="less" scoped>
li {
	display: inline-block;
	margin-right: var(--space-m);
}
</style>
