import { Router } from "express";
import { z } from "zod";
const router = Router();
type Stock = { productId: string; quantity: number };
// Inventory owns this temporary in-memory store. A future phase can move it to its own database.
const stock = new Map<string, Stock>(Array.from({ length: 12 }, (_, i) => { const productId = `product-${String(i + 1).padStart(3, "0")}`; return [productId, { productId, quantity: 10 }] as const; }));
const input = z.object({ productId: z.string().min(1), quantity: z.number().int().nonnegative() });
const quantity = z.object({ quantity: z.number().int().positive() });
router.get("/", (_req, res) => res.json({ data: [...stock.values()] }));
router.get("/:productId", (req, res) => { const item = stock.get(req.params.productId); return item ? res.json({ data: item }) : res.status(404).json({ error: { code: "STOCK_NOT_FOUND", message: "Inventory record not found" } }); });
router.post("/", (req, res, next) => { try { const item = input.parse(req.body); if (stock.has(item.productId)) return res.status(409).json({ error: { code: "STOCK_EXISTS", message: "Inventory record already exists" } }); const created = { ...item }; stock.set(item.productId, created); return res.status(201).json({ data: created }); } catch (e) { next(e); } });
router.patch("/:productId", (req, res, next) => { try { const current = stock.get(req.params.productId); if (!current) return res.status(404).json({ error: { code: "STOCK_NOT_FOUND", message: "Inventory record not found" } }); const updated = { ...current, quantity: quantity.parse(req.body).quantity }; stock.set(updated.productId, updated); return res.json({ data: updated }); } catch (e) { next(e); } });
router.post("/:productId/reduce", (req, res, next) => { try { const current = stock.get(req.params.productId); if (!current) return res.status(404).json({ error: { code: "STOCK_NOT_FOUND", message: "Inventory record not found" } }); const amount = quantity.parse(req.body).quantity; if (current.quantity < amount) return res.status(409).json({ error: { code: "INSUFFICIENT_STOCK", message: "Not enough stock" } }); const updated = { ...current, quantity: current.quantity - amount }; stock.set(updated.productId, updated); return res.json({ data: updated }); } catch (e) { next(e); } });
router.post("/:productId/restore", (req, res, next) => { try { const current = stock.get(req.params.productId); if (!current) return res.status(404).json({ error: { code: "STOCK_NOT_FOUND", message: "Inventory record not found" } }); const updated = { ...current, quantity: current.quantity + quantity.parse(req.body).quantity }; stock.set(updated.productId, updated); return res.json({ data: updated }); } catch (e) { next(e); } });
export default router;
