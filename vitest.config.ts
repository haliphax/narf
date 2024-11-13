import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	test: {
		coverage: {
			lines: 75,
			reporter: ["html", "lcov"],
			skipFull: true,
		},
		environment: "happy-dom",
		globals: true,
		onConsoleLog: () => false,
	},
});
