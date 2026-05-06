import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, AlertTriangle, FlaskConical, Package, Truck,
  Activity, MapPin, Clock, CheckCircle, Zap, Shield,
  ArrowRight, Microscope, Archive, FileCheck, Scan,
  Camera, ClipboardCheck, FileText, ChevronRight
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { OperasyonHarita } from '../../components/sentek/OperasyonHarita';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'rgba(5,9,22,0.97)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 10,
    fontSize: 11,
    backdropFilter: 'blur(12px)',
  },
  labelStyle: { color: '#94a3b8', fontSize: 10 },
};

interface AkisOlayi {
  id: string;
  zaman: string;
  lokasyon: string;
  mesaj: string;
  tip: 'pozitif' | 'negatif' | 'lab' | 'stok' | 'sistem' | 'sevk';
  operasyonNo?: string;
}

const DEMO_OLAYLAR: Omit<AkisOlayi, 'id' | 'zaman'>[] = [
  { lokasyon: 'Araç Arama Noktası', mesaj: 'Yeni test kaydı — numune türü: toz madde', tip: 'sistem', operasyonNo: 'OPS-2026-0182' },
  { lokasyon: 'Kapıkule Sınır Kapısı', mesaj: 'Pozitif ön tarama kaydedildi — Esrar türevi tespiti', tip: 'pozitif', operasyonNo: 'OPS-2026-0183' },
  { lokasyon: 'İzmir Alsancak Limanı', mesaj: 'SNT-LAB-2026-000002 analiz sürecine alındı', tip: 'lab' },
  { lokasyon: 'Mobil Saha Ekibi', mesaj: 'Numune sevk kaydı oluşturuldu — Limana yolda', tip: 'sevk', operasyonNo: 'OPS-2026-0184' },
  { lokasyon: 'Merkez Antrepo', mesaj: 'STK-007 (AMP Kiti) kritik seviyede — 80 adet kaldı', tip: 'stok' },
  { lokasyon: 'Mersin Uluslararası Limanı', mesaj: 'Negatif test sonucu — konteyner yüzey sürüntüsü', tip: 'negatif', operasyonNo: 'OPS-2026-0185' },
  { lokasyon: 'İstanbul Havalimanı Kargo', mesaj: 'SNT-LAB-2026-000006 analiz raporu sisteme yüklendi', tip: 'lab' },
  { lokasyon: 'İpsala Sınır Kapısı', mesaj: 'Yeni saha ekibi operasyona başladı — 3 personel', tip: 'sistem' },
  { lokasyon: 'Habur Sınır Kapısı', mesaj: 'Fentanil türevi şüphesi — acil sevk başlatıldı', tip: 'pozitif', operasyonNo: 'OPS-2026-0186' },
  { lokasyon: 'Sarp Sınır Kapısı', mesaj: 'Metamfetamin tespiti — gizli bölme, TIR', tip: 'pozitif', operasyonNo: 'OPS-2026-0189' },
  { lokasyon: 'Cilvegözü Sınır Kapısı', mesaj: 'Numune sevk edildi — laboratuvara yolda', tip: 'sevk', operasyonNo: 'OPS-2026-0190' },
  { lokasyon: 'Haydarpaşa Limanı', mesaj: 'Konteyner yüzey sürüntüsü — analiz bekleniyor', tip: 'lab' },
  { lokasyon: 'Nusaybin Sınır Kapısı', mesaj: 'Kritik stok uyarısı — Eroin Panel Kiti 30 adet', tip: 'stok' },
  { lokasyon: 'Gürbulak Sınır Kapısı', mesaj: 'Çevrimdışı modda 1 test kaydı oluşturuldu', tip: 'sistem' },
  { lokasyon: 'Sabiha Gökçen Kargo', mesaj: 'Şüpheli kargo paketi tespit edildi — analiz başlatıldı', tip: 'pozitif', operasyonNo: 'OPS-2026-0188' },
];

const TIP_CONFIG: Record<AkisOlayi['tip'], { icon: typeof Radio; renk: string; bg: string; etiket: string; alertClass: string }> = {
  pozitif: { icon: AlertTriangle, renk: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',       etiket: 'POZİTİF',     alertClass: 'alert-critical' },
  negatif: { icon: CheckCircle,  renk: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', etiket: 'NEGATİF',   alertClass: 'alert-info' },
  lab:     { icon: FlaskConical, renk: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20',  etiket: 'LAB',         alertClass: 'alert-lab' },
  stok:    { icon: Package,      renk: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',    etiket: 'STOK',        alertClass: 'alert-warning' },
  sevk:    { icon: Truck,        renk: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20',      etiket: 'SEVK',        alertClass: 'alert-info' },
  sistem:  { icon: Radio,        renk: 'text-slate-400',   bg: 'bg-secondary/50 border-border',          etiket: 'SİSTEM',      alertClass: 'alert-info' },
};

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds} sn`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  return `${hours} sa`;
}

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let step = 0;
    const steps = 28;
    setValue(0);
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setValue(Math.round(target * eased));
      if (step >= steps) { setValue(target); clearInterval(timer); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function KpiTopCard({ label, value, sub, color, delay }: { label: string; value: number; sub: string; color: string; delay: number }) {
  const display = useCountUp(value);
  return (
    <motion.div
      className="glow-card glass-card p-4 relative overflow-hidden flex-1 min-w-0"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, transform: 'translate(30%,-30%)' }} />
      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-2">{label}</p>
      <p className="font-black leading-none mb-1" style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', color, textShadow: `0 0 30px ${color}55` }}>
        {display}
      </p>
      <p className="text-[10px] text-muted-foreground/45">{sub}</p>
    </motion.div>
  );
}

function AkisKarti({ olay }: { olay: AkisOlayi }) {
  const cfg = TIP_CONFIG[olay.tip];
  const Icon = cfg.icon;
  return (
    <motion.div
      layout={false}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`flex items-start gap-2 p-2.5 transition-all ${cfg.alertClass}`}
    >
      <div className={`w-7 h-7 rounded-md border ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-3.5 h-3.5 ${cfg.renk}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <span className={`text-[10px] font-black tracking-widest ${cfg.renk}`}>{cfg.etiket}</span>
          {olay.operasyonNo && (
            <span className="text-[10px] font-mono text-primary/60">{olay.operasyonNo}</span>
          )}
        </div>
        <p className="text-[11px] text-foreground/90 leading-snug">{olay.mesaj}</p>
        <p className="text-[10px] text-muted-foreground/40 mt-0.5 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" /><span className="truncate">{olay.lokasyon}</span>
          <span className="text-muted-foreground/20 mx-0.5 flex-shrink-0">·</span>
          <Clock className="w-2.5 h-2.5 flex-shrink-0" />{timeAgo(olay.zaman)}
        </p>
      </div>
    </motion.div>
  );
}

export default function KomutaKontrol() {
  const { testKayitlari, labSevkler, stoklar } = useData();
  const [akis, setAkis] = useState<AkisOlayi[]>([]);
  const [canli, setCanli] = useState(true);
  const [aktifLokasyon, setAktifLokasyon] = useState<string | null>(null);
  const [simdi, setSimdi] = useState(new Date());
  const olaySayacRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setSimdi(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const baslangic: AkisOlayi[] = [
      { id: 'i1', zaman: new Date(Date.now() - 5000).toISOString(),  lokasyon: 'Kapıkule Sınır Kapısı', mesaj: 'Pozitif test kaydedildi — OPS-2026-0142', tip: 'pozitif', operasyonNo: 'OPS-2026-0142' },
      { id: 'i2', zaman: new Date(Date.now() - 18000).toISOString(), lokasyon: 'İzmir Alsancak Limanı', mesaj: 'SNT-LAB-2026-000003 analiz sürecinde', tip: 'lab' },
      { id: 'i3', zaman: new Date(Date.now() - 40000).toISOString(), lokasyon: 'Merkez Antrepo',         mesaj: 'STK-002 kritik seviyede — 50 adet kaldı', tip: 'stok' },
      { id: 'i4', zaman: new Date(Date.now() - 75000).toISOString(), lokasyon: 'Karayolu Kontrol',       mesaj: 'LS-009 laboratuvara yolda', tip: 'sevk' },
      { id: 'i5', zaman: new Date(Date.now() - 120000).toISOString(),lokasyon: 'Sistem',                 mesaj: 'Komuta Kontrol Merkezi başlatıldı — canlı izleme aktif', tip: 'sistem' },
    ];
    setAkis(baslangic);
    setAktifLokasyon('Kapıkule Sınır Kapısı');
  }, []);

  useEffect(() => {
    if (!canli) return;
    const interval = setInterval(() => {
      const sira = olaySayacRef.current % DEMO_OLAYLAR.length;
      olaySayacRef.current++;
      const template = DEMO_OLAYLAR[sira];
      const yeni: AkisOlayi = { ...template, id: `live-${Date.now()}`, zaman: new Date().toISOString() };
      setAkis(prev => [yeni, ...prev.slice(0, 11)]);
      setAktifLokasyon(yeni.lokasyon);
    }, 4500);
    return () => clearInterval(interval);
  }, [canli]);

  const bugunBaslangic = new Date(); bugunBaslangic.setHours(0, 0, 0, 0);
  const bugun = new Date().toISOString().slice(0, 10);
  const bugunTestler = testKayitlari.filter(t => t.tarih.startsWith(bugun));
  const pozitifler = testKayitlari.filter(t => t.testSonucu === 'Pozitif');
  const negatifler = testKayitlari.filter(t => t.testSonucu === 'Negatif');
  const gecersizler = testKayitlari.filter(t => t.testSonucu === 'Geçersiz');
  const analizBekleyen = labSevkler.filter(s => s.durum === 'Teslim Alındı' || s.durum === 'Analiz Sırasında').length;
  const kritikStok = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi');
  const sktYaklasan = stoklar.filter(s => { const d = new Date(s.skt); return d > new Date() && (d.getTime() - Date.now()) < 90 * 86400000; });
  const aktifSevkler = labSevkler.filter(s => ['Laboratuvara Yolda', 'Teslim Alındı', 'Analiz Sırasında'].includes(s.durum));
  const sonPozitifler = pozitifler.slice(0, 4);

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
    { name: 'Pozitif',  value: pozitifler.length,  color: '#EF4444' },
    { name: 'Negatif',  value: negatifler.length,  color: '#10B981' },
    { name: 'Geçersiz', value: gecersizler.length, color: '#F59E0B' },
  ];
  const pieTotal = testKayitlari.length || 1;

  const chainSteps = [
    { label: 'Test',     icon: FlaskConical,   count: testKayitlari.length },
    { label: 'Fotoğraf', icon: Camera,         count: testKayitlari.filter(t => t.fotografUrl).length },
    { label: 'Sonuç',    icon: CheckCircle,    count: testKayitlari.filter(t => !!t.testSonucu).length },
    { label: 'Seri No',  icon: Scan,           count: testKayitlari.filter(t => t.kitSeriNo).length },
    { label: 'Stok',     icon: Package,        count: testKayitlari.filter(t => t.stokId).length },
    { label: 'Sevk',     icon: Truck,          count: labSevkler.length },
    { label: 'Teslim',   icon: ClipboardCheck, count: labSevkler.filter(s => ['Teslim Alındı', 'Analiz Sırasında', 'Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length },
    { label: 'Analiz',   icon: Microscope,     count: labSevkler.filter(s => ['Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)).length },
    { label: 'Rapor',    icon: FileText,       count: labSevkler.filter(s => ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length },
    { label: 'Arşiv',    icon: Archive,        count: labSevkler.filter(s => s.durum === 'Dosya Kapatıldı').length },
  ];

  const topKpis = [
    { label: 'Toplam Test',  value: testKayitlari.length,  sub: `Bugün: ${bugunTestler.length}`, color: '#00D4FF' },
    { label: 'Pozitif',      value: pozitifler.length,      sub: `Oran: ${testKayitlari.length ? Math.round(pozitifler.length / testKayitlari.length * 100) : 0}%`, color: '#EF4444' },
    { label: 'Lab Sevk',     value: labSevkler.length,      sub: `Bekleyen: ${analizBekleyen}`, color: '#8B5CF6' },
    { label: 'Kritik Stok',  value: kritikStok.length,      sub: `SKT: ${sktYaklasan.length} yakın`, color: '#F59E0B' },
    { label: 'Aktif Sevk',   value: aktifSevkler.length,    sub: 'Lab\'a yolda/analiz', color: '#06B6D4' },
    { label: 'Bugün Pozitif',value: bugunTestler.filter(t => t.testSonucu === 'Pozitif').length, sub: 'Son 24 saat', color: '#F97316' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ minHeight: 0 }}>

      {/* ─── HEADER ─────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-3 flex items-center justify-between gap-4"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.07)' }}>
        <div className="flex items-center gap-4">
          <div className="live-indicator">
            <div className="ring-outer" />
            <div className="ring-middle" />
            <div className="dot" />
          </div>
          <div>
            <h1 className="page-title leading-none" style={{ fontSize: '1.25rem' }}>Komuta Kontrol Merkezi</h1>
            <p className="text-[9px] text-muted-foreground/50 uppercase tracking-[0.18em] font-bold mt-0.5">
              Saha Entegre Narkotik Test Sistemi · SENTEK
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-[10px] font-mono text-primary/50 tabular-nums hidden md:block">
            {simdi.toLocaleDateString('tr-TR')} {simdi.toLocaleTimeString('tr-TR')}
          </p>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.18)', color: '#34d399' }}>
            <Shield className="w-3 h-3" />
            <span className="uppercase tracking-widest">Sistem Aktif</span>
          </div>

          <button
            onClick={() => setCanli(!canli)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-[10px] transition-all uppercase tracking-widest ${
              canli
                ? 'text-red-400 bg-red-500/10 border border-red-500/25 hover:bg-red-500/15'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15'
            }`}
          >
            <Radio className={`w-3 h-3 ${canli ? 'animate-pulse' : ''}`} />
            {canli ? 'Canlı' : 'Durdur'}
          </button>
        </div>
      </div>

      {/* ─── KPI STRIP ───────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-3 flex gap-3 overflow-x-auto no-scrollbar scrollbar-hide"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
        {topKpis.map((kpi, i) => (
          <KpiTopCard key={kpi.label} {...kpi} delay={i * 0.05} />
        ))}
      </div>

      {/* ─── MAIN CONTENT ────────────────────────────────── */}
      <div className="flex-1 flex gap-0 overflow-hidden min-h-0">

        {/* LEFT: Map + charts column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Tactical Map */}
          <div className="flex-1 relative min-h-0" style={{ minHeight: 320 }}>
            {/* Map fills the full area */}
            <div className="absolute inset-0">
              <OperasyonHarita testKayitlari={testKayitlari} canliOlay={aktifLokasyon} compact={false} />
            </div>

            {/* Top gradient + title */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ height: 60, background: 'linear-gradient(to bottom, rgba(5,9,22,0.82) 0%, transparent 100%)', zIndex: 450 }}>
              <div className="flex items-center justify-between px-4 pt-2.5 pointer-events-none" style={{ paddingLeft: 52 }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase text-gradient-cyan">
                    TÜRKİYE NARKOTİK OPERASYON AĞRI
                  </span>
                </div>
                {aktifLokasyon && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-auto"
                    style={{ background: 'rgba(0,212,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.22)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[11px] text-primary font-bold">{aktifLokasyon}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom stat chips overlay */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(5,9,22,0.9) 0%, rgba(5,9,22,0.4) 55%, transparent 100%)', zIndex: 450, paddingBottom: 10, paddingLeft: 12, paddingRight: 12, paddingTop: 48 }}>
              <div className="flex items-center gap-2 justify-end pointer-events-auto flex-wrap">
                {[
                  { label: 'Sınır Kapısı', v: 13, renk: '#00D4FF' },
                  { label: 'Deniz Limanı', v: 5, renk: '#3B82F6' },
                  { label: 'Havalimanı', v: 2, renk: '#8B5CF6' },
                  { label: 'Karayolu', v: 3, renk: '#F59E0B' },
                ].map(({ label, v, renk }) => (
                  <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(4,8,20,0.82)', backdropFilter: 'blur(12px)', border: `1px solid ${renk}25` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: renk, boxShadow: `0 0 6px ${renk}` }} />
                    <span className="text-[9px] text-muted-foreground/70">{label}</span>
                    <span className="text-[11px] font-black font-mono" style={{ color: renk }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom charts strip */}
          <div className="flex-shrink-0 flex gap-3 px-4 py-3" style={{ background: 'rgba(5,9,22,0.6)', borderTop: '1px solid rgba(0,212,255,0.06)' }}>

            {/* Area chart */}
            <div className="flex-1 min-w-0 glass-card glow-card p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60">Son 7 Gün — Test Yoğunluğu</p>
                <div className="flex items-center gap-3">
                  {[{ c: '#00D4FF', l: 'Toplam' }, { c: '#EF4444', l: 'Poz' }, { c: '#10B981', l: 'Neg' }].map(({ c, l }) => (
                    <div key={l} className="flex items-center gap-1">
                      <div className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 4px ${c}` }} />
                      <span className="text-[9px] text-muted-foreground/50 uppercase">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.3))' }}>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={son7Gun} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="kkgTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#00D4FF" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="kkgPoz" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="kkgNeg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="gun" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} dy={6} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={22} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="Toplam" stroke="#00D4FF" strokeWidth={2.5} fillOpacity={1} fill="url(#kkgTotal)"
                      dot={{ r: 3, fill: '#00D4FF', strokeWidth: 1.5, stroke: '#060c1a' }} activeDot={{ r: 5, fill: '#00D4FF', stroke: '#060c1a', strokeWidth: 1.5 }} />
                    <Area type="monotone" dataKey="Pozitif" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#kkgPoz)"
                      dot={{ r: 2.5, fill: '#EF4444', strokeWidth: 1.5, stroke: '#060c1a' }} activeDot={{ r: 4, fill: '#EF4444', stroke: '#060c1a', strokeWidth: 1.5 }} />
                    <Area type="monotone" dataKey="Negatif" stroke="#10B981" strokeWidth={1.5} fillOpacity={1} fill="url(#kkgNeg)"
                      dot={{ r: 2.5, fill: '#10B981', strokeWidth: 1.5, stroke: '#060c1a' }} activeDot={{ r: 4, fill: '#10B981', stroke: '#060c1a', strokeWidth: 1.5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut */}
            <div className="flex-shrink-0 glass-card glow-card p-3 flex flex-col" style={{ width: 180 }}>
              <p className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60 mb-1">Sonuç Dağılımı</p>
              <div className="flex-1 relative flex items-center justify-center">
                <PieChart width={140} height={120}>
                  <Pie data={sonucDagilim} cx={70} cy={60} innerRadius={38} outerRadius={56}
                    paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {sonucDagilim.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">Toplam</span>
                  <span className="text-xl font-black text-foreground leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {testKayitlari.length}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {sonucDagilim.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      <span className="text-[9px] text-muted-foreground/60">{name}</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* İzlenebilirlik Zinciri */}
            <div className="flex-1 min-w-0 glass-card glow-card p-3">
              <p className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60 mb-2">İzlenebilirlik Zinciri</p>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {chainSteps.map((step, i) => (
                  <div key={step.label} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                        step.count > 0
                          ? 'border-primary/30 bg-primary/10'
                          : 'border-border/30 bg-secondary/20'
                      }`}>
                        <step.icon className={`w-3.5 h-3.5 ${step.count > 0 ? 'text-primary' : 'text-muted-foreground/25'}`} />
                      </div>
                      <span className="text-[7px] font-bold tracking-wider uppercase text-muted-foreground/50 whitespace-nowrap">{step.label}</span>
                      <span className={`text-[11px] font-black leading-none font-mono ${step.count > 0 ? 'text-foreground' : 'text-muted-foreground/20'}`}>
                        {step.count > 0 ? step.count : '—'}
                      </span>
                    </div>
                    {i < chainSteps.length - 1 && (
                      <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/20 mx-0.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Feed + alerts panel */}
        <div className="flex-shrink-0 flex flex-col gap-0 overflow-hidden"
          style={{ width: 280, borderLeft: '1px solid rgba(0,212,255,0.07)' }}>

          {/* Feed header */}
          <div className="flex-shrink-0 px-3 py-2.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(0,212,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.8))' }} />
              <span className="text-[10px] font-black tracking-widest uppercase text-foreground/80">Saha Akışı</span>
              {canli && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-black text-red-500 tracking-widest">CANLI</span>
                </div>
              )}
            </div>
            <button onClick={() => setAkis([])}
              className="text-[9px] font-bold text-muted-foreground/30 hover:text-foreground transition-colors uppercase tracking-widest">
              Temizle
            </button>
          </div>

          {/* Feed scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-hide space-y-0.5 p-2" style={{ minHeight: 0 }}>
            <AnimatePresence mode="sync" initial={false}>
              {akis.map(olay => <AkisKarti key={olay.id} olay={olay} />)}
            </AnimatePresence>
            {akis.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Radio className="w-8 h-8 text-muted-foreground/15" />
                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Veri bekleniyor</p>
              </div>
            )}
          </div>

          {/* Son Pozitifler */}
          <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
            <div className="px-3 py-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60">Son Pozitif Kayıtlar</span>
            </div>
            <div className="px-2 pb-2 space-y-1">
              {sonPozitifler.map(kayit => (
                <div key={kayit.id} className="alert-critical p-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[10px] font-mono font-bold text-red-400">{kayit.operasyonNo}</p>
                    <span className="text-[9px] text-muted-foreground/35">{timeAgo(kayit.tarih)}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-foreground/90 truncate">{kayit.tespitEdilenMadde || kayit.numuneTuru}</p>
                  <p className="text-[9px] text-muted-foreground/50 truncate">{kayit.lokasyon}</p>
                </div>
              ))}
              {sonPozitifler.length === 0 && (
                <div className="text-center py-3">
                  <p className="text-[9px] text-muted-foreground/30">Pozitif kayıt yok</p>
                </div>
              )}
            </div>
          </div>

          {/* Kritik Stok */}
          <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
            <div className="px-3 py-2 flex items-center gap-1.5">
              <Package className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60">Kritik Stok</span>
            </div>
            <div className="px-2 pb-2 space-y-1.5">
              {kritikStok.slice(0, 3).map(s => {
                const oran = (s.kalanAdedi / s.girisAdedi) * 100;
                return (
                  <div key={s.id} className="alert-warning px-2.5 py-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-[10px] font-bold text-amber-400 truncate pr-1.5">{s.urunAdi}</p>
                      <span className="text-[9px] font-mono font-bold text-amber-400/80 flex-shrink-0">{s.kalanAdedi}/{s.girisAdedi}</span>
                    </div>
                    <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${oran}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${oran < 10 ? 'bg-red-500' : 'bg-amber-500'}`}
                      />
                    </div>
                  </div>
                );
              })}
              {kritikStok.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-[9px] text-muted-foreground/30">Kritik stok yok</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
