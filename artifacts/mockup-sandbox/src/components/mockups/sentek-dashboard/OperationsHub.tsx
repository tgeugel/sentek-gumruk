import React from 'react';
import { 
  Shield, Activity, Package, Map, AlertTriangle, FileText, Settings, Users, 
  ArrowUpRight, ArrowDownRight, Clock, MapPin, Beaker, CheckCircle2,
  Menu, Bell, Search, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';

const Sidebar = () => {
  const navItems = [
    { icon: Activity, label: 'Operasyon Hub', color: '#06B6D4', active: true },
    { icon: Map, label: 'Saha İzleme', color: '#8B5CF6' },
    { icon: Beaker, label: 'Lab Süreci', color: '#F59E0B' },
    { icon: Package, label: 'Stok & Lojistik', color: '#22C55E' },
    { icon: FileText, label: 'Raporlar', color: '#EF4444' },
    { icon: Users, label: 'Personel', color: '#6B7280' },
    { icon: Settings, label: 'Ayarlar', color: '#6B7280' },
  ];

  return (
    <div className="w-[200px] flex-shrink-0 flex flex-col border-r border-[#374151] bg-[#111827] h-screen sticky top-0 p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Shield className="w-8 h-8 text-[#06B6D4]" />
        <span className="font-bold text-xl tracking-wider text-white">SENTEK</span>
      </div>
      <div className="flex flex-col gap-2">
        {navItems.map((item, i) => (
          <button 
            key={i} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              item.active ? 'bg-[#1f2937] text-white' : 'text-[#9ca3af] hover:bg-[#1f2937]/50 hover:text-white'
            }`}
          >
            <div 
              className="p-1.5 rounded-md flex items-center justify-center" 
              style={{ backgroundColor: item.active ? `\${item.color}20` : 'transparent' }}
            >
              <item.icon size={18} style={{ color: item.active ? item.color : 'currentColor' }} />
            </div>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const KPICard = ({ title, value, unit, change, isPositive, color, sparklineData }: any) => {
  return (
    <div 
      className="bg-[#1f2937] border border-[#374151] rounded-xl p-4 min-w-[160px] flex flex-col relative overflow-hidden"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundImage: `linear-gradient(to bottom, \${color}, transparent)` }}
      />
      <div className="text-[#9ca3af] text-xs font-medium mb-1 truncate">{title}</div>
      <div className="flex items-baseline gap-1 mb-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        {unit && <div className="text-sm text-[#9ca3af]">{unit}</div>}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className={`flex items-center text-xs font-medium \${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {change}
        </div>
        <div className="w-16 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Mock Data
const generateSparkline = () => Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 50) + 10 }));

const kpiData = [
  { title: "Aktif Saha Operasyonu", value: "142", change: "%12", isPositive: true, color: "#06B6D4" },
  { title: "Bugün Alınan Numune", value: "847", change: "%5", isPositive: true, color: "#3B82F6" },
  { title: "Pozitif Tespit", value: "64", change: "%18", isPositive: false, color: "#EF4444" },
  { title: "Negatif Tespit", value: "783", change: "%2", isPositive: true, color: "#22C55E" },
  { title: "Lab Sevk Bekleyen", value: "28", change: "4 artış", isPositive: false, color: "#F59E0B" },
  { title: "Lab Analiz Sürecinde", value: "156", change: "%8", isPositive: true, color: "#8B5CF6" },
  { title: "Kritik Stok Uyarıları", value: "12", change: "3 yeni", isPositive: false, color: "#EF4444" },
  { title: "Ortalama Sevk Süresi", value: "4.2", unit: "saat", change: "%15", isPositive: true, color: "#22C55E" },
];

const barData = [
  { name: '01 May', Negatif: 400, Pozitif: 24 },
  { name: '02 May', Negatif: 300, Pozitif: 18 },
  { name: '03 May', Negatif: 550, Pozitif: 45 },
  { name: '04 May', Negatif: 480, Pozitif: 32 },
  { name: '05 May', Negatif: 600, Pozitif: 55 },
  { name: '06 May', Negatif: 420, Pozitif: 28 },
  { name: '07 May', Negatif: 380, Pozitif: 20 },
  { name: '08 May', Negatif: 510, Pozitif: 40 },
  { name: '09 May', Negatif: 490, Pozitif: 35 },
  { name: '10 May', Negatif: 620, Pozitif: 48 },
  { name: '11 May', Negatif: 580, Pozitif: 42 },
  { name: '12 May', Negatif: 700, Pozitif: 65 },
  { name: '13 May', Negatif: 650, Pozitif: 50 },
  { name: '14 May', Negatif: 780, Pozitif: 60 },
];

const locationData = [
  { name: 'Kapıkule Sınır Kapısı', value: 840 },
  { name: 'Habur Sınır Kapısı', value: 650 },
  { name: 'Sarp Sınır Kapısı', value: 520 },
  { name: 'İstanbul Havalimanı', value: 480 },
  { name: 'Mersin Limanı', value: 390 },
];

const feedData = [
  { id: 1, type: 'Pozitif', loc: 'Kapıkule Peron 4', time: '2 dk önce', color: '#EF4444', desc: 'Şüpheli materyal tespiti' },
  { id: 2, type: 'Sevk', loc: 'Habur Merkez', time: '15 dk önce', color: '#F59E0B', desc: '12 numune yola çıktı' },
  { id: 3, type: 'Teslim', loc: 'Ankara Merkez Lab', time: '45 dk önce', color: '#8B5CF6', desc: 'Kurye teslimatı onaylandı' },
  { id: 4, type: 'Rapor', loc: 'İzmir Bölge Lab', time: '1 sa önce', color: '#06B6D4', desc: 'Analiz sonuçlandı' },
  { id: 5, type: 'Negatif', loc: 'Sarp Sınır Kapısı', time: '1.5 sa önce', color: '#22C55E', desc: 'Saha testi tamamlandı' },
  { id: 6, type: 'Pozitif', loc: 'Mersin Limanı', time: '2 sa önce', color: '#EF4444', desc: 'Şüpheli materyal tespiti' },
];

const pipelineData = [
  { id: 'TR-88234', step: 1, loc: 'Kapıkule', status: 'Sevk Bekliyor' },
  { id: 'TR-88235', step: 2, loc: 'Kurye Aracında', status: 'Yolda' },
  { id: 'TR-88236', step: 3, loc: 'Merkez Lab', status: 'Kabul Edildi' },
  { id: 'TR-88237', step: 4, loc: 'Merkez Lab', status: 'Analizde' },
  { id: 'TR-88238', step: 5, loc: 'Bölge Lab', status: 'Rapor Hazırlanıyor' },
];

const steps = ['Tarama', 'Sevk', 'Teslim', 'Analiz', 'Rapor'];

export function OperationsHub() {
  return (
    <div className="flex min-h-screen w-full font-sans" style={{ backgroundColor: '#111827', color: '#f9fafb' }}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#374151] bg-[#1f2937]/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-lg font-semibold">Bölge Operasyon Özeti</h1>
            <p className="text-xs text-[#9ca3af]">Son güncelleme: Saniyeler önce</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input 
                type="text" 
                placeholder="Seri No veya Konum Ara..." 
                className="bg-[#111827] border border-[#374151] rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-[#06B6D4] text-white w-64"
              />
            </div>
            <button className="relative p-2 text-[#9ca3af] hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06B6D4] to-[#3B82F6] flex items-center justify-center font-bold text-sm">
              M
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* KPI Strip */}
          <div className="w-full overflow-x-auto pb-4 pt-6 px-6 hide-scrollbar flex gap-4">
            {kpiData.map((kpi, i) => (
              <KPICard key={i} {...kpi} sparklineData={generateSparkline()} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6 px-6 pb-6">
            
            {/* Left Col (Charts) */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              
              {/* Stacked Bar Chart */}
              <div className="bg-[#1f2937] border border-[#374151] rounded-xl p-5 shadow-sm h-[320px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity size={16} className="text-[#06B6D4]" />
                    14 Günlük Saha Tespit Trendi
                  </h3>
                  <button className="text-xs bg-[#374151] px-2 py-1 rounded text-[#d1d5db] hover:text-white flex items-center gap-1">
                    <Filter size={12} /> Filtrele
                  </button>
                </div>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="Negatif" stackId="a" fill="#22C55E" radius={[0, 0, 4, 4]} maxBarSize={40} />
                      <Bar dataKey="Pozitif" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="bg-[#1f2937] border border-[#374151] rounded-xl p-5 shadow-sm h-[280px] flex flex-col">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-[#8B5CF6]" />
                  En Yoğun 5 Saha Noktası (Bugün)
                </h3>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={120} />
                      <Tooltip 
                        cursor={{fill: '#374151', opacity: 0.4}}
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Right Col */}
            <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              
              {/* Live Feed */}
              <div className="bg-[#1f2937] border border-[#374151] rounded-xl p-5 shadow-sm h-[320px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock size={16} className="text-[#F59E0B]" />
                    Canlı Akış
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {feedData.map((item) => (
                    <div key={item.id} className="flex gap-3 relative group">
                      <div className="w-px h-full bg-[#374151] absolute left-[5px] top-4 group-last:hidden"></div>
                      <div className="relative z-10 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px \${item.color}80` }}></div>
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between mb-1">
                          <span 
                            className="text-xs px-2 py-0.5 rounded font-medium" 
                            style={{ backgroundColor: `\${item.color}20`, color: item.color }}
                          >
                            {item.type}
                          </span>
                          <span className="text-xs text-[#9ca3af]">{item.time}</span>
                        </div>
                        <p className="text-sm font-medium text-[#f9fafb]">{item.loc}</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Pipeline */}
              <div className="bg-[#1f2937] border border-[#374151] rounded-xl p-5 shadow-sm h-[280px] flex flex-col">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Beaker size={16} className="text-[#06B6D4]" />
                  Lab Pipeline (Kritik)
                </h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {pipelineData.map((item, idx) => (
                    <div key={idx} className="bg-[#111827] rounded-lg p-3 border border-[#374151]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-[#06B6D4]">{item.id}</span>
                        <span className="text-xs text-[#9ca3af]">{item.loc}</span>
                      </div>
                      <div className="flex items-center justify-between relative mt-4">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#374151] -translate-y-1/2 z-0"></div>
                        <div 
                          className="absolute left-0 top-1/2 h-0.5 bg-[#06B6D4] -translate-y-1/2 z-0 transition-all duration-500"
                          style={{ width: `\${((item.step - 1) / 4) * 100}%` }}
                        ></div>
                        {steps.map((step, stepIdx) => {
                          const isCompleted = stepIdx + 1 < item.step;
                          const isCurrent = stepIdx + 1 === item.step;
                          return (
                            <div key={stepIdx} className="relative z-10 flex flex-col items-center gap-1 group">
                              <div 
                                className={`w-3 h-3 rounded-full border-2 transition-colors \${
                                  isCompleted ? 'bg-[#06B6D4] border-[#06B6D4]' : 
                                  isCurrent ? 'bg-[#111827] border-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 
                                  'bg-[#1f2937] border-[#374151]'
                                }`}
                              ></div>
                              <span className="text-[10px] text-[#9ca3af] absolute -bottom-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1f2937] px-1 rounded z-20">
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-xs text-right font-medium text-[#d1d5db]">
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Row - Kritik Süreçler */}
            <div className="col-span-12 mt-2">
              <h2 className="text-lg font-semibold mb-4 text-[#f9fafb]">Kritik Süreçler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. SKT Uyarı */}
                <div className="bg-[#1f2937] border border-[#EF4444]/30 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#EF4444]" />
                    SKT 30 Günden Az Kalanlar
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Saha Test Kiti Type-A', days: 12, total: 450, color: '#EF4444' },
                      { name: 'Saha Test Kiti Type-B', days: 18, total: 320, color: '#F59E0B' },
                      { name: 'Örneklem Tüpü 50ml', days: 24, total: 1200, color: '#F59E0B' },
                      { name: 'Eldiven (Nitril) M', days: 29, total: 8500, color: '#22C55E' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#d1d5db]">{item.name}</span>
                          <span className="font-medium" style={{ color: item.color }}>{item.days} gün</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#374151] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `\${(30 - item.days) / 30 * 100}%`, backgroundColor: item.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Analiz Bekleyen */}
                <div className="bg-[#1f2937] border border-[#F59E0B]/30 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-[#F59E0B]" />
                    Analiz Bekleyen Sevkler (En Eski)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 'SVK-9921', loc: 'Habur → Merkez Lab', wait: '48 sa', status: 'Kritik' },
                      { id: 'SVK-9924', loc: 'Sarp → Bölge Lab', wait: '36 sa', status: 'Gecikmiş' },
                      { id: 'SVK-9930', loc: 'İst. Hvl → Merkez Lab', wait: '24 sa', status: 'Normal' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#111827] p-2.5 rounded-lg border border-[#374151]">
                        <div>
                          <div className="text-xs font-medium text-[#d1d5db]">{item.id}</div>
                          <div className="text-[10px] text-[#9ca3af]">{item.loc}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-bold \${item.status === 'Kritik' ? 'text-[#EF4444]' : item.status === 'Gecikmiş' ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                            {item.wait}
                          </div>
                          <div className="text-[10px] text-[#9ca3af]">{item.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Kritik Stok */}
                <div className="bg-[#1f2937] border border-[#06B6D4]/30 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Package size={16} className="text-[#06B6D4]" />
                    Kritik Stok Seviyeleri
                  </h3>
                  <div className="space-y-4">
                    {[
                      { loc: 'Sarp Sınır Kapısı', item: 'Test Kiti', level: 12, limit: 20 },
                      { loc: 'Mersin Limanı', item: 'Mühür Bandı', level: 8, limit: 15 },
                      { loc: 'Kapıkule', item: 'Örneklem Kabı', level: 18, limit: 25 },
                      { loc: 'Merkez Depo', item: 'Reaktif Çözelti', level: 45, limit: 50 },
                    ].map((item, i) => {
                      const percent = (item.level / item.limit) * 100;
                      const color = percent < 50 ? '#EF4444' : percent < 80 ? '#F59E0B' : '#22C55E';
                      return (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#d1d5db]">{item.loc} <span className="text-[#9ca3af] ml-1">({item.item})</span></span>
                            <span className="font-medium text-[#f9fafb]">{item.level} / {item.limit}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#374151] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all" 
                              style={{ width: `\${Math.min(percent, 100)}%`, backgroundColor: color }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default OperationsHub;
