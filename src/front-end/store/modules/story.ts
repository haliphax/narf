import { ActionContext, Module } from 'vuex';
import { estimate, participant, storyState } from '../../types';
import { State } from 'vue';

export const storyModule: Module<storyState, State> = {
  actions: {
    estimate(ctx: ActionContext<storyState, State>, payload: estimate) {
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
    reveal(ctx: ActionContext<storyState, State>) {
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
