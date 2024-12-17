import compression from "compression";
import historyApiFallback from "connect-history-api-fallback";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { afterEach, describe, it, vi } from "vitest";
import routes from "../../src/back-end/routes";
import server from "../../src/back-end/server";
import service from "../../src/back-end/service";

vi.mock("compression", () => ({ default: vi.fn() }));
vi.mock("connect-history-api-fallback", () => ({ default: vi.fn() }));
vi.mock("cookie-parser", () => ({ default: vi.fn() }));
vi.mock("cors", () => ({ default: vi.fn((args) => args) }));
vi.mock("express", () => ({
	default: vi.fn(() => ({
		disable: vi.fn(),
		listen: vi.fn(),
		use: vi.fn(),
	})),
	json: vi.fn(),
	static: vi.fn(),
}));
vi.mock("http-terminator", () => ({ createHttpTerminator: vi.fn() }));
vi.mock("../../src/back-end/cronjobs", () => ({ stop: vi.fn() }));
vi.mock("../../src/back-end/routes", () => ({ default: vi.fn() }));
vi.mock("../../src/back-end/server", () => ({ default: 0 }));

describe("service", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.clearAllMocks();
		["SIGINT", "SIGTERM"].forEach((signal) =>
			process.removeAllListeners(signal),
		);
	});

	it("loads modules", ({ expect }) => {
		const app = express();

		service(app);

		expect(routes).toHaveBeenCalledWith(app);
		expect(app.use).toHaveBeenCalledWith(compression());
		expect(app.use).toHaveBeenCalledWith(cookieParser());
		expect(app.use).toHaveBeenCalledWith(express.json);
		expect(app.use).toHaveBeenCalledWith(express.static);
		expect(app.use).toHaveBeenCalledWith(historyApiFallback());
		expect(app.use).toHaveBeenCalledWith(server);
	});

	it("uses host and port parameters from env", ({ expect }) => {
		vi.stubEnv("host", "test");
		vi.stubEnv("port", "80");
		const app = express();

		service(app);

		expect(app.listen).toHaveBeenCalledWith(80, "test", expect.anything());
	});

	it("uses fallback host and port parameters if not in env", ({ expect }) => {
		const app = express();

		service(app);

		expect(app.listen).toHaveBeenCalledWith(
			3000,
			"localhost",
			expect.anything(),
		);
	});

	it("removes x-powered-by header", ({ expect }) => {
		const app = express();

		service(app);

		expect(app.disable).toHaveBeenCalledWith("x-powered-by");
	});

	it("uses cors middleware in dev/test", ({ expect }) => {
		vi.stubEnv("NODE_ENV", "test");
		const app = express();

		service(app);

		expect(app.use).toHaveBeenCalledWith(cors({ origin: "*" }));
	});

	it("doesn't use cors middleware in production", ({ expect }) => {
		vi.stubEnv("NODE_ENV", "production");
		const app = express();

		service(app);

		expect(app.use).not.toHaveBeenCalledWith(cors({ origin: "*" }));
	});
});
