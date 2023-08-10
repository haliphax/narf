import { Entity, Fields } from "remult";
import { Vote } from "./vote";

@Entity("story", { allowApiCrud: true })
export class Story {
	@Fields.string({ allowApiUpdate: false })
	id!: string;

	@Fields.string()
	title!: string;

	@Fields.boolean()
	revealed = false;

	@Fields.object<Story>((options) => {
		options.includeInApi = false;
	})
	_votes?: Vote[];

	@Fields.object<Story>((options) => {
		options.allowApiUpdate = false;
		options.includeInApi = true;
		options.serverExpression = (s) => {
			return s.revealed
				? s._votes
				: s._votes?.map((v) => ({ ...v, vote: "?" } as Vote));
		};
	})
	votes?: Vote[];
}
