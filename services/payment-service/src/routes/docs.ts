import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "payment-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4006" }], paths: { "/payments": { get: { summary: "payments API documentation" } } } }));
export default router;
