import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, CameraOff, QrCode, Search, AlertTriangle, CheckCircle, Flashlight, Hash } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

type TaramaState = 'bekliyor' | 'tarama' | 'basari' | 'bulunamadi' | 'hata';

function parseSentekQR(raw: string): { tur: 'TEST' | 'LAB' | 'KIT' | null; id: string } {
  const clean = raw.trim();
  if (clean.startsWith('SENTEK:TEST:')) return { tur: 'TEST', id: clean.replace('SENTEK:TEST:', '') };
  if (clean.startsWith('SENTEK:LAB:')) return { tur: 'LAB', id: clean.replace('SENTEK:LAB:', '') };
  if (clean.startsWith('SENTEK:KIT:')) return { tur: 'KIT', id: clean.replace('SENTEK:KIT:', '') };
  if (clean.startsWith('SENTEK:TR-') || clean.startsWith('TR-')) return { tur: 'TEST', id: clean.replace('SENTEK:', '') };
  if (clean.startsWith('SENTEK:LS-') || clean.startsWith('LS-')) return { tur: 'LAB', id: clean.replace('SENTEK:', '') };
  return { tur: null, id: clean };
}

export default function QRTara() {
  const [, setLocation] = useLocation();
  const { testKayitlari, labSevkler } = useData();
  const [state, setState] = useState<TaramaState>('bekliyor');
  const [kameraIzni, setKameraIzni] = useState<'bilinmiyor' | 'verildi' | 'reddedildi'>('bilinmiyor');
  const [sonTaranan, setSonTaranan] = useState<string>('');
  const [manuelGiris, setManuelGiris] = useState('');
  const [manuelMod, setManuelMod] = useState(false);
  const [bulunanKayit, setBulunanKayit] = useState<{ tur: string; id: string; baslik: string; yol: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (scannerRef.current) {
      try { scannerRef.current.reset(); } catch {}
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleTarananKod = useCallback((kod: string) => {
    if (!mountedRef.current) return;
    setSonTaranan(kod);
    araKayit(kod);
  }, [testKayitlari, labSevkler]);

  const araKayit = (kod: string) => {
    const { tur, id } = parseSentekQR(kod);

    if (tur === 'TEST' || (!tur && id.startsWith('TR-'))) {
      const kayit = testKayitlari.find(t => t.id === id || t.operasyonNo === id);
      if (kayit) {
        setBulunanKayit({ tur: 'Test Kaydı', id: kayit.id, baslik: `${kayit.operasyonNo} — ${kayit.lokasyon}`, yol: '/panel/test-kayitlari' });
        setState('basari');
        return;
      }
    }

    if (tur === 'LAB' || (!tur && id.startsWith('LS-'))) {
      const sevk = labSevkler.find(s => s.id === id || s.numuneTakipNo === id);
      if (sevk) {
        setBulunanKayit({ tur: 'Lab Sevk', id: sevk.id, baslik: `${sevk.numuneTakipNo} — ${sevk.durum}`, yol: '/panel/lab-sevk' });
        setState('basari');
        return;
      }
    }

    const testFallback = testKayitlari.find(t => t.id === id || t.operasyonNo === id || t.kitSeriNo === id);
    if (testFallback) {
      setBulunanKayit({ tur: 'Test Kaydı', id: testFallback.id, baslik: `${testFallback.operasyonNo} — ${testFallback.lokasyon}`, yol: '/panel/test-kayitlari' });
      setState('basari');
      return;
    }

    setState('bulunamadi');
  };

  const baslatKamera = async () => {
    setState('tarama');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      setKameraIzni('verildi');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      scannerRef.current = reader;

      if (videoRef.current) {
        reader.decodeFromStream(stream, videoRef.current, (result: any) => {
          if (result && mountedRef.current) {
            stopCamera();
            handleTarananKod(result.getText());
          }
        }).catch(() => {});
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setKameraIzni('reddedildi');
        setManuelMod(true);
      }
      setState('hata');
    }
  };

  const handleManuelAra = () => {
    if (!manuelGiris.trim()) return;
    araKayit(manuelGiris.trim());
  };

  const tekrarTara = () => {
    setState('bekliyor');
    setBulunanKayit(null);
    setSonTaranan('');
    setManuelGiris('');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => { stopCamera(); setLocation('/mobile'); }} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground">QR / Barkod Tara</h1>
          <p className="text-xs text-muted-foreground">Kayıt kodunu tara veya girin</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        <AnimatePresence mode="wait">

          {state === 'bekliyor' && !manuelMod && (
            <motion.div key="bekliyor" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="glass-card rounded-2xl border border-card-border p-8 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">Kamera ile Tara</p>
                  <p className="text-xs text-muted-foreground mt-1">Test kaydı, lab sevk veya kit QR kodunu kameranıza gösterin</p>
                </div>
                <button
                  onClick={baslatKamera}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  <Camera className="w-5 h-5" />
                  Kamerayı Başlat
                </button>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground/60">veya</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={() => setManuelMod(true)}
                className="w-full py-3 glass-card border border-card-border rounded-xl text-sm font-semibold text-foreground flex items-center justify-center gap-2"
              >
                <Hash className="w-4 h-4 text-muted-foreground" />
                Manuel Kod Girişi
              </button>
            </motion.div>
          )}

          {state === 'tarama' && (
            <motion.div key="tarama" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                    <motion.div
                      animate={{ y: [0, 192, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <span className="text-xs text-white/70 bg-black/50 px-3 py-1.5 rounded-full">QR kodu çerçevenin içine alın</span>
                </div>
              </div>

              <button
                onClick={() => { stopCamera(); setState('bekliyor'); }}
                className="w-full py-3 glass-card border border-card-border rounded-xl text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2"
              >
                <CameraOff className="w-4 h-4" />
                İptal
              </button>

              <button
                onClick={() => { stopCamera(); setManuelMod(true); setState('bekliyor'); }}
                className="w-full py-2.5 text-xs text-primary/70 text-center"
              >
                Manuel giriş yap →
              </button>
            </motion.div>
          )}

          {(state === 'hata' || manuelMod) && (
            <motion.div key="manuel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {kameraIzni === 'reddedildi' && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-400">Kamera erişimi reddedildi</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Tarayıcı ayarlarından kamera iznini etkinleştirin veya aşağıdan manuel kod girişi yapın.</p>
                  </div>
                </div>
              )}

              <div className="glass-card rounded-2xl border border-card-border p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" />
                  <p className="text-sm font-bold text-foreground">Manuel Kod Girişi</p>
                </div>
                <p className="text-xs text-muted-foreground">Kayıt ID, operasyon numarası veya QR içeriğini girin</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manuelGiris}
                    onChange={e => setManuelGiris(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleManuelAra()}
                    placeholder="TR-001, OPS-2026-0142, SNT-LAB-..."
                    className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60"
                  />
                  <button
                    onClick={handleManuelAra}
                    disabled={!manuelGiris.trim()}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm disabled:opacity-40"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {kameraIzni !== 'reddedildi' && (
                <button
                  onClick={() => { setManuelMod(false); baslatKamera(); }}
                  className="w-full py-3 glass-card border border-card-border rounded-xl text-sm font-semibold text-foreground flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Kamerayı Tekrar Dene
                </button>
              )}
            </motion.div>
          )}

          {state === 'basari' && bulunanKayit && (
            <motion.div key="basari" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">Kayıt Bulundu</p>
                  <p className="text-xs text-muted-foreground mt-1">{bulunanKayit.tur}</p>
                </div>
              </div>

              <div className="glass-card rounded-xl border border-emerald-500/20 p-4 space-y-2">
                <p className="text-xs text-muted-foreground/60">Bulunan Kayıt</p>
                <p className="text-sm font-bold text-foreground">{bulunanKayit.baslik}</p>
                <p className="text-xs font-mono text-primary">{bulunanKayit.id}</p>
                {sonTaranan && <p className="text-xs text-muted-foreground/50 mt-1">QR: {sonTaranan}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setLocation(bulunanKayit.yol)}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm"
                >
                  Kaydı Görüntüle
                </button>
                <button
                  onClick={tekrarTara}
                  className="w-full py-3 glass-card border border-card-border rounded-xl text-sm font-semibold text-foreground flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  Yeni Tara
                </button>
              </div>
            </motion.div>
          )}

          {state === 'bulunamadi' && (
            <motion.div key="bulunamadi" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">Kayıt Bulunamadı</p>
                  <p className="text-xs text-muted-foreground mt-1">Bu kod sistemde kayıtlı değil</p>
                </div>
              </div>

              <div className="glass-card rounded-xl border border-amber-500/20 p-4">
                <p className="text-xs text-muted-foreground/60 mb-1">Aranan Kod</p>
                <p className="text-sm font-mono text-foreground break-all">{manuelGiris || sonTaranan}</p>
              </div>

              <button
                onClick={tekrarTara}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm"
              >
                Tekrar Dene
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {sonTaranan && state !== 'tarama' && state !== 'basari' && state !== 'bulunamadi' && (
          <div className="glass-card rounded-xl border border-card-border p-3">
            <p className="text-xs text-muted-foreground/60 mb-1">Son Taranan</p>
            <p className="text-xs font-mono text-foreground truncate">{sonTaranan}</p>
          </div>
        )}
      </div>
    </div>
  );
}
