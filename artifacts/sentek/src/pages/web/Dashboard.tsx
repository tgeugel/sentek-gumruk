import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import {
  FlaskConical, Package, AlertTriangle, TrendingUp,
  CheckCircle, XCircle, HelpCircle, Truck, Activity, Clock,
  Shield, BarChart3, ChevronRight, ArrowRight, Database, Layers,
  GitBranch, Microscope, Archive, FileCheck, Scan, Scale, Camera, ClipboardCheck, FileText
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, CartesianGrid, Area, AreaChart
} from 'recharts';

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 11 },
  labelStyle: { color: '#94a3b8', fontSize: 10 },
};

const CHART_COLORS = ['#00D4FF', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

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

  // Son 7 gün
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

  // Pie chart
  const sonucDagilim = [
    { name: 'Pozitif', value: pozitifler.length },
    { name: 'Negatif', value: negatifler.length },
    { name: 'Geçersiz', value: gecersizler.length },
  ];
  const PIE_COLORS = ['#EF4444', '#10B981', '#F59E0B'];

  // Lokasyon bazlı
  const lokasyonMap: Record<string, number> = {};
  testKayitlari.forEach(t => { lokasyonMap[t.lokasyon] = (lokasyonMap[t.lokasyon] || 0) + 1; });
  const lokasyonData = Object.entries(lokasyonMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.replace(' Kontrol Noktası', '').replace(' Bölgesi', ''), value }));

  // Lab durum dağılımı
  const labDurumMap: Record<string, number> = {};
  labSevkler.forEach(s => { labDurumMap[s.durum] = (labDurumMap[s.durum] || 0) + 1; });
  const labDurumData = Object.entries(labDurumMap).map(([name, value]) => ({ name, value }));

  const uyarilar = [
    sktYaklasan > 0 && { tip: 'stok', mesaj: `SKT yaklaşan ${sktYaklasan} kit`, color: 'text-amber-400', class: 'alert-warning', icon: AlertTriangle },
    kritikStok > 0 && { tip: 'stok', mesaj: `Kritik / tükenen ${kritikStok} stok kalemi`, color: 'text-red-400', class: 'alert-critical', icon: AlertTriangle },
    labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length > 0 && {
      tip: 'lab', mesaj: `Lab'a yolda ${labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length} numune`,
      color: 'text-cyan-400', class: 'alert-info', icon: Truck
    },
    testKayitlari.filter(t => (t.analizGuvenSkoru || 100) < 55 && t.testSonucu === 'Geçersiz').length > 0 && {
      tip: 'analiz', mesaj: `Düşük güven skorlu ${testKayitlari.filter(t => (t.analizGuvenSkoru || 100) < 55 && t.testSonucu === 'Geçersiz').length} kayıt kontrol bekliyor`,
      color: 'text-violet-400', class: 'alert-lab', icon: Activity
    },
    raporlanan > 0 && { tip: 'rapor', mesaj: `${raporlanan} numune rapor aşamasında`, color: 'text-emerald-400', class: 'alert-info', icon: FileCheck },
  ].filter(Boolean) as { tip: string; mesaj: string; color: string; class: string; icon: any }[];

  const chainSteps = [
    { label: 'Test Kaydı', icon: FlaskConical, count: testKayitlari.length },
    { label: 'Fotoğraf', icon: Camera, count: testKayitlari.filter(t => t.fotografUrl).length },
    { label: 'Sonuç', icon: CheckCircle, count: testKayitlari.filter(t => !!t.testSonucu).length },
    { label: 'Seri No', icon: Scan, count: testKayitlari.filter(t => t.kitSeriNo).length },
    { label: 'Stok Düşümü', icon: Package, count: testKayitlari.filter(t => t.stokId).length },
    { label: 'Numune Sevki', icon: Truck, count: labSevkler.length },
    { label: 'Teslim Alma', icon: ClipboardCheck, count: labSevkler.filter(s => ['Teslim Alındı', 'Analiz Sırasında', 'Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length },
    { label: 'Analiz', icon: Microscope, count: labSevkler.filter(s => ['Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)).length },
    { label: 'Rapor', icon: FileText, count: labSevkler.filter(s => ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length },
    { label: 'Arşiv', icon: Archive, count: labSevkler.filter(s => s.durum === 'Dosya Kapatıldı').length },
  ];

  const kpis = [
    { label: 'Toplam Test', value: testKayitlari.length, color: 'bg-cyan-500' },
    { label: 'Bugünkü Test', value: bugunTestler.length, color: 'bg-blue-500' },
    { label: 'Pozitif', value: pozitifler.length, color: 'bg-red-500' },
    { label: 'Negatif', value: negatifler.length, color: 'bg-emerald-500' },
    { label: 'Geçersiz', value: gecersizler.length, color: 'bg-amber-500' },
    { label: 'Lab Sevk', value: labSevkEdilen, color: 'bg-violet-500' },
    { label: 'Analiz Bekleyen', value: analizBekleyen, color: 'bg-sky-500' },
    { label: 'Raporlanan', value: raporlanan, color: 'bg-teal-500' },
    { label: 'Kritik Stok', value: kritikStok, color: 'bg-orange-500' },
    { label: 'Bildirim', value: okunmamis, color: 'bg-pink-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      {/* SECTION 1 — Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operasyon Komuta Merkezi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerçek zamanlı saha verisi ve analiz özeti</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="text-muted-foreground tabular-nums">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            Sistem Aktif
          </div>
        </div>
      </div>

      {/* SECTION 2 — İZLENEBİLİRLİK ZİNCİRİ */}
      <div className="space-y-3">
        <h2 className="section-title px-1">İZLENEBİLİRLİK ZİNCİRİ</h2>
        <div className="glass-card-premium p-5 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[900px]">
            {chainSteps.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                <div className="chain-step">
                  <div className={`chain-step-icon ${step.count > 0 ? 'active' : ''}`}>
                    <step.icon className={`w-4 h-4 ${step.count > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-bold tracking-widest uppercase text-muted-foreground whitespace-nowrap">{step.label}</span>
                    <span className="text-[10px] font-mono font-bold text-foreground/80">{step.count || '—'}</span>
                  </div>
                </div>
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

      {/* SECTION 3 — KPI Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="kpi-chip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.035, duration: 0.3 }}
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${kpi.color}`} />
              <span className="metric-label">{kpi.label}</span>
            </div>
            <span className="metric-value">{kpi.value}</span>
          </motion.div>
        ))}
      </div>

      {/* SECTION 4 — Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Test Yoğunluğu */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-foreground">Son 7 Gün — Test Yoğunluğu</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-0.5 bg-primary" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Toplam</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-0.5 bg-red-500" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Pozitif</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={son7Gun}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-white/[0.06]" />
                <XAxis dataKey="gun" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="Toplam" stroke="#00D4FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" dot={{ r: 4, fill: '#00D4FF', strokeWidth: 2, stroke: '#080d1a' }} />
                <Line type="monotone" dataKey="Pozitif" stroke="#EF4444" strokeWidth={2} dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#080d1a' }} />
                <Line type="monotone" dataKey="Negatif" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#080d1a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chart 2 row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-5">Sonuç Dağılımı</h3>
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={sonucDagilim} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none" paddingAngle={5}>
                        {sonucDagilim.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5">
                  {sonucDagilim.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <span className="text-[11px] text-muted-foreground font-medium">{d.name}</span>
                      </div>
                      <span className="text-xs font-bold text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-5">Lokasyon Yoğunluğu</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={lokasyonData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" fill="#00D4FF" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Panel A: Kritik Uyarılar */}
          <div className="glass-card p-5">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Kritik Uyarılar</h3>
            <div className="space-y-3">
              {uyarilar.length > 0 ? uyarilar.map((u, i) => (
                <div key={i} className={`p-3 flex items-start gap-3 ${u.class}`}>
                  <u.icon className={`w-4 h-4 mt-0.5 ${u.color}`} />
                  <span className={`text-xs font-medium leading-relaxed ${u.color}`}>{u.mesaj}</span>
                </div>
              )) : (
                <div className="p-4 text-center border border-dashed rounded-xl border-white/5">
                  <span className="text-xs text-muted-foreground">Aktif uyarı bulunmuyor</span>
                </div>
              )}
            </div>
          </div>

          {/* Panel B: Son Test Kayıtları */}
          <div className="glass-card p-5">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Son Test Kayıtları</h3>
            <div className="space-y-1">
              {testKayitlari.slice(0, 8).map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors px-1">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    t.testSonucu === 'Pozitif' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                    t.testSonucu === 'Negatif' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-primary/70">{t.operasyonNo}</span>
                      <span className="text-[11px] font-bold text-foreground truncate">{t.lokasyon}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground sm:hidden">{t.numuneTuru}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground hidden sm:block whitespace-nowrap">{t.numuneTuru}</span>
                  <span className={`text-[11px] font-bold flex-shrink-0 tabular-nums ${
                    t.testSonucu === 'Pozitif' ? 'text-red-400' :
                    t.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>{t.testSonucu}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 group">
              Tümünü Görüntüle <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Panel C: Lab sevk durum bar chart */}
          <div className="glass-card p-5">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Lab Sevk Durumu</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={labDurumData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={20}>
                  {labDurumData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {labDurumData.slice(0, 4).map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-[9px] text-muted-foreground truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
