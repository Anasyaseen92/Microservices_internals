import { Router } from "express";
import { PrismaClient } from "../../prisma/generated/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();
const credentials = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(8).max(100) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const safeUser = (user: { id: string; name: string; email: string; role: string; createdAt: Date; updatedAt: Date }) => ({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });

router.post("/register", async (req, res, next) => { try { const input = credentials.parse(req.body); const exists = await prisma.user.findUnique({ where: { email: input.email } }); if (exists) return res.status(409).json({ error: { code: "EMAIL_EXISTS", message: "Email is already registered" } }); const user = await prisma.user.create({ data: { ...input, passwordHash: await bcrypt.hash(input.password, 10) }, }); return res.status(201).json({ data: safeUser(user) }); } catch (e) { next(e); } });
router.post("/login", async (req, res, next) => { try { const input = loginSchema.parse(req.body); const user = await prisma.user.findUnique({ where: { email: input.email } }); if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }); const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET ?? "development-secret-change-me", { expiresIn: "1h" }); return res.json({ data: { token, user: safeUser(user) } }); } catch (e) { next(e); } });
router.get("/me", requireAuth, async (req, res, next) => { try { const user = await prisma.user.findUnique({ where: { id: res.locals.user.id } }); if (!user) return res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User not found" } }); return res.json({ data: safeUser(user) }); } catch (e) { next(e); } });
export default router;
