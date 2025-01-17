import { describe, expect, it, vi } from "vitest";

const { mockExpress, mockService } = vi.hoisted(() => ({
	mockExpress: 1,
	mockService: vi.fn(),
}));

vi.mock("express", () => ({ default: () => mockExpress }));
vi.mock("./service", () => ({ default: mockService }));

await import("./index");

describe("entrypoint", () => {
	it("creates a service instance", () => {
		expect(mockService).toHaveBeenCalledWith(mockExpress);
	});
});
