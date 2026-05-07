import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, MapPin, FlaskConical, Camera, AlertTriangle,
  CheckCircle, XCircle, RotateCcw, Shield, Loader2, ChevronRight, Info, Clock,
  Hash, QrCode, ScanLine, Sparkles, FileDown, Edit3,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TestSonucu, TestKaydi } from '../../types';
import sentekKitImg from '../../assets/sentek-kit.png';
import { downloadTestRaporu } from '../../lib/pdf/downloadTestRaporu';

const ADIMLAR = [
  'Operasyon', 'Numune Türü', 'Açıklama',
  'Kit QR', 'Foto & AI', 'Sonuç', 'Tamamla',
];

const NUMUNE_TURLERI = [
  'Toz madde', 'Sıvı numune', 'Emdirilmiş kumaş', 'Emdirilmiş pamuk',
  'Emdirilmiş kağıt', 'Araç içi yüzey sürüntüsü', 'Konteyner yüzeyi',
  'Bagaj / eşya içi numune', 'Paket / koli içeriği', 'Diğer',
];

const TESPITLER = [
  'Kokain', 'Eroin türevi', 'Metamfetamin', 'Amfetamin grubu',
  'Esrar türevi', 'Fentanil türevi', 'GHB benzeri madde',
  'MDMA / Ekstazi', 'Buprenorfin türevi', 'Bilinmeyen madde',
];

const PANEL_MADDELERI: Record<string, string> = {
  AMP: 'Amfetamin grubu', THC: 'Esrar türevi', COC: 'Kokain',
  MET: 'Metamfetamin', MOP: 'Eroin türevi', MBP: 'Buprenorfin türevi',
};

interface PanelOverlay { kod: string; pos: { left: string; top: string }; T: boolean; C: boolean }

const PANEL_POSITIONS: Array<{ kod: string; pos: { left: string; top: string } }> = [
  { kod: 'AMP', pos: { left: '12%', top: '38%' } },
  { kod: 'THC', pos: { left: '38%', top: '38%' } },
  { kod: 'COC', pos: { left: '64%', top: '38%' } },
  { kod: 'MET', pos: { left: '12%', top: '70%' } },
  { kod: 'MOP', pos: { left: '38%', top: '70%' } },
  { kod: 'MBP', pos: { left: '64%', top: '70%' } },
];

function generateOpNo() {
  const n = 200 + Math.floor(Math.random() * 99);
  return `OPS-2026-0${n}`;
}

function generateKitSeriNo(lotSeriNo: string) {
  const n = String(Math.floor(Math.random() * 900) + 100);
  return `${lotSeriNo}-K${n}`;
}

export default function NewTest() {
  const [, setLocation] = useLocation();
  const { kullanici } = useAuth();
  const { testKaydiEkle, labSevkEkle, stoklar } = useData();

  const [adim, setAdim] = useState(0);
  const [analizYapiliyor, setAnalizYapiliyor] = useState(false);
  const [kaydedildi, setKaydedildi] = useState(false);
  const [savedKayit, setSavedKayit] = useState<TestKaydi | null>(null);
  const [pdfIndiriliyor, setPdfIndiriliyor] = useState(false);

  const [form, setForm] = useState({
    operasyonNo: generateOpNo(),
    lokasyon: kullanici?.varsayilanLokasyon || 'Saha Operasyon Noktası',
    kontrolNokta: kullanici?.varsayilanKontrolNokta || 'Sahada',
    numuneTuru: '',
    sahisAciklamasi: '',
    seciliStokId: '',
    kitSeriNo: '',
    kitSKT: '',
    kitPanelTipi: '',
    qrTarandi: false,
    fotografCekildi: false,
    panelSonuclari: [] as PanelOverlay[],
    aiSonucu: '' as TestSonucu | '',
    aiPozitifPanel: '',
    analizGuven: 0,
    testSonucu: '' as TestSonucu | '',
    overrideAciklamasi: '',
    tespitEdilenMadde: '',
    notlar: '',
    labSevkIstiyor: true,
  });

  // Saha personeli için lokasyon kişisel ataması (login sonrası gelmemişse de güncelle)
  useEffect(() => {
    if (kullanici?.varsayilanLokasyon && !form.lokasyon.includes(kullanici.varsayilanLokasyon)) {
      setForm(p => ({
        ...p,
        lokasyon: kullanici.varsayilanLokasyon!,
        kontrolNokta: kullanici.varsayilanKontrolNokta || p.kontrolNokta,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kullanici?.id]);

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const availableStok = useMemo(
    () => stoklar.filter(s => s.kalanAdedi > 0 && s.durum !== 'Tükendi' && !s.panelTipi.includes('Sarf')),
    [stoklar]
  );

  // ---- DEMO QR KULLAN ----
  const handleDemoQR = () => {
    if (availableStok.length === 0) return;
    const stok = availableStok[Math.floor(Math.random() * availableStok.length)];
    setForm(p => ({
      ...p,
      seciliStokId: stok.id,
      kitSeriNo: generateKitSeriNo(stok.lotSeriNo),
      kitSKT: stok.skt,
      kitPanelTipi: stok.panelTipi,
      qrTarandi: true,
    }));
  };

  // ---- FOTO ÇEK ----
  const handleFotoCek = () => setField('fotografCekildi', true);

  // ---- AI ANALİZ ----
  const handleAnaliz = () => {
    setAnalizYapiliyor(true);
    setTimeout(() => {
      const r = Math.random();
      let aiSonuc: TestSonucu;
      let pozitifPanel = '';
      let panelSonuclari: PanelOverlay[] = PANEL_POSITIONS.map(p => ({ ...p, T: false, C: true }));
      let guven = 0;

      if (r < 0.1) {
        // Geçersiz: bir panel C kaybetmiş
        aiSonuc = 'Geçersiz';
        const idx = Math.floor(Math.random() * panelSonuclari.length);
        panelSonuclari[idx].C = false;
        guven = 35 + Math.floor(Math.random() * 21);
      } else if (r < 0.45) {
        // Pozitif
        aiSonuc = 'Pozitif';
        const idx = Math.floor(Math.random() * panelSonuclari.length);
        panelSonuclari[idx].T = true;
        pozitifPanel = panelSonuclari[idx].kod;
        guven = 80 + Math.floor(Math.random() * 16);
      } else {
        // Negatif
        aiSonuc = 'Negatif';
        guven = 88 + Math.floor(Math.random() * 10);
      }

      const tespit = pozitifPanel ? PANEL_MADDELERI[pozitifPanel] : '';

      setForm(p => ({
        ...p,
        panelSonuclari,
        aiSonucu: aiSonuc,
        aiPozitifPanel: pozitifPanel,
        analizGuven: guven,
        testSonucu: aiSonuc,
        tespitEdilenMadde: tespit,
      }));
      setAnalizYapiliyor(false);
    }, 1900);
  };

  // ---- KAYDET ----
  const handleKaydet = async () => {
    // Son güvenlik: invariantlar
    if (!form.numuneTuru || !form.qrTarandi || !form.kitSeriNo || !form.aiSonucu || !form.testSonucu) {
      console.warn('[SENTEK] Eksik kayıt — kayıt iptal edildi', form);
      return;
    }
    const overrideVar = form.aiSonucu !== form.testSonucu;
    if (overrideVar && form.overrideAciklamasi.trim().length < 10) {
      console.warn('[SENTEK] Override için yetersiz açıklama — kayıt iptal edildi');
      return;
    }
    const yeniTest = await testKaydiEkle({
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
      personelAdi: kullanici?.ad || 'Saha Personeli',
      analizGuvenSkoru: form.analizGuven,
      stokId: form.seciliStokId || undefined,
      aiOnerisi: form.aiSonucu as TestSonucu,
      kullaniciOverrideAciklamasi: overrideVar ? form.overrideAciklamasi : undefined,
    }, form.seciliStokId || undefined);

    if (form.labSevkIstiyor && form.testSonucu === 'Pozitif') {
      await labSevkEkle({
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
    setSavedKayit(yeniTest);
    setKaydedildi(true);

    // PDF'i otomatik indirmeyi tetikle
    setPdfIndiriliyor(true);
    try {
      await downloadTestRaporu(yeniTest);
    } catch (e) {
      console.error('PDF indirme hatası', e);
    } finally {
      setPdfIndiriliyor(false);
    }
  };

  const overrideVar = !!form.aiSonucu && form.aiSonucu !== form.testSonucu;
  const overrideAciklamasiYeterli = form.overrideAciklamasi.trim().length >= 10;

  const canProceed = () => {
    if (adim === 0) return true;
    if (adim === 1) return !!form.numuneTuru;
    if (adim === 2) return true; // açıklama isteğe bağlı
    if (adim === 3) return form.qrTarandi && !!form.kitSeriNo;
    if (adim === 4) return form.fotografCekildi && !!form.aiSonucu && !analizYapiliyor;
    if (adim === 5) return !!form.testSonucu && (!overrideVar || overrideAciklamasiYeterli);
    return true;
  };

  // ---------- BAŞARI EKRANI ----------
  if (kaydedildi && savedKayit) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-4 text-center overflow-y-auto py-8">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
            savedKayit.testSonucu === 'Pozitif' ? 'bg-red-500/20 border-red-500' :
            savedKayit.testSonucu === 'Geçersiz' ? 'bg-amber-500/20 border-amber-500' :
            'bg-emerald-500/20 border-emerald-500'
          }`}
          data-testid="badge-sonuc"
        >
          {savedKayit.testSonucu === 'Geçersiz' ? <AlertTriangle className="w-8 h-8 text-amber-400" /> :
           savedKayit.testSonucu === 'Pozitif' ? <AlertTriangle className="w-8 h-8 text-red-400" /> :
           <CheckCircle className="w-8 h-8 text-emerald-400" />}
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Kayıt Tamamlandı</h2>
          <p className="text-sm text-muted-foreground font-mono">{savedKayit.operasyonNo}</p>
          <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            savedKayit.testSonucu === 'Pozitif' ? 'bg-red-500/20 text-red-400' :
            savedKayit.testSonucu === 'Geçersiz' ? 'bg-amber-500/20 text-amber-400' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            {savedKayit.testSonucu === 'Pozitif' ? 'POZİTİF SONUÇ' : savedKayit.testSonucu === 'Geçersiz' ? 'GEÇERSİZ' : 'NEGATİF SONUÇ'}
          </div>
        </div>

        <div className="glass-card p-3 w-full text-left">
          <div className="flex items-center gap-2 mb-1">
            <FileDown className="w-4 h-4 text-cyan-400" />
            <p className="text-sm font-semibold text-cyan-400">PDF Raporu</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {pdfIndiriliyor ? 'PDF hazırlanıyor...' : 'Profesyonel rapor indirildi. Tekrar indirmek için aşağıdaki butona basın.'}
          </p>
        </div>

        {savedKayit.testSonucu === 'Pozitif' && form.labSevkIstiyor && (
          <div className="glass-card p-3 w-full text-left">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <p className="text-sm font-semibold text-cyan-400">Lab Sevk Oluşturuldu</p>
            </div>
            <p className="text-xs text-muted-foreground">Numune laboratuvar takip sistemine eklendi.</p>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <button
            data-testid="btn-pdf-indir"
            onClick={() => downloadTestRaporu(savedKayit)}
            disabled={pdfIndiriliyor}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" /> {pdfIndiriliyor ? 'Hazırlanıyor...' : 'PDF Raporu İndir'}
          </button>
          <button onClick={() => setLocation('/mobile/kayitlarim')}
            className="w-full py-3 glass-card border border-card-border text-foreground rounded-xl font-semibold text-sm">
            Kayıtlarımı Gör
          </button>
          <button onClick={() => setLocation('/mobile')}
            className="w-full py-3 text-muted-foreground rounded-xl text-sm">
            Ana Sayfa
          </button>
        </div>
      </div>
    );
  }

  // ---------- ADIM EKRANLARI ----------
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={() => adim === 0 ? setLocation('/mobile') : setAdim(a => a - 1)}
          data-testid="btn-geri"
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

            {/* ADIM 0: Operasyon (lokasyon otomatik personelden) */}
            {adim === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Operasyon Bilgisi</h2>
                <div className="glass-card p-4 divide-y divide-border/50">
                  {[
                    { icon: Hash, label: 'Operasyon No', val: form.operasyonNo, cls: 'font-mono text-primary font-bold' },
                    { icon: Clock, label: 'Tarih / Saat', val: new Date().toLocaleString('tr-TR'), cls: '' },
                    { icon: Shield, label: 'Personel', val: kullanici?.ad || 'Saha Personeli', cls: '' },
                    { icon: MapPin, label: 'Lokasyon', val: form.lokasyon, cls: 'text-emerald-400 font-semibold' },
                    { icon: ChevronRight, label: 'Kontrol Noktası', val: form.kontrolNokta, cls: '' },
                  ].map(({ icon: Icon, label, val, cls }) => (
                    <div key={label} className="flex items-center gap-3 py-3" data-testid={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={`text-sm ${cls || 'text-foreground font-medium'}`}>{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Lokasyon ve kontrol noktası, atanan göreviniz baz alınarak otomatik dolduruldu. Devam etmek için İleri'ye basın.
                  </p>
                </div>
              </div>
            )}

            {/* ADIM 1: Numune Türü */}
            {adim === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Numune Türü</h2>
                <p className="text-sm text-muted-foreground">Şüpheli materyalin türünü seçin.</p>
                <div className="space-y-2">
                  {NUMUNE_TURLERI.map(t => (
                    <button key={t} onClick={() => setField('numuneTuru', t)}
                      data-testid={`numune-${t}`}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        form.numuneTuru === t ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADIM 2: Açıklama (opsiyonel) */}
            {adim === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Materyal Açıklaması</h2>
                <p className="text-sm text-muted-foreground">İsteğe bağlı — şüpheli materyali kısaca açıklayın.</p>
                <textarea
                  value={form.sahisAciklamasi}
                  onChange={e => setField('sahisAciklamasi', e.target.value)}
                  placeholder="Örn: TIR gövdesinde gizli bölme içi beyaz kristal toz..."
                  rows={5}
                  data-testid="input-aciklama"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60"
                />
                <p className="text-xs text-muted-foreground/60">
                  {form.sahisAciklamasi.length} karakter — bu adım atlanabilir
                </p>
              </div>
            )}

            {/* ADIM 3: KIT QR */}
            {adim === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Kit QR Tara</h2>
                <p className="text-sm text-muted-foreground">Test kiti üzerindeki QR kodu kameradan okutun veya demo kit kullanın.</p>

                {!form.qrTarandi ? (
                  <>
                    <div className="glass-card rounded-2xl border border-card-border p-6 flex flex-col items-center gap-4">
                      <div className="relative w-44 h-44 rounded-2xl bg-background/60 border border-primary/30 overflow-hidden flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-primary/30" />
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                        <motion.div
                          animate={{ y: [0, 140, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">QR'ı çerçevenin içine alın</p>
                    </div>

                    <button
                      data-testid="btn-demo-qr"
                      onClick={handleDemoQR}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <ScanLine className="w-4 h-4" /> Demo QR Kullan
                    </button>

                    <p className="text-xs text-muted-foreground/60 text-center">Demo modunda stoktan bir kit otomatik atanır</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="glass-card border border-emerald-500/30 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-emerald-400 font-bold">Kit Tarandı</p>
                        <p className="text-xs text-muted-foreground truncate">{form.kitPanelTipi}</p>
                      </div>
                    </div>
                    <div className="glass-card p-4 space-y-2.5">
                      {[
                        ['Kit Seri No', form.kitSeriNo, 'font-mono text-primary'],
                        ['Panel Tipi', form.kitPanelTipi, ''],
                        ['SKT', form.kitSKT, ''],
                      ].map(([k, v, c]) => (
                        <div key={k} className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <span className={`text-xs font-semibold text-foreground text-right ${c} max-w-[60%] truncate`}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setForm(p => ({
                        ...p,
                        qrTarandi: false, kitSeriNo: '', kitSKT: '', kitPanelTipi: '', seciliStokId: '',
                        // Kit değişince tüm analiz/sonuç state'i sıfırlansın — eski sonuç yeni kite yapışmasın
                        fotografCekildi: false,
                        panelSonuclari: [],
                        aiSonucu: '',
                        aiPozitifPanel: '',
                        analizGuven: 0,
                        testSonucu: '',
                        overrideAciklamasi: '',
                        tespitEdilenMadde: '',
                      }))}
                      className="w-full py-2.5 text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Tekrar Tara
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ADIM 4: FOTO + AI */}
            {adim === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Fotoğraf & AI Analizi</h2>

                {!form.fotografCekildi ? (
                  <>
                    <p className="text-sm text-muted-foreground">Kit fotoğrafını çekerek AI analizini başlatın.</p>
                    <button
                      data-testid="btn-foto-cek"
                      onClick={handleFotoCek}
                      className="w-full h-44 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <Camera className="w-7 h-7 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">Fotoğraf Çek</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Kit ve numuneyi çerçeveleyin</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    {/* KİT FOTO + Overlay */}
                    <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20">
                      <img src={sentekKitImg} alt="SENTEK Kit" className="w-full h-auto block" data-testid="img-kit-foto" />
                      {/* Tarama overlay */}
                      {analizYapiliyor && (
                        <>
                          <motion.div
                            initial={{ y: 0 }} animate={{ y: ['0%', '100%', '0%'] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_rgba(0,212,255,0.9)]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/5 to-cyan-500/0" />
                        </>
                      )}
                      {/* Panel sonuçlarını overlay et */}
                      {!analizYapiliyor && form.panelSonuclari.length > 0 && form.panelSonuclari.map(p => (
                        <motion.div
                          key={p.kod}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute"
                          style={{ left: p.pos.left, top: p.pos.top, transform: 'translate(-50%, -50%)' }}
                        >
                          <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border backdrop-blur-sm ${
                            !p.C ? 'bg-amber-500/80 text-white border-amber-300' :
                            p.T ? 'bg-red-500/85 text-white border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.7)]' :
                            'bg-emerald-500/70 text-white border-emerald-300'
                          }`}>
                            {p.kod} {!p.C ? '⚠' : p.T ? '+' : '−'}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {!form.aiSonucu && !analizYapiliyor && (
                      <button
                        data-testid="btn-analiz-baslat"
                        onClick={handleAnaliz}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" /> AI Analizini Başlat
                      </button>
                    )}

                    {analizYapiliyor && (
                      <div className="glass-card p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">Görüntü işleniyor</p>
                            <p className="text-xs text-muted-foreground">6 panel taranıyor...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {form.aiSonucu && !analizYapiliyor && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        data-testid="ai-sonuc-card"
                        className={`glass-card p-4 border ${
                          form.aiSonucu === 'Pozitif' ? 'border-red-500/30' :
                          form.aiSonucu === 'Geçersiz' ? 'border-amber-500/30' :
                          'border-emerald-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Analiz Sonucu</p>
                            <p className={`text-xl font-bold mt-1 ${
                              form.aiSonucu === 'Pozitif' ? 'text-red-400' :
                              form.aiSonucu === 'Geçersiz' ? 'text-amber-400' :
                              'text-emerald-400'
                            }`}>
                              {form.aiSonucu}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Güven</p>
                            <p className="text-2xl font-bold text-foreground">%{form.analizGuven}</p>
                          </div>
                        </div>
                        {form.aiPozitifPanel && (
                          <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                            Tespit edilen panel: <span className="font-bold">{form.aiPozitifPanel}</span> → {PANEL_MADDELERI[form.aiPozitifPanel]}
                          </div>
                        )}
                        {form.aiSonucu === 'Geçersiz' && (
                          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                            Bir veya daha fazla panelde kontrol çizgisi (C) algılanmadı. Kit geçersiz sayılabilir.
                          </div>
                        )}
                        {form.aiSonucu === 'Negatif' && (
                          <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                            Tüm 6 panelde kontrol çizgisi belirgin, hiçbirinde test çizgisi yok.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ADIM 5: SONUÇ DOĞRULAMA + OVERRIDE */}
            {adim === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Sonucu Doğrula</h2>

                <div className="glass-card p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    form.aiSonucu === 'Pozitif' ? 'bg-red-500/15' :
                    form.aiSonucu === 'Geçersiz' ? 'bg-amber-500/15' : 'bg-emerald-500/15'
                  }`}>
                    <Sparkles className={`w-4 h-4 ${
                      form.aiSonucu === 'Pozitif' ? 'text-red-400' :
                      form.aiSonucu === 'Geçersiz' ? 'text-amber-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">AI Önerisi</p>
                    <p className={`text-sm font-bold ${
                      form.aiSonucu === 'Pozitif' ? 'text-red-400' :
                      form.aiSonucu === 'Geçersiz' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {form.aiSonucu} — %{form.analizGuven} güven
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Yetkili olarak sonucu onaylayın veya değiştirin:</p>
                <div className="space-y-2">
                  {(['Pozitif', 'Negatif', 'Geçersiz'] as TestSonucu[]).map(s => (
                    <button key={s} onClick={() => {
                      setField('testSonucu', s);
                      // Override aktive olunca tespit otomatik temizlensin (negatif/geçersizde madde olmaz)
                      if (s !== 'Pozitif') setField('tespitEdilenMadde', '');
                    }}
                      data-testid={`btn-sonuc-${s}`}
                      className={`w-full py-3.5 rounded-xl border-2 flex items-center justify-between px-4 transition-all ${
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
                        <span className="font-bold text-sm">{s}</span>
                        {form.aiSonucu === s && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
                        )}
                      </div>
                      {form.testSonucu === s && <Check className="w-5 h-5" />}
                    </button>
                  ))}
                </div>

                {/* Override açıklama alanı */}
                {overrideVar && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="glass-card p-4 border border-amber-500/30 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <p className="text-sm font-bold text-amber-400">AI Önerisini Değiştirdiniz</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI önerisi <span className="font-bold">{form.aiSonucu}</span> idi, siz <span className="font-bold">{form.testSonucu}</span> olarak işaretlediniz. Lütfen gerekçenizi yazın (en az 10 karakter):
                    </p>
                    <textarea
                      value={form.overrideAciklamasi}
                      onChange={e => setField('overrideAciklamasi', e.target.value)}
                      placeholder="Örn: Test çizgisi gözle net görülüyor ancak AI algılayamadı..."
                      rows={3}
                      data-testid="input-override-aciklama"
                      className="w-full bg-background border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-amber-400"
                    />
                    <p className={`text-xs ${overrideAciklamasiYeterli ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {form.overrideAciklamasi.trim().length} / en az 10 karakter
                    </p>
                  </motion.div>
                )}

                <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Bu kayıt personel kimliğinizle imzalanır ve PDF olarak arşivlenir.</p>
                </div>
              </div>
            )}

            {/* ADIM 6: TESPİT + NOTLAR + TAMAMLA */}
            {adim === 6 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Tespit, Notlar ve Tamamlama</h2>

                {form.testSonucu === 'Pozitif' && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Tespit Edilen Madde
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TESPITLER.map(t => (
                        <button key={t} onClick={() => setField('tespitEdilenMadde', t)}
                          data-testid={`tespit-${t}`}
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
                    Saha Notları (İsteğe bağlı)
                  </label>
                  <textarea
                    value={form.notlar}
                    onChange={e => setField('notlar', e.target.value)}
                    placeholder="Ek gözlemler, özel durumlar..."
                    rows={3}
                    data-testid="input-notlar"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60"
                  />
                </div>

                {/* Özet */}
                <div className="glass-card divide-y divide-border/40">
                  {[
                    ['Operasyon', form.operasyonNo],
                    ['Lokasyon', `${form.lokasyon} / ${form.kontrolNokta}`],
                    ['Numune', form.numuneTuru],
                    ['Kit', form.kitSeriNo],
                    ['AI Sonuç', `${form.aiSonucu} (%${form.analizGuven})`],
                    ['Onay Sonuç', form.testSonucu],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-xs text-muted-foreground">{k}</span>
                      <span className="text-xs font-semibold text-foreground text-right max-w-[60%] truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {form.testSonucu === 'Pozitif' && (
                  <div className="glass-card p-4 border border-red-500/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-400 mb-1">Laboratuvara Sevk</p>
                        <p className="text-xs text-muted-foreground">Pozitif numune laboratuvara sevk edilsin mi?</p>
                      </div>
                      <button
                        data-testid="toggle-lab-sevk"
                        onClick={() => setField('labSevkIstiyor', !form.labSevkIstiyor)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${form.labSevkIstiyor ? 'bg-primary' : 'bg-secondary'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.labSevkIstiyor ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  data-testid="btn-kaydi-tamamla"
                  onClick={handleKaydet}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Kaydı Tamamla & PDF İndir
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      {adim < 6 && (
        <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-border/20">
          <button
            data-testid="btn-ileri"
            onClick={() => setAdim(a => a + 1)}
            disabled={!canProceed()}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canProceed()
                ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
            }`}
          >
            {adim === 3 && !form.qrTarandi ? 'Önce QR tara' :
             adim === 4 && !form.fotografCekildi ? 'Önce fotoğraf çek' :
             adim === 4 && !form.aiSonucu ? 'AI analizini başlat' :
             adim === 5 && overrideVar && !overrideAciklamasiYeterli ? 'Override gerekçesi gerekli' :
             'İleri'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
