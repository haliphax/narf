import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import store from "../../../src/front-end/scripts/store";
import Home from "../../../src/front-end/scripts/views/home.vue";

describe("Home view", () => {
	let home: VueWrapper;

	const mountHome = () => shallowMount(Home, { global: { plugins: [store] } });

	beforeEach(() => {
		vi.stubGlobal("console", { log: vi.fn() });
		home = mountHome();
	});

	afterEach(() => {
		home.unmount();
	});

	it("has Profile component", ({ expect }) => {
		expect(home.findComponent("PROFILE-STUB").exists()).toBe(true);
	});

	it("has New Story component", ({ expect }) => {
		expect(home.findComponent("NEW-STORY-STUB").exists()).toBe(true);
	});

	describe("User profile details", () => {
		it("is expanded when username is default", ({ expect }) => {
			const details = home.element.querySelector(
				"details",
			)! as HTMLDetailsElement;
			expect(details.getAttribute("open")).toBe("true");
		});

		it("is collapsed when username is custom", async ({ expect }) => {
			store.state.session.name = "haliphax";
			home = mountHome();

			const details = home.element.querySelector(
				"details",
			)! as HTMLDetailsElement;

			expect(details.getAttribute("open")).toBe("false");
		});
	});
});
