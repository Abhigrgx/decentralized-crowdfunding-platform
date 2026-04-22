import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
export function createApp() {
const app = express();

app.use(helmet());
app.use(
	cors({
		origin: true, // Allow all origins during development
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

return app;
}