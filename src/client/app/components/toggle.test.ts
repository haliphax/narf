import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it } from "vitest";
import Toggle from "./toggle.vue";

describe("Toggle component", () => {
	let toggle: VueWrapper;

	beforeEach(() => {
		toggle = mount(Toggle);
	});

	afterEach(() => {
		toggle.unmount();
	});

	it("mounts as unchecked by default", ({ expect }) => {
		expect(
			(toggle.find("input[type='checkbox']").element as HTMLInputElement)
				.checked,
		).toBe(false);
	});

	it("mounts as checked when prop is provided", ({ expect }) => {
		toggle = mount(Toggle, { props: { checked: true } });

		expect(
			(toggle.find("input[type='checkbox']").element as HTMLInputElement)
				.checked,
		).toBe(true);
	});

	it("toggles when enter pressed on label", ({ expect }) => {
		const checkbox = toggle.find("input[type='checkbox']")
			.element as HTMLInputElement;

		expect(checkbox.checked).toBe(false);
		(toggle.find("label").element as HTMLLabelElement).dispatchEvent(
			new KeyboardEvent("keypress", { key: "Enter" }),
		);
		expect(checkbox.checked).toBe(true);
	});

	it("does not toggle when keypress on label is not Enter", ({ expect }) => {
		const checkbox = toggle.find("input[type='checkbox']")
			.element as HTMLInputElement;

		expect(checkbox.checked).toBe(false);
		(toggle.find("label").element as HTMLLabelElement).dispatchEvent(
			new KeyboardEvent("keypress", { key: "Escape" }),
		);
		expect(checkbox.checked).toBe(false);
	});
});
