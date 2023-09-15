import { Application } from "express";
import { events } from "./routes/events";

const routes = async (app: Application) => {
	events(app);
};

export default routes;
