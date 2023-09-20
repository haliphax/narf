import { v4 } from "uuid";
import { Module } from "vuex";
import { LOCALSTORAGE_GLOBAL_PREFIX } from "../constants";
import { SessionState, StoreState } from "./types";

const SESSION_PREFIX = `${LOCALSTORAGE_GLOBAL_PREFIX}session.`;

const keys = {
	darkMode: `${SESSION_PREFIX}darkMode`,
	name: `${SESSION_PREFIX}name`,
	sessionId: `${SESSION_PREFIX}sessionId`,
};

const session: Module<SessionState, StoreState> = {
	mutations: {
		"session.settings"(state, payload: SessionState) {
			state.id = payload.id;
			state.name = payload.name;
			state.settings = payload.settings;
			localStorage.setItem(keys.darkMode, payload.settings.darkMode.toString());
			localStorage.setItem(keys.sessionId, payload.id);
			localStorage.setItem(keys.name, payload.name.toString());
		},
		"session.settings.darkMode"(state, payload: boolean) {
			state.settings.darkMode = payload;
			localStorage.setItem(keys.darkMode, payload.toString());
		},
		"session.settings.name"(state, payload: string) {
			state.name = payload;
			localStorage.setItem(keys.name, payload);
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
			name: localStorage.getItem(keys.name) ?? "User",
			settings: {
				darkMode: JSON.parse(localStorage.getItem(keys.darkMode) ?? "false"),
			},
		};
	},
};

export default session;
