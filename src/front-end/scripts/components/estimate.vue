<script lang="ts">
import { defineComponent } from "vue";
import PieChart from "./piechart.vue";
import scales from "../../../scales";
import { Vote } from "../../../models/vote";

const Estimate = defineComponent({
	components: {
		PieChart,
	},
	computed: {
		options(): Readonly<Array<string>> {
			return scales.get(this.$store.state.story.story?.scale ?? "") ?? [];
		},
		votes() {
			if (!this.$store.state.story.story) return [];

			const votes = new Map<string, number>();

			this.$store.state.story.story.votes?.map((v: Vote) => {
				if (v.vote === null) return;

				const value = v.vote.toString();

				if (!votes.has(value)) votes.set(value, 0);

				votes.set(value, (votes.get(value) ?? 0) + 1);
			});

			return votes;
		},
		you() {
			return this.$store.state.story.story?.votes?.find(
				(v) => v.participantId === this.$store.state.session.id,
			);
		},
	},
	methods: {
		classes(option: string) {
			const classes = [];

			if (this.you?.vote == option) classes.push("chosen");

			return classes;
		},
		vote(option: string) {
			const payload: Vote =
				this.you ??
				(() => {
					return {
						participantId: this.$store.state.session.id,
						participantName: this.$store.state.session.name,
						storyId: this.$store.state.story.story?.id,
						vote: option,
					} as Vote;
				})();
			payload.vote = option;
			this.$store.dispatch("story.vote", payload);
		},
	},
});

export default Estimate;
</script>

<template>
	<div aria-live="polite">
		<h2>Estimate</h2>
		<ul v-if="!$store.state.story.story?.revealed" class="unstyled grid">
			<li v-for="option in options" :key="option">
				<button :class="classes(option)" @click="vote(option)">
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
@import "../../styles/breakpoints.less";

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
