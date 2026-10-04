import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import docsRouter from "./routes/docs";
import { createProxyRouter } from "./routes/proxy";

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000", methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Authorization", "Content-Type", "x-request-id", "x-admin-key"] }));
app.use(express.json());
app.use(requestLogger);
app.use("/health", healthRouter);
app.use("/docs", docsRouter);
const services: Record<string, string | undefined> = { auth: process.env.AUTH_SERVICE_URL, products: process.env.PRODUCT_SERVICE_URL, inventory: process.env.INVENTORY_SERVICE_URL, cart: process.env.CART_SERVICE_URL, orders: process.env.ORDER_SERVICE_URL, payments: process.env.PAYMENT_SERVICE_URL, notifications: process.env.NOTIFICATION_SERVICE_URL };
for (const [name, url] of Object.entries(services)) if (url) app.use(`/api/${name}`, createProxyRouter(url));
app.use(errorHandler);
