# SENTEK - Saha Entegre Narkotik Test Yazılımı

## Project Overview
SENTEK is a full MVP security technology platform for customs/narcotics field operations. React+Vite PWA, premium dark UI (deep navy + cyan accents, glassmorphism). All UI in Turkish, all state is mock/local with IndexedDB (Dexie.js).

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
- `src/index.css` — Dark theme (navy + cyan), glassmorphism `.glass-card` class
- `src/components/sentek/OperasyonHarita.tsx` — Leaflet map, 33 locations, filter tabs, info panel

## Canlı Operasyon Haritası — Lokasyon Türleri (33 nokta)
Gerçek Türk sınır kapıları koordinat haritasında:
- **Kara Sınır**: Kapıkule, Hamzabeyli, Dereköy, İpsala, Pazarkule, Sarp, Gürbulak, Esendere, Habur, Nusaybin, Cilvegözü, Öncüpınar, Akçakale
- **Liman**: İzmir Alsancak, Mersin Uluslararası, Ambarlı, Haydarpaşa, Derince
- **Havalimanı**: İstanbul Havalimanı Kargo, Sabiha Gökçen Kargo
- **Karayolu**: TEM, E-5, Araç Arama Noktası
- **Antrepo/Posta/Mobil**: Merkez Antrepo, PTT Kargo Merkezi, Posta/Kargo Merkezi, Mobil Saha Ekibi, Kargo Terminali
- Eski genel isimler de haritada tanımlı (backward compat)

## Mobile PWA Pages (Saha Personeli)
- `/mobile` — Home with stats & quick actions
- `/mobile/yeni-test` — 10-step test kayıt wizard (27 lokasyon seçeneği)
- `/mobile/kayitlarim` — Personal test records list
- `/mobile/sevklerim` — Personal lab sevkler list

## Web Panel Pages (other roles)
- `/panel/dashboard` — 10 KPI + 4 charts + operational alerts
- `/panel/canli-operasyon` — Canlı harita (Leaflet, filter, info panel) + akış + KPI
- `/panel/test-kayitlari` — Test records with detail drawer
- `/panel/stok` — Inventory management with status badges
- `/panel/lab-sevk` — Lab shipment tracking
- `/panel/laboratuvar` — Lab reception + analysis workflow
- `/panel/raporlar` — Reports page
- `/panel/kullanicilar` — User management
- `/panel/ayarlar` — Settings

## Design Conventions
- Color: `bg=225 45% 8%`, primary=`192 100% 50%` (cyan `#00D4FF`), always dark mode
- `.glass-card` class in `index.css` for glassmorphism panels
- Kit serial format: `LOT-YYYY-XX-KXXX` (e.g. `LOT-2026-A1-K045`)
- `stokId` links test to stok item for deduction tracking

## Gotchas
- Dexie DB only seeds if `count === 0` on first load. To reset data, clear IndexedDB in browser DevTools.
- Leaflet marker click handlers are recreated each time the markers `useEffect` runs (deps: testKayitlari, canliOlay, filtre). `setSecilenNokta` is a stable React setter so closure capture is safe.
- `rolRouteAl` / `useData` Fast Refresh warnings are benign — context exports cause invalidation but full reload works fine.
