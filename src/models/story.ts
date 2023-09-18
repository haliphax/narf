import { Entity, Fields, Remult, Validators } from "remult";
import { v4 } from "uuid";
import { updateStory } from "../back-end/routes/events";
import scales from "../scales";
import { Vote } from "./vote";

const ownerOnly = (e?: Story, remult?: Remult) =>
	!e?.owner || remult?.user?.id === e?.owner;

@Entity<Story>("story", {
	allowApiCrud: true,
	saved: (r) => updateStory(r),
})
export class Story {
	@Fields.string({ allowApiUpdate: false, validate: Validators.unique })
	id: string = v4();

	@Fields.string<Story>({ allowApiUpdate: ownerOnly })
	owner!: string;

	@Fields.integer({ allowApiUpdate: false })
	created = new Date().valueOf();

	@Fields.string({ allowApiUpdate: ownerOnly })
	title!: string;

	@Fields.boolean()
	revealed = false;

	@Fields.string({
		allowApiUpdate: ownerOnly,
		validate: (e) => {
			if (e.scale && !scales.has(e.scale)) {
				console.error(`Unknown scale: ${e.scale}`);
				throw "Unknown scale";
			}
		},
	})
	scale = scales.keys().next().value;

	@Fields.object<Story>((options, remult) => {
		options.includeInApi = false;
		options.serverExpression = (e) =>
			remult.repo(Vote).find({ where: { storyId: e.id } });
	})
	_votes?: Vote[];

	@Fields.object<Story>((options, remult) => {
		options.serverExpression = (e) => {
			return e._votes?.map((v) => {
				if (v.participantId === remult.user?.id) {
					return v;
				}

				return {
					...v,
					participantId: "",
					vote: e.revealed ? v.vote : v.vote ? "❓" : null,
				};
			});
		};
	})
	votes?: Vote[];
}
