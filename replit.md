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
| Sistem Yöneticisi | admin@sentek.local | admin123 | /panel/... |
| Merkez Yönetici | merkez@sentek.local | merkez123 | /panel/dashboard |
| Bölge Yetkilisi | bolge@sentek.local | bolge123 | /panel/... |
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
- `src/components/sentek/OperasyonHarita.tsx` — Leaflet map, 33 locations, filter tabs, info panel

## Design System (index.css)
Premium dark enterprise 2026 — Space Grotesk display font, aurora background, noise texture overlay, mouse-tracked spotlight via `.glow-card::before`, all custom CSS classes:
- **Aurora**: `.aurora-bg`, `.aurora-blob-1/2/3` (CSS keyframe drift), `.noise-overlay` (SVG feTurbulence)
- **Mouse glow**: `.glow-card` — `position:relative; overflow:hidden; ::before` radial-gradient at `--mouse-x/--mouse-y`
- **Glass cards**: `.glass-card`, `.glass-card-elevated`, `.glass-card-premium`, `.glass-card-inset`
- **Alert variants**: `.alert-critical` (red), `.alert-warning` (amber), `.alert-info` (cyan), `.alert-lab` (violet)
- **KPI**: `.kpi-chip`, `.metric-value`, `.metric-label`
- **Nav**: `.nav-item`, `.mobile-nav-bar`, `.mobile-nav-item`
- **Forms**: `.premium-input`, `.premium-table`
- **Typography**: `.page-title` (gradient text), `.section-title` (cyan bar), `.display-title` (Space Grotesk)
- **Utils**: `.scrollbar-hide`, `.no-scrollbar`, `.text-gradient-cyan`, `.text-gradient-white`
- **Animations**: `fadeSlideUp`, `auroraDrift1/2/3`, `neonPulseOuter/Middle`, `chainFlow`, `.stagger-children`
- **Live indicator**: `.live-indicator` with `.dot`, `.ring-middle`, `.ring-outer` for double-ring neon pulse

## Completed Screen Redesigns (2026 Premium Reboot)
- `main.tsx` — AuroraBackground (3 blobs), NoiseOverlay, MouseGlowInit (rAF throttled)
- `Login.tsx` — cinematic card, Space Grotesk gradient logo, neon focus inputs, gradient CTA, per-role demo buttons
- `WebPanelLayout.tsx` — grouped sidebar nav (Operasyon/Lojistik/Analiz/Yönetim), inner glow, nav-item.active neon
- `Dashboard.tsx` — bento 12-col grid, animated İzlenebilirlik Zinciri, top 4 KPI bento cards, secondary KPI strip, 3-row chart layout
- `LiveOps.tsx` — double-ring `.live-indicator`, glow-card KPI strip, Leaflet map, AnimatePresence feed, bottom panels
- `Mobile/Home.tsx` — glow-card stat squares, gradient primary CTA, glass secondary actions, glass-card-elevated recent records
- `TestRecords.tsx` — glow-card KPI chips + main table container, drawer neon box-shadow
- `Inventory.tsx` — glow-card on all kpi-chips + table container
- `Laboratory.tsx` — glow-card on sevk cards + all kpi-chips
- `LabShipments.tsx` — glow-card on sevk cards + kpi-chips
- `Reports.tsx` — glow-card on filter panel + tab nav

## Canlı Operasyon Haritası — Lokasyon Türleri (33 nokta)
Real Turkish border gates on Leaflet map: Kapıkule, Hamzabeyli, Dereköy, İpsala, Pazarkule, Sarp, Gürbulak, Esendere, Habur, Nusaybin, Cilvegözü, Öncüpınar, Akçakale (Kara Sınır); İzmir Alsancak, Mersin Uluslararası, Ambarlı, Haydarpaşa, Derince (Liman); İstanbul Havalimanı Kargo, Sabiha Gökçen Kargo (Havalimanı); TEM, E-5, Araç Arama (Karayolu); Antrepo/Posta/Mobil types.

## Terminology Rules (NEVER violate)
- NEVER: personel testi, biyolojik, idrar, tükürük, kan, sürücü
- ALWAYS: şüpheli materyal, numune, saha operasyonu, stok, seri no, lab sevk

## Gotchas
- Dexie DB only seeds if `count === 0` on first load. To reset data, clear IndexedDB in browser DevTools.
- `scrollbar-hide` and `no-scrollbar` are defined in `index.css` (not Tailwind plugin).
- Leaflet marker click handlers recreated on each `useEffect` run — `setSecilenNokta` is a stable setter, safe.
- `rolRouteAl` / `useData` Fast Refresh warnings are benign.
- Kit serial format: `LOT-YYYY-XX-KXXX` (e.g. `LOT-2026-A1-K045`)
- Aurora blobs are `position:fixed; z-index:0` — content sits above via normal stacking
- `glow-card` requires `position:relative; overflow:hidden` (already set in CSS) for `::before` pseudo-element spotlight
- MouseGlowInit is disabled on `pointer:coarse` devices (mobile/touch)
