import type { Remult, ValidateFieldEvent } from "remult";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
	WithDynamicOpts,
	WithSaved,
	WithServerExpr,
	WithValidate,
} from "./test";

describe("Story", () => {
	let mockEntity: ReturnType<typeof vi.fn>;
	let decoratorCalls: Map<string, unknown>;
	let Story: typeof import("./story").Story;
	let ownerOnly: typeof import("./story").ownerOnly;
	let UpdateStoryController: {
		updateStory: ReturnType<typeof vi.fn>;
	};

	beforeEach(async () => {
		vi.resetModules();

		decoratorCalls = new Map<string, unknown>();
		mockEntity = vi.fn();

		const mockField =
			(opts: unknown) => (_target: unknown, propertyKey: string) =>
				decoratorCalls.set(propertyKey, opts);

		vi.doMock("@/server/routes/events", () => ({
			UpdateStoryController: { updateStory: vi.fn() },
		}));
		vi.doMock("remult", async () => {
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
		vi.doMock("./vote", () => ({ Vote: "vote" }));

		const storyMod = await import("./story");
		Story = storyMod.Story;
		ownerOnly = storyMod.ownerOnly;
		const eventsMod = await import("@/server/routes/events");
		UpdateStoryController =
			eventsMod.UpdateStoryController as typeof UpdateStoryController;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls UpdateStoryController.updateStory on save", () => {
		new Story();
		(mockEntity.mock.lastCall![1] as WithSaved).saved!("test");

		expect(UpdateStoryController.updateStory).toHaveBeenCalledWith("test");
	});

	it("_votes fetches associated records", () => {
		const mockFind = vi.fn();
		const mockRemult = { repo: vi.fn(() => ({ find: mockFind })) };
		const opts: WithServerExpr = {};
		(decoratorCalls.get("_votes")! as WithDynamicOpts)(opts, mockRemult);

		opts.serverExpression!({ id: "test" });

		expect(mockRemult.repo).toHaveBeenCalledWith("vote");
		expect(mockFind).toHaveBeenCalled();
	});

	describe("scale validation", () => {
		it.each([
			["fails if unknown", { scale: "invalid" }, "Invalid scale"],
			["succeeds if undefined", {}, undefined],
			["succeeds if known", { scale: "Fibonacci" }, undefined],
		])("%s", (_name, value, expected) => {
			const v = {} as ValidateFieldEvent;

			(decoratorCalls.get("scale")! as WithValidate).validate!(value, v);

			expect(v.error).toBe(expected);
		});
	});

	describe("votes", () => {
		it("hides other participantIds and votes", () => {
			const mockRemult = { user: { id: "test" } } as unknown as Remult;
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

		it("uses null if awaiting other vote", () => {
			const mockRemult = { user: { id: "test" } } as unknown as Remult;
			const opts: WithServerExpr = {};
			(decoratorCalls.get("votes")! as WithDynamicOpts)(opts, mockRemult);

			const value = opts.serverExpression!({
				_votes: [{ participantId: "other" }],
				revealed: false,
			}) as unknown[];

			expect(value).toHaveLength(1);
			expect(value).toContainEqual({ participantId: "", vote: null });
		});

		it("shows votes when revealed", () => {
			const mockRemult = { user: { id: "test" } } as unknown as Remult;
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
		it.each([
			["succeeds if story has no owner", undefined, undefined, true],
			[
				"succeeds if user is owner",
				{ owner: "test" },
				{ user: { id: "test" } },
				true,
			],
			[
				"fails if user is not owner",
				{ owner: "test" },
				{ user: { id: "other" } },
				false,
			],
		])("%s", (_name, owner, user, expected) => {
			const result = ownerOnly(
				owner as import("./story").Story | undefined,
				user as Remult | undefined,
			);

			expect(result).toBe(expected);
		});
	});
});
