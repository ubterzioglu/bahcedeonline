// Minimal Node entry that wraps the TanStack Start web-fetch handler
// and serves client-side assets from dist/client.
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { lookup as mimeLookup } from "mrmime";
import { createClient } from "@supabase/supabase-js";

import serverEntry from "./dist/server/server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const ADMIN_COOKIE_NAME = "bahce_admin_session";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

let adminSupabase;

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

function json(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(data));
}

function parseCookies(req) {
  const raw = req.headers.cookie;
  if (!raw) return {};
  return Object.fromEntries(
    raw.split(";").map((part) => {
      const index = part.indexOf("=");
      const key = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      return [key, decodeURIComponent(value)];
    }),
  );
}

function getAdminCookieValue() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return crypto.createHmac("sha256", password).update("bahcedeonline-admin").digest("hex");
}

function isAdminAuthenticated(req) {
  const expected = getAdminCookieValue();
  const current = parseCookies(req)[ADMIN_COOKIE_NAME];
  if (!expected || !current) return false;

  const currentBuffer = Buffer.from(current);
  const expectedBuffer = Buffer.from(expected);

  return (
    currentBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(currentBuffer, expectedBuffer)
  );
}

function buildSessionCookie(req, value, maxAge) {
  const isSecure = (req.headers["x-forwarded-proto"] || "").toString().includes("https");
  return [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    isSecure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}

function getAdminSupabase() {
  if (adminSupabase) return adminSupabase;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL/VITE_SUPABASE_URL for admin API.",
    );
  }

  adminSupabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminSupabase;
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleAdminApi(req, res) {
  const pathname = decodeURIComponent((req.url || "/").split("?")[0]);

  if (pathname === "/api/admin/session" && req.method === "GET") {
    return json(res, 200, { authenticated: isAdminAuthenticated(req) });
  }

  if (pathname === "/api/admin/login" && req.method === "POST") {
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) {
      return json(res, 500, { error: "ADMIN_PASSWORD tanımlı değil." });
    }

    const body = await readJsonBody(req);
    if (typeof body.password !== "string" || body.password.length === 0) {
      return json(res, 400, { error: "Parola gerekli." });
    }

    const incoming = Buffer.from(body.password);
    const expected = Buffer.from(expectedPassword);
    const valid = incoming.length === expected.length && crypto.timingSafeEqual(incoming, expected);

    if (!valid) {
      return json(res, 401, { error: "Parola hatalı." });
    }

    return json(
      res,
      200,
      { authenticated: true },
      { "set-cookie": buildSessionCookie(req, getAdminCookieValue(), ADMIN_COOKIE_MAX_AGE) },
    );
  }

  if (pathname === "/api/admin/logout" && req.method === "POST") {
    return json(res, 200, { ok: true }, { "set-cookie": buildSessionCookie(req, "", 0) });
  }

  if (!isAdminAuthenticated(req)) {
    return json(res, 401, { error: "Admin oturumu gerekli." });
  }

  const supabase = getAdminSupabase();

  if (pathname === "/api/admin/dashboard" && req.method === "GET") {
    const [
      { count: menuCount, error: menuError },
      { count: pendingCount, error: pendingError },
      { data: now, error: nowError },
    ] = await Promise.all([
      supabase.from("menu_items").select("*", { count: "exact", head: true }),
      supabase
        .from("song_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("now_playing").select("track_title, artist").eq("id", 1).maybeSingle(),
    ]);
    const error = menuError || pendingError || nowError;
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { stats: { menu: menuCount ?? 0, pending: pendingCount ?? 0 }, now });
  }

  if (pathname === "/api/admin/menu" && req.method === "GET") {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("sort_order");
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, data ?? []);
  }

  if (pathname === "/api/admin/menu" && req.method === "POST") {
    const payload = await readJsonBody(req);
    const { data, error } = await supabase.from("menu_items").insert(payload).select("*").single();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, data);
  }

  if (pathname === "/api/admin/menu/upload" && req.method === "POST") {
    const request = toWebRequest(req);
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return json(res, 400, { error: "Yüklenecek dosya bulunamadı." });
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const objectPath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from("menu-images").upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) return json(res, 500, { error: error.message });
    const { data } = supabase.storage.from("menu-images").getPublicUrl(objectPath);
    return json(res, 200, { publicUrl: data.publicUrl });
  }

  if (pathname.startsWith("/api/admin/menu/")) {
    const id = pathname.slice("/api/admin/menu/".length);
    if (req.method === "PUT") {
      const payload = await readJsonBody(req);
      const { data, error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
      if (error) return json(res, 500, { error: error.message });
      return json(res, 200, data);
    }
    if (req.method === "DELETE") {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) return json(res, 500, { error: error.message });
      return json(res, 200, { ok: true });
    }
  }

  if (pathname === "/api/admin/song-requests" && req.method === "GET") {
    const { data, error } = await supabase
      .from("song_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, data ?? []);
  }

  if (pathname.startsWith("/api/admin/song-requests/")) {
    const id = pathname.slice("/api/admin/song-requests/".length);
    if (req.method === "PATCH") {
      const payload = await readJsonBody(req);
      const { data, error } = await supabase
        .from("song_requests")
        .update({ status: payload.status })
        .eq("id", id)
        .select("*")
        .single();
      if (error) return json(res, 500, { error: error.message });
      return json(res, 200, data);
    }
    if (req.method === "DELETE") {
      const { error } = await supabase.from("song_requests").delete().eq("id", id);
      if (error) return json(res, 500, { error: error.message });
      return json(res, 200, { ok: true });
    }
  }

  if (pathname === "/api/admin/now-playing" && req.method === "GET") {
    const { data, error } = await supabase
      .from("now_playing")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, data);
  }

  if (pathname === "/api/admin/now-playing" && req.method === "PUT") {
    const payload = await readJsonBody(req);
    const { error } = await supabase.from("now_playing").update(payload).eq("id", 1);
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { ok: true });
  }

  return json(res, 404, { error: "Admin API yolu bulunamadı." });
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
    if ((req.url || "").startsWith("/api/admin/")) {
      await handleAdminApi(req, res);
      return;
    }

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
