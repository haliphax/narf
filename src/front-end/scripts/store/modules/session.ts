import { LOCALSTORAGE_GLOBAL_PREFIX } from '../../constants';
import { Module } from 'vuex';
import { sessionProperty, sessionState } from '../../types';
import { v4 as uuid } from 'uuid';

/** Make a localStorage key for use in this module */
const makeKey = (key: string): string =>
	`${LOCALSTORAGE_GLOBAL_PREFIX}session.${key}`;

/** Session property metadata */
const properties: Record<string, sessionProperty> = {
	darkMode: {
		default() { return false; },
		key: makeKey('darkMode'),
	},
	id: {
		default() { return uuid(); },
		key: makeKey('id'),
	},
	name: {
		default() { return 'Anonymous'; },
		key: makeKey('name'),
	},
};

const sessionModule: Module<sessionState, any> = {
	mutations: {
		'session.darkMode'(state, payload: boolean) {
			state.darkMode = payload;
			localStorage.setItem(properties.darkMode.key, JSON.stringify(payload));
		},
		'session.name'(state, payload: string) {
			state.name = payload;
			localStorage.setItem(properties.name.key, payload);
		},
	},
	state(): sessionState {
		const session: sessionState = Object.keys(properties).reduce(
			(p, v) => {
				var entry = properties[v];
				const value = localStorage.getItem(entry.key) || entry.default();

				switch (typeof entry.default()) {
					case 'boolean':
						p[v] = JSON.parse(value);
						break;
					default:
						p[v] = value;
						break;
				}

				localStorage.setItem(entry.key, value);

				return p;
			},
			{} as any);

		return session;
	},
};

export default sessionModule;
