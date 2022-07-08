import { State } from "vue";
import { Module } from "vuex";

export type participant = {
  name: string,
};

export interface participantsState {
  list: Array<participant>,
};

export const participantsModule: Module<participantsState, State> = {
  mutations: {
    participants(state: participantsState, payload: Array<participant>) {
      state.list = payload;
    },
  },
  state(): participantsState {
    return {
      list: [],
    };
  },
};
