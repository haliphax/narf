import { UpdateStoryController } from "@/server/routes/events";
import { Remult, ValidateFieldEvent } from "remult";
import { describe, expect, it, vi } from "vitest";
import { Story, ownerOnly } from "./story";
import { Vote } from "./vote";

type WithDynamicOpts = (options: unknown, remult: unknown) => void;
type WithSaved = { saved: (value: unknown) => void };
type WithServerExpr = {
	serverExpression?: (value: unknown) => object;
};
type WithValidate = {
	validate: (value: unknown, event?: ValidateFieldEvent) => void;
};

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

	it("calls UpdateStoryController.updateStory on save", () => {
		(mockEntity.mock.lastCall![1] as WithSaved).saved("test");

		expect(UpdateStoryController.updateStory).toHaveBeenCalledWith("test");
	});

	it("_votes fetches associated records", () => {
		const mockFind = vi.fn();
		const mockRemult = { repo: vi.fn(() => ({ find: mockFind })) };
		const opts: WithServerExpr = {};
		(decoratorCalls.get("_votes")! as WithDynamicOpts)(opts, mockRemult);

		opts.serverExpression!({ id: "test" });

		expect(mockRemult.repo).toHaveBeenCalledWith(Vote);
		expect(mockFind).toHaveBeenCalled();
	});

	describe("scale validation", () => {
		it.each([
			// name, story partial, validation error
			["fails if unknown", { scale: "invalid" }, "Invalid scale"],
			["succeeds if undefined", {}, undefined],
			["succeeds if known", { scale: "Fibonacci" }, undefined],
		])("%s", (_name, value, expected) => {
			const v = {} as ValidateFieldEvent;

			(decoratorCalls.get("scale")! as WithValidate).validate(value, v);

			expect(v.error).toBe(expected);
		});
	});

	describe("votes", () => {
		const mockRemult = { user: { id: "test" } };
		const opts: WithServerExpr = {};
		(decoratorCalls.get("votes")! as WithDynamicOpts)(opts, mockRemult);

		it("hides other participantIds and votes", () => {
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
			const value = opts.serverExpression!({
				_votes: [{ participantId: "other" }],
				revealed: false,
			}) as unknown[];

			expect(value).toHaveLength(1);
			expect(value).toContainEqual({ participantId: "", vote: null });
		});

		it("shows votes when revealed", () => {
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
			// name, story, remult mock, pass
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
				owner as Story | undefined,
				user as Remult | undefined,
			);

			expect(result).toBe(expected);
		});
	});
});
