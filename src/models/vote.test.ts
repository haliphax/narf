import { UpdateStoryController } from "@/server/routes/events";
import { ValidateFieldEvent } from "remult";
import { describe, expect, it, vi } from "vitest";
import { Vote } from "./vote";

type EntityOpts = {
	allowApiUpdate?: (value: unknown, remult: unknown) => boolean;
	saved?: (value: unknown) => Promise<void>;
};
type WithDynamicOpts = (options: unknown, remult: unknown) => void;
type WithValidate = {
	validate?: (value: unknown, event: ValidateFieldEvent) => Promise<void>;
};

const { decoratorCalls, mockEntity } = vi.hoisted(() => ({
	decoratorCalls: new Map<string, unknown>(),
	mockEntity: vi.fn(),
}));

vi.mock("@/server/routes/events", () => ({
	UpdateStoryController: { updateStory: vi.fn() },
}));
vi.mock("remult", async () => ({
	Entity: mockEntity,
	Fields: {
		string: (opts: unknown) => (_target: unknown, propertyKey: string) =>
			decoratorCalls.set(propertyKey, opts),
	},
}));
vi.mock("./story", () => ({ Story: "Story" }));

describe("Vote model", () => {
	const mockStory = { storyId: "test" };
	const mockFindId = vi.fn();
	const mockRemult = {
		repo: () => ({ findId: mockFindId }),
		user: { id: "test" },
	};
	const opts: EntityOpts = {};
	(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

	new Vote();

	describe("allowApiUpdate check", () => {
		it.each([
			["passes if user is participant", "test", true],
			["fails if user is not participant", "other", false],
		])("%s", (_name, participantId, expected) => {
			const result = opts.allowApiUpdate!({ participantId }, mockRemult);

			expect(result).toBe(expected);
		});
	});

	describe("save", () => {
		it("throws error if no story", async () => {
			mockFindId.mockImplementation(() => false);

			expect(opts.saved!(mockStory)).rejects.toThrowError("Invalid story");
		});

		it("calls UpdateStoryController.updateStory", async () => {
			mockFindId.mockImplementation(() => "story");

			await opts.saved!(mockStory);

			expect(UpdateStoryController.updateStory).toHaveBeenCalledWith("story");
		});
	});

	describe("vote validation", async () => {
		const mockVote = { storyId: "test", vote: "test" };
		const opts: WithValidate = {};
		(decoratorCalls.get("vote")! as WithDynamicOpts)(opts, mockRemult);

		it.each([
			// test, mockFindId result, vote, v.error
			["passes if vote is undefined", 1, {}, undefined],
			[
				"passes if valid",
				{ scale: "Fibonacci" },
				{ ...mockVote, vote: "1" },
				undefined,
			],
			["fails if no story", false, mockVote, "Invalid story"],
			["fails if no scale", 1, mockVote, "Invalid scale"],
			["fails if invalid", { scale: "Fibonacci" }, mockVote, "Invalid vote"],
		])("%s", async (_name, found, vote, expected) => {
			mockFindId.mockImplementation(() => found);
			const v = {} as ValidateFieldEvent;

			await opts.validate!(vote, v);

			expect(v.error).toBe(expected);
		});
	});
});
