# SENTEK - Saha Entegre Narkotik Test Yazılımı

## Project Overview
SENTEK is a full MVP security technology platform for customs/narcotics field operations. React+Vite PWA, 2026 dark enterprise UI (deep navy #080d1a + cyan #00D4FF accents, aurora/mesh gradients, glassmorphism, Space Grotesk display font, framer-motion). All UI in Turkish, all state is mock/local with IndexedDB (Dexie.js).

## Architecture
- **Stack**: React 18, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, framer-motion, recharts, wouter, Dexie.js, Leaflet
- **Auth**: localStorage-based demo auth with 5 roles. `AuthContext` handles login/logout and routing.
- **State**: `DataContext` + Dexie.js IndexedDB. `useLiveQuery` for reactive data. Seeded once from `mockData.ts`.
- **Routing**: wouter with `base` set to `import.meta.env.BASE_URL`
- **Artifact**: `artifacts/sentek`, preview path `/`, workflow: `artifacts/sentek: web`

## Roles & Demo Credentials
| Role | Email | Password | Route |
|------|-------|----------|-------|
| Sistem Yöneticisi | admin@sentek.local | admin123 | /panel/dashboard |
| Merkez Yönetici | merkez@sentek.local | merkez123 | /panel/dashboard |
| Bölge Yetkilisi | bolge@sentek.local | bolge123 | /panel/dashboard |
| Saha Personeli | saha@sentek.local | saha123 | /mobile |
| Laboratuvar Kullanıcısı | lab@sentek.local | lab123 | /panel/laboratuvar |

## Key Files
- `src/App.tsx` — Main router with auth guards and all routes
- `src/contexts/AuthContext.tsx` — Auth state, login/logout, role-based routing
- `src/contexts/DataContext.tsx` — Global data store: tests, lab sevkler, stok, bildirimler (Dexie)
- `src/lib/db.ts` — Dexie.js IndexedDB schema
- `src/data/mockData.ts` — 52 tests, 12 lab sevkler, 35 stok, bildirimler, DEMO_CREDENTIALS
- `src/types/index.ts` — All TypeScript interfaces
- `src/index.css` — 2026 premium design system (Space Grotesk, aurora blobs, glow-card system)
- `src/main.tsx` — Mounts AuroraBackground, NoiseOverlay, MouseGlowInit (rAF mouse spotlight)
- `src/pages/web/KomutaKontrol.tsx` — **MAIN PAGE**: Unified command center (map + KPIs + feed + charts)
- `src/components/sentek/OperasyonHarita.tsx` — Leaflet map, Stadia dark tiles, 33 locations, tech overlays

## Design System (index.css)
Premium dark enterprise 2026 — Space Grotesk display font, aurora background, noise texture overlay, mouse-tracked spotlight via `.glow-card::before`:
- **Aurora**: `.aurora-bg`, `.aurora-blob-1/2/3`, `.noise-overlay`
- **Mouse glow**: `.glow-card` — `position:relative; overflow:hidden; ::before` radial-gradient
- **Glass cards**: `.glass-card`, `.glass-card-elevated`, `.glass-card-premium`, `.glass-card-inset`
- **Alert variants**: `.alert-critical` (red), `.alert-warning` (amber), `.alert-info` (cyan), `.alert-lab` (violet)
- **Live indicator**: `.live-indicator` with `.dot`, `.ring-middle`, `.ring-outer` for double-ring neon pulse

## Komuta Kontrol Merkezi (main page — /panel/dashboard)
Single unified page combining formerly separate Dashboard + LiveOps + Harita screens:
- **Header bar**: live indicator, title, real-time clock, system status, canli/durdur toggle
- **KPI strip**: 6 count-up metric cards (Toplam Test, Pozitif, Lab Sevk, Kritik Stok, Aktif Sevk, Bugün Pozitif)
- **Tactical map** (left, flex-1): Stadia Alidade Smooth Dark tiles, scanline overlay, corner HUD brackets, vignette, attribution-free, filter tabs, location detail panel, animated markers with pulse rings
- **Right feed panel** (280px): real-time Saha Akışı (5s interval), Son Pozitif Kayıtlar, Kritik Stok bars
- **Bottom charts strip**: Area chart (son 7 gün), Donut (sonuç dağılımı), İzlenebilirlik Zinciri

## Map Tile Provider
**Stadia Maps** `alidade_smooth_dark` — no API key needed for development, attribution-free display (`attributionControl: false`). Tech overlays: CSS scanlines + corner brackets + radial vignette + zoom control custom styled.

## Terminology Rules (NEVER violate)
- NEVER: personel testi, biyolojik, idrar, tükürük, kan, sürücü
- ALWAYS: şüpheli materyal, numune, saha operasyonu, stok, seri no, lab sevk

## Gotchas
- Dexie DB only seeds if `count === 0` on first load. To reset data, clear IndexedDB in browser DevTools.
- `scrollbar-hide` and `no-scrollbar` are defined in `index.css` (not Tailwind plugin).
- Leaflet `attributionControl: false` — Stadia tiles allow this for development/demo use.
- `glow-card` requires `position:relative; overflow:hidden` (set in CSS) for `::before` spotlight.
- MouseGlowInit disabled on `pointer:coarse` devices (mobile/touch).
- `/panel/canli-ops` and `/panel/harita` routes now redirect to `/panel/dashboard`.
- **CRITICAL — Map stability**: WebPanelLayout root MUST use `h-screen overflow-hidden` (NOT `min-h-screen`) and main column must have `min-h-0`. Otherwise live feed updates make the page grow vertically, cascading through flex layout to grow the map (visible as periodic zoom-in). Map container in KomutaKontrol uses `contain: strict` for extra isolation. OperasyonHarita SVG uses native `preserveAspectRatio="xMidYMid meet"` — do NOT add ResizeObserver/matrix transforms (they amplify any container fluctuation into visible zoom).
