import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";
import DarkMode from "../../../src/front-end/app/components/darkmode.vue";
import Toggle from "../../../src/front-end/app/components/toggle.vue";
import store from "../../../src/front-end/app/store";

describe("DarkMode component", () => {
	let darkMode: VueWrapper;

	const mountDarkMode = () => mount(DarkMode, { global: { plugins: [store] } });

	beforeEach(() => {
		store.state.session.settings.darkMode = false;
		darkMode = mountDarkMode();
	});

	afterEach(() => {
		darkMode.unmount();
	});

	it("toggles settings.darkmode", ({ expect }) => {
		const toggle = darkMode.findComponent(Toggle);

		expect(store.state.session.settings.darkMode).toBe(false);
		toggle.vm.$emit("click");
		expect(store.state.session.settings.darkMode).toBe(true);
	});

	it("reacts to settings.darkmode state changes", ({ expect }) => {
		const data = darkMode.vm.$data as { enabled: boolean };

		expect(data.enabled).toBe(false);
		store.commit("session.settings", { darkMode: true });
		expect(data.enabled).toBe(true);
	});
});
