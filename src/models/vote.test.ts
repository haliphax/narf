import { UpdateStoryController } from "@/back-end/routes/events";
import { Remult } from "remult";
import { describe, it, vi } from "vitest";
import { Vote } from "./vote";

type WithAllowApiUpdate = {
	allowApiUpdate?: (value: unknown, remult: unknown) => boolean;
};
type WithDynamicOpts = (options: unknown, remult: unknown) => void;
type WithSaved = { saved?: (value: unknown) => Promise<void> };

const { mockEntity } = vi.hoisted(() => ({ mockEntity: vi.fn() }));

vi.mock("@/back-end/routes/events", () => ({
	UpdateStoryController: { updateStory: vi.fn() },
}));
vi.mock("remult", async () => {
	const a = await vi.importActual("remult");
	return { Entity: mockEntity, Fields: a.Fields };
});
vi.mock("./story", () => ({ Story: "Story" }));

describe("Vote model", () => {
	new Vote();

	describe("allowApiUpdate check", () => {
		const opts: WithAllowApiUpdate = { allowApiUpdate: undefined };
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
			const opts: WithSaved = { saved: undefined };
			(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

			expect(async () => {
				await opts.saved!({ storyId: "test" });
			}).rejects.toThrowError("Invalid story");
		});

		it("calls UpdateStoryController.updateStory", async ({ expect }) => {
			const mockFindId = async () => "story";
			const mockRemult = {
				repo: () => ({ findId: mockFindId }),
			} as unknown as Remult;
			const opts: WithSaved = { saved: undefined };
			(mockEntity.mock.lastCall![1] as WithDynamicOpts)(opts, mockRemult);

			await opts.saved!({ storyId: "test" });

			expect(UpdateStoryController.updateStory).toHaveBeenCalledWith("story");
		});
	});
});
