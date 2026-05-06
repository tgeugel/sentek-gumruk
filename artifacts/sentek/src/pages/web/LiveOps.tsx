import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, AlertTriangle, FlaskConical, Package, Truck,
  Activity, MapPin, Clock, CheckCircle, Zap, Shield, Map
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { OperasyonHarita } from '../../components/sentek/OperasyonHarita';

interface AkisOlayi {
  id: string;
  zaman: string;
  lokasyon: string;
  mesaj: string;
  tip: 'pozitif' | 'negatif' | 'lab' | 'stok' | 'sistem' | 'sevk';
  operasyonNo?: string;
}

const DEMO_OLAYLAR: Omit<AkisOlayi, 'id' | 'zaman'>[] = [
  { lokasyon: 'Araç Arama Noktası', mesaj: 'Yeni test kaydı oluşturuldu — numune türü: toz madde', tip: 'sistem', operasyonNo: 'OPS-2026-0182' },
  { lokasyon: 'Kapıkule Sınır Kapısı', mesaj: 'Pozitif ön tarama kaydedildi — Esrar türevi tespiti', tip: 'pozitif', operasyonNo: 'OPS-2026-0183' },
  { lokasyon: 'İzmir Alsancak Limanı', mesaj: 'SNT-LAB-2026-000002 numunesi analiz sürecine alındı', tip: 'lab' },
  { lokasyon: 'Mobil Saha Ekibi', mesaj: 'Numune sevk kaydı oluşturuldu — Limana yolda', tip: 'sevk', operasyonNo: 'OPS-2026-0184' },
  { lokasyon: 'Merkez Antrepo', mesaj: 'STK-007 (AMP Kiti) kritik seviyede — 80 adet kaldı', tip: 'stok' },
  { lokasyon: 'Mersin Uluslararası Limanı', mesaj: 'Negatif test sonucu — konteyner yüzey sürüntüsü', tip: 'negatif', operasyonNo: 'OPS-2026-0185' },
  { lokasyon: 'İstanbul Havalimanı Kargo', mesaj: 'SNT-LAB-2026-000006 analiz raporu sisteme yüklendi', tip: 'lab' },
  { lokasyon: 'İpsala Sınır Kapısı', mesaj: 'Yeni saha ekibi operasyona başladı — 3 personel', tip: 'sistem' },
  { lokasyon: 'Habur Sınır Kapısı', mesaj: 'Fentanil türevi şüphesi — acil sevk başlatıldı', tip: 'pozitif', operasyonNo: 'OPS-2026-0186' },
  { lokasyon: 'TEM Karayolu Kontrol', mesaj: 'Düşük güven skoru analiz — manuel kontrol önerildi', tip: 'sistem' },
  { lokasyon: 'Gürbulak Sınır Kapısı', mesaj: 'Çevrimdışı modda 1 test kaydı oluşturuldu', tip: 'sistem' },
  { lokasyon: 'Posta / Kargo Merkezi', mesaj: 'SNT-LAB-2026-000004 teslim alındı — kabul edildi', tip: 'lab' },
  { lokasyon: 'Kapıkule Sınır Kapısı', mesaj: 'TIR araması sonuçlandı — temiz', tip: 'negatif', operasyonNo: 'OPS-2026-0187' },
  { lokasyon: 'Sabiha Gökçen Kargo', mesaj: 'Şüpheli kargo paketi tespit edildi — analiz başlatıldı', tip: 'pozitif', operasyonNo: 'OPS-2026-0188' },
  { lokasyon: 'E-5 Karayolu Kontrol', mesaj: 'Rutin denetim tamamlandı — 5 araç geçti', tip: 'sistem' },
  { lokasyon: 'Sarp Sınır Kapısı', mesaj: 'Metamfetamin tespiti — gizli bölme, TIR', tip: 'pozitif', operasyonNo: 'OPS-2026-0189' },
  { lokasyon: 'Cilvegözü Sınır Kapısı', mesaj: 'Numune sevk edildi — laboratuvara yolda', tip: 'sevk', operasyonNo: 'OPS-2026-0190' },
  { lokasyon: 'Hamzabeyli Sınır Kapısı', mesaj: 'Araç geçişi negatif — rutin kontrol tamamlandı', tip: 'negatif', operasyonNo: 'OPS-2026-0191' },
  { lokasyon: 'Haydarpaşa Limanı', mesaj: 'Konteyner yüzey sürüntüsü — analiz bekleniyor', tip: 'lab' },
  { lokasyon: 'Nusaybin Sınır Kapısı', mesaj: 'Kritik stok uyarısı — Eroin Panel Kiti 30 adet', tip: 'stok' },
];

const TIP_CONFIG: Record<AkisOlayi['tip'], { icon: typeof Radio; renk: string; bg: string; etiket: string; alertClass: string }> = {
  pozitif: { icon: AlertTriangle, renk: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',       etiket: 'POZİTİF',     alertClass: 'alert-critical' },
  negatif: { icon: CheckCircle,  renk: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', etiket: 'NEGATİF',   alertClass: 'alert-info' },
  lab:     { icon: FlaskConical, renk: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20',  etiket: 'LABORATUVAR', alertClass: 'alert-lab' },
  stok:    { icon: Package,      renk: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',    etiket: 'STOK',        alertClass: 'alert-warning' },
  sevk:    { icon: Truck,        renk: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20',      etiket: 'SEVK',        alertClass: 'alert-info' },
  sistem:  { icon: Radio,        renk: 'text-muted-foreground', bg: 'bg-secondary/50 border-border',    etiket: 'SİSTEM',      alertClass: 'alert-info' },
};

function timeAgo(dateString: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds} sn önce`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  return new Date(dateString).toLocaleDateString('tr-TR');
}

function AkisKarti({ olay }: { olay: AkisOlayi }) {
  const cfg = TIP_CONFIG[olay.tip];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 p-3 transition-all ${cfg.alertClass}`}
    >
      <div className={`w-8 h-8 rounded-xl border ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${cfg.renk}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-[10px] font-black tracking-widest ${cfg.renk}`}>{cfg.etiket}</span>
          <span className="text-[10px] text-muted-foreground/30">·</span>
          <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />{olay.lokasyon}
          </span>
          {olay.operasyonNo && (
            <>
              <span className="text-[10px] text-muted-foreground/30">·</span>
              <span className="text-[10px] font-mono text-primary/80">{olay.operasyonNo}</span>
            </>
          )}
        </div>
        <p className="text-xs text-foreground/90">{olay.mesaj}</p>
        <p className="text-[10px] text-muted-foreground/40 mt-0.5 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />{timeAgo(olay.zaman)}
        </p>
      </div>
    </motion.div>
  );
}

export default function LiveOps() {
  const { testKayitlari, labSevkler, stoklar } = useData();
  const [akis, setAkis] = useState<AkisOlayi[]>([]);
  const [canli, setCanli] = useState(true);
  const [aktifLokasyon, setAktifLokasyon] = useState<string | null>(null);
  const [simdi, setSimdi] = useState(new Date());
  const olaySayacRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setSimdi(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const baslangic: AkisOlayi[] = [
      { id: 'init-1', zaman: new Date(Date.now() - 5000).toISOString(),  lokasyon: 'Liman Kontrol Noktası',  mesaj: 'SNT-LAB-2026-000003 analiz sırasında — kimyasal test devam ediyor', tip: 'lab' },
      { id: 'init-2', zaman: new Date(Date.now() - 15000).toISOString(), lokasyon: 'Kapıkule Sınır Kapısı', mesaj: 'Pozitif test kaydedildi — OPS-2026-0142', tip: 'pozitif', operasyonNo: 'OPS-2026-0142' },
      { id: 'init-3', zaman: new Date(Date.now() - 30000).toISOString(), lokasyon: 'Antrepo Bölgesi',       mesaj: 'STK-002 kritik seviyede — 50 adet kaldı', tip: 'stok' },
      { id: 'init-4', zaman: new Date(Date.now() - 50000).toISOString(), lokasyon: 'Karayolu Kontrol',       mesaj: 'LS-009 laboratuvara yolda — tahmini varış bekleniyor', tip: 'sevk' },
      { id: 'init-5', zaman: new Date(Date.now() - 90000).toISOString(), lokasyon: 'Havalimanı Kargo',      mesaj: 'Sistem başlatıldı — Canlı operasyon izleme aktif', tip: 'sistem' },
    ];
    setAkis(baslangic);
    setAktifLokasyon(baslangic[0].lokasyon);
  }, []);

  useEffect(() => {
    if (!canli) return;
    const interval = setInterval(() => {
      const sira = olaySayacRef.current % DEMO_OLAYLAR.length;
      olaySayacRef.current++;
      const template = DEMO_OLAYLAR[sira];
      const yeni: AkisOlayi = { ...template, id: `live-${Date.now()}`, zaman: new Date().toISOString() };
      setAkis(prev => [yeni, ...prev.slice(0, 49)]);
      setAktifLokasyon(yeni.lokasyon);
    }, 5000);
    return () => clearInterval(interval);
  }, [canli]);

  const bugunBaslangic = new Date(); bugunBaslangic.setHours(0, 0, 0, 0);
  const bugunTestler = testKayitlari.filter(t => new Date(t.tarih) >= bugunBaslangic);
  const bugunPozitif = bugunTestler.filter(t => t.testSonucu === 'Pozitif');
  const aktifSevkler = labSevkler.filter(s => ['Laboratuvara Yolda', 'Laboratuvara Ulaştı', 'Teslim Alındı', 'Analiz Sırasında'].includes(s.durum));
  const kritikStok = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi');
  const dusukGuven = testKayitlari.filter(t => (t.analizGuvenSkoru || 100) < 50);
  const sonPozitifler = testKayitlari.filter(t => t.testSonucu === 'Pozitif').slice(0, 5);
  const sktYaklasan = stoklar.filter(s => {
    const skt = new Date(s.skt);
    const now = new Date();
    return skt > now && (skt.getTime() - now.getTime()) < 90 * 24 * 60 * 60 * 1000;
  });

  const kpiItems = [
    { label: 'Bugün Toplam',        value: bugunTestler.length,   icon: Activity,      renk: 'text-cyan-400',   border: 'rgba(0,212,255,0.2)',   bg: 'bg-cyan-500/10' },
    { label: 'Bugün Pozitif',       value: bugunPozitif.length,   icon: AlertTriangle, renk: 'text-red-400',    border: 'rgba(239,68,68,0.2)',   bg: 'bg-red-500/10' },
    { label: 'Aktif Lab Sevk',      value: aktifSevkler.length,   icon: Truck,         renk: 'text-violet-400', border: 'rgba(139,92,246,0.2)',  bg: 'bg-violet-500/10' },
    { label: 'Kritik / Tükenen',    value: kritikStok.length,     icon: Package,       renk: 'text-amber-400',  border: 'rgba(245,158,11,0.2)',  bg: 'bg-amber-500/10' },
    { label: 'Düşük Güven Analizi', value: dusukGuven.length,     icon: Shield,        renk: 'text-orange-400', border: 'rgba(249,115,22,0.2)',  bg: 'bg-orange-500/10' },
    { label: 'SKT Yaklaşan Kit',    value: sktYaklasan.length,    icon: Clock,         renk: 'text-blue-400',   border: 'rgba(59,130,246,0.2)',  bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-slide-up">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Double-ring live indicator */}
            <div className="live-indicator">
              <div className="ring-outer" />
              <div className="ring-middle" />
              <div className="dot" />
            </div>
            <div>
              <h1 className="page-title leading-none">Canlı Operasyon</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.18em] font-bold">Komuta Merkezi Paneli</p>
                <span className="text-muted-foreground/20">|</span>
                <p className="text-[10px] font-mono text-primary/60">
                  {simdi.toLocaleDateString('tr-TR')} {simdi.toLocaleTimeString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCanli(!canli)}
            className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all overflow-hidden ${
              canli
                ? 'text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/15'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${canli ? 'animate-pulse' : ''}`} />
            <span className="uppercase tracking-widest">{canli ? 'Durdur' : 'Başlat'}</span>
          </button>
        </div>
        <div className="gradient-divider" />
      </div>

      {/* KPI Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {kpiItems.map(({ label, value, icon: Icon, renk, border, bg }) => (
          <div key={label} className={`glow-card kpi-chip flex-row items-center gap-3 min-w-[196px]`}
            style={{ border: `1px solid ${border}` }}>
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${renk}`} />
            </div>
            <div>
              <p className="metric-label">{label}</p>
              <p className={`text-xl font-bold leading-none mt-0.5 ${renk}`} style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Map */}
        <div className="xl:col-span-3 glow-card glass-card-elevated overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
            <div className="flex items-center gap-2.5">
              <Map className="w-3.5 h-3.5 text-primary" style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.5))' }} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gradient-cyan">Canlı Harita</span>
            </div>
            {aktifLokasyon && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-primary font-semibold">{aktifLokasyon}</span>
              </div>
            )}
          </div>
          <div className="h-[420px]">
            <OperasyonHarita testKayitlari={testKayitlari} canliOlay={aktifLokasyon} />
          </div>
        </div>

        {/* Feed */}
        <div className="xl:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Saha Akışı
              {canli && (
                <span className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-black text-red-500 tracking-widest">CANLI</span>
                </span>
              )}
            </h2>
            <button onClick={() => setAkis([])} className="text-[10px] font-bold text-muted-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">
              Temizle
            </button>
          </div>
          <div className="h-[420px] overflow-y-auto pr-1 scrollbar-hide space-y-2">
            <AnimatePresence mode="popLayout">
              {akis.map(olay => <AkisKarti key={olay.id} olay={olay} />)}
            </AnimatePresence>
            {akis.length === 0 && (
              <div className="glass-card-inset p-12 text-center border-dashed rounded-2xl">
                <Radio className="w-10 h-10 text-muted-foreground/15 mx-auto mb-3" />
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Veri bekleniyor</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Son Pozitifler */}
        <div className="glow-card glass-card-elevated p-5 space-y-4">
          <h3 className="section-title">Son Pozitif Kayıtlar</h3>
          <div className="space-y-2.5">
            {sonPozitifler.map(kayit => (
              <div key={kayit.id} className="alert-critical p-3">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-mono font-bold text-red-400">{kayit.operasyonNo}</p>
                  <span className="text-[10px] text-muted-foreground/40">{timeAgo(kayit.tarih)}</span>
                </div>
                <p className="text-xs font-semibold text-foreground/90">{kayit.tespitEdilenMadde || kayit.numuneTuru}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin className="w-2.5 h-2.5 text-muted-foreground/50" />
                  <span className="text-[10px] text-muted-foreground/60">{kayit.lokasyon}</span>
                </div>
              </div>
            ))}
            {sonPozitifler.length === 0 && (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-emerald-400/20 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/40">Pozitif kayıt yok</p>
              </div>
            )}
          </div>
        </div>

        {/* Kritik Stok */}
        <div className="glow-card glass-card-elevated p-5 space-y-4">
          <h3 className="section-title">Kritik Stok Durumu</h3>
          <div className="space-y-3">
            {kritikStok.slice(0, 4).map(s => {
              const oran = (s.kalanAdedi / s.girisAdedi) * 100;
              return (
                <div key={s.id} className="alert-warning p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-amber-400 truncate pr-2">{s.urunAdi}</p>
                    <span className="text-[10px] font-mono font-bold text-amber-400/80 flex-shrink-0">{s.kalanAdedi}/{s.girisAdedi}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${oran}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${oran < 10 ? 'bg-red-500' : 'bg-amber-500'}`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mt-1.5 uppercase tracking-tighter">{s.depo} · {s.durum}</p>
                </div>
              );
            })}
            {kritikStok.length === 0 && (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-emerald-400/20 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/40">Kritik stok yok</p>
              </div>
            )}
          </div>
        </div>

        {/* SKT Yaklaşan */}
        <div className="glow-card glass-card-elevated p-5 space-y-4">
          <h3 className="section-title">SKT Yaklaşan Kitler</h3>
          <div className="space-y-2.5">
            {sktYaklasan.slice(0, 5).map(s => {
              const kalan = Math.ceil((new Date(s.skt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
              const acil = kalan <= 30;
              return (
                <div key={s.id} className={`${acil ? 'alert-critical' : 'alert-warning'} p-3`}>
                  <div className="flex justify-between items-start">
                    <p className={`text-xs font-bold truncate pr-2 ${acil ? 'text-red-400' : 'text-amber-400'}`}>{s.urunAdi}</p>
                    <span className={`text-[10px] font-black flex-shrink-0 ${acil ? 'text-red-500' : 'text-amber-500'}`}>{kalan} GÜN</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-muted-foreground/50">{s.lotSeriNo}</span>
                    <span className="text-[10px] text-muted-foreground/20">·</span>
                    <span className="text-[10px] text-muted-foreground/50">{new Date(s.skt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              );
            })}
            {sktYaklasan.length === 0 && (
              <div className="glass-card-inset p-8 text-center rounded-xl">
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Kritik SKT yok</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
