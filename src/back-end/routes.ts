import { Application } from "express";
import glitchWebhook from "./routes/glitch-webhook";
import reveal from "./routes/reveal";
import { storySSE } from "./routes/story-sse";
import vote from "./routes/vote";

const routes = async (app: Application) => {
	glitchWebhook(app);
	reveal(app);
	storySSE(app);
	vote(app);
};

export default routes;
