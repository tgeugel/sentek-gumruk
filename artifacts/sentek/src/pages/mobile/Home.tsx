import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Plus, ClipboardList, Truck, QrCode, RefreshCw, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

function formatTarih(tarih: string) {
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function MobileHome() {
  const { kullanici } = useAuth();
  const { testKayitlari, labSevkler, senkronBekleyenSayisi, senkronizeEt, cevrimici } = useData();

  const bugun = new Date().toDateString();
  const bugunTestler = testKayitlari.filter(t => new Date(t.tarih).toDateString() === bugun);
  const pozitifler = testKayitlari.filter(t => t.testSonucu === 'Pozitif');
  const bekleyenSevk = testKayitlari.filter(t => t.testSonucu === 'Pozitif' && !t.labSevkDurumu);
  const sonKayitlar = testKayitlari.slice(0, 5);

  const istatistikler = [
    { baslik: 'BUGÜNKÜ TEST', deger: bugunTestler.length, renk: 'text-cyan-400' },
    { baslik: 'POZİTİF KAYIT', deger: pozitifler.length, renk: 'text-red-400' },
    { baslik: 'SEVK BEKLEYEN', deger: bekleyenSevk.length, renk: 'text-amber-400' },
    { baslik: 'TOPLAM SEVK', deger: labSevkler.length, renk: 'text-emerald-400' },
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="p-4 space-y-5 page-enter">
      {/* 1. GREETING BLOCK */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1.5">SAHA MODU</p>
          <h1 className="text-[28px] font-bold text-foreground leading-tight">
            {kullanici?.ad?.split(' ')[0]}
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {kullanici?.birim} · {formattedDate}
          </p>
        </div>
        <div className="inline-flex items-center px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-wider uppercase">
          {kullanici?.rol}
        </div>
      </div>

      {/* 2. SYNC/OFFLINE ALERT */}
      {(senkronBekleyenSayisi > 0 || !cevrimici) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="alert-warning flex items-center gap-3 p-3.5"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {!cevrimici ? 'Çevrimdışı Mod' : `${senkronBekleyenSayisi} Kayıt Bekliyor`}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
              {!cevrimici ? 'Bağlantı yok. Veriler yerel olarak saklanıyor.' : 'Bağlantı algılandı. Verileri senkronize edebilirsiniz.'}
            </p>
          </div>
          {cevrimici && senkronBekleyenSayisi > 0 && (
            <button
              onClick={() => senkronizeEt()}
              className="px-3 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
            >
              Senkronize Et
            </button>
          )}
        </motion.div>
      )}

      {/* 3. STATS ROW */}
      <div className="grid grid-cols-4 gap-2.5">
        {istatistikler.map((stat, i) => (
          <motion.div
            key={stat.baslik}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="p-3 rounded-xl bg-card/40 border border-white/5 flex flex-col items-center text-center"
          >
            <span className={`text-xl font-bold leading-none mb-1.5 ${stat.renk}`}>{stat.deger}</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase leading-[1.1] max-w-[50px]">{stat.baslik}</span>
          </motion.div>
        ))}
      </div>

      {/* 4. PRIMARY ACTION */}
      <Link href="/mobile/yeni-test">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          data-testid="button-yeni-test"
          className="w-full min-h-[68px] flex items-center gap-4 p-3.5 rounded-[16px] relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 60%, #0077AA 100%)',
            boxShadow: '0 6px 28px rgba(0,212,255,0.38), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          <div className="w-[48px] h-[48px] rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[17px] font-bold text-white leading-tight">Yeni Test Başlat</p>
            <p className="text-[12px] text-white/65 mt-0.5">Yeni numune testi kaydet</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </motion.button>
      </Link>

      {/* 5. SECONDARY ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/mobile/kayitlarim">
          <motion.button
            whileTap={{ scale: 0.96 }}
            data-testid="button-kayitlarim"
            className="glass-card w-full min-h-[80px] flex flex-col items-center justify-center gap-2.5 border-t-[3px] border-t-blue-500 pt-3"
          >
            <div className="w-11 h-11 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[13px] font-semibold text-foreground">Kayıtlarım</span>
          </motion.button>
        </Link>

        <Link href="/mobile/qr-tara">
          <motion.button
            whileTap={{ scale: 0.96 }}
            data-testid="button-qr-tara"
            className="glass-card w-full min-h-[80px] flex flex-col items-center justify-center gap-2.5 border-t-[3px] border-t-cyan-500 pt-3"
          >
            <div className="w-11 h-11 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-[13px] font-semibold text-foreground">QR Tara</span>
          </motion.button>
        </Link>

        <Link href="/mobile/sevklerim">
          <motion.button
            whileTap={{ scale: 0.96 }}
            data-testid="button-sevklerim"
            className="glass-card w-full min-h-[80px] flex flex-col items-center justify-center gap-2.5 border-t-[3px] border-t-violet-500 pt-3"
          >
            <div className="w-11 h-11 rounded-full bg-violet-500/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-violet-500" />
            </div>
            <span className="text-[13px] font-semibold text-foreground">Sevklerim</span>
          </motion.button>
        </Link>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => senkronizeEt()}
          className="glass-card w-full min-h-[80px] flex flex-col items-center justify-center gap-2.5 border-t-[3px] border-t-emerald-500 pt-3"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <RefreshCw className={`w-5 h-5 text-emerald-500 ${senkronBekleyenSayisi > 0 ? 'animate-spin duration-[3s]' : ''}`} />
          </div>
          <span className="text-[13px] font-semibold text-foreground">
            {senkronBekleyenSayisi > 0 ? `Senkronize (${senkronBekleyenSayisi})` : 'Senkronize Et'}
          </span>
        </motion.button>
      </div>

      {/* 6. RECENT RECORDS */}
      <div className="space-y-3 pt-2">
        <h2 className="section-title">SON KAYITLAR</h2>
        <div className="flex flex-col">
          {sonKayitlar.length === 0 ? (
            <div className="text-center py-6 glass-card bg-transparent border-dashed">
              <p className="text-xs text-muted-foreground">Henüz kayıt bulunmuyor</p>
            </div>
          ) : (
            sonKayitlar.map((kayit, i) => (
              <motion.div
                key={kayit.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                data-testid={`card-test-kaydi-${kayit.id}`}
                className="py-2.5 border-b border-white/5 last:border-0 flex items-center gap-3"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  kayit.testSonucu === 'Pozitif' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  kayit.testSonucu === 'Negatif' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-primary/70">{kayit.operasyonNo}</span>
                    <span className="text-[11px] text-foreground/80 truncate">{kayit.lokasyon}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className={`text-[10px] font-bold tracking-tight ${
                    kayit.testSonucu === 'Pozitif' ? 'text-red-400' :
                    kayit.testSonucu === 'Negatif' ? 'text-emerald-400' :
                    'text-amber-400'
                  }`}>
                    {kayit.testSonucu.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {new Date(kayit.tarih).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

