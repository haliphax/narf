import compression from "compression";
import historyApiFallback from "connect-history-api-fallback";
import cors from "cors";
import express from "express";
import { remultExpress } from "remult/remult-express";
import Participant from "../models/participant";
import Story from "../models/story";
import Vote from "../models/vote";
import glitchWebhook from "./glitch-webhook";

const host = process.env.host ?? "localhost";
const port = parseInt(process.env.port ?? "3000");

const app = express();

if (process.env.NODE_ENV !== "production") app.use(cors({ origin: "*" }));

const staticMiddleware = express.static("dist/front-end");

app.use(compression());
app.use(staticMiddleware);
app.use(historyApiFallback());
app.use(staticMiddleware);
app.use(
	remultExpress({
		entities: [Participant, Story, Vote],
		async initApi(remult) {
			const repo = remult.repo(Story);

			if ((await repo.count()) === 0) {
				await repo.insert([{ id: "1", title: "Testing this thing" }]);
			}
		},
	})
);

glitchWebhook(app);

app.listen(port, host, () => {
	console.log(`Server listening at http://${host}:${port}`);
});
