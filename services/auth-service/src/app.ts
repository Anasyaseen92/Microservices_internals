import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import docsRouter from "./routes/docs";
import authRouter from "./routes/auth";

export const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/health", healthRouter);
app.use("/docs", docsRouter);
app.use("/api/auth", authRouter);
// Future routes and controllers for this service will be registered here.
app.use(errorHandler);
