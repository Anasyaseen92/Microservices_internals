import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "api-gateway", version: "1.0.0" }, servers: [{ url: "http://localhost:4000" }], paths: { "/health": { get: { summary: "health API documentation" } } } }));
export default router;
