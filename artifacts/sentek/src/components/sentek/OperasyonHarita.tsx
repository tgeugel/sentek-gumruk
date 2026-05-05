import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TestKaydi } from '../../types';

// Leaflet default marker icon fix for bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Nokta {
  lokasyon: string;
  lat: number;
  lng: number;
  testSayisi: number;
  pozitifSayisi: number;
  sonDurum?: string;
}

const LOKASYON_KOORDINATLARI: Record<string, [number, number]> = {
  'Sınır Kapısı A':         [41.735, 26.282],
  'Sınır Kapısı B':         [40.921, 26.378],
  'Liman Kontrol Noktası':  [38.431, 27.139],
  'Araç Arama Noktası':     [41.015, 28.978],
  'Antrepo Bölgesi':        [40.998, 28.956],
  'Havalimanı Kargo':       [40.976, 29.079],
  'Mobil Saha Ekibi':       [39.925, 32.837],
  'Karayolu Kontrol Noktası': [40.183, 29.063],
  'Posta / Kargo Merkezi':  [37.003, 35.325],
  'Kargo Terminali':        [41.065, 29.012],
};

function createMarkerIcon(pozitifSayisi: number, testSayisi: number, aktif: boolean) {
  const oran = testSayisi > 0 ? pozitifSayisi / testSayisi : 0;
  const renk = pozitifSayisi > 0
    ? (oran > 0.4 ? '#ef4444' : '#f97316')
    : '#10b981';
  const boyut = Math.min(32 + testSayisi * 2, 48);

  const pulseClass = aktif ? `
    <div style="
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${boyut + 16}px;height:${boyut + 16}px;
      border-radius:50%;background:${renk}33;
      animation:markerPulse 2s infinite;
    "></div>
  ` : '';

  const html = `
    <div style="position:relative;width:${boyut}px;height:${boyut}px;">
      ${pulseClass}
      <div style="
        position:relative;z-index:2;
        width:${boyut}px;height:${boyut}px;border-radius:50%;
        background:${renk};border:3px solid rgba(255,255,255,0.9);
        box-shadow:0 0 12px ${renk}88,0 2px 8px rgba(0,0,0,0.4);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        color:white;font-weight:800;line-height:1.1;
      ">
        <span style="font-size:${boyut > 36 ? '12' : '10'}px;">${testSayisi}</span>
        ${pozitifSayisi > 0 ? `<span style="font-size:8px;opacity:0.85">+${pozitifSayisi}</span>` : ''}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [boyut, boyut],
    iconAnchor: [boyut / 2, boyut / 2],
  });
}

interface OperasyonHaritaProps {
  testKayitlari: TestKaydi[];
  canliOlay?: string | null;
}

export function OperasyonHarita({ testKayitlari, canliOlay }: OperasyonHaritaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [39.5, 32.5],
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Stil: CSS animation için
    const style = document.createElement('style');
    style.textContent = `
      @keyframes markerPulse {
        0%   { transform: translate(-50%,-50%) scale(0.8); opacity:0.6; }
        50%  { transform: translate(-50%,-50%) scale(1.3); opacity:0.2; }
        100% { transform: translate(-50%,-50%) scale(0.8); opacity:0.6; }
      }
    `;
    document.head.appendChild(style);

    mapInstanceRef.current = map;
    return () => {
      style.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Markerları güncelle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Eski markerları kaldır
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Lokasyon bazlı istatistik
    const stats: Record<string, Nokta> = {};

    Object.entries(LOKASYON_KOORDINATLARI).forEach(([lokasyon, [lat, lng]]) => {
      const kayitlar = testKayitlari.filter(t => t.lokasyon === lokasyon);
      if (kayitlar.length === 0) return;
      const pozitifler = kayitlar.filter(t => t.testSonucu === 'Pozitif');
      const sonKayit = kayitlar[0];
      stats[lokasyon] = {
        lokasyon,
        lat,
        lng,
        testSayisi: kayitlar.length,
        pozitifSayisi: pozitifler.length,
        sonDurum: sonKayit?.testSonucu,
      };
    });

    // Canli olay lokasyonu
    const aktifLokasyon = canliOlay || null;

    Object.values(stats).forEach(nokta => {
      const aktif = aktifLokasyon ? nokta.lokasyon === aktifLokasyon : false;
      const icon = createMarkerIcon(nokta.pozitifSayisi, nokta.testSayisi, aktif);

      const popup = L.popup({
        className: 'sentek-popup',
        closeButton: false,
        maxWidth: 200,
      }).setContent(`
        <div style="
          background:#0d1829;border:1px solid rgba(0,212,255,0.2);
          border-radius:10px;padding:12px;color:#e2e8f0;font-family:system-ui,sans-serif;
        ">
          <p style="font-weight:700;font-size:12px;color:#00d4ff;margin:0 0 8px">${nokta.lokasyon}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;">
            <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:6px;text-align:center;">
              <p style="color:#94a3b8;margin:0 0 2px">Toplam</p>
              <p style="font-weight:800;color:#e2e8f0;margin:0;font-size:15px">${nokta.testSayisi}</p>
            </div>
            <div style="background:${nokta.pozitifSayisi > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'};border-radius:6px;padding:6px;text-align:center;">
              <p style="color:#94a3b8;margin:0 0 2px">Pozitif</p>
              <p style="font-weight:800;color:${nokta.pozitifSayisi > 0 ? '#f87171' : '#34d399'};margin:0;font-size:15px">${nokta.pozitifSayisi}</p>
            </div>
          </div>
          ${nokta.pozitifSayisi > 0
            ? `<p style="margin:8px 0 0;font-size:10px;color:#f87171;background:rgba(239,68,68,0.1);border-radius:5px;padding:4px 6px;">⚠ Pozitif tespit kaydı mevcut</p>`
            : `<p style="margin:8px 0 0;font-size:10px;color:#34d399;background:rgba(16,185,129,0.1);border-radius:5px;padding:4px 6px;">✓ Temiz saha</p>`
          }
        </div>
      `);

      const marker = L.marker([nokta.lat, nokta.lng], { icon })
        .bindPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [testKayitlari, canliOlay]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full" style={{ background: '#0d1829' }} />
      {/* Legenda */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-card/90 backdrop-blur-sm border border-border rounded-xl p-3 text-xs space-y-1.5">
        <p className="font-bold text-foreground/80 text-[10px] uppercase tracking-widest mb-2">Gösterge</p>
        {[
          { renk: '#ef4444', label: 'Yüksek pozitif oran' },
          { renk: '#f97316', label: 'Orta pozitif oran' },
          { renk: '#10b981', label: 'Temiz nokta' },
        ].map(({ renk, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: renk }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
        <p className="text-muted-foreground/60 text-[10px] mt-1">Sayı = toplam test</p>
      </div>
    </div>
  );
}
