import { Store } from "vuex";
import { storeState } from "../front-end/scripts/types";

declare module "@vue/runtime-core" {
	// Declare your own store states.
	interface ComponentCustomProperties {
		$store: Store<storeState>;
	}
}
