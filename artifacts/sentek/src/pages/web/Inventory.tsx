import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Package, X, Search, Clock, TrendingDown,
  Filter, ChevronDown, CheckCircle, BarChart3, Eye
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { StokDurumBadge } from '../../components/sentek/StatusBadge';
import { Stok } from '../../types';

function formatSKT(skt: string) {
  return new Date(skt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function sktKalanGun(skt: string) {
  return Math.ceil((new Date(skt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

function KullanimBar({ oran }: { oran: number }) {
  const renk = oran > 90 ? 'bg-red-500' : oran > 70 ? 'bg-amber-500' : 'bg-cyan-500';
  return (
    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${oran}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`h-full rounded-full ${renk}`}
      />
    </div>
  );
}

function StokDetayDrawer({ stok, onClose }: { stok: Stok | null; onClose: () => void }) {
  if (!stok) return null;
  const kullanimOrani = Math.round((stok.kullanilanAdedi / stok.girisAdedi) * 100);
  const kalanGun = sktKalanGun(stok.skt);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-card-border z-50 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-foreground text-base">{stok.urunAdi}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stok.panelTipi}</p>
            </div>
            <div className="flex items-center gap-2">
              <StokDurumBadge durum={stok.durum} />
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Uyarı */}
          {(stok.durum === 'Kritik' || stok.durum === 'Tükendi') && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-400">
                  {stok.durum === 'Tükendi' ? 'Stok tükendi — acil ikmal gerekli' : 'Kritik stok seviyesi'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Kalan: {stok.kalanAdedi} adet / Kritik eşik: {stok.kritikSeviye} adet</p>
              </div>
            </div>
          )}
          {stok.durum === 'SKT Yaklaşıyor' && (
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-400">{kalanGun} gün içinde son kullanma tarihi</p>
                <p className="text-xs text-muted-foreground mt-0.5">SKT: {formatSKT(stok.skt)}</p>
              </div>
            </div>
          )}

          {/* Bilgiler */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Ürün Bilgileri</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Lot / Seri No', v: stok.lotSeriNo },
                { l: 'Depo', v: stok.depo },
                { l: 'Son Kullanma', v: formatSKT(stok.skt) },
                { l: 'Kritik Seviye', v: `${stok.kritikSeviye.toLocaleString('tr-TR')} adet` },
              ].map(item => (
                <div key={item.l} className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.l}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5 font-mono text-xs">{item.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kullanım */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Stok Kullanım Özeti</p>
            <div className="glass-card p-4 rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { l: 'Giriş', v: stok.girisAdedi.toLocaleString('tr-TR'), renk: 'text-cyan-400' },
                  { l: 'Kullanılan', v: stok.kullanilanAdedi.toLocaleString('tr-TR'), renk: 'text-amber-400' },
                  { l: 'Kalan', v: stok.kalanAdedi.toLocaleString('tr-TR'), renk: stok.kalanAdedi <= stok.kritikSeviye ? 'text-red-400' : 'text-emerald-400' },
                ].map(item => (
                  <div key={item.l} className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{item.l}</p>
                    <p className={`text-lg font-bold ${item.renk}`}>{item.v}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Kullanım Oranı</span>
                  <span className={`font-bold ${kullanimOrani > 90 ? 'text-red-400' : kullanimOrani > 70 ? 'text-amber-400' : 'text-cyan-400'}`}>{kullanimOrani}%</span>
                </div>
                <KullanimBar oran={kullanimOrani} />
              </div>
            </div>
          </div>

          {/* Kullanım Geçmişi */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Son Kullanım Geçmişi</p>
            <div className="space-y-2">
              {[
                { tarih: '05.05.2026', adet: 12, birim: 'Sınır Kapısı A' },
                { tarih: '04.05.2026', adet: 8,  birim: 'Liman Kontrol Noktası' },
                { tarih: '03.05.2026', adet: 15, birim: 'Antrepo Bölgesi' },
                { tarih: '02.05.2026', adet: 6,  birim: 'Karayolu Kontrol Noktası' },
              ].map(h => (
                <div key={h.tarih} className="flex items-center gap-3 py-2 px-3 bg-secondary/30 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground font-mono w-20 flex-shrink-0">{h.tarih}</span>
                  <span className="text-xs text-foreground/80 flex-1">{h.birim}</span>
                  <span className="text-xs text-cyan-400 font-semibold flex-shrink-0">{h.adet} adet</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function Inventory() {
  const { stoklar } = useData();
  const [selected, setSelected] = useState<Stok | null>(null);
  const [arama, setArama] = useState('');
  const [durumFiltre, setDurumFiltre] = useState('Tümü');
  const [filtrePanelAcik, setFiltrePanelAcik] = useState(false);

  const toplamAdedi = stoklar.reduce((s, k) => s + k.girisAdedi, 0);
  const kullanilanAdedi = stoklar.reduce((s, k) => s + k.kullanilanAdedi, 0);
  const kalanAdedi = stoklar.reduce((s, k) => s + k.kalanAdedi, 0);
  const kritikler = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi');
  const sktYaklasanlar = stoklar.filter(s => s.durum === 'SKT Yaklaşıyor');
  const normalSayisi = stoklar.filter(s => s.durum === 'Normal').length;

  const filtrelenmis = useMemo(() => stoklar.filter(s => {
    const aramaEsles = !arama || [s.urunAdi, s.lotSeriNo, s.panelTipi, s.depo].some(f => f?.toLowerCase().includes(arama.toLowerCase()));
    const durumEsles = durumFiltre === 'Tümü' || s.durum === durumFiltre;
    return aramaEsles && durumEsles;
  }), [stoklar, arama, durumFiltre]);

  return (
    <div className="p-6 space-y-5">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Stok / Seri No / SKT</h1>
        <p className="text-sm text-muted-foreground">{stoklar.length} ürün kaydı · {filtrelenmis.length} gösteriliyor</p>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { l: 'Toplam Stok', v: toplamAdedi.toLocaleString('tr-TR'), icon: Package, renk: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/15' },
          { l: 'Kullanılabilir', v: kalanAdedi.toLocaleString('tr-TR'), icon: CheckCircle, renk: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
          { l: 'Bugün Kullanılan', v: kullanilanAdedi.toLocaleString('tr-TR'), icon: TrendingDown, renk: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/15' },
          { l: 'Kritik / Tükenen', v: kritikler.length, icon: AlertTriangle, renk: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15' },
          { l: 'SKT Yaklaşan', v: sktYaklasanlar.length, icon: Clock, renk: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
          { l: 'Normal Stok', v: normalSayisi, icon: BarChart3, renk: 'text-foreground', bg: 'bg-secondary/60', border: 'border-border' },
        ].map(({ l, v, icon: Icon, renk, bg, border }) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 border ${border}`}
          >
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-3.5 h-3.5 ${renk}`} />
            </div>
            <p className={`text-xl font-bold ${renk}`}>{v}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{l}</p>
          </motion.div>
        ))}
      </div>

      {/* Uyarı Bannerları */}
      <AnimatePresence>
        {kritikler.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/8">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-400">{kritikler.length} ürün kritik seviyede veya tükendi</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{kritikler.map(k => k.urunAdi).join(' · ')}</p>
            </div>
          </motion.div>
        )}
        {sktYaklasanlar.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.08 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/8">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-400">{sktYaklasanlar.length} ürünün son kullanma tarihi yaklaşıyor</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{sktYaklasanlar.map(k => k.urunAdi).join(' · ')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arama + Filtre */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ürün adı, lot/seri no, panel tipi, depo..."
            value={arama}
            onChange={e => setArama(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
          />
          {arama && (
            <button onClick={() => setArama('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltrePanelAcik(!filtrePanelAcik)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            durumFiltre !== 'Tümü' || filtrePanelAcik
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-border text-foreground hover:bg-secondary'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtre
          <ChevronDown className={`w-3 h-3 transition-transform ${filtrePanelAcik ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {filtrePanelAcik && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 rounded-xl">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Durum</p>
              <div className="flex gap-2 flex-wrap">
                {['Tümü', 'Normal', 'Kritik', 'SKT Yaklaşıyor', 'Tükendi'].map(v => (
                  <button key={v} onClick={() => setDurumFiltre(v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      durumFiltre === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tablo */}
      <div className="glass-card rounded-xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                {['Ürün Adı', 'Panel', 'Lot / Seri No', 'Giriş', 'Kullanılan', 'Kalan', 'Kullanım', 'SKT', 'Durum', ''].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap first:pl-5 last:pr-5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrelenmis.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <Package className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Aramanızla eşleşen stok bulunamadı</p>
                  </td>
                </tr>
              ) : (
                filtrelenmis.map((stok, i) => {
                  const kullanimOrani = Math.round((stok.kullanilanAdedi / stok.girisAdedi) * 100);
                  const kalanGun = sktKalanGun(stok.skt);
                  const sktAcil = kalanGun > 0 && kalanGun <= 30;
                  return (
                    <motion.tr
                      key={stok.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.03, 0.4) }}
                      data-testid={`row-stok-${stok.id}`}
                      className="border-b border-border/40 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="text-sm font-semibold text-foreground">{stok.urunAdi}</p>
                        <p className="text-[11px] text-muted-foreground/60">{stok.depo}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{stok.panelTipi}</td>
                      <td className="px-4 py-3"><span className="font-mono text-xs text-cyan-400">{stok.lotSeriNo}</span></td>
                      <td className="px-4 py-3 text-xs text-foreground/70">{stok.girisAdedi.toLocaleString('tr-TR')}</td>
                      <td className="px-4 py-3 text-xs text-foreground/70">{stok.kullanilanAdedi.toLocaleString('tr-TR')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${stok.kalanAdedi <= stok.kritikSeviye ? 'text-red-400' : 'text-foreground'}`}>
                          {stok.kalanAdedi.toLocaleString('tr-TR')}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-[80px]">
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground">{kullanimOrani}%</span>
                          <KullanimBar oran={kullanimOrani} />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs ${sktAcil ? 'text-amber-400 font-semibold' : 'text-foreground/70'}`}>
                          {formatSKT(stok.skt)}
                          {sktAcil && <span className="ml-1 text-[10px]">({kalanGun}g)</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StokDurumBadge durum={stok.durum} /></td>
                      <td className="px-5 py-3">
                        <button
                          data-testid={`button-stok-detay-${stok.id}`}
                          onClick={() => setSelected(stok)}
                          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                          title="Detay"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <StokDetayDrawer stok={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
