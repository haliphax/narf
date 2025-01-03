import router from "@/front-end/app/router";
import store from "@/front-end/app/store";
import scales from "@/scales";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import NewStory from "./newstory.vue";

const { mockInsert } = vi.hoisted(() => ({
	mockInsert: vi.fn(() => ({ id: "test" })),
}));

vi.mock("@/front-end/app/remult", () => ({ default: vi.fn() }));
vi.mock("@/models/story", () => ({ Story: 1 }));
vi.mock("@/models/vote", () => ({ Vote: 2 }));
vi.mock("remult", () => ({ remult: { repo: () => ({ insert: mockInsert }) } }));
vi.mock("uuid", () => ({ v4: () => "test" }));

describe("NewStory", () => {
	let newStory: VueWrapper;

	beforeEach(() => {
		newStory = mount(NewStory, { global: { plugins: [router, store] } });
	});

	afterEach(() => {
		newStory.unmount();
	});

	it("lists scales", ({ expect }) => {
		const scalesArray: string[] = [];
		scales.forEach((_, k) => scalesArray.push(k));
		const data = newStory.vm.$data as { scales: string[] };

		expect(data.scales).toEqual(scalesArray);
	});

	it("updates session settings on scale change", async ({ expect }) => {
		expect(newStory.vm.$store.state.session.settings.scale).toBe("Fibonacci");

		(newStory.vm.$data as { scale: string }).scale = "T-shirt sizes";

		await newStory.vm.$nextTick(() => {
			expect(newStory.vm.$store.state.session.settings.scale).toBe(
				"T-shirt sizes",
			);
		});
	});

	it("creates a new record on submit", async ({ expect }) => {
		(newStory.vm.$data as { title: string }).title = "test";

		await newStory.get("form").trigger("submit");

		expect(mockInsert).toHaveBeenCalled();
	});
});
