import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import server from "../../server";

/** create a new story room */
const create = (app: Application) =>
	app.put("/story", server.withRemult, async (req, res, next) => {
		if (!remult.user) {
			res.sendStatus(403);
			return;
		}

		console.log(`Creating new story: ${req.body.title}`);

		try {
			const story = await remult.repo(Story).insert({
				scale: req.body.scale,
				title: req.body.title,
				owner: remult.user.id,
			});

			res.json({ id: story.id });
		} catch (ex) {
			next(ex);
		}
	});

export default create;
