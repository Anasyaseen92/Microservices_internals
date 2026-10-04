import { Router } from "express";
import { z } from "zod";
import { requireUser, sameUser } from "../middleware/auth";
import { requestJson } from "../services/httpClient";
const router = Router();
type CartItem = { productId: string; quantity: number };
const carts = new Map<string, CartItem[]>();
const itemInput = z.object({ productId: z.string().min(1), quantity: z.number().int().positive() });
const getCart = (userId: string) => carts.get(userId) ?? [];
router.use("/:userId", requireUser, sameUser);
router.get("/:userId", (req, res) => res.json({ data: { userId: req.params.userId, items: getCart(req.params.userId) } }));
router.post("/:userId/items", async (req, res, next) => { try { const input = itemInput.parse(req.body); await requestJson(`${process.env.PRODUCT_SERVICE_URL ?? "http://localhost:4002"}/api/products/${input.productId}`, {}, req.header("x-request-id")); const items = getCart(req.params.userId); const existing = items.find(i => i.productId === input.productId); if (existing) existing.quantity += input.quantity; else items.push(input); carts.set(req.params.userId, items); return res.status(201).json({ data: { userId: req.params.userId, items } }); } catch (e: any) { if (e.status === 404) return res.status(404).json({ error: { code: "PRODUCT_NOT_FOUND", message: "Product does not exist" } }); if (e.name === "AbortError") return res.status(502).json({ error: { code: "PRODUCT_SERVICE_UNAVAILABLE", message: "Product Service is unavailable" } }); next(e); } });
router.patch("/:userId/items/:productId", (req, res, next) => { try { const amount = z.object({ quantity: z.number().int().positive() }).parse(req.body); const item = getCart(req.params.userId).find(i => i.productId === req.params.productId); if (!item) return res.status(404).json({ error: { code: "CART_ITEM_NOT_FOUND", message: "Cart item not found" } }); item.quantity = amount.quantity; return res.json({ data: { userId: req.params.userId, items: getCart(req.params.userId) } }); } catch (e) { next(e); } });
router.delete("/:userId/items/:productId", (req, res) => { const items = getCart(req.params.userId); const remaining = items.filter(i => i.productId !== req.params.productId); carts.set(req.params.userId, remaining); return res.json({ data: { userId: req.params.userId, items: remaining } }); });
router.delete("/:userId", (req, res) => { carts.delete(req.params.userId); return res.status(204).send(); });
// Product existence validation will be added when HTTP communication is introduced.
export default router;
