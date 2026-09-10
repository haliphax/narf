import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("remult", () => {
	let rem: { apiClient: { url: string } };

	beforeEach(async () => {
		vi.resetModules();

		rem = { apiClient: { url: "" } };

		vi.doMock("axios", () => ({ default: "axios" }));
		vi.doMock("remult", () => ({
			Remult: class MockRemult {
				constructor(public _axios: unknown) {}
				apiClient = rem.apiClient;
			},
		}));

		await import("./remult");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("creates a Remult instance", () => {
		expect(rem.apiClient.url).not.toBe("");
	});

	it("assigns apiClient.url", () => {
		expect(rem.apiClient.url).toBe("/api");
	});
});
