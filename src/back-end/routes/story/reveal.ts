import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import server from "../../server";
import { updateStory } from "./events";

/** reveal votes for story room */
const reveal = (app: Application) =>
	app.post("/story/:story/reveal", server.withRemult, async (r, s) => {
		const story = r.params.story;

		console.log(`Revealing ${story}`);

		const updatedStory = await remult
			.repo(Story)
			.update(story, { revealed: true });

		if (!updatedStory) {
			throw new Error("No story");
		}

		s.sendStatus(202);
		updateStory(updatedStory);
	});

export default reveal;
