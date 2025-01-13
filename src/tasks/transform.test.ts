import { readFile, writeFile } from "fs";
import { afterEach, describe, it, vi } from "vitest";
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

	it("keeps links intact when rootURI is /", async ({ expect }) => {
		vi.stubEnv("ROOT_URI", "");

		await transform();

		expect(mockWriteFile).toHaveBeenCalledWith(
			expect.anything(),
			'<link href="/test" />',
		);
	});

	it("reformats links when rootURI is custom", async ({ expect }) => {
		vi.stubEnv("ROOT_URI", "/prefix/");

		await transform();

		expect(mockWriteFile).toHaveBeenCalledWith(
			expect.anything(),
			'<link href="/prefix/test" />',
		);
	});
});
