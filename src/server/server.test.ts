import { Story } from "@/models/story";
import { Vote } from "@/models/vote";
import { remultExpress } from "remult/remult-express";
import { createKnexDataProvider } from "remult/remult-knex";
import { beforeEach, describe, expect, it, vi } from "vitest";
import cronjobs from "./cronjobs";

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
vi.mock("@/models/story", () => ({ Story: 0 }));
vi.mock("@/models/vote", () => ({ Vote: 1 }));
vi.mock("./cronjobs", () => ({ default: { start: vi.fn() } }));

await import("./server");

describe("server", async () => {
	it("creates a knex data provider", () => {
		expect(createKnexDataProvider).toHaveBeenCalled();
	});

	it.each([
		// name, args partial
		["provides entities", { entities: [Story, Vote] }],
		["provides getUser method", { getUser: expect.anything() }],
		["provides initApi method", { initApi: expect.anything() }],
	])("%s", (_name, expected) => {
		expect(remultExpress).toHaveBeenCalledWith(
			expect.objectContaining(expected),
		);
	});

	describe("getUser", () => {
		it.each([
			// name, mock request data, expected user.id
			[
				"returns user from cookie if present",
				{ cookies: { narfClient: "test" } },
				"test",
			],
			["returns undefined if id not in cookie", { cookies: {} }, undefined],
			["returns undefined if no cookies", {}, undefined],
		])("%s", async (_name, req, expected) => {
			const user = await mockExpress.mock.lastCall![0].getUser(req);

			expect(user?.id).toBe(expected);
		});
	});

	describe("initApi", () => {
		beforeEach(async () => await mockExpress.mock.lastCall![0].initApi());

		it("creates index on vote compound key", async () => {
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

		it("starts cronjobs", async () => {
			expect(cronjobs.start).toHaveBeenCalled();
		});
	});
});
