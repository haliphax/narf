<script lang="ts">
import { defineComponent } from "vue";

const Actions = defineComponent({
	methods: {
		async copyUrl() {
			await window.navigator.clipboard.writeText(window.location.href);
			alert("The room URL has been copied to your clipboard!");
		},
		async reveal() {
			const message =
				this.$store.state.story.story?.owner === this.$store.state.session.id
					? "Are you ready to reveal the votes?"
					: "You are not the owner of this story. Are you sure?";

			if (!confirm(message)) {
				return;
			}

			await this.$store.dispatch("story.reveal");
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
			<button
				:disabled="$store.state.story.story?.revealed ?? true"
				@click="reveal"
			>
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
