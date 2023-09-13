import compression from "compression";
import historyApiFallback from "connect-history-api-fallback";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
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
app.use(express.static("dist/front-end"));

app.listen(port, host, () =>
	console.log(`Server listening at http://${host}:${port}`)
);
