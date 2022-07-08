import { State } from 'vue';
import { Module } from 'vuex';
export interface storyState {
  title: string,
};

export const storyModule: Module<storyState, State> = {
  mutations: {
    storyTitle(state, payload: string) {
      state.title = payload;
    },
  },
  state(): storyState {
    return {
      title: '',
    };
  },
};
