import React, { useState } from 'react';
import { 
  Home, Map, TestTube2, Package, BarChart3, Users, Settings, Bell, 
  ChevronRight, TrendingUp, TrendingDown, Minus 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock Data
const volumeData = [
  { name: 'Pzt', value: 142 },
  { name: 'Sal', value: 185 },
  { name: 'Çar', value: 164 },
  { name: 'Per', value: 210 },
  { name: 'Cum', value: 255 },
  { name: 'Cts', value: 190 },
  { name: 'Paz', value: 130 },
];

const resultDistribution = [
  { name: 'Pozitif', value: 85, color: '#f85149' },
  { name: 'Negatif', value: 420, color: '#2ea043' },
  { name: 'Geçersiz', value: 12, color: '#d29922' },
];

const alerts = [
  { id: 1, title: 'Yüksek yoğunluklu şüpheli materyal tespiti', location: 'Kapıkule Sınır Kapısı', time: '12 dk önce', level: 'high' },
  { id: 2, title: 'Stok seviyesi kritik eşikte', location: 'Habur Merkez Depo', time: '45 dk önce', level: 'medium' },
  { id: 3, title: 'Yeni saha operasyonu başlatıldı', location: 'Sarp Sınır Kapısı', time: '2 saat önce', level: 'info' },
  { id: 4, title: 'Lab sevk aracı varış yaptı', location: 'Ankara Merkez Lab', time: '3 saat önce', level: 'info' },
  { id: 5, title: 'Beklenmeyen test sonucu uyuşmazlığı', location: 'Mersin Limanı', time: '5 saat önce', level: 'high' },
];

const recentTests = [
  { id: 'TR-052', location: 'Kapıkule', result: 'Pozitif', kitId: 'K-99214', date: '24 Eki, 14:30' },
  { id: 'TR-051', location: 'Habur', result: 'Negatif', kitId: 'K-99213', date: '24 Eki, 14:15' },
  { id: 'TR-050', location: 'Cilvegözü', result: 'Negatif', kitId: 'K-99212', date: '24 Eki, 13:45' },
  { id: 'TR-049', location: 'Sarp', result: 'Geçersiz', kitId: 'K-99211', date: '24 Eki, 13:10' },
  { id: 'TR-048', location: 'Mersin Limanı', result: 'Pozitif', kitId: 'K-99210', date: '24 Eki, 12:55' },
  { id: 'TR-047', location: 'Kapıkule', result: 'Negatif', kitId: 'K-99209', date: '24 Eki, 11:30' },
  { id: 'TR-046', location: 'Kapıkule', result: 'Negatif', kitId: 'K-99208', date: '24 Eki, 11:25' },
  { id: 'TR-045', location: 'Habur', result: 'Negatif', kitId: 'K-99207', date: '24 Eki, 10:40' },
];

const COLORS = {
  bg: '#0d1117',
  card: '#161b22',
  border: '#21262d',
  accent: '#00D4FF',
  text: '#e6edf3',
  textSec: '#8b949e',
  red: '#f85149',
  green: '#2ea043',
  amber: '#d29922'
};

const navItems = [
  { icon: Home, label: 'Komuta Merkezi', active: true },
  { icon: Map, label: 'Saha Operasyonları' },
  { icon: TestTube2, label: 'Numune & Testler' },
  { icon: Package, label: 'Stok Yönetimi' },
  { icon: BarChart3, label: 'Analiz & Raporlar' },
  { icon: Users, label: 'Personel Yetkileri' },
  { icon: Settings, label: 'Sistem Ayarları' },
];

// Subcomponents
const KpiCard = ({ label, value, trend, sparkline }: { label: string, value: string, trend: 'up' | 'down' | 'flat', sparkline: number[] }) => {
  return (
    <div style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }} className="border rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden">
      <div className="text-[11px] font-semibold tracking-wider text-[#8b949e] uppercase mb-1">{label}</div>
      <div className="text-4xl font-bold text-[#e6edf3] tracking-tight">{value}</div>
      
      {/* Tiny Sparkline */}
      <div className="absolute bottom-4 right-4 w-16 h-8 opacity-60">
        <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d">
          <polyline 
            fill="none" 
            stroke={trend === 'up' ? COLORS.green : trend === 'down' ? COLORS.red : COLORS.textSec} 
            strokeWidth="2" 
            points={sparkline.map((val, i) => `${i * (100 / (sparkline.length - 1))},${30 - (val / Math.max(...sparkline)) * 30}`).join(' ')} 
          />
        </svg>
      </div>
    </div>
  );
};

export function PrecisionSuite() {
  return (
    <div className="flex min-h-screen w-full font-sans" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      
      {/* Sidebar */}
      <div className="w-[220px] flex-shrink-0 border-r flex flex-col" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
        <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-bold text-lg tracking-wide" style={{ color: COLORS.text }}>SENTEK<span style={{ color: COLORS.accent }}>.</span></div>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-1">
          {navItems.map((item, i) => (
            <button 
              key={i} 
              className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors relative ${item.active ? 'text-[#e6edf3] font-medium' : 'text-[#8b949e] hover:text-[#e6edf3]'}`}
            >
              {item.active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-sm" style={{ backgroundColor: COLORS.accent }} />
              )}
              <item.icon size={16} className={item.active ? 'opacity-100' : 'opacity-60'} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold">
              AK
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">Ahmet K.</span>
              <span className="text-xs text-[#8b949e]">Merkez Analist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 px-10 flex items-center justify-between border-b" style={{ borderColor: COLORS.border }}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Komuta Merkezi</h1>
            <div className="text-sm mt-1" style={{ color: COLORS.textSec }}>24 Ekim 2023, Perşembe</div>
          </div>
          <div className="flex items-center gap-4 text-[#8b949e]">
            <button className="hover:text-[#e6edf3] transition-colors relative">
              <Bell size={18} />
              <span className="absolute 1 top-0 right-0 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.accent }}></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-10 overflow-y-auto flex gap-10">
          
          <div className="flex-1 flex flex-col gap-10">
            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-6">
              <KpiCard label="GÜNLÜK TEST HACMİ" value="1,284" trend="up" sparkline={[30, 45, 40, 55, 50, 70, 85]} />
              <KpiCard label="POZİTİF TESPİT" value="42" trend="down" sparkline={[60, 55, 70, 45, 40, 30, 25]} />
              <KpiCard label="SAHA OPERASYONU" value="18" trend="flat" sparkline={[40, 42, 38, 45, 40, 42, 40]} />
              <KpiCard label="AKTİF KULLANICI" value="156" trend="up" sparkline={[20, 30, 40, 50, 70, 80, 90]} />
              <KpiCard label="LAB SEVK BEKLEYEN" value="14" trend="down" sparkline={[80, 70, 60, 40, 30, 20, 10]} />
              <KpiCard label="GEÇERSİZ TEST ORANI" value="%1.2" trend="flat" sparkline={[10, 12, 11, 10, 13, 11, 12]} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6 h-[320px]">
              
              {/* Line Chart */}
              <div className="border rounded-lg p-6 flex flex-col" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                <h3 className="text-sm font-medium mb-6" style={{ color: COLORS.textSec }}>7 Günlük Test Hacmi</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                      <XAxis dataKey="name" stroke={COLORS.textSec} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke={COLORS.textSec} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '6px', color: COLORS.text }}
                        itemStyle={{ color: COLORS.text }}
                      />
                      <Line type="monotone" dataKey="value" stroke={COLORS.accent} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: COLORS.bg, stroke: COLORS.accent, strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="border rounded-lg p-6 flex flex-col relative" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                <h3 className="text-sm font-medium mb-2" style={{ color: COLORS.textSec }}>Sonuç Dağılımı</h3>
                <div className="flex-1 flex justify-center items-center">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resultDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {resultDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '6px' }}
                        itemStyle={{ color: COLORS.text }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                    <span className="text-3xl font-bold text-[#e6edf3]">517</span>
                    <span className="text-xs text-[#8b949e]">Toplam</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-6 mt-4">
                  {resultDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: COLORS.textSec }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden flex flex-col" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
              <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: COLORS.border }}>
                <h3 className="text-sm font-medium text-[#e6edf3]">Son Test Kayıtları</h3>
                <button className="text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors flex items-center gap-1">
                  Tümünü Gör <ChevronRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-[#8b949e] uppercase bg-[#0d1117]">
                    <tr>
                      <th className="px-5 py-4 font-medium">Operasyon No</th>
                      <th className="px-5 py-4 font-medium">Lokasyon</th>
                      <th className="px-5 py-4 font-medium">Sonuç</th>
                      <th className="px-5 py-4 font-medium">Kit Seri No</th>
                      <th className="px-5 py-4 font-medium">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {recentTests.map((test, idx) => (
                      <tr key={idx} className="hover:bg-[#21262d]/50 transition-colors group cursor-pointer">
                        <td className="px-5 py-3 font-medium text-[#e6edf3]">{test.id}</td>
                        <td className="px-5 py-3 text-[#8b949e]">{test.location}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                            test.result === 'Pozitif' ? 'text-[#f85149] border-[#f85149]/30 bg-[#f85149]/10' :
                            test.result === 'Negatif' ? 'text-[#2ea043] border-[#2ea043]/30 bg-[#2ea043]/10' :
                            'text-[#d29922] border-[#d29922]/30 bg-[#d29922]/10'
                          }`}>
                            {test.result}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#8b949e] font-mono text-xs">{test.kitId}</td>
                        <td className="px-5 py-3 text-[#8b949e]">{test.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-[300px] flex-shrink-0 flex flex-col">
            <h3 className="text-sm font-medium mb-6 text-[#e6edf3]">Operasyonel Uyarılar</h3>
            
            <div className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 relative overflow-hidden bg-[#161b22] hover:bg-[#21262d]/60 transition-colors cursor-pointer" style={{ borderColor: COLORS.border }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ 
                    backgroundColor: alert.level === 'high' ? COLORS.red : alert.level === 'medium' ? COLORS.amber : COLORS.accent 
                  }} />
                  <div className="pl-2">
                    <p className="text-sm font-medium text-[#e6edf3] leading-snug mb-2">{alert.title}</p>
                    <div className="flex items-center justify-between text-xs text-[#8b949e]">
                      <span className="flex items-center gap-1"><Map size={12} /> {alert.location}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-2.5 border rounded-lg text-sm text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]/50 transition-colors" style={{ borderColor: COLORS.border }}>
              Tüm Uyarıları Görüntüle
            </button>
          </div>

        </main>
      </div>

    </div>
  );
}

export default PrecisionSuite;
