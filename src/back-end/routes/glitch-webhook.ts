import { execSync } from "child_process";
import { createHmac, timingSafeEqual } from "crypto";
import { Application } from "express";

/** Adds webhook endpoint for updating from remote git */
const glitchWebhook = (app: Application) => {
	app.post("/git", (req, res) => {
		if (!process.env.SECRET) return res.sendStatus(500);

		const hmac = createHmac("sha1", process.env.SECRET);
		const sig = `sha1=${hmac.update(JSON.stringify(req.body)).digest("hex")}`;

		if (
			!timingSafeEqual(
				Buffer.from(sig),
				Buffer.from(req.headers["x-hub-signature"] as string)
			)
		) {
			console.error("webhook signature incorrect");
			return res.sendStatus(403);
		}

		res.sendStatus(200);

		if (
			req.headers["x-github-event"] === "push" &&
			req.body.ref === "refs/heads/glitch"
		) {
			[
				"rm -rf dist/front-end",
				"git restore dist",
				"git fetch origin glitch",
				"git reset --hard origin/glitch",
				"git pull origin glitch --force",
				"refresh",
			].forEach((cmd) => console.log(execSync(cmd).toString()));
		}
	});
};

export default glitchWebhook;
