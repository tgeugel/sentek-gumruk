import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Check, X, Clock, Camera } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { LabDurumBadge, OncelikBadge } from '../../components/sentek/StatusBadge';
import { LabTimeline } from '../../components/sentek/LabTimeline';
import { LabSevk, LabSevkDurumu } from '../../types';
import { useToast } from '../../hooks/use-toast';

function DetayModal({ sevk, onClose, onDurumGuncelle }: { sevk: LabSevk | null; onClose: () => void; onDurumGuncelle: (id: string, durum: LabSevkDurumu) => void }) {
  if (!sevk) return null;

  const handleTeslimAl = () => {
    onDurumGuncelle(sevk.id, 'Teslim Alındı');
    onClose();
  };

  const handleAnalizBaslat = () => {
    onDurumGuncelle(sevk.id, 'Analiz Sırasında');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-card-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card">
            <div>
              <p className="font-mono font-bold text-cyan-400">{sevk.numuneTakipNo}</p>
              <p className="text-xs text-muted-foreground">{sevk.operasyonNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <OncelikBadge oncelik={sevk.oncelik} />
              <LabDurumBadge durum={sevk.durum} />
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 gap-6">
            <div className="space-y-5">
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Numune Bilgileri</p>
                <div className="space-y-2">
                  {[
                    { l: 'Gönderen Birim', v: sevk.sevkEdenBirim },
                    { l: 'Numune Türü', v: sevk.numuneTuru },
                    { l: 'Ön Tarama', v: sevk.onTaramaSonucu },
                    { l: 'Tespit Edilen', v: sevk.tespitEdilenMadde || '—' },
                    { l: 'Mühür No', v: sevk.muhrEtiketNo || '—' },
                    { l: 'Delil Poşeti', v: sevk.delilPosetiNo || '—' },
                  ].map(item => (
                    <div key={item.l} className="flex justify-between py-1.5 border-b border-border/30 text-xs">
                      <span className="text-muted-foreground">{item.l}</span>
                      <span className="text-foreground font-medium">{item.v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Fotoğraf alanı */}
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Numune Fotoğrafı</p>
                <div className="aspect-video bg-secondary/50 rounded-xl border border-border flex items-center justify-center">
                  <div className="text-center text-muted-foreground/40">
                    <Camera className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xs">Numune fotoğrafı</p>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <section className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">İşlemler</p>
                {sevk.durum === 'Laboratuvara Ulaştı' && (
                  <button
                    data-testid="button-teslim-al"
                    onClick={handleTeslimAl}
                    className="w-full py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-semibold text-sm hover:bg-teal-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Teslim Al
                  </button>
                )}
                {sevk.durum === 'Teslim Alındı' && (
                  <button
                    data-testid="button-analiz-baslat"
                    onClick={handleAnalizBaslat}
                    className="w-full py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold text-sm hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <FlaskConical className="w-4 h-4" />
                    Analiz Başlat
                  </button>
                )}
                {sevk.durum === 'Analiz Sırasında' && (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                    <p className="text-xs text-yellow-400 font-semibold">Analiz süreci devam ediyor</p>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-secondary/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Rapor Durumu</p>
                  <p className="text-sm font-semibold text-foreground">{sevk.durum === 'Rapor Yüklendi' ? 'Rapor mevcut' : 'Bekleniyor'}</p>
                </div>
              </section>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Süreç Takibi</p>
              <LabTimeline mevcutDurum={sevk.durum as LabSevkDurumu} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Laboratory() {
  const { labSevkler, labSevkDurumGuncelle } = useData();
  const [selected, setSelected] = useState<LabSevk | null>(null);
  const { toast } = useToast();

  const handleDurumGuncelle = (id: string, durum: LabSevkDurumu) => {
    labSevkDurumGuncelle(id, durum);
    toast({ title: 'Durum güncellendi', description: durum });
  };

  const gelecekNumuneler = labSevkler.filter(s =>
    ['Laboratuvara Yolda', 'Laboratuvara Ulaştı', 'Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)
  );
  const tamamlananlar = labSevkler.filter(s =>
    ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Laboratuvar</h1>
        <p className="text-sm text-muted-foreground">{gelecekNumuneler.length} aktif numune · {tamamlananlar.length} tamamlanan</p>
      </div>

      {/* Active samples */}
      <section>
        <p className="text-sm font-semibold text-foreground mb-3">Gelecek / Aktif Numuneler</p>
        {gelecekNumuneler.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl border border-card-border text-muted-foreground">
            <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Aktif numune bulunmuyor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gelecekNumuneler.map((sevk, i) => (
              <motion.div
                key={sevk.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                data-testid={`card-lab-${sevk.id}`}
                className="glass-card rounded-xl border border-card-border p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-cyan-400 font-bold">{sevk.numuneTakipNo}</p>
                    <p className="text-xs text-muted-foreground">{sevk.operasyonNo}</p>
                  </div>
                  <OncelikBadge oncelik={sevk.oncelik} />
                </div>

                <div className="space-y-1">
                  {[
                    { l: 'Gönderen', v: sevk.sevkEdenBirim },
                    { l: 'Numune', v: sevk.numuneTuru },
                    { l: 'Ön Tarama', v: sevk.onTaramaSonucu },
                  ].map(item => (
                    <div key={item.l} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.l}</span>
                      <span className="text-foreground font-medium text-right max-w-[55%] truncate">{item.v}</span>
                    </div>
                  ))}
                </div>

                <LabDurumBadge durum={sevk.durum} size="sm" />

                <button
                  data-testid={`button-lab-detay-${sevk.id}`}
                  onClick={() => setSelected(sevk)}
                  className="w-full py-2 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-primary transition-all"
                >
                  Detay / İşlem
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      {tamamlananlar.length > 0 && (
        <section>
          <p className="text-sm font-semibold text-foreground mb-3">Tamamlanan Süreçler</p>
          <div className="glass-card rounded-xl border border-card-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {['Takip No', 'Numune', 'Gönderen', 'Durum'].map(col => (
                    <th key={col} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tamamlananlar.map(sevk => (
                  <tr key={sevk.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-cyan-400">{sevk.numuneTakipNo}</span></td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-[140px] truncate">{sevk.numuneTuru}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sevk.sevkEdenBirim}</td>
                    <td className="px-4 py-3"><LabDurumBadge durum={sevk.durum} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selected && (
        <DetayModal
          sevk={selected}
          onClose={() => setSelected(null)}
          onDurumGuncelle={handleDurumGuncelle}
        />
      )}
    </div>
  );
}
