import { Application } from "express";
import { beforeEach, describe, it, vi } from "vitest";
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

	it("attaches route handlers", ({ expect }) => {
		routes(mockApp);
		expect(mockEvents).toHaveBeenCalledWith(mockApp);
	});
});
