import { Entity, Fields } from "remult";
import { Vote } from "./vote";

@Entity("story", { allowApiCrud: true })
export class Story {
	@Fields.string({ allowApiUpdate: false })
	id!: string;

	@Fields.string({ allowApiUpdate: false })
	owner!: string;

	@Fields.string()
	title!: string;

	@Fields.boolean()
	revealed = false;

	@Fields.object<Story>((options) => {
		options.includeInApi = false;
	})
	_votes?: Vote[];

	@Fields.object<Story>((options, remult) => {
		options.allowApiUpdate = false;
		options.serverExpression = (s) => {
			return s._votes?.map((v) => {
				if (v.participant.id === remult.user?.id) {
					return v;
				}

				return {
					...v,
					participant: { ...v.participant, id: "" },
					vote: s.revealed ? v.vote : v.vote ? "❓" : null,
				};
			});
		};
	})
	votes?: Vote[];
}
