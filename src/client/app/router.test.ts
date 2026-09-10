import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("router", () => {
	let mockCreateRouter: ReturnType<typeof vi.fn>;
	let mockCreateHistory: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.resetModules();

		mockCreateRouter = vi.fn();
		mockCreateHistory = vi.fn(() => "mockCreateHistory");

		vi.doMock("vue", () => ({ Component: "Component" }));
		vi.doMock("vue-router", () => ({
			createRouter: mockCreateRouter,
			createWebHistory: mockCreateHistory,
		}));
		vi.doMock("./views/home.vue", () => ({ default: "Home" }));
		vi.doMock("./views/story.vue", () => ({ default: "Story" }));

		await import("./router");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("creates a router instance", () => {
		expect(mockCreateRouter).toHaveBeenCalled();
	});

	it("uses web history", () => {
		expect(mockCreateHistory).toHaveBeenCalled();
		expect(mockCreateRouter.mock.lastCall![0].history).toBe("mockCreateHistory");
	});

	it("assigns routes for main views", () => {
		const routes: { component: unknown }[] = mockCreateRouter.mock.lastCall![0].routes;
		const components = routes.map((c) => c.component);

		expect(components).toContain("Home");
		expect(components).toContain("Story");
	});
});
