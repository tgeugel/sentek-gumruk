import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, QrCode, Shield } from 'lucide-react';

interface LabelData {
  tip: 'test' | 'numune';
  baslikNo: string;
  operasyonNo: string;
  numuneTuru?: string;
  testSonucu?: string;
  tarih: string;
  lokasyon?: string;
  personel?: string;
  kitSeriNo?: string;
  muhrNo?: string;
  delilPosetiNo?: string;
  sevkEden?: string;
  qrDeger: string;
}

function MiniQR({ value }: { value: string }) {
  const N = 15;
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = ((seed << 5) - seed + value.charCodeAt(i)) | 0;

  const cells: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false) as boolean[]);

  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
      const isCore = r >= 1 && r <= 3 && c >= 1 && c <= 3 && r === 2 && c === 2;
      if (row + r < N && col + c < N) cells[row + r][col + c] = isBorder || isCore;
    }
  };
  drawFinder(0, 0); drawFinder(0, N - 5); drawFinder(N - 5, 0);

  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const isFinder = (r < 6 && c < 6) || (r < 6 && c >= N - 5) || (r >= N - 5 && c < 6);
    if (!isFinder) {
      seed ^= seed << 13; seed ^= seed >> 7; seed ^= seed << 17;
      seed ^= (r * 17 + c * 23);
      cells[r][c] = (Math.abs(seed) % 3) < 2;
    }
  }

  return (
    <div className="inline-block bg-white p-1 rounded">
      {cells.map((row, r) => (
        <div key={r} className="flex">
          {row.map((filled, c) => (
            <div key={c} className={`w-[5px] h-[5px] ${filled ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface LabelModalProps {
  data: LabelData;
  onClose: () => void;
}

export function LabelModal({ data, onClose }: LabelModalProps) {
  const isTest = data.tip === 'test';

  const handlePrint = () => {
    const printContent = document.getElementById('sentek-label-print');
    if (!printContent) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>SENTEK Etiket</title>
      <style>
        body { margin: 0; font-family: Arial, sans-serif; background: white; }
        .label { width: 320px; border: 2px solid #000; padding: 12px; }
        .header { display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
        .header h1 { font-size: 16px; font-weight: bold; margin: 0; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; font-size: 10px; }
        .label-key { color: #555; }
        .label-val { font-weight: bold; color: #000; }
        .sonuc { font-size: 13px; font-weight: bold; padding: 4px 8px; border: 2px solid #000; text-align: center; margin: 6px 0; }
        .footer { font-size: 8px; color: #666; margin-top: 6px; border-top: 1px dashed #999; padding-top: 4px; }
        .qr-area { float: right; margin-left: 8px; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const sonucRenk = data.testSonucu === 'Pozitif' ? '#dc2626' : data.testSonucu === 'Negatif' ? '#16a34a' : '#d97706';

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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">{isTest ? 'Test Kaydı Etiketi' : 'Numune Sevk Etiketi'}</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-3 text-center">Etiket Önizlemesi</p>

            {/* Label Preview */}
            <div id="sentek-label-print" className="mx-auto max-w-[320px]">
              <div className="border-2 border-foreground/80 rounded-lg p-3 bg-white text-black">
                {/* Header */}
                <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-2">
                  <Shield className="w-5 h-5 text-black flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] font-black tracking-widest">SENTEK</p>
                    <p className="text-[8px] text-gray-600 tracking-wider">{isTest ? 'SAHA TEST KAYDI' : 'NUMUNE SEVK ETİKETİ'}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <MiniQR value={data.qrDeger} />
                  </div>
                </div>

                {/* Ana No */}
                <div className="text-center mb-2">
                  <p className="text-[9px] text-gray-500">{isTest ? 'TEST KAYIT NO' : 'NUMUNE TAKİP NO'}</p>
                  <p className="text-[14px] font-black font-mono tracking-wider">{data.baslikNo}</p>
                </div>

                {/* Sonuç (test için) */}
                {isTest && data.testSonucu && (
                  <div className="text-center mb-2 py-1 border-2 border-black rounded" style={{ backgroundColor: `${sonucRenk}15` }}>
                    <p className="text-[11px] font-black" style={{ color: sonucRenk }}>
                      ● {data.testSonucu.toUpperCase()}
                    </p>
                  </div>
                )}

                {/* Detaylar */}
                <div className="space-y-1">
                  {[
                    ['OPERASYON NO', data.operasyonNo],
                    data.numuneTuru && ['NUMUNE TÜRÜ', data.numuneTuru],
                    data.lokasyon && ['LOKASYON', data.lokasyon],
                    data.kitSeriNo && ['KİT SERİ NO', data.kitSeriNo],
                    data.muhrNo && ['MÜHÜR NO', data.muhrNo],
                    data.delilPosetiNo && ['DELİL POŞETİ', data.delilPosetiNo],
                    data.sevkEden && ['GÖNDEREN', data.sevkEden],
                    data.personel && ['PERSONEL', data.personel],
                    ['TARİH / SAAT', new Date(data.tarih).toLocaleString('tr-TR')],
                  ].filter(Boolean).map((item, i) => (
                    item && <div key={i} className="flex justify-between items-start">
                      <span className="text-[8px] text-gray-500 flex-shrink-0 pr-1">{item[0]}</span>
                      <span className="text-[8px] font-bold text-black text-right">{item[1]}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-2 pt-1 border-t border-dashed border-gray-400 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-gray-400" />
                    <span className="text-[7px] text-gray-400 font-mono">{data.qrDeger}</span>
                  </div>
                  <span className="text-[7px] text-gray-400">SENTEK © 2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 pt-0 flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-xs hover:bg-secondary/70 transition-colors">
              Kapat
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Printer className="w-4 h-4" /> Yazdır
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
