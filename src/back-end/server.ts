import { UserInfo } from "remult";
import { remultExpress } from "remult/remult-express";
import { v4 } from "uuid";
import { Story } from "../models/story";
import scales from "../scales";

const server = remultExpress({
	entities: [Story],
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

			await storyRepo.insert({
				id: v4().replace(/[^-]/g, "0"),
				owner: "test",
				title: "Testing this thing",
				scale,
				_votes: [
					{
						participant: {
							id: "test",
							name: "Test Participant",
						},
						vote: opts[0],
					},
				],
			});
		}
	},
});

export default server;
