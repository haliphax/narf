import { createStore } from 'vuex';

type participantData = {
  name: string,
};

type storeData = {
  participants: Array<participantData>,
  storyTitle: string | null,
};

const store = createStore({
  mutations: {
    participants(state: storeData, payload: Array<participantData>) {
      state.participants = payload;
    },
    storyTitle(state: storeData, payload: string) {
      state.storyTitle = payload;
    }
  },
  state(): storeData {
    return {
      participants: [],
      storyTitle: null,
    };
  },
});

export default store;
