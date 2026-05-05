import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TestSonucBadge, LabDurumBadge } from '../../components/sentek/StatusBadge';
import { TestSonucu } from '../../types';

function formatTarih(tarih: string) {
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MyRecords() {
  const { testKayitlari } = useData();
  const [ara, setAra] = useState('');
  const [filtre, setFiltre] = useState<'Tumu' | TestSonucu>('Tumu');

  const filtered = testKayitlari.filter(k => {
    const esles = filtre === 'Tumu' || k.testSonucu === filtre;
    const aramaEsles = !ara || k.operasyonNo.toLowerCase().includes(ara.toLowerCase()) || k.lokasyon.toLowerCase().includes(ara.toLowerCase()) || k.numuneTuru.toLowerCase().includes(ara.toLowerCase());
    return esles && aramaEsles;
  });

  const filtreler: Array<'Tumu' | TestSonucu> = ['Tumu', 'Pozitif', 'Negatif', 'Geçersiz'];
  const filtrRenk: Record<string, string> = {
    'Tumu': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'Pozitif': 'bg-red-500/10 text-red-400 border-red-500/30',
    'Negatif': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Geçersiz': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Test Kayıtlarım</h1>
        <p className="text-xs text-muted-foreground">{testKayitlari.length} kayıt</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          data-testid="input-arama"
          type="text"
          value={ara}
          onChange={e => setAra(e.target.value)}
          placeholder="Operasyon no, lokasyon ara..."
          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 pl-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filtreler.map(f => (
          <button
            key={f}
            data-testid={`filter-${f.toLowerCase()}`}
            onClick={() => setFiltre(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filtre === f ? filtrRenk[f] : 'bg-secondary/30 text-muted-foreground border-border hover:border-primary/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Kayıt bulunamadı</p>
          </div>
        ) : (
          filtered.map((kayit, i) => (
            <motion.div
              key={kayit.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              data-testid={`card-kayit-${kayit.id}`}
              className="glass-card rounded-xl p-4 border border-card-border space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-cyan-400 font-semibold">{kayit.operasyonNo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatTarih(kayit.tarih)}</p>
                </div>
                <TestSonucBadge sonuc={kayit.testSonucu} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <p className="text-xs text-muted-foreground/60">Lokasyon</p>
                  <p className="text-xs text-foreground font-medium">{kayit.lokasyon}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/60">Numune Türü</p>
                  <p className="text-xs text-foreground font-medium leading-tight">{kayit.numuneTuru}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/60">Kit Seri No</p>
                  <p className="text-xs font-mono text-foreground">{kayit.kitSeriNo}</p>
                </div>
                {kayit.tespitEdilenMadde && (
                  <div>
                    <p className="text-xs text-muted-foreground/60">Tespit Edilen</p>
                    <p className="text-xs text-red-400 font-semibold">{kayit.tespitEdilenMadde}</p>
                  </div>
                )}
              </div>
              {kayit.labSevkDurumu && (
                <div className="pt-1 border-t border-border/50">
                  <p className="text-xs text-muted-foreground/60 mb-1">Lab Sevk Durumu</p>
                  <LabDurumBadge durum={kayit.labSevkDurumu} size="sm" />
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
