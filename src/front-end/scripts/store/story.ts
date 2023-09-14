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

			await fetch(`${ROOT_URI}story/${storyId}/join`, {
				body: JSON.stringify({
					id: ctx.rootState.session.id,
					name: ctx.rootState.session.name,
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
		},
		async "story.load"(ctx) {
			const firstLoad = !(ctx.state as StoryState).events;

			if (firstLoad) await ctx.dispatch("story.join");

			const story = await remult
				.repo(Story)
				.findId(router.currentRoute.value.params.story as string, {
					useCache: false,
				});

			if (firstLoad) {
				const events = new EventSource(`${ROOT_URI}story/${story.id}/events`);

				events.addEventListener("message", () => {
					console.log("Story update received");
					ctx.dispatch("story.load");
				});

				ctx.commit("events", events);
			}

			ctx.commit("story", story);
		},
		async "story.reveal"(ctx) {
			const state = ctx.state as StoryState;

			if (!state.story) {
				return;
			}

			await fetch(`${ROOT_URI}story/${state.story.id}/reveal`, {
				method: "POST",
			});
		},
		async "story.vote"(ctx, payload: Vote) {
			const state = ctx.state as StoryState;

			if (!state.story) {
				return;
			}

			await fetch(`${ROOT_URI}story/${state.story.id}/vote`, {
				body: JSON.stringify(payload),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});
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
