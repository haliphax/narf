import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import server from "../../server";

/** create a new story room */
const create = (app: Application) =>
	app.put("/story", server.withRemult, async (r, s) => {
		if (!remult.user) {
			s.sendStatus(403);
			return;
		}

		console.log(`Creating new story: ${r.body.title}`);

		const story = await remult.repo(Story).insert({
			scale: r.body.scale,
			title: r.body.title,
			owner: remult.user.id,
		});

		s.json({ id: story.id });
	});

export default create;
