import { useState, useMemo, useEffect, useRef } from 'react';
import { TestKaydi } from '../../types';
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

interface OperasyonHaritaProps {
  testKayitlari: TestKaydi[];
  canliOlay?: string | null;
  compact?: boolean;
}

export function OperasyonHarita({ testKayitlari, canliOlay, compact }: OperasyonHaritaProps) {
  const [secilenNokta, setSecilenNokta] = useState<NoktaDetay | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('tumu');
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const noktalar = useMemo(() => {
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
      const r = testSayisi > 0 ? Math.min(7 + testSayisi * 0.8, 16) : 5;
      return {
        lokasyon, tip, lat, lng, svgX, svgY,
        testSayisi, pozitifSayisi, negatifSayisi: negatifler.length,
        gecersizSayisi: gecersizler.length, sonMadde, sonTestTarihi,
        renk, r, hasData: testSayisi > 0, hasPozitif: pozitifSayisi > 0,
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

  const gridLngs = [28, 30, 32, 34, 36, 38, 40, 42, 44];
  const gridLats = [37, 38, 39, 40, 41, 42];

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ background: '#03060f' }}>
      <style>{`
        @keyframes svgPulse1 {
          0%   { r: var(--pr1); opacity: 0.7; }
          100% { r: calc(var(--pr1) + 12); opacity: 0; }
        }
        @keyframes svgPulse2 {
          0%   { r: var(--pr2); opacity: 0.5; }
          100% { r: calc(var(--pr2) + 20); opacity: 0; }
        }
        @keyframes svgBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .svg-pulse-1 { animation: svgPulse1 2s ease-out infinite; }
        .svg-pulse-2 { animation: svgPulse2 2s ease-out infinite 0.5s; }
        .svg-marker { cursor: pointer; transition: all 0.15s ease; }
        .svg-marker:hover .marker-core { filter: brightness(1.5); }
        .svg-canli { animation: svgBlink 1.2s ease-in-out infinite; }
        .il-path { transition: fill 0.2s ease; }
        .il-path:hover { fill: rgba(0,212,255,0.18) !important; }
      `}</style>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="ohBgGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#050d20" />
            <stop offset="100%" stopColor="#02040b" />
          </radialGradient>
          <radialGradient id="ohVignette" cx="50%" cy="50%" r="70%">
            <stop offset="35%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(2,4,12,0.7)" />
          </radialGradient>
          <filter id="ohGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ohGlowStrong">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="ohScanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="3" fill="transparent" />
            <rect x="0" y="3" width="1" height="1" fill="rgba(0,212,255,0.010)" />
          </pattern>
          <linearGradient id="ohSeaLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,30,70,0.6)" />
            <stop offset="100%" stopColor="rgba(0,30,70,0)" />
          </linearGradient>
          <linearGradient id="ohSeaRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,30,70,0)" />
            <stop offset="100%" stopColor="rgba(0,30,70,0.6)" />
          </linearGradient>
        </defs>

        <rect width={VB_W} height={VB_H} fill="url(#ohBgGrad)" />

        {gridLngs.map(lng => {
          const x = project(40, lng)[0];
          return (
            <g key={`vg-${lng}`}>
              <line x1={x} y1={0} x2={x} y2={VB_H} stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
              <text x={x} y={VB_H - 5} fontSize="7" fill="rgba(0,212,255,0.18)" textAnchor="middle" fontFamily="monospace">{lng}°E</text>
            </g>
          );
        })}
        {gridLats.map(lat => {
          const y = project(lat, 36)[1];
          return (
            <g key={`hg-${lat}`}>
              <line x1={0} y1={y} x2={VB_W} y2={y} stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
              <text x={6} y={y - 3} fontSize="7" fill="rgba(0,212,255,0.18)" fontFamily="monospace">{lat}°N</text>
            </g>
          );
        })}

        {TR_ILLER.map(il => (
          <path
            key={il.id}
            d={il.d}
            className="il-path"
            fill="rgba(5,15,38,0.92)"
            stroke="rgba(0,212,255,0.28)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        ))}

        {TR_ILLER.map(il => (
          <path
            key={`glow-${il.id}`}
            d={il.d}
            fill="none"
            stroke="rgba(0,212,255,0.07)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {gosterilecekler.map(n => {
          const isCanli = canliOlay === n.lokasyon;
          const isSecili = secilenNokta?.lokasyon === n.lokasyon;
          const pr1 = n.r + 5;
          const pr2 = n.r + 11;
          return (
            <g
              key={n.lokasyon}
              className="svg-marker"
              onClick={() => setSecilenNokta(isSecili ? null : {
                lokasyon: n.lokasyon, tip: n.tip,
                testSayisi: n.testSayisi, pozitifSayisi: n.pozitifSayisi,
                negatifSayisi: n.negatifSayisi, gecersizSayisi: n.gecersizSayisi,
                sonTestTarihi: n.sonTestTarihi, sonMadde: n.sonMadde,
              })}
            >
              {(n.hasPozitif || isCanli) && (
                <>
                  <circle
                    cx={n.svgX} cy={n.svgY}
                    style={{ ['--pr1' as string]: `${pr1}px` }}
                    r={pr1}
                    fill="none"
                    stroke={n.renk}
                    strokeWidth="1"
                    strokeOpacity="0.55"
                    className="svg-pulse-1"
                  />
                  <circle
                    cx={n.svgX} cy={n.svgY}
                    style={{ ['--pr2' as string]: `${pr2}px` }}
                    r={pr2}
                    fill="none"
                    stroke={n.renk}
                    strokeWidth="0.6"
                    strokeOpacity="0.3"
                    className="svg-pulse-2"
                  />
                </>
              )}

              {isSecili && (
                <circle cx={n.svgX} cy={n.svgY} r={n.r + 7}
                  fill="none" stroke={n.renk} strokeWidth="1.5" strokeOpacity="0.85"
                  strokeDasharray="3 2" />
              )}

              {n.hasData ? (
                <g className="marker-core">
                  <circle
                    cx={n.svgX} cy={n.svgY} r={n.r}
                    fill={n.renk + 'cc'}
                    stroke={n.renk}
                    strokeWidth="1.5"
                    filter="url(#ohGlow)"
                  />
                  <text
                    x={n.svgX} y={n.svgY + 1}
                    fontSize={n.r > 12 ? '8' : '6.5'}
                    fontWeight="900"
                    fontFamily="monospace"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {n.testSayisi}
                  </text>
                  {n.pozitifSayisi > 0 && n.r > 11 && (
                    <text
                      x={n.svgX} y={n.svgY + n.r + 6}
                      fontSize="5.5"
                      fontWeight="700"
                      fontFamily="monospace"
                      fill={n.renk}
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      +{n.pozitifSayisi}
                    </text>
                  )}
                </g>
              ) : (
                <g className="marker-core">
                  <circle
                    cx={n.svgX} cy={n.svgY} r={n.r}
                    fill={n.renk + '18'}
                    stroke={n.renk + '50'}
                    strokeWidth="0.8"
                  />
                  <text
                    x={n.svgX} y={n.svgY + 1}
                    fontSize="5"
                    fontWeight="900"
                    fontFamily="monospace"
                    fill={n.renk + '90'}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {TIP_HARF[n.tip]}
                  </text>
                </g>
              )}

              {isCanli && (
                <circle cx={n.svgX} cy={n.svgY} r={n.r}
                  fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.5"
                  className="svg-canli" />
              )}
            </g>
          );
        })}

        <rect width={VB_W} height={VB_H} fill="url(#ohScanlines)" style={{ pointerEvents: 'none' }} />
        <rect width={VB_W} height={VB_H} fill="url(#ohVignette)" style={{ pointerEvents: 'none' }} />

        <path d="M 2,22 L 2,2 L 22,2" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ pointerEvents: 'none' }} />
        <path d={`M ${VB_W - 2},22 L ${VB_W - 2},2 L ${VB_W - 22},2`} stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ pointerEvents: 'none' }} />
        <path d={`M 2,${VB_H - 22} L 2,${VB_H - 2} L 22,${VB_H - 2}`} stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ pointerEvents: 'none' }} />
        <path d={`M ${VB_W - 2},${VB_H - 22} L ${VB_W - 2},${VB_H - 2} L ${VB_W - 22},${VB_H - 2}`} stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ pointerEvents: 'none' }} />

        <text x={28} y={14} fontSize="8" fontWeight="900" fontFamily="monospace" fill="rgba(0,212,255,0.55)" letterSpacing="2" style={{ pointerEvents: 'none' }}>
          TÜRKİYE · TAKTİK HARITA
        </text>
        <text x={VB_W - 8} y={14} fontSize="7" fontFamily="monospace" fill="rgba(0,212,255,0.35)" textAnchor="end" style={{ pointerEvents: 'none' }}>
          {tick % 2 === 0 ? '●' : '○'} CANLI · {gosterilecekler.length} NOKTA
        </text>
        <text x={VB_W - 8} y={VB_H - 6} fontSize="6.5" fontFamily="monospace" fill="rgba(0,212,255,0.18)" textAnchor="end" style={{ pointerEvents: 'none' }}>
          © simplemaps.com · SENTEK GEO v3
        </text>
      </svg>

      <div className="absolute top-3 left-8 flex gap-1" style={{ zIndex: 10 }}>
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

      {secilenNokta && (
        <div className="absolute top-12 right-2 w-56 rounded-xl border p-3 text-xs space-y-2"
          style={{ zIndex: 10, background: 'rgba(5,9,22,0.97)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black tracking-[0.18em] uppercase px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${TIP_RENK[secilenNokta.tip]}15`, color: TIP_RENK[secilenNokta.tip], border: `1px solid ${TIP_RENK[secilenNokta.tip]}30` }}>
                {TIP_LABEL[secilenNokta.tip]}
              </span>
              <p className="font-bold text-foreground mt-1.5 leading-tight">{secilenNokta.lokasyon}</p>
            </div>
            <button onClick={() => setSecilenNokta(null)} className="text-muted-foreground/60 hover:text-foreground text-base leading-none flex-shrink-0 mt-0.5">×</button>
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

      {!compact && (
        <div className="absolute bottom-3 left-3 rounded-xl p-3 text-xs space-y-1.5" style={{
          zIndex: 10,
          background: 'rgba(5,9,22,0.93)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,212,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <p className="font-black text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">Gösterge</p>
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
