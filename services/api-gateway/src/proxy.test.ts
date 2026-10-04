import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

test("gateway proxy forwards method, body, authorization, and request ID", async () => {
  const downstream = http.createServer((req, res) => { let body = ""; req.on("data", chunk => body += chunk); req.on("end", () => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ method: req.method, body: JSON.parse(body), authorization: req.headers.authorization, requestId: req.headers["x-request-id"] })); }); });
  await new Promise<void>(resolve => downstream.listen(0, resolve));
  const address = downstream.address(); assert.ok(address && typeof address !== "string");
  process.env.AUTH_SERVICE_URL = `http://127.0.0.1:${address.port}`;
  const { app } = await import("./app"); const gateway = app.listen(0); const gatewayAddress = gateway.address(); assert.ok(gatewayAddress && typeof gatewayAddress !== "string");
  try { const response = await fetch(`http://127.0.0.1:${gatewayAddress.port}/api/auth/login`, { method: "POST", headers: { authorization: "Bearer demo", "content-type": "application/json", "x-request-id": "req-test" }, body: JSON.stringify({ email: "demo@example.com" }) }); const result = await response.json() as any; assert.equal(result.method, "POST"); assert.equal(result.body.email, "demo@example.com"); assert.equal(result.authorization, "Bearer demo"); assert.equal(result.requestId, "req-test"); } finally { gateway.close(); downstream.close(); }
});
