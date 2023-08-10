import { createStore } from "vuex";
import { StoreState } from "../StoreState";
import session from "./modules/session";
import story from "./modules/story";

const store = createStore<StoreState>({
	modules: {
		session,
		story,
	},
});

export default store;
