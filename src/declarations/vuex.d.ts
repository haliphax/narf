import { Store } from "vuex";
import { storeState } from "../front-end/scripts/types";

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$store: Store<storeState>;
	}
}
