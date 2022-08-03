import { Entity, Fields } from 'remult';
import { Participant } from './participant';
//import { Story } from './story';

@Entity('vote', { allowApiCrud: true })
export class Vote {
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
