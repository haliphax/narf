import store from "@/client/app/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import Actions from "./actions.vue";

describe("Actions component", () => {
	let actions: VueWrapper;

	beforeEach(() => {
		store.commit("session", { id: "test" });

		store.registerModule("dialogs", {
			actions: {
				alert() {},
				confirm() {},
				confirmed() {},
			},
		});

		store.registerModule("story", {
			actions: { "story.reveal"() {} },
			state() {
				return {
					events: undefined,
					story: {
						revealed: false,
						owner: "test",
					},
				};
			},
			mutations: {
				story(state, payload) {
					state.story = payload;
				},
			},
		});

		actions = mount(Actions, { global: { plugins: [store] } });
	});

	afterEach(() => {
		actions.unmount();
		store.unregisterModule("dialogs");
		store.unregisterModule("story");
		vi.unstubAllGlobals();
	});

	it("share button copies room URL to clipboard", ({ expect }) => {
		vi.stubGlobal("window", {
			location: { href: "test" },
			navigator: { clipboard: { writeText: vi.fn() } },
		});

		actions
			.findAll("button")
			.find((v) => v.text().includes("Share"))!
			.element.dispatchEvent(new Event("click"));

		expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith("test");
	});

	describe("reveal button", () => {
		it("is enabled for rooms not revealed", ({ expect }) => {
			const revealButton = actions
				.findAll("button")
				.find((v) => v.text().includes("Reveal"))!;

			expect(revealButton.element.disabled).toBe(false);
		});

		it("is disabled for revealed rooms", async ({ expect }) => {
			store.commit("story", { revealed: true, owner: "test" });
			await actions.vm.$nextTick();

			const revealButton = actions
				.findAll("button")
				.find((v) => v.text().includes("Reveal"))!;

			expect(revealButton.element.disabled).toBe(true);
		});

		it("requests confirmation", ({ expect }) => {
			let dialog = false;
			store.subscribeAction((o) => {
				if (o.type !== "confirm" || o.payload.id !== "reveal") return;
				dialog = true;
			});

			actions
				.findAll("button")
				.find((v) => v.text().includes("Reveal"))!
				.element.dispatchEvent(new Event("click"));

			expect(dialog).toBe(true);
		});

		it("dispatches story.reveal action on confirm", async ({ expect }) => {
			let reveal = false;
			store.subscribeAction((o) => {
				if (o.type !== "story.reveal") return;
				reveal = true;
			});

			await store.dispatch("confirmed", "reveal");

			expect(reveal).toBe(true);
		});
	});
});
