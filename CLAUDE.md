# CLAUDE.md

Guidance for Claude Code. Domain + architecture vocabulary lives in [CONTEXT.md](./CONTEXT.md) — read it first.

## Commands

Bun is the package manager (`bun.lock`, Dockerfile).

- `bun dev` — Next.js dev (Turbopack)
- `bun run build` — production build (`output: "standalone"`)
- `bun start` — serve built app
- `bun run lint` — Biome check (lint + format + import sort) — **run before done**
- `bun run format` — Biome write
- `docker compose up --build` — host `:3003` → container `:3000`, loads `.env.staging`

No test runner.

## Quick architecture map

Full detail in `CONTEXT.md`. Cheat sheet:

- `src/proxy.ts` — Next middleware, optimistic auth gatekeeper.
- `src/lib/{api,session,dal,auth}.ts` — transport / cookies+JWT / `requireUser` / `logout`. Real seams, don't merge.
- `src/app/<route>/action.ts`, `src/action/server/*` — Server Actions (mutations only; reads → RSC).
- `src/hooks/use-tunkin-filter.ts` — URL-as-state filter (canonical).
- `src/hooks/upload-hook.ts` — upload + overwrite-confirm flow.
- `src/components/{ui,template,form,dashboard,commons}/*` — see CONTEXT.md §Component layout.
- `src/tipes/*` — TypeScript types + Zod schemas (Indonesian spelling, intentional).
- `@/*` → `src/*`.

## Conventions

- **Reads in RSC, mutations in Server Actions.** No pass-through actions that only wrap `apiFetch`.
- **Auth inside every action** (`requireUser`) — `"use server"` exposes a public RPC endpoint.
- **URL = state** for filters/pagination. Don't mirror to React state.
- **Indonesian copy** in UI is standard. Identifiers stay English unless mirroring API fields.
- **Biome only** — no ESLint/Prettier. Tabs width 2, line width 80.

## Graphify

`graphify-out/` exists. Re-run `graphify update .` after non-trivial changes.

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
