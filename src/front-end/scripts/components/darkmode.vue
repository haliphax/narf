<script lang="ts">
import { defineComponent } from "vue";
import Toggle from "./toggle.vue";

const DarkMode = defineComponent({
	components: {
		Toggle,
	},
	data() {
		return { settings: this.$store.state.session.settings };
	},
	mounted() {
		if (
			matchMedia("prefers-color-scheme: dark").matches ||
			this.settings.darkMode
		) {
			this.toggle();
		}
	},
	methods: {
		toggle() {
			const val = document.body.classList.toggle("dark-mode");

			this.$store.commit("session.settings", { darkMode: val });
		},
	},
});

export default DarkMode;
</script>

<template>
	<label for="darkmode-toggle" title="Toggle dark mode">
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
