import { ActionContext, Module } from 'vuex';
import { estimate, participant, storyState } from '../../types';

const storyModule: Module<storyState, any> = {
	actions: {
		estimate(ctx: ActionContext<storyState, any>, payload: estimate) {
			const people: Record<string, participant> =
				(ctx.rootState as any).participants.people;

			if (!people.hasOwnProperty(payload.user.id))
			{
				people[payload.user.id] = {
					id: payload.user.id,
					name: payload.user.name,
				};
			}

			people[payload.user.id].value = payload.value;
			ctx.commit('participants.people', people);
		},
		reveal(ctx: ActionContext<storyState, any>) {
			ctx.commit('story.revealed', true);
		},
	},
	mutations: {
		'story.revealed'(state: storyState, payload: boolean) {
			state.revealed = payload;
		},
		'story.title'(state: storyState, payload: string) {
			state.title = payload;
		},
	},
	state(): storyState {
		return {
			id: '',
			title: '',
			revealed: false,
		};
	},
};

export default storyModule;
