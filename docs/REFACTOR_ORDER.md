# Auth & HTTP Refactor — Order of Work

Epic: deepen the auth/HTTP modules. Goal: satu `apiFetch` deep module + DAL pattern (Next 16 best practice), proxy jadi optimistic gate tanpa network.

**Aturan kerja untuk semua issue:**

- WAJIB pakai `context7` MCP untuk cari referensi sebelum menulis kode. Query yang spesifik ditulis di tiap issue.
- High-level language di issue. Tidak perlu paste source code — junior dev / AI lokal yang menulisnya.
- Kerjakan **berurutan**. Jangan loncat — setiap step bergantung pada output step sebelumnya.
- Setiap selesai satu issue: `bd update <id> --notes="..."` dengan ringkasan, lalu `bd close <id>` dan tutup GH issue terkait, commit, push.
- Package manager: **Bun** (`bun.lock` ada). Bukan npm/pnpm/yarn.
- Linter: **Biome** via `bun run lint`. Tidak ada Prettier/ESLint sebagai pengganti.

---

## Order

| # | Beads ID | GH Issue | Judul | Depends on |
|---|---|---|---|---|
| 1 | `upload-tunkin-fe-e0w` | [#1](https://github.com/kentoespdam/upload-tunkin-fe/issues/1) | Upgrade Next.js 16.0.10 → 16.2.2 (+ best practices) | — |
| 2 | `upload-tunkin-fe-owr` | [#2](https://github.com/kentoespdam/upload-tunkin-fe/issues/2) | Bangun `lib/api.ts` (rawFetch + apiFetch + ApiError) | 1 |
| 3 | `upload-tunkin-fe-bd6` | [#3](https://github.com/kentoespdam/upload-tunkin-fe/issues/3) | Rewrite `lib/session.ts` (cookie + JWT decode, sync) | 1 |
| 4 | `upload-tunkin-fe-vs1` | [#4](https://github.com/kentoespdam/upload-tunkin-fe/issues/4) | DAL: `ensureFreshToken` (api.ts) + `requireUser` (dal.ts) | 2, 3 |
| 5 | `upload-tunkin-fe-hzt` | [#5](https://github.com/kentoespdam/upload-tunkin-fe/issues/5) | Slim `proxy.ts` — optimistic gate (no network) | 3 |
| 6 | `upload-tunkin-fe-3e0` | [#6](https://github.com/kentoespdam/upload-tunkin-fe/issues/6) | Migrasi caller → apiFetch/rawFetch/requireUser | 4, 5 |
| 7 | `upload-tunkin-fe-503` | [#7](https://github.com/kentoespdam/upload-tunkin-fe/issues/7) | Cleanup: hapus dead code & update `CLAUDE.md` | 6 |
| 8 | `upload-tunkin-fe-88v` | [#8](https://github.com/kentoespdam/upload-tunkin-fe/issues/8) | Verifikasi akhir: lint + build + smoke test | 7 |

---

## Critical path

```
1 ── 2 ─┐
   └─ 3 ┴─ 4 ─┐
       └─ 5 ─ 6 ── 7 ── 8
```

Step 2 & 3 dapat dikerjakan paralel oleh dua dev setelah step 1 selesai. Step 4 menunggu keduanya. Step 5 hanya menunggu step 3.

---

## Target arsitektur (rangkuman)

| Modul | Tanggung jawab | Interface |
|---|---|---|
| `src/proxy.ts` | Optimistic auth gate, cookie-only | (Next middleware default export) |
| `src/lib/session.ts` | Baca/tulis cookie, decode JWT (sync) | `currentSession`, `signIn`, `signOut`, `writeTokens`, `Session` |
| `src/lib/api.ts` | HTTP I/O + bearer + refresh-on-expiry | `rawFetch`, `apiFetch`, `ensureFreshToken`, `ApiError` |
| `src/lib/dal.ts` | Auth-untuk-page | `requireUser` |
| `src/lib/auth.ts` | Hanya server action user-facing | `logout` |

**Hilang setelah refactor:** `renewToken`, `fetch-helper.ts`, `getAccessToken`, `getUser`, `getSession`, `decodeToken`, `getExpToken`, `setCookies`, `refreshSession`, plus semua literal `Authorization: Bearer` di luar `lib/api.ts`.

---

## Commands cheat-sheet

```bash
bd ready                    # lihat issue yang siap dikerjakan
bd show <id>                # detail issue
bd update <id> --claim      # claim
bd update <id> --notes="…"  # tambah catatan progres
bd close <id>               # tutup setelah acceptance terpenuhi
bd dolt push && git push    # sync di akhir sesi
```
