import { createStore } from "vuex";
import session from "./session";
import story from "./story";
import { StoreState } from "./types";

const store = createStore<StoreState>({
	modules: {
		session,
		story,
	},
});

export default store;
