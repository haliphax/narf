import { v4 } from "uuid";
import { Module } from "vuex";
import { LOCALSTORAGE_GLOBAL_PREFIX } from "../constants";
import { SessionState, StoreState } from "../types";

const SESSION_PREFIX = `${LOCALSTORAGE_GLOBAL_PREFIX}session.`;

const keys = {
	darkMode: `${SESSION_PREFIX}darkMode`,
	sessionId: `${SESSION_PREFIX}sessionId`,
};

const session: Module<SessionState, StoreState> = {
	mutations: {
		"session.settings.darkMode"(state, payload: boolean) {
			state.settings.darkMode = payload;
			localStorage.setItem(keys.darkMode, payload.toString());
		},
	},
	state() {
		let sessionId = localStorage.getItem(keys.sessionId);

		if (!sessionId) {
			sessionId = v4();
			localStorage.setItem(keys.sessionId, sessionId);
		}

		return {
			id: sessionId,
			name: "Me",
			settings: {
				darkMode: JSON.parse(localStorage.getItem(keys.darkMode) ?? "false"),
			},
		};
	},
};

export default session;
