# syntax=docker/dockerfile:1.7
# Multi-stage build for TanStack Start (Node / Nitro target) behind Bun builder.
# Coolify-ready: build-args inject VITE_* at build time, runtime serves via Node.

# ─── Stage 1: dependencies ────────────────────────────────────────────────
FROM oven/bun:1.3 AS deps
WORKDIR /app
COPY package.json bun.lockb* bunfig.toml ./
RUN bun install --frozen-lockfile

# ─── Stage 2: build ───────────────────────────────────────────────────────
FROM oven/bun:1.3 AS builder
WORKDIR /app

# Supabase env-vars are baked into the client bundle at build time.
# Pass these as --build-arg in Coolify / docker build.
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

# ─── Stage 3: runtime ─────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Non-root user
RUN addgroup -S app && adduser -S app -G app

# Only the Vite build output is needed at runtime
COPY --from=builder --chown=app:app /app/dist ./dist

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/ >/dev/null 2>&1 || exit 1

CMD ["node", "dist/server/server.js"]
