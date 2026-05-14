# CONTEXT

Ground truth domain + architecture vocabulary. Update when terms drift.

## Domain

- **Tunkin** — *tunjangan kinerja*. Monthly performance allowance record per employee.
- **Periode** — `YYYYMM` string (e.g., `202605`). Composite key for a month of Tunkin data.
- **NIPAM** — employee number (internal payroll ID).
- **Organisasi / Org** — employing unit. `OrganizationMini = { org_id, org_name }`.
- **Upload** — Excel (.xls/.xlsx, ≤10MB) ingested via `POST /tunkin/upload` (multipart). Backend overwrites existing rows for the same `periode` silently — overwrite is a feature, not a bug.
- **Probe** — pre-upload existence check (`GET /tunkin/exists/:periode`). UX guard only, not a security boundary. Caller-driven: client may skip it.

## Auth model

- OAuth2 password grant against external API (`NEXT_PUBLIC_API_URL`).
- Tokens in **httpOnly cookies**: `access_token`, `refresh_token`.
- JWT payload = `JwtUserToken` (decoded, never verified locally — trust boundary is the API).
- **Optimistic proxy** (`src/proxy.ts`): cookie-existence check only, no network. Auth invariants live in actions/DAL.

## Architecture seams

Vocabulary follows the *deepening* glossary: module/interface/implementation/depth/seam/adapter/leverage/locality.

| Seam | Module | Role |
|---|---|---|
| Transport | `src/lib/api.ts` | `apiFetch` (authed) / `rawFetch` (pre-login) / `ApiError`. Auto refresh via `ensureFreshToken`. |
| Persistence | `src/lib/session.ts` | Cookie I/O + JWT decode. Sync, network-free. `currentSession`, `signIn/Out`, `writeTokens`. |
| Guard | `src/lib/dal.ts` | `requireUser` for pages + server actions. Redirects to `/login`. |
| Gatekeeper | `src/proxy.ts` | Next middleware. Optimistic redirect unauth → `/login`. |
| UX action | `src/lib/auth.ts` | `logout` server action. |

Real seams (≥2 adapters or distinct invariant per layer). Do not merge.

## Data flow conventions

- **Reads** → prefer RSC (`async function Page()`) + `apiFetch`. Avoid Server Actions for reads (Next 16: actions are public RPC, intended for mutations).
- **Mutations** → Server Actions in `src/app/<route>/action.ts`. Verify auth inside each action via `requireUser`.
- **Live/client reads** → server action only if the read is reactive to client input (e.g., upload probe). Otherwise fetch in RSC + hand to client as prop or hydrated query.
- **Pass-through actions** = anti-pattern. If an action only wraps `apiFetch` with no transform/guard, inline it or move the fetch to RSC.

## URL-as-state filter

- Filter values + pagination live in URL search params, not React state.
- Canonical hook: `src/hooks/use-tunkin-filter.ts`.
- Invariant: **changing any non-pagination field resets `page` and `size`**.
- TanStack Query keys on `params.toString()` → URL change auto-refetches.
- Debounce writes by 400ms (`useDebounceCallback`).

## Form patterns

- `react-hook-form` + `zodResolver`. Schemas in `src/tipes/*.ts`.
- Field wrappers in `src/components/form/*` (`InputZod`, `BulanZod`, `TahunZod`, `InputFileZod`) — currently 4 shallow Controllers, candidate for consolidation into one `ZodField`.
- **Upload + confirm flow** (`src/hooks/upload-hook.ts`):
  1. Validate via Zod.
  2. Probe `cekExistingTunkin(periode)`.
  3. If exists → `window.confirm` overwrite prompt.
  4. Submit `doUpload(formData)`.
  5. On success → invalidate `["tunkin", params.toString()]`.

## Naming quirks

- `src/tipes/` (not `types/`) — Indonesian spelling kept on purpose.
- `src/proxy.ts` — Next 16 middleware convention (replaces `middleware.ts`).
- Indonesian copy in UI is standard. Code identifiers stay English unless mirroring API (`is_exist`, `org_id`).
- API response wrapper: `BaseResponse<T> = { data, status, message, timestamp, request_id, errors? }`. `apiFetch` unwraps `.data`.

## Component layout

- `src/components/ui/*` — shadcn primitives.
- `src/components/template/*` — app shell (sidebar, header, theme, providers).
- `src/components/form/*` — Zod-bound form fields.
- `src/components/dashboard/*` — extracted filter sub-components.
- `src/components/commons/*` — `LoadingTable`, `PaginationBuilder`.

## Stack pinning

- Next.js 16.2.2, React 19, TypeScript, Turbopack.
- Bun (lockfile authoritative).
- Biome (lint + format + import sort). Tabs width 2, line width 80.
- TanStack Query v5. shadcn/ui (Tailwind v4). Sonner toasts.
- No test runner configured.
