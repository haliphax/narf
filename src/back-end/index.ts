import compression from "compression";
import historyApiFallback from "connect-history-api-fallback";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createHttpTerminator } from "http-terminator";
import cronjobs from "./cronjobs";
import routes from "./routes";
import server from "./server";

const host = process.env.host ?? "localhost";
const port = parseInt(process.env.port ?? "3000");
const app = express();

if (process.env.NODE_ENV !== "production") {
	app.use(cors({ origin: "*" }));
}

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(server);
routes(app);
app.use(historyApiFallback());
app.use(express.static("dist"));

app.disable("x-powered-by");

const listener = app.listen(port, host, () =>
	console.log(`Server listening at http://${host}:${port}`),
);
const terminator = createHttpTerminator({ server: listener });
const shutdown = async () => {
	console.log("Terminating");
	cronjobs.stop();
	await terminator.terminate();
	process.exit(0);
};

["SIGINT", "SIGTERM"].forEach((signal) => process.on(signal, shutdown));
