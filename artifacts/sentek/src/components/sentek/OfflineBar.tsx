import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function OfflineBar() {
  const { cevrimici, setCevrimici, senkronBekleyenSayisi, senkronizeEt } = useData();

  return (
    <div className="relative">
      {/* Offline / Online Toggle (simülasyon) */}
      <div className={`flex items-center gap-2 px-3 py-1.5 text-xs transition-all ${
        cevrimici
          ? senkronBekleyenSayisi > 0
            ? 'bg-amber-500/10 border-b border-amber-500/20'
            : 'bg-emerald-500/5 border-b border-emerald-500/10'
          : 'bg-red-500/10 border-b border-red-500/20'
      }`}>
        <button
          onClick={() => setCevrimici(!cevrimici)}
          title={cevrimici ? 'Çevrimdışı moda geç (simülasyon)' : 'Çevrimiçi moda geç'}
          className="flex-shrink-0"
        >
          {cevrimici
            ? <Wifi className="w-3 h-3 text-emerald-400" />
            : <WifiOff className="w-3 h-3 text-red-400" />
          }
        </button>

        <span className={`font-medium flex-1 ${
          cevrimici
            ? senkronBekleyenSayisi > 0 ? 'text-amber-400' : 'text-emerald-400'
            : 'text-red-400'
        }`}>
          {cevrimici
            ? senkronBekleyenSayisi > 0
              ? `${senkronBekleyenSayisi} kayıt senkron bekliyor`
              : 'Çevrimiçi'
            : 'Çevrimdışı — kayıtlar lokal tutulacak'
          }
        </span>

        <AnimatePresence>
          {cevrimici && senkronBekleyenSayisi > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={senkronizeEt}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors font-semibold"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Senkronize Et
            </motion.button>
          )}
        </AnimatePresence>

        {!cevrimici && (
          <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
