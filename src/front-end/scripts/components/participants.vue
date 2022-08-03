<script lang="ts">
import { Component } from 'vue';

const Participants: Component = {};

export default Participants;
</script>

<template>
	<div>
		<h2>Participants</h2>
		<ul class="unstyled">
			<li class="grid" v-for="v of $store.state.story.story?.votes">
				<span class="name">
					{{ v.participant?.name ?? 'Anonymous' }}
					<span class="you" v-if="v.participantId === $store.state.session.id">
						(You)
					</span>
				</span>
				<span class="value">
					<span v-if="$store.state.story.revealed">{{ v.vote }}</span>
					<span v-else>?</span>
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
	font-size: .75em;
	opacity: 0.8;
}

.value > * {
	background-color: var(--color-bg-secondary);
	color: var(--color-fg-secondary);
	padding: var(--space-xs) var(--space-s);
}
</style>
