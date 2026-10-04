import { Router } from "express";
import { z } from "zod";
const router = Router();
const input = z.object({ userId: z.string().min(1), orderId: z.string().min(1), totalAmount: z.number().nonnegative() });
router.post("/order-confirmation", (req, res, next) => { try { const data = input.parse(req.body); console.log(`[notification] Order confirmation: user=${data.userId} order=${data.orderId} total=$${data.totalAmount.toFixed(2)}`); return res.status(202).json({ data: { accepted: true } }); } catch (e) { next(e); } });
export default router;
