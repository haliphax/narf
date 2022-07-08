import { createStore } from 'vuex';
import { participantsModule } from './modules/participants';
import { storyModule } from './modules/story';

const store = createStore({
  modules: {
    participants: participantsModule,
    story: storyModule,
  },
});

export default store;
