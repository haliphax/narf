import { afterEach, describe, expect, it, vi } from "vitest";
import { task } from "./purge";

const { mockDelete, mockWhere } = vi.hoisted(() => ({
	mockDelete: vi.fn(),
	mockWhere: vi.fn(() => ({
		delete: mockDelete,
		select: () => [{ id: 1234 }],
	})),
}));

vi.mock("knex", () => ({ default: () => () => ({ where: mockWhere }) }));
vi.mock("node-cron", () => ({ schedule: () => {} }));

describe("purge cronjob", async () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("deletes expired stories and associated votes", async () => {
		await task(new Date());

		expect(mockWhere).toHaveBeenCalledWith("storyId", 1234);
		expect(mockWhere).toHaveBeenCalledWith("id", 1234);
		expect(mockDelete).toHaveBeenCalledTimes(2);
	});

	it("runs on init", async () => {
		await task("init");

		expect(mockDelete).toHaveBeenCalledTimes(2);
	});
});
