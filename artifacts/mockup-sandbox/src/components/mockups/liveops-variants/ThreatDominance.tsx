import { useState, useEffect } from 'react';

const OLAYLAR = [
  { id: 'a1', tip: 'pozitif', madde: 'Fentanil Türevi', lokasyon: 'Liman Kontrol Noktası', ops: 'OPS-2026-0186', guven: 93, zaman: '04:12', personel: 'K. Yıldız', oncelik: 1 },
  { id: 'a2', tip: 'pozitif', madde: 'Kokain Analogu', lokasyon: 'Sınır Kapısı A', ops: 'OPS-2026-0183', guven: 87, zaman: '04:03', personel: 'A. Demir', oncelik: 2 },
  { id: 'a3', tip: 'pozitif', madde: 'Eroin Türevi', lokasyon: 'Antrepo Bölgesi', ops: 'OPS-2026-0188', guven: 91, zaman: '03:47', personel: 'B. Öztürk', oncelik: 3 },
  { id: 'a4', tip: 'stok', madde: 'AMP Panel Kiti — 80 adet', lokasyon: 'Antrepo Deposu', ops: '', guven: 0, zaman: '03:30', personel: 'Sistem', oncelik: 4 },
  { id: 'a5', tip: 'lab', madde: 'SNT-LAB-2026-000003', lokasyon: 'Liman Kontrol Noktası', ops: '', guven: 0, zaman: '03:22', personel: 'S. Kaya', oncelik: 5 },
  { id: 'a6', tip: 'sistem', madde: 'Çevrimdışı kayıt oluşturuldu', lokasyon: 'Mobil Saha Ekibi', ops: 'OPS-2026-0182', guven: 0, zaman: '03:15', personel: 'K. Yıldız', oncelik: 6 },
];

const TIP_META = {
  pozitif: { label: 'POZİTİF TESPİT', border: 'border-red-500/60', bg: 'bg-red-950/60', accent: '#EF4444', glow: 'shadow-[0_0_60px_rgba(239,68,68,0.25)]', dot: 'bg-red-500' },
  stok: { label: 'KRİTİK STOK', border: 'border-amber-500/50', bg: 'bg-amber-950/40', accent: '#F59E0B', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]', dot: 'bg-amber-500' },
  lab: { label: 'LABORATUVAR', border: 'border-violet-500/40', bg: 'bg-violet-950/30', accent: '#8B5CF6', glow: '', dot: 'bg-violet-500' },
  sevk: { label: 'SEVK', border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', accent: '#00D4FF', glow: '', dot: 'bg-cyan-500' },
  negatif: { label: 'NEGATİF', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', accent: '#10B981', glow: '', dot: 'bg-emerald-500' },
  sistem: { label: 'SİSTEM', border: 'border-slate-600/30', bg: 'bg-slate-900/40', accent: '#64748B', glow: '', dot: 'bg-slate-500' },
};

function PulsingDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${color}`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}

export function ThreatDominance() {
  const [tick, setTick] = useState(0);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const [time, setTime] = useState(now);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1);
      setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const primary = OLAYLAR[primaryIdx];
  const meta = TIP_META[primary.tip as keyof typeof TIP_META];
  const secondary = OLAYLAR.filter((_, i) => i !== primaryIdx);

  return (
    <div className="min-h-screen bg-[#060A14] text-slate-200 font-['Inter',sans-serif] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#08101C]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight">SEN<span className="text-cyan-400">TEK</span></span>
            <span className="text-xs text-slate-500 ml-2">Tehdit Durumu Merkezi</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-400">
            <PulsingDot color="bg-red-500" />
            <span className="text-xs font-bold tracking-widest uppercase">Aktif Tehdit</span>
          </div>
          <div className="text-xs font-mono text-slate-500">{time}</div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* PRIMARY THREAT — 55% width */}
        <div className={`flex-none w-[55%] p-6 border-r border-slate-800 flex flex-col gap-4 ${meta.bg} ${meta.glow} transition-all duration-700`}>
          {/* Classification stamp */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${meta.border} bg-black/30`}>
              <PulsingDot color={meta.dot} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: meta.accent }}>{meta.label}</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Birincil Tehdit / 1/{OLAYLAR.filter(o => o.tip === 'pozitif').length}</span>
          </div>

          {/* Giant substance name */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: meta.accent }}>Tespit Edilen Madde</p>
              <h1 className="text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg" style={{ textShadow: `0 0 40px ${meta.accent}55` }}>
                {primary.madde.toUpperCase()}
              </h1>
            </div>

            {/* Confidence bar — large */}
            {primary.guven > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 uppercase tracking-widest text-[10px]">AI Analiz Güveni</span>
                  <span className="font-black text-2xl" style={{ color: meta.accent }}>%{primary.guven}</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${primary.guven}%`, backgroundColor: meta.accent, boxShadow: `0 0 12px ${meta.accent}` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Lokasyon', v: primary.lokasyon },
              { l: 'Operasyon No', v: primary.ops || '—' },
              { l: 'Personel', v: primary.personel },
              { l: 'Tespit Zamanı', v: `Bu gün ${primary.zaman}` },
            ].map(({ l, v }) => (
              <div key={l} className="bg-black/30 border border-slate-800 rounded-xl p-3">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">{l}</p>
                <p className="text-sm font-bold text-slate-200 font-mono">{v}</p>
              </div>
            ))}
          </div>

          {/* Switch threats */}
          <div className="flex items-center gap-1.5">
            {OLAYLAR.filter(o => o.tip === 'pozitif').map((o, i) => (
              <button key={o.id} onClick={() => setPrimaryIdx(OLAYLAR.indexOf(o))}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                  primary.id === o.id
                    ? 'border-red-500/60 bg-red-500/15 text-red-400'
                    : 'border-slate-700 bg-slate-900/40 text-slate-600 hover:border-slate-600'
                }`}>
                OPS-{o.ops.slice(-4)}
              </button>
            ))}
          </div>
        </div>

        {/* SECONDARY THREAT RANK — 45% width */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Diğer Aktif Olaylar — Önem Sırasına Göre</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {secondary.map((o, rank) => {
              const m = TIP_META[o.tip as keyof typeof TIP_META];
              const isPozitif = o.tip === 'pozitif';
              return (
                <button key={o.id} onClick={() => setPrimaryIdx(OLAYLAR.indexOf(o))}
                  className={`w-full text-left p-3 rounded-xl border transition-all hover:border-slate-600 group ${
                    isPozitif ? `${m.border} ${m.bg}` : 'border-slate-800 bg-slate-900/30'
                  }`}
                  style={{ opacity: 1 - rank * 0.08 }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-none flex flex-col items-center pt-0.5">
                      <span className="text-[10px] font-black text-slate-700 w-5 text-center">{rank + 2}</span>
                      <div className={`w-1 h-1 rounded-full mt-1 ${m.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-black tracking-[0.2em]" style={{ color: m.accent }}>{m.label}</span>
                        <span className="text-[9px] text-slate-600 font-mono">{o.zaman}</span>
                      </div>
                      <p className={`text-sm font-bold truncate ${isPozitif ? 'text-slate-200' : 'text-slate-400'}`}>{o.madde}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{o.lokasyon}</p>
                    </div>
                    {isPozitif && o.guven > 0 && (
                      <div className="flex-none text-right">
                        <span className="text-lg font-black" style={{ color: m.accent }}>%{o.guven}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stats footer */}
          <div className="p-4 border-t border-slate-800 grid grid-cols-3 gap-3">
            {[
              { l: 'Toplam Test', v: '40' },
              { l: 'Pozitif', v: String(OLAYLAR.filter(o => o.tip === 'pozitif').length) },
              { l: 'Lab Sevk', v: '12' },
            ].map(({ l, v }) => (
              <div key={l} className="text-center">
                <p className="text-xl font-black text-cyan-400">{v}</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
