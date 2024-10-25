import { Story } from "../../../models/story";

export type SessionSettings = {
	darkMode: boolean;
	scale: string;
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
	events?: EventSource;
	story?: Story;
};
