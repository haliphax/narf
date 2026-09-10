import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("entrypoint", () => {
	let mockExpress: unknown;
	let mockService: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.resetModules();

		mockExpress = 1;
		mockService = vi.fn();

		vi.doMock("express", () => ({ default: () => mockExpress }));
		vi.doMock("./service", () => ({ default: mockService }));

		await import("./index");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("creates a service instance", () => {
		expect(mockService).toHaveBeenCalledWith(mockExpress);
	});
});
