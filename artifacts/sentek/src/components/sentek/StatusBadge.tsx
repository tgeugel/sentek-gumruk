import { TestSonucu, LabSevkDurumu } from '../../types';

interface TestSonucBadgeProps {
  sonuc: TestSonucu;
  size?: 'sm' | 'md';
}

export function TestSonucBadge({ sonuc, size = 'md' }: TestSonucBadgeProps) {
  const base = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const variants: Record<TestSonucu, string> = {
    'Pozitif': 'bg-red-500/15 text-red-400 border border-red-500/30',
    'Negatif': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    'Geçersiz': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full font-semibold tracking-wide ${base} ${variants[sonuc]}`}>
      {sonuc}
    </span>
  );
}

interface LabDurumBadgeProps {
  durum: LabSevkDurumu | string;
  size?: 'sm' | 'md';
}

const LAB_DURUM_RENK: Record<string, string> = {
  'Pozitif Tespit Edildi': 'bg-red-500/15 text-red-400 border border-red-500/30',
  'Sevk Kaydı Oluşturuldu': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  'Numune Paketlendi': 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
  'Laboratuvara Yolda': 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  'Laboratuvara Ulaştı': 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  'Teslim Alındı': 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
  'Analiz Sırasında': 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  'Rapor Yüklendi': 'bg-green-500/15 text-green-400 border border-green-500/30',
  'Dosya Kapatıldı': 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
};

export function LabDurumBadge({ durum, size = 'md' }: LabDurumBadgeProps) {
  const base = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const cls = LAB_DURUM_RENK[durum] || 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${base} ${cls}`}>
      {durum}
    </span>
  );
}

interface StokDurumBadgeProps {
  durum: string;
}

export function StokDurumBadge({ durum }: StokDurumBadgeProps) {
  const variants: Record<string, string> = {
    'Normal': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    'Kritik': 'bg-red-500/15 text-red-400 border border-red-500/30',
    'SKT Yaklaşıyor': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    'Tükendi': 'bg-red-900/30 text-red-300 border border-red-700/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[durum] || ''}`}>
      {durum}
    </span>
  );
}

interface OncelikBadgeProps {
  oncelik: string;
}

export function OncelikBadge({ oncelik }: OncelikBadgeProps) {
  const variants: Record<string, string> = {
    'Yüksek': 'bg-red-500/15 text-red-400 border border-red-500/30',
    'Normal': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    'Düşük': 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[oncelik] || ''}`}>
      {oncelik}
    </span>
  );
}
