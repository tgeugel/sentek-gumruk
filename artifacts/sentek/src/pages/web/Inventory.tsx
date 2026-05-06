import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Package, X, Search, Clock, TrendingDown,
  Filter, ChevronDown, CheckCircle, BarChart3, Eye
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { StokDurumBadge } from '../../components/sentek/StatusBadge';
import { Stok } from '../../types';

const CHART_COLORS = ['#00D4FF', '#f23058', '#f59e0b', '#22c55e']; // Cyan, Red, Amber, Emerald

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
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-card-border z-50 flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-foreground text-[18px]">{stok.urunAdi}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stok.panelTipi}</p>
            </div>
            <div className="flex items-center gap-2">
              <StokDurumBadge durum={stok.durum} />
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Uyarı */}
          {(stok.durum === 'Kritik' || stok.durum === 'Tükendi') && (
            <div className="flex items-start gap-3 p-4 alert-critical">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-400">
                  {stok.durum === 'Tükendi' ? 'Stok tükendi — acil ikmal gerekli' : 'Kritik stok seviyesi'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Kalan: {stok.kalanAdedi} adet / Kritik eşik: {stok.kritikSeviye} adet</p>
              </div>
            </div>
          )}
          {stok.durum === 'SKT Yaklaşıyor' && (
            <div className="flex items-start gap-3 p-4 alert-warning">
              <Clock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-400">{kalanGun} gün içinde son kullanma tarihi</p>
                <p className="text-xs text-muted-foreground mt-0.5">SKT: {formatSKT(stok.skt)}</p>
              </div>
            </div>
          )}

          {/* Bilgiler */}
          <div>
            <p className="section-title mb-3">Ürün Bilgileri</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Lot / Seri No', v: stok.lotSeriNo },
                { l: 'Depo', v: stok.depo },
                { l: 'Son Kullanma', v: formatSKT(stok.skt) },
                { l: 'Kritik Seviye', v: `${stok.kritikSeviye.toLocaleString('tr-TR')} adet` },
              ].map(item => (
                <div key={item.l} className="glass-card-inset p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.l}</p>
                  <p className="text-sm font-medium text-foreground mt-1 font-mono">{item.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kullanım */}
          <div>
            <p className="section-title mb-3">Stok Kullanım Özeti</p>
            <div className="glass-card-elevated p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { l: 'Giriş', v: stok.girisAdedi.toLocaleString('tr-TR'), renk: 'text-cyan-400' },
                  { l: 'Kullanılan', v: stok.kullanilanAdedi.toLocaleString('tr-TR'), renk: 'text-amber-400' },
                  { l: 'Kalan', v: stok.kalanAdedi.toLocaleString('tr-TR'), renk: stok.kalanAdedi <= stok.kritikSeviye ? 'text-red-400' : 'text-emerald-400' },
                ].map(item => (
                  <div key={item.l}>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.l}</p>
                    <p className={`text-lg font-bold ${item.renk}`}>{item.v}</p>
                  </div>
                ))}
              </div>
              <div className="gradient-divider" />
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground font-medium">Kullanım Verimliliği</span>
                  <span className={`font-bold ${kullanimOrani > 90 ? 'text-red-400' : kullanimOrani > 70 ? 'text-amber-400' : 'text-cyan-400'}`}>{kullanimOrani}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${kullanimOrani}%` }}
                    className={`h-full ${kullanimOrani > 90 ? 'bg-red-500' : kullanimOrani > 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kullanım Geçmişi */}
          <div>
            <p className="section-title mb-3">Son Kullanım Geçmişi</p>
            <div className="space-y-2">
              {[
                { tarih: '05.05.2026', adet: 12, birim: 'Sınır Kapısı A' },
                { tarih: '04.05.2026', adet: 8,  birim: 'Liman Kontrol Noktası' },
                { tarih: '03.05.2026', adet: 15, birim: 'Antrepo Bölgesi' },
                { tarih: '02.05.2026', adet: 6,  birim: 'Karayolu Kontrol Noktası' },
              ].map(h => (
                <div key={h.tarih} className="flex items-center gap-3 py-2.5 px-4 glass-card-inset">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground font-mono w-20 flex-shrink-0">{h.tarih}</span>
                  <span className="text-xs text-foreground/80 flex-1 truncate">{h.birim}</span>
                  <span className="text-xs text-cyan-400 font-bold flex-shrink-0">{h.adet} adet</span>
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
  const tukendiSayisi = stoklar.filter(s => s.durum === 'Tükendi').length;
  const kritikSayisi = stoklar.filter(s => s.durum === 'Kritik').length;

  const filtrelenmis = useMemo(() => stoklar.filter(s => {
    const aramaEsles = !arama || [s.urunAdi, s.lotSeriNo, s.panelTipi, s.depo].some(f => f?.toLowerCase().includes(arama.toLowerCase()));
    const durumEsles = durumFiltre === 'Tümü' || s.durum === durumFiltre;
    return aramaEsles && durumEsles;
  }), [stoklar, arama, durumFiltre]);

  const chartData = [
    { name: 'Normal', value: normalSayisi, color: CHART_COLORS[0] },
    { name: 'Kritik', value: kritikSayisi, color: CHART_COLORS[1] },
    { name: 'Tükendi', value: tukendiSayisi, color: CHART_COLORS[2] },
    { name: 'SKT Yaklaşıyor', value: sktYaklasanlar.length, color: CHART_COLORS[3] },
  ].filter(d => d.value > 0);

  const kalanOrani = toplamAdedi > 0 ? (kalanAdedi / toplamAdedi) : 0;
  const kalanRenkSinifi = kalanOrani < 0.2 ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className="p-8 space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="page-title">Stok Yönetimi</h1>
          <p className="text-sm text-muted-foreground">Kit ve seri no envanter takibi</p>
        </div>

        {/* 4-chip summary bar */}
        <div className="flex flex-wrap gap-4">
          <div className="kpi-chip">
            <span className="metric-label">Toplam</span>
            <span className="text-xl font-bold text-cyan-400">{toplamAdedi.toLocaleString('tr-TR')}</span>
          </div>
          <div className="kpi-chip">
            <span className="metric-label">Kullanılan</span>
            <span className="text-xl font-bold text-amber-400">{kullanilanAdedi.toLocaleString('tr-TR')}</span>
          </div>
          <div className="kpi-chip">
            <span className="metric-label">Kalan</span>
            <span className={`text-xl font-bold ${kalanRenkSinifi}`}>{kalanAdedi.toLocaleString('tr-TR')}</span>
          </div>
          <div className="kpi-chip">
            <span className="metric-label">Kritik</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-500">{kritikler.length}</span>
              {kritikler.length > 0 && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol Kolon: Liste */}
        <div className="flex-1 space-y-6">
          {/* Arama & Filtre */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ürün adı, lot/seri no, depo..."
                value={arama}
                onChange={e => setArama(e.target.value)}
                className="premium-input pl-11"
              />
            </div>
            <div className="flex p-1 bg-secondary/50 rounded-xl gap-1">
              {['Tümü', 'Normal', 'Kritik', 'Tükendi', 'SKT Yaklaşıyor'].map(v => (
                <button
                  key={v}
                  onClick={() => setDurumFiltre(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    durumFiltre === v
                      ? 'bg-primary/10 border border-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full premium-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Lot Seri No</th>
                    <th>Kalan / Giriş</th>
                    <th className="w-32">Kullanım %</th>
                    <th>Durum</th>
                    <th>SKT</th>
                  </tr>
                </thead>
                <tbody className="stagger-children">
                  {filtrelenmis.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center">
                        <Package className="w-10 h-10 text-muted-foreground/10 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Eşleşen stok kaydı bulunamadı</p>
                      </td>
                    </tr>
                  ) : (
                    filtrelenmis.map((stok) => {
                      const kullanimOrani = Math.round((stok.kullanilanAdedi / stok.girisAdedi) * 100);
                      const kalanGun = sktKalanGun(stok.skt);
                      const sktAcil = kalanGun > 0 && kalanGun <= 30;
                      return (
                        <tr
                          key={stok.id}
                          onClick={() => setSelected(stok)}
                          className="cursor-pointer hover:bg-white/2 group"
                        >
                          <td className="font-semibold">{stok.urunAdi}</td>
                          <td className="font-mono text-cyan-400/80">{stok.lotSeriNo}</td>
                          <td>
                            <span className={stok.kalanAdedi <= stok.kritikSeviye ? 'text-red-400 font-bold' : ''}>
                              {stok.kalanAdedi}
                            </span>
                            <span className="text-muted-foreground/40 mx-1">/</span>
                            <span className="text-muted-foreground">{stok.girisAdedi}</span>
                          </td>
                          <td>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-muted-foreground">{kullanimOrani}%</span>
                              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${kullanimOrani > 90 ? 'bg-red-500' : kullanimOrani > 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                                  style={{ width: `${kullanimOrani}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td><StokDurumBadge durum={stok.durum} /></td>
                          <td className="whitespace-nowrap">
                            <span className={sktAcil ? 'text-amber-400 font-bold' : 'text-muted-foreground'}>
                              {formatSKT(stok.skt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Analiz */}
        <div className="lg:w-80 space-y-6">
          <div className="glass-card p-6">
            <h3 className="section-title mb-6">Stok Özeti</h3>
            
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0c1422', borderColor: '#1c2840', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {kritikler.length > 0 && (
              <div className="alert-critical p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Kritik Uyarı</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {kritikler.length} ürün kritik seviyede. İkmal süreçlerini başlatın.
                </p>
              </div>
            )}
            
            {sktYaklasanlar.length > 0 && (
              <div className="alert-warning p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">SKT Yaklaşıyor</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sktYaklasanlar.length} ürünün kullanım ömrü dolmak üzere.
                </p>
              </div>
            )}
          </div>
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
