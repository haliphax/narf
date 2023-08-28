import { Store } from "vuex";
import { StoreState } from "./front-end/scripts/store/types";

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$store: Store<StoreState>;
	}
}
