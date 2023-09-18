import { UserInfo, dbNamesOf } from "remult";
import { remultExpress } from "remult/remult-express";
import { KnexDataProvider, createKnexDataProvider } from "remult/remult-knex";
import { Story } from "../models/story";
import { Vote } from "../models/vote";
import cronjobs from "./cronjobs";

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
	async initApi() {
		// add a unique index that will serve in place of a compound primary key
		const db = KnexDataProvider.getDb();
		const table = (await dbNamesOf(Vote)).$entityName;

		await db.raw(`
			create unique index if not exists
			idx_vote_compound_key
			on ${table} (participantId, storyId)
		`);
		cronjobs.start();
	},
});

export default server;
