import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import server from "../../server";
import { updateStory } from "./events";

/** join voting participants for story room */
const join = (app: Application) =>
	app.post("/story/:story/join", server.withRemult, async (r, s) => {
		if (!remult.user) {
			s.sendStatus(403);
			return;
		}

		const storyId = r.params.story;
		const story = await remult.repo(Story).findId(storyId);

		if (!story) {
			s.sendStatus(400);
			return;
		}

		console.log(`User ${remult.user.id} joining ${storyId}`);

		if (!story._votes?.find((v) => v.participant.id === remult.user?.id)) {
			if (!story._votes) story._votes = [];

			story._votes.push({
				participant: r.body,
				vote: null,
			});

			await remult.repo(Story).update(story.id, story);
		}

		const updatedStory = await remult.repo(Story).findId(storyId);

		if (!updatedStory) {
			throw new Error("No story");
		}

		updateStory(updatedStory);
		s.sendStatus(204);
	});

export default join;
