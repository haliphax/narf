import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";
import App from "../../src/front-end/app/app.vue";
import store from "../../src/front-end/app/store";

describe("App component", () => {
	let app: VueWrapper;

	const mountApp = () => shallowMount(App, { global: { plugins: [store] } });

	beforeEach(() => {
		app = mountApp();
	});

	afterEach(() => {
		app.unmount();
	});

	it("has Dialogs component", ({ expect }) => {
		expect(app.findComponent("DIALOGS-STUB").exists()).toBe(true);
	});
});
