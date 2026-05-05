import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { LabSevkDurumu } from '../../types';

const DURUMLAR: LabSevkDurumu[] = [
  'Pozitif Tespit Edildi',
  'Sevk Kaydı Oluşturuldu',
  'Numune Paketlendi',
  'Laboratuvara Yolda',
  'Laboratuvara Ulaştı',
  'Teslim Alındı',
  'Analiz Sırasında',
  'Rapor Yüklendi',
  'Dosya Kapatıldı',
];

interface LabTimelineProps {
  mevcutDurum: LabSevkDurumu;
}

export function LabTimeline({ mevcutDurum }: LabTimelineProps) {
  const mevcutIndex = DURUMLAR.indexOf(mevcutDurum);

  return (
    <div className="relative">
      {DURUMLAR.map((durum, index) => {
        const tamamlandi = index < mevcutIndex;
        const aktif = index === mevcutIndex;
        const bekliyor = index > mevcutIndex;

        return (
          <motion.div
            key={durum}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="flex items-start gap-3 mb-3"
          >
            <div className="relative flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                tamamlandi
                  ? 'bg-emerald-500 border-emerald-500'
                  : aktif
                  ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                  : 'bg-transparent border-slate-700'
              }`}>
                {tamamlandi ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : aktif ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400"
                  />
                ) : (
                  <Circle className="w-3 h-3 text-slate-700" />
                )}
              </div>
              {index < DURUMLAR.length - 1 && (
                <div className={`w-0.5 h-6 mt-1 ${
                  tamamlandi ? 'bg-emerald-500/50' : 'bg-slate-700/50'
                }`} />
              )}
            </div>
            <div className="pt-0.5 pb-3">
              <p className={`text-sm font-medium leading-tight ${
                tamamlandi ? 'text-emerald-400' : aktif ? 'text-cyan-400' : 'text-slate-600'
              }`}>
                {durum}
              </p>
              {aktif && (
                <p className="text-xs text-cyan-500/70 mt-0.5">Mevcut durum</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
