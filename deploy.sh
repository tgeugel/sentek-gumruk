#!/usr/bin/env bash
set -euo pipefail

DOMAIN="gumruk.foryoutag.com"
EMAIL="admin@foryoutag.com"

echo "========================================"
echo "  SENTEK VPS Deploy — $DOMAIN"
echo "========================================"

# ── Docker ──────────────────────────────────
if ! command -v docker &>/dev/null; then
  echo "[1/4] Docker kuruluyor..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
else
  echo "[1/4] Docker mevcut ✓"
fi

# ── Certbot ─────────────────────────────────
if ! command -v certbot &>/dev/null; then
  echo "[2/4] Certbot kuruluyor..."
  apt-get update -qq
  apt-get install -y certbot
else
  echo "[2/4] Certbot mevcut ✓"
fi

# ── SSL Sertifikası ──────────────────────────
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "[3/4] SSL sertifikası alınıyor ($DOMAIN)..."
  certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    -m "$EMAIL" \
    -d "$DOMAIN"
  echo "  Sertifika alındı ✓"
else
  echo "[3/4] SSL sertifikası mevcut ✓"
fi

# ── Docker Build + Start ─────────────────────
echo "[4/4] SENTEK image build + başlatılıyor..."
docker compose build --no-cache
docker compose up -d

# ── Otomatik Sertifika Yenileme ──────────────
CRON_JOB="0 3 * * * certbot renew --quiet && docker compose -f $(pwd)/docker-compose.yml exec -T sentek nginx -s reload 2>/dev/null || true"
if ! crontab -l 2>/dev/null | grep -qF "certbot renew"; then
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "  Otomatik sertifika yenileme cron eklendi ✓"
fi

echo ""
echo "========================================"
echo "  SENTEK demo hazır!"
echo "  https://$DOMAIN"
echo "========================================"
echo ""
echo "  Demo giriş bilgileri:"
echo "  ┌─ Sistem Yöneticisi  admin@sentek.local   / admin123"
echo "  ├─ Merkez Yönetici   merkez@sentek.local  / merkez123"
echo "  ├─ Bölge Yetkilisi   bolge@sentek.local   / bolge123"
echo "  ├─ Saha Personeli    saha@sentek.local    / saha123"
echo "  └─ Laboratuvar       lab@sentek.local     / lab123"
echo ""
