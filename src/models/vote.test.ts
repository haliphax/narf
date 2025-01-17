import { UpdateStoryController } from "@/server/routes/events";
import { Remult, ValidateFieldEvent } from "remult";
import { describe, expect, it, vi } from "vitest";
import { Vote } from "./vote";

type WithAllowApiUpdate = {
	allowApiUpdate?: (value: unknown, remult: unknown) => boolean;
};
type WithDynamicOpts = (options: unknown, remult: unknown) => void;
type WithSaved = { saved?: (value: unknown) => Promise<void> };
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
	new Vote();

	describe("allowApiUpdate check", () => {
		const opts: WithAllowApiUpdate = {};
		const mockRemult = { user: { id: "test" } } as Remult;
		(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

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
			const mockRemult = {
				repo: () => ({ findId: async () => false }),
			} as unknown as Remult;
			const opts: WithSaved = {};
			(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

			expect(opts.saved!({ storyId: "test" })).rejects.toThrowError(
				"Invalid story",
			);
		});

		it("calls UpdateStoryController.updateStory", async () => {
			const mockFindId = async () => "story";
			const mockRemult = {
				repo: () => ({ findId: mockFindId }),
			} as unknown as Remult;
			const opts: WithSaved = {};
			(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

			await opts.saved!({ storyId: "test" });

			expect(UpdateStoryController.updateStory).toHaveBeenCalledWith("story");
		});
	});

	describe("vote validation", async () => {
		const mockVote = { storyId: "test", vote: "test" };
		const mockFindId = vi.fn();
		const mockRemult = {
			repo: () => ({ findId: mockFindId }),
		} as unknown as Remult;
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
