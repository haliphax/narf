<script lang="ts">
import { defineComponent } from "vue";
import Toggle from "./toggle.vue";
import { SessionSettings, SessionState } from "../store/types";

const DarkMode = defineComponent({
	components: {
		Toggle,
	},
	data() {
		return {
			enabled: this.$store.state.session.settings.darkMode,
		};
	},
	watch: {
		enabled() {
			this.bodyClass(this.enabled);
		},
	},
	created() {
		this.bodyClass(this.enabled);
		this.$store.subscribe((mutation) => {
			const keys = Object.getOwnPropertyNames(mutation.payload);

			if (mutation.type == "session" && keys.includes("settings"))
				this.enabled = (mutation.payload as SessionState).settings.darkMode;
			else if (
				mutation.type == "session.settings" &&
				keys.includes("darkMode")
			) {
				this.enabled = (mutation.payload as SessionSettings).darkMode;
			}
		});
	},
	methods: {
		bodyClass(force: boolean) {
			document.body.classList.toggle("dark-mode", force);
		},
		toggle() {
			this.$store.commit("session.settings", { darkMode: !this.enabled });
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
			ref="toggle"
			:checked="enabled"
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
