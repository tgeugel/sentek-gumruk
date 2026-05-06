import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TestKaydi } from '../../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LokasyonTipi = 'sinir' | 'liman' | 'havalimanı' | 'karayolu' | 'antrepo' | 'posta' | 'mobil';
type Filtre = 'tumu' | 'aktif' | 'pozitif';

interface NoktaDetay {
  lokasyon: string;
  tip: LokasyonTipi;
  lat: number;
  lng: number;
  testSayisi: number;
  pozitifSayisi: number;
  negatifSayisi: number;
  gecersizSayisi: number;
  sonTestTarihi?: string;
  sonTestSonucu?: string;
  sonMadde?: string;
}

const LOKASYON_KOORDINATLARI: Record<string, [number, number]> = {
  'Kapıkule Sınır Kapısı':         [41.735, 26.282],
  'Hamzabeyli Sınır Kapısı':       [41.806, 26.641],
  'Dereköy Sınır Kapısı':          [41.952, 27.427],
  'İpsala Sınır Kapısı':           [40.922, 26.379],
  'Pazarkule Sınır Kapısı':        [41.714, 26.334],
  'Sarp Sınır Kapısı':             [41.495, 41.483],
  'Gürbulak Sınır Kapısı':         [39.697, 44.175],
  'Esendere Sınır Kapısı':         [37.375, 44.569],
  'Habur Sınır Kapısı':            [37.152, 42.342],
  'Nusaybin Sınır Kapısı':         [37.073, 41.214],
  'Cilvegözü Sınır Kapısı':        [36.686, 36.633],
  'Öncüpınar Sınır Kapısı':        [36.695, 37.174],
  'Akçakale Sınır Kapısı':         [36.726, 38.952],
  'İzmir Alsancak Limanı':         [38.431, 27.139],
  'Mersin Uluslararası Limanı':    [36.801, 34.641],
  'Ambarlı Limanı':                [40.979, 28.657],
  'Haydarpaşa Limanı':             [40.998, 29.016],
  'Derince Limanı':                [40.764, 29.812],
  'İstanbul Havalimanı Kargo':     [41.261, 28.746],
  'Sabiha Gökçen Kargo':           [40.899, 29.309],
  'TEM Karayolu Kontrol':          [41.015, 28.978],
  'E-5 Karayolu Kontrol':          [40.183, 29.063],
  'Araç Arama Noktası':            [41.080, 28.920],
  'Merkez Antrepo':                [40.998, 28.956],
  'Adana Antrepo':                 [37.001, 35.351],
  'PTT Kargo Merkezi İstanbul':    [41.020, 28.930],
  'Posta / Kargo Merkezi':         [37.003, 35.325],
  'Mobil Saha Ekibi':              [39.925, 32.837],
  'Kargo Terminali':               [41.065, 29.012],
  'Liman Kontrol Noktası':         [38.431, 27.170],
  'Antrepo Bölgesi':               [41.010, 28.940],
  'Karayolu Kontrol Noktası':      [40.195, 29.050],
  'Havalimanı Kargo':              [41.261, 28.720],
};

const LOKASYON_TIP: Record<string, LokasyonTipi> = {
  'Kapıkule Sınır Kapısı': 'sinir', 'Hamzabeyli Sınır Kapısı': 'sinir', 'Dereköy Sınır Kapısı': 'sinir',
  'İpsala Sınır Kapısı': 'sinir', 'Pazarkule Sınır Kapısı': 'sinir', 'Sarp Sınır Kapısı': 'sinir',
  'Gürbulak Sınır Kapısı': 'sinir', 'Esendere Sınır Kapısı': 'sinir', 'Habur Sınır Kapısı': 'sinir',
  'Nusaybin Sınır Kapısı': 'sinir', 'Cilvegözü Sınır Kapısı': 'sinir', 'Öncüpınar Sınır Kapısı': 'sinir',
  'Akçakale Sınır Kapısı': 'sinir',
  'İzmir Alsancak Limanı': 'liman', 'Mersin Uluslararası Limanı': 'liman', 'Ambarlı Limanı': 'liman',
  'Haydarpaşa Limanı': 'liman', 'Derince Limanı': 'liman',
  'İstanbul Havalimanı Kargo': 'havalimanı', 'Sabiha Gökçen Kargo': 'havalimanı',
  'TEM Karayolu Kontrol': 'karayolu', 'E-5 Karayolu Kontrol': 'karayolu', 'Araç Arama Noktası': 'karayolu',
  'Merkez Antrepo': 'antrepo', 'Adana Antrepo': 'antrepo',
  'PTT Kargo Merkezi İstanbul': 'posta', 'Posta / Kargo Merkezi': 'posta',
  'Mobil Saha Ekibi': 'mobil', 'Kargo Terminali': 'antrepo',
  'Liman Kontrol Noktası': 'liman', 'Antrepo Bölgesi': 'antrepo',
  'Karayolu Kontrol Noktası': 'karayolu', 'Havalimanı Kargo': 'havalimanı',
};

const TIP_LABEL: Record<LokasyonTipi, string> = {
  sinir: 'Sınır Kapısı', liman: 'Deniz Limanı', havalimanı: 'Havalimanı',
  karayolu: 'Karayolu Kontrolü', antrepo: 'Antrepo / Depo',
  posta: 'Posta & Kargo', mobil: 'Mobil Ekip',
};

const TIP_HARF: Record<LokasyonTipi, string> = {
  sinir: 'S', liman: 'L', havalimanı: 'H', karayolu: 'K', antrepo: 'A', posta: 'P', mobil: 'M',
};

const TIP_RENK: Record<LokasyonTipi, string> = {
  sinir: '#00D4FF', liman: '#3B82F6', havalimanı: '#8B5CF6',
  karayolu: '#F59E0B', antrepo: '#6366F1', posta: '#EC4899', mobil: '#10B981',
};

function createDataMarker(testSayisi: number, pozitifSayisi: number, aktif: boolean, _tip: LokasyonTipi) {
  const oran = testSayisi > 0 ? pozitifSayisi / testSayisi : 0;
  const renk = pozitifSayisi > 0 ? (oran > 0.4 ? '#ef4444' : '#f97316') : '#00D4FF';
  const boyut = Math.min(30 + testSayisi * 1.8, 54);
  const ringSize = boyut + 16;

  const pulseRings = aktif ? `
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${ringSize + 20}px;height:${ringSize + 20}px;border-radius:50%;
      border:1px solid ${renk}40;animation:senPulse2 2s infinite 0.3s;pointer-events:none;"></div>
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${ringSize}px;height:${ringSize}px;border-radius:50%;
      border:1.5px solid ${renk}70;animation:senPulse2 2s infinite;pointer-events:none;"></div>` : `
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${ringSize}px;height:${ringSize}px;border-radius:50%;
      border:1px solid ${renk}25;pointer-events:none;"></div>`;

  const html = `
    <div style="position:relative;width:${boyut}px;height:${boyut}px;">
      ${pulseRings}
      <div style="position:relative;z-index:2;width:${boyut}px;height:${boyut}px;border-radius:50%;
        background:radial-gradient(circle at 35% 35%, ${renk}dd, ${renk}88);
        border:2px solid ${renk};
        box-shadow:0 0 20px ${renk}66, 0 0 40px ${renk}22, inset 0 1px 0 rgba(255,255,255,0.25);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        color:white;font-weight:900;line-height:1.1;font-family:monospace;">
        <span style="font-size:${boyut > 40 ? '13' : '10'}px;text-shadow:0 0 8px rgba(0,0,0,0.8);">${testSayisi}</span>
        ${pozitifSayisi > 0 ? `<span style="font-size:8px;opacity:0.85;color:#fff;">+${pozitifSayisi}</span>` : ''}
      </div>
    </div>`;
  return L.divIcon({ html, className: '', iconSize: [boyut, boyut], iconAnchor: [boyut / 2, boyut / 2] });
}

function createEmptyMarker(tip: LokasyonTipi) {
  const renk = TIP_RENK[tip];
  const harf = TIP_HARF[tip];
  const html = `
    <div style="width:20px;height:20px;border-radius:50%;
      background:${renk}12;border:1px solid ${renk}45;
      display:flex;align-items:center;justify-content:center;
      color:${renk}88;font-size:7px;font-weight:900;font-family:monospace;
      box-shadow:0 0 8px ${renk}20;">
      ${harf}
    </div>`;
  return L.divIcon({ html, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });
}

interface OperasyonHaritaProps {
  testKayitlari: TestKaydi[];
  canliOlay?: string | null;
  compact?: boolean;
}

export function OperasyonHarita({ testKayitlari, canliOlay, compact }: OperasyonHaritaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [secilenNokta, setSecilenNokta] = useState<NoktaDetay | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('tumu');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, {
      center: [39.0, 35.5],
      zoom: compact ? 4 : 5,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const style = document.createElement('style');
    style.id = 'sentek-map-style';
    style.textContent = `
      @keyframes senPulse2 {
        0%   { transform:translate(-50%,-50%) scale(0.85); opacity:0.8; }
        50%  { transform:translate(-50%,-50%) scale(1.35); opacity:0.1; }
        100% { transform:translate(-50%,-50%) scale(0.85); opacity:0.8; }
      }
      .leaflet-popup-content-wrapper { background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important; }
      .leaflet-popup-content { margin:0!important; }
      .leaflet-popup-tip-container { display:none!important; }
      .leaflet-control-zoom { border:1px solid rgba(0,212,255,0.18)!important; border-radius:8px!important; overflow:hidden; }
      .leaflet-control-zoom a { background:rgba(6,12,26,0.92)!important; color:#00D4FF!important; border-bottom:1px solid rgba(0,212,255,0.12)!important; font-weight:700!important; }
      .leaflet-control-zoom a:hover { background:rgba(0,212,255,0.12)!important; }
    `;
    document.head.appendChild(style);
    mapInstanceRef.current = map;
    return () => { style.remove(); map.remove(); mapInstanceRef.current = null; };
  }, [compact]);

  useEffect(() => {
    if (!canliOlay || !mapInstanceRef.current) return;
    const coords = LOKASYON_KOORDINATLARI[canliOlay];
    if (coords) mapInstanceRef.current.panTo(coords, { animate: true, duration: 0.8 });
  }, [canliOlay]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const setNokta = setSecilenNokta;

    Object.entries(LOKASYON_KOORDINATLARI).forEach(([lokasyon, [lat, lng]]) => {
      const tip = (LOKASYON_TIP[lokasyon] || 'mobil') as LokasyonTipi;
      const kayitlar = testKayitlari.filter(t => t.lokasyon === lokasyon);
      const pozitifler = kayitlar.filter(t => t.testSonucu === 'Pozitif');
      const negatifler = kayitlar.filter(t => t.testSonucu === 'Negatif');
      const gecersizler = kayitlar.filter(t => t.testSonucu === 'Geçersiz');
      const testSayisi = kayitlar.length;
      const pozitifSayisi = pozitifler.length;
      const hasData = testSayisi > 0;
      const hasPozitif = pozitifSayisi > 0;

      if (filtre === 'aktif' && !hasData) return;
      if (filtre === 'pozitif' && !hasPozitif) return;

      const aktif = canliOlay === lokasyon;
      const icon = hasData
        ? createDataMarker(testSayisi, pozitifSayisi, aktif, tip)
        : createEmptyMarker(tip);

      const sonKayit = kayitlar[0];
      const sonMadde = kayitlar.find(k => k.tespitEdilenMadde)?.tespitEdilenMadde;
      const tipRenk = TIP_RENK[tip];
      const pozRenk = pozitifSayisi > 0 ? '#f87171' : '#34d399';

      const popupHtml = `
        <div style="background:rgba(6,10,22,0.97);border:1px solid ${tipRenk}45;border-radius:12px;padding:12px;min-width:210px;font-family:system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,0.7),0 0 20px ${tipRenk}15;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span style="font-size:9px;font-weight:900;letter-spacing:0.18em;color:${tipRenk};background:${tipRenk}15;border:1px solid ${tipRenk}30;padding:2px 7px;border-radius:5px;">${TIP_LABEL[tip].toUpperCase()}</span>
          </div>
          <p style="font-weight:700;font-size:12px;color:#e2e8f0;margin:0 0 8px;line-height:1.3;">${lokasyon}</p>
          ${hasData ? `
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">
            <div style="background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.1);border-radius:7px;padding:5px;text-align:center;">
              <p style="color:#64748b;margin:0;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Test</p>
              <p style="font-weight:900;color:#00D4FF;margin:0;font-size:17px;font-family:monospace;">${testSayisi}</p>
            </div>
            <div style="background:${pozitifSayisi > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.07)'};border:1px solid ${pozitifSayisi > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)'};border-radius:7px;padding:5px;text-align:center;">
              <p style="color:#64748b;margin:0;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Poz</p>
              <p style="font-weight:900;color:${pozRenk};margin:0;font-size:17px;font-family:monospace;">${pozitifSayisi}</p>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:5px;text-align:center;">
              <p style="color:#64748b;margin:0;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Neg</p>
              <p style="font-weight:900;color:#94a3b8;margin:0;font-size:17px;font-family:monospace;">${negatifler.length}</p>
            </div>
          </div>
          ${sonMadde ? `<p style="margin:4px 0 0;font-size:10px;color:#f87171;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.18);border-radius:6px;padding:4px 8px;">⚠ ${sonMadde}</p>` : ''}
          ${sonKayit ? `<p style="margin:5px 0 0;font-size:9px;color:#475569;font-family:monospace;">Son kayıt: ${new Date(sonKayit.tarih).toLocaleDateString('tr-TR')}</p>` : ''}
          ` : `<p style="margin:0;font-size:10px;color:#475569;font-style:italic;">Henüz test kaydı yok</p>`}
        </div>`;

      const popup = L.popup({ className: 'sentek-popup', closeButton: false, maxWidth: 250, offset: [0, -8] })
        .setContent(popupHtml);

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(popup)
        .addTo(map);

      marker.on('click', () => {
        setNokta({ lokasyon, tip, lat, lng, testSayisi, pozitifSayisi, negatifSayisi: negatifler.length, gecersizSayisi: gecersizler.length, sonTestTarihi: sonKayit?.tarih, sonTestSonucu: sonKayit?.testSonucu, sonMadde });
      });

      markersRef.current.push(marker);
    });
  }, [testKayitlari, canliOlay, filtre]);

  const FILTRE_LABELS: Record<Filtre, string> = {
    tumu: `Tümü (${Object.keys(LOKASYON_KOORDINATLARI).length})`,
    aktif: 'Aktif',
    pozitif: 'Pozitif',
  };

  return (
    <div className="relative w-full h-full" style={{ background: '#060c1a' }}>
      {/* Map tile layer */}
      <div ref={mapRef} className="w-full h-full" style={{ background: '#060c1a' }} />

      {/* Scanline tech overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.012) 3px, rgba(0,212,255,0.012) 4px)',
        zIndex: 200,
      }} />

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(4,8,20,0.55) 100%)',
        zIndex: 201,
      }} />

      {/* Corner brackets — top-left */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 600 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M2 20 L2 2 L20 2" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Corner brackets — top-right */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{ zIndex: 600 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M38 20 L38 2 L20 2" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Corner brackets — bottom-left */}
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ zIndex: 600 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M2 20 L2 38 L20 38" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Corner brackets — bottom-right */}
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ zIndex: 600 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M38 20 L38 38 L20 38" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Filter tabs */}
      <div className="absolute top-2.5 left-10 flex gap-1" style={{ zIndex: 1000 }}>
        {(Object.keys(FILTRE_LABELS) as Filtre[]).map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all border ${
              filtre === f
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'border-white/8 text-muted-foreground hover:border-white/15'
            }`}
            style={{ backdropFilter: 'blur(12px)', background: filtre === f ? undefined : 'rgba(4,8,20,0.75)' }}>
            {FILTRE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Selected location panel */}
      {secilenNokta && (
        <div className="absolute top-12 right-2 w-56 rounded-xl border p-3 text-xs space-y-2"
          style={{ zIndex: 1000, background: 'rgba(5,9,22,0.96)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black tracking-[0.18em] uppercase px-1.5 py-0.5 rounded mr-1"
                style={{ backgroundColor: `${TIP_RENK[secilenNokta.tip]}15`, color: TIP_RENK[secilenNokta.tip], border: `1px solid ${TIP_RENK[secilenNokta.tip]}30` }}>
                {TIP_LABEL[secilenNokta.tip]}
              </span>
              <p className="font-bold text-foreground mt-1.5 leading-tight">{secilenNokta.lokasyon}</p>
            </div>
            <button onClick={() => setSecilenNokta(null)}
              className="text-muted-foreground/60 hover:text-foreground text-base leading-none flex-shrink-0 mt-0.5">×</button>
          </div>

          {secilenNokta.testSayisi > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { l: 'Test', v: secilenNokta.testSayisi, c: '#00D4FF' },
                  { l: 'Poz', v: secilenNokta.pozitifSayisi, c: secilenNokta.pozitifSayisi > 0 ? '#EF4444' : '#334155' },
                  { l: 'Neg', v: secilenNokta.negatifSayisi, c: '#10B981' },
                  { l: 'Geç', v: secilenNokta.gecersizSayisi, c: '#64748B' },
                ].map(({ l, v, c }) => (
                  <div key={l} className="rounded-lg py-1.5 text-center" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] font-black font-mono" style={{ color: c }}>{v}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{l}</p>
                  </div>
                ))}
              </div>
              {secilenNokta.pozitifSayisi > 0 && (
                <div className="w-full bg-black/20 rounded-full h-1 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500 transition-all"
                    style={{ width: `${Math.round(secilenNokta.pozitifSayisi / secilenNokta.testSayisi * 100)}%` }} />
                </div>
              )}
              {secilenNokta.sonMadde && (
                <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-[9px] text-red-400/70 uppercase tracking-wider mb-0.5">Son Pozitif Madde</p>
                  <p className="text-xs font-bold text-red-300">{secilenNokta.sonMadde}</p>
                </div>
              )}
              {secilenNokta.sonTestTarihi && (
                <p className="text-[9px] font-mono text-muted-foreground/50">
                  Son: {new Date(secilenNokta.sonTestTarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}
            </>
          ) : (
            <p className="text-[10px] text-muted-foreground/50 italic py-2 text-center">Henüz test kaydı yok</p>
          )}
        </div>
      )}

      {/* Legend */}
      {!compact && (
        <div className="absolute bottom-3 left-3 rounded-xl p-3 text-xs space-y-1.5" style={{
          zIndex: 1000,
          background: 'rgba(5,9,22,0.93)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,212,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <p className="font-black text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">
            Gösterge
          </p>
          {[
            { renk: '#ef4444', label: 'Yüksek pozitif' },
            { renk: '#f97316', label: 'Orta pozitif' },
            { renk: '#00D4FF', label: 'Temiz / aktif' },
          ].map(({ renk, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: renk, boxShadow: `0 0 6px ${renk}88` }} />
              <span className="text-muted-foreground text-[10px]">{label}</span>
            </div>
          ))}
          <div className="border-t pt-1.5 mt-1 space-y-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {(['sinir', 'liman', 'havalimanı', 'karayolu'] as LokasyonTipi[]).map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: TIP_RENK[t] + '55', background: TIP_RENK[t] + '12' }}>
                  <span style={{ fontSize: '5px', color: TIP_RENK[t], fontWeight: 900 }}>{TIP_HARF[t]}</span>
                </div>
                <span className="text-muted-foreground/60 text-[10px]">{TIP_LABEL[t]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
