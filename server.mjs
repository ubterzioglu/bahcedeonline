// Minimal Node entry that wraps the TanStack Start web-fetch handler
// and serves client-side assets from dist/client.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { lookup as mimeLookup } from "mrmime";

import serverEntry from "./dist/server/server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

function serveStatic(req, res, filePath) {
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return false;
  const type = mimeLookup(filePath) || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("content-type", type);
  res.setHeader("content-length", stat.size);
  if (filePath.includes(path.sep + "assets" + path.sep)) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  }
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function toWebRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || `${HOST}:${PORT}`;
  const url = `${proto}://${host}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((vv) => headers.append(k, vv));
    else if (v !== undefined) headers.set(k, String(v));
  }
  const method = req.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  return new Request(url, {
    method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    // @ts-expect-error Node undici Request supports duplex
    duplex: "half",
  });
}

async function sendWebResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((v, k) => res.setHeader(k, v));
  if (!response.body) return res.end();
  Readable.fromWeb(response.body).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const candidate = path.join(CLIENT_DIR, urlPath);

    if (
      candidate.startsWith(CLIENT_DIR) &&
      urlPath !== "/" &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      if (serveStatic(req, res, candidate)) return;
    }

    const request = toWebRequest(req);
    const response = await serverEntry.fetch(request, process.env, {});
    await sendWebResponse(res, response);
  } catch (err) {
    console.error("[server] request failed", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[bahcedeonline] listening on http://${HOST}:${PORT}`);
});
