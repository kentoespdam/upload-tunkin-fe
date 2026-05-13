# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **Bun** (see `bun.lock`, Dockerfile). Scripts:

- `bun dev` — Next.js dev server (Turbopack enabled via `next.config.ts`)
- `bun run build` — production build (`output: "standalone"`)
- `bun start` — serve the built app
- `bun run lint` — Biome check (lint + format + import sort)
- `bun run format` — Biome format write

Biome is the single source of truth for lint/format (no ESLint/Prettier). Indentation is **tabs, width 2**, line width 80. Domains `next` and `react` are enabled. Run `bun run lint` before considering work done.

There is no test runner configured.

Docker: `docker compose up --build` runs the app on host port 3003 → container 3000, loading `.env.staging`.

## Architecture

Next.js 16 App Router + React 19 + TypeScript. Path alias `@/*` → `src/*`.

### Auth & request flow

The app authenticates against an external API (`NEXT_PUBLIC_API_URL`) using OAuth2 password grant. JWTs live in **httpOnly cookies** (`access_token`, `refresh_token`), not in client state.

- `src/proxy.ts` is the Next **middleware** (its `config.matcher` export wires it in; the filename `proxy` is project-specific, not framework-magic). On every request it reads cookies via `getSession()`, redirects unauthenticated users to `/login`, and silently refreshes an expired access token via `POST {API}/refresh` before continuing.
- `src/lib/session.ts` owns all cookie I/O — `getSession`, `createSession`, `destroySession`, plus `decodeToken`/`getExpToken` which read JWT `exp` (in seconds, multiplied by 1000) to set the cookie expiry. **All session helpers are server-only** (`import "server-only"`). Anything that needs the user identity calls `getUser()` which decodes the access token.
- `src/lib/auth.ts` exposes `renewToken` and `logout` as server actions; both redirect on failure.
- `src/app/login/action.ts` (`doLogin`) is the server action that exchanges credentials for tokens and calls `createSession`.

Pages that need the user (e.g. `src/app/dashboard/template.tsx`) call `getUser()` directly in a server component and redirect to `/login` if it returns null. **Do not duplicate this auth check in client components** — middleware + the server `template.tsx` already gate access.

### Data fetching pattern

Server actions in `src/app/<route>/action.ts` and `src/action/server/*.ts` are the only place that talks to the backend API. They:

1. Read the bearer token with `getAccessToken()` (server-only).
2. Call `fetch(\`${appConfig.apiUrl}/...\`)` with `Authorization: Bearer`.
3. Return `result.data` (the API wraps responses in `BaseResponse<T>` / `PageResponse<T>` — see `src/tipes/commons.ts`).

Client components consume these via TanStack Query (`@tanstack/react-query`). The `QueryClient` is instantiated once in `src/app/template.tsx` and provided through `src/components/template/query-provider.tsx`. `refetchOnWindowFocus` is disabled globally.

### URL-as-state filter pattern

The dashboard's filters and pagination live in **URL search params**, not React state. `src/hooks/use-tunkin-filter.ts` is the canonical example:

- Reads filters from `useSearchParams()`.
- Writes back through `router.replace(\`?${search.toString()}\`)`.
- Debounces writes by 400ms via `useDebounceCallback`.
- **Resets pagination (`page`, `size`) whenever any non-pagination filter changes.**

`TunkinComponent` then keys its React Query call on `params.toString()`, so URL changes automatically refetch. When adding new filters, extend `FILTER_FIELDS` in this hook rather than introducing parallel state.

The required `periode` param (format `YYYYMM`) is defaulted by `src/app/dashboard/page.tsx` via a server-side redirect when missing.

### Upload flow (form + confirmation)

`src/hooks/upload-hook.ts` (`useTunkinFormDialog`) orchestrates the upload:

1. `react-hook-form` + `zodResolver` against `UploadTunkinSchema` (`src/tipes/tunkin.ts`) — enforces 10 MB max, xlsx/xls MIME types.
2. On submit, first calls `cekExistingTunkin(periode)` server action.
3. If the period already exists, prompts the user with `window.confirm` before calling `doUpload`.
4. On success, invalidates the `["tunkin", params.toString()]` query so the table refetches.

Mirror this "check-then-confirm-then-mutate" pattern for any other destructive mutations.

### Component layout

- `src/components/ui/*` — shadcn/ui (style: `new-york`, lucide icons, configured in `components.json`). Treat these as vendored primitives; modify with care.
- `src/components/template/*` — app shell (sidebar, header, theme, providers). `AppTemplate` wires `SidebarProvider` + `TemplateSidebar` + `TemplateHeader`.
- `src/components/form/*` — Zod-bound form fields (`InputZod`, `BulanZod`, `TahunZod`, `InputFileZod`) used with `react-hook-form`.
- `src/components/dashboard/*` — filter pieces (`FilterBadge`, `FilterFields`, `ActiveFilters`) extracted from the main filter component.
- `src/components/commons/*` — `LoadingTable`, `PaginationBuilder` (consumes `PageResponse<T>` from `commons.ts`).

### Naming quirks

- `src/tipes/` (not `types/`) holds all shared TypeScript types and Zod schemas. Indonesian word, used throughout — don't "fix" it.
- `src/proxy.ts` is the Next middleware. Renaming it would break the matcher wiring; convention is documented here so future readers don't search for `middleware.ts`.
- Comments and user-facing copy are in Indonesian (`id` is the default locale in `i18n-config.ts`). Preserve the existing language when editing strings.

### Env vars

Read from `process.env` in `src/lib/utils.ts` (`appConfig`):

- `NEXT_PUBLIC_API_URL` — backend base URL
- `NEXT_PUBLIC_CLIENT_ID`, `NEXT_PUBLIC_CLIENT_SECRET` — OAuth2 client creds (sent in form body to `/token`)
- `DEFAULT_TIMEZONE=Asia/Jakarta` — pinned in `next.config.ts`

## Graphify

`graphify-out/` exists at the repo root. Per the user's global rules, prefer the graphify MCP tools (`mcp_graphify_god_nodes`, `mcp_graphify_query_graph`, `mcp_graphify_shortest_path`) over recursive `grep`/`ls` when exploring. Re-run `graphify update .` after non-trivial code changes.


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
