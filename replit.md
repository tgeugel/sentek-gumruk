# SENTEK - Saha Entegre Narkotik Test Yazılımı

## Project Overview
SENTEK is a full MVP security technology platform for customs/narcotics field operations. Built as a React+Vite PWA with a premium dark UI (deep navy + cyan accents, glassmorphism). All UI in Turkish, all state is mock/local (no backend).

## Architecture
- **Stack**: React 18, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, framer-motion, recharts, wouter
- **Auth**: localStorage-based demo auth with 5 roles. `AuthContext` handles login/logout and routing.
- **State**: `DataContext` manages all mock data in React state (no backend needed)
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

## Step 2 Enhancements (Complete)

### Data Layer
- **mockData.ts**: 25 test records (8 pozitif), 9 lab sevkler, 20 stok items, 8 bildirimler, 6 users
- **types/index.ts**: Added `Bildirim`, `BildirimTur`, `TeslimAlmaFormu`, `LabSevkOlay` interfaces
- **DataContext.tsx**: Full stok deduction on test save (`stokDus`), notification system (`bildirimler` state, `bildirimEkle`, `bildirimOku`, `tumunuOku`), `labSevkTeslimAlmaKaydet`, `kitSeriNoKontrol`

### Mobile — NewTest.tsx (10-step wizard)
1. Operasyon Bilgisi — auto-generated op no, date, user
2. Lokasyon — select from 10 locations + sub-locations
3. Numune Türü — 10 types
4. Materyal Açıklaması — min 10 chars
5. **Kit Seçimi** — browse stoklar, auto-fills seriNo/SKT/panelTipi, SKT warnings
6. Fotoğraf — camera/gallery simulation
7. **AI Analizi** — confidence bar, C/T line visual indicators, animated scan
8. Sonuç Doğrulama — confirm/override AI result
9. Tespit & Notlar — substance list for positives
10. Özet & Tamamla — summary, lab sevk toggle for positives, saves + decrements stok

### Web Panel — Dashboard.tsx
- 10 KPI cards (total, today, positive, negative, invalid, lab, analysis, reported, critical stok, unread notifications)
- Operasyonel uyarılar section (dynamic from data)
- 4 charts: 7-day line chart, pie chart (sonuç dağılımı), lokasyon bar, lab durum bar

### Web Panel — Laboratory.tsx
- 3-tab layout: Bekleyen / Aktif / Tamamlanan
- **TeslimAlmaModal** — full form: personel, tarih, ambalaj, mühür, fiziksel durum notu, fotoğraf, kabul durumu
- Detay drawer with timeline + action buttons (Teslim Al → Analizi Başlat → Rapor Yükle)

### Components
- **NotificationBell.tsx** — bell icon with badge, animated dropdown, per-type icons, mark-as-read, mark-all-read
- **LabTimeline.tsx** — enhanced with olay timestamps, kullanici, aciklama per step
- Both layouts (MobileLayout, WebPanelLayout) include NotificationBell in header

## Key Files
- `src/App.tsx` — Main router with auth guards and all routes
- `src/contexts/AuthContext.tsx` — Auth state, login/logout, role-based routing
- `src/contexts/DataContext.tsx` — Global data store: tests, lab sevkler, stok, bildirimler
- `src/data/mockData.ts` — 25 tests, 9 lab sevkler, 20 stok, 8 bildirimler, DEMO_CREDENTIALS
- `src/types/index.ts` — All TypeScript interfaces including Bildirim, TeslimAlmaFormu, LabSevkOlay
- `src/index.css` — Dark theme (navy + cyan), glassmorphism `.glass-card` class

## Mobile PWA Pages (Saha Personeli)
- `/mobile` — Home with stats & quick actions
- `/mobile/yeni-test` — 10-step test kayıt wizard
- `/mobile/kayitlarim` — Personal test records list
- `/mobile/sevklerim` — Personal lab sevkler list

## Web Panel Pages (other roles)
- `/panel/dashboard` — 10 KPI + 4 charts + operational alerts
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
