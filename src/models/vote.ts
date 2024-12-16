import { Entity, Fields } from "remult";
import { UpdateStoryController } from "../back-end/routes/events";
import scales from "../scales";
import { Story } from "./story";

@Entity<Vote>("vote", (options, remult) => {
	options.allowApiCrud = true;
	options.allowApiUpdate = (e, remult) => remult?.user?.id === e?.participantId;
	options.id = (e) => [e.participantId, e.storyId];
	options.saved = async (e) => {
		const story = await remult.repo(Story).findId(e.storyId);

		if (!story) throw "Invalid story";

		UpdateStoryController.updateStory(story);
	};
})
export class Vote {
	@Fields.string()
	storyId!: string;

	@Fields.string()
	participantId!: string;

	@Fields.string()
	participantName!: string;

	@Fields.string<Vote>((options, remult) => {
		options.allowNull = true;
		options.validate = async (e) => {
			if (!e.vote) return;

			const story = await remult.repo(Story).findId(e.storyId);

			if (!story) throw "Invalid story";
			if (!story.scale) throw "Invalid scale";
			if (!scales.get(story.scale)?.includes(e.vote)) throw "Invalid vote";
		};
	})
	vote: string | null = null;
}
