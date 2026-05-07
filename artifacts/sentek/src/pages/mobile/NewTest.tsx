import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, MapPin, FlaskConical, Camera, AlertTriangle,
  CheckCircle, XCircle, RotateCcw, Shield, Loader2, ChevronRight, Info, Clock,
  Hash, QrCode, ScanLine, Sparkles, FileDown, Edit3, CameraOff, Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TestSonucu, TestKaydi } from '../../types';
import sentekKitImg from '../../assets/sentek-kit.png';
import { downloadTestRaporu } from '../../lib/pdf/downloadTestRaporu';
import { buildKitOverlayComposite, type PanelOverlay } from '../../lib/kitOverlayComposite';

const ADIMLAR = [
  'Operasyon', 'Numune Türü', 'Açıklama',
  'Kit & Analiz', 'Sonuç', 'Tamamla',
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

function parseKitQR(raw: string): string | null {
  const c = raw.trim();
  if (c.startsWith('SENTEK:KIT:')) return c.replace('SENTEK:KIT:', '');
  if (c.startsWith('SENTEK:')) return c.replace('SENTEK:', '');
  return c;
}

/**
 * Foto adımında deterministik panel paterni üret. Analiz bu paterni okur,
 * yeniden hesaplama yapmaz.
 *
 * Lateral-flow rekabetçi immunoassay konvansiyonu:
 *   - T çizgisi GÖRÜNÜR (T:true) ⇒ panelde madde YOK ⇒ NEGATİF
 *   - T çizgisi YOK (T:false)    ⇒ panelde madde VAR ⇒ POZİTİF
 *   - C çizgisi YOK (C:false)    ⇒ panel GEÇERSİZ
 */
function generatePanelPattern(): PanelOverlay[] {
  const r = Math.random();
  // Varsayılan: tüm paneller C+T (yani 6 panel de NEGATİF)
  const base: PanelOverlay[] = PANEL_POSITIONS.map(p => ({ ...p, T: true, C: true }));
  if (r < 0.08) {
    // Geçersiz: 1-2 panel C kaybetmiş
    const n = Math.random() < 0.6 ? 1 : 2;
    const idxs = pickN(base.length, n);
    idxs.forEach(i => { base[i].C = false; });
  } else if (r < 0.40) {
    // Pozitif: 1 panel — bir panelin T çizgisi kayboldu
    const idx = Math.floor(Math.random() * base.length);
    base[idx].T = false;
  } else if (r < 0.50) {
    // Çoklu pozitif: 2 panel
    const idxs = pickN(base.length, 2);
    idxs.forEach(i => { base[i].T = false; });
  } // else: tüm C+T var → Negatif
  return base;
}

function pickN(max: number, n: number): number[] {
  const out: number[] = [];
  while (out.length < n) {
    const i = Math.floor(Math.random() * max);
    if (!out.includes(i)) out.push(i);
  }
  return out;
}

/**
 * Deterministik AI değerlendirme. Güven skoru yalnız panel paterninden
 * türetilir (rastgele değildir):
 *   - Geçersiz (35-55): 35 + (eksik C * 8) + (eksik T * 3)
 *   - Pozitif  (78-97): 78 + (pozitif panel sayısı * 4) + (eksik T toplamı * 2)
 *   - Negatif  (88-97): 88 + (görünür T sayısı)  →  6 panelde 94
 *  Tüm değerler ilgili aralığa clamp edilir.
 */
function evaluatePattern(panels: PanelOverlay[]): { sonuc: TestSonucu; pozitifPaneller: string[]; guven: number } {
  const eksikC = panels.filter(p => !p.C).length;
  const eksikT = panels.filter(p => p.C && !p.T).length;
  const gorunurT = panels.filter(p => p.C && p.T).length;
  const pozitifPaneller = panels.filter(p => p.C && !p.T).map(p => p.kod);
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  if (eksikC > 0) {
    return { sonuc: 'Geçersiz', pozitifPaneller: [], guven: clamp(35 + eksikC * 8 + eksikT * 3, 35, 55) };
  }
  if (eksikT > 0) {
    return { sonuc: 'Pozitif', pozitifPaneller, guven: clamp(78 + eksikT * 4 + gorunurT * 2, 78, 97) };
  }
  return { sonuc: 'Negatif', pozitifPaneller: [], guven: clamp(88 + gorunurT, 88, 97) };
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

  // QR tarayıcı state
  const [qrMod, setQrMod] = useState<'menu' | 'kamera' | 'manuel'>('menu');
  const [qrKameraIzni, setQrKameraIzni] = useState<'bilinmiyor' | 'verildi' | 'reddedildi'>('bilinmiyor');
  const [qrManuelGiris, setQrManuelGiris] = useState('');
  const [qrHataMesaji, setQrHataMesaji] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<{ reset?: () => void } | null>(null);
  const mountedRef = useRef(true);

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
    qrKaynagi: '' as '' | 'kamera' | 'manuel' | 'demo',
    fotografCekildi: false,
    panelSonuclari: [] as PanelOverlay[],
    fotografOverlayUrl: '',
    aiSonucu: '' as TestSonucu | '',
    aiPozitifPaneller: [] as string[],
    analizGuven: 0,
    testSonucu: '' as TestSonucu | '',
    overrideAciklamasi: '',
    tespitEdilenMadde: '',
    notlar: '',
    labSevkIstiyor: true,
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, []);

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

  // ---- QR / Kit eşleme ----
  const stokEsle = useCallback((qrPayload: string): { ok: boolean; stok?: typeof stoklar[number]; mesaj?: string } => {
    const id = parseKitQR(qrPayload);
    if (!id) return { ok: false, mesaj: 'QR boş veya tanımsız' };
    // Önce stok id, sonra lotSeriNo, sonra panelTipi içerik eşleşmesi
    const stok = stoklar.find(s => s.id === id)
      || stoklar.find(s => s.lotSeriNo === id)
      || stoklar.find(s => `${s.id}`.toUpperCase() === id.toUpperCase());
    if (!stok) return { ok: false, mesaj: `Kit "${id}" stokta bulunamadı` };
    if (stok.kalanAdedi <= 0 || stok.durum === 'Tükendi') return { ok: false, mesaj: 'Bu kit tükenmiş, başka kit kullanın' };
    return { ok: true, stok };
  }, [stoklar]);

  const kitiUygula = (stok: typeof stoklar[number], kaynak: 'kamera' | 'manuel' | 'demo') => {
    setForm(p => ({
      ...p,
      seciliStokId: stok.id,
      kitSeriNo: generateKitSeriNo(stok.lotSeriNo),
      kitSKT: stok.skt,
      kitPanelTipi: stok.panelTipi,
      qrTarandi: true,
      qrKaynagi: kaynak,
      // Otomatik kit görüntü yakalama + analiz, alttaki effect tarafından zincirlenir
      fotografCekildi: false,
      panelSonuclari: [],
      fotografOverlayUrl: '',
      aiSonucu: '',
      aiPozitifPaneller: [],
      analizGuven: 0,
      testSonucu: '',
      overrideAciklamasi: '',
      tespitEdilenMadde: '',
    }));
    setQrHataMesaji('');
    setQrMod('menu');
    stopCamera();
  };

  // Otomatik kit görüntü yakalama: QR doğrulanır doğrulanmaz simüle çekim çalışır
  useEffect(() => {
    if (adim === 3 && form.qrTarandi && !form.fotografCekildi && form.kitSeriNo) {
      void handleFotoCek();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adim, form.qrTarandi, form.fotografCekildi, form.kitSeriNo]);

  // Otomatik AI analiz: kompozit hazırsa hemen başlar
  useEffect(() => {
    if (
      adim === 3 &&
      form.fotografCekildi &&
      form.panelSonuclari.length > 0 &&
      !form.aiSonucu &&
      !analizYapiliyor
    ) {
      handleAnaliz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adim, form.fotografCekildi, form.panelSonuclari.length, form.aiSonucu, analizYapiliyor]);

  // ---- Kamera başlat ----
  const stopCamera = () => {
    if (scannerRef.current) {
      try { scannerRef.current.reset?.(); } catch {}
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const baslatKamera = async () => {
    setQrHataMesaji('');
    setQrMod('kamera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      setQrKameraIzni('verildi');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      scannerRef.current = reader as unknown as { reset?: () => void };
      if (videoRef.current) {
        reader.decodeFromStream(stream, videoRef.current, (result, _err) => {
          if (result && mountedRef.current) {
            const text = result.getText();
            const eslesme = stokEsle(text);
            if (eslesme.ok && eslesme.stok) {
              kitiUygula(eslesme.stok, 'kamera');
            } else {
              setQrHataMesaji(eslesme.mesaj || 'Bu QR sistemde tanımlı değil');
            }
          }
        }).catch(() => {});
      }
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const name = err instanceof Error ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setQrKameraIzni('reddedildi');
        setQrMod('manuel');
      } else {
        setQrHataMesaji('Kamera başlatılamadı, manuel girişi kullanın');
        setQrMod('manuel');
      }
    }
  };

  const handleManuelQRAra = () => {
    if (!qrManuelGiris.trim()) return;
    const eslesme = stokEsle(qrManuelGiris.trim());
    if (eslesme.ok && eslesme.stok) {
      kitiUygula(eslesme.stok, 'manuel');
      setQrManuelGiris('');
    } else {
      setQrHataMesaji(eslesme.mesaj || 'Bu QR sistemde tanımlı değil');
    }
  };

  const handleDemoQR = () => {
    if (availableStok.length === 0) {
      setQrHataMesaji('Stokta uygun kit yok');
      return;
    }
    const stok = availableStok[Math.floor(Math.random() * availableStok.length)];
    kitiUygula(stok, 'demo');
  };

  // ---- FOTO ÇEK: panel paterni + kompozit burada üretilir ----
  const handleFotoCek = async () => {
    const panelSonuclari = generatePanelPattern();
    let composite = '';
    try {
      composite = await buildKitOverlayComposite(panelSonuclari, {
        operasyonNo: form.operasyonNo,
        tarih: new Date().toISOString(),
        personel: kullanici?.ad || 'Saha Personeli',
        kitSeri: form.kitSeriNo,
      });
    } catch (e) {
      console.warn('Kompozit üretilemedi, statik fallback', e);
    }
    setForm(p => ({
      ...p,
      fotografCekildi: true,
      panelSonuclari,
      fotografOverlayUrl: composite,
      // Sonuç ve onay alanları sıfır kalsın — analiz adımında doldurulacak
      aiSonucu: '',
      aiPozitifPaneller: [],
      analizGuven: 0,
      testSonucu: '',
      overrideAciklamasi: '',
      tespitEdilenMadde: '',
    }));
  };

  // ---- AI ANALİZ: sadece okuyup yorumlar ----
  const handleAnaliz = () => {
    if (form.panelSonuclari.length === 0) return;
    setAnalizYapiliyor(true);
    setTimeout(() => {
      const { sonuc, pozitifPaneller, guven } = evaluatePattern(form.panelSonuclari);
      const tespit = pozitifPaneller.length > 0 ? PANEL_MADDELERI[pozitifPaneller[0]] || '' : '';
      setForm(p => ({
        ...p,
        aiSonucu: sonuc,
        aiPozitifPaneller: pozitifPaneller,
        analizGuven: guven,
        testSonucu: sonuc,
        tespitEdilenMadde: tespit,
      }));
      setAnalizYapiliyor(false);
      // Acceptance kriteri: simülasyon tamamlanır tamamlanmaz Sonuç adımına geç
      setAdim(4);
    }, 1500 + Math.floor(Math.random() * 900)); // 1500-2400 ms aralığı
  };

  // ---- KAYDET ----
  const handleKaydet = async () => {
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
      fotografOverlayUrl: form.fotografOverlayUrl || undefined,
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
    if (adim === 2) return true;
    if (adim === 3) return form.qrTarandi && form.fotografCekildi && !!form.aiSonucu && !analizYapiliyor;
    if (adim === 4) return !!form.testSonucu && (!overrideVar || overrideAciklamasiYeterli);
    return true;
  };

  // Kit reset (state temizleme yardımcısı)
  const resetKitVeAnaliz = () => setForm(p => ({
    ...p,
    qrTarandi: false, qrKaynagi: '',
    seciliStokId: '', kitSeriNo: '', kitSKT: '', kitPanelTipi: '',
    fotografCekildi: false, panelSonuclari: [], fotografOverlayUrl: '',
    aiSonucu: '', aiPozitifPaneller: [], analizGuven: 0,
    testSonucu: '', overrideAciklamasi: '', tespitEdilenMadde: '',
  }));

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

        {savedKayit.fotografOverlayUrl && (
          <div className="w-full glass-card p-2 rounded-xl">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Saha Çekim Kaydı</p>
            <img src={savedKayit.fotografOverlayUrl} alt="Kit foto+overlay" className="w-full rounded-lg" />
          </div>
        )}

        <div className="glass-card p-3 w-full text-left">
          <div className="flex items-center gap-2 mb-1">
            <FileDown className="w-4 h-4 text-cyan-400" />
            <p className="text-sm font-semibold text-cyan-400">PDF Raporu</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {pdfIndiriliyor ? 'PDF hazırlanıyor...' : 'Profesyonel rapor (kit foto+overlay dahil) indirildi.'}
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={() => { stopCamera(); adim === 0 ? setLocation('/mobile') : setAdim(a => a - 1); }}
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

            {/* ADIM 0: Operasyon */}
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
                    Şüpheli materyal kayıt akışı — lokasyon ve kontrol noktası saha personelinin profilinden otomatik dolduruldu.
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

            {/* ADIM 2: Açıklama */}
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

            {/* ADIM 3: KIT TARA & ANALİZ — birleşik (QR + foto + AI tek akışta) */}
            {adim === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Kit Tara & Analiz</h2>
                <p className="text-sm text-muted-foreground">Kamera açıldığında kit QR'ı ve panel görüntüsü aynı anda okunur. Sistem otomatik olarak C/T çizgilerini tarar ve sonucu üretir.</p>

                {form.qrTarandi ? (
                  <div className="space-y-3">
                    <div className="glass-card border border-emerald-500/30 p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-emerald-400 font-bold">Kit Tarandı ({form.qrKaynagi}) • {form.kitSeriNo}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{form.kitPanelTipi}</p>
                      </div>
                    </div>

                    {/* KOMPOZİT KİT GÖRÜNTÜSÜ — gerçek C/T kırmızı çizgileri */}
                    <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20">
                      {form.fotografOverlayUrl ? (
                        <img src={form.fotografOverlayUrl} alt="Saha çekim kompozit" className="w-full h-auto block" data-testid="img-kit-foto" />
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center bg-slate-900">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-xs">Kit görüntüsü hazırlanıyor...</p>
                          </div>
                        </div>
                      )}
                      {(analizYapiliyor || !form.fotografCekildi) && form.fotografOverlayUrl && (
                        <>
                          <motion.div initial={{ y: 0 }} animate={{ y: ['0%', '100%', '0%'] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_rgba(0,212,255,0.9)]" />
                          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/5 to-cyan-500/0" />
                        </>
                      )}
                    </div>

                    {(analizYapiliyor || !form.aiSonucu) && (
                      <div className="glass-card p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Görüntü işleniyor</p>
                          <p className="text-xs text-muted-foreground">6 panel C/T çizgileri taranıyor...</p>
                        </div>
                      </div>
                    )}

                    {form.aiSonucu && !analizYapiliyor && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        data-testid="ai-sonuc-card"
                        className={`glass-card p-4 border ${
                          form.aiSonucu === 'Pozitif' ? 'border-red-500/30' :
                          form.aiSonucu === 'Geçersiz' ? 'border-amber-500/30' :
                          'border-emerald-500/30'
                        }`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Analiz Sonucu</p>
                            <p className={`text-xl font-bold mt-1 ${
                              form.aiSonucu === 'Pozitif' ? 'text-red-400' :
                              form.aiSonucu === 'Geçersiz' ? 'text-amber-400' : 'text-emerald-400'
                            }`}>{form.aiSonucu}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Güven</p>
                            <p className="text-2xl font-bold text-foreground">%{form.analizGuven}</p>
                          </div>
                        </div>
                        {form.aiPozitifPaneller.length > 0 && (
                          <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                            Pozitif paneller: <span className="font-bold">{form.aiPozitifPaneller.join(', ')}</span> → {form.aiPozitifPaneller.map(k => PANEL_MADDELERI[k]).join(' / ')}
                          </div>
                        )}
                        {form.aiSonucu === 'Geçersiz' && (
                          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                            Bir veya daha fazla panelde kontrol çizgisi (C) algılanmadı. Kit geçersiz sayılabilir.
                          </div>
                        )}
                        {form.aiSonucu === 'Negatif' && (
                          <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                            Tüm 6 panelde kontrol çizgisi (C) ve test çizgisi (T) belirgin — hiçbir panelde madde tepkisi yok.
                          </div>
                        )}
                      </motion.div>
                    )}

                    <button
                      data-testid="btn-tekrar-tara"
                      onClick={resetKitVeAnaliz}
                      className="w-full py-2.5 text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Tekrar Tara (yeni kit + yeni analiz)
                    </button>
                  </div>
                ) : qrMod === 'kamera' ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-56 h-56 relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                          <motion.div animate={{ y: [0, 192, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                        </div>
                      </div>
                    </div>
                    {qrHataMesaji && (
                      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300">{qrHataMesaji}</p>
                      </div>
                    )}
                    <button onClick={() => { stopCamera(); setQrMod('menu'); }}
                      className="w-full py-3 glass-card border border-card-border rounded-xl text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
                      <CameraOff className="w-4 h-4" /> İptal
                    </button>
                  </div>
                ) : qrMod === 'manuel' ? (
                  <div className="space-y-3">
                    {qrKameraIzni === 'reddedildi' && (
                      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300">Kamera erişimi reddedildi — manuel kod girişini kullanın.</p>
                      </div>
                    )}
                    <div className="glass-card p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-primary" />
                        <p className="text-sm font-bold text-foreground">Manuel Kit QR Girişi</p>
                      </div>
                      <p className="text-xs text-muted-foreground">SENTEK:KIT:&lt;id&gt; veya kit ID'sini doğrudan girin.</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={qrManuelGiris}
                          onChange={e => setQrManuelGiris(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleManuelQRAra()}
                          placeholder="SENTEK:KIT:ST-001 veya ST-001"
                          data-testid="input-manuel-qr"
                          className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60"
                        />
                        <button onClick={handleManuelQRAra} disabled={!qrManuelGiris.trim()}
                          data-testid="btn-manuel-qr-ara"
                          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm disabled:opacity-40">
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                      {qrHataMesaji && (
                        <p className="text-xs text-amber-400">{qrHataMesaji}</p>
                      )}
                    </div>
                    <button onClick={() => setQrMod('menu')}
                      className="w-full py-3 text-xs text-muted-foreground/80">
                      ← Menüye dön
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button data-testid="btn-kamera-tara" onClick={baslatKamera}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                      <Camera className="w-5 h-5" /> Kamerayı Aç (QR + Kit Otomatik Yakala)
                    </button>
                    <button data-testid="btn-manuel-qr-mod" onClick={() => { setQrMod('manuel'); setQrHataMesaji(''); }}
                      className="w-full py-3 glass-card border border-card-border rounded-xl text-sm font-semibold text-foreground flex items-center justify-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" /> Manuel Kod Gir
                    </button>
                    <div className="relative flex items-center gap-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Geliştirme / Sunum</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <button data-testid="btn-demo-qr" onClick={handleDemoQR}
                      className="w-full py-3 bg-secondary text-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                      <ScanLine className="w-4 h-4 text-primary" /> Demo QR Kullan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ADIM 4: SONUÇ + OVERRIDE */}
            {adim === 4 && (
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
                    }`}>{form.aiSonucu} — %{form.analizGuven} güven</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Yetkili olarak sonucu onaylayın veya değiştirin:</p>
                <div className="space-y-2">
                  {(['Pozitif', 'Negatif', 'Geçersiz'] as TestSonucu[]).map(s => (
                    <button key={s} onClick={() => {
                      setField('testSonucu', s);
                      if (s !== 'Pozitif') setField('tespitEdilenMadde', '');
                    }}
                      data-testid={`btn-sonuc-${s}`}
                      className={`w-full py-3.5 rounded-xl border-2 flex items-center justify-between px-4 transition-all ${
                        form.testSonucu === s
                          ? s === 'Pozitif' ? 'border-red-500 bg-red-500/15 text-red-400'
                          : s === 'Negatif' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                          : 'border-amber-500 bg-amber-500/15 text-amber-400'
                          : 'border-border bg-card text-foreground'
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

                {overrideVar && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="glass-card p-4 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <p className="text-sm font-bold text-amber-400">AI Önerisini Değiştirdiniz</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI önerisi <span className="font-bold">{form.aiSonucu}</span>, siz <span className="font-bold">{form.testSonucu}</span> seçtiniz. Lütfen gerekçenizi yazın (en az 10 karakter):
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

            {/* ADIM 5: TESPİT + NOTLAR + TAMAMLA */}
            {adim === 5 && (
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
                  <textarea value={form.notlar} onChange={e => setField('notlar', e.target.value)}
                    placeholder="Ek gözlemler, özel durumlar..." rows={3}
                    data-testid="input-notlar"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60" />
                </div>

                <div className="glass-card divide-y divide-border/40">
                  {[
                    ['Operasyon', form.operasyonNo],
                    ['Lokasyon', `${form.lokasyon} / ${form.kontrolNokta}`],
                    ['Numune', form.numuneTuru],
                    ['Kit', `${form.kitSeriNo} (${form.qrKaynagi})`],
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
                      <button data-testid="toggle-lab-sevk"
                        onClick={() => setField('labSevkIstiyor', !form.labSevkIstiyor)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${form.labSevkIstiyor ? 'bg-primary' : 'bg-secondary'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.labSevkIstiyor ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                )}

                <button data-testid="btn-kaydi-tamamla" onClick={handleKaydet}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Kaydı Tamamla & PDF İndir
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      {adim < 5 && (
        <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-border/20">
          <button data-testid="btn-ileri" onClick={() => setAdim(a => a + 1)} disabled={!canProceed()}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canProceed() ? 'bg-primary text-primary-foreground active:scale-[0.98]'
              : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
            }`}>
            {adim === 3 && !form.qrTarandi ? 'Önce kit QR tara' :
             adim === 3 && analizYapiliyor ? 'Analiz devam ediyor...' :
             adim === 3 && !form.aiSonucu ? 'AI analizi bekleniyor' :
             adim === 4 && overrideVar && !overrideAciklamasiYeterli ? 'Override gerekçesi gerekli' :
             'İleri'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
