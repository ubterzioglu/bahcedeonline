# AGENTS.md — bahcedeonline

Turkish-language venue website (cafe/bar) with menu display, song requests, and a password-protected admin panel. Built with TanStack Start (SSR), React 19, Supabase (DB + Auth + Storage), and Tailwind CSS v4.

## Commands

- `bun run dev` — Vite dev server (port 5173, or `$PORT`)
- `bun run build` — production build → `dist/`
- `bun run start` — production server (`node server.mjs`, port 3000)
- `bun run typecheck` — `tsc --noEmit`
- `bun run lint` — ESLint (Prettier integrated via eslint-plugin-prettier)
- `bun run format` — Prettier write

No test framework is configured.

## Architecture

**Runtime**: Custom Node HTTP server (`server.mjs`) wraps the TanStack Start SSR handler. Serves static assets from `dist/client/` and delegates all other requests to the TanStack entry. Admin API routes (`/api/admin/*`) are handled directly in `server.mjs` — not in TanStack.

**Package manager**: Bun (`bun.lockb`, `bunfig.toml`). Do not use npm/yarn/pnpm.

**Routing**: TanStack Router with file-based routing. Routes live in `src/routes/`. `src/routeTree.gen.ts` is **auto-generated** — never edit it. It is excluded from Prettier and linting.

**Vite plugin order matters** (`vite.config.ts`): `tsConfigPaths → tailwindcss → tanstackStart → viteReact`. `tanstackStart()` includes the TanStack Router plugin and MUST run before the React JSX transform.

**Path alias**: `@/*` → `./src/*` (configured in `tsconfig.json` paths + `vite-tsconfig-paths`).

**Supabase**: Client-side singleton at `src/integrations/supabase/client.ts` (lazy-initialized proxy). Database types at `src/integrations/supabase/types.ts`. Two Supabase clients exist:

- **Browser**: anon key (`VITE_SUPABASE_PUBLISHABLE_KEY`), used by the React app
- **Server** (admin API): service role key (`SUPABASE_SERVICE_ROLE_KEY`), used in `server.mjs` for elevated operations

**Admin auth**: Password-based. `ADMIN_PASSWORD` env var → HMAC-SHA256 session cookie (`bahce_admin_session`). No Supabase Auth for admin — purely cookie-based in `server.mjs`.

**User auth**: Supabase Auth for staff/admin roles (`src/hooks/useAuth.ts`, `user_roles` table).

**UI components**: shadcn/ui (new-york style, `components.json`). Add new ones via shadcn CLI. Components live in `src/components/ui/`.

**CSS**: Tailwind v4 with `@tailwindcss/vite` plugin. Main stylesheet: `src/styles.css`.

## Key directories

- `src/routes/` — file-based TanStack Router pages
- `src/routes/admin.*` — admin panel sub-routes
- `src/components/` — shared React components (SiteHeader, BottomNav, NowPlayingWidget, etc.)
- `src/lib/admin-api.ts` — client-side fetch wrapper for the admin REST API
- `src/integrations/supabase/` — Supabase client + generated DB types
- `supabase/migrations/` — SQL migration files
- `server.mjs` — production Node server + admin API

## Environment variables

Required (see `.env.example`):

| Variable                        | Usage                                                                     |
| ------------------------------- | ------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Supabase project URL (baked into client bundle at build time)             |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key (baked into client bundle at build time)                |
| `VITE_SUPABASE_PROJECT_ID`      | Supabase project ID                                                       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side admin Supabase access (runtime only, never exposed to client) |
| `ADMIN_PASSWORD`                | Admin panel login password (runtime only)                                 |

`VITE_*` vars are build-time — in Docker, they are passed as build-args (see `Dockerfile`).

## Deployment

Docker multi-stage build (`Dockerfile`) targeting Coolify:

1. `deps` — full install with devDeps
2. `builder` — `bun run build` with `VITE_*` build-args
3. `prod-deps` — production-only install
4. `runner` — slim runtime with `dist/`, `server.mjs`, production `node_modules`

Production runs `bun run server.mjs` on port 3000.

## Style / formatting

- Prettier: `printWidth: 100`, double quotes, trailing commas, semicolons
- ESLint: `@typescript-eslint/no-unused-vars` is **off**
- `noUnusedLocals` and `noUnusedParameters` are **off** in tsconfig

## Gotchas

- `src/routeTree.gen.ts` is auto-generated. Adding/removing a file in `src/routes/` regenerates it on next dev server start or build.
- ESLint ignores `dist`, `.output`, `.vinxi`.
- The admin API in `server.mjs` is a separate concern from the TanStack app — changes to admin endpoints must go in `server.mjs`, not in route files.
- `sideEffects: false` in `package.json` — tree-shaking is aggressive.
