import store from "@/client/app/store";
import { Story as StoryModel } from "@/models/story";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Story from "./story.vue";
import { StoryStoreState } from "./story/types";

const { mockEventsClose, mockTimeout } = vi.hoisted(() => ({
	mockEventsClose: vi.fn(),
	mockTimeout: vi.fn(),
}));

class EventSourceMock {
	addEventListener = vi.fn();
	close = mockEventsClose;
}

const storyMock = {
	id: "1",
	owner: "1",
	created: 1234567890,
	scale: "Fibonacci",
	revealed: false,
	title: "Test",
	votes: [],
} as StoryModel;

vi.mock("@/client/app/remult", () => ({
	default: {
		repo: () => ({
			count: () => "count",
			findId: () => storyMock,
		}),
	},
}));
vi.mock("@/client/app/router", () => ({
	default: { currentRoute: { value: { params: { story: 1 } } } },
}));
vi.mock("@/models/story", () => ({ Story: "Story" }));
vi.mock("@/models/vote", () => ({ Vote: "Vote" }));

describe("Story view", () => {
	let story: VueWrapper;

	beforeEach(() => {
		vi.stubGlobal("EventSource", EventSourceMock);
		vi.stubGlobal("setTimeout", mockTimeout);
		store.registerModule("dialogs", {
			actions: {
				alert: () => {},
				close: () => {},
			},
		});
		story = shallowMount(Story, { global: { plugins: [store] } });
	});

	afterEach(() => {
		story?.unmount();
		store.unregisterModule("dialogs");
		vi.clearAllMocks();
		vi.unstubAllGlobals();
	});

	it.each([["Actions"], ["Estimate"], ["Participants"]])(
		"has %s component",
		(name) => {
			expect(story.findComponent(`${name.toUpperCase()}-STUB`).exists()).toBe(
				true,
			);
		},
	);

	it("registers story module", () => {
		expect(store.hasModule("story")).toBe(true);
	});

	it("connects EventSource on mount", () => {
		const storyState = (story.vm.$store.state as unknown as StoryStoreState)
			.story;

		expect(storyState.events).toBeInstanceOf(EventSourceMock);
	});

	it("loads story on mount", () => {
		const storyState = (story.vm.$store.state as unknown as StoryStoreState)
			.story;

		expect(storyState.story).toEqual(storyMock);
	});

	it("disconnects after timeout", async () => {
		store.commit("events", new EventSourceMock());
		story.unmount();
		story = shallowMount(Story, { global: { plugins: [store] } });
		await story.vm.$nextTick();

		expect(mockTimeout).toHaveBeenCalled();

		await mockTimeout.mock.lastCall![0]();

		expect(mockEventsClose).toHaveBeenCalled();
	});

	it("reconnects when timeout modal is closed", async () => {
		let rejoin = false;
		store.subscribeAction((o) => {
			if (o.type !== "story.join") return;
			rejoin = true;
		});

		store.dispatch("close", "paused");
		await story.vm.$nextTick();

		expect(rejoin).toBe(true);
	});
});
