import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
const router = Router();
type Payment = { transactionId: string; amount: number; status: "SUCCESS" | "FAILED" };
const payments = new Map<string, Payment>();
const input = z.object({ cardNumber: z.string().regex(/^\d{12,19}$/), amount: z.number().positive(), currency: z.string().length(3).default("USD") });
router.post("/process", (req, res, next) => { try { const data = input.parse(req.body); const transactionId = `txn_${randomUUID()}`; const status = data.cardNumber.endsWith("0000") ? "FAILED" : "SUCCESS"; const payment = { transactionId, amount: data.amount, status } as Payment; payments.set(transactionId, payment); // Never retain or log the full card number. A provider such as Stripe can replace this fake processor later.
return res.status(status === "SUCCESS" ? 201 : 402).json({ data: payment }); } catch (e) { next(e); } });
router.get("/:transactionId", (req, res) => { const payment = payments.get(req.params.transactionId); return payment ? res.json({ data: payment }) : res.status(404).json({ error: { code: "PAYMENT_NOT_FOUND", message: "Transaction not found" } }); });
export default router;
