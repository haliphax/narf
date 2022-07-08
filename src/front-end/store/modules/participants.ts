import { State } from "vue";
import { Module } from "vuex";

export type participant = {
  id: string,
  name: string,
  value?: string | null,
};

export interface participantsState {
  people: Record<string, participant>,
};

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
