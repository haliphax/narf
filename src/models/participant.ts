import { Fields } from "remult";

export default class Participant {
	@Fields.string({ allowApiUpdate: false })
	id!: string;

	@Fields.string()
	name = "";
}
