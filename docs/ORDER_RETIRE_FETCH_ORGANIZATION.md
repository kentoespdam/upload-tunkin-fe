# Order of Work — Retire `fetchOrganization` Pass-Through Action

Epic: `epic:auth-refactor` · Strategy: B1a (RSC fetch + prop-drill) + D2 (keep CommandDialog search).
Ground truth: [CONTEXT.md](../CONTEXT.md).

> **Aturan main**
> - **Konsultasi `context7` SEBELUM menulis kode** di setiap step yang punya label `context7-required`.
> - Patuhi *session close protocol* di `CLAUDE.md` (commit + push wajib).
> - Satu issue = satu commit. Jangan campur scope.
> - Jangan ubah komponen yang belum giliran — type-error sementara di hilir = OK.

## Checklist

### Step 1 — Fetch orgs server-side di dashboard page
- bd: `upload-tunkin-fe-ebt` · GH: [#9](https://github.com/kentoespdam/upload-tunkin-fe/issues/9)
- [ ] Konsultasi `context7` — pola RSC fetch + pass props ke client component.
- [ ] Modifikasi `src/app/dashboard/page.tsx` — fetch `OrganizationMini[]` server-side.
- [ ] Pass prop `orgs` ke `TunkinFilterComponent` dan `TunkinComponent` (signature anak belum perlu diubah; type-error hilir OK).
- [ ] `bun run build` hijau.
- [ ] Commit + push.

### Step 2 — Prop-drill jalur filter
- bd: `upload-tunkin-fe-aoj` · GH: [#10](https://github.com/kentoespdam/upload-tunkin-fe/issues/10)
- Prasyarat: Step 1 done.
- [ ] Konsultasi `context7` — props passing Server → Client multi-layer.
- [ ] `TunkinFilterComponent` terima + teruskan `orgs`.
- [ ] `FilterFields` terima + teruskan `orgs` ke `OrganizationList`.
- [ ] **Jangan** ubah `OrganizationList`.
- [ ] Commit + push.

### Step 3 — Prop-drill jalur dialog upload _(paralel dengan Step 2)_
- bd: `upload-tunkin-fe-11n` · GH: [#11](https://github.com/kentoespdam/upload-tunkin-fe/issues/11)
- Prasyarat: Step 1 done. Independent dari Step 2.
- [ ] Konsultasi `context7` — server wrapper + client form initial data.
- [ ] `TunkinComponent` terima + teruskan `orgs`.
- [ ] `TunkinFormDialog` terima + teruskan `orgs` ke `OrganizationList`.
- [ ] **Jangan** ubah `OrganizationList`.
- [ ] Commit + push.

### Step 4 — Refactor `OrganizationList`
- bd: `upload-tunkin-fe-0wk` · GH: [#12](https://github.com/kentoespdam/upload-tunkin-fe/issues/12)
- Prasyarat: Step 2 + Step 3 done.
- [ ] Konsultasi `context7` — controlled value + defaultValue sync di React 19.
- [ ] Tambah prop `orgs: OrganizationMini[]`.
- [ ] Hapus `useQuery`, `fetchOrganization` import, `LoadingSkeleton`, loading/error branches.
- [ ] Pertahankan `CommandDialog`, `CommandInput` (search), filter via `searchQuery`, `defaultValue` autoselect, `handleSelect`.
- [ ] Manual test: filter dashboard + form upload. Search-text + autoselect tetap bekerja.
- [ ] Commit + push.

### Step 5 — Hapus action + cleanup
- bd: `upload-tunkin-fe-20y` · GH: [#13](https://github.com/kentoespdam/upload-tunkin-fe/issues/13)
- Prasyarat: Step 4 done.
- [ ] `grep -rn fetchOrganization src/` → zero hit.
- [ ] Hapus `src/action/server/organization.ts`.
- [ ] Hapus dir kosong `src/action/server/` dan `src/action/` kalau juga kosong.
- [ ] `bun run lint` hijau.
- [ ] `bun run build` hijau.
- [ ] `graphify update .`.
- [ ] Commit pesan: `refactor(orgs): retire fetchOrganization pass-through action, fetch via RSC`.
- [ ] **Session close protocol** (`git pull --rebase` → `bd dolt push` → `git push`).

## Done = semua kotak ✓ dan `git status` shows "up to date with origin".

## Follow-ups (out of scope)

Tidak dikerjakan di epic ini, tapi catat untuk masa depan:
- Kandidat #4 — extract `useConfirmedMutation` dari `upload-hook.ts` (state machine probe→confirm→upload).
- Kandidat #2 — generalize `useTunkinFilter` jadi `useUrlFilter<T>` + unifikasi pagination dengan `pageable.tsx`.
- Kandidat #1 — konsolidasi 4 wrapper Zod field jadi satu `ZodField<TData>`.
- Ganti `window.confirm` dengan shadcn `AlertDialog` untuk overwrite UX.
