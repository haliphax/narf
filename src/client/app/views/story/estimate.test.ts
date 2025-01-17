import store from "@/client/app/store";
import scales from "@/scales";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Estimate from "./estimate.vue";
import PieChart from "./piechart.vue";
import { StoryStoreState } from "./types";

vi.mock("uuid", () => ({ v4: () => "test" }));

describe("Estimate component", () => {
	const mockVote = {
		participantId: "test",
		participantName: "User",
		storyId: "test",
		vote: "1",
	};
	const mockStory = {
		id: "test",
		scale: "Fibonacci",
		votes: [mockVote],
	};
	let estimate: VueWrapper;

	beforeEach(() => {
		store.registerModule("story", {
			actions: { "story.vote"() {} },
			mutations: {
				story(state, payload) {
					(state as StoryStoreState).story = payload;
				},
			},
			state() {
				return { story: mockStory };
			},
		});

		estimate = shallowMount(Estimate, { global: { plugins: [store] } });
	});

	afterEach(() => {
		estimate.unmount();
		store.unregisterModule("story");
		vi.clearAllMocks();
	});

	it("creates buttons for voting options", () => {
		const opts = scales.get("Fibonacci");
		const buttons = estimate.findAll("button");

		for (const button of buttons) {
			expect(opts).toContain(button.text().trim());
		}
	});

	it.each([
		// name, revealed, component exists
		["hides pie chart if story is not revealed", false, false],
		["shows pie chart if story is revealed", true, true],
	])("%s", async (_name, revealed, expected) => {
		store.commit("story", { ...mockStory, revealed });
		await estimate.vm.$nextTick();

		expect(estimate.findComponent(PieChart).exists()).toBe(expected);
	});

	it("commits proper vote object on button click", async () => {
		let payload: {
			participantId: string;
			participantName: string;
			storyId: string;
			vote: string;
		};
		store.subscribeAction((o) => {
			if (o.type !== "story.vote") return;
			payload = o.payload;
		});
		store.commit("story", {
			...mockStory,
			votes: [],
		});
		await estimate.vm.$nextTick();

		estimate.findAll("button")[0].trigger("click");
		await estimate.vm.$nextTick();

		expect(payload!).toEqual({
			participantId: "test",
			participantName: "User",
			storyId: "test",
			vote: "1",
		});
	});
});
