import Story from "../../models/story";

export type sessionSettings = {
	darkMode: boolean;
};

export type sessionState = {
	id: string;
	settings: sessionSettings;
};

export type storeState = {
	session: sessionState;
	story: storyState;
};

export type storyState = {
	revealed: boolean;
	story: Story | null;
};

export type votePayload = {
	person: string;
	vote: string;
};
