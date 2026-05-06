import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Activity, FlaskConical, Package, MapPin, Users, Loader2, Filter } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useData } from '../../contexts/DataContext';
import { pdf } from '@react-pdf/renderer';
import { TestKayitRaporuDoc } from '../../lib/pdf/TestKayitRaporu';
import { StokSeriNoRaporuDoc } from '../../lib/pdf/StokSeriNoRaporu';

const TOOLTIP_STYLE = {
  contentStyle: { 
    backgroundColor: 'hsl(224 44% 9.5%)', 
    border: '1px solid rgba(255,255,255,0.08)', 
    borderRadius: 12, 
    fontSize: 11,
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
  },
  labelStyle: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
};

const CHART_COLORS = ['#00D4FF', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
const PIE_COLORS_SONUC = ['#EF4444', '#10B981', '#F59E0B'];

type TabKey = 'test' | 'lab' | 'stok' | 'lokasyon' | 'personel';

const TABS: { key: TabKey; label: string; icon: typeof Activity }[] = [
  { key: 'test', label: 'Test Analitiği', icon: Activity },
  { key: 'lab', label: 'Lab Sevk Analitiği', icon: FlaskConical },
  { key: 'stok', label: 'Stok / SKT Analitiği', icon: Package },
  { key: 'lokasyon', label: 'Lokasyon Analitiği', icon: MapPin },
  { key: 'personel', label: 'Personel Analitiği', icon: Users },
];

function FiltrePaneli({ filtreler, onChange }: {
  filtreler: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="glass-card-inset p-5 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="section-title mb-1.5 block">Tarih Aralığı</label>
        <select
          value={filtreler.tarihAraligi}
          onChange={e => onChange('tarihAraligi', e.target.value)}
          className="premium-input text-xs"
        >
          <option value="7">Son 7 Gün</option>
          <option value="30">Son 30 Gün</option>
          <option value="90">Son 90 Gün</option>
          <option value="365">Son 1 Yıl</option>
          <option value="all">Tümü</option>
        </select>
      </div>
      <div>
        <label className="section-title mb-1.5 block">Lokasyon</label>
        <select
          value={filtreler.lokasyon}
          onChange={e => onChange('lokasyon', e.target.value)}
          className="premium-input text-xs"
        >
          <option value="">Tümü</option>
          {['Sınır Kapısı A', 'Sınır Kapısı B', 'Liman Kontrol Noktası', 'Antrepo Bölgesi', 'Araç Arama Noktası', 'Mobil Saha Ekibi', 'Havalimanı Kargo', 'Posta / Kargo Merkezi'].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="section-title mb-1.5 block">Sonuç</label>
        <select
          value={filtreler.sonuc}
          onChange={e => onChange('sonuc', e.target.value)}
          className="premium-input text-xs"
        >
          <option value="">Tümü</option>
          <option value="Pozitif">Pozitif</option>
          <option value="Negatif">Negatif</option>
          <option value="Geçersiz">Geçersiz</option>
        </select>
      </div>
      <div>
        <label className="section-title mb-1.5 block">Personel</label>
        <select
          value={filtreler.personel}
          onChange={e => onChange('personel', e.target.value)}
          className="premium-input text-xs"
        >
          <option value="">Tümü</option>
          {['K. Yıldız', 'B. Öztürk'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
}

function PdfIndir({ tip }: { tip: string }) {
  const { testKayitlari, stoklar } = useData();
  const [yukluyor, setYukluyor] = useState(false);

  const indir = async () => {
    setYukluyor(true);
    try {
      let blob: Blob;
      if (tip === 'stok') {
        blob = await pdf(<StokSeriNoRaporuDoc stoklar={stoklar} />).toBlob();
      } else {
        const kayitlar = tip === 'pozitif' ? testKayitlari.filter(t => t.testSonucu === 'Pozitif') : testKayitlari;
        if (kayitlar.length === 0) return;
        blob = await pdf(<TestKayitRaporuDoc kayit={kayitlar[0]} />).toBlob();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SENTEK-Rapor-${tip}-${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setYukluyor(false);
    }
  };

  return (
    <button
      onClick={indir}
      disabled={yukluyor}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
    >
      {yukluyor ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      PDF Raporu Al
    </button>
  );
}

export default function Reports() {
  const { testKayitlari, labSevkler, stoklar } = useData();
  const [aktifTab, setAktifTab] = useState<TabKey>('test');
  const [filtreler, setFiltreler] = useState({ tarihAraligi: '30', lokasyon: '', sonuc: '', personel: '' });

  const setFiltre = (key: string, val: string) => setFiltreler(prev => ({ ...prev, [key]: val }));

  const filtrelenmisTarih = (tarih: string) => {
    if (filtreler.tarihAraligi === 'all') return true;
    const days = parseInt(filtreler.tarihAraligi);
    return new Date(tarih).getTime() > Date.now() - days * 86400000;
  };

  const filtrelenmis = testKayitlari.filter(t =>
    filtrelenmisTarih(t.tarih) &&
    (!filtreler.lokasyon || t.lokasyon === filtreler.lokasyon) &&
    (!filtreler.sonuc || t.testSonucu === filtreler.sonuc) &&
    (!filtreler.personel || t.personelAdi === filtreler.personel)
  );

  const gunlukData = Array.from({ length: Math.min(parseInt(filtreler.tarihAraligi) || 30, 30) }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const gunTests = filtrelenmis.filter(t => t.tarih.startsWith(key));
    return {
      gun: d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      Toplam: gunTests.length,
      Pozitif: gunTests.filter(t => t.testSonucu === 'Pozitif').length,
      Negatif: gunTests.filter(t => t.testSonucu === 'Negatif').length,
    };
  });

  const sonucDagilim = [
    { name: 'Pozitif', value: filtrelenmis.filter(t => t.testSonucu === 'Pozitif').length },
    { name: 'Negatif', value: filtrelenmis.filter(t => t.testSonucu === 'Negatif').length },
    { name: 'Geçersiz', value: filtrelenmis.filter(t => t.testSonucu === 'Geçersiz').length },
  ];

  const lokasyonData = Object.entries(
    filtrelenmis.reduce((acc, t) => { acc[t.lokasyon] = (acc[t.lokasyon] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({
    name: name.replace(' Kontrol Noktası', '').replace(' Bölgesi', '').replace(' Merkezi', ''),
    value,
    pozitif: filtrelenmis.filter(t => t.lokasyon === name && t.testSonucu === 'Pozitif').length,
  }));

  const numuneTuruData = Object.entries(
    filtrelenmis.reduce((acc, t) => { acc[t.numuneTuru] = (acc[t.numuneTuru] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name: name.slice(0, 18), value }));

  const panelTipiData = Object.entries(
    filtrelenmis.reduce((acc, t) => { const p = t.kitPanelTipi || 'Bilinmiyor'; acc[p] = (acc[p] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const labDurumData = Object.entries(
    labSevkler.reduce((acc, s) => { acc[s.durum] = (acc[s.durum] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(' Edildi', '').replace('Kaydı', ''), value }));

  const sktData = stoklar.map(s => {
    const diff = new Date(s.skt).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    return { name: s.urunAdi.slice(0, 16), days, kalan: s.kalanAdedi, durum: s.durum };
  }).sort((a, b) => a.days - b.days).slice(0, 8);

  const personelData = Object.entries(
    filtrelenmis.reduce((acc, t) => {
      if (!acc[t.personelAdi]) acc[t.personelAdi] = { toplam: 0, pozitif: 0, negatif: 0, gecersiz: 0 };
      acc[t.personelAdi].toplam++;
      if (t.testSonucu === 'Pozitif') acc[t.personelAdi].pozitif++;
      if (t.testSonucu === 'Negatif') acc[t.personelAdi].negatif++;
      if (t.testSonucu === 'Geçersiz') acc[t.personelAdi].gecersiz++;
      return acc;
    }, {} as Record<string, { toplam: number; pozitif: number; negatif: number; gecersiz: number }>)
  ).map(([name, d]) => ({ name, ...d }));

  const guvenOrtalamalari = filtrelenmis
    .filter(t => t.analizGuvenSkoru !== undefined)
    .reduce((acc, t) => {
      const kriter = t.analizGuvenSkoru! >= 80 ? 'Yüksek (≥80)' : t.analizGuvenSkoru! >= 55 ? 'Orta (55-79)' : 'Düşük (<55)';
      acc[kriter] = (acc[kriter] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const guvenData = Object.entries(guvenOrtalamalari).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 space-y-6 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Raporlar & Analitik</h1>
          <p className="text-sm text-muted-foreground mt-1">Stratejik veri analizi ve PDF raporlama merkezi</p>
        </div>
        <div className="flex gap-2">
          <PdfIndir tip="test" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <FiltrePaneli filtreler={filtreler} onChange={setFiltre} />
        <div className="px-5 py-2.5 bg-secondary/10 border-t border-white/5 flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <Filter className="w-3 h-3" />
          <span>{filtrelenmis.length} kayıt filtrelendi</span>
          {filtreler.tarihAraligi !== 'all' && <span>• Son {filtreler.tarihAraligi} gün</span>}
          {filtreler.lokasyon && <span>• {filtreler.lokasyon}</span>}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="glass-card p-1.5 flex gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => {
          const isActive = aktifTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setAktifTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive ? 'bg-primary/10 border border-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={aktifTab} 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -12 }} 
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >

          {aktifTab === 'test' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Toplam Test', value: filtrelenmis.length, color: 'text-primary' },
                  { label: 'Pozitif', value: filtrelenmis.filter(t => t.testSonucu === 'Pozitif').length, color: 'text-red-400' },
                  { label: 'Negatif', value: filtrelenmis.filter(t => t.testSonucu === 'Negatif').length, color: 'text-emerald-400' },
                  { label: 'Geçersiz', value: filtrelenmis.filter(t => t.testSonucu === 'Geçersiz').length, color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-5">
                    <p className="metric-label">{s.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card-elevated p-6">
                  <h3 className="section-title mb-6">Test Yoğunluğu (Zaman Serisi)</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={gunlukData}>
                      <defs>
                        <linearGradient id="gradToplam" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradPozitif" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="gun" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Legend verticalAlign="top" align="right" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingBottom: 20 }} />
                      <Area type="monotone" dataKey="Toplam" stroke="#00D4FF" strokeWidth={3} fill="url(#gradToplam)" animationDuration={1000} />
                      <Area type="monotone" dataKey="Pozitif" stroke="#EF4444" strokeWidth={3} fill="url(#gradPozitif)" animationDuration={1000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card-elevated p-6">
                  <h3 className="section-title mb-6">Sonuç Dağılımı</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={sonucDagilim} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none" animationDuration={800}>
                        {sonucDagilim.map((_, i) => <Cell key={i} fill={PIE_COLORS_SONUC[i]} />)}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {sonucDagilim.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS_SONUC[i] }} />
                          <span className="text-xs text-muted-foreground font-medium">{d.name}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card-elevated p-6">
                  <h3 className="section-title mb-6">Panel Tipine Göre Kullanım</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={panelTipiData}>
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                        {panelTipiData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card-elevated p-6">
                  <h3 className="section-title mb-6">Analiz Güven Skoru Dağılımı</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={guvenData}>
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                        {guvenData.map((d, i) => <Cell key={i} fill={d.name.includes('Yüksek') ? '#10B981' : d.name.includes('Orta') ? '#F59E0B' : '#EF4444'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {aktifTab === 'lab' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Toplam Sevk', value: labSevkler.length, color: 'text-violet-400' },
                  { label: 'Bekleyen', value: labSevkler.filter(s => ['Sevk Kaydı Oluşturuldu', 'Numune Paketlendi', 'Laboratuvara Yolda'].includes(s.durum)).length, color: 'text-amber-400' },
                  { label: 'Aktif Analiz', value: labSevkler.filter(s => ['Laboratuvara Ulaştı', 'Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)).length, color: 'text-primary' },
                  { label: 'Tamamlanan', value: labSevkler.filter(s => ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-5">
                    <p className="metric-label">{s.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card-elevated p-6">
                <h3 className="section-title mb-6">Lab Sevk Durum Dağılımı</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={labDurumData} margin={{ bottom: 40 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {labDurumData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card-elevated p-6 overflow-hidden">
                <h3 className="section-title mb-6">Son Sevk Kayıtları</h3>
                <div className="overflow-x-auto">
                  <table className="w-full premium-table">
                    <thead>
                      <tr>
                        {['Takip No', 'Operasyon', 'Birim', 'Öncelik', 'Durum'].map(col => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {labSevkler.slice(0, 8).map(s => (
                        <tr key={s.id}>
                          <td className="font-mono text-primary font-bold">{s.numuneTakipNo}</td>
                          <td className="text-muted-foreground">{s.operasyonNo}</td>
                          <td className="font-medium">{s.sevkEdenBirim}</td>
                          <td>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${s.oncelik === 'Yüksek' ? 'text-red-400' : s.oncelik === 'Normal' ? 'text-primary' : 'text-muted-foreground'}`}>{s.oncelik}</span>
                          </td>
                          <td className="text-xs text-muted-foreground">{s.durum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {aktifTab === 'stok' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Toplam Ürün', value: stoklar.length, color: 'text-primary' },
                  { label: 'Kritik / Tükenen', value: stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length, color: 'text-red-400' },
                  { label: 'SKT Yaklaşan', value: stoklar.filter(s => s.durum === 'SKT Yaklaşıyor').length, color: 'text-amber-400' },
                  { label: 'Normal', value: stoklar.filter(s => s.durum === 'Normal').length, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-5">
                    <p className="metric-label">{s.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card-elevated p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="section-title">SKT Yaklaşan Ürünler</h3>
                  <PdfIndir tip="stok" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sktData.map((s, i) => {
                    const isKritik = s.days < 0;
                    const isYaklasan = s.days < 90 && s.days >= 0;
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-white/5 ${
                        isKritik ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : isYaklasan ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5'
                      }`}>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Stok: <span className="font-bold text-foreground">{s.kalan}</span> adet</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-lg font-black ${isKritik ? 'text-red-400' : isYaklasan ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {isKritik ? 'SÜRESİ DOLDU' : `${s.days} GÜN`}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Kalan Süre</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {aktifTab === 'lokasyon' && (
            <div className="space-y-6">
              <div className="glass-card-elevated p-6">
                <h3 className="section-title mb-6">Lokasyon Bazlı Test Hacmi</h3>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={lokasyonData} layout="vertical" margin={{ left: 30, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30} name="Toplam Test">
                      {lokasyonData.map((_, i) => <Cell key={i} fill={CHART_COLORS[0]} fillOpacity={0.8} />)}
                    </Bar>
                    <Bar dataKey="pozitif" radius={[0, 4, 4, 0]} maxBarSize={30} name="Pozitif Vaka">
                      {lokasyonData.map((_, i) => <Cell key={i} fill={CHART_COLORS[1]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {aktifTab === 'personel' && (
            <div className="space-y-6">
              <div className="glass-card-elevated p-6 overflow-hidden">
                <h3 className="section-title mb-6">Personel Performans Analitiği</h3>
                <div className="overflow-x-auto">
                  <table className="w-full premium-table">
                    <thead>
                      <tr>
                        <th>Personel</th>
                        <th className="text-center">Toplam</th>
                        <th className="text-center text-red-400">Pozitif</th>
                        <th className="text-center text-emerald-400">Negatif</th>
                        <th className="text-center text-amber-400">Geçersiz</th>
                        <th className="text-right">Pozitif Oranı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personelData.map(p => {
                        const oran = ((p.pozitif / p.toplam) * 100).toFixed(1);
                        return (
                          <tr key={p.name}>
                            <td className="font-bold">{p.name}</td>
                            <td className="text-center">{p.toplam}</td>
                            <td className="text-center text-red-400 font-medium">{p.pozitif}</td>
                            <td className="text-center text-emerald-400 font-medium">{p.negatif}</td>
                            <td className="text-center text-amber-400 font-medium">{p.gecersiz}</td>
                            <td className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                                  <div className="h-full bg-red-400" style={{ width: `${oran}%` }} />
                                </div>
                                <span className="font-mono text-xs text-muted-foreground">%{oran}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
