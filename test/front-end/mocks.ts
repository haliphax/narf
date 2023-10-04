import { vi } from "vitest";

export class EventSourceMock {
	addEventListener = vi.fn();
	close = vi.fn();
}
