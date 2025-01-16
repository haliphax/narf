import scales from "@/scales";
import { UpdateStoryController } from "@/server/routes/events";
import { Entity, Fields, Remult, Validators } from "remult";
import { v4 } from "uuid";
import { Vote } from "./vote";

export const ownerOnly = (e?: Story, remult?: Remult) =>
	!e?.owner || remult?.user?.id === e?.owner;

const generateId = () =>
	encodeURIComponent(
		Buffer.from(v4().replace("-", ""), "hex").toString("base64"),
	);

@Entity<Story>("story", {
	allowApiCrud: true,
	saved: (r) => UpdateStoryController.updateStory(r),
})
export class Story {
	@Fields.string({ allowApiUpdate: false, validate: Validators.unique })
	id: string = generateId();

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
		validate: (e, v) => {
			if (!e.scale || scales.has(e.scale)) return;
			v.error = "Invalid scale";
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
