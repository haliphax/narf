<script lang="ts">
import { defineComponent } from "vue";
import DarkMode from "./components/darkmode.vue";
import { ROOT_URI } from "./constants";
import store from "./store";

const App = defineComponent({
	components: {
		DarkMode,
	},
	async beforeCreate() {
		document.cookie = [
			`narfClient=${store.state.session.id}`,
			`path=${ROOT_URI}`,
			"samesite=strict",
			"secure",
		].join(";");
	},
});

export default App;
</script>

<template>
	<div class="app">
		<header class="grid">
			<div>
				<router-link :to="{ name: 'home' }" class="ib">narf!</router-link>
			</div>
			<div class="right">
				<DarkMode class="ib"></DarkMode>
			</div>
		</header>
		<main>
			<router-view></router-view>
		</main>
	</div>
</template>

<style lang="less" scoped>
@import "../styles/breakpoints.less";

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

@media @breakpoint_m {
	.app {
		padding-left: var(--space-xxl);
		padding-right: var(--space-xxl);
	}
}
</style>
