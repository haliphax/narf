<script lang="ts">
import { Component } from 'vue';
import { estimate } from '../types';
import PieChart from './piechart.vue';
import store from '../store';

const FIBONACCI = ['0', '0.5', '1', '2', '3', '5', '8', '13', '💬'] as const;
const TSHIRTS = ['XS', 'S', 'M', 'L', 'XL', '💬'] as const;

enum mode {
	Fibonacci,
	TShirts,
};

const modeMap = {
	[mode.Fibonacci]: FIBONACCI,
	[mode.TShirts]: TSHIRTS,
};

type pointsData = {
	mode: mode,
};

const Estimate: Component = {
	components: {
		PieChart,
	},
	computed: {
		options(): Readonly<Array<string>> { return modeMap[this.mode as mode]; },
		votes() {
			const votes = new Map<string, number>();

			Object.values(store.state.participants.people).map(v => {
				const value = v.value!.toString();

				if (!votes.has(value))
					votes.set(value, 0);

				votes.set(value, votes.get(value)! + 1);
			});

			return votes;
		},
		you() {
			return Object.values(store.state.participants.people)
				.find(v => v.id === store.state.session.id);
		},
	},
	data(): pointsData {
		return { mode: mode.Fibonacci };
	},
	methods: {
		classes(option: string) {
			const classes = [];

			if (this.you?.value == option)
				classes.push('chosen');

			return classes;
		},
		setEstimate(option: string) {
			const estimate: estimate = {
				user: {
					id: store.state.session.id,
					name: store.state.session.name,
				},
				value: option == this.you?.value ? null : option,
			};

			store.dispatch('estimate', estimate);
		},
	},
};

export default Estimate;
</script>

<template>
	<div aria-live="polite">
		<h2>Estimate</h2>
		<ul class="unstyled grid" v-if="!$store.state.story.revealed">
			<li v-for="option in options">
				<button @click="setEstimate(option)" :class="classes(option)">
					{{ option }}
				</button>
			</li>
		</ul>
		<div v-else>
			<PieChart :data="votes"></PieChart>
		</div>
	</div>
</template>

<style lang="less" scoped>
@import '../../styles/variables.less';

button {
	aspect-ratio: 1;
	font-size: 2rem;
	margin: 0;
	padding: 0;
	width: 100%;
}

.grid {
	grid-template-columns: repeat(4, minmax(0, 1fr));
}

.chosen {
	background-color: var(--color-bg-secondary);
	color: var(--color-fg-secondary);
}

@media @breakpoint_s {
	.grid {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}
}

@media @breakpoint_m {
	h2 {
		text-align: center;
	}

	.grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

@media @breakpoint_l {
	.grid {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}
</style>
