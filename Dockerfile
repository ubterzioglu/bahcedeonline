# syntax=docker/dockerfile:1.7
# Multi-stage build for TanStack Start (web-fetch handler) wrapped by a small
# Node HTTP adapter (server.mjs). Coolify-ready: VITE_* are injected as
# build-args; runtime ships only production deps + dist + server.mjs.

# ─── Stage 1: full deps (incl. devDeps) for the build ────────────────────
FROM oven/bun:1.3 AS deps
WORKDIR /app
COPY package.json bun.lockb* bunfig.toml ./
RUN bun install --frozen-lockfile

# ─── Stage 2: production build ───────────────────────────────────────────
FROM oven/bun:1.3 AS builder
WORKDIR /app

# Supabase keys are baked into the client bundle at build time.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ─── Stage 3: production-only deps (smaller, no devDeps) ─────────────────
FROM oven/bun:1.3 AS prod-deps
WORKDIR /app
COPY package.json bun.lockb* bunfig.toml ./
RUN bun install --frozen-lockfile --production

# ─── Stage 4: runtime ────────────────────────────────────────────────────
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# curl is required so Coolify's default healthcheck command can run.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# oven/bun image already provides a non-root `bun` user.
COPY --from=prod-deps --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder  --chown=bun:bun /app/dist          ./dist
COPY --from=builder  --chown=bun:bun /app/server.mjs    ./server.mjs
COPY --from=builder  --chown=bun:bun /app/package.json  ./package.json

USER bun
EXPOSE 3000

CMD ["bun", "run", "server.mjs"]
