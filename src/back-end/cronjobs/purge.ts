import knex from "knex";
import { schedule } from "node-cron";

const THIRTY_DAYS = 60 * 60 * 24 * 30 * 1000;

const purge = schedule(
	"0 0 * * *",
	async (now) => {
		const db = knex({
			client: "sqlite3",
			connection: {
				filename: "./db/narf.sqlite3",
			},
			useNullAsDefault: true,
		});
		const threshold =
			(typeof now == "string" ? new Date() : (now as Date)).valueOf() -
			THIRTY_DAYS;
		console.log(`Purging expired stories < ${threshold}`);

		const rows = await db("story")
			.where("created", "<", threshold)
			.select("id");

		for (const row of rows) {
			await db("vote").where("storyId", row.id).delete();
			await db("story").where("id", row.id).delete();
		}
	},
	{ runOnInit: true },
);

export default purge;
