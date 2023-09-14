import { Entity, Fields } from "remult";

@Entity<Vote>("vote", {
	allowApiUpdate: (e, remult) => remult?.user?.id === e?.participantId,
	id: (e) => [e.participantId, e.storyId],
})
export class Vote {
	@Fields.string()
	storyId!: string;

	@Fields.string()
	participantId!: string;

	@Fields.string()
	participantName!: string;

	@Fields.string({ allowNull: true })
	vote: string | null = null;
}
