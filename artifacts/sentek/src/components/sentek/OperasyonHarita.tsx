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
  // Bulgaristan Sınırı
  'Kapıkule Sınır Kapısı':         [41.735, 26.282],
  'Hamzabeyli Sınır Kapısı':       [41.806, 26.641],
  'Dereköy Sınır Kapısı':          [41.952, 27.427],
  // Yunanistan Sınırı
  'İpsala Sınır Kapısı':           [40.922, 26.379],
  'Pazarkule Sınır Kapısı':        [41.714, 26.334],
  // Gürcistan Sınırı
  'Sarp Sınır Kapısı':             [41.495, 41.483],
  // İran Sınırı
  'Gürbulak Sınır Kapısı':         [39.697, 44.175],
  'Esendere Sınır Kapısı':         [37.375, 44.569],
  // Irak Sınırı
  'Habur Sınır Kapısı':            [37.152, 42.342],
  'Nusaybin Sınır Kapısı':         [37.073, 41.214],
  // Suriye Sınırı
  'Cilvegözü Sınır Kapısı':        [36.686, 36.633],
  'Öncüpınar Sınır Kapısı':        [36.695, 37.174],
  'Akçakale Sınır Kapısı':         [36.726, 38.952],
  // Limanlar
  'İzmir Alsancak Limanı':         [38.431, 27.139],
  'Mersin Uluslararası Limanı':    [36.801, 34.641],
  'Ambarlı Limanı':                [40.979, 28.657],
  'Haydarpaşa Limanı':             [40.998, 29.016],
  'Derince Limanı':                [40.764, 29.812],
  // Havalimanları
  'İstanbul Havalimanı Kargo':     [41.261, 28.746],
  'Sabiha Gökçen Kargo':           [40.899, 29.309],
  // Karayolu Kontrol
  'TEM Karayolu Kontrol':          [41.015, 28.978],
  'E-5 Karayolu Kontrol':          [40.183, 29.063],
  'Araç Arama Noktası':            [41.080, 28.920],
  // Antrepo / Depo
  'Merkez Antrepo':                [40.998, 28.956],
  'Adana Antrepo':                 [37.001, 35.351],
  // Posta / Kargo
  'PTT Kargo Merkezi İstanbul':    [41.020, 28.930],
  'Posta / Kargo Merkezi':         [37.003, 35.325],
  // Mobil
  'Mobil Saha Ekibi':              [39.925, 32.837],
  // Kargo Terminal
  'Kargo Terminali':               [41.065, 29.012],
  // Eski / Genel Operasyonel İsimler (eski test kayıtları için)
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

function createDataMarker(testSayisi: number, pozitifSayisi: number, aktif: boolean, tip: LokasyonTipi) {
  const oran = testSayisi > 0 ? pozitifSayisi / testSayisi : 0;
  const renk = pozitifSayisi > 0 ? (oran > 0.4 ? '#ef4444' : '#f97316') : '#10b981';
  const boyut = Math.min(28 + testSayisi * 2, 52);
  const pulseHtml = aktif ? `
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${boyut + 20}px;height:${boyut + 20}px;border-radius:50%;
      background:${renk}30;animation:senPulse 1.5s infinite;"></div>` : '';
  const html = `
    <div style="position:relative;width:${boyut}px;height:${boyut}px;">
      ${pulseHtml}
      <div style="position:relative;z-index:2;width:${boyut}px;height:${boyut}px;border-radius:50%;
        background:${renk};border:3px solid rgba(255,255,255,0.9);
        box-shadow:0 0 16px ${renk}99,0 2px 8px rgba(0,0,0,0.5);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        color:white;font-weight:800;line-height:1.1;">
        <span style="font-size:${boyut > 38 ? '12' : '10'}px;">${testSayisi}</span>
        ${pozitifSayisi > 0 ? `<span style="font-size:8px;opacity:0.9">+${pozitifSayisi}</span>` : ''}
      </div>
    </div>`;
  return L.divIcon({ html, className: '', iconSize: [boyut, boyut], iconAnchor: [boyut / 2, boyut / 2] });
}

function createEmptyMarker(tip: LokasyonTipi) {
  const renk = TIP_RENK[tip];
  const harf = TIP_HARF[tip];
  const html = `
    <div style="width:18px;height:18px;border-radius:50%;
      background:${renk}18;border:1.5px solid ${renk}55;
      display:flex;align-items:center;justify-content:center;
      color:${renk}99;font-size:7px;font-weight:800;">
      ${harf}
    </div>`;
  return L.divIcon({ html, className: '', iconSize: [18, 18], iconAnchor: [9, 9] });
}

interface OperasyonHaritaProps {
  testKayitlari: TestKaydi[];
  canliOlay?: string | null;
}

export function OperasyonHarita({ testKayitlari, canliOlay }: OperasyonHaritaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [secilenNokta, setSecilenNokta] = useState<NoktaDetay | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('tumu');

  // Map init
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [39.0, 35.5], zoom: 5, zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19,
    }).addTo(map);
    const style = document.createElement('style');
    style.id = 'sentek-map-style';
    style.textContent = `
      @keyframes senPulse {
        0%   { transform:translate(-50%,-50%) scale(0.7); opacity:0.7; }
        50%  { transform:translate(-50%,-50%) scale(1.4); opacity:0.15; }
        100% { transform:translate(-50%,-50%) scale(0.7); opacity:0.7; }
      }
      .leaflet-popup-content-wrapper { background:transparent!important; border:none!important; box-shadow:none!important; padding:0!important; }
      .leaflet-popup-content { margin:0!important; }
      .leaflet-popup-tip-container { display:none!important; }
    `;
    document.head.appendChild(style);
    mapInstanceRef.current = map;
    return () => { style.remove(); map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Pan to live event
  useEffect(() => {
    if (!canliOlay || !mapInstanceRef.current) return;
    const coords = LOKASYON_KOORDINATLARI[canliOlay];
    if (coords) mapInstanceRef.current.panTo(coords, { animate: true, duration: 0.8 });
  }, [canliOlay]);

  // Rebuild markers when data, live event, or filter changes
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
        <div style="background:#0d1829;border:1px solid ${tipRenk}40;border-radius:12px;padding:12px;min-width:200px;font-family:system-ui,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span style="font-size:10px;font-weight:800;letter-spacing:0.15em;color:${tipRenk};background:${tipRenk}15;border:1px solid ${tipRenk}30;padding:2px 7px;border-radius:5px;">${TIP_LABEL[tip].toUpperCase()}</span>
          </div>
          <p style="font-weight:700;font-size:12px;color:#e2e8f0;margin:0 0 8px;line-height:1.3;">${lokasyon}</p>
          ${hasData ? `
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">
            <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:5px;text-align:center;">
              <p style="color:#64748b;margin:0;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Test</p>
              <p style="font-weight:800;color:#e2e8f0;margin:0;font-size:16px;">${testSayisi}</p>
            </div>
            <div style="background:${pozitifSayisi > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.08)'};border-radius:6px;padding:5px;text-align:center;">
              <p style="color:#64748b;margin:0;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Poz</p>
              <p style="font-weight:800;color:${pozRenk};margin:0;font-size:16px;">${pozitifSayisi}</p>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:5px;text-align:center;">
              <p style="color:#64748b;margin:0;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Neg</p>
              <p style="font-weight:800;color:#94a3b8;margin:0;font-size:16px;">${negatifler.length}</p>
            </div>
          </div>
          ${sonMadde ? `<p style="margin:4px 0 0;font-size:10px;color:#f87171;background:rgba(239,68,68,0.1);border-radius:5px;padding:4px 7px;">⚠ ${sonMadde}</p>` : ''}
          ${sonKayit ? `<p style="margin:4px 0 0;font-size:9px;color:#475569;">Son kayıt: ${new Date(sonKayit.tarih).toLocaleDateString('tr-TR')}</p>` : ''}
          ` : `
          <p style="margin:0;font-size:10px;color:#475569;font-style:italic;">Henüz test kaydı yok</p>
          `}
        </div>`;

      const popup = L.popup({ className: 'sentek-popup', closeButton: false, maxWidth: 240, offset: [0, -8] })
        .setContent(popupHtml);

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(popup)
        .addTo(map);

      marker.on('click', () => {
        setNokta({
          lokasyon, tip, lat, lng,
          testSayisi, pozitifSayisi,
          negatifSayisi: negatifler.length,
          gecersizSayisi: gecersizler.length,
          sonTestTarihi: sonKayit?.tarih,
          sonTestSonucu: sonKayit?.testSonucu,
          sonMadde,
        });
      });

      markersRef.current.push(marker);
    });
  }, [testKayitlari, canliOlay, filtre]);

  const FILTRE_LABELS: Record<Filtre, string> = {
    tumu: `Tüm Noktalar (${Object.keys(LOKASYON_KOORDINATLARI).length})`,
    aktif: 'Aktif Noktalar',
    pozitif: 'Pozitif Noktalar',
  };

  const totalSinir = Object.values(LOKASYON_TIP).filter(t => t === 'sinir').length;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full" style={{ background: '#0a1221' }} />

      {/* Filtre Sekmeleri */}
      <div className="absolute top-3 left-12 z-[1000] flex gap-1">
        {(Object.keys(FILTRE_LABELS) as Filtre[]).map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all border ${
              filtre === f
                ? 'bg-primary/20 border-primary/50 text-primary'
                : 'bg-card/80 border-border/60 text-muted-foreground hover:border-border'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}>
            {FILTRE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Seçilen Lokasyon Paneli */}
      {secilenNokta && (
        <div className="absolute top-12 right-3 z-[1000] w-56 rounded-xl border border-border p-3 text-xs space-y-2"
          style={{ background: 'rgba(8,16,28,0.95)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black tracking-[0.18em] uppercase px-1.5 py-0.5 rounded mr-1"
                style={{ backgroundColor: `${TIP_RENK[secilenNokta.tip]}18`, color: TIP_RENK[secilenNokta.tip], border: `1px solid ${TIP_RENK[secilenNokta.tip]}35` }}>
                {TIP_LABEL[secilenNokta.tip]}
              </span>
              <p className="font-bold text-foreground mt-1.5 leading-tight">{secilenNokta.lokasyon}</p>
            </div>
            <button onClick={() => setSecilenNokta(null)}
              className="text-muted-foreground/60 hover:text-foreground text-base leading-none flex-shrink-0 mt-0.5">
              ×
            </button>
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
                  <div key={l} className="bg-black/30 rounded-lg py-1.5 text-center border border-slate-800/60">
                    <p className="text-[13px] font-black" style={{ color: c }}>{v}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{l}</p>
                  </div>
                ))}
              </div>

              {secilenNokta.pozitifSayisi > 0 && (
                <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500 transition-all"
                    style={{ width: `${Math.round(secilenNokta.pozitifSayisi / secilenNokta.testSayisi * 100)}%` }} />
                </div>
              )}

              {secilenNokta.sonMadde && (
                <div className="bg-red-500/8 border border-red-500/20 rounded-lg px-2.5 py-1.5">
                  <p className="text-[9px] text-red-400/70 uppercase tracking-wider mb-0.5">Son Pozitif Madde</p>
                  <p className="text-xs font-bold text-red-300">{secilenNokta.sonMadde}</p>
                </div>
              )}

              {secilenNokta.sonTestTarihi && (
                <p className="text-[9px] text-muted-foreground/60">
                  Son kayıt: {new Date(secilenNokta.sonTestTarihi).toLocaleDateString('tr-TR', { day:'2-digit', month:'short', year:'numeric' })}
                </p>
              )}
            </>
          ) : (
            <div className="py-2 text-center">
              <p className="text-[10px] text-muted-foreground/50 italic">Henüz test kaydı yok</p>
            </div>
          )}
        </div>
      )}

      {/* Gösterge */}
      <div className="absolute bottom-3 left-3 z-[1000] rounded-xl p-3 text-xs space-y-1.5"
        style={{ background: 'rgba(8,16,28,0.92)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="font-black text-[9px] uppercase tracking-[0.2em] text-muted-foreground/80 mb-2">
          Gösterge · {totalSinir} Sınır Kapısı
        </p>
        {[
          { renk: '#ef4444', label: 'Yüksek pozitif oran' },
          { renk: '#f97316', label: 'Orta pozitif oran' },
          { renk: '#10b981', label: 'Temiz / veri var' },
        ].map(({ renk, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: renk }} />
            <span className="text-muted-foreground text-[10px]">{label}</span>
          </div>
        ))}
        <div className="border-t border-border/30 pt-1.5 mt-1.5 space-y-1">
          {(['sinir','liman','havalimanı','karayolu'] as LokasyonTipi[]).map(t => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0"
                style={{ borderColor: TIP_RENK[t] + '60', background: TIP_RENK[t] + '15' }}>
                <span style={{ fontSize: '5px', color: TIP_RENK[t], fontWeight: 800 }}>{TIP_HARF[t]}</span>
              </div>
              <span className="text-muted-foreground/70 text-[10px]">{TIP_LABEL[t]}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground/40 text-[9px] mt-1">Sayı = toplam test</p>
      </div>
    </div>
  );
}
