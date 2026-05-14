# Project Context (CLAUDE.md)

> **⚠️ WORKFLOW RULES:** For agent workflows, issue tracking (`bd`), mandatory codebase exploration (`graphify`), documentation (`context7`), and session completion rules, you **MUST** refer to `agent.md`.
> **📚 DOMAIN VOCABULARY:** See `CONTEXT.md` for full architecture details.

## Commands (Bun)
*   **Dev/Build:** `bun dev` (Turbopack) | `bun run build` (standalone) | `bun start`
*   **Quality Gates:** `bun run lint` (Biome check - **run before done**) | `bun run format`
*   **Docker:** `docker compose up --build` (host `:3003` → container `:3000`, uses `.env.staging`)
*   *Note: No test runner.*

## Architecture & Conventions
*   **Data Fetching:** Reads in RSC. Mutations in Server Actions only (`src/app/<route>/action.ts`, `src/action/server/*`). No pass-through actions.
*   **Auth & Security:** `"use server"` exposes public RPCs. You MUST enforce `requireUser` inside every action. Optimistic gatekeeper in `src/proxy.ts`. Transport/JWT seams in `src/lib/`.
*   **State Management:** URL = state for filters/pagination (use `src/hooks/use-tunkin-filter.ts`). Do not mirror URL state to React state.
*   **Language:** Indonesian copy for UI. English for identifiers (unless mirroring API fields). Types/Zod schemas live in `src/tipes/*`.
*   **Code Style:** Biome only (No ESLint/Prettier). Tab width 2, line width 80.

## Graphify Status
`graphify-out/` exists. Re-run `graphify update .` after non-trivial changes to keep the knowledge graph current for codebase queries.