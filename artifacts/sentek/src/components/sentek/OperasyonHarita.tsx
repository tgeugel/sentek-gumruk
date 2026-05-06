import { useState, useMemo, useCallback, memo, useRef, useLayoutEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { TestKaydi } from '../../types';
import { db } from '../../lib/db';
import TR_ILLER from '../../data/turkiyeIller';

type LokasyonTipi = 'sinir' | 'liman' | 'havalimanı' | 'karayolu' | 'antrepo' | 'posta' | 'mobil';
type Filtre = 'tumu' | 'aktif' | 'pozitif';

interface NoktaDetay {
  lokasyon: string;
  tip: LokasyonTipi;
  testSayisi: number;
  pozitifSayisi: number;
  negatifSayisi: number;
  gecersizSayisi: number;
  sonTestTarihi?: string;
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

const VB_W = 1000;
const VB_H = 422;

function project(lat: number, lng: number): [number, number] {
  const x = Math.round(60 + (lng - 26) * 47.9);
  const y = Math.round(5 + (42 - lat) * 66.9);
  return [
    Math.max(8, Math.min(VB_W - 8, x)),
    Math.max(8, Math.min(VB_H - 8, y)),
  ];
}

interface NokData {
  lokasyon: string; tip: LokasyonTipi;
  svgX: number; svgY: number;
  testSayisi: number; pozitifSayisi: number; negatifSayisi: number; gecersizSayisi: number;
  sonMadde?: string; sonTestTarihi?: string;
  renk: string; r: number; hasData: boolean; hasPozitif: boolean;
}

/* ─── STATIC LAYER — memoized, only re-renders when filtre/noktalar change ── */
const StaticMapLayer = memo(function StaticMapLayer() {
  return (
    <g>
      {/* Deep shadow extrusion under Turkey — gives 3-D depth */}
      {TR_ILLER.map(il => (
        <path key={`depth3-${il.id}`} d={il.d}
          fill="rgba(0,5,15,0.55)" stroke="none"
          transform="translate(4,6)" style={{ pointerEvents: 'none' }} />
      ))}
      {TR_ILLER.map(il => (
        <path key={`depth2-${il.id}`} d={il.d}
          fill="rgba(0,8,22,0.45)" stroke="none"
          transform="translate(2.5,4)" style={{ pointerEvents: 'none' }} />
      ))}
      {TR_ILLER.map(il => (
        <path key={`depth1-${il.id}`} d={il.d}
          fill="rgba(0,12,30,0.35)" stroke="none"
          transform="translate(1,2)" style={{ pointerEvents: 'none' }} />
      ))}

      {/* Province fill — gradient top-to-bottom for depth illusion */}
      {TR_ILLER.map(il => (
        <path key={il.id} d={il.d}
          className="il-path"
          fill="url(#ohProvFill)"
          stroke="rgba(0,212,255,0.30)"
          strokeWidth="0.55"
          strokeLinejoin="round"
        />
      ))}

      {/* Province inner highlight — top edge lighter */}
      {TR_ILLER.map(il => (
        <path key={`hi-${il.id}`} d={il.d}
          fill="none"
          stroke="rgba(100,200,255,0.06)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        />
      ))}

      {/* Outer glow — cyan bloom on borders */}
      {TR_ILLER.map(il => (
        <path key={`glow-${il.id}`} d={il.d}
          fill="none"
          stroke="rgba(0,212,255,0.09)"
          strokeWidth="5"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none', filter: 'blur(1px)' }}
        />
      ))}
    </g>
  );
});

/* ─── MARKERS LAYER ──────────────────────────────────────────────────────── */
interface MarkersProps {
  gosterilecekler: NokData[];
  secilenLokasyon: string | null;
  onSelect: (n: NokData) => void;
}

const MarkersLayer = memo(function MarkersLayer({ gosterilecekler, secilenLokasyon, onSelect }: MarkersProps) {
  return (
    <g>
      {gosterilecekler.map(n => {
        const isSecili = secilenLokasyon === n.lokasyon;
        return (
          <g key={n.lokasyon} className="svg-marker"
            onClick={() => onSelect(n)}>

            {/* Static halo around pozitif locations — replaces pulse rings (map must stay still) */}
            {n.hasPozitif && (
              <>
                <circle cx={n.svgX} cy={n.svgY} r={n.r + 5}
                  fill="none" stroke={n.renk} strokeWidth="1.2" strokeOpacity="0.45" />
                <circle cx={n.svgX} cy={n.svgY} r={n.r + 9}
                  fill="none" stroke={n.renk} strokeWidth="0.7" strokeOpacity="0.22" />
              </>
            )}

            {/* Selection ring */}
            {isSecili && (
              <circle cx={n.svgX} cy={n.svgY} r={n.r + 8}
                fill="none" stroke={n.renk} strokeWidth="1.8" strokeOpacity="0.9"
                strokeDasharray="4 2.5" />
            )}

            {/* Ambient glow beneath marker */}
            {n.hasData && (
              <circle cx={n.svgX} cy={n.svgY} r={n.r + 4}
                fill={n.renk + '18'} stroke="none"
                style={{ pointerEvents: 'none', filter: 'blur(3px)' }} />
            )}

            {/* Marker body */}
            {n.hasData ? (
              <g className="marker-core">
                {/* Outer ring */}
                <circle cx={n.svgX} cy={n.svgY} r={n.r + 2}
                  fill="none" stroke={n.renk + '40'} strokeWidth="1" />
                {/* Shadow */}
                <circle cx={n.svgX + 1} cy={n.svgY + 1.5} r={n.r}
                  fill="rgba(0,0,0,0.5)" stroke="none"
                  style={{ pointerEvents: 'none' }} />
                {/* Main fill — radial gradient via stops inline trick */}
                <circle cx={n.svgX} cy={n.svgY} r={n.r}
                  fill={n.renk + 'dd'} stroke={n.renk}
                  strokeWidth="1.5" filter="url(#ohGlowMed)" />
                {/* Inner highlight shine */}
                <circle cx={n.svgX - n.r * 0.25} cy={n.svgY - n.r * 0.3} r={n.r * 0.38}
                  fill="rgba(255,255,255,0.22)" stroke="none"
                  style={{ pointerEvents: 'none' }} />
                {/* Count label */}
                <text x={n.svgX} y={n.svgY + 1}
                  fontSize={n.r > 12 ? '8.5' : '7'}
                  fontWeight="900" fontFamily="monospace"
                  fill="white" textAnchor="middle" dominantBaseline="middle"
                  style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  {n.testSayisi}
                </text>
                {n.pozitifSayisi > 0 && n.r > 11 && (
                  <text x={n.svgX} y={n.svgY + n.r + 7}
                    fontSize="5.5" fontWeight="700" fontFamily="monospace"
                    fill={n.renk} textAnchor="middle"
                    style={{ pointerEvents: 'none' }}>
                    +{n.pozitifSayisi}
                  </text>
                )}
              </g>
            ) : (
              <g className="marker-core">
                {/* Dormant marker */}
                <circle cx={n.svgX} cy={n.svgY} r={n.r + 1}
                  fill="none" stroke={n.renk + '20'} strokeWidth="0.8" />
                <circle cx={n.svgX} cy={n.svgY} r={n.r}
                  fill={n.renk + '15'} stroke={n.renk + '45'}
                  strokeWidth="0.8" />
                <text x={n.svgX} y={n.svgY + 1}
                  fontSize="5.5" fontWeight="900" fontFamily="monospace"
                  fill={n.renk + '80'} textAnchor="middle" dominantBaseline="middle"
                  style={{ pointerEvents: 'none' }}>
                  {TIP_HARF[n.tip]}
                </text>
              </g>
            )}

          </g>
        );
      })}
    </g>
  );
}, (prev, next) =>
  prev.secilenLokasyon === next.secilenLokasyon &&
  prev.gosterilecekler === next.gosterilecekler
);

interface OperasyonHaritaProps {
  compact?: boolean;
}

export const OperasyonHarita = memo(function OperasyonHarita({ compact }: OperasyonHaritaProps) {
  const rawTestler = useLiveQuery(
    () => db.testKayitlari.orderBy('tarih').reverse().toArray(),
    []
  );
  const testKayitlari: TestKaydi[] = (rawTestler as TestKaydi[] | undefined) ?? [];

  const [secilenNokta, setSecilenNokta] = useState<NoktaDetay | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('tumu');

  const noktalar = useMemo((): NokData[] => {
    if (!testKayitlari || testKayitlari.length === 0) return Object.entries(LOKASYON_KOORDINATLARI).map(([lokasyon, [lat, lng]]) => {
      const tip = (LOKASYON_TIP[lokasyon] || 'mobil') as LokasyonTipi;
      const [svgX, svgY] = project(lat, lng);
      return { lokasyon, tip, svgX, svgY, testSayisi: 0, pozitifSayisi: 0, negatifSayisi: 0, gecersizSayisi: 0, renk: TIP_RENK[tip], r: 5, hasData: false, hasPozitif: false };
    });
    return Object.entries(LOKASYON_KOORDINATLARI).map(([lokasyon, [lat, lng]]) => {
      const tip = (LOKASYON_TIP[lokasyon] || 'mobil') as LokasyonTipi;
      const kayitlar = testKayitlari.filter(t => t.lokasyon === lokasyon);
      const pozitifler = kayitlar.filter(t => t.testSonucu === 'Pozitif');
      const negatifler = kayitlar.filter(t => t.testSonucu === 'Negatif');
      const gecersizler = kayitlar.filter(t => t.testSonucu === 'Geçersiz');
      const testSayisi = kayitlar.length;
      const pozitifSayisi = pozitifler.length;
      const sonMadde = kayitlar.find(k => k.tespitEdilenMadde)?.tespitEdilenMadde;
      const sonTestTarihi = kayitlar[0]?.tarih;
      const [svgX, svgY] = project(lat, lng);
      const oran = testSayisi > 0 ? pozitifSayisi / testSayisi : 0;
      const renk = pozitifSayisi > 0 ? (oran > 0.4 ? '#ef4444' : '#f97316') : TIP_RENK[tip];
      const r = testSayisi > 0 ? Math.min(7 + testSayisi * 0.9, 17) : 5;
      return {
        lokasyon, tip, svgX, svgY,
        testSayisi, pozitifSayisi,
        negatifSayisi: negatifler.length, gecersizSayisi: gecersizler.length,
        sonMadde, sonTestTarihi, renk, r,
        hasData: testSayisi > 0, hasPozitif: pozitifSayisi > 0,
      };
    });
  }, [testKayitlari]);

  const gosterilecekler = useMemo(() => {
    return noktalar.filter(n => {
      if (filtre === 'aktif') return n.hasData;
      if (filtre === 'pozitif') return n.hasPozitif;
      return true;
    });
  }, [noktalar, filtre]);

  const FILTRE_LABELS: Record<Filtre, string> = {
    tumu: `Tümü (${Object.keys(LOKASYON_KOORDINATLARI).length})`,
    aktif: 'Aktif',
    pozitif: 'Pozitif',
  };

  const handleSelect = useCallback((n: NokData) => {
    setSecilenNokta(prev => prev?.lokasyon === n.lokasyon ? null : {
      lokasyon: n.lokasyon, tip: n.tip,
      testSayisi: n.testSayisi, pozitifSayisi: n.pozitifSayisi,
      negatifSayisi: n.negatifSayisi, gecersizSayisi: n.gecersizSayisi,
      sonTestTarihi: n.sonTestTarihi, sonMadde: n.sonMadde,
    });
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svgElemRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const container = mapContainerRef.current;
    const svg = svgElemRef.current;
    if (!container || !svg) return;

    let lastW = 0;
    let lastH = 0;

    const applyTransform = (force = false) => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      // HARD LOCK: ignore any container size fluctuation < 8px.
      // Only deliberate resizes (window resize, sidebar toggle) update the transform.
      // This prevents sub-pixel/layout-fluctuation zoom on every live feed update.
      if (!force && Math.abs(w - lastW) < 8 && Math.abs(h - lastH) < 8) return;
      lastW = w;
      lastH = h;
      const scale = Math.max(w / VB_W, h / VB_H);
      const tx = (w - VB_W * scale) / 2;
      const ty = (h - VB_H * scale) / 2;
      svg.style.transform = `matrix(${scale},0,0,${scale},${tx},${ty})`;
    };

    // Initial measurement — force apply
    applyTransform(true);
    // Subsequent: only respond to window resize (real user action), not container fluctuations
    const onWindowResize = () => applyTransform(true);
    window.addEventListener('resize', onWindowResize);
    // Container observer with 8px threshold guards against rare sidebar/layout shifts
    const ro = new ResizeObserver(() => applyTransform(false));
    ro.observe(container);
    return () => {
      window.removeEventListener('resize', onWindowResize);
      ro.disconnect();
    };
  }, []);

  const gridLngs = [28, 30, 32, 34, 36, 38, 40, 42, 44];
  const gridLats = [37, 38, 39, 40, 41, 42];

  return (
    <div ref={mapContainerRef} className="relative w-full h-full overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 60%, #03091e 0%, #010408 100%)', isolation: 'isolate' }}>

      {/* ── SVG MAP — fixed pixel size, ResizeObserver matrix transform, no preserveAspectRatio ── */}
      <svg
        ref={svgElemRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={VB_W}
        height={VB_H}
        overflow="hidden"
        style={{ display: 'block', position: 'absolute', top: 0, left: 0, transformOrigin: '0 0', overflow: 'hidden' }}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Province gradient — gives top-to-bottom depth */}
          <linearGradient id="ohProvFill" x1="0" y1="0" x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#071e42" />
            <stop offset="55%"  stopColor="#04122e" />
            <stop offset="100%" stopColor="#020a1c" />
          </linearGradient>

          {/* Vignette */}
          <radialGradient id="ohVignette" cx="50%" cy="50%" r="72%">
            <stop offset="30%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(1,3,10,0.85)" />
          </radialGradient>

          {/* Scanlines */}
          <pattern id="ohScanlines" x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="2.5" fill="transparent" />
            <rect x="0" y="2.5" width="1" height="0.5" fill="rgba(0,212,255,0.012)" />
          </pattern>

          {/* Dot grid overlay */}
          <pattern id="ohDotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill="rgba(0,212,255,0.07)" />
          </pattern>

          {/* Marker glow filters */}
          <filter id="ohGlowMed" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ohGlowStrong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ohDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.7)" />
          </filter>

          {/* Outer ambient sea gradient */}
          <radialGradient id="ohSeaGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="rgba(0,50,120,0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width={VB_W} height={VB_H} fill="url(#ohSeaGlow)" />
        <rect width={VB_W} height={VB_H} fill="url(#ohDotGrid)" style={{ pointerEvents: 'none' }} />

        {/* Graticule grid */}
        {gridLngs.map(lng => {
          const x = project(40, lng)[0];
          return (
            <g key={`vg-${lng}`} style={{ pointerEvents: 'none' }}>
              <line x1={x} y1={0} x2={x} y2={VB_H}
                stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" strokeDasharray="4 6" />
              <text x={x} y={VB_H - 4} fontSize="7" fill="rgba(0,212,255,0.20)"
                textAnchor="middle" fontFamily="monospace">{lng}°E</text>
            </g>
          );
        })}
        {gridLats.map(lat => {
          const y = project(lat, 36)[1];
          return (
            <g key={`hg-${lat}`} style={{ pointerEvents: 'none' }}>
              <line x1={0} y1={y} x2={VB_W} y2={y}
                stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" strokeDasharray="4 6" />
              <text x={7} y={y - 3} fontSize="7" fill="rgba(0,212,255,0.20)"
                fontFamily="monospace">{lat}°N</text>
            </g>
          );
        })}

        {/* ── Memoized province layer ── */}
        <StaticMapLayer />

        {/* ── Dynamic markers ── */}
        <MarkersLayer
          gosterilecekler={gosterilecekler}
          secilenLokasyon={secilenNokta?.lokasyon ?? null}
          onSelect={handleSelect}
        />

        {/* Post-process overlays */}
        <rect width={VB_W} height={VB_H} fill="url(#ohScanlines)" style={{ pointerEvents: 'none' }} />
        <rect width={VB_W} height={VB_H} fill="url(#ohVignette)"  style={{ pointerEvents: 'none' }} />

        {/* HUD corner brackets */}
        <g style={{ pointerEvents: 'none' }}>
          <path d="M 2,26 L 2,2 L 26,2" stroke="rgba(0,212,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M ${VB_W-2},26 L ${VB_W-2},2 L ${VB_W-26},2`} stroke="rgba(0,212,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M 2,${VB_H-26} L 2,${VB_H-2} L 26,${VB_H-2}`} stroke="rgba(0,212,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M ${VB_W-2},${VB_H-26} L ${VB_W-2},${VB_H-2} L ${VB_W-26},${VB_H-2}`} stroke="rgba(0,212,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Corner inner accent dots */}
          <circle cx={2} cy={2} r={2} fill="rgba(0,212,255,0.6)" />
          <circle cx={VB_W-2} cy={2} r={2} fill="rgba(0,212,255,0.6)" />
          <circle cx={2} cy={VB_H-2} r={2} fill="rgba(0,212,255,0.6)" />
          <circle cx={VB_W-2} cy={VB_H-2} r={2} fill="rgba(0,212,255,0.6)" />

          {/* Status bar */}
          <text x={32} y={15} fontSize="8.5" fontWeight="900" fontFamily="monospace"
            fill="rgba(0,212,255,0.65)" letterSpacing="2">
            TÜRKİYE · TAKTİK HARITA
          </text>
          <text x={VB_W-10} y={15} fontSize="8" fontFamily="monospace"
            fill="rgba(0,212,255,0.40)" textAnchor="end">
            ● CANLI · {gosterilecekler.length} NOKTA
          </text>
          <text x={VB_W-10} y={VB_H-5} fontSize="6.5" fontFamily="monospace"
            fill="rgba(0,212,255,0.15)" textAnchor="end">
            © simplemaps.com · SENTEK GEO v3
          </text>

          {/* Top scan line accent */}
          <line x1={32} y1={18} x2={240} y2={18}
            stroke="rgba(0,212,255,0.25)" strokeWidth="0.5" />

          {/* Bottom edge glow line */}
          <line x1={0} y1={VB_H-1} x2={VB_W} y2={VB_H-1}
            stroke="rgba(0,212,255,0.18)" strokeWidth="1" />
        </g>
      </svg>

      {/* ── HTML Overlays — outside SVG, not affected by preserveAspectRatio ── */}

      {/* Filter buttons */}
      <div className="absolute flex gap-1.5" style={{ zIndex: 500, top: 58, left: 16 }}>
        {(Object.keys(FILTRE_LABELS) as Filtre[]).map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all border ${
              filtre === f
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'border-white/8 text-muted-foreground hover:border-white/15 hover:text-foreground/70'
            }`}
            style={{ backdropFilter: 'blur(14px)', background: filtre === f ? undefined : 'rgba(4,8,20,0.82)' }}>
            {FILTRE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Selected location detail panel */}
      {secilenNokta && (
        <div className="absolute w-62 rounded-xl p-3.5 space-y-2.5"
          style={{ zIndex: 500, top: 58, right: 10,
            background: 'rgba(4,9,24,0.97)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,212,255,0.18)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${TIP_RENK[secilenNokta.tip]}12`,
                  color: TIP_RENK[secilenNokta.tip],
                  border: `1px solid ${TIP_RENK[secilenNokta.tip]}30` }}>
                {TIP_LABEL[secilenNokta.tip]}
              </span>
              <p className="font-bold text-[13px] text-foreground mt-2 leading-tight">{secilenNokta.lokasyon}</p>
            </div>
            <button onClick={() => setSecilenNokta(null)}
              className="text-muted-foreground/50 hover:text-foreground text-lg leading-none flex-shrink-0 mt-0.5 transition-colors">×</button>
          </div>

          {secilenNokta.testSayisi > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { l: 'Test', v: secilenNokta.testSayisi,    c: '#00D4FF' },
                  { l: 'Poz',  v: secilenNokta.pozitifSayisi, c: secilenNokta.pozitifSayisi > 0 ? '#EF4444' : '#334155' },
                  { l: 'Neg',  v: secilenNokta.negatifSayisi, c: '#10B981' },
                  { l: 'Geç',  v: secilenNokta.gecersizSayisi,c: '#64748B' },
                ].map(({ l, v, c }) => (
                  <div key={l} className="rounded-lg py-2 text-center"
                    style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-[14px] font-black font-mono" style={{ color: c }}>{v}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
              {secilenNokta.pozitifSayisi > 0 && (
                <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                    style={{ width: `${Math.round(secilenNokta.pozitifSayisi / secilenNokta.testSayisi * 100)}%` }} />
                </div>
              )}
              {secilenNokta.sonMadde && (
                <div className="rounded-lg px-2.5 py-2"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <p className="text-[9px] text-red-400/60 uppercase tracking-wider mb-0.5">Son Pozitif Madde</p>
                  <p className="text-[12px] font-bold text-red-300">{secilenNokta.sonMadde}</p>
                </div>
              )}
              {secilenNokta.sonTestTarihi && (
                <p className="text-[9px] font-mono text-muted-foreground/40">
                  Son: {new Date(secilenNokta.sonTestTarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}
            </>
          ) : (
            <p className="text-[11px] text-muted-foreground/45 italic py-2 text-center">Henüz test kaydı yok</p>
          )}
        </div>
      )}

      {/* Legend */}
      {!compact && (
        <div className="absolute rounded-xl p-3 space-y-1.5"
          style={{ zIndex: 10, bottom: 12, left: 12,
            background: 'rgba(4,9,24,0.92)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(0,212,255,0.10)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
          <p className="font-black text-[9px] uppercase tracking-[0.22em] text-muted-foreground/60 mb-2.5">Gösterge</p>
          {[
            { renk: '#ef4444', label: 'Yüksek pozitif  (>40%)' },
            { renk: '#f97316', label: 'Orta pozitif' },
            { renk: '#00D4FF', label: 'Temiz / aktif' },
          ].map(({ renk, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: renk, boxShadow: `0 0 8px ${renk}88` }} />
              <span className="text-muted-foreground/70 text-[10px]">{label}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-1.5 space-y-1.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {(['sinir', 'liman', 'havalimanı', 'karayolu'] as LokasyonTipi[]).map(t => (
              <div key={t} className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: TIP_RENK[t] + '55', background: TIP_RENK[t] + '14' }}>
                  <span style={{ fontSize: '5.5px', color: TIP_RENK[t], fontWeight: 900 }}>{TIP_HARF[t]}</span>
                </div>
                <span className="text-muted-foreground/55 text-[10px]">{TIP_LABEL[t]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}, (prev, next) =>
  prev.compact === next.compact
);
