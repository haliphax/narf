import { ROOT_URI } from "@/front-end/app/constants";
import remult from "@/front-end/app/remult";
import router from "@/front-end/app/router";
import { StoreState } from "@/front-end/app/store/types";
import { Story } from "@/models/story";
import { Vote } from "@/models/vote";
import { Module } from "vuex";
import { StoryState, StoryStoreState } from "./types";

const storyModule: Module<StoryState, StoreState | StoryStoreState> = {
	actions: {
		async "story.join"(ctx) {
			const rootState = ctx.rootState as StoreState;
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
				participantId: rootState.session.id,
				participantName: rootState.session.name,
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

			ctx.commit("story", story);

			if (story?.revealed) ctx.state.events?.close();
		},
		async "story.reveal"(ctx) {
			if (!ctx.state.story) return;

			await remult.repo(Story).update(ctx.state.story.id, {
				revealed: true,
			});
		},
		async "story.vote"(ctx, payload: Vote) {
			if (!ctx.state.story) return;

			await remult.repo(Vote).save(payload);
		},
	},
	mutations: {
		events(state, payload: EventSource | undefined) {
			if (!payload) state.events?.close();

			state.events = payload;
		},
		story(state, payload: Story) {
			state.story = payload;
		},
	},
	state() {
		return {
			events: undefined,
			story: undefined,
		};
	},
};

export default storyModule;
