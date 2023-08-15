import { Fields } from "remult";

export default class Participant {
	@Fields.string()
	id!: string;

	@Fields.string()
	name = "";
}
