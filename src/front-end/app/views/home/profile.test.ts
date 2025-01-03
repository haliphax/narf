import store from "@/front-end/app/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import Profile from "./profile.vue";

vi.mock("uuid", () => ({ v4: () => "test" }));

describe("Profile", () => {
	let profile: VueWrapper;

	beforeEach(() => {
		profile = mount(Profile, { global: { plugins: [store] } });
		profile.vm.$store.registerModule("test", { actions: { alert: () => {} } });
	});

	afterEach(() => {
		profile.vm.$store.unregisterModule("test");
		profile.unmount();
	});

	it("uses default name", ({ expect }) => {
		expect(profile.vm.$store.state.session.name).toBe("User");
	});

	it("submit updates session name", async ({ expect }) => {
		profile.vm.$store.subscribe((m, s) => {
			if (m.type !== "session") return;
			s.session = m.payload;
		});

		(profile.vm.$data as { name: string }).name = "test";
		profile.get("form").element.dispatchEvent(new Event("submit"));
		await profile.vm.$nextTick();

		expect(profile.vm.$store.state.session.name).toBe("test");
	});

	describe("import", () => {
		const makeFileList = (files: File[]) => {
			const input = document.createElement("input");
			input.setAttribute("type", "file");
			input.multiple = true;
			const fileList = Object.create(input.files);
			Object.defineProperty(fileList, "length", { value: files.length });

			for (let i = 0; i < files.length; i++) {
				fileList[i] = files[i];
			}

			return fileList;
		};

		it("throws error if multiple files selected", async ({ expect }) => {
			let alertMessage = "";
			profile.vm.$store.subscribeAction((o) => {
				if (o.type !== "alert") return;
				alertMessage = (o.payload as { text: string }).text;
			});

			const fileInput = profile.get("ul").get("input").element;
			fileInput.files = makeFileList([
				new File([""], "test1.json", { type: "application/json" }),
				new File([""], "test2.json", { type: "application/json" }),
			]);
			fileInput.dispatchEvent(new Event("change"));

			expect(alertMessage).toBe("Please select a single file");
		});

		it("throws error if non-JSON file selected", ({ expect }) => {
			let alertMessage = "";
			profile.vm.$store.subscribeAction((o) => {
				if (o.type !== "alert") return;
				alertMessage = (o.payload as { text: string }).text;
			});

			const fileInput = profile.get("ul").get("input").element;
			fileInput.files = makeFileList([
				new File([""], "test.txt", { type: "text/plain" }),
			]);
			fileInput.dispatchEvent(new Event("change"));

			expect(alertMessage).toBe("Please select a JSON file");
		});

		it("loads data into session", async ({ expect }) => {
			profile.vm.$store.subscribe((m, s) => {
				if (m.type !== "session") return;
				s.session = m.payload;
			});

			const fileInput = profile.get("ul").get("input").element;
			fileInput.files = makeFileList([
				new File(['{"name":"test"}'], "test.json", {
					type: "application/json",
				}),
			]);
			fileInput.dispatchEvent(new Event("change"));
			await profile.vm.$nextTick();

			expect(profile.vm.$store.state.session.name).toBe("test");
		});
	});
});
