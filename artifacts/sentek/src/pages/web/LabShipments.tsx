import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, Filter } from 'lucide-react';
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card/95 backdrop-blur-xl border-l border-card-border z-50 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
          <div>
            <p className="font-mono font-bold text-lg text-primary">{sevk.numuneTakipNo}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{sevk.operasyonNo}</p>
          </div>
          <div className="flex items-center gap-3">
            <OncelikBadge oncelik={sevk.oncelik} />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          <section>
            <p className="section-title mb-4">Sevk Bilgileri</p>
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
                <div key={item.l} className="glass-card-inset p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.l}</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.v}</p>
                </div>
              ))}
            </div>
          </section>

          {sevk.notlar && (
            <section>
              <p className="section-title mb-3">Notlar</p>
              <div className="glass-card-inset p-4 text-sm text-foreground/80 leading-relaxed">
                {sevk.notlar}
              </div>
            </section>
          )}

          <section>
            <p className="section-title mb-4">Sevk Süreci</p>
            <div className="glass-card-inset p-5">
              <LabTimeline mevcutDurum={sevk.durum as LabSevkDurumu} />
            </div>
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

  const kpi = {
    yolda: labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length,
    analiz: labSevkler.filter(s => s.durum === 'Analiz Sırasında').length,
    tamam: labSevkler.filter(s => s.durum === 'Rapor Yüklendi' || s.durum === 'Dosya Kapatıldı').length
  };

  const getDurumColor = (durum: LabSevkDurumu) => {
    if (['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(durum)) return 'border-l-emerald-500';
    if (['Laboratuvara Yolda', 'Sevk Kaydı Oluşturuldu', 'Numune Paketlendi'].includes(durum)) return 'border-l-amber-500';
    return 'border-l-primary';
  };

  return (
    <div className="p-6 space-y-6 page-enter">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Lab Sevk Takibi</h1>
          <p className="text-sm text-muted-foreground mt-1">Laboratuvar analiz süreçleri ve numune lojistik takibi</p>
        </div>
        
        <div className="flex gap-3">
          {[
            { label: 'Yolda', value: kpi.yolda, color: 'text-amber-400' },
            { label: 'Analiz Sırasında', value: kpi.analiz, color: 'text-primary' },
            { label: 'Tamamlanan', value: kpi.tamam, color: 'text-emerald-400' },
          ].map(chip => (
            <div key={chip.label} className="kpi-chip">
              <span className="metric-label">{chip.label}</span>
              <span className={`text-xl font-bold ${chip.color}`}>{chip.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={ara}
            onChange={e => setAra(e.target.value)}
            placeholder="Takip no, operasyon no ara..."
            className="premium-input pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5 p-1 bg-secondary/20 rounded-xl overflow-x-auto scrollbar-hide max-w-full">
          <button
            onClick={() => setDurumFiltre('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              durumFiltre === '' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tümü
          </button>
          {durumlar.map(d => (
            <button
              key={d}
              onClick={() => setDurumFiltre(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                durumFiltre === d ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((sevk, i) => (
            <motion.div
              layout
              key={sevk.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              onClick={() => setSelected(sevk)}
              className={`glass-card p-5 border-l-4 cursor-pointer group ${getDurumColor(sevk.durum)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-mono text-primary font-bold">{sevk.numuneTakipNo}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5 tracking-wider">{sevk.operasyonNo}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <OncelikBadge oncelik={sevk.oncelik} />
                  <LabDurumBadge durum={sevk.durum} size="sm" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Gönderen</span>
                  <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{sevk.sevkEdenBirim}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Tarih</span>
                  <span className="text-xs text-muted-foreground font-medium">{formatTarih(sevk.tahminiVaris).split(' ')[0]}</span>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Eye className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4 text-muted-foreground">
            <Filter className="w-6 h-6" />
          </div>
          <p className="text-sm text-muted-foreground">Kriterlere uygun sevk kaydı bulunamadı.</p>
        </div>
      )}

      <SevkDetayDrawer sevk={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
