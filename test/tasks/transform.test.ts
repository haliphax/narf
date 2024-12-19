import { readFile, writeFile } from "fs";
import { afterEach, describe, it, vi } from "vitest";

const { mockPromisify, mockWriteFile } = vi.hoisted(() => ({
	mockPromisify: (arg: unknown) => {
		switch (arg) {
			case readFile:
				return () => '<link href="/test" />';
			case writeFile:
				return mockWriteFile;
		}
	},
	mockWriteFile: vi.fn(),
}));

vi.mock("util", () => ({ default: { promisify: mockPromisify } }));

describe("transform task", async () => {
	const transform = (await vi.importActual("@/tasks/transform"))
		.default as () => Promise<void>;

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
