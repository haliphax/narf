import store from "@/front-end/app/store";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import storyModule from "./module";

const {
	mockAddEventListener,
	mockClose,
	mockCount,
	mockFindId,
	mockInsert,
	mockUpdate,
	mockSave,
} = vi.hoisted(() => ({
	mockAddEventListener: vi.fn(),
	mockClose: vi.fn(),
	mockCount: vi.fn(),
	mockFindId: vi.fn(),
	mockInsert: vi.fn(),
	mockUpdate: vi.fn(),
	mockSave: vi.fn(),
}));

class EventSourceMock {
	addEventListener = mockAddEventListener;
	close = mockClose;
}

vi.mock("@/front-end/app/remult", () => ({
	default: {
		repo: () => ({
			count: mockCount,
			findId: mockFindId,
			insert: mockInsert,
			update: mockUpdate,
			save: mockSave,
		}),
	},
}));
vi.mock("@/front-end/app/router", () => ({
	default: { currentRoute: { value: { params: { story: 1 } } } },
}));

describe("story module", () => {
	beforeEach(() => {
		vi.stubGlobal("EventSource", EventSourceMock);
		store.registerModule("story", storyModule);
	});

	afterEach(() => {
		store.unregisterModule("story");
		vi.unstubAllGlobals();
	});

	it("spawns message listener on join", async ({ expect }) => {
		await store.dispatch("story.join");

		expect(mockAddEventListener).toHaveBeenCalledWith(
			"message",
			expect.anything(),
		);
	});

	it("inserts partial vote on first join", async ({ expect }) => {
		mockCount.mockImplementation(() => 0);
		await store.dispatch("story.join");

		expect(mockInsert).toHaveBeenCalledWith({
			participantId: expect.anything(),
			participantName: expect.anything(),
			storyId: 1,
		});
	});

	it("dispatches story.load on new message", async ({ expect }) => {
		let load = false;
		store.subscribeAction((o) => {
			if (o.type !== "story.load") return;
			load = true;
		});

		await store.dispatch("story.join");
		await mockAddEventListener.mock.lastCall![1]();

		expect(load).toBe(true);
	});

	it("closes EventSource on load if revealed", async ({ expect }) => {
		store.commit("events", new EventSourceMock());
		mockFindId.mockImplementationOnce(() => ({ revealed: true }));

		await store.dispatch("story.load");

		expect(mockClose).toHaveBeenCalled();
	});

	it("sets revealed=true on reveal", async ({ expect }) => {
		store.commit("story", { id: "test" });
		await store.dispatch("story.reveal");

		expect(mockUpdate).toHaveBeenCalledWith("test", { revealed: true });
	});

	it("saves record on vote", async ({ expect }) => {
		store.commit("story", 1);

		await store.dispatch("story.vote", "test");

		expect(mockSave).toHaveBeenCalledWith("test");
	});
});
