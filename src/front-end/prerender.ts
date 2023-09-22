import { writeFileSync } from "node:fs";
import { renderToString } from "vue/server-renderer";
import app from "./scripts/index";
import router from "./scripts/router";

(async () => {
	await router.push({ name: "home" });
	await router.isReady();

	const html = await renderToString(app);

	writeFileSync("dist/index.html", html, { encoding: "utf-8" });
})();
