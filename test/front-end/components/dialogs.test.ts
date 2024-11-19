import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";
import Dialogs from "../../../src/front-end/app/components/dialogs.vue";
import store from "../../../src/front-end/app/store";

describe("Dialogs component", () => {
	let dialogs: VueWrapper;

	beforeEach(() => {
		dialogs = shallowMount(Dialogs, { global: { plugins: [store] } });
	});

	afterEach(() => {
		dialogs.unmount();
	});

	it("registers the dialogs vuex store module", ({ expect }) => {
		expect(store.hasModule("dialogs")).toBe(true);
	});
});
