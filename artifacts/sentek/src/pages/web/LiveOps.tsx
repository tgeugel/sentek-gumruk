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

function AkisKarti({ olay }: { olay: AkisOlayi }) {
  const cfg = TIP_CONFIG[olay.tip];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} transition-all`}
    >
      <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-3.5 h-3.5 ${cfg.renk}`} />
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
          {new Date(olay.zaman).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
  const olaySayacRef = useRef(0);

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
    <div className="p-6 space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground">Canlı Operasyon</h1>
          </div>
          <p className="text-sm text-muted-foreground">Gerçek zamanlı saha operasyonu izleme paneli</p>
        </div>
        <button
          onClick={() => setCanli(!canli)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all ${
            canli
              ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          <Radio className={`w-4 h-4 ${canli ? 'animate-pulse' : ''}`} />
          {canli ? 'Canlı — Durdur' : 'Başlat'}
        </button>
      </div>

      {/* KPI Şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Bugün Toplam', value: bugunTestler.length, icon: Activity, renk: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Bugün Pozitif', value: bugunPozitif.length, icon: AlertTriangle, renk: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Aktif Lab Sevk', value: aktifSevkler.length, icon: Truck, renk: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Kritik / Tükenen', value: kritikStok.length, icon: Package, renk: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(({ label, value, icon: Icon, renk, bg }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${renk}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Harita + Akış */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Harita */}
        <div className="xl:col-span-3 space-y-2">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Operasyon Haritası
            {aktifLokasyon && (
              <span className="text-[10px] font-normal text-muted-foreground ml-1 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-primary" />
                <span className="text-primary">{aktifLokasyon}</span> — son olay
              </span>
            )}
          </h2>
          <div className="h-[420px]">
            <OperasyonHarita testKayitlari={testKayitlari} canliOlay={aktifLokasyon} />
          </div>
        </div>

        {/* Canlı Akış */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Canlı Akış
              {canli && <span className="text-[10px] font-black text-red-400 tracking-widest animate-pulse">● CANLI</span>}
            </h2>
            <button onClick={() => setAkis([])} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Temizle
            </button>
          </div>
          <div className="space-y-2 h-[372px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {akis.map(olay => <AkisKarti key={olay.id} olay={olay} />)}
            </AnimatePresence>
            {akis.length === 0 && (
              <div className="glass-card p-8 text-center">
                <Radio className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Akış bekleniyor</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Son Pozitifler */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Son Pozitif Kayıtlar
          </h3>
          <div className="space-y-2">
            {sonPozitifler.map(kayit => (
              <div key={kayit.id} className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15">
                <p className="text-xs font-mono font-bold text-red-400">{kayit.operasyonNo}</p>
                <p className="text-xs text-foreground/80">{kayit.tespitEdilenMadde || kayit.numuneTuru}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />{kayit.lokasyon}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kritik Stok + Düşük Güven */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-amber-400" /> Kritik Stok & Uyarılar
          </h3>
          <div className="space-y-2">
            {kritikStok.slice(0, 3).map(s => (
              <div key={s.id} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <p className="text-xs font-semibold text-amber-400 truncate">{s.urunAdi}</p>
                <p className="text-[10px] text-muted-foreground">
                  {s.durum === 'Tükendi' ? '⚠ Tükendi' : `${s.kalanAdedi} adet · ${s.durum}`}
                </p>
              </div>
            ))}
            {dusukGuven.length > 0 && (
              <div className="p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/15">
                <p className="text-xs font-semibold text-violet-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {dusukGuven.length} düşük güven analizi
                </p>
                <p className="text-[10px] text-muted-foreground">Manuel kontrol önerilir</p>
              </div>
            )}
          </div>
        </div>

        {/* SKT Yaklaşan */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-orange-400" /> SKT Yaklaşan Kitler
          </h3>
          <div className="space-y-2">
            {sktYaklasan.slice(0, 5).map(s => {
              const kalan = Math.ceil((new Date(s.skt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
              const acil = kalan <= 30;
              return (
                <div key={s.id} className={`p-2.5 rounded-lg border ${acil ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/15'}`}>
                  <p className={`text-xs font-semibold truncate ${acil ? 'text-red-400' : 'text-orange-400'}`}>{s.urunAdi}</p>
                  <p className="text-[10px] text-muted-foreground">{kalan} gün · {s.lotSeriNo}</p>
                </div>
              );
            })}
            {sktYaklasan.length === 0 && (
              <p className="text-xs text-muted-foreground/60 text-center py-3">SKT yaklaşan kit yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
