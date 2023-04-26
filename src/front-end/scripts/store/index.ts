import { createStore } from "vuex";
import { storeState } from "../types";
import session from "./modules/session";
import story from "./modules/story";

const store = createStore<storeState>({
	modules: {
		session,
		story,
	},
});

export default store;
