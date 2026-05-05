import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  baslik: string;
  deger: string | number;
  ikon: LucideIcon;
  renk?: 'cyan' | 'green' | 'red' | 'amber' | 'violet' | 'blue';
  alt?: string;
  index?: number;
}

const renkler = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'hover:shadow-[0_0_20px_rgba(0,212,255,0.12)]' },
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.12)]' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.12)]' },
};

export function StatsCard({ baslik, deger, ikon: Icon, renk = 'cyan', alt, index = 0 }: StatsCardProps) {
  const r = renkler[renk];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`glass-card rounded-xl p-5 border ${r.border} ${r.glow} transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{baslik}</p>
          <p className={`text-3xl font-bold ${r.text}`}>{deger}</p>
          {alt && <p className="text-xs text-muted-foreground mt-1">{alt}</p>}
        </div>
        <div className={`${r.bg} p-3 rounded-lg`}>
          <Icon className={`w-5 h-5 ${r.text}`} />
        </div>
      </div>
    </motion.div>
  );
}
