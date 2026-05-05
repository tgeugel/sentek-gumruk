import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileBarChart, Download, X, ClipboardList, FlaskConical, Package, AlertTriangle, MapPin, Layers } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TestSonucBadge, LabDurumBadge } from '../../components/sentek/StatusBadge';

const RAPOR_TIPLERI = [
  { id: 'test-kayitlari', baslik: 'Test Kayıtları Raporu', aciklama: 'Tüm test kayıtlarının özet listesi', ikon: ClipboardList, renk: 'cyan' },
  { id: 'pozitif-testler', baslik: 'Pozitif Testler Raporu', aciklama: 'Pozitif sonuçlu testlerin detaylı listesi', ikon: AlertTriangle, renk: 'red' },
  { id: 'lab-sevk', baslik: 'Lab Sevk Raporu', aciklama: 'Laboratuvara gönderilen numunelerin durumu', ikon: FlaskConical, renk: 'violet' },
  { id: 'stok-seri', baslik: 'Stok / Seri No Raporu', aciklama: 'Ürün envanteri ve seri numaraları', ikon: Package, renk: 'blue' },
  { id: 'skt-yaklasan', baslik: 'SKT Yaklaşan Ürünler', aciklama: 'Son kullanma tarihi yaklaşan ürünler', ikon: AlertTriangle, renk: 'amber' },
  { id: 'lokasyon-bazli', baslik: 'Lokasyon Bazlı Test Raporu', aciklama: 'Her lokasyondaki test dağılımı', ikon: MapPin, renk: 'green' },
  { id: 'numune-turu', baslik: 'Numune Türü Bazlı Rapor', aciklama: 'Numune türlerine göre test istatistikleri', ikon: Layers, renk: 'cyan' },
];

const renkMap: Record<string, string> = {
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  red: 'bg-red-500/10 border-red-500/20 text-red-400',
  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
};

function RaporModal({ raporId, onClose }: { raporId: string | null; onClose: () => void }) {
  const { testKayitlari, labSevkler, stoklar } = useData();
  if (!raporId) return null;

  const rapor = RAPOR_TIPLERI.find(r => r.id === raporId);

  const getIcerik = () => {
    switch (raporId) {
      case 'test-kayitlari':
        return testKayitlari.slice(0, 8);
      case 'pozitif-testler':
        return testKayitlari.filter(t => t.testSonucu === 'Pozitif');
      case 'lab-sevk':
        return labSevkler;
      case 'stok-seri':
        return stoklar;
      case 'skt-yaklasan':
        return stoklar.filter(s => s.durum === 'SKT Yaklaşıyor');
      default:
        return testKayitlari.slice(0, 5);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-card-border rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5 border-b border-border flex items-center justify-between flex-shrink-0">
            <div>
              <p className="font-bold text-foreground">{rapor?.baslik}</p>
              <p className="text-xs text-muted-foreground">Demo rapor · {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                <Download className="w-3 h-3" />
                İndir (Demo)
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-5">
            <div className="bg-secondary/30 rounded-xl p-4 mb-4 border border-border/50">
              <p className="text-xs text-amber-400 font-semibold mb-1">Demo Modu</p>
              <p className="text-xs text-muted-foreground">Bu rapor mock verilerle oluşturulmuştur. Gerçek sistem entegrasyonunda PDF/Excel formatında indirilecektir.</p>
            </div>

            {(raporId === 'test-kayitlari' || raporId === 'pozitif-testler' || raporId === 'lokasyon-bazli' || raporId === 'numune-turu') && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Test Kayıtları ({(getIcerik() as any[]).length} kayıt)</p>
                <div className="space-y-2">
                  {(getIcerik() as any[]).map((k: any) => (
                    <div key={k.id} className="flex items-center justify-between py-2 border-b border-border/30 text-sm">
                      <div>
                        <span className="font-mono text-xs text-cyan-400">{k.operasyonNo}</span>
                        <span className="text-xs text-muted-foreground ml-3">{k.lokasyon}</span>
                        <span className="text-xs text-muted-foreground ml-3">{k.numuneTuru}</span>
                      </div>
                      <TestSonucBadge sonuc={k.testSonucu} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {raporId === 'lab-sevk' && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Lab Sevk Kayıtları ({labSevkler.length} kayıt)</p>
                <div className="space-y-2">
                  {labSevkler.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/30 text-sm">
                      <div>
                        <span className="font-mono text-xs text-cyan-400">{s.numuneTakipNo}</span>
                        <span className="text-xs text-muted-foreground ml-3">{s.sevkEdenBirim}</span>
                      </div>
                      <LabDurumBadge durum={s.durum} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(raporId === 'stok-seri' || raporId === 'skt-yaklasan') && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Stok Kayıtları ({(getIcerik() as any[]).length} ürün)</p>
                <div className="space-y-2">
                  {(getIcerik() as any[]).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/30 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{s.urunAdi}</p>
                        <p className="text-xs text-muted-foreground">{s.lotSeriNo} · SKT: {s.skt}</p>
                      </div>
                      <span className="text-xs font-bold text-cyan-400">{s.kalanAdedi} adet</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Reports() {
  const [selectedRapor, setSelectedRapor] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Raporlar</h1>
        <p className="text-sm text-muted-foreground">Sistem raporları ve veri dışa aktarma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {RAPOR_TIPLERI.map((rapor, i) => (
          <motion.div
            key={rapor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            data-testid={`card-rapor-${rapor.id}`}
            className="glass-card rounded-xl border border-card-border p-5 space-y-4 hover:border-primary/30 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${renkMap[rapor.renk]}`}>
              <rapor.ikon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{rapor.baslik}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{rapor.aciklama}</p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid={`button-rapor-olustur-${rapor.id}`}
                onClick={() => setSelectedRapor(rapor.id)}
                className="flex-1 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileBarChart className="w-3 h-3" />
                Rapor Oluştur
              </button>
              <button className="px-3 py-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground text-xs hover:text-foreground transition-colors">
                <Download className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <RaporModal raporId={selectedRapor} onClose={() => setSelectedRapor(null)} />
    </div>
  );
}
