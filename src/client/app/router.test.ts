import { describe, expect, it, vi } from "vitest";
import Home from "./views/home.vue";
import Story from "./views/story.vue";

const { mockCreateRouter, mockCreateHistory } = vi.hoisted(() => ({
	mockCreateRouter: vi.fn(),
	mockCreateHistory: vi.fn(() => "mockCreateHistory"),
}));

vi.mock("vue", () => ({ Component: "Component" }));
vi.mock("vue-router", () => ({
	createRouter: mockCreateRouter,
	createWebHistory: mockCreateHistory,
}));
vi.mock("./views/home.vue", () => ({ default: "Home" }));
vi.mock("./views/story.vue", () => ({ default: "Story" }));

await import("./router");

describe("router", () => {
	it("creates a router instance", () => {
		expect(mockCreateRouter).toHaveBeenCalled();
	});

	it("uses web history", () => {
		expect(mockCreateHistory).toHaveBeenCalled();
		expect(mockCreateRouter.mock.lastCall![0].history).toBe(
			"mockCreateHistory",
		);
	});

	it("assigns routes for main views", () => {
		const routes: { component: unknown }[] =
			mockCreateRouter.mock.lastCall![0].routes;
		const components = routes.map((c) => c.component);

		expect(components).toContain(Home);
		expect(components).toContain(Story);
	});
});
