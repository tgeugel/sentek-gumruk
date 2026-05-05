import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TestSonucBadge, LabDurumBadge } from '../../components/sentek/StatusBadge';
import { LabTimeline } from '../../components/sentek/LabTimeline';
import { TestKaydi, LabSevkDurumu } from '../../types';

function formatTarih(tarih: string) {
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DetailDrawer({ kayit, onClose, labSevk }: { kayit: TestKaydi | null; onClose: () => void; labSevk?: any }) {
  if (!kayit) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
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
            <p className="font-bold text-foreground">{kayit.operasyonNo}</p>
            <p className="text-xs text-muted-foreground">{formatTarih(kayit.tarih)}</p>
          </div>
          <div className="flex items-center gap-2">
            <TestSonucBadge sonuc={kayit.testSonucu} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Test Bilgileri</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Lokasyon', v: kayit.lokasyon },
                { l: 'Kontrol Noktası', v: kayit.kontrolNokta },
                { l: 'Numune Türü', v: kayit.numuneTuru },
                { l: 'Personel', v: kayit.personelAdi },
                { l: 'Kit Seri No', v: kayit.kitSeriNo },
                { l: 'Kit SKT', v: kayit.kitSKT },
              ].map(item => (
                <div key={item.l} className="bg-secondary/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{item.l}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{item.v}</p>
                </div>
              ))}
            </div>
          </section>

          {kayit.sahisAciklamasi && (
            <section>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Materyal Açıklaması</p>
              <p className="text-sm text-foreground bg-secondary/40 rounded-lg p-3">{kayit.sahisAciklamasi}</p>
            </section>
          )}

          {kayit.testSonucu === 'Pozitif' && (
            <section className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">Tespit Edilen Madde</p>
              <p className="text-base font-bold text-red-400">{kayit.tespitEdilenMadde || 'Belirtilmemiş'}</p>
            </section>
          )}

          {kayit.notlar && (
            <section>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Notlar</p>
              <p className="text-sm text-foreground bg-secondary/40 rounded-lg p-3">{kayit.notlar}</p>
            </section>
          )}

          {/* Kit Analysis Panel */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Kit Analizi</p>
            <div className="glass-card rounded-xl border border-card-border overflow-hidden">
              <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground/40">
                  <div className="w-24 h-16 bg-slate-800 rounded-lg mx-auto mb-2" />
                  <p className="text-xs">Test kit görüntüsü</p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { l: 'Algılanan Panel', v: '5-Panel', renk: 'text-cyan-400' },
                  { l: 'Kontrol Çizgisi', v: 'Belirgin ✓', renk: 'text-emerald-400' },
                  { l: 'Test Çizgisi', v: kayit.testSonucu === 'Pozitif' ? 'Pozitif ✓' : 'Negatif', renk: kayit.testSonucu === 'Pozitif' ? 'text-red-400' : 'text-emerald-400' },
                  { l: 'Güven Skoru', v: '%87', renk: 'text-amber-400' },
                ].map(item => (
                  <div key={item.l} className="flex justify-between text-xs border-b border-border/30 pb-1">
                    <span className="text-muted-foreground">{item.l}</span>
                    <span className={`font-semibold ${item.renk}`}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {kayit.labSevkDurumu && (
            <section>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Lab Sevk Süreci</p>
              <LabTimeline mevcutDurum={kayit.labSevkDurumu as LabSevkDurumu} />
            </section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function TestRecords() {
  const { testKayitlari } = useData();
  const [ara, setAra] = useState('');
  const [sonucFiltre, setSonucFiltre] = useState('');
  const [lokasyonFiltre, setLokasyonFiltre] = useState('');
  const [selected, setSelected] = useState<TestKaydi | null>(null);

  const lokasyonlar = [...new Set(testKayitlari.map(t => t.lokasyon))];

  const filtered = testKayitlari.filter(k => {
    const aramaEsles = !ara || k.operasyonNo.toLowerCase().includes(ara.toLowerCase()) || k.lokasyon.toLowerCase().includes(ara.toLowerCase()) || k.numuneTuru.toLowerCase().includes(ara.toLowerCase()) || k.personelAdi.toLowerCase().includes(ara.toLowerCase());
    const sonucEsles = !sonucFiltre || k.testSonucu === sonucFiltre;
    const lokasyonEsles = !lokasyonFiltre || k.lokasyon === lokasyonFiltre;
    return aramaEsles && sonucEsles && lokasyonEsles;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Test Kayıtları</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} kayıt gösteriliyor</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-arama"
            type="text"
            value={ara}
            onChange={e => setAra(e.target.value)}
            placeholder="Operasyon no, lokasyon, personel ara..."
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 pl-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <select
            value={sonucFiltre}
            onChange={e => setSonucFiltre(e.target.value)}
            className="appearance-none bg-secondary/50 border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Tüm Sonuçlar</option>
            <option value="Pozitif">Pozitif</option>
            <option value="Negatif">Negatif</option>
            <option value="Geçersiz">Geçersiz</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={lokasyonFiltre}
            onChange={e => setLokasyonFiltre(e.target.value)}
            className="appearance-none bg-secondary/50 border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Tüm Lokasyonlar</option>
            {lokasyonlar.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
        {(ara || sonucFiltre || lokasyonFiltre) && (
          <button onClick={() => { setAra(''); setSonucFiltre(''); setLokasyonFiltre(''); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
            <X className="w-3 h-3" /> Sıfırla
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Operasyon No', 'Tarih', 'Lokasyon', 'Numune Türü', 'Personel', 'Kit Seri No', 'Sonuç', 'Lab Durumu', ''].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((kayit, i) => (
                <motion.tr
                  key={kayit.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  data-testid={`row-kayit-${kayit.id}`}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3"><span className="font-mono text-xs text-cyan-400 font-semibold">{kayit.operasyonNo}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatTarih(kayit.tarih)}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{kayit.lokasyon}</td>
                  <td className="px-4 py-3 text-xs text-foreground max-w-[140px] truncate">{kayit.numuneTuru}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{kayit.personelAdi}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-muted-foreground">{kayit.kitSeriNo}</span></td>
                  <td className="px-4 py-3"><TestSonucBadge sonuc={kayit.testSonucu} size="sm" /></td>
                  <td className="px-4 py-3">{kayit.labSevkDurumu ? <LabDurumBadge durum={kayit.labSevkDurumu} size="sm" /> : <span className="text-xs text-muted-foreground/40">—</span>}</td>
                  <td className="px-4 py-3">
                    <button
                      data-testid={`button-detay-${kayit.id}`}
                      onClick={() => setSelected(kayit)}
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
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Kayıt bulunamadı</p>
            </div>
          )}
        </div>
      </div>

      <DetailDrawer kayit={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
