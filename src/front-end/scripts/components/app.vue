<script lang="ts">
import { defineComponent } from "vue";
import DarkMode from "./darkmode.vue";

const App = defineComponent({
	components: {
		DarkMode,
	},
});

export default App;
</script>

<template>
	<div class="app">
		<header class="grid">
			<router-link :to="{ name: 'home' }">narf!</router-link>
			<DarkMode class="darkmode"></DarkMode>
		</header>
		<main>
			<router-view></router-view>
		</main>
	</div>
</template>

<style lang="less" scoped>
@import "../../styles/breakpoints.less";

.app {
	margin: 0 auto;
	max-width: 960px;
	padding: var(--space-m);
	width: 100%;
}

header {
	border-bottom: 1px solid var(--color-fg-subtle);
	grid-auto-flow: column;
	padding-bottom: var(--space-m);
}

header a {
	font-weight: 900;
}

.darkmode {
	text-align: right;
}

@media @breakpoint_m {
	.app {
		padding-left: var(--space-xxl);
		padding-right: var(--space-xxl);
	}
}
</style>
