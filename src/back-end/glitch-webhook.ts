import bodyParser from "body-parser";
import { execSync } from "child_process";
import { createHmac, timingSafeEqual } from "crypto";
import { Application, Request, Response } from "express";

/** Adds webhook endpoint for updating from remote git */
const glitchWebhook = (app: Application) => {
	app.use(bodyParser.json());
	app.post("/git", (req: Request, res: Response) => {
		if (!process.env.SECRET) return res.sendStatus(500);

		const hmac = createHmac("sha1", process.env.SECRET);
		const sig = "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");

		if (
			timingSafeEqual(
				Buffer.from(sig),
				Buffer.from(req.headers["x-hub-signature"] as string)
			)
		) {
			res.sendStatus(200);

			if (req.headers["x-github-event"] === "push") {
				[
					"git fetch origin glitch",
					"git reset --hard origin/glitch",
					"git pull origin glitch --force",
					"refresh",
				].forEach((cmd) => console.log(execSync(cmd).toString()));
			}

			return;
		}

		console.error("webhook signature incorrect");
		res.sendStatus(403);
	});
};

export default glitchWebhook;
