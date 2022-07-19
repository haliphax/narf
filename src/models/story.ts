import { Entity, Fields } from 'remult';
import { Vote } from './vote';

@Entity('story', { allowApiCrud: true })
export class Story {
	@Fields.string({ allowApiUpdate: false })
	id = '';

	@Fields.string()
	title = '';

	@Fields.object<Story>((options, remult) => {
		options.serverExpression = async (story) =>
			remult.repo(Vote).find({
				where: { 'storyId': story.id }
			});
	})
	votes: Vote[] = [];
}
