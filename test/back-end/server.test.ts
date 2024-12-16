import { remultExpress } from "remult/remult-express";
import { createKnexDataProvider } from "remult/remult-knex";
import { beforeEach, describe, it, vi } from "vitest";
import cronjobs from "../../src/back-end/cronjobs";
import { Story } from "../../src/models/story";
import { Vote } from "../../src/models/vote";

const { mockDb, mockExpress } = vi.hoisted(() => ({
	mockDb: { raw: vi.fn() },
	mockExpress: vi.fn(),
}));

vi.mock("remult", () => ({ dbNamesOf: () => ({ $entityName: "test" }) }));
vi.mock("remult/remult-express", () => ({ remultExpress: mockExpress }));
vi.mock("remult/remult-knex", () => ({
	createKnexDataProvider: vi.fn(),
	KnexDataProvider: { getDb: () => mockDb },
}));
vi.mock("../../src/back-end/cronjobs", () => ({ default: { start: vi.fn() } }));
vi.mock("../../src/models/story", () => ({ Story: 0 }));
vi.mock("../../src/models/vote", () => ({ Vote: 1 }));

await import("../../src/back-end/server");

describe("server", async () => {
	it("creates a knex data provider", ({ expect }) => {
		expect(createKnexDataProvider).toHaveBeenCalled();
	});

	it("provides Story and Vote entities", ({ expect }) => {
		expect(remultExpress).toHaveBeenCalledWith(
			expect.objectContaining({ entities: [Story, Vote] }),
		);
	});

	it("provides getUser method", ({ expect }) => {
		expect(remultExpress).toHaveBeenCalledWith(
			expect.objectContaining({ getUser: expect.anything() }),
		);
	});

	it("provides initApi method", ({ expect }) => {
		expect(remultExpress).toHaveBeenCalledWith(
			expect.objectContaining({ initApi: expect.anything() }),
		);
	});

	describe("getUser", () => {
		it("returns user from cookie if present", async ({ expect }) => {
			const user = await mockExpress.mock.lastCall![0].getUser({
				cookies: { narfClient: "test" },
			});

			expect(user.id).toBe("test");
		});

		it("returns undefined if user id not in cookie", async ({ expect }) => {
			const user = await mockExpress.mock.lastCall![0].getUser({
				cookies: {},
			});

			expect(user).toBeUndefined();
		});

		it("returns undefined if no cookies", async ({ expect }) => {
			const user = await mockExpress.mock.lastCall![0].getUser({});

			expect(user).toBeUndefined();
		});
	});

	describe("initApi", () => {
		beforeEach(async () => await mockExpress.mock.lastCall![0].initApi());

		it("creates index on vote compound key", async ({ expect }) => {
			const query = (mockDb.raw.mock.lastCall![0] as string)
				// convert newlines/tabs into spaces
				.replace(/\r\n|\n|\t+/g, " ")
				// collapse multiple spaces
				.replace(/ +/g, " ")
				// strip leading/trailing spaces
				.replace(/^\s|\s$/g, "");

			expect(query).toEqual(
				"create unique index if not exists idx_vote_compound_key " +
					"on test (participantId, storyId)",
			);
		});

		it("starts cronjobs", async ({ expect }) => {
			expect(cronjobs.start).toHaveBeenCalled();
		});
	});
});
