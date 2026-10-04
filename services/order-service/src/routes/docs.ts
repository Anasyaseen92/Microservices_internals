import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "order-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4005" }], paths: { "/orders": { get: { summary: "orders API documentation" } } } }));
export default router;
