import inject from "@rollup/plugin-inject";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: "../../dist",
		rollupOptions: {
			plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
		},
	},
	plugins: [createHtmlPlugin({ minify: true }), viteSingleFile(), vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, ".."),
		},
	},
});
