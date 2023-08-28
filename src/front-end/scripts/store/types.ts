import { Story } from "../../../models/story";

export type SessionSettings = {
	darkMode: boolean;
};

export type SessionState = {
	id: string;
	userName: string;
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
