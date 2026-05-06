import React from 'react';
import { 
  Shield, AlertTriangle, Package, Activity, TrendingUp, MapPin, 
  Clock, ChevronRight, FlaskConical, Zap, 
  Settings, Users, BarChart2, Layers
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// --- MOCK DATA ---
const kpiData = [
  { id: 1, label: 'BUGÜNKÜ TEST', value: '1,482', delta: '+12%', icon: Activity, color: '#00D4FF' },
  { id: 2, label: 'POZİTİF', value: '47', delta: '+3', icon: AlertTriangle, color: '#EF4444' },
  { id: 3, label: 'NEGATİF', value: '1,390', delta: '-2%', icon: Shield, color: '#10B981' },
  { id: 4, label: 'GEÇERSİZ', value: '45', delta: '-1', icon: Zap, color: '#F59E0B' },
  { id: 5, label: 'LAB SEVK', value: '82', delta: '+14', icon: FlaskConical, color: '#00D4FF' },
  { id: 6, label: 'ANALİZ BEKLENİYOR', value: '18', delta: '-5', icon: Clock, color: '#F59E0B' },
  { id: 7, label: 'KRİTİK STOK', value: '3', delta: '+1', icon: Package, color: '#EF4444' },
  { id: 8, label: 'BİLDİRİM', value: '12', delta: '+4', icon: Activity, color: '#00D4FF' },
];

const testVolumeData = [
  { time: '00:00', vol: 45 }, { time: '04:00', vol: 20 }, { time: '08:00', vol: 150 },
  { time: '12:00', vol: 380 }, { time: '16:00', vol: 420 }, { time: '20:00', vol: 210 },
  { time: '24:00', vol: 90 },
];

const locationData = [
  { name: 'KAPIKULE', tests: 450 },
  { name: 'HABUR', tests: 320 },
  { name: 'GÜRBULAK', tests: 280 },
  { name: 'İPSALA', tests: 210 },
  { name: 'SARP', tests: 180 },
];

const eventFeed = [
  { id: 1, time: '14:22:05', type: 'critical', loc: 'KAPIKULE', desc: 'TR-048 Şüpheli materyal pozitif tespit (Kokain)' },
  { id: 2, time: '14:20:12', type: 'info', loc: 'HABUR', desc: 'Stok sevkiyatı onaylandı (Seri: 884-A)' },
  { id: 3, time: '14:18:44', type: 'warning', loc: 'GÜRBULAK', desc: 'Geçersiz test - Prosedür ihlali uyarısı' },
  { id: 4, time: '14:15:02', type: 'safe', loc: 'İPSALA', desc: 'TR-047 Saha operasyonu negatif sonuç' },
  { id: 5, time: '14:12:33', type: 'info', loc: 'SARP', desc: 'Lab sevk işlemi başlatıldı (Numune: 9921)' },
  { id: 6, time: '14:08:15', type: 'critical', loc: 'KAPIKULE', desc: 'TR-046 Şüpheli materyal pozitif tespit (Metamfetamin)' },
  { id: 7, time: '14:05:55', type: 'safe', loc: 'HABUR', desc: 'Rutin kontrol negatif tamamlandı' },
  { id: 8, time: '14:02:10', type: 'warning', loc: 'İPSALA', desc: 'SKT yaklaşan kit uyarısı (Parti: 11A)' },
  { id: 9, time: '13:58:40', type: 'info', loc: 'GÜRBULAK', desc: 'Saha operasyonu başlatıldı (Bölge: Doğu-1)' },
  { id: 10, time: '13:55:22', type: 'info', loc: 'KAPIKULE', desc: 'Günlük kalibrasyon tamamlandı' },
  { id: 11, time: '13:50:05', type: 'safe', loc: 'SARP', desc: 'Rutin kontrol negatif tamamlandı' },
  { id: 12, time: '13:45:18', type: 'warning', loc: 'HABUR', desc: 'Kritik stok seviyesi: NarcoTest-A' },
];

const labQueue = [
  { id: 'L-8821', loc: 'KAPIKULE', priority: 'YÜKSEK', status: 'YOLDA' },
  { id: 'L-8822', loc: 'GÜRBULAK', priority: 'NORMAL', status: 'BEKLİYOR' },
  { id: 'L-8823', loc: 'HABUR', priority: 'ACİL', status: 'ANALİZDE' },
  { id: 'L-8824', loc: 'İPSALA', priority: 'NORMAL', status: 'BEKLİYOR' },
];

const stockAlerts = [
  { item: 'N-TEST KİTİ', loc: 'KAPIKULE', current: 45, required: 100 },
  { item: 'KORUYUCU ELDİVEN', loc: 'HABUR', current: 120, required: 500 },
  { item: 'NUMUNE KABI', loc: 'SARP', current: 80, required: 200 },
  { item: 'REAKTİF SIVI', loc: 'GÜRBULAK', current: 15, required: 50 },
];

const expiryAlerts = [
  { batch: 'BT-992', item: 'N-TEST KİTİ', loc: 'İPSALA', expiry: '2 GÜN' },
  { batch: 'BT-985', item: 'REAKTİF SIVI', loc: 'KAPIKULE', expiry: '5 GÜN' },
  { batch: 'BT-970', item: 'NUMUNE KABI', loc: 'HABUR', expiry: '12 GÜN' },
  { batch: 'BT-966', item: 'N-TEST KİTİ', loc: 'GÜRBULAK', expiry: '14 GÜN' },
];

export function CommandCore() {
  return (
    <div 
      className="min-h-screen w-full flex overflow-hidden" 
      style={{
        backgroundColor: '#07090d', 
        color: '#e2e8f0', 
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* SIDEBAR */}
      <div 
        className="w-[48px] h-screen flex flex-col items-center py-4 border-r shrink-0 z-10"
        style={{ borderColor: '#1e293b', backgroundColor: '#0a0d14' }}
      >
        <div className="mb-8 p-2 rounded" style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}>
          <Shield size={20} color="#00D4FF" />
        </div>
        <div className="flex flex-col gap-6 items-center flex-1">
          <Activity size={18} color="#e2e8f0" className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
          <MapPin size={18} color="#e2e8f0" className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
          <Layers size={18} color="#e2e8f0" className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
          <BarChart2 size={18} color="#e2e8f0" className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
          <Users size={18} color="#e2e8f0" className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
        <div className="mt-auto">
          <Settings size={18} color="#e2e8f0" className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <div 
          className="h-[48px] w-full flex items-center px-4 border-b shrink-0 justify-between"
          style={{ borderColor: '#1e293b', backgroundColor: '#0a0d14' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.2em] font-semibold text-[#00D4FF]">SENTEK // COMMAND CORE</span>
            <span className="text-[10px] text-slate-500 font-mono">SYS.VER: 4.2.1</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              <span className="text-[10px] tracking-widest text-slate-400">SİSTEM AKTİF</span>
            </div>
            <span className="text-[12px] font-mono text-slate-300">14:22:05 TSİ</span>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-auto flex flex-col gap-4">
          
          {/* KPI STRIP */}
          <div className="grid grid-cols-8 gap-3 shrink-0">
            {kpiData.map(kpi => (
              <div 
                key={kpi.id} 
                className="flex flex-col p-3 border rounded-sm relative overflow-hidden"
                style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-[2px]" 
                  style={{ backgroundColor: kpi.color, opacity: 0.8 }}
                ></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] tracking-widest text-slate-400 truncate pr-2">{kpi.label}</span>
                  <kpi.icon size={12} color={kpi.color} className="shrink-0" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-mono text-xl font-medium leading-none" style={{ color: '#f8fafc' }}>{kpi.value}</span>
                  <span 
                    className="font-mono text-[10px] px-1 rounded-sm" 
                    style={{ 
                      backgroundColor: kpi.delta.startsWith('+') && kpi.id !== 3 ? 'rgba(239, 68, 68, 0.1)' : kpi.delta.startsWith('-') && kpi.id === 3 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: kpi.delta.startsWith('+') && (kpi.id === 2 || kpi.id === 7) ? '#EF4444' : kpi.delta.startsWith('-') && kpi.id === 3 ? '#10B981' : '#94a3b8'
                    }}
                  >
                    {kpi.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* MID SECTION */}
          <div className="flex gap-4 flex-1 min-h-[300px]">
            
            {/* LEFT COL: CHARTS */}
            <div className="w-[65%] flex flex-col gap-4">
              <div className="flex-1 border rounded-sm p-4 flex flex-col relative" style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}>
                <span className="text-[10px] tracking-widest text-slate-400 mb-4">TEST HACMİ (24S)</span>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={testVolumeData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#00D4FF' }}
                      />
                      <Line type="monotone" dataKey="vol" stroke="#00D4FF" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#00D4FF', stroke: '#0a0d14', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="h-[140px] border rounded-sm p-4 flex flex-col" style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}>
                <span className="text-[10px] tracking-widest text-slate-400 mb-2">LOKASYON DAĞILIMI</span>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                      <Bar dataKey="tests" fill="#334155" radius={[0, 2, 2, 0]} barSize={12}>
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#00D4FF' : '#334155'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT COL: FEED */}
            <div className="w-[35%] border rounded-sm flex flex-col" style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}>
              <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: '#1e293b' }}>
                <span className="text-[10px] tracking-widest text-slate-400">CANLI AKIŞ</span>
                <span className="flex items-center gap-1 text-[9px] text-[#00D4FF] uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse"></div> Live
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 scrollbar-hide flex flex-col gap-1">
                {eventFeed.map(event => {
                  let badgeColor = '#3b82f6'; // info
                  let badgeBg = 'rgba(59, 130, 246, 0.1)';
                  if (event.type === 'critical') {
                    badgeColor = '#EF4444';
                    badgeBg = 'rgba(239, 68, 68, 0.1)';
                  } else if (event.type === 'warning') {
                    badgeColor = '#F59E0B';
                    badgeBg = 'rgba(245, 158, 11, 0.1)';
                  } else if (event.type === 'safe') {
                    badgeColor = '#10B981';
                    badgeBg = 'rgba(16, 185, 129, 0.1)';
                  }

                  return (
                    <div 
                      key={event.id} 
                      className="flex items-start gap-3 p-2 hover:bg-[#1e293b] rounded transition-colors group"
                    >
                      <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-[2px] group-hover:text-slate-400 transition-colors">{event.time}</span>
                      <div 
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-[6px]" 
                        style={{ backgroundColor: badgeColor }}
                      ></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-mono text-slate-400 mb-0.5 uppercase tracking-wider">{event.loc}</span>
                        <span className="text-[11px] text-slate-300 leading-snug break-words truncate" title={event.desc}>
                          {event.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-3 gap-4 shrink-0">
            {/* Table 1: Lab Queue */}
            <div className="border rounded-sm flex flex-col h-[180px]" style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}>
              <div className="p-3 border-b" style={{ borderColor: '#1e293b' }}>
                <span className="text-[10px] tracking-widest text-slate-400">LAB KUYRUĞU</span>
              </div>
              <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-[9px] text-slate-500 font-mono" style={{ borderColor: '#1e293b' }}>
                      <th className="p-2 font-normal pl-3">ID</th>
                      <th className="p-2 font-normal">LOKASYON</th>
                      <th className="p-2 font-normal">ÖNCELİK</th>
                      <th className="p-2 font-normal pr-3">DURUM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labQueue.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-[#1e293b]" style={{ borderColor: '#1e293b' }}>
                        <td className="p-2 pl-3 text-[11px] font-mono text-slate-300">{row.id}</td>
                        <td className="p-2 text-[10px] text-slate-400">{row.loc}</td>
                        <td className="p-2">
                          <span 
                            className="text-[9px] px-1.5 py-0.5 rounded-sm"
                            style={{ 
                              backgroundColor: row.priority === 'ACİL' ? 'rgba(239, 68, 68, 0.1)' : row.priority === 'YÜKSEK' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)',
                              color: row.priority === 'ACİL' ? '#EF4444' : row.priority === 'YÜKSEK' ? '#F59E0B' : '#94a3b8'
                            }}
                          >
                            {row.priority}
                          </span>
                        </td>
                        <td className="p-2 pr-3 text-[10px] text-slate-300">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Stock Alerts */}
            <div className="border rounded-sm flex flex-col h-[180px]" style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}>
              <div className="p-3 border-b" style={{ borderColor: '#1e293b' }}>
                <span className="text-[10px] tracking-widest text-slate-400">KRİTİK STOK UYARILARI</span>
              </div>
              <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-[9px] text-slate-500 font-mono" style={{ borderColor: '#1e293b' }}>
                      <th className="p-2 font-normal pl-3">MATERYAL</th>
                      <th className="p-2 font-normal">LOKASYON</th>
                      <th className="p-2 font-normal text-right pr-3">MEVCUT / GEREKEN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockAlerts.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-[#1e293b]" style={{ borderColor: '#1e293b' }}>
                        <td className="p-2 pl-3 text-[10px] text-slate-300">{row.item}</td>
                        <td className="p-2 text-[10px] text-slate-400">{row.loc}</td>
                        <td className="p-2 pr-3 text-right">
                          <span className="font-mono text-[11px] text-[#EF4444]">{row.current}</span>
                          <span className="font-mono text-[11px] text-slate-500 mx-1">/</span>
                          <span className="font-mono text-[11px] text-slate-400">{row.required}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: Expiry Alerts */}
            <div className="border rounded-sm flex flex-col h-[180px]" style={{ backgroundColor: '#111827', borderColor: '#1e293b' }}>
              <div className="p-3 border-b" style={{ borderColor: '#1e293b' }}>
                <span className="text-[10px] tracking-widest text-slate-400">SKT YAKLAŞAN KİTLER</span>
              </div>
              <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-[9px] text-slate-500 font-mono" style={{ borderColor: '#1e293b' }}>
                      <th className="p-2 font-normal pl-3">PARTİ NO</th>
                      <th className="p-2 font-normal">MATERYAL</th>
                      <th className="p-2 font-normal">LOKASYON</th>
                      <th className="p-2 font-normal text-right pr-3">SÜRE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiryAlerts.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-[#1e293b]" style={{ borderColor: '#1e293b' }}>
                        <td className="p-2 pl-3 text-[11px] font-mono text-slate-300">{row.batch}</td>
                        <td className="p-2 text-[10px] text-slate-400">{row.item}</td>
                        <td className="p-2 text-[10px] text-slate-400">{row.loc}</td>
                        <td className="p-2 pr-3 text-right text-[10px] text-[#F59E0B] font-medium">{row.expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* GLOBAL CSS FOR SCROLLBAR HIDING */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
