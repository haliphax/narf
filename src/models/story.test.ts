import { UpdateStoryController } from "@/server/routes/events";
import { Remult } from "remult";
import { describe, it, vi } from "vitest";
import { Story, ownerOnly } from "./story";
import { Vote } from "./vote";

type WithDynamicOpts = (options: unknown, remult: unknown) => void;
type WithSaved = { saved: (value: unknown) => void };
type WithServerExpr = {
	serverExpression?: (value: unknown) => object;
};
type WithValidate = { validate: (value: unknown) => void };

const { decoratorCalls, mockEntity } = vi.hoisted(() => ({
	decoratorCalls: new Map<string, unknown>(),
	mockEntity: vi.fn(),
}));

vi.mock("@/server/routes/events", () => ({
	UpdateStoryController: { updateStory: vi.fn() },
}));
vi.mock("remult", async () => {
	const mockField =
		(opts: unknown) => (_target: unknown, propertyKey: string) =>
			decoratorCalls.set(propertyKey, opts);
	const actual = await vi.importActual("remult");

	return {
		Entity: mockEntity,
		Fields: {
			boolean: mockField,
			integer: mockField,
			object: mockField,
			string: mockField,
		},
		Validators: actual.Validators,
	};
});
vi.mock("./vote", () => ({ Vote: "vote" }));

describe("Story", () => {
	new Story();

	it("calls UpdateStoryController.updateStory on save", ({ expect }) => {
		(mockEntity.mock.lastCall![1] as WithSaved).saved("test");

		expect(UpdateStoryController.updateStory).toHaveBeenCalledWith("test");
	});

	it("scale throws error if invalid", async ({ expect }) => {
		expect(() =>
			(decoratorCalls.get("scale")! as WithValidate).validate({
				scale: "invalid",
			}),
		).toThrowError("Unknown scale");
	});

	it("_votes fetches associated records", ({ expect }) => {
		const mockFind = vi.fn();
		const mockRemult = { repo: vi.fn(() => ({ find: mockFind })) };
		const opts: WithServerExpr = {};
		(decoratorCalls.get("_votes")! as WithDynamicOpts)(opts, mockRemult);

		opts.serverExpression!({ id: "test" });

		expect(mockRemult.repo).toHaveBeenCalledWith(Vote);
		expect(mockFind).toHaveBeenCalled();
	});

	describe("votes", () => {
		it("hides other participantIds and votes", ({ expect }) => {
			const mockRemult = { user: { id: "test" } };
			const opts: WithServerExpr = {};
			(decoratorCalls.get("votes")! as WithDynamicOpts)(opts, mockRemult);

			const value = opts.serverExpression!({
				_votes: [
					{ participantId: "test", vote: "test" },
					{ participantId: "other", vote: "test" },
				],
				revealed: false,
			}) as unknown[];

			expect(value).toHaveLength(2);
			expect(value).toContainEqual({ participantId: "", vote: "❓" });
			expect(value).toContainEqual({ participantId: "test", vote: "test" });
		});

		it("uses null if awaiting other vote", ({ expect }) => {
			const mockRemult = { user: { id: "test" } };
			const opts: WithServerExpr = {};
			(decoratorCalls.get("votes")! as WithDynamicOpts)(opts, mockRemult);

			const value = opts.serverExpression!({
				_votes: [{ participantId: "other" }],
				revealed: false,
			}) as unknown[];

			expect(value).toHaveLength(1);
			expect(value).toContainEqual({ participantId: "", vote: null });
		});

		it("shows votes when revealed", ({ expect }) => {
			const mockRemult = { user: { id: "test" } };
			const opts: WithServerExpr = {};
			(decoratorCalls.get("votes")! as WithDynamicOpts)(opts, mockRemult);

			const value = opts.serverExpression!({
				_votes: [
					{ participantId: "test", vote: "test" },
					{ participantId: "other", vote: "test" },
				],
				revealed: true,
			}) as unknown[];

			expect(value).toHaveLength(2);
			expect(value).toContainEqual({ participantId: "", vote: "test" });
			expect(value).toContainEqual({ participantId: "test", vote: "test" });
		});
	});

	describe("ownerOnly check", () => {
		it("succeeds if story has no owner", ({ expect }) => {
			const result = ownerOnly(undefined, undefined);

			expect(result).toBe(true);
		});

		it("succeeds if user is owner", ({ expect }) => {
			const result = ownerOnly(
				{ owner: "test" } as Story,
				{ user: { id: "test" } } as Remult,
			);

			expect(result).toBe(true);
		});

		it("fails if user is not owner", ({ expect }) => {
			const result = ownerOnly(
				{ owner: "test" } as Story,
				{ user: { id: "other" } } as Remult,
			);

			expect(result).toBe(false);
		});
	});
});
