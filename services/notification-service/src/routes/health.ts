import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ service: process.env.SERVICE_NAME ?? "notification-service", status: "ok", timestamp: new Date().toISOString() }));
export default router;
