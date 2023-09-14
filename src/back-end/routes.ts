import { Application } from "express";
import glitchWebhook from "./routes/glitch-webhook";
import create from "./routes/story/create";
import { storySSE } from "./routes/story/events";
import join from "./routes/story/join";
import reveal from "./routes/story/reveal";
import vote from "./routes/story/vote";

const routes = async (app: Application) => {
	create(app);
	glitchWebhook(app);
	join(app);
	reveal(app);
	storySSE(app);
	vote(app);
};

export default routes;
