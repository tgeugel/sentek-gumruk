import { motion } from 'framer-motion';
import { Truck, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { LabDurumBadge, OncelikBadge } from '../../components/sentek/StatusBadge';
import { LabTimeline } from '../../components/sentek/LabTimeline';
import { LabSevkDurumu } from '../../types';
import { useState } from 'react';

function formatTarih(tarih?: string) {
  if (!tarih) return '-';
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MyShipments() {
  const { labSevkler } = useData();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Sevk Edilen Numunelerim</h1>
        <p className="text-xs text-muted-foreground">{labSevkler.length} sevk kaydı</p>
      </div>

      {labSevkler.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Truck className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Henüz sevk kaydı bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-3">
          {labSevkler.map((sevk, i) => (
            <motion.div
              key={sevk.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              data-testid={`card-sevk-${sevk.id}`}
              className="glass-card rounded-xl border border-card-border overflow-hidden"
            >
              <button
                className="w-full p-4 text-left"
                onClick={() => setSelected(selected === sevk.id ? null : sevk.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-mono text-cyan-400 font-bold">{sevk.numuneTakipNo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sevk.operasyonNo}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <LabDurumBadge durum={sevk.durum} size="sm" />
                    <OncelikBadge oncelik={sevk.oncelik} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground/60">Numune Türü</p>
                    <p className="text-xs text-foreground font-medium leading-tight">{sevk.numuneTuru}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/60">Ön Tarama</p>
                    <p className="text-xs text-red-400 font-semibold">{sevk.onTaramaSonucu}</p>
                  </div>
                  {sevk.tespitEdilenMadde && (
                    <div>
                      <p className="text-xs text-muted-foreground/60">Tespit Edilen</p>
                      <p className="text-xs text-foreground font-medium">{sevk.tespitEdilenMadde}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground/60">Tahmini Varış</p>
                    <p className="text-xs text-foreground">{formatTarih(sevk.tahminiVaris)}</p>
                  </div>
                </div>
                <p className="text-xs text-cyan-500/70 text-right">{selected === sevk.id ? 'Timeline gizle ↑' : 'Timeline görüntüle ↓'}</p>
              </button>

              {selected === sevk.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/50 p-4"
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Süreç Takibi</p>
                  <LabTimeline mevcutDurum={sevk.durum as LabSevkDurumu} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
