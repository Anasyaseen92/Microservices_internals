import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "auth-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4001" }], paths: { "/auth": { get: { summary: "auth API documentation" } } } }));
export default router;
