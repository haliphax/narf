import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import { Vote } from "../../../models/vote";
import server from "../../server";
import { updateStory } from "./events";

/** join voting participants for story room */
const join = (app: Application) =>
	app.post("/story/:story/join", server.withRemult, async (req, res, next) => {
		if (!remult.user) {
			res.sendStatus(403);
			return;
		}

		const storyId = req.params.story;
		const story = await remult.repo(Story).findId(storyId);

		if (!story) {
			res.sendStatus(400);
			return;
		}

		console.log(`User ${remult.user.id} joining ${storyId}`);

		try {
			if (!story._votes?.find((v) => v.participantId === remult.user?.id)) {
				await remult.repo(Vote).insert({
					participantId: req.body.id,
					participantName: req.body.name,
					storyId,
					vote: null,
				});
			}

			const updatedStory = await remult
				.repo(Story)
				.findId(storyId, { useCache: false });

			if (!updatedStory) {
				throw new Error("No story");
			}

			updateStory(updatedStory);
			res.sendStatus(204);
		} catch (ex) {
			next(ex);
		}
	});

export default join;
