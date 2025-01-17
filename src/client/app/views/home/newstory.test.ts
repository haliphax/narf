import router from "@/client/app/router";
import store from "@/client/app/store";
import scales from "@/scales";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NewStory from "./newstory.vue";

const { mockInsert } = vi.hoisted(() => ({
	mockInsert: vi.fn(() => ({ id: "test" })),
}));

vi.mock("@/client/app/remult", () => ({
	default: { repo: () => ({ insert: mockInsert }) },
}));
vi.mock("@/models/story", () => ({ Story: 1 }));
vi.mock("@/models/vote", () => ({ Vote: 2 }));
vi.mock("uuid", () => ({ v4: () => "test" }));

describe("NewStory", () => {
	let newStory: VueWrapper;

	beforeEach(() => {
		newStory = mount(NewStory, { global: { plugins: [router, store] } });
	});

	afterEach(() => {
		newStory.unmount();
	});

	it("lists scales", () => {
		const scalesArray: string[] = [];
		scales.forEach((_, k) => scalesArray.push(k));
		const data = newStory.vm.$data as { scales: string[] };

		expect(data.scales).toEqual(scalesArray);
	});

	it("updates session settings on scale change", async () => {
		expect(newStory.vm.$store.state.session.settings.scale).toBe("Fibonacci");

		(newStory.vm.$data as { scale: string }).scale = "T-shirt sizes";

		await newStory.vm.$nextTick(() => {
			expect(newStory.vm.$store.state.session.settings.scale).toBe(
				"T-shirt sizes",
			);
		});
	});

	it("creates a new record on submit", async () => {
		(newStory.vm.$data as { title: string }).title = "test";

		await newStory.get("form").trigger("submit");

		expect(mockInsert).toHaveBeenCalled();
	});
});
