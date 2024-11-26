import { Module } from "vuex";
import { Story } from "../../../models/story";
import { Vote } from "../../../models/vote";
import { ROOT_URI } from "../constants";
import remult from "../remult";
import router from "../router";
import { StoreState, StoryState } from "./types";

const story: Module<StoryState | Promise<StoryState>, StoreState> = {
	actions: {
		async "story.join"(ctx) {
			const storyId = router.currentRoute.value.params.story as string;
			const events = new EventSource(`${ROOT_URI}${storyId}/events`);

			events.addEventListener("message", async () => {
				console.log("Story update received");
				await ctx.dispatch("story.load");
			});
			ctx.commit("events", events);

			const storyRepo = remult.repo(Story);
			const voteRepo = remult.repo(Vote);
			const partial = {
				participantId: ctx.rootState.session.id,
				participantName: ctx.rootState.session.name,
				storyId,
			};

			if (
				(await storyRepo.count({ id: storyId, revealed: true })) === 0 &&
				(await voteRepo.count({
					participantId: partial.participantId,
					storyId,
				})) === 0
			) {
				await voteRepo.insert(partial);
			}

			await ctx.dispatch("story.load");
		},
		async "story.load"(ctx) {
			const story = await remult
				.repo(Story)
				.findId(router.currentRoute.value.params.story.toString(), {
					useCache: false,
				});

			console.log("Story", story);
			ctx.commit("story", story);

			if (story?.revealed) {
				ctx.rootState.story.events?.close();
			}
		},
		async "story.reveal"(ctx) {
			const state = ctx.state as StoryState;

			if (!state.story) return;

			await remult.repo(Story).update(state.story.id, { revealed: true });
		},
		async "story.vote"(ctx, payload: Vote) {
			const state = ctx.state as StoryState;

			if (!state.story) return;

			await remult.repo(Vote).save(payload);
		},
	},
	mutations: {
		events(state, payload: EventSource | undefined) {
			const storyState = state as StoryState;

			if (!payload) storyState.events?.close();

			storyState.events = payload;
		},
		story(state, payload: Story) {
			const storyState = state as StoryState;
			storyState.story = payload;
		},
	},
	state() {
		return {
			events: undefined,
			story: undefined,
		} as StoryState;
	},
};

export default story;
