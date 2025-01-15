import axios from "axios";
import { Remult } from "remult";
import { describe, it, vi } from "vitest";

const { rem } = vi.hoisted(() => ({ rem: { apiClient: { url: "" } } }));

vi.mock("axios", () => ({ default: "axios" }));
vi.mock("remult", () => ({ Remult: vi.fn(() => rem) }));

await import("./remult");

describe("remult", () => {
	it("creates a Remult instance", ({ expect }) => {
		expect(Remult).toHaveBeenCalledWith(axios);
	});

	it("assigns apiClient.url", ({ expect }) => {
		expect(rem.apiClient.url).toBe("/api");
	});
});
