import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import server from "../../server";
import { updateStory } from "./events";

/** reveal votes for story room */
const reveal = (app: Application) =>
	app.post(
		"/story/:story/reveal",
		server.withRemult,
		async (req, res, next) => {
			const story = req.params.story;

			console.log(`Revealing ${story}`);

			try {
				const updatedStory = await remult
					.repo(Story)
					.update(story, { revealed: true });

				if (!updatedStory) {
					throw new Error("No story");
				}

				res.sendStatus(202);
				updateStory(updatedStory);
			} catch (ex) {
				next(ex);
			}
		},
	);

export default reveal;
