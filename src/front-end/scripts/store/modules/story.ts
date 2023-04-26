import { Module } from "vuex";
import Story from "../../../../models/story";
import Vote from "../../../../models/vote";
import remult from "../../remult";
import router from "../../router";
import { storeState, storyState } from "../../types";

const story: Module<storyState | Promise<storyState>, storeState> = {
	actions: {
		async "story.load"(ctx) {
			const story = await remult.repo(Story).findFirst({
				id: router.currentRoute.value.params.story,
			});

			ctx.commit("story", story);
		},
		"story.reveal"(ctx) {
			ctx.commit("story.revealed", true);
		},
		async "story.vote"(ctx, payload: Vote) {
			if (!(ctx.state as storyState).story) {
				return;
			}

			await remult
				.repo(Vote)
				.save(payload)
				.then((vote) => remult.repo(Story).findId(vote.storyId ?? ""))
				.then((story) => ctx.commit("story", story));
		},
	},
	mutations: {
		story(state, payload: Story) {
			(state as storyState).story = payload;
		},
		"story.revealed"(state, payload: boolean) {
			(state as storyState).revealed = payload;
		},
	},
	state() {
		return {
			story: null,
			revealed: false,
		} as storyState;
	},
};

export default story;
