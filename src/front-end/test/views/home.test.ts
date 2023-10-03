import { VueWrapper, shallowMount } from "@vue/test-utils";
import { beforeEach, describe, it } from "vitest";
import Home from "../../../front-end/scripts/views/home.vue";
import store from "../../scripts/store";

let home: VueWrapper;

describe("Home view", () => {
	beforeEach(() => {
		home = shallowMount(Home, { global: { plugins: [store] } });
	});

	it("has Profile component", ({ expect }) => {
		expect(home.findComponent("PROFILE-STUB").exists()).toBe(true);
	});

	it("has New Story component", ({ expect }) => {
		expect(home.findComponent("NEW-STORY-STUB").exists()).toBe(true);
	});
});
