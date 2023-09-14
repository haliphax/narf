import { Entity, Fields, Validators } from "remult";
import { v4 } from "uuid";
import scales from "../scales";
import { Vote } from "./vote";

@Entity("story", { allowApiCrud: true })
export class Story {
	@Fields.string({ allowApiUpdate: false, validate: Validators.unique })
	id: string = v4();

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

	@Fields.object<Story>((options, remult) => {
		options.includeInApi = false;
		options.serverExpression = (e) =>
			remult.repo(Vote).find({ where: { storyId: e.id } });
	})
	_votes?: Vote[];

	@Fields.object<Story>((options, remult) => {
		options.allowApiUpdate = false;
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
