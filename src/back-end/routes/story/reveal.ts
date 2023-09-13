import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import server from "../../server";
import { updateStory } from "./events";

const reveal = (app: Application) =>
	app.post("/story/:story/reveal", server.withRemult, async (r, s) => {
		const story = r.params.story;

		console.log(`Revealing ${story}`);
		await remult.repo(Story).update(story, { revealed: true });
		s.sendStatus(202);

		const updatedStory = await remult.repo(Story).findId(story);

		if (!updatedStory) {
			throw new Error("No story");
		}

		updateStory(updatedStory);
	});

export default reveal;
