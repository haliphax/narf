import store from "@/front-end/app/store";
import scales from "@/scales";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
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

	it("creates buttons for voting options", ({ expect }) => {
		const opts = scales.get("Fibonacci");
		const buttons = estimate.findAll("button");

		for (const button of buttons) {
			expect(opts).toContain(button.text().trim());
		}
	});

	it("hides pie chart if story is not revealed", ({ expect }) => {
		expect(estimate.findAllComponents(PieChart)).toHaveLength(0);
	});

	it("shows pie chart if story is revealed", async ({ expect }) => {
		store.commit("story", {
			...mockStory,
			revealed: true,
		});
		await estimate.vm.$nextTick();

		expect(estimate.findAllComponents(PieChart)).toHaveLength(1);
	});

	it("commits proper vote object on button click", async ({ expect }) => {
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
