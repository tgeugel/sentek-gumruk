# SENTEK — Demo Deployment Kılavuzu

## Mimari
- Tamamen statik PWA (React + Vite build)
- Veritabanı: tarayıcı IndexedDB (Dexie.js) — backend gerekmez
- İlk açılışta mock demo verisi otomatik yüklenir

---

## 1. GitHub'a Push

```bash
# Replit'te terminal açın:
git remote add origin https://github.com/KULLANICIADINIZ/sentek.git
git push -u origin main
```

---

## 2. VPS'e Deploy (Docker ile)

### Ön koşullar
- Ubuntu 22.04+ VPS
- Root veya sudo erişimi
- Git kurulu

### Tek komutla deploy

```bash
# VPS'e SSH ile bağlanın
ssh root@VPS_IP

# Repoyu klonlayın
git clone https://github.com/KULLANICIADINIZ/sentek.git
cd sentek

# Deploy edin (Docker yoksa otomatik kurar)
chmod +x deploy.sh
./deploy.sh
```

Uygulama `http://VPS_IP` adresinde erişilebilir olacak.

---

## 3. Güncelleme (yeni versiyon)

```bash
cd sentek
git pull
docker compose build --no-cache
docker compose up -d
```

---

## 4. HTTPS (SSL) — Opsiyonel

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d sentek.alanadi.com
```

---

## Demo Giriş Bilgileri

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Sistem Yöneticisi | admin@sentek.local | admin123 |
| Merkez Yönetici | merkez@sentek.local | merkez123 |
| Bölge Yetkilisi | bolge@sentek.local | bolge123 |
| Saha Personeli | saha@sentek.local | saha123 |
| Laboratuvar | lab@sentek.local | lab123 |

---

## Manuel Build (Docker olmadan)

```bash
# Node 22 + pnpm 10 gerekli
npm i -g pnpm@10
pnpm install --frozen-lockfile
BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/sentek run build
# dist: artifacts/sentek/dist/public/ → nginx root'una kopyalayın
```
