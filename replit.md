# SENTEK - Saha Entegre Narkotik Test Yazılımı

## Project Overview
SENTEK is a full MVP security technology platform for customs/narcotics field operations. Built as a React+Vite PWA with a premium dark UI (deep navy + cyan accents, glassmorphism).

## Architecture
- **Stack**: React 18, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, framer-motion, recharts, wouter, react-hook-form
- **Auth**: localStorage-based demo auth with 5 roles. `AuthContext` handles login/logout and routing.
- **State**: `DataContext` manages all mock data in React state (no backend needed)
- **Routing**: wouter with `base` set to `import.meta.env.BASE_URL`

## Roles & Demo Credentials
| Role | Email | Password | Route |
|------|-------|----------|-------|
| Sistem Yöneticisi | admin@sentek.local | admin123 | /panel/... |
| Merkez Yönetici | merkez@sentek.local | merkez123 | /panel/dashboard |
| Bölge Yetkilisi | bolge@sentek.local | bolge123 | /panel/... |
| Saha Personeli | saha@sentek.local | saha123 | /mobile |
| Laboratuvar Kullanıcısı | lab@sentek.local | lab123 | /panel/... |

## Key Files
- `src/App.tsx` — Main router with auth guards and all routes
- `src/contexts/AuthContext.tsx` — Auth state, login/logout, role-based routing
- `src/contexts/DataContext.tsx` — Global data store with mock data
- `src/data/mockData.ts` — 15 test records, 7 lab shipments, 10 inventory items, 6 users, demo credentials
- `src/types/index.ts` — All TypeScript interfaces
- `src/index.css` — Dark theme (navy + cyan), glassmorphism `.glass-card` class

## Mobile PWA Pages (Saha Personeli)
- `/mobile` — Home with stats & quick actions
- `/mobile/yeni-test` — 9-step test entry wizard with AI analysis simulation
- `/mobile/kayitlarim` — My test records with search/filter
- `/mobile/sevklerim` — My lab shipments with timeline

## Web Admin Panel Pages
- `/panel/dashboard` — KPI cards, line charts, pie chart, bar chart
- `/panel/test-kayitlari` — Full test records table with detail drawer
- `/panel/stok` — Inventory/serial number management with detail modal
- `/panel/lab-sevk` — Lab shipment tracking with timeline drawer
- `/panel/laboratuvar` — Lab user view with status update actions
- `/panel/raporlar` — Report generation with preview modals
- `/panel/kullanicilar` — User management table (add user modal)
- `/panel/ayarlar` — System settings (notifications, security, data)

## Design System
- Background: `hsl(225 45% 8%)` — deep navy #0A0F1C
- Primary/Cyan: `hsl(192 100% 50%)` — #00D4FF
- Card: `hsl(225 40% 12%)` — #0F1629
- Destructive/Red: `hsl(350 100% 61%)` — #FF3D5A
- `.glass-card` — glassmorphism card with backdrop-blur and cyan hover glow
- Dot grid background via CSS radial-gradient
- Always dark mode (no light mode toggle)

## Components
- `StatusBadge.tsx` — TestSonucBadge, LabDurumBadge, StokDurumBadge, OncelikBadge
- `LabTimeline.tsx` — 9-stage lab process timeline with animated indicators
- `StatsCard.tsx` — Animated stat card with color variants and lucide icons
