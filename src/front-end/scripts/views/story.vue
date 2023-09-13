<script lang="ts">
import { defineComponent } from "vue";
import store from "../store";
import Actions from "../components/actions.vue";
import Estimate from "../components/estimate.vue";
import Heading from "../components/heading.vue";
import Participants from "../components/participants.vue";

const Story = defineComponent({
	components: {
		Actions,
		Estimate,
		Heading,
		Participants,
	},
	created() {
		store.dispatch("story.load");
	},
	unmounted() {
		store.commit("events", undefined);
	},
});

export default Story;
</script>

<template>
	<Heading></Heading>
	<Actions class="actions"></Actions>
	<div class="grid">
		<Participants class="participants"></Participants>
		<Estimate class="estimates"></Estimate>
	</div>
</template>

<style lang="less" scoped>
@import "../../styles/breakpoints.less";

.grid {
	grid-auto-columns: auto;
	grid-auto-flow: row;
}

.participants {
	grid-column: 1 / span 2;
	grid-row: 2;
}

.estimates {
	grid-column: 1 / span 2;
	grid-row: 1;
}

.actions {
	grid-column: 1 / span 2;
	padding-top: var(--space-m);
}

@media @breakpoint_m {
	.grid {
		grid-template-columns: calc(40% - var(--space-xl) / 2) calc(
				60% - var(--space-xl) / 2
			);
		column-gap: var(--space-xl);
	}

	.participants {
		grid-column: 1 / span 1;
		grid-row: 1;
	}

	.estimates {
		grid-column: 2 / span 1;
		grid-row: 1;
	}
}
</style>
