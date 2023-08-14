import { Module } from "vuex";
import { Story } from "../../../models/story";
import { Vote } from "../../../models/vote";
import remult from "../remult";
import router from "../router";
import { StoreState, StoryState } from "../types";

const story: Module<StoryState | Promise<StoryState>, StoreState> = {
	actions: {
		async "story.load"(ctx) {
			const story = await remult
				.repo(Story)
				.findId(router.currentRoute.value.params.story as string, {
					useCache: false,
				});
			ctx.commit("story", story);
		},
		async "story.reveal"(ctx) {
			const state = ctx.state as StoryState;

			if (!state.story) {
				return;
			}

			await fetch(`/reveal/${state.story.id}`, { method: "POST" });
		},
		async "story.vote"(ctx, payload: Vote) {
			const state = ctx.state as StoryState;

			if (!state.story) {
				return;
			}

			await fetch(`/vote/${state.story.id}`, {
				body: JSON.stringify(payload),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});
		},
	},
	mutations: {
		story(state, payload: Story) {
			const storyState = state as StoryState;

			if (storyState.story?.id !== payload.id) {
				storyState.events = new EventSource(`/story/${payload.id}/events`);
				storyState.events?.addEventListener("message", (ev: MessageEvent) => {
					console.log("Story update", ev.data);
					storyState.story = JSON.parse(ev.data);
				});
			}

			storyState.story = payload;
		},
	},
	state() {
		return {
			events: null,
			story: null,
		} as StoryState;
	},
};

export default story;
