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

const TIP_CONFIG: Record<AkisOlayi['tip'], { icon: typeof Radio; renk: string; bg: string; etiket: string }> = {
  pozitif: { icon: AlertTriangle, renk: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', etiket: 'POZİTİF' },
  negatif: { icon: CheckCircle, renk: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', etiket: 'NEGATİF' },
  lab: { icon: FlaskConical, renk: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', etiket: 'LABORATUVAR' },
  stok: { icon: Package, renk: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', etiket: 'STOK' },
  sevk: { icon: Truck, renk: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', etiket: 'SEVK' },
  sistem: { icon: Radio, renk: 'text-muted-foreground', bg: 'bg-secondary/50 border-border', etiket: 'SİSTEM' },
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

  const alertClass = olay.tip === 'pozitif' ? 'alert-critical' :
                    olay.tip === 'negatif' ? 'alert-info' :
                    olay.tip === 'lab' ? 'alert-lab' :
                    olay.tip === 'stok' ? 'alert-warning' :
                    olay.tip === 'sevk' ? 'alert-info' : 'alert-info';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-3 p-3 transition-all ${alertClass}`}
    >
      <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${cfg.renk}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-[10px] font-black tracking-widest ${cfg.renk}`}>{cfg.etiket}</span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />{olay.lokasyon}
          </span>
          {olay.operasyonNo && (
            <>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="text-[10px] font-mono text-primary/80">{olay.operasyonNo}</span>
            </>
          )}
        </div>
        <p className="text-xs text-foreground/90">{olay.mesaj}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {timeAgo(olay.zaman)}
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
      { id: 'init-1', zaman: new Date(Date.now() - 5000).toISOString(), lokasyon: 'Liman Kontrol Noktası', mesaj: 'SNT-LAB-2026-000003 analiz sırasında — kimyasal test devam ediyor', tip: 'lab' },
      { id: 'init-2', zaman: new Date(Date.now() - 15000).toISOString(), lokasyon: 'Kapıkule Sınır Kapısı', mesaj: 'Pozitif test kaydedildi — OPS-2026-0142', tip: 'pozitif', operasyonNo: 'OPS-2026-0142' },
      { id: 'init-3', zaman: new Date(Date.now() - 30000).toISOString(), lokasyon: 'Antrepo Bölgesi', mesaj: 'STK-002 kritik seviyede — 50 adet kaldı', tip: 'stok' },
      { id: 'init-4', zaman: new Date(Date.now() - 50000).toISOString(), lokasyon: 'Karayolu Kontrol Noktası', mesaj: 'LS-009 laboratuvara yolda — tahmini varış bekleniyor', tip: 'sevk' },
      { id: 'init-5', zaman: new Date(Date.now() - 90000).toISOString(), lokasyon: 'Havalimanı Kargo', mesaj: 'Sistem başlatıldı — Canlı operasyon izleme aktif', tip: 'sistem' },
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

  // KPI'lar
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

  return (
    <div className="p-6 space-y-6 animate-fade-slide-up">
      {/* Başlık */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Canlı Operasyon</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Komuta Merkezi Paneli</p>
                <span className="text-muted-foreground/30">|</span>
                <p className="text-xs font-mono text-primary/80">
                  {simdi.toLocaleDateString('tr-TR')} {simdi.toLocaleTimeString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCanli(!canli)}
            className={`group relative flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all overflow-hidden ${
              canli
                ? 'text-red-400 bg-red-500/10 border border-red-500/30'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
            }`}
          >
            <div className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-gradient-to-r ${canli ? 'from-red-500 to-transparent' : 'from-emerald-500 to-transparent'}`} />
            <Radio className={`w-3.5 h-3.5 relative z-10 ${canli ? 'animate-pulse' : ''}`} />
            <span className="relative z-10 uppercase tracking-widest">{canli ? 'Durdur' : 'Başlat'}</span>
          </button>
        </div>
        <div className="gradient-divider" />
      </div>

      {/* KPI Şeridi */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {[
          { label: 'Bugün Toplam', value: bugunTestler.length, icon: Activity, renk: 'text-cyan-400', bg: 'bg-cyan-500/20' },
          { label: 'Bugün Pozitif', value: bugunPozitif.length, icon: AlertTriangle, renk: 'text-red-400', bg: 'bg-red-500/20' },
          { label: 'Aktif Lab Sevk', value: aktifSevkler.length, icon: Truck, renk: 'text-violet-400', bg: 'bg-violet-500/20' },
          { label: 'Kritik / Tükenen', value: kritikStok.length, icon: Package, renk: 'text-amber-400', bg: 'bg-amber-500/20' },
          { label: 'Düşük Güven Analizi', value: dusukGuven.length, icon: Shield, renk: 'text-orange-400', bg: 'bg-orange-500/20' },
          { label: 'SKT Yaklaşan Kit', value: sktYaklasan.length, icon: Clock, renk: 'text-blue-400', bg: 'bg-blue-500/20' },
        ].map(({ label, value, icon: Icon, renk, bg }) => (
          <div key={label} className="kpi-chip flex-row items-center gap-4 min-w-[200px]">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${renk}`} />
            </div>
            <div>
              <p className="metric-label">{label}</p>
              <p className="metric-value text-lg">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Harita + Akış */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Harita */}
        <div className="xl:col-span-3 glass-card-elevated overflow-hidden flex flex-col">
          <div className="bg-black/30 px-4 py-2 border-bottom flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] text-foreground/80 uppercase">Canlı Harita</span>
            </div>
            {aktifLokasyon && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <span className="text-primary">{aktifLokasyon}</span> — aktif
                </span>
              </div>
            )}
          </div>
          <div className="h-[420px]">
            <OperasyonHarita testKayitlari={testKayitlari} canliOlay={aktifLokasyon} />
          </div>
        </div>

        {/* Canlı Akış */}
        <div className="xl:col-span-2 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Saha Akışı
              {canli && <span className="text-[10px] font-black text-red-500 animate-pulse ml-2">● CANLI</span>}
            </h2>
            <button onClick={() => setAkis([])} className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
              Temizle
            </button>
          </div>
          <div className="space-y-2 flex-1 h-[420px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {akis.map(olay => <AkisKarti key={olay.id} olay={olay} />)}
            </AnimatePresence>
            {akis.length === 0 && (
              <div className="glass-card-inset p-12 text-center border-dashed">
                <Radio className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Veri bekleniyor</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Son Pozitifler */}
        <div className="glass-card-elevated p-5 space-y-4">
          <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Son Pozitif Kayıtlar
          </h3>
          <div className="space-y-3">
            {sonPozitifler.map(kayit => (
              <div key={kayit.id} className="alert-critical p-3">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-mono font-bold text-red-400">{kayit.operasyonNo}</p>
                  <span className="text-[10px] text-muted-foreground/50">{timeAgo(kayit.tarih)}</span>
                </div>
                <p className="text-xs font-semibold text-foreground/90">{kayit.tespitEdilenMadde || kayit.numuneTuru}</p>
                <div className="flex items-center gap-1 mt-2">
                  <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{kayit.lokasyon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kritik Stok */}
        <div className="glass-card-elevated p-5 space-y-4">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Package className="w-4 h-4" /> Kritik Stok Durumu
          </h3>
          <div className="space-y-4">
            {kritikStok.slice(0, 4).map(s => {
              const oran = (s.kalanAdedi / s.girisAdedi) * 100;
              return (
                <div key={s.id} className="alert-warning p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-amber-400 truncate pr-2">{s.urunAdi}</p>
                    <span className="text-[10px] font-mono font-bold text-amber-400/80">{s.kalanAdedi}/{s.girisAdedi}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${oran}%` }}
                      className={`h-full ${oran < 10 ? 'bg-red-500' : 'bg-amber-500'}`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-tighter">
                    {s.depo} · {s.durum}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SKT Yaklaşan */}
        <div className="glass-card-elevated p-5 space-y-4">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock className="w-4 h-4" /> SKT Yaklaşan Kitler
          </h3>
          <div className="space-y-3">
            {sktYaklasan.slice(0, 5).map(s => {
              const kalan = Math.ceil((new Date(s.skt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
              const acil = kalan <= 30;
              return (
                <div key={s.id} className={`${acil ? 'alert-critical' : 'alert-warning'} p-3`}>
                  <div className="flex justify-between items-start">
                    <p className={`text-xs font-bold truncate pr-2 ${acil ? 'text-red-400' : 'text-amber-400'}`}>{s.urunAdi}</p>
                    <span className={`text-[10px] font-black ${acil ? 'text-red-500' : 'text-amber-500'}`}>{kalan} GÜN</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-muted-foreground/60">{s.lotSeriNo}</span>
                    <span className="text-[10px] text-muted-foreground/30">·</span>
                    <span className="text-[10px] text-muted-foreground/60">{new Date(s.skt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              );
            })}
            {sktYaklasan.length === 0 && (
              <div className="glass-card-inset p-8 text-center border-dashed">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kritik SKT yok</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
