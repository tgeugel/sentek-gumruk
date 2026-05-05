import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Package, X, TrendingDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { StokDurumBadge } from '../../components/sentek/StatusBadge';
import { Stok } from '../../types';

function formatSKT(skt: string) {
  return new Date(skt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function StokDetayModal({ stok, onClose }: { stok: Stok | null; onClose: () => void }) {
  if (!stok) return null;
  const kullanimOrani = Math.round((stok.kullanilanAdedi / stok.girisAdedi) * 100);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-card-border rounded-2xl w-full max-w-lg p-6 space-y-5"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-foreground">{stok.urunAdi}</p>
              <p className="text-xs text-muted-foreground">{stok.panelTipi}</p>
            </div>
            <div className="flex items-center gap-2">
              <StokDurumBadge durum={stok.durum} />
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Lot / Seri No', v: stok.lotSeriNo },
              { l: 'Depo', v: stok.depo },
              { l: 'Giriş Miktarı', v: stok.girisAdedi.toLocaleString('tr-TR') + ' adet' },
              { l: 'Kullanılan', v: stok.kullanilanAdedi.toLocaleString('tr-TR') + ' adet' },
              { l: 'Kalan', v: stok.kalanAdedi.toLocaleString('tr-TR') + ' adet' },
              { l: 'Kritik Seviye', v: stok.kritikSeviye.toLocaleString('tr-TR') + ' adet' },
              { l: 'SKT', v: formatSKT(stok.skt) },
            ].map(item => (
              <div key={item.l} className="bg-secondary/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{item.l}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{item.v}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground">Kullanım Oranı</p>
              <p className="text-xs font-bold text-foreground">{kullanimOrani}%</p>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${kullanimOrani}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${kullanimOrani > 90 ? 'bg-red-400' : kullanimOrani > 70 ? 'bg-amber-400' : 'bg-cyan-400'}`}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Kullanım Geçmişi (Demo)</p>
            <div className="space-y-1.5">
              {[
                { tarih: '2026-05-04', adet: 12, birim: 'Sınır Kapısı A' },
                { tarih: '2026-05-03', adet: 8, birim: 'Liman Kontrol Noktası' },
                { tarih: '2026-05-02', adet: 15, birim: 'Antrepo Bölgesi' },
              ].map(h => (
                <div key={h.tarih} className="flex items-center justify-between text-xs py-1 border-b border-border/30">
                  <span className="text-muted-foreground">{h.tarih}</span>
                  <span className="text-foreground">{h.birim}</span>
                  <span className="text-cyan-400 font-semibold">{h.adet} adet</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Inventory() {
  const { stoklar } = useData();
  const [selected, setSelected] = useState<Stok | null>(null);

  const kritikler = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi');
  const sktYaklasanlar = stoklar.filter(s => s.durum === 'SKT Yaklaşıyor');

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Stok / Seri No / SKT</h1>
        <p className="text-sm text-muted-foreground">{stoklar.length} ürün kaydı</p>
      </div>

      {/* Warning Banners */}
      {kritikler.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">{kritikler.length} ürün kritik seviyede veya tükendi</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kritikler.map(k => k.urunAdi).join(', ')}</p>
          </div>
        </motion.div>
      )}
      {sktYaklasanlar.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-400">{sktYaklasanlar.length} ürünün son kullanma tarihi yaklaşıyor</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sktYaklasanlar.map(k => k.urunAdi).join(', ')}</p>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Ürün Adı', 'Panel Tipi', 'Lot / Seri No', 'Giriş', 'Kullanılan', 'Kalan', 'SKT', 'Depo', 'Kritik Seviye', 'Durum', ''].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stoklar.map((stok, i) => (
                <motion.tr
                  key={stok.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  data-testid={`row-stok-${stok.id}`}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{stok.urunAdi}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px]">{stok.panelTipi}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-cyan-400">{stok.lotSeriNo}</span></td>
                  <td className="px-4 py-3 text-xs text-foreground">{stok.girisAdedi.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{stok.kullanilanAdedi.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${stok.kalanAdedi <= stok.kritikSeviye ? 'text-red-400' : 'text-foreground'}`}>
                      {stok.kalanAdedi.toLocaleString('tr-TR')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{formatSKT(stok.skt)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{stok.depo}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{stok.kritikSeviye.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3"><StokDurumBadge durum={stok.durum} /></td>
                  <td className="px-4 py-3">
                    <button
                      data-testid={`button-stok-detay-${stok.id}`}
                      onClick={() => setSelected(stok)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                    >
                      <TrendingDown className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StokDetayModal stok={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
