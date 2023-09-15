import { Application } from "express";
import { events } from "./routes/events";
import glitchWebhook from "./routes/glitch-webhook";

const routes = async (app: Application) => {
	events(app);
	glitchWebhook(app);
};

export default routes;
