import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";
import Dialogs from "../../../src/front-end/app/components/dialogs.vue";
import store from "../../../src/front-end/app/store";

describe("Dialogs component", () => {
	let dialogs: VueWrapper;

	beforeEach(() => {
		dialogs = mount(Dialogs, { global: { plugins: [store] } });
	});

	afterEach(() => {
		dialogs.unmount();
	});

	it("registers the dialogs vuex store module", ({ expect }) => {
		expect(store.hasModule("dialogs")).toBe(true);
	});

	it("shows alert dialog on alert action dispatch", async ({ expect }) => {
		const dialog = dialogs.vm.$refs.alert as HTMLDialogElement;

		expect(dialog.open).toBe(false);
		await store.dispatch("alert", { text: "test" });
		expect(dialog.open).toBe(true);
	});

	it("shows confirm dialog on confirm action dispatch", async ({ expect }) => {
		const dialog = dialogs.vm.$refs.confirm as HTMLDialogElement;

		expect(dialog.open).toBe(false);
		await store.dispatch("confirm", { responseId: "test", text: "test" });
		expect(dialog.open).toBe(true);
	});
});
