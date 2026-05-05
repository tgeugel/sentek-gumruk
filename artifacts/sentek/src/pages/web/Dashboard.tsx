import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import {
  FlaskConical, Package, AlertTriangle, TrendingUp,
  CheckCircle, XCircle, HelpCircle, Truck, Activity, Clock,
  Shield, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function StatsCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: typeof Activity; color: string; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 ${color.replace('text-', 'bg-').replace('-400', '-500/15').replace('-500', '-500/15')}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 11 },
  labelStyle: { color: '#94a3b8', fontSize: 10 },
};

const CHART_COLORS = ['#00D4FF', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const { testKayitlari, labSevkler, stoklar, bildirimler } = useData();

  const bugun = new Date().toISOString().slice(0, 10);
  const bugunTestler = testKayitlari.filter(t => t.tarih.startsWith(bugun));
  const pozitifler = testKayitlari.filter(t => t.testSonucu === 'Pozitif');
  const negatifler = testKayitlari.filter(t => t.testSonucu === 'Negatif');
  const gecersizler = testKayitlari.filter(t => t.testSonucu === 'Geçersiz');
  const labSevkEdilen = labSevkler.length;
  const analizBekleyen = labSevkler.filter(s => s.durum === 'Teslim Alındı' || s.durum === 'Analiz Sırasında').length;
  const raporlanan = labSevkler.filter(s => s.durum === 'Rapor Yüklendi' || s.durum === 'Dosya Kapatıldı').length;
  const kritikStok = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length;
  const sktYaklasan = stoklar.filter(s => s.durum === 'SKT Yaklaşıyor').length;
  const okunmamis = bildirimler.filter(b => !b.okundu).length;

  // Son 7 gün
  const son7Gun = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const gunTests = testKayitlari.filter(t => t.tarih.startsWith(key));
    return {
      gun: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
      Toplam: gunTests.length,
      Pozitif: gunTests.filter(t => t.testSonucu === 'Pozitif').length,
      Negatif: gunTests.filter(t => t.testSonucu === 'Negatif').length,
    };
  });

  // Pie chart
  const sonucDagilim = [
    { name: 'Pozitif', value: pozitifler.length },
    { name: 'Negatif', value: negatifler.length },
    { name: 'Geçersiz', value: gecersizler.length },
  ];
  const PIE_COLORS = ['#EF4444', '#10B981', '#F59E0B'];

  // Lokasyon bazlı
  const lokasyonMap: Record<string, number> = {};
  testKayitlari.forEach(t => { lokasyonMap[t.lokasyon] = (lokasyonMap[t.lokasyon] || 0) + 1; });
  const lokasyonData = Object.entries(lokasyonMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.replace(' Kontrol Noktası', '').replace(' Bölgesi', ''), value }));

  // Lab durum dağılımı
  const labDurumMap: Record<string, number> = {};
  labSevkler.forEach(s => { labDurumMap[s.durum] = (labDurumMap[s.durum] || 0) + 1; });
  const labDurumData = Object.entries(labDurumMap).map(([name, value]) => ({ name, value }));

  const uyarilar = [
    sktYaklasan > 0 && { tip: 'stok', mesaj: `SKT yaklaşan ${sktYaklasan} kit`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    kritikStok > 0 && { tip: 'stok', mesaj: `Kritik / tükenen ${kritikStok} stok kalemi`, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length > 0 && {
      tip: 'lab', mesaj: `Lab'a yolda ${labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length} numune`,
      color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    testKayitlari.filter(t => (t.analizGuvenSkoru || 100) < 55 && t.testSonucu === 'Geçersiz').length > 0 && {
      tip: 'analiz', mesaj: `Düşük güven skorlu ${testKayitlari.filter(t => (t.analizGuvenSkoru || 100) < 55 && t.testSonucu === 'Geçersiz').length} kayıt kontrol bekliyor`,
      color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20'
    },
    raporlanan > 0 && { tip: 'rapor', mesaj: `${raporlanan} numune rapor aşamasında`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ].filter(Boolean) as { tip: string; mesaj: string; color: string; bg: string }[];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-0.5">Operasyon Merkezi</h1>
        <p className="text-sm text-muted-foreground">Canlı operasyon verileri ve durum özeti</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Toplam Test', value: testKayitlari.length, icon: Activity, color: 'text-cyan-400' },
          { label: 'Bugünkü Test', value: bugunTestler.length, icon: Clock, color: 'text-blue-400', sub: new Date().toLocaleDateString('tr-TR') },
          { label: 'Pozitif Kayıt', value: pozitifler.length, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Negatif Kayıt', value: negatifler.length, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Geçersiz', value: gecersizler.length, icon: XCircle, color: 'text-amber-400' },
          { label: 'Lab Sevk', value: labSevkEdilen, icon: Truck, color: 'text-violet-400' },
          { label: 'Analiz Bekleyen', value: analizBekleyen, icon: FlaskConical, color: 'text-sky-400' },
          { label: 'Raporlanan', value: raporlanan, icon: TrendingUp, color: 'text-teal-400' },
          { label: 'Kritik Stok', value: kritikStok, icon: Package, color: 'text-orange-400' },
          { label: 'Okunmamış Bildirim', value: okunmamis, icon: Shield, color: 'text-pink-400' },
        ].map((c, i) => (
          <motion.div key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <StatsCard {...c} />
          </motion.div>
        ))}
      </div>

      {/* Operasyonel Uyarılar */}
      {uyarilar.length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-foreground">Operasyonel Uyarılar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {uyarilar.map((u, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium ${u.bg} ${u.color}`}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {u.mesaj}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grafikler Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Test Yoğunluğu */}
        <div className="lg:col-span-2 glass-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Son 7 Gün — Test Yoğunluğu</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={son7Gun}>
              <XAxis dataKey="gun" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="Toplam" stroke="#00D4FF" strokeWidth={2} dot={{ fill: '#00D4FF', r: 3 }} />
              <Line type="monotone" dataKey="Pozitif" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 3 }} />
              <Line type="monotone" dataKey="Negatif" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sonuç Dağılımı Pie */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Sonuç Dağılımı</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={sonucDagilim} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" stroke="none">
                {sonucDagilim.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            {sonucDagilim.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grafikler Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lokasyon Bazlı */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Lokasyon Bazlı Test Yoğunluğu</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={lokasyonData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#00D4FF" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lab Sevk Durum */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-foreground">Lab Sevk Durum Dağılımı</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={labDurumData}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} axisLine={false} tickLine={false}
                angle={-20} textAnchor="end" height={40} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {labDurumData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-foreground mb-3">Son Test Kayıtları</h3>
        <div className="space-y-2">
          {testKayitlari.slice(0, 6).map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                t.testSonucu === 'Pozitif' ? 'bg-red-400' :
                t.testSonucu === 'Negatif' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="text-xs font-mono text-muted-foreground/70 flex-shrink-0">{t.id}</span>
              <span className="text-xs text-foreground flex-1 truncate">{t.lokasyon}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">{t.numuneTuru}</span>
              <span className={`text-xs font-bold flex-shrink-0 ${
                t.testSonucu === 'Pozitif' ? 'text-red-400' :
                t.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'
              }`}>{t.testSonucu}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
