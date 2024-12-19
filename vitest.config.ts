import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	test: {
		coverage: {
			reporter: ["html", "lcov", "text"],
			skipFull: true,
		},
		environment: "happy-dom",
		globals: true,
		onConsoleLog: () => false,
	},
});
