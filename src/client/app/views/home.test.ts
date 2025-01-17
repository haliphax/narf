import store from "@/client/app/store";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "./home.vue";

describe("Home view", () => {
	let home: VueWrapper;

	const mountHome = () => shallowMount(Home, { global: { plugins: [store] } });

	beforeEach(() => {
		home = mountHome();
	});

	afterEach(() => {
		home.unmount();
	});

	it.each([["Profile"], ["New Story"]])("has %s component", (name) => {
		expect(
			home
				.findComponent(`${name.replace(" ", "-").toUpperCase()}-STUB`)
				.exists(),
		).toBe(true);
	});

	describe("User profile details", () => {
		it.each([
			// name, username, open attribute value
			["is expanded when username is default", "User", ""],
			["is collapsed when username is custom", "test", null],
		])("%s", (_name, username, expected) => {
			store.state.session.name = username;
			home = mountHome();

			const details = home.element.querySelector(
				"details",
			)! as HTMLDetailsElement;

			expect(details.getAttribute("open")).toBe(expected);
		});
	});
});
