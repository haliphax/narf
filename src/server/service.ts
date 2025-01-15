import compression from "compression";
import historyApiFallback from "connect-history-api-fallback";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Application, json, static as static_ } from "express";
import { createHttpTerminator } from "http-terminator";
import cronjobs from "./cronjobs";
import routes from "./routes";
import server from "./server";

const service = (app: Application) => {
	const host = process.env.host ?? "localhost";
	const port = parseInt(process.env.port ?? "3000");

	if (process.env.NODE_ENV !== "production") {
		app.use(cors({ origin: "*" }));
	}

	app.use(compression());
	app.use(json({ limit: "10mb" }));
	app.use(cookieParser());
	app.use(server);
	routes(app);
	app.use(historyApiFallback());
	app.use(static_("dist"));

	app.disable("x-powered-by");

	const listener = app.listen(port, host, () =>
		console.log(`Server listening at http://${host}:${port}`),
	);
	const terminator = createHttpTerminator({ server: listener });
	const shutdown = () => {
		console.log("Terminating");
		cronjobs.stop();

		// await promise by wrapping in try/finally
		try {
			terminator.terminate();
		} finally {
			//
		}

		process.exit(0);
	};

	["SIGINT", "SIGTERM"].forEach((signal) => process.on(signal, shutdown));
};

export default service;
