import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Package, FlaskConical, Activity, FileText, Settings, CheckCheck, RefreshCw } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { BildirimTur } from '../../types';

function formatTarih(t: string) {
  const diff = Date.now() - new Date(t).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Az önce';
  if (mins < 60) return `${mins} dk`;
  if (hours < 24) return `${hours} sa`;
  return `${days} gün`;
}

const TUR_IKON: Record<BildirimTur, typeof Bell> = {
  pozitif: AlertTriangle,
  stok: Package,
  lab: FlaskConical,
  analiz: Activity,
  rapor: FileText,
  sistem: Settings,
  sync: RefreshCw,
};

const TUR_RENK: Record<BildirimTur, string> = {
  pozitif: 'text-red-400 bg-red-500/10',
  stok: 'text-amber-400 bg-amber-500/10',
  lab: 'text-cyan-400 bg-cyan-500/10',
  analiz: 'text-violet-400 bg-violet-500/10',
  rapor: 'text-emerald-400 bg-emerald-500/10',
  sistem: 'text-slate-400 bg-slate-500/10',
  sync: 'text-emerald-400 bg-emerald-500/10',
};

export function NotificationBell() {
  const { bildirimler, okunmamisSayisi, bildirimOku, tumunuOku } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        data-testid="button-notification-bell"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-secondary/70 transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-4 h-4" />
        {okunmamisSayisi > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold leading-none"
          >
            {okunmamisSayisi > 9 ? '9+' : okunmamisSayisi}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 w-80 bg-card border border-card-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-[100] overflow-hidden"
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Bildirimler</p>
              <div className="flex items-center gap-2">
                {okunmamisSayisi > 0 && (
                  <span className="text-xs text-primary font-semibold">{okunmamisSayisi} okunmamış</span>
                )}
                <button
                  onClick={tumunuOku}
                  title="Tümünü okundu işaretle"
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {bildirimler.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p>Bildirim yok</p>
                </div>
              ) : (
                bildirimler.slice(0, 12).map(b => {
                  const Ikon = TUR_IKON[b.tur];
                  const renkCls = TUR_RENK[b.tur];
                  return (
                    <motion.button
                      key={b.id}
                      data-testid={`bildirim-${b.id}`}
                      onClick={() => bildirimOku(b.id)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      className={`w-full flex items-start gap-3 p-3 text-left border-b border-border/30 transition-colors ${b.okundu ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${renkCls}`}>
                        <Ikon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-snug line-clamp-2">{b.mesaj}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground/60">{formatTarih(b.tarih)}</span>
                          {b.operasyonNo && (
                            <span className="text-xs font-mono text-cyan-500/70">{b.operasyonNo}</span>
                          )}
                        </div>
                      </div>
                      {!b.okundu && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
