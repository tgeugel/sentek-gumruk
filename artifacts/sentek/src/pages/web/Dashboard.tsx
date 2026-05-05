import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { StatsCard } from '../../components/sentek/StatsCard';
import {
  FlaskConical, Package, AlertTriangle, TrendingUp,
  CheckCircle, XCircle, HelpCircle, Truck, Activity, MapPin
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const SON_7_GUN = GUNLER.map((gun, i) => ({
  gun,
  toplam: [12, 9, 15, 11, 18, 7, 14][i],
  pozitif: [3, 2, 5, 2, 6, 1, 4][i],
}));

const NUMUNE_DAGILIM = [
  { tur: 'Tır yakıt deposu', sayi: 42 },
  { tur: 'Toz madde', sayi: 31 },
  { tur: 'Paket/koli', sayi: 28 },
  { tur: 'Emdirilmiş kumaş', sayi: 19 },
  { tur: 'Sıvı numune', sayi: 15 },
  { tur: 'Diğer', sayi: 22 },
];

const CYAN = '#00D4FF';
const COLORS = ['#00D4FF', '#0099CC', '#7A8BA8', '#FF3D5A', '#10B981', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-card-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { testKayitlari, labSevkler, stoklar } = useData();

  const pozitifSayisi = testKayitlari.filter(t => t.testSonucu === 'Pozitif').length;
  const negatifSayisi = testKayitlari.filter(t => t.testSonucu === 'Negatif').length;
  const gecersizSayisi = testKayitlari.filter(t => t.testSonucu === 'Geçersiz').length;
  const analizBekleyen = labSevkler.filter(s => s.durum === 'Analiz Sırasında' || s.durum === 'Teslim Alındı').length;
  const kritikStok = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length;
  const sktYaklasan = stoklar.filter(s => s.durum === 'SKT Yaklaşıyor').length;
  const toplamStok = stoklar.reduce((acc, s) => acc + s.kalanAdedi, 0);

  const bugun = new Date().toDateString();
  const bugunTestler = testKayitlari.filter(t => new Date(t.tarih).toDateString() === bugun);

  const sonucDagilimi = [
    { name: 'Pozitif', value: pozitifSayisi, color: '#FF3D5A' },
    { name: 'Negatif', value: negatifSayisi, color: '#10B981' },
    { name: 'Geçersiz', value: gecersizSayisi, color: '#F59E0B' },
  ];

  const lokasyonSayisi: Record<string, number> = {};
  testKayitlari.forEach(t => {
    lokasyonSayisi[t.lokasyon] = (lokasyonSayisi[t.lokasyon] || 0) + 1;
  });
  const enYogunLokasyon = Object.entries(lokasyonSayisi).sort((a, b) => b[1] - a[1])[0];

  const labDurumDagilimi = labSevkler.reduce<Record<string, number>>((acc, s) => {
    acc[s.durum] = (acc[s.durum] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Operasyon genel görünümü · {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard baslik="Bugünkü Test" deger={bugunTestler.length} ikon={Activity} renk="cyan" index={0} />
        <StatsCard baslik="Pozitif Test" deger={pozitifSayisi} ikon={XCircle} renk="red" index={1} />
        <StatsCard baslik="Negatif Test" deger={negatifSayisi} ikon={CheckCircle} renk="green" index={2} />
        <StatsCard baslik="Geçersiz Test" deger={gecersizSayisi} ikon={HelpCircle} renk="amber" index={3} />
        <StatsCard baslik="Lab Sevk" deger={labSevkler.length} ikon={Truck} renk="violet" index={4} />
        <StatsCard baslik="Analiz Bekleyen" deger={analizBekleyen} ikon={FlaskConical} renk="blue" index={5} />
        <StatsCard baslik="Stok (Kalan Adet)" deger={toplamStok.toLocaleString('tr-TR')} ikon={Package} renk="cyan" index={6} alt={`${kritikStok} kritik, ${sktYaklasan} SKT yaklaşıyor`} />
        <StatsCard baslik="Toplam Test" deger={testKayitlari.length} ikon={TrendingUp} renk="green" index={7} />
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-xl p-4 border border-cyan-500/20">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">En Yoğun Lokasyon</p>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <p className="font-bold text-foreground">{enYogunLokasyon?.[0]}</p>
            <span className="text-sm text-cyan-400 font-semibold ml-auto">{enYogunLokasyon?.[1]} test</span>
          </div>
        </motion.div>
        {kritikStok > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card rounded-xl p-4 border border-red-500/20">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Stok Uyarısı</p>
            <div className="flex items-center gap-2 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="font-bold text-foreground">{kritikStok} ürün kritik</p>
              <span className="text-sm text-amber-400 font-semibold ml-auto">{sktYaklasan} SKT yaklaşıyor</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl border border-card-border p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Son 7 Gün Test Yoğunluğu</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SON_7_GUN}>
              <XAxis dataKey="gun" tick={{ fill: '#7A8BA8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7A8BA8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="toplam" stroke={CYAN} strokeWidth={2} dot={{ fill: CYAN, r: 3 }} name="Toplam" />
              <Line type="monotone" dataKey="pozitif" stroke="#FF3D5A" strokeWidth={2} dot={{ fill: '#FF3D5A', r: 3 }} name="Pozitif" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-xl border border-card-border p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Sonuç Dağılımı</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sonucDagilimi} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {sonucDagilimi.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-xl border border-card-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Numune Türüne Göre Test Dağılımı</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={NUMUNE_DAGILIM} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" tick={{ fill: '#7A8BA8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="tur" width={130} tick={{ fill: '#7A8BA8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sayi" fill={CYAN} radius={[0, 4, 4, 0]} name="Test Sayısı" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Lab Status */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-xl border border-card-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Lab Sevk Durum Özeti</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(labDurumDagilimi).map(([durum, sayi]) => (
            <div key={durum} className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-cyan-400">{sayi}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{durum}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
