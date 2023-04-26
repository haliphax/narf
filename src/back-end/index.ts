import cors from "cors";
import express from "express";
import { remultExpress } from "remult/remult-express";
// models
import Participant from "../models/participant";
import Story from "../models/story";
import Vote from "../models/vote";

const host = process.env.host ?? "localhost";
const port = parseInt(process.env.port ?? "3001");

const app = express();

if (host === "localhost") app.use(cors({ origin: "*" }));

app.use(express.static("dist/front-end"));
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
app.listen(port, host, () => {
	console.log(`Server listening at http://${host}:${port}`);
});
