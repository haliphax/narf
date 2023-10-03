import { shallowMount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, it } from "vitest";
import store from "../../../src/front-end/scripts/store";
import Home from "../../../src/front-end/scripts/views/home.vue";

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
