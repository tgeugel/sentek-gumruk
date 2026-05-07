#!/usr/bin/env bash
set -euo pipefail

echo "=== SENTEK VPS Deploy ==="

if ! command -v docker &>/dev/null; then
  echo "Docker bulunamadı. Kuruluyor..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi

if ! command -v docker compose &>/dev/null 2>&1 && ! docker compose version &>/dev/null 2>&1; then
  echo "docker compose plugin kuruluyor..."
  apt-get install -y docker-compose-plugin 2>/dev/null || true
fi

echo "Image build ediliyor..."
docker compose build --no-cache

echo "Container başlatılıyor..."
docker compose up -d

echo ""
echo "SENTEK demo hazır → http://$(hostname -I | awk '{print $1}')"
echo ""
echo "Demo giriş bilgileri:"
echo "  Sistem Yöneticisi  admin@sentek.local  / admin123"
echo "  Merkez Yönetici   merkez@sentek.local / merkez123"
echo "  Bölge Y6tkilisi   bolge@sentek.local  / bolge123"
echo "  Saha Personeli    saha@sentek.local   / saha123"
echo "  Laboratuvar       lab@sentek.local    / lab123"
