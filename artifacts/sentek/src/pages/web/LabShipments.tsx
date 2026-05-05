import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, ChevronDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { LabDurumBadge, OncelikBadge } from '../../components/sentek/StatusBadge';
import { LabTimeline } from '../../components/sentek/LabTimeline';
import { LabSevk, LabSevkDurumu } from '../../types';

function formatTarih(tarih?: string) {
  if (!tarih) return '—';
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function SevkDetayDrawer({ sevk, onClose }: { sevk: LabSevk | null; onClose: () => void }) {
  if (!sevk) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-card-border z-50 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <p className="font-mono font-bold text-cyan-400">{sevk.numuneTakipNo}</p>
            <p className="text-xs text-muted-foreground">{sevk.operasyonNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <OncelikBadge oncelik={sevk.oncelik} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Sevk Bilgileri</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Gönderen Birim', v: sevk.sevkEdenBirim },
                { l: 'Numune Türü', v: sevk.numuneTuru },
                { l: 'Ön Tarama', v: sevk.onTaramaSonucu },
                { l: 'Tespit Edilen', v: sevk.tespitEdilenMadde || '—' },
                { l: 'Gönderim Yöntemi', v: sevk.gonderimYontemi || '—' },
                { l: 'Tahmini Varış', v: formatTarih(sevk.tahminiVaris) },
                { l: 'Mühür / Etiket No', v: sevk.muhrEtiketNo || '—' },
                { l: 'Delil Poşeti No', v: sevk.delilPosetiNo || '—' },
              ].map(item => (
                <div key={item.l} className="bg-secondary/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{item.l}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{item.v}</p>
                </div>
              ))}
            </div>
          </section>

          {sevk.notlar && (
            <section>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Notlar</p>
              <p className="text-sm text-foreground bg-secondary/40 rounded-lg p-3">{sevk.notlar}</p>
            </section>
          )}

          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Sevk Süreci</p>
            <LabTimeline mevcutDurum={sevk.durum as LabSevkDurumu} />
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LabShipments() {
  const { labSevkler } = useData();
  const [ara, setAra] = useState('');
  const [durumFiltre, setDurumFiltre] = useState('');
  const [selected, setSelected] = useState<LabSevk | null>(null);

  const durumlar = [...new Set(labSevkler.map(s => s.durum))];
  const filtered = labSevkler.filter(s => {
    const aramaEsles = !ara || s.numuneTakipNo.toLowerCase().includes(ara.toLowerCase()) || s.operasyonNo.toLowerCase().includes(ara.toLowerCase()) || s.sevkEdenBirim.toLowerCase().includes(ara.toLowerCase());
    const durumEsles = !durumFiltre || s.durum === durumFiltre;
    return aramaEsles && durumEsles;
  });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Lab Sevk Takibi</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} sevk kaydı</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={ara}
            onChange={e => setAra(e.target.value)}
            placeholder="Takip no, operasyon no, birim ara..."
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 pl-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <select
            value={durumFiltre}
            onChange={e => setDurumFiltre(e.target.value)}
            className="appearance-none bg-secondary/50 border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Tüm Durumlar</option>
            {durumlar.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="glass-card rounded-xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Takip No', 'Operasyon No', 'Gönderen Birim', 'Numune Türü', 'Ön Tarama', 'Tahmini Varış', 'Öncelik', 'Durum', ''].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sevk, i) => (
                <motion.tr
                  key={sevk.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  data-testid={`row-sevk-${sevk.id}`}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3"><span className="font-mono text-xs text-cyan-400 font-semibold">{sevk.numuneTakipNo}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{sevk.operasyonNo}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{sevk.sevkEdenBirim}</td>
                  <td className="px-4 py-3 text-xs text-foreground max-w-[130px] truncate">{sevk.numuneTuru}</td>
                  <td className="px-4 py-3"><span className="text-xs font-semibold text-red-400">{sevk.onTaramaSonucu}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatTarih(sevk.tahminiVaris)}</td>
                  <td className="px-4 py-3"><OncelikBadge oncelik={sevk.oncelik} /></td>
                  <td className="px-4 py-3"><LabDurumBadge durum={sevk.durum} size="sm" /></td>
                  <td className="px-4 py-3">
                    <button
                      data-testid={`button-sevk-detay-${sevk.id}`}
                      onClick={() => setSelected(sevk)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Sevk kaydı bulunamadı</p>
            </div>
          )}
        </div>
      </div>

      <SevkDetayDrawer sevk={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
