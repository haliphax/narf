<script lang="ts">
import { defineComponent } from "vue";
import Actions from "./story/actions.vue";
import Estimate from "./story/estimate.vue";
import Participants from "./story/participants.vue";

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
	created() {
		this.$store.dispatch("story.join");
	},
	unmounted() {
		this.$store.commit("story", undefined);
		this.$store.commit("events", undefined);
	},
});

export default Story;
</script>

<template>
	<h1 :id="id">
		<span v-if="!$store.state.story.story">⏳ Loading&hellip;</span>
		<span v-else>
			<span class="sr">Story title:</span>
			{{ $store.state.story.story?.title }}
		</span>
	</h1>
	<Actions class="a"></Actions>
	<div class="g">
		<Participants class="p"></Participants>
		<Estimate class="e"></Estimate>
	</div>
</template>

<style lang="less" scoped>
@import "../../styles/breakpoints.less";

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
