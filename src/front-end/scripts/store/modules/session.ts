import { v4 } from "uuid";
import { Module } from "vuex";
import { LOCALSTORAGE_GLOBAL_PREFIX } from "../../constants";
import { sessionState, storeState } from "../../types";

const SESSION_PREFIX = `${LOCALSTORAGE_GLOBAL_PREFIX}session.`;

const keys = {
	darkMode: `${SESSION_PREFIX}darkMode`,
};

const session: Module<sessionState, storeState> = {
	mutations: {
		"session.settings.darkMode"(state, payload: boolean) {
			state.settings.darkMode = payload;
			localStorage.setItem(keys.darkMode, payload.toString());
		},
	},
	state() {
		return {
			id: v4(),
			settings: {
				darkMode: JSON.parse(localStorage.getItem(keys.darkMode) ?? "false"),
			},
		};
	},
};

export default session;
