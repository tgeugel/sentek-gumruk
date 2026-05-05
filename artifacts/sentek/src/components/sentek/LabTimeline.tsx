import { motion } from 'framer-motion';
import { Check, Circle, Clock, User } from 'lucide-react';
import { LabSevkDurumu, LabSevkOlay } from '../../types';

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

function formatTarih(t: string) {
  return new Date(t).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

interface LabTimelineProps {
  mevcutDurum: LabSevkDurumu;
  olaylar?: LabSevkOlay[];
  compact?: boolean;
}

export function LabTimeline({ mevcutDurum, olaylar, compact }: LabTimelineProps) {
  const mevcutIndex = DURUMLAR.indexOf(mevcutDurum);

  const getOlay = (durum: LabSevkDurumu) => olaylar?.find(o => o.durum === durum);

  return (
    <div className="relative">
      {DURUMLAR.map((durum, index) => {
        const tamamlandi = index < mevcutIndex;
        const aktif = index === mevcutIndex;
        const bekliyor = index > mevcutIndex;
        const olay = getOlay(durum);

        return (
          <motion.div
            key={durum}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="flex items-start gap-3 mb-2"
          >
            <div className="relative flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                tamamlandi
                  ? 'bg-emerald-500 border-emerald-500'
                  : aktif
                  ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                  : 'bg-transparent border-slate-700/50'
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
                <div className={`w-0.5 mt-1 ${compact ? 'h-4' : 'h-6'} ${
                  tamamlandi ? 'bg-emerald-500/50' : 'bg-slate-700/30'
                }`} />
              )}
            </div>

            <div className={`${compact ? 'pb-2' : 'pb-3'} flex-1 min-w-0`}>
              <p className={`text-sm font-medium leading-tight ${
                tamamlandi ? 'text-emerald-400' : aktif ? 'text-cyan-400' : 'text-slate-600'
              }`}>
                {durum}
              </p>
              {aktif && !olay && (
                <p className="text-xs text-cyan-500/70 mt-0.5">Mevcut durum</p>
              )}
              {olay && !compact && (
                <div className="mt-1 space-y-0.5">
                  {olay.tarih && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTarih(olay.tarih)}
                    </div>
                  )}
                  {olay.kullanici && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      <User className="w-2.5 h-2.5" />
                      {olay.kullanici}
                    </div>
                  )}
                  {olay.aciklama && (
                    <p className="text-xs text-muted-foreground/70 leading-tight">{olay.aciklama}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
