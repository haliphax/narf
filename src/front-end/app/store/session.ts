import { v4 } from "uuid";
import { Module } from "vuex";
import scales from "../../../scales";
import { LOCALSTORAGE_GLOBAL_PREFIX } from "../constants";
import { SessionSettings, SessionState, StoreState } from "./types";

const SESSION_PREFIX = `${LOCALSTORAGE_GLOBAL_PREFIX}session.`;

const keys = {
	darkMode: `${SESSION_PREFIX}darkMode`,
	name: `${SESSION_PREFIX}name`,
	scale: `${SESSION_PREFIX}scale`,
	sessionId: `${SESSION_PREFIX}sessionId`,
};

const session: Module<SessionState, StoreState> = {
	mutations: {
		session(state, payload: Partial<SessionState>) {
			state = {
				...state,
				...payload,
			};

			payload.id && localStorage.setItem(keys.sessionId, payload.id);
			payload.name && localStorage.setItem(keys.name, payload.name.toString());

			if (payload.settings) {
				localStorage.setItem(
					keys.darkMode,
					payload.settings.darkMode.toString(),
				);
				localStorage.setItem(keys.scale, payload.settings.scale);
			}
		},
		"session.settings"(state, payload: Partial<SessionSettings>) {
			state.settings = {
				...state.settings,
				...payload,
			};

			if (payload.darkMode != undefined) {
				localStorage.setItem(keys.darkMode, payload.darkMode.toString());
			}

			if (payload.scale != undefined) {
				payload.scale && localStorage.setItem(keys.scale, payload.scale);
			}
		},
	},
	state() {
		let sessionId = localStorage.getItem(keys.sessionId);

		if (!sessionId) {
			sessionId = v4();
			localStorage.setItem(keys.sessionId, sessionId);
		}

		const darkModeDetected = matchMedia("(prefers-color-scheme:dark)").matches;

		return {
			id: sessionId,
			name: localStorage.getItem(keys.name) ?? "User",
			settings: {
				darkMode: JSON.parse(
					localStorage.getItem(keys.darkMode) ?? darkModeDetected.toString(),
				),
				scale: localStorage.getItem(keys.scale) ?? scales.keys().next().value!,
			},
		};
	},
};

export default session;
