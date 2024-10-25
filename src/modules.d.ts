import Vue from "vue";
import { Store } from "vuex";
import { StoreState } from "./front-end/app/store/types";

declare module "*.vue" {
	export default Vue;
}

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$store: Store<StoreState>;
	}
}
