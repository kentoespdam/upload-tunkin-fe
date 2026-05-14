# Order of Work — Deepen Upload + Probe Flow & Surrounding Seams

Epic: `epic:upload-deepen` · Strategy: B2 (safeAction discriminated union) + RSC reads (Opsi 1) + deep `useUploadTunkin`.
Ground truth: [CONTEXT.md](../CONTEXT.md).

> **Aturan main**
> - **Konsultasi `context7` SEBELUM menulis kode** di setiap step yang punya label `context7-required`.
> - Patuhi *session close protocol* di `CLAUDE.md` (commit + push wajib).
> - Satu issue = satu commit. Jangan campur scope.
> - Jangan ubah komponen yang belum giliran — type-error sementara di hilir = OK.
> - Setelah perubahan non-trivial, jalankan `graphify update .`.

## Checklist

### Step 1 — Guard `cekExistingTunkin` Probe action
- bd: `upload-tunkin-fe-2p1` · GH: [#14](https://github.com/kentoespdam/upload-tunkin-fe/issues/14)
- Prasyarat: none.
- [x] Tambah `await requireUser()` di awal `cekExistingTunkin` (`src/app/dashboard/action.ts`).
- [x] Verifikasi happy-path Probe masih jalan di dialog upload.
- [x] Verifikasi unauthenticated caller → redirect `/login`.
- [x] `bun run lint` hijau.
- [x] Commit + push.

### Step 2 — `safeAction` adapter di transport seam
- bd: `upload-tunkin-fe-q7s` · GH: [#15](https://github.com/kentoespdam/upload-tunkin-fe/issues/15)
- Prasyarat: Step 1 done (independent secara teknis, tapi ikut urutan dependency `pkn`).
- [x] Konsultasi `context7` — `isRedirectError` + Server Action error semantics di Next 16.
- [x] Tambah `safeAction<T>(fn)` di `src/lib/api.ts` dengan tipe `ActionResult<T> = { ok: true; data } | { ok: false; status; message; errors? }`.
- [x] Rethrow `NEXT_REDIRECT` via `isRedirectError` (gotcha load-bearing — tanpa ini, redirect dari `ensureFreshToken` ditelan jadi toast "Network error").
- [x] Refactor `doUpload` → 1 baris `safeAction(() => apiFetch(...))`. Buang try/catch reshape + fake `BaseResponse` (`timestamp`, `request_id: "local"`).
- [x] Refactor `doLogin` → `safeAction` dengan `signIn(result)` di dalam `fn`.
- [x] **Jangan** ubah `upload-hook.ts` callsite di step ini — biarkan type-error hilir; `pkn` akan switch ke `if (!result.ok)`.
- [x] **Jangan** fold `safeAction` ke `apiFetch` — RSC reads butuh throw (Next error boundary).
- [x] `bun run lint` hijau.
- [x] Commit + push.

### Step 3 — `fetchTunkin` → RSC + Context + `useTransition`
- bd: `upload-tunkin-fe-1j1` · GH: [#16](https://github.com/kentoespdam/upload-tunkin-fe/issues/16)
- Prasyarat: Step 1 done. Independent dari Step 2.
- [x] Konsultasi `context7` — RSC fetch + `Promise.all` + `useTransition` pending state untuk URL-as-state filter.
- [x] `page.tsx`: `Promise.all([apiFetch orgs, apiFetch /tunkin/${periode}?...])`. Path identik dengan `fetchTunkin` sekarang.
- [x] New file `src/app/dashboard/filter-provider.tsx` — `"use client"` Context provider, owns `useTunkinFilter()`. Throws kalau dipakai di luar provider.
- [x] `use-tunkin-filter.ts`: tambah `useTransition`, wrap `replaceUrl` invocation di `startTransition`, expose `isPending`. Debounce 400ms tetap.
- [x] `component.tsx`: hapus `useQuery`, `useTunkinData`, `currentView`, `isSwapping`, `PRESENCE_EXIT_MS`, dan crossfade `useEffect`. Terima `data: PageResponse<Tunkin>` sebagai prop. Pakai `useFilterContext().isPending` untuk overlay (`opacity-60 pointer-events-none`).
- [x] `filter.tsx`: switch ke `useFilterContext()` (share instance hook).
- [x] Wrap dashboard children dengan `<DashboardFilterProvider>` di `page.tsx`.
- [x] Hapus `fetchTunkin` dari `src/app/dashboard/action.ts`.
- [x] **Jangan** ubah `upload-hook.ts` invalidation di step ini — `pkn` akan switch ke `router.refresh()`.
- [x] TanStack `QueryClient` + provider TETAP (masih dipakai `cekExistingTunkin` mutation di `pkn`).
- [x] Manual test: ganti filter → tabel tidak unmount, overlay opacity terlihat.
- [x] `bun run lint` hijau. `bun run build` hijau.
- [x] Commit + push.

### Step 4 — Deep `useUploadTunkin` + `<UploadTunkinDialog>`
- bd: `upload-tunkin-fe-pkn` · GH: [#17](https://github.com/kentoespdam/upload-tunkin-fe/issues/17)
- Prasyarat: Step 1 (2p1) + Step 2 (q7s) done. Idealnya Step 3 (1j1) juga sudah landed agar bisa langsung pakai `router.refresh()`.
- [x] Konsultasi `context7` — controlled `AlertDialog` (shadcn) + promise-resolving confirm pattern, plus `react-hook-form` lifecycle inside dialog.
- [x] New file `src/hooks/use-upload-tunkin.ts`:
  - Interface: `phase: UploadPhase`, `error: Error|null`, `submit(values) → Promise<UploadResult>`, opsi `{ confirmOverwrite, onSuccess? }`.
  - Tidak boleh import `@tanstack/react-query`, `next/navigation`, `react-hook-form`, atau `@hookform/resolvers`.
  - Policy: validate (caller-side via Zod) → `cekExistingTunkin` → if `is_exist` → `await confirmOverwrite(periode)` → if confirmed → `doUpload`.
  - **Probe failure = BLOCKING** → resolve `{ ok: false, reason: "probe-failed" }`. Jangan fall-through ke upload.
  - Pakai `if (!result.ok)` (hasil `safeAction`), bukan `throw data.errors`.
- [x] New file `src/components/form/upload-tunkin-dialog.tsx` (adapted dari `src/app/dashboard/form-dialog.tsx`):
  - Owns `useForm(UploadTunkinSchema)`.
  - Owns controlled `AlertDialog` untuk overwrite-confirm; periode visible di body dialog; tombol "Lanjut overwrite" + "Batal" resolve promise dari `confirmOverwrite`.
  - Owns `useSearchParams` + `router.refresh()` (atau `queryClient.invalidateQueries` jika Step 3 belum landed) di `onSuccess`.
- [x] Update `src/app/dashboard/form-dialog.tsx` callsite ke wrapper baru (atau hapus & gantikan dengan `<UploadTunkinDialog>`).
- [x] Hapus `window.confirm` dari `upload-hook.ts` lama.
- [x] Pastikan `doUpload` action sekarang hanya raw POST multipart (tidak ada try/catch reshape — itu Step 2).
- [x] Manual test: upload periode baru (langsung sukses), upload periode existing (alert dialog muncul, batal & lanjut keduanya berjalan), simulasi probe error (toast blokir).
- [x] `bun run lint` hijau. `bun run build` hijau.
- [x] Commit + push.

### Step 5 — `ZodField` consolidation
- bd: `upload-tunkin-fe-5zd` · GH: [#18](https://github.com/kentoespdam/upload-tunkin-fe/issues/18)
- Prasyarat: independent. Boleh paralel dengan Step 3 atau setelah Step 4. Disarankan setelah Step 4 agar callsite `form-dialog.tsx` sudah stabil.
- [x] New file `src/tipes/options.ts` — export `BULAN_OPTIONS` (12 bulan `01`–`12`) dan `TAHUN_OPTIONS` (tahun sekarang − 4).
- [x] New file `src/components/form/zod-field.tsx`:
  - `ZodFieldProps<T>` discriminated union: `variant: "text" | "select" | "file"`.
  - Satu `Controller`, satu `<Field>/<FieldLabel>/<FieldError>` shell. Variant switch pilih `Input` | `Select` | `Input type="file"`.
  - Number/float coerce via `Number()` di `onChange`; file extract `files?.[0]`.
  - **`FieldError` selalu di-render saat `fieldState.invalid`** (termasuk variant `select` — ini bug fix).
- [x] Update `src/tipes/form-zod.ts`: collapse jadi `ZodFieldProps`. Hapus `BaseZodProps` / `InputTextZodProps` / `InputFileZodProps` + phantom `fileRef`.
- [x] Migrate callsites:
  - `src/app/login/login-form.tsx`: `InputZod` → `ZodField variant="text"`.
  - `src/app/dashboard/form-dialog.tsx` (atau `upload-tunkin-dialog.tsx` setelah Step 4):
    - `TahunZod` → `ZodField variant="select" options={TAHUN_OPTIONS}`.
    - `BulanZod` → `ZodField variant="select" options={BULAN_OPTIONS}`.
    - `InputFileZod` → `ZodField variant="file" accept=".xlsx,.xls"`.
- [x] Hapus file lama: `input-zod.tsx`, `bulan-zod.tsx`, `tahun-zod.tsx`, `file-zod.tsx`.
- [x] `grep -rn "InputZod\|BulanZod\|TahunZod\|InputFileZod" src/` → zero hit.
- [x] Manual test: form login + dialog upload — visual parity, FieldError muncul di semua variant saat invalid.
- [x] `bun run lint` hijau. `bun run build` hijau.
- [x] Commit + push.

### Step 6 — Cleanup dead click-outside handler
- bd: `upload-tunkin-fe-xax` · GH: [#19](https://github.com/kentoespdam/upload-tunkin-fe/issues/19)
- Prasyarat: independent. Recommended last karena trivial.
- [x] Decide: hapus effect+ref, atau localize state non-URL dengan komentar yang jelas kenapa di luar `useTunkinFilter`.
- [x] No empty-bodied effects in `filter.tsx`.
- [x] Filter behavior unchanged.
- [x] `bun run lint` hijau.
- [x] Commit + push.

### Step 7 — Session close
- [x] `grep -rn "fetchTunkin\|InputZod\|BulanZod\|TahunZod\|InputFileZod\|window.confirm" src/` → zero hit (selain definisi `ZodField` itu sendiri tidak pakai nama lama).
- [x] `bun run lint` hijau.
- [x] `bun run build` hijau.
- [x] `graphify update .`.
- [x] **Session close protocol** (`git pull --rebase` → `bd dolt push` → `git push`).

## Dependency graph

```
2p1 ─┐
     ├─► pkn ─► 5zd (optional ordering)
q7s ─┤
     │
1j1 ─┘ (independent, but should land before pkn to enable router.refresh())

xax ─ independent, trivial
```

## Done = semua kotak ✓ dan `git status` shows "up to date with origin".

## Follow-ups (out of scope di epic ini)

- `z74` — koordinasi BE: Probe→Upload race (preferred fix = `409` dari `/tunkin/upload` saat periode muncul setelah probe window).
- Generalize `useTunkinFilter` → `useUrlFilter<T>` + unifikasi pagination dengan `pageable.tsx`.
- Probe SLA / observability dengan tim BE.
