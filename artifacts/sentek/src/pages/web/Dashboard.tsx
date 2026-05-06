import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import {
  FlaskConical, Package, AlertTriangle,
  CheckCircle, Truck,
  ArrowRight, Microscope, Archive, FileCheck, Scan, Camera, ClipboardCheck, FileText,
  ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, LabelList
} from 'recharts';

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#080d1a',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 12,
    fontSize: 11,
    backdropFilter: 'blur(12px)',
  },
  labelStyle: { color: '#94a3b8', fontSize: 10 },
};

const CHART_COLORS = ['#00D4FF', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

function useCountUp(target: number, duration = 650) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let step = 0;
    const steps = 32;
    const ms = duration / steps;
    setValue(0);
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setValue(Math.round(target * eased));
      if (step >= steps) { setValue(target); clearInterval(timer); }
    }, ms);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function KpiCard({ label, value, sub, color, delay }: { label: string; value: number; sub: string; color: string; delay: number }) {
  const display = useCountUp(value);
  return (
    <motion.div
      className="col-span-6 md:col-span-3 glow-card glass-card p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
      <p className="metric-label mb-3">{label}</p>
      <p className="font-bold leading-none mb-1.5"
        style={{ fontSize: '2.8rem', fontFamily: 'var(--font-display)', color, textShadow: `0 0 40px ${color}55` }}>
        {display}
      </p>
      <p className="text-[10px] text-muted-foreground/50">{sub}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { testKayitlari, labSevkler, stoklar, bildirimler } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const mmm = date.toLocaleString('tr-TR', { month: 'short' });
    const yyyy = date.getFullYear();
    return `${hh}:${mm} · ${dd} ${mmm} ${yyyy}`;
  };

  const bugun = new Date().toISOString().slice(0, 10);
  const bugunTestler = testKayitlari.filter(t => t.tarih.startsWith(bugun));
  const pozitifler = testKayitlari.filter(t => t.testSonucu === 'Pozitif');
  const negatifler = testKayitlari.filter(t => t.testSonucu === 'Negatif');
  const gecersizler = testKayitlari.filter(t => t.testSonucu === 'Geçersiz');
  const labSevkEdilen = labSevkler.length;
  const analizBekleyen = labSevkler.filter(s => s.durum === 'Teslim Alındı' || s.durum === 'Analiz Sırasında').length;
  const raporlanan = labSevkler.filter(s => s.durum === 'Rapor Yüklendi' || s.durum === 'Dosya Kapatıldı').length;
  const kritikStok = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length;
  const sktYaklasan = stoklar.filter(s => s.durum === 'SKT Yaklaşıyor').length;
  const okunmamis = bildirimler.filter(b => !b.okundu).length;

  const son7Gun = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const gunTests = testKayitlari.filter(t => t.tarih.startsWith(key));
    return {
      gun: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
      Toplam: gunTests.length,
      Pozitif: gunTests.filter(t => t.testSonucu === 'Pozitif').length,
      Negatif: gunTests.filter(t => t.testSonucu === 'Negatif').length,
    };
  });

  const sonucDagilim = [
    { name: 'Pozitif',  value: pozitifler.length },
    { name: 'Negatif',  value: negatifler.length },
    { name: 'Geçersiz', value: gecersizler.length },
  ];
  const PIE_COLORS = ['#EF4444', '#10B981', '#F59E0B'];

  const lokasyonMap: Record<string, number> = {};
  testKayitlari.forEach(t => { lokasyonMap[t.lokasyon] = (lokasyonMap[t.lokasyon] || 0) + 1; });
  const lokasyonData = Object.entries(lokasyonMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name: name
        .replace(' Kontrol Noktası', '')
        .replace(' Bölgesi', '')
        .replace(' Sınır Kapısı', '')
        .replace(' Uluslararası Limanı', ' Lm.')
        .replace(' Limanı', ' Lm.'),
      value,
    }));

  const labDurumMap: Record<string, number> = {};
  labSevkler.forEach(s => { labDurumMap[s.durum] = (labDurumMap[s.durum] || 0) + 1; });
  const labDurumData = Object.entries(labDurumMap).map(([name, value]) => ({ name, value }));
  const labTotal = labSevkler.length || 1;

  const uyarilar = [
    sktYaklasan > 0 && { mesaj: `SKT yaklaşan ${sktYaklasan} kit`, color: 'text-amber-400', cls: 'alert-warning', icon: AlertTriangle },
    kritikStok > 0 && { mesaj: `Kritik / tükenen ${kritikStok} stok kalemi`, color: 'text-red-400', cls: 'alert-critical', icon: AlertTriangle },
    labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length > 0 && {
      mesaj: `Lab'a yolda ${labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length} numune`,
      color: 'text-cyan-400', cls: 'alert-info', icon: Truck,
    },
    raporlanan > 0 && { mesaj: `${raporlanan} numune rapor aşamasında`, color: 'text-emerald-400', cls: 'alert-info', icon: FileCheck },
  ].filter(Boolean) as { mesaj: string; color: string; cls: string; icon: any }[];

  const chainSteps = [
    { label: 'Test Kaydı',   icon: FlaskConical,   count: testKayitlari.length },
    { label: 'Fotoğraf',     icon: Camera,         count: testKayitlari.filter(t => t.fotografUrl).length },
    { label: 'Sonuç',        icon: CheckCircle,    count: testKayitlari.filter(t => !!t.testSonucu).length },
    { label: 'Seri No',      icon: Scan,           count: testKayitlari.filter(t => t.kitSeriNo).length },
    { label: 'Stok Düşümü',  icon: Package,        count: testKayitlari.filter(t => t.stokId).length },
    { label: 'Numune Sevki', icon: Truck,          count: labSevkler.length },
    { label: 'Teslim Alma',  icon: ClipboardCheck, count: labSevkler.filter(s => ['Teslim Alındı', 'Analiz Sırasında', 'Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length },
    { label: 'Analiz',       icon: Microscope,     count: labSevkler.filter(s => ['Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)).length },
    { label: 'Rapor',        icon: FileText,       count: labSevkler.filter(s => ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length },
    { label: 'Arşiv',        icon: Archive,        count: labSevkler.filter(s => s.durum === 'Dosya Kapatıldı').length },
  ];

  const topKpis = [
    { label: 'Toplam Test', value: testKayitlari.length, sub: `Bugün: ${bugunTestler.length}`, color: '#00D4FF' },
    { label: 'Pozitif',     value: pozitifler.length,    sub: `Oran: ${testKayitlari.length ? Math.round(pozitifler.length / testKayitlari.length * 100) : 0}%`, color: '#EF4444' },
    { label: 'Lab Sevk',    value: labSevkEdilen,        sub: `Bekleyen: ${analizBekleyen}`, color: '#8B5CF6' },
    { label: 'Kritik Stok', value: kritikStok,           sub: `SKT: ${sktYaklasan} yakın`,   color: '#F59E0B' },
  ];

  const secondaryKpis = [
    { label: 'Negatif',         value: negatifler.length,   color: 'bg-emerald-500' },
    { label: 'Geçersiz',        value: gecersizler.length,  color: 'bg-amber-500' },
    { label: 'Analiz Bekleyen', value: analizBekleyen,      color: 'bg-sky-500' },
    { label: 'Raporlanan',      value: raporlanan,          color: 'bg-teal-500' },
    { label: 'Bildirim',        value: okunmamis,           color: 'bg-pink-500' },
    { label: 'Bugünkü Test',    value: bugunTestler.length, color: 'bg-blue-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-5"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="page-title mb-1">Operasyon Komuta Merkezi</h1>
          <p className="text-sm text-muted-foreground">Gerçek zamanlı saha verisi ve analiz özeti</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground/60 tabular-nums text-xs">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistem Aktif
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-12 gap-4">

        {/* ROW 1: İzlenebilirlik Zinciri */}
        <div className="col-span-12">
          <h2 className="section-title px-1 mb-3">İZLENEBİLİRLİK ZİNCİRİ</h2>
          <div className="glass-card-premium glow-card p-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[900px]">
              {chainSteps.map((step, i) => (
                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                  <motion.div
                    className="chain-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.045 }}
                  >
                    <div className={`chain-step-icon ${step.count > 0 ? 'active' : ''}`}>
                      <step.icon className={`w-4 h-4 ${step.count > 0 ? 'text-primary' : 'text-muted-foreground/40'}`} />
                    </div>
                    <div className="flex flex-col items-center gap-0.5 mt-1">
                      <span className="text-[8px] font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">{step.label}</span>
                      <span className={`text-sm font-bold leading-none ${step.count > 0 ? 'text-foreground' : 'text-muted-foreground/25'}`}
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {step.count > 0 ? step.count : '—'}
                      </span>
                    </div>
                  </motion.div>
                  {i < chainSteps.length - 1 && (
                    <div className="flex-1 flex justify-center">
                      <ArrowRight className="w-3 h-3 chain-arrow" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Top KPI bento cards — count-up animation */}
        {topKpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 0.07} />
        ))}

        {/* ROW 3: Secondary KPI strip */}
        <div className="col-span-12 flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
          {secondaryKpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="kpi-chip glow-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.04 }}
            >
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${kpi.color}`} />
                <span className="metric-label">{kpi.label}</span>
              </div>
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{kpi.value}</span>
            </motion.div>
          ))}
        </div>

        {/* ROW 4: Glowing AreaChart (8 col) + right column (4 col) */}
        <motion.div
          className="col-span-12 lg:col-span-8 glow-card glass-card p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Son 7 Gün — Test Yoğunluğu</h3>
            <div className="flex items-center gap-4">
              {[
                { c: '#00D4FF', l: 'Toplam' },
                { c: '#EF4444', l: 'Pozitif' },
                { c: '#10B981', l: 'Negatif' },
              ].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 6px ${c}aa` }} />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* CSS drop-shadow applies glow to rendered SVG strokes/fills */}
          <div style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.38)) drop-shadow(0 0 2px rgba(0,212,255,0.22))' }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={son7Gun} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00D4FF" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gPoz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                  </linearGradient>
                  <filter id="glowCyan" x="-20%" y="-60%" width="140%" height="220%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glowRed" x="-20%" y="-60%" width="140%" height="220%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="gun" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="Toplam" stroke="#00D4FF" strokeWidth={3} fillOpacity={1} fill="url(#gTotal)"
                  dot={{ r: 4, fill: '#00D4FF', strokeWidth: 2, stroke: '#080d1a' }}
                  activeDot={{ r: 6, fill: '#00D4FF', stroke: '#080d1a', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="Pozitif" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#gPoz)"
                  dot={{ r: 3.5, fill: '#EF4444', strokeWidth: 2, stroke: '#080d1a' }}
                  activeDot={{ r: 5, fill: '#EF4444', stroke: '#080d1a', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="Negatif" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#gNeg)"
                  dot={{ r: 3, fill: '#10B981', strokeWidth: 2, stroke: '#080d1a' }}
                  activeDot={{ r: 5, fill: '#10B981', stroke: '#080d1a', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right column — alerts + recent tests */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="glow-card glass-card p-4">
            <h3 className="section-title mb-3">Kritik Uyarılar</h3>
            <div className="space-y-2">
              {uyarilar.length > 0 ? uyarilar.map((u, i) => (
                <div key={i} className={`p-3 flex items-start gap-3 ${u.cls}`}>
                  <u.icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${u.color}`} />
                  <span className={`text-xs font-medium leading-relaxed ${u.color}`}>{u.mesaj}</span>
                </div>
              )) : (
                <div className="p-4 text-center border border-dashed rounded-xl border-white/5">
                  <CheckCircle className="w-6 h-6 text-emerald-400/30 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground/50">Aktif uyarı bulunmuyor</span>
                </div>
              )}
            </div>
          </div>

          <div className="glow-card glass-card p-4">
            <h3 className="section-title mb-3">Son Test Kayıtları</h3>
            <div className="space-y-0.5">
              {testKayitlari.slice(0, 7).map(t => (
                <div key={t.id} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors px-1">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    t.testSonucu === 'Pozitif' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                    t.testSonucu === 'Negatif' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-primary/60">{t.operasyonNo}</span>
                    <span className="text-[11px] font-medium text-foreground/80 truncate">{t.lokasyon}</span>
                  </div>
                  <span className={`text-[11px] font-bold flex-shrink-0 ${
                    t.testSonucu === 'Pozitif' ? 'text-red-400' :
                    t.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>{t.testSonucu}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-2 text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5 group">
              Tümünü Görüntüle <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ROW 5: Donut with center total + Location gradient bars */}
        <div className="col-span-12 md:col-span-5 glow-card glass-card p-5">
          <h3 className="section-title mb-4">Sonuç Dağılımı</h3>
          <div className="flex items-center gap-5">
            {/* Enlarged donut with center total */}
            <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sonucDagilim}
                    cx="50%" cy="50%"
                    innerRadius={56} outerRadius={80}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={4}
                  >
                    {sonucDagilim.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]}
                        style={{ filter: `drop-shadow(0 0 8px ${PIE_COLORS[i]}55)` }} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold leading-none"
                  style={{ fontFamily: 'var(--font-display)', color: '#e2e8f0', textShadow: '0 0 20px rgba(0,212,255,0.2)' }}>
                  {testKayitlari.length}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold mt-1">Toplam</span>
              </div>
            </div>

            {/* Legend with mini progress bars */}
            <div className="flex-1 space-y-3.5">
              {sonucDagilim.map((d, i) => {
                const pct = testKayitlari.length ? Math.round((d.value / testKayitlari.length) * 100) : 0;
                return (
                  <div key={d.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PIE_COLORS[i], boxShadow: `0 0 8px ${PIE_COLORS[i]}80` }} />
                        <span className="text-xs text-muted-foreground">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{d.value}</span>
                        <span className="text-[9px] text-muted-foreground/40 w-7 text-right">%{pct}</span>
                      </div>
                    </div>
                    <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(to right, ${PIE_COLORS[i]}60, ${PIE_COLORS[i]})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location bar chart with value labels */}
        <div className="col-span-12 md:col-span-7 glow-card glass-card p-5">
          <h3 className="section-title mb-4">Lokasyon Yoğunluğu</h3>
          <ResponsiveContainer width="100%" height={168}>
            <BarChart data={lokasyonData} layout="vertical" margin={{ right: 36, left: 0, top: 2, bottom: 2 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={74} />
              <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,212,255,0.03)' }} />
              <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={12}>
                <LabelList
                  dataKey="value"
                  position="right"
                  style={{ fill: '#00D4FF', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-display)' }}
                />
                {lokasyonData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`rgba(0,212,255,${Math.max(0.28, 0.9 - i * 0.1)})`}
                    style={i === 0 ? { filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.5))' } : undefined}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROW 6: Lab status — animated horizontal progress bars */}
        <div className="col-span-12 glow-card glass-card p-5">
          <h3 className="section-title mb-4">Lab Sevk Durum Dağılımı</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {labDurumData.map((d, i) => {
              const pct = Math.round((d.value / labTotal) * 100);
              const color = CHART_COLORS[i % CHART_COLORS.length];
              const shortName = d.name
                .replace('Laboratuvara ', 'Lab → ')
                .replace('Kayıt Oluşturuldu', 'Kayıt');
              return (
                <div key={d.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />
                      <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[180px]">{shortName}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{d.value}</span>
                      <span className="text-[9px] text-muted-foreground/40 w-8 text-right">%{pct}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.85, delay: 0.1 * i, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${color}70, ${color})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
