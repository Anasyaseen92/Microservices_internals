import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

export function proxy(target: string): RequestHandler {
  return async (req, res) => {
    const requestId = req.header("x-request-id") ?? randomUUID();
    const url = `${target}${req.originalUrl}`;
    const headers: Record<string, string> = { "content-type": "application/json", "x-request-id": requestId };
    if (req.header("authorization")) headers.authorization = req.header("authorization")!;
    if (req.header("x-admin-key")) headers["x-admin-key"] = req.header("x-admin-key")!;
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), Number(process.env.HTTP_TIMEOUT_MS ?? 5000));
    try {
      const response = await fetch(url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body), signal: controller.signal });
      const text = await response.text(); res.status(response.status).setHeader("x-request-id", requestId); if (text) res.type(response.headers.get("content-type") ?? "application/json").send(text); else res.send();
    } catch (error) { console.error(`[gateway] ${req.method} ${url} failed`, error); res.status(502).json({ error: { code: "DOWNSTREAM_UNAVAILABLE", message: "Downstream service is unavailable", requestId } }); }
    finally { clearTimeout(timer); }
  };
}

export const createProxyRouter = (target: string) => { const router = Router(); router.use(proxy(target)); return router; };
