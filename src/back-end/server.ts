import { UserInfo } from "remult";
import { remultExpress } from "remult/remult-express";
import { createKnexDataProvider } from "remult/remult-knex";
import { v4 } from "uuid";
import { Story } from "../models/story";
import { Vote } from "../models/vote";
import scales from "../scales";

const server = remultExpress({
	entities: [Story, Vote],
	dataProvider: createKnexDataProvider({
		client: "sqlite3",
		connection: {
			filename: "./db/narf.sqlite3",
		},
	}),
	async getUser(request) {
		const user =
			"narfClient" in (request.cookies ?? {})
				? ({ id: request.cookies.narfClient } as UserInfo)
				: undefined;

		return await new Promise((resolve) => resolve(user));
	},
	async initApi(remult) {
		const storyRepo = remult.repo(Story);

		if ((await storyRepo.count()) === 0) {
			const [scale, opts] = scales.entries().next().value as [string, string[]];

			const story = await storyRepo.insert({
				id: v4().replace(/[^-]/g, "0"),
				owner: "test",
				title: "Testing this thing",
				scale,
			});
			await remult.repo(Vote).insert({
				participantId: "test",
				participantName: "Test Participant",
				storyId: story.id,
				vote: opts[0],
			});
		}
	},
});

export default server;
