import { Entity, Fields } from 'remult';

@Entity('participant', { allowApiCrud: true })
export class Participant {
	@Fields.string({ allowApiUpdate: false })
	id = '';

	@Fields.string()
	name = '';
}
