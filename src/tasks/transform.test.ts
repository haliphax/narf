import { readFile, writeFile } from "fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import transform from "./transform";

const { mockWriteFile } = vi.hoisted(() => ({ mockWriteFile: vi.fn() }));

vi.mock("util", () => ({
	default: {
		promisify: (arg: unknown) => {
			switch (arg) {
				case readFile:
					return () => '<link href="/test" />';
				case writeFile:
					return mockWriteFile;
			}
		},
	},
}));

describe("transform task", async () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.clearAllMocks();
	});

	it.each([
		// name, ROOT_URI, expected URL
		["keeps links intact with default root", "", "/test"],
		["reformats links with custom root", "/prefix/", "/prefix/test"],
	])("%s", async (_name, root, expected) => {
		vi.stubEnv("ROOT_URI", root);

		await transform();

		expect(mockWriteFile).toHaveBeenCalledWith(
			expect.anything(),
			`<link href="${expected}" />`,
		);
	});
});
