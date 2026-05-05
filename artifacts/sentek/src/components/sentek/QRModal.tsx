import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, QrCode, Printer } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRModalProps {
  title: string;
  value: string;
  subtitle?: string;
  onClose: () => void;
}

export function QRModal({ title, value, subtitle, onClose }: QRModalProps) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const qrValue = `SENTEK:${value}`;
    QRCode.toDataURL(qrValue, {
      width: 200,
      margin: 2,
      color: { dark: '#0A0F1E', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    }).then(url => {
      setQrDataUrl(url);
    }).catch(() => {});
  }, [value]);

  const kopyala = () => {
    navigator.clipboard.writeText(`SENTEK:${value}`).catch(() => {});
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  const yazdir = () => {
    const w = window.open('', '_blank');
    if (!w || !qrDataUrl) return;
    w.document.write(`
      <html><head><title>SENTEK QR — ${value}</title>
      <style>body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;background:#fff;}
      img{width:200px;height:200px;}
      .title{font-size:16px;font-weight:700;margin-top:12px;}
      .sub{font-size:12px;color:#666;margin-top:4px;}
      .code{font-family:monospace;font-size:11px;margin-top:8px;color:#333;}
      </style></head>
      <body onload="window.print();window.close()">
        <img src="${qrDataUrl}" alt="QR Kodu"/>
        <div class="title">${title}</div>
        ${subtitle ? `<div class="sub">${subtitle}</div>` : ''}
        <div class="code">SENTEK:${value}</div>
        <div class="sub">${new Date().toLocaleDateString('tr-TR')}</div>
      </body></html>
    `);
    w.document.close();
  };

  const indir = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `SENTEK-QR-${value}.png`;
    a.click();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={e => e.stopPropagation()}
          className="bg-card border border-card-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">{title}</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center gap-4">
            <div className="shadow-xl rounded-xl overflow-hidden ring-4 ring-white/10 bg-white p-3">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Kodu" className="w-[180px] h-[180px]" />
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs font-mono font-bold text-primary tracking-wider">SENTEK:{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={kopyala}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  kopyalandi ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-border text-foreground hover:bg-secondary'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                {kopyalandi ? 'Kopyalandı!' : 'Kopyala'}
              </button>
              <button
                onClick={yazdir}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Yazdır
              </button>
              <button
                onClick={indir}
                className="flex-1 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                İndir
              </button>
            </div>

            <p className="text-xs text-muted-foreground/50 text-center">
              SENTEK QR Takip Kodu • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
