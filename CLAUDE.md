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

Next.js 16.2.2 App Router + React 19 + TypeScript. Path alias `@/*` → `src/*`.

### Auth & request flow

The app authenticates against an external API (`NEXT_PUBLIC_API_URL`) using OAuth2 password grant. JWTs live in **httpOnly cookies** (`access_token`, `refresh_token`).

- `src/proxy.ts` is the Next **middleware** (named export `proxy`). It acts as an **optimistic gatekeeper**, checking for session existence in cookies without network calls. It redirects unauthenticated users to `/login`.
- `src/lib/session.ts` owns cookie I/O and JWT decoding (sync, no network). It exports `currentSession`, `signIn`, `signOut`, and `writeTokens`. It uses `Buffer` for Node.js compatibility in the `proxy` runtime.
- `src/lib/api.ts` is the **centralized HTTP client**. It handles `baseUrl`, `Authorization` headers, and **automatic token refresh** via `ensureFreshToken`. It exports `apiFetch`, `rawFetch`, and `ApiError`.
- `src/lib/dal.ts` (Data Access Layer) provides the `requireUser` helper for Page components and Server Actions, ensuring authenticated access and returning user data.
- `src/lib/auth.ts` only exposes the user-facing `logout` server action.

### Data fetching pattern

Server actions in `src/app/<route>/action.ts` and `src/action/server/*.ts` use `apiFetch` or `rawFetch`.

1. `apiFetch<T>(path, init?)` is the default for authorized requests. It automatically adds the Bearer token, handles refresh-on-expiry, serializes plain object bodies to JSON, and unwraps `result.data`.
2. `rawFetch<T>(path, init?)` is used for pre-login endpoints (e.g., `/token`).
3. Both throw `ApiError` on non-OK responses, which contains the original response body for error handling.

Client components consume actions via TanStack Query. The `QueryClient` is provided through `src/components/template/query-provider.tsx`.

### URL-as-state filter pattern

The dashboard's filters and pagination live in **URL search params**, not React state. `src/hooks/use-tunkin-filter.ts` is the canonical example:

- Reads filters from `useSearchParams()`.
- Writes back through `router.replace(\`?${search.toString()}\`)`.
- Debounces writes by 400ms via `useDebounceCallback`.
- **Resets pagination (`page`, `size`) whenever any non-pagination filter changes.**

`TunkinComponent` then keys its React Query call on `params.toString()`, so URL changes automatically refetch.

### Upload flow (form + confirmation)

`src/hooks/upload-hook.ts` (`useTunkinFormDialog`) orchestrates the upload:

1. `react-hook-form` + `zodResolver` against `UploadTunkinSchema` (`src/tipes/tunkin.ts`).
2. On submit, first calls `cekExistingTunkin(periode)` server action.
3. If the period already exists, prompts the user with `window.confirm` before calling `doUpload`.
4. On success, invalidates the `["tunkin", params.toString()]` query so the table refetches.

### Component layout

- `src/components/ui/*` — shadcn/ui primitives.
- `src/components/template/*` — app shell (sidebar, header, theme, providers).
- `src/components/form/*` — Zod-bound form fields used with `react-hook-form`.
- `src/components/dashboard/*` — extracted filter sub-components.
- `src/components/commons/*` — `LoadingTable`, `PaginationBuilder`.

### Naming quirks

- `src/tipes/` (not `types/`) holds all shared TypeScript types and Zod schemas.
- `src/proxy.ts` is the Next 16 middleware convention (replaces `middleware.ts`).
- Indonesian copy/comments are standard.

### Env vars

Read from `process.env` in `src/lib/utils.ts` (`appConfig`):

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CLIENT_ID`, `NEXT_PUBLIC_CLIENT_SECRET`

## Graphify

`graphify-out/` exists at the repo root. Re-run `graphify update .` after non-trivial code changes.


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
