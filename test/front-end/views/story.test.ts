import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import store from "../../../src/front-end/scripts/store";
import Story from "../../../src/front-end/scripts/views/story.vue";
import { Story as StoryModel } from "../../../src/models/story";
import { EventSourceMock } from "../mocks";

const storyMock = new StoryModel();
storyMock.id = "1";
storyMock.owner = "1";
storyMock.scale = "Fibonacci";
storyMock.title = "Test";
storyMock.votes = [];

describe("Story view", () => {
	let story: VueWrapper;

	const mountStory = () =>
		shallowMount<typeof Story>(Story, { global: { plugins: [store] } });

	beforeEach(() => {
		vi.stubGlobal("EventSource", EventSourceMock);
		vi.mock("../../../src/front-end/scripts/remult", () => ({
			default: {
				repo: vi.fn(() => ({
					count: vi.fn(),
					findId: vi.fn(() => storyMock),
				})),
			},
		}));
		vi.mock("../../../src/front-end/scripts/router", () => ({
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

		story = mountStory();
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
