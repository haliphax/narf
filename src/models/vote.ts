import { Fields } from "remult";
import Participant from "./participant";

export class Vote {
	@Fields.object(() => Participant)
	participant!: Participant;

	@Fields.string()
	vote: string | null = null;
}
