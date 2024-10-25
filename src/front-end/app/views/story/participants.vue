<script lang="ts">
import { defineComponent } from "vue";
import { Vote } from "../../../../models/vote";

const Participants = defineComponent({
	methods: {
		getVoteTitle(v: Vote) {
			if (!v.vote) return "has not voted";

			if (this.isYou(v) || this.$store.state.story.story?.revealed)
				return undefined;

			return "voted";
		},
		isYou(v: Vote) {
			return v.participantId === this.$store.state.session.id;
		},
	},
});

export default Participants;
</script>

<template>
	<div>
		<h2>Participants</h2>
		<ul class="x">
			<li
				v-for="v of $store.state.story.story?.votes"
				:key="v.participantId"
				class="g"
			>
				<span class="n">
					{{ v.participantName ?? "User" }}
					<span v-if="isYou(v)" class="y">(You)</span>
				</span>
				<span class="v">
					<span :title="getVoteTitle(v)">
						{{ v.vote ?? "⏱️" }}
					</span>
				</span>
			</li>
		</ul>
	</div>
</template>

<style lang="less" scoped>
li {
	grid-auto-flow: row;
	grid-template-columns: auto min-content;
	padding: var(--space-m) var(--space-l);
	margin-bottom: var(--space-s);
}

li:nth-child(2n) {
	background-color: var(--color-bg);
}

/* name */
.n {
	margin-right: var(--space-m);
}

/* value */
.v > * {
	background-color: var(--color-bg-secondary);
	color: var(--color-fg-secondary);
	padding: var(--space-xs) var(--space-s);
}

/* you */
.y {
	font-size: 0.75em;
	opacity: 0.8;
}
</style>
