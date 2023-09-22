import inject from "@rollup/plugin-inject";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
		},
	},
	plugins: [vue()],
});
