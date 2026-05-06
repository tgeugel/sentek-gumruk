import { useState, useEffect } from 'react';

interface Sektor {
  id: string;
  ad: string;
  kisa: string;
  tip: 'sinir' | 'liman' | 'havalimanı' | 'karayolu' | 'antrepo' | 'posta' | 'mobil';
  sonOlay: 'pozitif' | 'negatif' | 'lab' | 'stok' | 'sistem';
  sonZaman: string;
  aktifTest: number;
  pozitif: number;
  personelSayisi: number;
  guvenSkoru: number;
  canliMi: boolean;
}

const SEKTORLER: Sektor[] = [
  { id: 's1', ad: 'Sınır Kapısı A', kisa: 'SK-A', tip: 'sinir', sonOlay: 'pozitif', sonZaman: '04:12', aktifTest: 12, pozitif: 4, personelSayisi: 3, guvenSkoru: 89, canliMi: true },
  { id: 's2', ad: 'Sınır Kapısı B', kisa: 'SK-B', tip: 'sinir', sonOlay: 'negatif', sonZaman: '03:58', aktifTest: 8, pozitif: 1, personelSayisi: 2, guvenSkoru: 94, canliMi: true },
  { id: 's3', ad: 'Liman Kontrol Noktası', kisa: 'LMN', tip: 'liman', sonOlay: 'lab', sonZaman: '04:03', aktifTest: 15, pozitif: 5, personelSayisi: 4, guvenSkoru: 91, canliMi: true },
  { id: 's4', ad: 'Havalimanı Kargo', kisa: 'HVL', tip: 'havalimanı', sonOlay: 'pozitif', sonZaman: '03:47', aktifTest: 9, pozitif: 3, personelSayisi: 3, guvenSkoru: 88, canliMi: true },
  { id: 's5', ad: 'Antrepo Bölgesi', kisa: 'ANT', tip: 'antrepo', sonOlay: 'stok', sonZaman: '03:30', aktifTest: 6, pozitif: 2, personelSayisi: 2, guvenSkoru: 85, canliMi: false },
  { id: 's6', ad: 'Karayolu Kontrol', kisa: 'KRY', tip: 'karayolu', sonOlay: 'negatif', sonZaman: '03:24', aktifTest: 11, pozitif: 0, personelSayisi: 3, guvenSkoru: 96, canliMi: true },
  { id: 's7', ad: 'Posta / Kargo Merkezi', kisa: 'PST', tip: 'posta', sonOlay: 'sistem', sonZaman: '03:15', aktifTest: 4, pozitif: 1, personelSayisi: 1, guvenSkoru: 82, canliMi: false },
  { id: 's8', ad: 'Araç Arama Noktası', kisa: 'ARN', tip: 'karayolu', sonOlay: 'pozitif', sonZaman: '04:05', aktifTest: 14, pozitif: 4, personelSayisi: 4, guvenSkoru: 87, canliMi: true },
  { id: 's9', ad: 'Mobil Saha Ekibi', kisa: 'MOB', tip: 'mobil', sonOlay: 'sistem', sonZaman: '03:08', aktifTest: 3, pozitif: 0, personelSayisi: 2, guvenSkoru: 78, canliMi: true },
];

const TIP_ICON: Record<string, string> = {
  sinir: '🛃', liman: '⚓', havalimanı: '✈️', karayolu: '🚛', antrepo: '🏭', posta: '📦', mobil: '📡',
};

const OLAY_COLOR: Record<string, string> = {
  pozitif: '#EF4444',
  negatif: '#10B981',
  lab: '#8B5CF6',
  stok: '#F59E0B',
  sistem: '#64748B',
};

const OLAY_LABEL: Record<string, string> = {
  pozitif: 'POZ', negatif: 'NEG', lab: 'LAB', stok: 'STK', sistem: 'SYS',
};

function threatLevel(s: Sektor): number {
  if (s.pozitif >= 4) return 5;
  if (s.pozitif >= 2) return 4;
  if (s.pozitif >= 1) return 3;
  if (s.aktifTest >= 8) return 2;
  return 1;
}

function cellBg(level: number, olay: string): string {
  if (olay === 'pozitif' && level >= 4) return 'rgba(239,68,68,0.12)';
  if (olay === 'pozitif') return 'rgba(239,68,68,0.07)';
  if (olay === 'stok') return 'rgba(245,158,11,0.08)';
  return 'rgba(15,23,42,0.6)';
}

function cellBorder(level: number, olay: string): string {
  if (olay === 'pozitif' && level >= 4) return 'rgba(239,68,68,0.5)';
  if (olay === 'pozitif') return 'rgba(239,68,68,0.25)';
  if (olay === 'stok') return 'rgba(245,158,11,0.3)';
  if (olay === 'lab') return 'rgba(139,92,246,0.2)';
  return 'rgba(30,41,59,0.8)';
}

function cellGlow(level: number, olay: string): string {
  if (olay === 'pozitif' && level >= 5) return '0 0 30px rgba(239,68,68,0.3), inset 0 0 20px rgba(239,68,68,0.05)';
  if (olay === 'pozitif' && level >= 4) return '0 0 20px rgba(239,68,68,0.2)';
  return 'none';
}

function SectorCell({ sektor, selected, onClick }: { sektor: Sektor; selected: boolean; onClick: () => void }) {
  const [pulse, setPulse] = useState(false);
  const level = threatLevel(sektor);
  const c = OLAY_COLOR[sektor.sonOlay];

  useEffect(() => {
    if (!sektor.canliMi) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [sektor.canliMi]);

  return (
    <button
      onClick={onClick}
      className="relative rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer text-left"
      style={{
        backgroundColor: cellBg(level, sektor.sonOlay),
        border: `1px solid ${selected ? c : cellBorder(level, sektor.sonOlay)}`,
        boxShadow: selected ? `0 0 24px ${c}50, inset 0 0 12px ${c}10` : cellGlow(level, sektor.sonOlay),
        outline: selected ? `2px solid ${c}40` : 'none',
        padding: '16px',
      }}
    >
      {/* Pulse ring for active sectors */}
      {sektor.canliMi && pulse && (
        <div className="absolute inset-0 rounded-2xl border-2 animate-ping opacity-20" style={{ borderColor: c }} />
      )}

      {/* Threat bar — top edge */}
      <div className="absolute top-0 left-4 right-4 h-0.5 rounded-full" style={{ backgroundColor: c, opacity: 0.4 + level * 0.12 }} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">{TIP_ICON[sektor.tip]}</span>
            <span className="text-[9px] font-black tracking-[0.2em] text-slate-600 uppercase">{sektor.kisa}</span>
          </div>
          <p className="text-xs font-bold text-slate-300 leading-tight max-w-[120px]">{sektor.ad}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {sektor.canliMi && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#00D4FF' }} />
              <span className="text-[8px] font-bold text-cyan-500 tracking-widest">CANLI</span>
            </div>
          )}
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${c}15`, color: c, border: `1px solid ${c}35` }}>
            {OLAY_LABEL[sektor.sonOlay]}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { l: 'TEST', v: sektor.aktifTest, c: '#00D4FF' },
          { l: 'POZ', v: sektor.pozitif, c: sektor.pozitif > 0 ? '#EF4444' : '#334155' },
          { l: 'KDR', v: sektor.personelSayisi, c: '#64748B' },
        ].map(({ l, v, c: vc }) => (
          <div key={l} className="bg-black/20 rounded-lg py-1.5 text-center">
            <p className="text-sm font-black" style={{ color: vc }}>{v}</p>
            <p className="text-[8px] text-slate-700 uppercase tracking-widest">{l}</p>
          </div>
        ))}
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-[8px] text-slate-700 uppercase tracking-widest">AI Güven</span>
          <span className="text-[9px] font-bold" style={{ color: sektor.guvenSkoru >= 85 ? '#10B981' : sektor.guvenSkoru >= 70 ? '#F59E0B' : '#EF4444' }}>%{sektor.guvenSkoru}</span>
        </div>
        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${sektor.guvenSkoru}%`,
              backgroundColor: sektor.guvenSkoru >= 85 ? '#10B981' : sektor.guvenSkoru >= 70 ? '#F59E0B' : '#EF4444',
            }} />
        </div>
      </div>

      {/* Son zaman */}
      <p className="text-[9px] text-slate-700 mt-2">{sektor.sonZaman}</p>
    </button>
  );
}

export function SectorMatrix() {
  const [selected, setSelected] = useState<Sektor | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000);
    return () => clearInterval(t);
  }, []);

  const toplamPozitif = SEKTORLER.reduce((s, k) => s + k.pozitif, 0);
  const toplamTest = SEKTORLER.reduce((s, k) => s + k.aktifTest, 0);
  const aktifSektorler = SEKTORLER.filter(s => s.canliMi).length;
  const kritikSektorler = SEKTORLER.filter(s => s.sonOlay === 'pozitif' && threatLevel(s) >= 4).length;

  return (
    <div className="min-h-screen bg-[#060A14] text-slate-200 font-['Inter',sans-serif] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#08101C] flex-shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm font-bold">SEN<span className="text-cyan-400">TEK</span></span>
          <span className="text-slate-700">·</span>
          <span className="text-xs text-slate-500 tracking-widest uppercase">Sektör Durum Matrisi</span>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-600">Aktif <span className="text-cyan-400 font-bold">{aktifSektorler}</span></span>
            <span className="text-slate-600">Kritik <span className="text-red-400 font-bold">{kritikSektorler}</span></span>
            <span className="text-slate-600">Test <span className="text-slate-300 font-bold">{toplamTest}</span></span>
            <span className="text-red-400">Poz <span className="font-bold">{toplamPozitif}</span></span>
          </div>
          <span className="font-mono text-slate-600">{time}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Matrix grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Threat legend */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">Tehdit Rengi:</span>
            {[
              { l: 'Pozitif Yüksek', c: '#EF4444' },
              { l: 'Stok Kritik', c: '#F59E0B' },
              { l: 'Laboratuvar', c: '#8B5CF6' },
              { l: 'Temiz / Normal', c: '#1E293B' },
            ].map(({ l, c }) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: c, border: `1px solid ${c}50` }} />
                <span className="text-[10px] text-slate-600">{l}</span>
              </div>
            ))}
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-3 gap-4">
            {SEKTORLER.map(sektor => (
              <SectorCell
                key={sektor.id}
                sektor={sektor}
                selected={selected?.id === sektor.id}
                onClick={() => setSelected(selected?.id === sektor.id ? null : sektor)}
              />
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-none w-64 border-l border-slate-800 bg-[#07090F] flex flex-col overflow-hidden">
          {selected ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-slate-800">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{selected.ad}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{TIP_ICON[selected.tip]} {selected.kisa}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-700 hover:text-slate-400 text-lg leading-none">&times;</button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${OLAY_COLOR[selected.sonOlay]}15`, color: OLAY_COLOR[selected.sonOlay], border: `1px solid ${OLAY_COLOR[selected.sonOlay]}30` }}>
                    {OLAY_LABEL[selected.sonOlay]}
                  </span>
                  {selected.canliMi && (
                    <span className="text-[9px] font-bold text-cyan-500">● CANLI</span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: 'Aktif Test', v: selected.aktifTest, c: '#00D4FF' },
                    { l: 'Pozitif', v: selected.pozitif, c: selected.pozitif > 0 ? '#EF4444' : '#334155' },
                    { l: 'Personel', v: selected.personelSayisi, c: '#64748B' },
                    { l: 'Son Olay', v: selected.sonZaman, c: '#64748B' },
                  ].map(({ l, v, c }) => (
                    <div key={l} className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">{l}</p>
                      <p className="text-sm font-bold font-mono" style={{ color: c }}>{v}</p>
                    </div>
                  ))}
                </div>

                {/* AI Güven */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-600">AI Analiz Güveni</span>
                    <span className="font-bold" style={{ color: selected.guvenSkoru >= 85 ? '#10B981' : '#F59E0B' }}>%{selected.guvenSkoru}</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${selected.guvenSkoru}%`, backgroundColor: selected.guvenSkoru >= 85 ? '#10B981' : '#F59E0B' }} />
                  </div>
                </div>

                {/* Threat level */}
                <div>
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-2">Tehdit Seviyesi</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(l => {
                      const level = threatLevel(selected);
                      const active = l <= level;
                      const c = level >= 4 ? '#EF4444' : level >= 3 ? '#F59E0B' : '#10B981';
                      return (
                        <div key={l} className="flex-1 h-3 rounded" style={{
                          backgroundColor: active ? `${c}30` : '#0F172A',
                          border: `1px solid ${active ? c + '50' : '#1E293B'}`,
                        }} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between p-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Özet Durum</p>
                <div className="space-y-3">
                  {[
                    { l: 'Aktif Sektör', v: `${aktifSektorler} / ${SEKTORLER.length}`, c: '#00D4FF' },
                    { l: 'Kritik Sektör', v: String(kritikSektorler), c: kritikSektorler > 0 ? '#EF4444' : '#334155' },
                    { l: 'Toplam Test', v: String(toplamTest), c: '#64748B' },
                    { l: 'Toplam Pozitif', v: String(toplamPozitif), c: toplamPozitif > 0 ? '#EF4444' : '#334155' },
                  ].map(({ l, v, c }) => (
                    <div key={l} className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-600">{l}</span>
                      <span className="text-sm font-black" style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-slate-700 text-center">Bir sektöre tıklayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
