import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileBarChart, Download, X, ClipboardList, FlaskConical, Package, AlertTriangle, MapPin, Layers, BarChart3, Activity, Users, Loader2 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useData } from '../../contexts/DataContext';
import { pdf } from '@react-pdf/renderer';
import { TestKayitRaporuDoc } from '../../lib/pdf/TestKayitRaporu';
import { StokSeriNoRaporuDoc } from '../../lib/pdf/StokSeriNoRaporu';

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 11 },
  labelStyle: { color: '#94a3b8', fontSize: 10 },
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
    <div className="glass-card p-4 rounded-xl border border-card-border grid grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tarih Aralığı</label>
        <select
          value={filtreler.tarihAraligi}
          onChange={e => onChange('tarihAraligi', e.target.value)}
          className="w-full bg-secondary/50 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="7">Son 7 Gün</option>
          <option value="30">Son 30 Gün</option>
          <option value="90">Son 90 Gün</option>
          <option value="365">Son 1 Yıl</option>
          <option value="all">Tümü</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Lokasyon</label>
        <select
          value={filtreler.lokasyon}
          onChange={e => onChange('lokasyon', e.target.value)}
          className="w-full bg-secondary/50 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Tümü</option>
          {['Sınır Kapısı A', 'Sınır Kapısı B', 'Liman Kontrol Noktası', 'Antrepo Bölgesi', 'Araç Arama Noktası', 'Mobil Saha Ekibi', 'Havalimanı Kargo', 'Posta / Kargo Merkezi'].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Sonuç</label>
        <select
          value={filtreler.sonuc}
          onChange={e => onChange('sonuc', e.target.value)}
          className="w-full bg-secondary/50 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Tümü</option>
          <option value="Pozitif">Pozitif</option>
          <option value="Negatif">Negatif</option>
          <option value="Geçersiz">Geçersiz</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Personel</label>
        <select
          value={filtreler.personel}
          onChange={e => onChange('personel', e.target.value)}
          className="w-full bg-secondary/50 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
    >
      {yukluyor ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
      PDF İndir
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
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-0.5">Raporlar & Analitik</h1>
          <p className="text-sm text-muted-foreground">Filtreli veri analizi ve dışa aktarma</p>
        </div>
        <div className="flex gap-2">
          <PdfIndir tip="test" />
        </div>
      </div>

      <FiltrePaneli filtreler={filtreler} onChange={setFiltre} />

      <div className="text-xs text-muted-foreground">
        {filtrelenmis.length} kayıt gösteriliyor {filtreler.tarihAraligi !== 'all' ? `(son ${filtreler.tarihAraligi} gün)` : ''}
        {filtreler.lokasyon && ` · ${filtreler.lokasyon}`}
        {filtreler.sonuc && ` · ${filtreler.sonuc}`}
        {filtreler.personel && ` · ${filtreler.personel}`}
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 bg-secondary/20 rounded-xl p-1 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setAktifTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              aktifTab === tab.key ? 'bg-card text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={aktifTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {aktifTab === 'test' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Toplam Test', value: filtrelenmis.length, color: 'text-cyan-400' },
                  { label: 'Pozitif', value: filtrelenmis.filter(t => t.testSonucu === 'Pozitif').length, color: 'text-red-400' },
                  { label: 'Negatif', value: filtrelenmis.filter(t => t.testSonucu === 'Negatif').length, color: 'text-emerald-400' },
                  { label: 'Geçersiz', value: filtrelenmis.filter(t => t.testSonucu === 'Geçersiz').length, color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-4 rounded-xl border border-card-border">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass-card p-4 rounded-xl border border-card-border">
                  <h3 className="text-sm font-bold text-foreground mb-4">Test Yoğunluğu (Zaman Serisi)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={gunlukData}>
                      <defs>
                        <linearGradient id="gradToplam" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradPozitif" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="gun" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={20} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="Toplam" stroke="#00D4FF" strokeWidth={2} fill="url(#gradToplam)" />
                      <Area type="monotone" dataKey="Pozitif" stroke="#EF4444" strokeWidth={2} fill="url(#gradPozitif)" />
                      <Area type="monotone" dataKey="Negatif" stroke="#10B981" strokeWidth={1.5} fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card p-4 rounded-xl border border-card-border">
                  <h3 className="text-sm font-bold text-foreground mb-4">Pozitif/Negatif/Geçersiz Dağılımı</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={sonucDagilim} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                        {sonucDagilim.map((_, i) => <Cell key={i} fill={PIE_COLORS_SONUC[i]} />)}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {sonucDagilim.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS_SONUC[i] }} />
                          <span className="text-muted-foreground">{d.name}</span>
                        </div>
                        <span className="font-semibold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Panel Tipine Göre Kullanım</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={panelTipiData}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {panelTipiData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Analiz Güven Skoru Dağılımı</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={guvenData}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {guvenData.map((d, i) => <Cell key={i} fill={d.name.includes('Yüksek') ? '#10B981' : d.name.includes('Orta') ? '#F59E0B' : '#EF4444'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {aktifTab === 'lab' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Toplam Sevk', value: labSevkler.length, color: 'text-violet-400' },
                  { label: 'Bekleyen', value: labSevkler.filter(s => ['Sevk Kaydı Oluşturuldu', 'Numune Paketlendi', 'Laboratuvara Yolda'].includes(s.durum)).length, color: 'text-amber-400' },
                  { label: 'Aktif Analiz', value: labSevkler.filter(s => ['Laboratuvara Ulaştı', 'Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)).length, color: 'text-cyan-400' },
                  { label: 'Tamamlanan', value: labSevkler.filter(s => ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)).length, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-4 rounded-xl border border-card-border">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Lab Sevk Durum Dağılımı</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={labDurumData}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {labDurumData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Lab Sevk Kayıtları</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {['Takip No', 'Operasyon', 'Birim', 'Öncelik', 'Durum'].map(col => (
                          <th key={col} className="text-left py-2 px-2 font-semibold text-muted-foreground">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {labSevkler.slice(0, 10).map(s => (
                        <tr key={s.id} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="py-2 px-2 font-mono text-cyan-400">{s.numuneTakipNo}</td>
                          <td className="py-2 px-2 text-muted-foreground">{s.operasyonNo}</td>
                          <td className="py-2 px-2">{s.sevkEdenBirim}</td>
                          <td className="py-2 px-2">
                            <span className={`text-xs font-semibold ${s.oncelik === 'Yüksek' ? 'text-red-400' : s.oncelik === 'Normal' ? 'text-cyan-400' : 'text-muted-foreground'}`}>{s.oncelik}</span>
                          </td>
                          <td className="py-2 px-2 text-muted-foreground">{s.durum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {aktifTab === 'stok' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Toplam Ürün', value: stoklar.length, color: 'text-cyan-400' },
                  { label: 'Kritik / Tükenen', value: stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length, color: 'text-red-400' },
                  { label: 'SKT Yaklaşan', value: stoklar.filter(s => s.durum === 'SKT Yaklaşıyor').length, color: 'text-amber-400' },
                  { label: 'Normal', value: stoklar.filter(s => s.durum === 'Normal').length, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-4 rounded-xl border border-card-border">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground">SKT Yaklaşan Ürünler</h3>
                  <PdfIndir tip="stok" />
                </div>
                <div className="space-y-2">
                  {sktData.map((s, i) => {
                    const isKritik = s.days < 0;
                    const isYaklasan = s.days < 90 && s.days >= 0;
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                        isKritik ? 'bg-red-500/10 border-red-500/20' : isYaklasan ? 'bg-amber-500/10 border-amber-500/20' : 'bg-secondary/30 border-border'
                      }`}>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{s.name}</p>
                          <p className="text-muted-foreground mt-0.5">Kalan: {s.kalan} adet</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold ${isKritik ? 'text-red-400' : isYaklasan ? 'text-amber-400' : 'text-muted-foreground'}`}>
                            {isKritik ? 'SKT Geçmiş' : `${s.days} gün`}
                          </p>
                          <p className="text-muted-foreground/60">{s.durum}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Stok Kullanım Oranları</h3>
                <div className="space-y-3">
                  {stoklar.slice(0, 8).map(s => {
                    const oran = s.girisAdedi > 0 ? Math.round(s.kullanilanAdedi / s.girisAdedi * 100) : 0;
                    return (
                      <div key={s.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground font-medium truncate max-w-[200px]">{s.urunAdi}</span>
                          <span className="text-muted-foreground flex-shrink-0 ml-2">%{oran} kullanıldı</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              oran >= 90 ? 'bg-red-400' : oran >= 70 ? 'bg-amber-400' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${oran}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {aktifTab === 'lokasyon' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl border border-card-border">
                  <h3 className="text-sm font-bold text-foreground mb-4">Lokasyon Bazlı Test Sayısı</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={lokasyonData} layout="vertical">
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Bar dataKey="value" fill="#00D4FF" radius={[0, 4, 4, 0]} maxBarSize={18} name="Toplam" />
                      <Bar dataKey="pozitif" fill="#EF4444" radius={[0, 4, 4, 0]} maxBarSize={18} name="Pozitif" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card p-4 rounded-xl border border-card-border">
                  <h3 className="text-sm font-bold text-foreground mb-4">Numune Türü Dağılımı</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={numuneTuruData} layout="vertical">
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={110} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                        {numuneTuruData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Lokasyon Detay Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {['Lokasyon', 'Toplam Test', 'Pozitif', 'Negatif', 'Geçersiz', 'Pozitiflik Oranı'].map(col => (
                          <th key={col} className="text-left py-2 px-2 font-semibold text-muted-foreground whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lokasyonData.map(l => {
                        const toplam = filtrelenmis.filter(t => t.lokasyon.startsWith(l.name.slice(0, 8))).length;
                        const pozitif = filtrelenmis.filter(t => t.lokasyon.startsWith(l.name.slice(0, 8)) && t.testSonucu === 'Pozitif').length;
                        const negatif = filtrelenmis.filter(t => t.lokasyon.startsWith(l.name.slice(0, 8)) && t.testSonucu === 'Negatif').length;
                        const gecersiz = filtrelenmis.filter(t => t.lokasyon.startsWith(l.name.slice(0, 8)) && t.testSonucu === 'Geçersiz').length;
                        const oran = toplam > 0 ? Math.round(pozitif / toplam * 100) : 0;
                        return (
                          <tr key={l.name} className="border-b border-border/30 hover:bg-secondary/20">
                            <td className="py-2 px-2 font-medium">{l.name}</td>
                            <td className="py-2 px-2 text-cyan-400 font-bold">{l.value}</td>
                            <td className="py-2 px-2 text-red-400">{l.pozitif}</td>
                            <td className="py-2 px-2 text-emerald-400">{negatif}</td>
                            <td className="py-2 px-2 text-amber-400">{gecersiz}</td>
                            <td className="py-2 px-2">
                              <span className={`font-bold ${oran >= 30 ? 'text-red-400' : oran >= 15 ? 'text-amber-400' : 'text-emerald-400'}`}>%{oran}</span>
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

          {aktifTab === 'personel' && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Personel Bazlı İşlem Sayısı</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={personelData}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="toplam" name="Toplam" fill="#00D4FF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="pozitif" name="Pozitif" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="negatif" name="Negatif" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="gecersiz" name="Geçersiz" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-4 rounded-xl border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Personel Performans Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {['Personel', 'Toplam Test', 'Pozitif', 'Negatif', 'Geçersiz', 'Pozitiflik Oranı'].map(col => (
                          <th key={col} className="text-left py-2 px-2 font-semibold text-muted-foreground">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {personelData.map(p => {
                        const oran = p.toplam > 0 ? Math.round(p.pozitif / p.toplam * 100) : 0;
                        return (
                          <tr key={p.name} className="border-b border-border/30 hover:bg-secondary/20">
                            <td className="py-2.5 px-2 font-semibold">{p.name}</td>
                            <td className="py-2.5 px-2 text-cyan-400 font-bold">{p.toplam}</td>
                            <td className="py-2.5 px-2 text-red-400">{p.pozitif}</td>
                            <td className="py-2.5 px-2 text-emerald-400">{p.negatif}</td>
                            <td className="py-2.5 px-2 text-amber-400">{p.gecersiz}</td>
                            <td className="py-2.5 px-2 font-bold text-primary">%{oran}</td>
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
