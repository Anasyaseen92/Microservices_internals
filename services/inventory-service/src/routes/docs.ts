import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "inventory-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4003" }], paths: { "/inventory": { get: { summary: "inventory API documentation" } } } }));
export default router;
