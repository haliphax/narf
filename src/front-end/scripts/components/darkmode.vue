<script lang="ts">
import { defineComponent } from "vue";
import Toggle from "./toggle.vue";
import store from "../store";

const settings = store.state.session.settings;

const DarkMode = defineComponent({
	components: {
		Toggle,
	},
	mounted() {
		if (matchMedia("prefers-color-scheme: dark").matches || settings.darkMode)
			this.toggle();
	},
	methods: {
		toggle() {
			const val = document.body.classList.toggle("dark-mode");

			store.commit("session.settings.darkMode", val);
		},
	},
});

export default DarkMode;
</script>

<template>
	<label for="darkmode-toggle">
		<span class="sr-only">Dark mode</span>
		<span aria-hidden="true" class="icon">
			<span class="sun">☀️</span>
			<span class="moon">🌙</span>
		</span>
		<Toggle
			id="darkmode-toggle"
			:checked="$store.state.session.settings.darkMode"
			@click="toggle"
		></Toggle>
	</label>
</template>

<style type="less" scoped>
.icon {
	margin-right: var(--space-m);
}

.moon {
	display: none;
}

body.dark-mode .moon {
	display: inline;
}

body.dark-mode .sun {
	display: none;
}

label {
	float: right;
}
</style>
