import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: resolve(import.meta.dirname, "..", "..", "dist"),
		rolldownOptions: {
			transform: {
				inject: { Buffer: ["buffer", "Buffer"] },
			},
		},
	},
	plugins: [
		createHtmlPlugin({ minify: true }),
		viteSingleFile({ removeViteModuleLoader: true }),
		vue(),
	],
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, ".."),
		},
	},
});
