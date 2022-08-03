import { Module } from 'vuex';
import { sessionState, storeState } from '../../types';
import { LOCALSTORAGE_GLOBAL_PREFIX } from '../../constants';

const SESSION_PREFIX = `${LOCALSTORAGE_GLOBAL_PREFIX}session.`;

const keys = {
	darkMode: `${SESSION_PREFIX}darkMode`	,
};

const session: Module<sessionState, storeState> = {
	mutations: {
		'session.settings.darkMode'(state, payload: boolean) {
			state.settings.darkMode = payload;
			localStorage.setItem(keys.darkMode, payload.toString());
		},
	},
	state() {
		return {
			id: crypto.randomUUID(),
			settings: {
				darkMode: JSON.parse(localStorage.getItem(keys.darkMode) ?? "false"),
			},
		};
	},
};

export default session;
