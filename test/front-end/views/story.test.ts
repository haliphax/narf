import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import store from "../../../src/front-end/app/store";
import Story from "../../../src/front-end/app/views/story.vue";
import { Story as StoryModel } from "../../../src/models/story";

class EventSourceMock {
	addEventListener = vi.fn();
	close = vi.fn();
}

const storyMock = new StoryModel();
storyMock.id = "1";
storyMock.owner = "1";
storyMock.scale = "Fibonacci";
storyMock.title = "Test";
storyMock.votes = [];

describe("Story view", () => {
	let story: VueWrapper;

	beforeEach(() => {
		vi.stubGlobal("EventSource", EventSourceMock);
		vi.mock("../../../src/front-end/app/remult", () => ({
			default: {
				repo: vi.fn(() => ({
					count: vi.fn(),
					findId: vi.fn(() => storyMock),
				})),
			},
		}));
		vi.mock("../../../src/front-end/app/router", () => ({
			default: {
				currentRoute: {
					value: {
						params: {
							story: 1,
						},
					},
				},
			},
		}));

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
		expect(story.vm.$store.state.story?.events).toBeInstanceOf(EventSourceMock);
	});

	it("loads story on mount", ({ expect }) => {
		expect(story.vm.$store.state.story?.story).toEqual(storyMock);
	});
});
