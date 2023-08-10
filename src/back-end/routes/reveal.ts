import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../models/story";
import server from "../server";
import { updateStory } from "./story-sse";

const reveal = (app: Application) =>
	app.post("/reveal/:story", server.withRemult, async (r, s) => {
		const story = r.params.story;

		console.log(`Revealing ${story}`);
		await remult.repo(Story).update(story, { revealed: true });
		s.sendStatus(202);

		const storyObject = await remult.repo(Story).findId(story);

		if (!storyObject) {
			throw new Error("No story");
		}

		updateStory(storyObject);
	});

export default reveal;
