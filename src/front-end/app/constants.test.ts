import { afterEach, describe, it, vi } from "vitest";

describe("constants", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("uses #rootURI if present", async ({ expect }) => {
		vi.stubGlobal("document", { getElementById: () => ({ value: "/test/" }) });
		const c = (await import("./constants")).ROOT_URI;

		expect(c).toBe("/test/");
	});
});
