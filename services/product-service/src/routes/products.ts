import { Router } from "express";
import { PrismaClient } from "../../prisma/generated/client";
import { z } from "zod";
import { requireTemporaryAdmin } from "../middleware/adminPlaceholder";

const router = Router(); const prisma = new PrismaClient();
const productInput = z.object({ name: z.string().min(2), description: z.string().min(1), price: z.number().nonnegative(), imageUrl: z.string().url(), category: z.string().min(1) });
const patchInput = productInput.partial().refine(v => Object.keys(v).length > 0, "At least one field is required");
router.get("/", async (req, res, next) => { try { const page = Math.max(1, Number(req.query.page ?? 1)); const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 12))); const search = String(req.query.search ?? ""); const category = req.query.category ? String(req.query.category) : undefined; const sort = String(req.query.sort ?? "newest"); const orderBy = sort === "price_asc" ? { price: "asc" as const } : sort === "price_desc" ? { price: "desc" as const } : { createdAt: "desc" as const }; const where = { ...(category ? { category } : {}), ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { description: { contains: search, mode: "insensitive" as const } }] } : {}) }; const [items, total] = await Promise.all([prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }), prisma.product.count({ where })]); return res.json({ data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }); } catch (e) { next(e); } });
router.get("/:id", async (req, res, next) => { try { const product = await prisma.product.findUnique({ where: { id: String(req.params.id) } }); if (!product) return res.status(404).json({ error: { code: "PRODUCT_NOT_FOUND", message: "Product not found" } }); return res.json({ data: product }); } catch (e) { next(e); } });
router.post("/", requireTemporaryAdmin, async (req, res, next) => { try { const input = productInput.parse(req.body); return res.status(201).json({ data: await prisma.product.create({ data: input }) }); } catch (e) { next(e); } });
router.patch("/:id", requireTemporaryAdmin, async (req, res, next) => { try { const input = patchInput.parse(req.body); const product = await prisma.product.update({ where: { id: String(req.params.id) }, data: input }); return res.json({ data: product }); } catch (e) { next(e); } });
router.delete("/:id", requireTemporaryAdmin, async (req, res, next) => { try { await prisma.product.delete({ where: { id: String(req.params.id) } }); return res.status(204).send(); } catch (e) { next(e); } });
export default router;
