import { createStore } from 'vuex';
import participantsModule from './modules/participants';
import sessionModule from './modules/session';
import { storeState } from '../types';
import storyModule from './modules/story';

const store = createStore<storeState>({
	modules: {
		participants: participantsModule,
		session: sessionModule,
		story: storyModule,
	},
});

export default store;
