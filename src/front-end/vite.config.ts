import inject from "@rollup/plugin-inject";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: "../../dist",
		rollupOptions: {
			plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, ".."),
		},
	},
	plugins: [vue()],
});
