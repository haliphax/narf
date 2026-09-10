import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("server", () => {
	let mockDb: { raw: ReturnType<typeof vi.fn> };
	let mockExpress: ReturnType<typeof vi.fn>;
	let mockCreateKnex: ReturnType<typeof vi.fn>;
	let mockCronStart: ReturnType<typeof vi.fn>;
	const mockStory = 0;
	const mockVote = 1;

	beforeEach(async () => {
		vi.resetModules();

		mockDb = { raw: vi.fn() };
		mockExpress = vi.fn();
		mockCreateKnex = vi.fn();
		mockCronStart = vi.fn();

		vi.doMock("remult", () => ({
			dbNamesOf: () => ({ $entityName: "test" }),
		}));
		vi.doMock("remult/remult-express", () => ({
			remultExpress: mockExpress,
		}));
		vi.doMock("remult/remult-knex", () => ({
			createKnexDataProvider: mockCreateKnex,
			KnexDataProvider: { getDb: () => mockDb },
		}));
		vi.doMock("@/models/story", () => ({ Story: mockStory }));
		vi.doMock("@/models/vote", () => ({ Vote: mockVote }));
		vi.doMock("./cronjobs", () => ({ default: { start: mockCronStart } }));

		await import("./server");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("creates a knex data provider", () => {
		expect(mockCreateKnex).toHaveBeenCalled();
	});

	it.each([
		["provides entities", { entities: [mockStory, mockVote] }],
		["provides getUser method", { getUser: expect.anything() }],
		["provides initApi method", { initApi: expect.anything() }],
	])("%s", (_name, expected) => {
		expect(mockExpress).toHaveBeenCalledWith(expect.objectContaining(expected));
	});

	describe("getUser", () => {
		it.each([
			["returns user from cookie if present", { cookies: { narfClient: "test" } }, "test"],
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
				.replace(/\r\n|\n|\t+/g, " ")
				.replace(/ +/g, " ")
				.replace(/^\s|\s$/g, "");

			expect(query).toEqual(
				"create unique index if not exists idx_vote_compound_key " +
					"on test (participantId, storyId)",
			);
		});

		it("starts cronjobs", async () => {
			expect(mockCronStart).toHaveBeenCalled();
		});
	});
});
