import store from "@/client/app/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";
import Participants from "./participants.vue";

describe("Participants", () => {
	let participants: VueWrapper;
	const mockVotes = [
		{
			participantId: "test",
			participantName: "Test 1",
			vote: "1",
		},
		{
			participantId: "test2",
			participantName: "Test 2",
			vote: "2",
		},
	];

	beforeEach(() => {
		store.commit("session", { id: "test" });

		store.registerModule("story", {
			mutations: {
				story(state, payload) {
					(state as { story: unknown }).story = payload;
				},
			},
			state() {
				return {
					story: { votes: mockVotes },
				};
			},
		});

		participants = mount(Participants, { global: { plugins: [store] } });
	});

	afterEach(() => {
		store.unregisterModule("story");
		participants.unmount();
	});

	it("lists participants", ({ expect }) => {
		const votes = participants.findAll("li");

		expect(votes.length).toBe(mockVotes.length);
	});

	it("shows icon when vote is missing", async ({ expect }) => {
		store.commit("story", {
			votes: [...mockVotes, { participantName: "Test 3" }],
		});
		await participants.vm.$nextTick();

		const voteSpans = participants
			.findAll("span")
			.filter(
				(v) =>
					v.attributes().title === "has not voted" &&
					v.text().trim().includes("⏱️"),
			);

		expect(voteSpans.length).toBe(1);
	});

	it("clears span titles on reveal", async ({ expect }) => {
		store.commit("story", { revealed: true, votes: mockVotes });
		await participants.vm.$nextTick();

		const hasTitle = participants
			.findAll("span")
			.filter((v) => v.attributes().title);

		expect(hasTitle.length).toBe(0);
	});
});
