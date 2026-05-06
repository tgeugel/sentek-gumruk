# SENTEK - Saha Entegre Narkotik Test Yazılımı

## Project Overview
SENTEK is a full MVP security technology platform for customs/narcotics field operations. React+Vite PWA, premium 2026 dark enterprise UI (deep navy #080d1a + cyan #00D4FF accents, glassmorphism, framer-motion). All UI in Turkish, all state is mock/local with IndexedDB (Dexie.js).

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
- `src/index.css` — 2026 premium design system (navy bg, cyan primary, all CSS custom classes)
- `src/components/sentek/OperasyonHarita.tsx` — Leaflet map, 33 locations, filter tabs, info panel

## Design System (index.css)
Premium dark enterprise 2026 — all custom CSS classes:
- **Glass cards**: `.glass-card`, `.glass-card-elevated`, `.glass-card-premium`, `.glass-card-inset`
- **Alert variants**: `.alert-critical` (red), `.alert-warning` (amber), `.alert-info` (cyan), `.alert-lab` (violet)
- **KPI**: `.kpi-chip`, `.metric-value`, `.metric-label`
- **Nav**: `.nav-item`, `.mobile-nav-bar`, `.mobile-nav-item`
- **Forms**: `.premium-input`, `.premium-table`
- **Utils**: `.section-title`, `.page-enter`, `.gradient-divider`, `.scrollbar-hide`, `.chain-step`, `.chain-step-icon`, `.chain-arrow`
- **Animations**: `fadeSlideUp`, `pulseDot`, `.stagger-children`

## Completed Screen Redesigns (2026 Premium Reboot)
- `WebPanelLayout.tsx` — Grouped sidebar nav (Operasyon/Lojistik/Analiz/Yönetim), premium logo
- `MobileLayout.tsx` — Elevated FAB center, animated active indicator via layoutId
- `Dashboard.tsx` — İzlenebilirlik Zinciri (10-step chain), live clock, KPI strip, AreaChart, Pie+Bar charts, 3-column right panel
- `LiveOps.tsx` — Canlı harita (Leaflet), pulsing header, kpi-chip strip, alert-* akış kartları, timeAgo
- `Mobile/Home.tsx` — SAHA MODU greeting, gradient primary CTA, glass secondary actions, recent records
- `TestRecords.tsx` — premium-table, Güven Skoru progress bar, tabbed detail drawer (Genel/Kit/Lab/Audit)
- `Inventory.tsx` — KPI chips, search+pill filter, 2-col layout (table + donut chart), StokDetayDrawer
- `Laboratory.tsx` — glass-card-elevated queue cards, TeslimAlmaModal premium-input, gradient submit
- `LabShipments.tsx` — glass-card sevk cards, left colored borders by status, SevkDetayDrawer
- `Reports.tsx` — pill tabs, FiltrePaneli glass-card-inset, upgraded AreaChart gradients, glass-card-elevated containers

## Canlı Operasyon Haritası — Lokasyon Türleri (33 nokta)
Real Turkish border gates on Leaflet map: Kapıkule, Hamzabeyli, Dereköy, İpsala, Pazarkule, Sarp, Gürbulak, Esendere, Habur, Nusaybin, Cilvegözü, Öncüpınar, Akçakale (Kara Sınır); İzmir Alsancak, Mersin Uluslararası, Ambarlı, Haydarpaşa, Derince (Liman); İstanbul Havalimanı Kargo, Sabiha Gökçen Kargo (Havalimanı); TEM, E-5, Araç Arama (Karayolu); Antrepo/Posta/Mobil types.

## Mobile PWA Pages (Saha Personeli)
- `/mobile` — Home with stats & quick actions
- `/mobile/yeni-test` — 10-step test kayıt wizard (27 lokasyon seçeneği)
- `/mobile/kayitlarim` — Personal test records list
- `/mobile/sevklerim` — Personal lab sevkler list

## Web Panel Pages (other roles)
- `/panel/dashboard` — İzlenebilirlik Zinciri + 10 KPI + charts + right panel
- `/panel/canli-operasyon` — Canlı harita + akış + KPI
- `/panel/test-kayitlari` — Test records with premium-table + detail drawer
- `/panel/stok` — Inventory with donut chart analytics
- `/panel/lab-sevk` — Lab shipment tracking
- `/panel/laboratuvar` — Lab reception + analysis workflow
- `/panel/raporlar` — Analytics + PDF export
- `/panel/kullanicilar` — User management
- `/panel/ayarlar` — Settings

## Terminology Rules (NEVER violate)
- NEVER: personel testi, biyolojik, idrar, tükürük, kan, sürücü
- ALWAYS: şüpheli materyal, numune, saha operasyonu, stok, seri no, lab sevk

## Gotchas
- Dexie DB only seeds if `count === 0` on first load. To reset data, clear IndexedDB in browser DevTools.
- `scrollbar-hide` and `no-scrollbar` are defined in `index.css` (not Tailwind plugin).
- Leaflet marker click handlers recreated on each `useEffect` run — `setSecilenNokta` is a stable setter, safe.
- `rolRouteAl` / `useData` Fast Refresh warnings are benign.
- Kit serial format: `LOT-YYYY-XX-KXXX` (e.g. `LOT-2026-A1-K045`)
