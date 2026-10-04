import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
export const requestLogger: RequestHandler = (req, res, next) => { const requestId = req.header("x-request-id") ?? randomUUID(); res.setHeader("x-request-id", requestId); console.log(JSON.stringify({ requestId, method: req.method, path: req.path })); next(); };
