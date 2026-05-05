import { useEffect, useRef } from 'react';
import { MapPin, Activity, FlaskConical, AlertTriangle, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const LOKASYONLAR = [
  {
    id: 'sinir-a',
    isim: 'Sınır Kapısı A',
    lat: 41.685,
    lng: 26.558,
    tip: 'Sınır Kapısı',
    aciklama: 'İpsala Sınır Kapısı — Edirne',
  },
  {
    id: 'sinir-b',
    isim: 'Sınır Kapısı B',
    lat: 41.338,
    lng: 26.663,
    tip: 'Sınır Kapısı',
    aciklama: 'Kapıkule Sınır Kapısı — Edirne',
  },
  {
    id: 'liman',
    isim: 'Liman Kontrol Noktası',
    lat: 40.982,
    lng: 28.725,
    tip: 'Liman',
    aciklama: 'Ambarlı Liman Kontrol — İstanbul',
  },
  {
    id: 'antrepo',
    isim: 'Antrepo Bölgesi',
    lat: 41.063,
    lng: 28.944,
    tip: 'Antrepo',
    aciklama: 'Merter Gümrük Antreposu — İstanbul',
  },
  {
    id: 'mobil',
    isim: 'Mobil Saha Ekibi',
    lat: 40.788,
    lng: 29.447,
    tip: 'Mobil',
    aciklama: 'Gebze Karayolu Güzergahı — Kocaeli',
  },
  {
    id: 'arac-arama',
    isim: 'Araç Arama Noktası',
    lat: 41.215,
    lng: 28.485,
    tip: 'Kontrol',
    aciklama: 'TEM Otoyolu Kontrol — İstanbul',
  },
  {
    id: 'havalimanı',
    isim: 'Havalimanı Kargo',
    lat: 41.261,
    lng: 28.742,
    tip: 'Havalimanı',
    aciklama: 'İstanbul Havalimanı Kargo Terminali',
  },
  {
    id: 'posta',
    isim: 'Posta / Kargo Merkezi',
    lat: 40.856,
    lng: 29.328,
    tip: 'Kargo',
    aciklama: 'Pendik Posta / Kargo Dağıtım Merkezi',
  },
];

const RENK_MAP: Record<string, string> = {
  'Sınır Kapısı': '#EF4444',
  'Liman': '#00D4FF',
  'Antrepo': '#8B5CF6',
  'Mobil': '#10B981',
  'Kontrol': '#F59E0B',
  'Havalimanı': '#EC4899',
  'Kargo': '#F97316',
};

export default function OperasyonHaritasi() {
  const { testKayitlari, labSevkler, stoklar } = useData();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const getLokasyonStats = (lokasyonIsim: string) => {
    const bugun = new Date().toISOString().slice(0, 10);
    const testler = testKayitlari.filter(t => t.lokasyon === lokasyonIsim);
    const bugunTestler = testler.filter(t => t.tarih.startsWith(bugun));
    const pozitifler = testler.filter(t => t.testSonucu === 'Pozitif');
    const sevkler = labSevkler.filter(s => s.sevkEdenBirim === lokasyonIsim);
    return {
      bugunTest: bugunTestler.length,
      toplamTest: testler.length,
      pozitif: pozitifler.length,
      labSevk: sevkler.length,
    };
  };

  const kritikStokVar = stoklar.some(s => s.durum === 'Kritik' || s.durum === 'Tükendi');

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapRef.current || leafletMapRef.current) return;

      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (!mounted || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [41.0, 28.5],
        zoom: 7,
        zoomControl: true,
        attributionControl: true,
      });

      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      LOKASYONLAR.forEach(lok => {
        const stats = getLokasyonStats(lok.isim);
        const renk = RENK_MAP[lok.tip] || '#00D4FF';

        const svgIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:32px;height:32px;border-radius:50% 50% 50% 0;
            background:${renk};border:2px solid white;
            transform:rotate(-45deg);
            box-shadow:0 2px 8px rgba(0,0,0,0.4);
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="transform:rotate(45deg);width:8px;height:8px;background:white;border-radius:50%;"></div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const popupContent = `
          <div style="font-family:system-ui;min-width:200px;padding:4px;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#0A0F1E">${lok.isim}</div>
            <div style="font-size:11px;color:#666;margin-bottom:8px;">${lok.aciklama}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
              <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center;">
                <div style="font-size:18px;font-weight:700;color:#0A0F1E">${stats.bugunTest}</div>
                <div style="font-size:9px;color:#666">Bugün Test</div>
              </div>
              <div style="background:${stats.pozitif > 0 ? '#fee2e2' : '#f1f5f9'};border-radius:6px;padding:6px;text-align:center;">
                <div style="font-size:18px;font-weight:700;color:${stats.pozitif > 0 ? '#dc2626' : '#0A0F1E'}">${stats.pozitif}</div>
                <div style="font-size:9px;color:#666">Pozitif</div>
              </div>
              <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center;">
                <div style="font-size:18px;font-weight:700;color:#7c3aed">${stats.labSevk}</div>
                <div style="font-size:9px;color:#666">Lab Sevk</div>
              </div>
              <div style="background:#f1f5f9;border-radius:6px;padding:6px;text-align:center;">
                <div style="font-size:18px;font-weight:700;color:#0A0F1E">${stats.toplamTest}</div>
                <div style="font-size:9px;color:#666">Toplam Test</div>
              </div>
            </div>
            <div style="font-size:10px;color:#7c3aed;font-weight:600;background:#ede9fe;padding:4px 8px;border-radius:4px;">
              ${lok.tip} Noktası
            </div>
          </div>
        `;

        L.marker([lok.lat, lok.lng], { icon: svgIcon })
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 260, className: 'sentek-popup' });
      });
    };

    initMap();

    return () => {
      mounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const enYogunLokasyon = LOKASYONLAR.map(l => ({ ...l, ...getLokasyonStats(l.isim) }))
    .sort((a, b) => b.toplamTest - a.toplamTest)[0];
  const enYuksekPozitif = LOKASYONLAR.map(l => ({ ...l, ...getLokasyonStats(l.isim) }))
    .sort((a, b) => b.pozitif - a.pozitif)[0];
  const enCokLabSevk = LOKASYONLAR.map(l => ({ ...l, ...getLokasyonStats(l.isim) }))
    .sort((a, b) => b.labSevk - a.labSevk)[0];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-0.5">Operasyon Haritası</h1>
        <p className="text-sm text-muted-foreground">Aktif kontrol noktaları ve saha durumu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="glass-card rounded-xl overflow-hidden border border-card-border" style={{ height: 520 }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {Object.entries(RENK_MAP).map(([tip, renk]) => (
              <div key={tip} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: renk }} />
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Özet Panel</p>

          <div className="glass-card p-4 border border-card-border space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-foreground">En Yoğun Nokta</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{enYogunLokasyon?.isim}</p>
            <p className="text-xs text-muted-foreground">{enYogunLokasyon?.toplamTest} toplam test</p>
          </div>

          <div className="glass-card p-4 border border-red-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-foreground">En Yüksek Pozitif</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{enYuksekPozitif?.isim}</p>
            <p className="text-xs text-red-400 font-semibold">{enYuksekPozitif?.pozitif} pozitif kayıt</p>
          </div>

          <div className="glass-card p-4 border border-violet-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-foreground">En Çok Lab Sevk</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{enCokLabSevk?.isim}</p>
            <p className="text-xs text-violet-400 font-semibold">{enCokLabSevk?.labSevk} sevk kaydı</p>
          </div>

          {kritikStokVar && (
            <div className="glass-card p-4 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">Kritik Stok</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length} ürün kritik seviyede
              </p>
            </div>
          )}

          <div className="glass-card p-4 border border-card-border space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-foreground">Genel Durum</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aktif Nokta</span>
                <span className="font-bold text-emerald-400">{LOKASYONLAR.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toplam Test</span>
                <span className="font-bold text-foreground">{testKayitlari.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lab Sevk</span>
                <span className="font-bold text-foreground">{labSevkler.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
