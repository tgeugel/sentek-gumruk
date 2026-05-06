import { useState, useEffect } from 'react';

const BASE_EVENTS = [
  { id: 'e1', tip: 'pozitif', madde: 'Fentanil Türevi', lokasyon: 'Liman Kontrol Noktası', ops: 'OPS-2026-0186', guven: 93, saat: '04:12:37', personel: 'K. Yıldız', agirlik: 5 },
  { id: 'e2', tip: 'pozitif', madde: 'Kokain Analogu', lokasyon: 'Sınır Kapısı A', ops: 'OPS-2026-0183', guven: 87, saat: '04:03:11', personel: 'A. Demir', agirlik: 4 },
  { id: 'e3', tip: 'negatif', madde: 'Konteyner yüzey sürüntüsü', lokasyon: 'Liman Kontrol Noktası', ops: 'OPS-2026-0185', guven: 96, saat: '03:58:22', personel: 'B. Öztürk', agirlik: 1 },
  { id: 'e4', tip: 'lab', madde: 'SNT-LAB-2026-000003 analiz sürecine alındı', lokasyon: 'Merkez Laboratuvar', ops: '', guven: 0, saat: '03:52:08', personel: 'S. Kaya', agirlik: 3 },
  { id: 'e5', tip: 'pozitif', madde: 'Eroin Türevi', lokasyon: 'Antrepo Bölgesi', ops: 'OPS-2026-0188', guven: 91, saat: '03:47:55', personel: 'B. Öztürk', agirlik: 5 },
  { id: 'e6', tip: 'stok', madde: 'AMP Panel Kiti kritik seviyede — 80 adet kaldı', lokasyon: 'Antrepo Deposu', ops: '', guven: 0, saat: '03:30:00', personel: 'Sistem', agirlik: 3 },
  { id: 'e7', tip: 'negatif', madde: 'Araç bagajı sürüntü testi', lokasyon: 'Karayolu Kontrol Noktası', ops: 'OPS-2026-0187', guven: 98, saat: '03:24:14', personel: 'K. Yıldız', agirlik: 1 },
  { id: 'e8', tip: 'sistem', madde: 'Yeni saha ekibi operasyona başladı', lokasyon: 'Sınır Kapısı B', ops: '', guven: 0, saat: '03:15:00', personel: 'Sistem', agirlik: 1 },
  { id: 'e9', tip: 'lab', madde: 'SNT-LAB-2026-000006 raporu sisteme yüklendi', lokasyon: 'Havalimanı Kargo', ops: '', guven: 0, saat: '03:08:30', personel: 'S. Kaya', agirlik: 2 },
  { id: 'e10', tip: 'pozitif', madde: 'Metamfetamin', lokasyon: 'Havalimanı Kargo', ops: 'OPS-2026-0188', guven: 88, saat: '02:55:18', personel: 'A. Demir', agirlik: 4 },
];

const TIP = {
  pozitif: { label: 'POZİTİF', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.4)', textColor: 'text-red-400' },
  negatif: { label: 'NEGATİF', color: '#10B981', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.2)', textColor: 'text-emerald-400' },
  lab: { label: 'LAB', color: '#8B5CF6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.25)', textColor: 'text-violet-400' },
  stok: { label: 'STOK', color: '#F59E0B', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.3)', textColor: 'text-amber-400' },
  sevk: { label: 'SEVK', color: '#00D4FF', bg: 'rgba(0,212,255,0.05)', border: 'rgba(0,212,255,0.2)', textColor: 'text-cyan-400' },
  sistem: { label: 'SİSTEM', color: '#64748B', bg: 'rgba(100,116,139,0.05)', border: 'rgba(100,116,139,0.15)', textColor: 'text-slate-500' },
};

const MAGNITUDE_H: Record<number, string> = {
  5: 'py-5 px-5',
  4: 'py-4 px-5',
  3: 'py-3 px-4',
  2: 'py-2.5 px-4',
  1: 'py-2 px-4',
};

const MAGNITUDE_TEXT: Record<number, string> = {
  5: 'text-2xl font-black',
  4: 'text-xl font-black',
  3: 'text-base font-bold',
  2: 'text-sm font-semibold',
  1: 'text-xs font-medium',
};

export function IntelTimeline() {
  const [events, setEvents] = useState(BASE_EVENTS);
  const [newFlash, setNewFlash] = useState<string | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const inject = setInterval(() => {
      const newEvt = {
        id: `live-${Date.now()}`,
        tip: ['pozitif', 'negatif', 'sistem'][Math.floor(Math.random() * 3)] as any,
        madde: ['Toz madde tespiti — analiz başlatıldı', 'Araç bagajı negatif', 'Çevrimdışı senkron tamamlandı'][Math.floor(Math.random() * 3)],
        lokasyon: ['Sınır Kapısı A', 'Liman Kontrol Noktası', 'Mobil Saha Ekibi'][Math.floor(Math.random() * 3)],
        ops: Math.random() > 0.5 ? `OPS-2026-0${190 + Math.floor(Math.random() * 10)}` : '',
        guven: Math.floor(65 + Math.random() * 30),
        saat: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        personel: ['K. Yıldız', 'B. Öztürk', 'A. Demir'][Math.floor(Math.random() * 3)],
        agirlik: [1, 2, 3, 4, 5][Math.floor(Math.random() * 5)],
      };
      setEvents(prev => [newEvt, ...prev.slice(0, 14)]);
      setNewFlash(newEvt.id);
      setTimeout(() => setNewFlash(null), 1500);
    }, 4500);
    return () => clearInterval(inject);
  }, []);

  const pozitifSayisi = events.filter(e => e.tip === 'pozitif').length;

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
          <span className="text-xs text-slate-500 tracking-widest uppercase">İstihbarat Akış Konsolu</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-600">Toplam <span className="text-slate-300 font-bold">{events.length}</span></span>
            <span className="text-red-400">Pozitif <span className="font-bold">{pozitifSayisi}</span></span>
          </div>
          <span className="text-xs font-mono text-slate-600">{time}</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-[10px] font-bold text-cyan-400 tracking-widest">CANLI</span>
          </div>
        </div>
      </div>

      {/* Timeline body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time gutter */}
        <div className="flex-none w-16 border-r border-slate-800/60 relative flex-shrink-0">
          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
            {events.map((e) => {
              const m = TIP[e.tip as keyof typeof TIP];
              return (
                <div key={e.id} className="flex-none flex items-start justify-center pt-3"
                  style={{ height: e.agirlik === 5 ? 88 : e.agirlik === 4 ? 76 : e.agirlik === 3 ? 64 : e.agirlik === 2 ? 52 : 44 }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono text-slate-700 whitespace-nowrap">{e.saat.slice(0, 5)}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Vertical line */}
          <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700/40 to-transparent" />
        </div>

        {/* Events stream */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-slate-800/40">
            {events.map((e) => {
              const m = TIP[e.tip as keyof typeof TIP];
              const isNew = e.id === newFlash;
              return (
                <div
                  key={e.id}
                  className={`${MAGNITUDE_H[e.agirlik]} transition-all duration-500 cursor-pointer hover:bg-slate-800/20 group`}
                  style={{
                    backgroundColor: isNew ? `${m.color}18` : m.bg,
                    borderLeft: `3px solid ${isNew ? m.color : m.border}`,
                    transition: 'all 0.5s ease',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Type badge + meta */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${m.color}15`, color: m.color, border: `1px solid ${m.border}` }}>
                          {m.label}
                        </span>
                        {e.ops && (
                          <span className="text-[10px] font-mono text-cyan-600">{e.ops}</span>
                        )}
                        <span className="text-[10px] text-slate-600">·</span>
                        <span className="text-[10px] text-slate-600">{e.lokasyon}</span>
                        {isNew && (
                          <span className="text-[9px] font-black tracking-widest text-cyan-400 animate-pulse">● YENİ</span>
                        )}
                      </div>
                      {/* Main text — sized by magnitude */}
                      <p className={`${MAGNITUDE_TEXT[e.agirlik]} leading-tight`}
                        style={{ color: e.agirlik >= 4 ? '#F1F5F9' : e.agirlik >= 2 ? '#94A3B8' : '#475569' }}>
                        {e.madde}
                      </p>
                    </div>

                    {/* Confidence — only for high weight pozitif */}
                    {e.tip === 'pozitif' && e.agirlik >= 4 && (
                      <div className="flex-none text-right pr-2">
                        <div className="text-2xl font-black leading-none" style={{ color: m.color }}>%{e.guven}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5">güven</div>
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                          <div className="h-full rounded-full" style={{ width: `${e.guven}%`, backgroundColor: m.color }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Personel — only for mid+ weight */}
                  {e.agirlik >= 3 && (
                    <p className="text-[10px] text-slate-700 mt-1.5">{e.personel}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right rail — live stats */}
        <div className="flex-none w-44 border-l border-slate-800 bg-[#07090F] flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Anlık Sayaçlar</p>
            {[
              { l: 'Aktif Ops', v: '3', c: '#00D4FF' },
              { l: 'Pozitif', v: String(pozitifSayisi), c: '#EF4444' },
              { l: 'Lab Bekleyen', v: '4', c: '#8B5CF6' },
              { l: 'Kritik Stok', v: '5', c: '#F59E0B' },
            ].map(({ l, v, c }) => (
              <div key={l} className="flex items-center justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                <span className="text-[10px] text-slate-600">{l}</span>
                <span className="text-base font-black" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Threat level indicator */}
          <div className="p-4 flex-1 flex flex-col justify-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Tehdit Seviyesi</p>
            <div className="space-y-1.5">
              {[
                { l: 'KRİTİK', active: pozitifSayisi >= 5, c: '#EF4444' },
                { l: 'YÜKSEK', active: pozitifSayisi >= 3, c: '#F59E0B' },
                { l: 'ORTA', active: pozitifSayisi >= 1, c: '#F59E0B' },
                { l: 'DÜŞÜK', active: true, c: '#10B981' },
              ].map(({ l, active, c }) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="w-full h-5 rounded flex items-center px-2"
                    style={{ backgroundColor: active ? `${c}18` : '#0F172A', border: `1px solid ${active ? c + '40' : '#1E293B'}` }}>
                    <span className="text-[9px] font-black tracking-widest" style={{ color: active ? c : '#334155' }}>{l}</span>
                  </div>
                  {active && pozitifSayisi >= 3 && l === 'YÜKSEK' && (
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: c }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
