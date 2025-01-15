import { UpdateStoryController } from "@/server/routes/events";
import { Remult } from "remult";
import { describe, it, vi } from "vitest";
import { Vote } from "./vote";

type WithAllowApiUpdate = {
	allowApiUpdate?: (value: unknown, remult: unknown) => boolean;
};
type WithDynamicOpts = (options: unknown, remult: unknown) => void;
type WithSaved = { saved?: (value: unknown) => Promise<void> };
type WithValidate = { validate?: (value: unknown) => Promise<void> };

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

		it("passes if user is participant", ({ expect }) => {
			const result = opts.allowApiUpdate!(
				{ participantId: "test" },
				mockRemult,
			);

			expect(result).toBe(true);
		});

		it("fails if user is not participant", ({ expect }) => {
			const result = opts.allowApiUpdate!(
				{ participantId: "other" },
				mockRemult,
			);

			expect(result).toBe(false);
		});
	});

	describe("save", () => {
		it("throws error if no story", async ({ expect }) => {
			const mockRemult = {
				repo: () => ({ findId: async () => false }),
			} as unknown as Remult;
			const opts: WithSaved = {};
			(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

			expect(opts.saved!({ storyId: "test" })).rejects.toThrowError(
				"Invalid story",
			);
		});

		it("calls UpdateStoryController.updateStory", async ({ expect }) => {
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
		const mockFindId = vi.fn();
		const mockRemult = {
			repo: () => ({ findId: mockFindId }),
		} as unknown as Remult;
		const opts: WithValidate = {};
		(decoratorCalls.get("vote")! as WithDynamicOpts)(opts, mockRemult);

		it("passes if vote is undefined", ({ expect }) => {
			expect(opts.validate!({})).resolves.not.toThrowError();
		});

		it("fails if no story", ({ expect }) => {
			mockFindId.mockImplementationOnce(() => false);

			expect(
				opts.validate!({ storyId: "test", vote: "test" }),
			).rejects.toThrowError("Invalid story");
		});

		it("fails if no scale", ({ expect }) => {
			mockFindId.mockImplementationOnce(() => "story");

			expect(opts.validate!({ storyId: "test", vote: "test" })).rejects.toThrow(
				"Invalid scale",
			);
		});

		it("fails if invalid vote", ({ expect }) => {
			mockFindId.mockImplementationOnce(() => ({ scale: "Fibonacci" }));

			expect(
				opts.validate!({ storyId: "test", vote: "test" }),
			).rejects.toThrowError("Invalid vote");
		});
	});
});
