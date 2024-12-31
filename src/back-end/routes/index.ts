import { Application } from "express";
import { events } from "./events";

const routes = (app: Application) => {
	events(app);
};

export default routes;
