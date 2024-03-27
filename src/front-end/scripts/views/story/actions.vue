<script lang="ts">
import { defineComponent } from "vue";

const Actions = defineComponent({
	methods: {
		async copyUrl() {
			await window.navigator.clipboard.writeText(window.location.href);
			alert("The room URL has been copied to your clipboard!");
		},
		async reveal() {
			if (
				this.$store.state.story.story?.owner !== this.$store.state.session.id &&
				!confirm("You are not the owner of this story. Are you sure?")
			) {
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
button {
	margin-right: var(--space-m);
}
</style>
