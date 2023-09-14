import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import { Vote } from "../../../models/vote";
import server from "../../server";
import { updateStory } from "./events";

/** vote on a story */
const vote = (app: Application) => {
	app.put("/story/:story/vote", server.withRemult, async (req, res, next) => {
		console.log(`Incoming vote for ${req.params.story}`);

		const vote = req.body;
		const storyRepo = remult.repo(Story);
		const story = await storyRepo.findId(req.params.story);

		if (!story) return next(new Error("No such story"));

		const voteRepo = remult.repo(Vote);

		try {
			await voteRepo.update(voteRepo.metadata.idMetadata.getId(vote), vote);
			res.sendStatus(201);

			const updatedStory = await storyRepo.findId(req.params.story, {
				useCache: false,
			});

			updateStory(updatedStory);
		} catch (ex) {
			next(ex);
		}
	});
};

export default vote;
