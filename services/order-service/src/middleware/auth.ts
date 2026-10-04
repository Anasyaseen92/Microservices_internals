import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
export const requireUser: RequestHandler = (req, res, next) => { const token = req.header("authorization")?.replace("Bearer ", ""); if (!token) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Bearer token required" } }); try { res.locals.user = jwt.verify(token, process.env.JWT_SECRET ?? "development-secret-change-me") as { id: string }; next(); } catch { return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } }); } };
export const sameUser: RequestHandler = (req, res, next) => { if (res.locals.user.id !== String(req.params.userId)) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Orders belong to another user" } }); next(); };
