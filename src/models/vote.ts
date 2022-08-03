import { Entity, Fields } from 'remult';
import { Participant } from './participant';

@Entity('vote', {
	allowApiCrud: true,
	id: entity => entity.find('id'),
})
export class Vote {
	@Fields.autoIncrement({ allowApiUpdate: false })
	id!: number;

	@Fields.string()
	storyId = '';

	@Fields.string()
	participantId = '';

	@Fields.object<Vote>((options, remult) => {
		options.lazy = true;
		options.serverExpression = async (vote) =>
			remult.repo(Participant).findFirst({ 'id': vote.participantId });
	})
	participant?: Participant;

	@Fields.string()
	vote = '';
}
