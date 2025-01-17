import { Application } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import routes from "./index";

const { mockEvents } = vi.hoisted(() => ({ mockEvents: vi.fn() }));
vi.mock("./events", () => ({ events: mockEvents }));

describe("routes index", () => {
	let mockApp: Application;

	beforeEach(() => {
		mockApp = vi.mocked({} as Express.Application, {
			partial: true,
		}) as Application;
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("attaches route handlers", () => {
		routes(mockApp);
		expect(mockEvents).toHaveBeenCalledWith(mockApp);
	});
});
