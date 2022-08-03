<script lang="ts">
import Actions from './actions.vue';
import { Component } from 'vue';
import Estimate from './estimate.vue';
import Heading from './heading.vue';
import Participants from './participants.vue';
import store from '../store';

const Room: Component = {
	components: {
		Actions,
		Estimate,
		Heading,
		Participants,
	},
	created() {
		store.dispatch('story.load');
	},
};

export default Room;
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
@import '../../styles/variables.less';

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
		grid-template-columns:
			calc(40% - var(--space-m) / 2)
			calc(60% - var(--space-m) / 2);
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
