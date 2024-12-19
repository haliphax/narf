import Dialogs from "@/front-end/app/components/dialogs.vue";
import store from "@/front-end/app/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";

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

	it("dispatches close action when dialog is closed", async ({ expect }) => {
		const dialog = dialogs.vm.$refs.confirm as HTMLDialogElement;
		let closed = false;

		store.subscribeAction((o) => {
			if (o.type == "close") {
				closed = true;
			}
		});

		dialog.dispatchEvent(new Event("close"));

		expect(closed).toBe(true);
	});

	it("dispatches confirmed action when OK is clicked", async ({ expect }) => {
		const dialog = dialogs.vm.$refs.confirm as HTMLDialogElement;
		const ok = dialog.querySelector("button[value='OK']")!;
		let confirmed = false;

		store.subscribeAction((o) => {
			if (o.type == "confirmed") {
				confirmed = true;
			}
		});

		ok.dispatchEvent(new Event("click"));

		expect(confirmed).toBe(true);
	});
});
