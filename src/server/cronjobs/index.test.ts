import { describe, expect, it, vi } from "vitest";
import cronjobs from "./index";

const { mockPurge } = vi.hoisted(() => ({
	mockPurge: { start: vi.fn(), stop: vi.fn() },
}));

vi.mock("./purge", () => ({ default: mockPurge }));

describe("cronjobs index", () => {
	it("is configured with cronjobs", () => {
		expect(cronjobs.jobs).toContain(mockPurge);
	});

	it("starts all cronjobs", () => {
		cronjobs.start();

		expect(mockPurge.start).toHaveBeenCalled();
	});

	it("stops all cronjobs", () => {
		cronjobs.stop();

		expect(mockPurge.stop).toHaveBeenCalled();
	});
});
