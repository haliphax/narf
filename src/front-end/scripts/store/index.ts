import { createStore } from 'vuex';
import session from './modules/session';
import { storeState } from '../types';
import story from './modules/story';

const store = createStore<storeState>({
	modules: {
		session,
		story,
	},
});

export default store;
