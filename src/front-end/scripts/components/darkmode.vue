<script lang="ts">
import { defineComponent } from "vue";
import Toggle from "./toggle.vue";
import { SessionSettings, SessionState } from "../store/types";

const DarkMode = defineComponent({
	components: {
		Toggle,
	},
	computed: {
		enabled() {
			return this.$store.state.session.settings.darkMode;
		},
	},
	mounted() {
		this.bodyClass();
		this.$store.subscribe((mutation) => {
			console.log(mutation);
			const keys = Object.getOwnPropertyNames(mutation.payload);

			if (mutation.type == "session" && keys.includes("settings")) {
				console.log("session");
				return this.bodyClass(
					(mutation.payload as SessionState).settings.darkMode,
				);
			}

			if (mutation.type == "session.settings" && keys.includes("darkMode")) {
				console.log("settings");
				return this.bodyClass((mutation.payload as SessionSettings).darkMode);
			}
		});
	},
	methods: {
		bodyClass(force?: boolean) {
			document.body.classList.toggle("dark-mode", force ?? this.enabled);
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
