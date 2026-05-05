import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, QrCode } from 'lucide-react';
import { useState } from 'react';

function MockQR({ value }: { value: string }) {
  const N = 25;
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = ((seed << 5) - seed + value.charCodeAt(i)) | 0;
  }

  const cells: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false) as boolean[]);

  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if ((row + r < N) && (col + c < N)) {
          cells[row + r][col + c] = isBorder || isCore;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  // Timing pattern
  for (let i = 8; i < N - 8; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

  // Data area
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const isFinder = (r < 9 && c < 9) || (r < 9 && c >= N - 8) || (r >= N - 8 && c < 9);
      const isTiming = r === 6 || c === 6;
      if (!isFinder && !isTiming) {
        let s = seed;
        s ^= s << 13; s ^= s >> 7; s ^= s << 17;
        s ^= (r * 31 + c * 37 + r * c);
        seed = s;
        cells[r][c] = (Math.abs(s) % 3) < 2;
      }
    }
  }

  return (
    <div className="inline-block p-3 bg-white rounded-lg">
      {cells.map((row, r) => (
        <div key={r} className="flex">
          {row.map((filled, c) => (
            <div
              key={c}
              className={`w-2 h-2 ${filled ? 'bg-gray-900' : 'bg-white'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface QRModalProps {
  title: string;
  value: string;
  subtitle?: string;
  onClose: () => void;
}

export function QRModal({ title, value, subtitle, onClose }: QRModalProps) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
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
            <div className="shadow-xl rounded-xl overflow-hidden ring-4 ring-white/10">
              <MockQR value={value} />
            </div>

            <div className="text-center">
              <p className="text-xs font-mono font-bold text-primary tracking-wider">{value}</p>
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
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Yazdır
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
