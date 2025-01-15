import { Story } from "@/models/story";

export type StoryState = {
	events?: EventSource;
	story?: Story;
};

export type StoryStoreState = {
	story: StoryState;
};
