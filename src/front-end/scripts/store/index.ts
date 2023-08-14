import { createStore } from "vuex";
import { StoreState } from "../types";
import session from "./session";
import story from "./story";

const store = createStore<StoreState>({
	modules: {
		session,
		story,
	},
});

export default store;
