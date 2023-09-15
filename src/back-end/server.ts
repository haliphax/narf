import { UserInfo } from "remult";
import { remultExpress } from "remult/remult-express";
import { createKnexDataProvider } from "remult/remult-knex";
import { Story } from "../models/story";
import { Vote } from "../models/vote";

const server = remultExpress({
	entities: [Story, Vote],
	dataProvider: createKnexDataProvider({
		client: "sqlite3",
		connection: {
			filename: "./db/narf.sqlite3",
		},
		useNullAsDefault: true,
	}),
	async getUser(request) {
		const user =
			"narfClient" in (request.cookies ?? {})
				? ({ id: request.cookies.narfClient } as UserInfo)
				: undefined;

		return await new Promise((resolve) => resolve(user));
	},
});

export default server;
