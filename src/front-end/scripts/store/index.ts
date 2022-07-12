import { createStore } from 'vuex';
import { participantsModule } from './modules/participants';
import { sessionModule } from './modules/session';
import { storyModule } from './modules/story';

const store = createStore({
  modules: {
    participants: participantsModule,
    session: sessionModule,
    story: storyModule,
  },
});

export default store;
