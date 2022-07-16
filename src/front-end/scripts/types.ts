export type estimate = {
	user: participant,
	value: string | null,
};

export type participant = {
	id: string,
	name: string,
	value?: string | null,
};

export type participantsState = {
	people: Record<string, participant>,
};

export type sessionProperty = {
	default(): any,
	key: string,
};

export type sessionState = {
	darkMode: boolean,
	id: string,
	name: string,
};

export type storeState = {
	participants: participantsState,
	session: sessionState,
	story: storyState,
};

export type storyState = {
	id: string,
	title: string,
	revealed: boolean,
};
