import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ service: process.env.SERVICE_NAME ?? "order-service", status: "ok", timestamp: new Date().toISOString() }));
export default router;
