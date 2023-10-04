import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	test: {
		root: "src/front-end",
		environment: "happy-dom",
		globals: true,
		onConsoleLog: () => false,
	},
});
