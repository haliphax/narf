<script lang="ts">
import { defineComponent } from "vue";

const Participants = defineComponent({});

export default Participants;
</script>

<template>
	<div>
		<h2>Participants</h2>
		<ul class="unstyled">
			<li
				v-for="v of $store.state.story.story?.votes"
				:key="v.participantId"
				class="grid"
			>
				<span class="name">
					{{ v.participantName ?? "User" }}
					<span v-if="v.participantId === $store.state.session.id" class="you">
						(You)
					</span>
				</span>
				<span class="value">
					<span :title="!v.vote ? 'Waiting' : 'Voted'">
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

.name {
	margin-right: var(--space-m);
}

.you {
	font-size: 0.75em;
	opacity: 0.8;
}

.value > * {
	background-color: var(--color-bg-secondary);
	color: var(--color-fg-secondary);
	padding: var(--space-xs) var(--space-s);
}
</style>
