<script lang="ts">
import { defineComponent } from "vue";
import Actions from "./story/actions.vue";
import Estimate from "./story/estimate.vue";
import storyModule from "./story/module";
import Participants from "./story/participants.vue";
import { StoryStoreState } from "./story/types";

const Story = defineComponent({
	components: {
		Actions,
		Estimate,
		Participants,
	},
	props: {
		id: {
			default: "main",
			type: String,
		},
	},
	computed: {
		storyState() {
			return (this.$store.state as unknown as StoryStoreState).story;
		},
	},
	async created() {
		this.$store.registerModule("story", storyModule);
		await this.$store.dispatch("story.join");

		this.$store.subscribeAction(async (o) => {
			if (!["close", "confirmed"].includes(o.type) || o.payload !== "paused") {
				return;
			}

			await this.$store.dispatch("story.join");
		});
	},
	mounted() {
		if (this.storyState.events) {
			setTimeout(
				async () => {
					this.storyState.events?.close();
					await this.$store.dispatch("alert", {
						id: "paused",
						text: "Live updates paused. Close this alert to resume.",
					});
				},
				1000 * 60 * 10, // 10 minutes
			);
		}
	},
	unmounted() {
		this.$store.unregisterModule("story");
	},
});

export default Story;
</script>

<template>
	<h1 :id="id">
		<span v-if="!storyState.story">⏳ Loading&hellip;</span>
		<span v-else>
			<span class="sr">Story title:</span>
			{{ storyState.story?.title }}
		</span>
	</h1>
	<Actions class="a"></Actions>
	<div class="g">
		<Participants class="p"></Participants>
		<Estimate class="e"></Estimate>
	</div>
</template>

<style lang="less" scoped>
@import "@/client/styles/breakpoints.less";

.a {
	grid-column: 1 / span 2;
	padding-top: var(--space-m);
}

.e {
	grid-column: 1 / span 2;
	grid-row: 1;
}

.g {
	grid-auto-columns: auto;
	grid-auto-flow: row;
}

.p {
	grid-column: 1 / span 2;
	grid-row: 2;
}

@media @breakpoint_m {
	.e {
		grid-column: 2 / span 1;
		grid-row: 1;
	}

	.g {
		grid-template-columns: calc(40% - var(--space-xl) / 2) calc(
				60% - var(--space-xl) / 2
			);
		column-gap: var(--space-xl);
	}

	.p {
		grid-column: 1 / span 1;
		grid-row: 1;
	}
}
</style>
