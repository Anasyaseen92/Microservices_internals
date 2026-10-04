import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "notification-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4007" }], paths: { "/notifications": { get: { summary: "notifications API documentation" } } } }));
export default router;
