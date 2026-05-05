import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, MapPin, FlaskConical, Package,
  Camera, AlertTriangle, CheckCircle, XCircle, RotateCcw,
  Shield, Loader2, ChevronRight, Info, Clock, Hash, Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TestSonucu } from '../../types';

const ADIMLAR = [
  'Operasyon', 'Lokasyon', 'Numune Türü', 'Açıklama',
  'Kit Seçimi', 'Fotoğraf', 'AI Analizi', 'Sonuç', 'Tespit & Notlar', 'Tamamla'
];

const LOKASYONLAR = [
  'Sınır Kapısı A', 'Sınır Kapısı B', 'Liman Kontrol Noktası',
  'Antrepo Bölgesi', 'Araç Arama Noktası', 'Karayolu Kontrol Noktası',
  'Havalimanı Kargo', 'Posta / Kargo Merkezi', 'Kargo Terminali', 'Mobil Saha Ekibi',
];

const KONTROL_NOKTALARI: Record<string, string[]> = {
  'Sınır Kapısı A': ['Peron 1', 'Peron 2', 'Peron 3', 'TIR Parkı', 'Yolcu Kapısı', 'Gümrük Binası'],
  'Sınır Kapısı B': ['Giriş Kapısı', 'Peron A', 'Peron B', 'Araç Denetim'],
  'Liman Kontrol Noktası': ['Konteyner Sahası', 'Ro-Ro Terminali', 'Gemi Ambarı', 'Konteyner Limanı'],
  'Antrepo Bölgesi': ['Depo Girişi', 'Depo A', 'Depo B', 'İç Hat Terminal'],
  'Araç Arama Noktası': ['Kuzey Hat', 'Orta Hat', 'Güney Hat', 'Araç Arama Noktası 2'],
  'Karayolu Kontrol Noktası': ['Güzergah 1', 'Güzergah 2', 'Güzergah 3'],
  'Havalimanı Kargo': ['İç Hat Terminal', 'Dış Hat Terminal', 'Kargo Ambarı'],
  'Posta / Kargo Merkezi': ['X-Ray Denetim', 'Sortaj Alanı', 'Giriş Lobi'],
  'Kargo Terminali': ['Sortaj Alanı', 'Depolama Alanı'],
  'Mobil Saha Ekibi': ['Güney Güzergah', 'Kuzey Güzergah', 'Araç Arama Noktası 2'],
};

const NUMUNE_TURLERI = [
  'Toz madde', 'Sıvı numune', 'Emdirilmiş kumaş', 'Emdirilmiş pamuk',
  'Emdirilmiş kağıt', 'Araç içi yüzey sürüntüsü', 'Konteyner yüzeyi',
  'Bagaj / eşya içi numune', 'Paket / koli içeriği', 'Diğer',
];

const TESPITLER = [
  'Kokain', 'Kokain analogu', 'Eroin türevi', 'Metamfetamin', 'Amfetamin grubu',
  'Esrar türevi', 'Fentanil türevi', 'Fentanil analogu', 'GHB benzeri madde',
  'Ketamin', 'MDMA / Ekstazi', 'Sentetik kanabinoid', 'Bilinmeyen madde',
];

function generateOpNo() {
  const n = 167 + Math.floor(Math.random() * 50);
  return `OPS-2026-0${n}`;
}

function generateKitSeriNo(lotSeriNo: string) {
  const n = String(Math.floor(Math.random() * 900) + 100);
  return `${lotSeriNo}-K${n}`;
}

function getSKTDurumu(skt: string) {
  const diff = new Date(skt).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return { label: 'SKT Geçmiş', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  if (days < 90) return { label: `SKT Yaklaşıyor (${days} gün)`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
  return { label: 'Kullanılabilir', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
}

function AnalysisVisual({ guven, sonuc }: { guven: number; sonuc: TestSonucu | '' }) {
  const pozitif = sonuc === 'Pozitif';
  const gecersiz = sonuc === 'Geçersiz';

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Kit Görüntüsü</p>
        <div className={`text-xs px-2 py-1 rounded-full font-bold ${
          pozitif ? 'bg-red-500/20 text-red-400' : gecersiz ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {sonuc || '—'}
        </div>
      </div>

      <div className="relative bg-background/50 border border-border/50 rounded-xl h-28 flex items-center justify-center gap-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        <div className="flex flex-col items-center gap-1">
          <div className={`w-1 h-14 rounded-full transition-all ${!gecersiz ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.6)]' : 'bg-slate-700'}`} />
          <span className="text-xs text-muted-foreground/60">C</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-1 h-14 rounded-full transition-all ${pozitif ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-slate-700/30'}`} />
          <span className="text-xs text-muted-foreground/60">T1</span>
        </div>
        {pozitif && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-1 h-10 rounded-full bg-red-300/60" />
            <span className="text-xs text-muted-foreground/60">T2</span>
          </div>
        )}
        <div className="absolute left-2 top-2 text-xs text-muted-foreground/30 font-mono select-none">SENTEK®</div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { label: 'Kontrol (C)', val: gecersiz ? 'Yok' : 'Belirgin', cls: gecersiz ? 'text-slate-500' : 'text-emerald-400', bg: gecersiz ? 'bg-slate-800/30 border-slate-700/30' : 'bg-emerald-500/10 border-emerald-500/30' },
          { label: 'Test (T1)', val: pozitif ? 'Belirgin' : 'Yok', cls: pozitif ? 'text-red-400' : 'text-slate-500', bg: pozitif ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/30 border-slate-700/30' },
          { label: 'Güven', val: `%${guven}`, cls: guven >= 80 ? 'text-emerald-400' : guven >= 55 ? 'text-amber-400' : 'text-red-400', bg: guven >= 80 ? 'bg-emerald-500/10 border-emerald-500/30' : guven >= 55 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30' },
        ].map(({ label, val, cls, bg }) => (
          <div key={label} className={`rounded-lg p-2 border text-center ${bg}`}>
            <p className="text-muted-foreground/70 mb-0.5">{label}</p>
            <p className={`font-bold ${cls}`}>{val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Analiz Güven Skoru</span>
          <span className={`font-bold ${guven >= 80 ? 'text-emerald-400' : guven >= 55 ? 'text-amber-400' : 'text-red-400'}`}>%{guven}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${guven}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${guven >= 80 ? 'bg-emerald-400' : guven >= 55 ? 'bg-amber-400' : 'bg-red-400'}`}
          />
        </div>
        <p className="text-xs text-muted-foreground/70">
          {guven >= 80 ? 'Yüksek güven — sonuç güvenilir' : guven >= 55 ? 'Orta güven — manuel kontrol önerilir' : 'Düşük güven — fotoğraf kalitesini kontrol edin'}
        </p>
      </div>

      {pozitif && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">Pozitif sonuç tespit edildi. Laboratuvar doğrulaması zorunludur.</p>
        </div>
      )}
      {gecersiz && (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">Kontrol çizgisi algılanmadı. Test geçersiz sayılabilir, tekrar yapınız.</p>
        </div>
      )}
    </div>
  );
}

export default function NewTest() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { testKaydiEkle, labSevkEkle, stoklar } = useData();

  const [adim, setAdim] = useState(0);
  const [analizYapiliyor, setAnalizYapiliyor] = useState(false);
  const [kaydedildi, setKaydedildi] = useState(false);

  const [form, setForm] = useState({
    operasyonNo: generateOpNo(),
    lokasyon: '',
    kontrolNokta: '',
    numuneTuru: '',
    sahisAciklamasi: '',
    seciliStokId: '',
    kitSeriNo: '',
    kitSKT: '',
    kitPanelTipi: '',
    fotografVar: false,
    analizGuven: 0,
    testSonucu: '' as TestSonucu | '',
    tespitEdilenMadde: '',
    notlar: '',
    labSevkIstiyor: false,
  });

  const setField = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const availableStok = stoklar.filter(
    s => s.kalanAdedi > 0 && s.durum !== 'Tükendi' && !s.panelTipi.includes('Sarf')
  );

  const handleStokSec = (stokId: string) => {
    const stok = stoklar.find(s => s.id === stokId);
    if (!stok) return;
    setForm(p => ({
      ...p,
      seciliStokId: stokId,
      kitSeriNo: generateKitSeriNo(stok.lotSeriNo),
      kitSKT: stok.skt,
      kitPanelTipi: stok.panelTipi,
    }));
  };

  const handleFotoAnalizi = () => {
    setAnalizYapiliyor(true);
    setTimeout(() => {
      const guven = Math.floor(Math.random() * 25) + 70;
      const r = Math.random();
      const sonuc: TestSonucu = r < 0.3 ? 'Pozitif' : r < 0.42 ? 'Geçersiz' : 'Negatif';
      setForm(p => ({ ...p, analizGuven: guven, testSonucu: sonuc }));
      setAnalizYapiliyor(false);
    }, 2400);
  };

  const handleKaydet = () => {
    const yeniTest = testKaydiEkle({
      operasyonNo: form.operasyonNo,
      tarih: new Date().toISOString(),
      lokasyon: form.lokasyon,
      kontrolNokta: form.kontrolNokta,
      numuneTuru: form.numuneTuru,
      sahisAciklamasi: form.sahisAciklamasi,
      kitSeriNo: form.kitSeriNo,
      kitSKT: form.kitSKT,
      kitPanelTipi: form.kitPanelTipi,
      testSonucu: form.testSonucu as TestSonucu,
      tespitEdilenMadde: form.tespitEdilenMadde || undefined,
      notlar: form.notlar || undefined,
      personelAdi: user?.ad || 'Saha Personeli',
      analizGuvenSkoru: form.analizGuven,
      stokId: form.seciliStokId || undefined,
    } as any, form.seciliStokId || undefined);

    if (form.labSevkIstiyor && form.testSonucu === 'Pozitif') {
      labSevkEkle({
        operasyonNo: form.operasyonNo,
        testKaydiId: yeniTest.id,
        numuneTuru: form.numuneTuru,
        onTaramaSonucu: 'Pozitif',
        tespitEdilenMadde: form.tespitEdilenMadde || undefined,
        kitSeriNo: form.kitSeriNo,
        kitSKT: form.kitSKT,
        sevkEdenBirim: form.lokasyon,
        durum: 'Sevk Kaydı Oluşturuldu',
        oncelik: 'Normal',
        notlar: form.notlar || undefined,
      });
    }
    setKaydedildi(true);
  };

  const canProceed = () => {
    if (adim === 1) return !!form.lokasyon && !!form.kontrolNokta;
    if (adim === 2) return !!form.numuneTuru;
    if (adim === 3) return form.sahisAciklamasi.length >= 10;
    if (adim === 4) return !!form.kitSeriNo;
    if (adim === 5) return form.fotografVar;
    if (adim === 6) return !!form.testSonucu && !analizYapiliyor;
    if (adim === 7) return !!form.testSonucu;
    return true;
  };

  if (kaydedildi) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
            form.testSonucu === 'Pozitif' ? 'bg-red-500/20 border-red-500' :
            form.testSonucu === 'Geçersiz' ? 'bg-amber-500/20 border-amber-500' :
            'bg-emerald-500/20 border-emerald-500'
          }`}
        >
          {form.testSonucu === 'Geçersiz' ? <AlertTriangle className="w-8 h-8 text-amber-400" /> :
           form.testSonucu === 'Pozitif' ? <AlertTriangle className="w-8 h-8 text-red-400" /> :
           <CheckCircle className="w-8 h-8 text-emerald-400" />}
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Kayıt Tamamlandı</h2>
          <p className="text-sm text-muted-foreground font-mono">{form.operasyonNo}</p>
          <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            form.testSonucu === 'Pozitif' ? 'bg-red-500/20 text-red-400' :
            form.testSonucu === 'Geçersiz' ? 'bg-amber-500/20 text-amber-400' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            {form.testSonucu === 'Pozitif' ? 'POZİTİF SONUÇ' : form.testSonucu === 'Geçersiz' ? 'GEÇERSİZ' : 'NEGATİF SONUÇ'}
          </div>
        </div>
        {form.testSonucu === 'Pozitif' && form.labSevkIstiyor && (
          <div className="glass-card p-3 w-full text-left">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <p className="text-sm font-semibold text-cyan-400">Lab Sevk Oluşturuldu</p>
            </div>
            <p className="text-xs text-muted-foreground">Numune laboratuvar takip sistemine eklendi.</p>
          </div>
        )}
        <div className="flex flex-col gap-3 w-full">
          <button onClick={() => setLocation('/mobile/kayitlarim')}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm">
            Kayıtlarımı Gör
          </button>
          <button onClick={() => setLocation('/mobile')}
            className="w-full py-3.5 bg-secondary text-foreground rounded-xl font-semibold text-sm">
            Ana Sayfa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={() => adim === 0 ? setLocation('/mobile') : setAdim(a => a - 1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> {adim === 0 ? 'İptal' : 'Geri'}
        </button>
        <div className="mb-1 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Adım {adim + 1} / {ADIMLAR.length}</p>
          <p className="text-xs font-semibold text-primary">{ADIMLAR[adim]}</p>
        </div>
        <div className="flex gap-1 mt-2">
          {ADIMLAR.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < adim ? 'bg-primary' : i === adim ? 'bg-primary/50' : 'bg-secondary'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={adim}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >

            {/* ADIM 0: Operasyon */}
            {adim === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Operasyon Bilgisi</h2>
                <div className="glass-card p-4 divide-y divide-border/50">
                  {[
                    { icon: Hash, label: 'Operasyon No', val: form.operasyonNo, cls: 'font-mono text-primary font-bold' },
                    { icon: Clock, label: 'Tarih / Saat', val: new Date().toLocaleString('tr-TR'), cls: '' },
                    { icon: Shield, label: 'Personel', val: user?.ad || 'Saha Personeli', cls: '' },
                  ].map(({ icon: Icon, label, val, cls }) => (
                    <div key={label} className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={`text-sm ${cls || 'text-foreground font-medium'}`}>{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Operasyon numarası otomatik atandı. Devam etmek için İleri'ye basın.</p>
                </div>
              </div>
            )}

            {/* ADIM 1: Lokasyon */}
            {adim === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Lokasyon Bilgisi</h2>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Kontrol Noktası
                  </label>
                  <div className="space-y-2">
                    {LOKASYONLAR.map(l => (
                      <button key={l} onClick={() => { setField('lokasyon', l); setField('kontrolNokta', ''); }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                          form.lokasyon === l ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground hover:border-primary/40'
                        }`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                {form.lokasyon && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Alt Nokta / Peron</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(KONTROL_NOKTALARI[form.lokasyon] || []).map(k => (
                        <button key={k} onClick={() => setField('kontrolNokta', k)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                            form.kontrolNokta === k ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground'
                          }`}>
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ADIM 2: Numune Türü */}
            {adim === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Numune Türü</h2>
                <div className="space-y-2">
                  {NUMUNE_TURLERI.map(t => (
                    <button key={t} onClick={() => setField('numuneTuru', t)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        form.numuneTuru === t ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADIM 3: Açıklama */}
            {adim === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Materyal Açıklaması</h2>
                <p className="text-sm text-muted-foreground">Şüpheli materyali kısaca açıklayın.</p>
                <textarea
                  value={form.sahisAciklamasi}
                  onChange={e => setField('sahisAciklamasi', e.target.value)}
                  placeholder="Örn: TIR gövdesinde gizli bölme içi beyaz kristal toz..."
                  rows={5}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60"
                />
                <p className={`text-xs ${form.sahisAciklamasi.length < 10 ? 'text-muted-foreground/40' : 'text-emerald-400'}`}>
                  {form.sahisAciklamasi.length} / en az 10 karakter
                </p>
              </div>
            )}

            {/* ADIM 4: Kit Seçimi */}
            {adim === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Test Kiti Seçimi</h2>
                <p className="text-sm text-muted-foreground">Stoktan kullanılabilir bir kit seçin.</p>
                <div className="space-y-2">
                  {availableStok.map(s => {
                    const sktInfo = getSKTDurumu(s.skt);
                    const secili = form.seciliStokId === s.id;
                    return (
                      <button key={s.id} onClick={() => handleStokSec(s.id)}
                        className={`w-full rounded-xl border text-left p-3 transition-all ${
                          secili ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/30'
                        }`}>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${secili ? 'text-primary' : 'text-foreground'}`}>{s.urunAdi}</p>
                            <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{s.panelTipi}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 font-semibold ${sktInfo.bg} ${sktInfo.color}`}>
                            {s.kalanAdedi} adet
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground/50 font-mono">{s.lotSeriNo}</span>
                          <span className={`text-xs font-medium flex items-center gap-0.5 ${sktInfo.color}`}>
                            <Calendar className="w-2.5 h-2.5" />{s.skt}
                          </span>
                        </div>
                        {sktInfo.label !== 'Kullanılabilir' && (
                          <div className={`mt-1.5 flex items-center gap-1 text-xs ${sktInfo.color}`}>
                            <AlertTriangle className="w-3 h-3" />{sktInfo.label}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {form.kitSeriNo && (
                  <div className="glass-card p-3 border-primary/20">
                    <p className="text-xs text-muted-foreground mb-0.5">Atanan Seri No</p>
                    <p className="text-sm font-bold font-mono text-primary">{form.kitSeriNo}</p>
                  </div>
                )}
              </div>
            )}

            {/* ADIM 5: Fotoğraf */}
            {adim === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Test Fotoğrafı</h2>
                <p className="text-sm text-muted-foreground">Kit ve numune fotoğrafını çekin veya yükleyin.</p>
                {!form.fotografVar ? (
                  <button onClick={() => setField('fotografVar', true)}
                    className="w-full h-44 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Camera className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Fotoğraf Ekle</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Kamera veya galeri</p>
                    </div>
                  </button>
                ) : (
                  <div className="relative w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <CheckCircle className="w-10 h-10 text-emerald-400 relative z-10" />
                    <p className="text-sm font-semibold text-emerald-400 relative z-10">Fotoğraf Yüklendi</p>
                    <p className="text-xs text-muted-foreground/60 relative z-10 font-mono">test_{Date.now()}.jpg</p>
                    <button onClick={() => setField('fotografVar', false)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors">
                      <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}
                <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Net fotoğraf analiz doğruluğunu artırır. Kontrol ve test çizgilerinin görünür olmasına dikkat edin.</p>
                </div>
              </div>
            )}

            {/* ADIM 6: AI Analizi */}
            {adim === 6 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">AI Görüntü Analizi</h2>
                {!form.testSonucu && !analizYapiliyor ? (
                  <div className="space-y-4">
                    <div className="glass-card p-5 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                        <FlaskConical className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Fotoğraf hazır</p>
                        <p className="text-xs text-muted-foreground mt-1">Analizi başlatmak için butona basın</p>
                      </div>
                      <p className="text-xs text-muted-foreground/50 font-mono">{form.kitSeriNo}</p>
                    </div>
                    <button onClick={handleFotoAnalizi}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                      <FlaskConical className="w-4 h-4" /> Analizi Başlat
                    </button>
                  </div>
                ) : analizYapiliyor ? (
                  <div className="glass-card p-6 text-center space-y-5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent mx-auto flex items-center justify-center"
                    >
                      <FlaskConical className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Görüntü işleniyor...</p>
                      <p className="text-xs text-muted-foreground mt-1">Çizgi tespiti ve panel analizi yapılıyor</p>
                    </div>
                    <div className="space-y-2 text-left">
                      {['Kontrol çizgisi tarıyor', 'Test çizgileri analiz ediliyor', 'Güven skoru hesaplanıyor'].map((s, i) => (
                        <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.7 }}
                          className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 text-primary animate-spin flex-shrink-0" />
                          {s}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AnalysisVisual guven={form.analizGuven} sonuc={form.testSonucu} />
                )}
              </div>
            )}

            {/* ADIM 7: Sonuç Doğrulama */}
            {adim === 7 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Sonucu Doğrula</h2>
                <div className="glass-card p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Önerisi</p>
                    <p className={`text-sm font-bold ${form.testSonucu === 'Pozitif' ? 'text-red-400' : form.testSonucu === 'Geçersiz' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {form.testSonucu} — %{form.analizGuven} güven
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Yetkili olarak sonucu onaylayın veya düzeltin:</p>
                <div className="space-y-3">
                  {(['Pozitif', 'Negatif', 'Geçersiz'] as TestSonucu[]).map(s => (
                    <button key={s} onClick={() => setField('testSonucu', s)}
                      className={`w-full py-4 rounded-xl border-2 flex items-center justify-between px-5 transition-all ${
                        form.testSonucu === s
                          ? s === 'Pozitif' ? 'border-red-500 bg-red-500/15 text-red-400'
                          : s === 'Negatif' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                          : 'border-amber-500 bg-amber-500/15 text-amber-400'
                          : 'border-border bg-card text-foreground hover:border-border-active'
                      }`}>
                      <div className="flex items-center gap-3">
                        {s === 'Pozitif' ? <AlertTriangle className="w-5 h-5" /> :
                         s === 'Negatif' ? <CheckCircle className="w-5 h-5" /> :
                         <XCircle className="w-5 h-5" />}
                        <span className="font-bold text-base">{s}</span>
                      </div>
                      {form.testSonucu === s && <Check className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Bu kayıt personel kimliğinizle imzalanacaktır.</p>
                </div>
              </div>
            )}

            {/* ADIM 8: Tespit & Notlar */}
            {adim === 8 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Tespit ve Notlar</h2>
                {form.testSonucu === 'Pozitif' && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Tespit Edilen Madde
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TESPITLER.map(t => (
                        <button key={t} onClick={() => setField('tespitEdilenMadde', t)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            form.tespitEdilenMadde === t ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-border bg-card text-foreground'
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Notlar (İsteğe bağlı)
                  </label>
                  <textarea
                    value={form.notlar}
                    onChange={e => setField('notlar', e.target.value)}
                    placeholder="Ek gözlemler, özel durumlar..."
                    rows={4}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>
            )}

            {/* ADIM 9: Özet & Tamamla */}
            {adim === 9 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Özet ve Tamamla</h2>
                <div className="glass-card divide-y divide-border/40">
                  {[
                    ['Operasyon No', form.operasyonNo, 'font-mono text-primary'],
                    ['Lokasyon', `${form.lokasyon}`, ''],
                    ['Alt Nokta', form.kontrolNokta, ''],
                    ['Numune Türü', form.numuneTuru, ''],
                    ['Kit Seri No', form.kitSeriNo, 'font-mono'],
                    ['SKT', form.kitSKT, ''],
                    ['Panel Tipi', form.kitPanelTipi, ''],
                    ['Güven Skoru', `%${form.analizGuven}`, ''],
                  ].map(([k, v, c]) => (
                    <div key={k} className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-xs text-muted-foreground flex-shrink-0">{k}</span>
                      <span className={`text-xs font-semibold text-foreground text-right max-w-[60%] truncate ${c}`}>{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-xs text-muted-foreground">Sonuç</span>
                    <span className={`text-sm font-bold ${
                      form.testSonucu === 'Pozitif' ? 'text-red-400' :
                      form.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{form.testSonucu}</span>
                  </div>
                </div>

                {form.testSonucu === 'Pozitif' && (
                  <div className="glass-card p-4 border-red-500/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-400 mb-1">Laboratuvara Sevk</p>
                        <p className="text-xs text-muted-foreground">Pozitif numune laboraTuvara sevk edilsin mi?</p>
                      </div>
                      <button onClick={() => setField('labSevkIstiyor', !form.labSevkIstiyor)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${form.labSevkIstiyor ? 'bg-primary' : 'bg-secondary'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.labSevkIstiyor ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                    {form.labSevkIstiyor && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400">
                        <ChevronRight className="w-3.5 h-3.5" /> Sevk kaydı otomatik oluşturulacak
                      </motion.div>
                    )}
                  </div>
                )}

                <button onClick={handleKaydet}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Kaydı Tamamla
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Button */}
      {adim < 9 && (
        <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-border/20">
          <button
            onClick={() => setAdim(a => a + 1)}
            disabled={!canProceed()}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canProceed()
                ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
            }`}>
            {adim === 5 && !form.fotografVar ? 'Fotoğraf gerekli' :
             adim === 6 && !form.testSonucu ? 'Önce analizi başlat' : 'İleri'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
