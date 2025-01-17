import store from "@/client/app/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Profile from "./profile.vue";

vi.mock("uuid", () => ({ v4: () => "test" }));

describe("Profile", () => {
	let profile: VueWrapper;

	beforeEach(() => {
		profile = mount(Profile, { global: { plugins: [store] } });
		profile.vm.$store.registerModule("test", { actions: { alert: () => {} } });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		profile.vm.$store.unregisterModule("test");
		profile.unmount();
	});

	it("uses default name", () => {
		expect(profile.vm.$store.state.session.name).toBe("User");
	});

	it("submit updates session name", async () => {
		profile.vm.$store.subscribe((m, s) => {
			if (m.type !== "session") return;
			s.session = m.payload;
		});

		(profile.vm.$data as { name: string }).name = "test";
		profile.get("form").element.dispatchEvent(new Event("submit"));
		await profile.vm.$nextTick();

		expect(profile.vm.$store.state.session.name).toBe("test");
	});

	it("exports session data", async () => {
		const mockAnchor = {
			href: "",
			download: "",
			click: vi.fn(),
		};
		vi.stubGlobal("document", { createElement: () => mockAnchor });

		profile
			.findAll("button")
			.filter((v) => v.text().includes("Export"))[0]
			.trigger("click");
		await profile.vm.$nextTick();

		expect(mockAnchor.href).toContain("data:application/json,");
		expect(mockAnchor.download).toBe("narf.json");
		expect(mockAnchor.click).toHaveBeenCalled();
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

		it("raises alert on import exception", async () => {
			vi.stubGlobal("JSON", {
				parse() {
					throw new Error();
				},
			});
			let alerted = false;
			store.subscribeAction((o) => {
				if (o.type !== "alert" || !o.payload.text?.includes("Error: ")) return;
				alerted = true;
			});

			const fileInput = profile.get("ul").get("input").element;
			fileInput.files = makeFileList([
				new File([""], "test1.json", { type: "application/json" }),
			]);
			fileInput.dispatchEvent(new Event("change"));
			await profile.vm.$nextTick();

			expect(alerted).toBe(true);
		});

		it("clicks files button on user's behalf", async () => {
			let clicked = false;
			profile
				.findAll("input")
				.filter((v) => (v.attributes() as { type?: string }).type === "file")[0]
				.element.addEventListener("click", () => (clicked = true));

			profile
				.findAll("button")
				.filter((v) => v.text().includes("Import"))[0]
				.trigger("click");

			expect(clicked).toBe(true);
		});

		it.each([
			// name, files, alert text
			[
				"throws error if multiple files selected",
				[
					new File([""], "test1.json", { type: "application/json" }),
					new File([""], "test2.json", { type: "application/json" }),
				],
				"Please select a single file",
			],
			[
				"throws error if non-JSON file selected",
				[new File([""], "test.txt", { type: "text/plain" })],
				"Please select a JSON file",
			],
		])("%s", (_name, fileList, expected) => {
			let alertMessage = "";
			profile.vm.$store.subscribeAction((o) => {
				if (o.type !== "alert") return;
				alertMessage = (o.payload as { text: string }).text;
			});

			const fileInput = profile.get("ul").get("input").element;
			fileInput.files = makeFileList(fileList);
			fileInput.dispatchEvent(new Event("change"));

			expect(alertMessage).toBe(expected);
		});

		it("loads data into session", async () => {
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
