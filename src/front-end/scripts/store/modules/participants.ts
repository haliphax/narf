import { Module } from 'vuex';
import { participant, participantsState } from '../../types';

export const participantsModule: Module<participantsState, any> = {
  mutations: {
    'participants.people'(
      state: participantsState,
      payload: Record<string, participant>,
    ) {
      state.people = payload;
    },
  },
  state(): participantsState {
    return { people: {} };
  },
};
