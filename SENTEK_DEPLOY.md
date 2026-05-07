# SENTEK — VPS Deployment Kılavuzu

**Domain:** https://gumruk.foryoutag.com

## Mimari
- Tamamen statik PWA (React + Vite build)
- Veritabanı: tarayıcı IndexedDB (Dexie.js) — backend gerekmez
- İlk açılışta mock demo verisi otomatik yüklenir
- Docker + nginx + Let's Encrypt SSL

---

## Hızlı Kurulum (Ubuntu 22.04+)

```bash
ssh root@VPS_IP

git clone https://github.com/tgeugel/sentek-gumruk.git
cd sentek-gumruk

chmod +x deploy.sh
./deploy.sh
```

Script otomatik olarak:
1. Docker kurar (yoksa)
2. Certbot kurar (yoksa)
3. `gumruk.foryoutag.com` için Let's Encrypt SSL sertifikası alır
4. Docker image build eder ve başlatır
5. Otomatik sertifika yenileme için cron kurar

---

## Güncelleme

```bash
cd sentek-gumruk
git pull
docker compose build --no-cache
docker compose up -d
```

---

## Servis Yönetimi

```bash
docker compose ps          # Durum
docker compose logs -f     # Loglar
docker compose restart     # Yeniden başlat
docker compose down        # Durdur
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
npm i -g pnpm@10
pnpm install --frozen-lockfile
BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/sentek run build
# dist: artifacts/sentek/dist/public/ → nginx root'una kopyalayın
```
