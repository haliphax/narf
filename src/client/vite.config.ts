import inject from "@rollup/plugin-inject";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { InputPluginOption } from "vite/node_modules/rollup";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: "../../dist",
		rollupOptions: {
			plugins: [inject({ Buffer: ["buffer", "Buffer"] }) as InputPluginOption],
		},
	},
	plugins: [createHtmlPlugin({ minify: true }), vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, ".."),
		},
	},
});
