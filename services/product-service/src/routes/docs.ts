import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ openapi: "3.0.0", info: { title: "product-service", version: "1.0.0" }, servers: [{ url: "http://localhost:4002" }], paths: { "/products": { get: { summary: "products API documentation" } } } }));
export default router;
