import { Entity, Fields } from "remult";
import scales from "../scales";
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

	@Fields.string<Story>({
		allowApiUpdate: false,
		defaultValue: () => scales.keys().next().value,
		validate: (s) => {
			if (s.scale && !scales.has(s.scale)) {
				console.error(`Unknown scale: ${s.scale}`);
				throw "Unknown scale";
			}
		},
	})
	scale!: string;

	@Fields.object<Story>({ includeInApi: false })
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
