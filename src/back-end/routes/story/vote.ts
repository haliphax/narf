import { Application } from "express";
import { remult } from "remult";
import { Story } from "../../../models/story";
import { Vote } from "../../../models/vote";
import server from "../../server";
import { updateStory } from "./events";

/** Route for accepting a vote submission for a story */
const vote = (app: Application) => {
	app.put("/story/:story/vote", server.withRemult, async (r, s) => {
		console.log(`Incoming vote for ${r.params.story}`);

		const vote = r.body;
		const story = await remult.repo(Story).findId(r.params.story);

		if (!story) {
			throw new Error("No such story");
		}

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
		await remult.repo(Story).update(r.params.story, story);
		s.sendStatus(201);
		updateStory(story);
	});
};

export default vote;
