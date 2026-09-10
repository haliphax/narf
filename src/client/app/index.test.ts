import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("entry point", () => {
	let mockCreate: ReturnType<typeof vi.fn>;
	let mockMount: ReturnType<typeof vi.fn>;
	let mockUse: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.resetModules();

		mockCreate = vi.fn(() => ({
			mount: mockMount,
			use: mockUse,
		}));
		mockMount = vi.fn();
		mockUse = vi.fn();

		vi.doMock("vue", () => ({ createApp: mockCreate }));
		vi.doMock("./app.vue", () => ({ default: "App" }));
		vi.doMock("./router", () => ({ default: "router" }));
		vi.doMock("./store/index", () => ({ default: "store" }));

		await import("./index");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("creates an application instance", () => {
		expect(mockCreate).toHaveBeenCalledWith("App");
	});

	it("uses plugins", () => {
		expect(mockUse).toHaveBeenCalledWith("router");
		expect(mockUse).toHaveBeenCalledWith("store");
	});

	it("mounts application", () => {
		expect(mockMount).toHaveBeenCalled();
	});
});
