import { State } from "vue";
import { Module } from "vuex";
import { participant, participantsState } from "../../types";

export const participantsModule: Module<participantsState, State> = {
  mutations: {
    'participants.people'(
      state: participantsState,
      payload: Record<string, participant>,
    ) {
      state.people = payload;
    },
  },
  state(): participantsState {
    return {
      people: {},
    };
  },
};
