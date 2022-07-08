import { LOCALSTORAGE_GLOBAL_PREFIX } from '../../constants';
import { State } from 'vue';
import { v4 as uuid } from 'uuid';
import { Module } from 'vuex';

/** Make a localStorage key for use in this module */
const makeKey = (key: string): string =>
  `${LOCALSTORAGE_GLOBAL_PREFIX}session.${key}`;

type sessionProperty = {
  default(): string,
  key: string,
};

/** Session property metadata */
const properties: Record<string, sessionProperty> = {
  id: {
    default() { return uuid(); },
    key: makeKey('id'),
  },
  name: {
    default() { return 'Anonymous'; },
    key: makeKey('name'),
  },
};

export interface sessionState {
  id: string,
  name: string,
};

export const sessionModule: Module<sessionState, State> = {
  mutations: {
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

        p[v] = value;
        localStorage.setItem(entry.key, value)

        return p;
      },
      {} as any);

    return session;
  },
};
