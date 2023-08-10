import { remultExpress } from "remult/remult-express";
import { Story } from "../models/story";
import { FIBONACCI } from "../scales";

const server = remultExpress({
	entities: [Story],
	async initApi(remult) {
		const storyRepo = remult.repo(Story);

		if ((await storyRepo.count()) === 0) {
			await storyRepo.insert({
				id: "1",
				title: "Testing this thing",
				_votes: [
					{
						participant: {
							id: "test",
							name: "Test Participant",
						},
						vote: FIBONACCI[0],
					},
				],
			});
		}
	},
});

export default server;
