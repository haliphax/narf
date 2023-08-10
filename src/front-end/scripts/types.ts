import { Story } from "../../models/story";

export type SessionSettings = {
	darkMode: boolean;
};

export type SessionState = {
	id: string;
	name: string;
	settings: SessionSettings;
};

export type StoreState = {
	session: SessionState;
	story: StoryState;
};

export type StoryState = {
	events: EventSource | null;
	story: Story | null;
};
