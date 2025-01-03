import store from "@/front-end/app/store";
import { Story as StoryModel } from "@/models/story";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import Story from "./story.vue";
import { StoryStoreState } from "./story/types";

class EventSourceMock {
	addEventListener = () => {};
	close = () => {};
}

const storyMock = vi.mocked({
	id: "1",
	owner: "1",
	created: 1234567890,
	scale: "Fibonacci",
	revealed: false,
	title: "Test",
	votes: [],
}) as StoryModel;

vi.mock("@/front-end/app/remult", () => ({
	default: {
		repo: () => ({
			count: () => {},
			findId: () => storyMock,
		}),
	},
}));
vi.mock("@/front-end/app/router", () => ({
	default: { currentRoute: { value: { params: { story: 1 } } } },
}));

describe("Story view", () => {
	let story: VueWrapper;

	beforeEach(() => {
		vi.stubGlobal("EventSource", EventSourceMock);
		story = shallowMount(Story, { global: { plugins: [store] } });
	});

	afterEach(() => {
		story?.unmount();
		vi.clearAllMocks();
		vi.unstubAllGlobals();
	});

	it("has Actions component", ({ expect }) => {
		expect(story.findComponent("ACTIONS-STUB").exists()).toBe(true);
	});

	it("has Estimate component", ({ expect }) => {
		expect(story.findComponent("ESTIMATE-STUB").exists()).toBe(true);
	});

	it("has Participants component", ({ expect }) => {
		expect(story.findComponent("PARTICIPANTS-STUB").exists()).toBe(true);
	});

	it("connects EventSource on mount", ({ expect }) => {
		const storyState = (story.vm.$store.state as unknown as StoryStoreState)
			.story;

		expect(storyState.events).toBeInstanceOf(EventSourceMock);
	});

	it("loads story on mount", ({ expect }) => {
		const storyState = (story.vm.$store.state as unknown as StoryStoreState)
			.story;

		expect(storyState.story).toEqual(storyMock);
	});
});
