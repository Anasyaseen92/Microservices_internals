import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "cart-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4004" }], paths: { "/cart": { get: { summary: "cart API documentation" } } } }));
export default router;
