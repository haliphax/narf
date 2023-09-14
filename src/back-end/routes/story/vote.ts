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
		const story = await remult.repo(Story).findId(req.params.story);

		if (!story) return next(new Error("No such story"));

		const votes: Vote[] = [];

		if (!story._votes) {
			votes.push(vote);
		} else {
			let updated = false;

			for (const v of story._votes) {
				if (v.participant?.id === vote.participant?.id) {
					updated = true;
					votes.push(vote);
				} else {
					votes.push(v);
				}
			}

			if (!updated) {
				votes.push(vote);
			}
		}

		story._votes = votes;

		try {
			await remult.repo(Story).update(req.params.story, story);
			res.sendStatus(201);
			updateStory(story);
		} catch (ex) {
			next(ex);
		}
	});
};

export default vote;
