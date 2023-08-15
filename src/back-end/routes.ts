import { Application } from "express";
import glitchWebhook from "./routes/glitch-webhook";
import { storySSE } from "./routes/story/events";
import reveal from "./routes/story/reveal";
import vote from "./routes/story/vote";

const routes = async (app: Application) => {
	glitchWebhook(app);
	reveal(app);
	storySSE(app);
	vote(app);
};

export default routes;
