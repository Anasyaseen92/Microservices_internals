import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

export type AuthUser = { id: string; email: string; role: "CUSTOMER" | "ADMIN" };
export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.header("authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Bearer token required" } });
  try { res.locals.user = jwt.verify(token, process.env.JWT_SECRET ?? "development-secret-change-me") as AuthUser; next(); }
  catch { return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } }); }
};
