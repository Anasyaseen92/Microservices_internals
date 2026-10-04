import type { RequestHandler } from "express";
// Temporary Phase 4 guard. Auth Service JWT verification will replace this in the HTTP phase.
export const requireTemporaryAdmin: RequestHandler = (req, res, next) => { if (req.header("x-admin-key") !== (process.env.ADMIN_API_KEY ?? "admin-dev-key")) return res.status(403).json({ error: { code: "ADMIN_REQUIRED", message: "Use the temporary x-admin-key header" } }); next(); };
