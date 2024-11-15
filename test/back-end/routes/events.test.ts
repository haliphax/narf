import { Request, Response } from "express";
import {
	MockedObject,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import {
	clients,
	handler,
	updateStory,
} from "../../../src/back-end/routes/events";

describe("events", () => {
	/** mock request */
	let request: MockedObject<Request>;

	/** mock response */
	let response: MockedObject<Response<string, Record<string, string>>>;

	beforeEach(() => {
		// mock request defaults
		request = vi.mocked({} as Request, { partial: true });
		request.on = vi.fn(() => request);

		// mock response defaults
		response = vi.mocked({} as Response<string, Record<string, string>>, {
			partial: true,
		});
		response.flush = vi.fn();
		response.flushHeaders = vi.fn();
		response.set = vi.fn(() => response);
		response.write = vi.fn(() => true);
	});

	afterEach(() => {
		clients.clear();
		vi.clearAllMocks();
	});

	it("creates tracking list when no clients exist for story ID", () => {
		request.params = { story: "test" };

		handler(request, response);

		expect(clients.has("test")).toBeTruthy();
		const testClients = clients.get("test");
		expect(testClients).toHaveLength(1);
	});

	it("appends to tracking list when clients exist for story ID", () => {
		request.params = { story: "test" };

		handler(request, response);
		handler(request, response);

		expect(clients.has("test")).toBeTruthy();
		const testClients = clients.get("test");
		expect(testClients).toHaveLength(2);
	});

	it("removes client from tracking list on close", () => {
		vi.mock("uuid", () => ({ v4: vi.fn(() => "test") }));
		request.params = { story: "test" };

		// initial request
		handler(request, response);

		// assert client is tracked
		expect(clients.get("test")![0]).toMatchObject({ id: "test", response });
		// assert "close" event listener is added
		expect(request.on).toHaveBeenCalledWith("close", expect.anything());

		// call onClose event listener
		request.on.mock.calls[0][1]();

		// assert client has been removed
		expect(clients.get("test")!.length).toBe(0);
	});

	describe("updateStory", () => {
		it("should write to client response", () => {
			const Story = vi.fn(function () {
				return {
					created: 0,
					id: "test",
					owner: "",
					revealed: false,
					scale: "",
					title: "",
				};
			});

			clients.set("test", [
				{
					id: "test",
					response,
				},
			]);

			updateStory(new Story());

			const testClients = clients.get("test");
			expect(testClients).toHaveLength(1);
			const testClient = testClients![0];
			expect(testClient.response.write).toHaveBeenCalled();
			expect(testClient.response.flush).toHaveBeenCalled();
		});
	});
});
