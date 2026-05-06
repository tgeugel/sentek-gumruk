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
    { baslik: 'BUGÜNKÜ',   deger: bugunTestler.length, renk: 'text-cyan-400',    border: 'rgba(0,212,255,0.2)',   glow: 'rgba(0,212,255,0.1)' },
    { baslik: 'POZİTİF',   deger: pozitifler.length,   renk: 'text-red-400',     border: 'rgba(239,68,68,0.2)',   glow: 'rgba(239,68,68,0.08)' },
    { baslik: 'BEKLEYEN',  deger: bekleyenSevk.length, renk: 'text-amber-400',   border: 'rgba(245,158,11,0.2)',  glow: 'rgba(245,158,11,0.08)' },
    { baslik: 'SEVK',      deger: labSevkler.length,   renk: 'text-emerald-400', border: 'rgba(16,185,129,0.2)',  glow: 'rgba(16,185,129,0.08)' },
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="p-4 space-y-5 page-enter">
      {/* GREETING */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary/50 leading-none mb-2">SAHA MODU</p>
          <h1 className="text-3xl font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {kullanici?.ad?.split(' ')[0]}
          </h1>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
            {kullanici?.birim} · {formattedDate}
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.18)', color: '#00D4FF' }}>
          {kullanici?.rol}
        </div>
      </div>

      {/* SYNC/OFFLINE ALERT */}
      {(senkronBekleyenSayisi > 0 || !cevrimici) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="alert-warning flex items-center gap-3 p-3.5"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/12 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-400">
              {!cevrimici ? 'Çevrimdışı Mod' : `${senkronBekleyenSayisi} Kayıt Bekliyor`}
            </p>
            <p className="text-[11px] text-muted-foreground/60 leading-tight mt-0.5">
              {!cevrimici ? 'Bağlantı yok. Veriler yerel olarak saklanıyor.' : 'Bağlantı algılandı. Verileri senkronize edebilirsiniz.'}
            </p>
          </div>
          {cevrimici && senkronBekleyenSayisi > 0 && (
            <button
              onClick={() => senkronizeEt()}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
            >
              Senkronize Et
            </button>
          )}
        </motion.div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-4 gap-2.5">
        {istatistikler.map((stat, i) => (
          <motion.div
            key={stat.baslik}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="glow-card flex flex-col items-center text-center p-3 rounded-2xl relative overflow-hidden"
            style={{
              background: stat.glow,
              border: `1px solid ${stat.border}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className={`text-2xl font-bold leading-none mb-1.5 ${stat.renk}`} style={{ fontFamily: 'var(--font-display)' }}>{stat.deger}</span>
            <span className="text-[8px] font-bold text-muted-foreground/60 uppercase leading-[1.1] tracking-[0.1em]">{stat.baslik}</span>
          </motion.div>
        ))}
      </div>

      {/* PRIMARY ACTION — Yeni Test */}
      <Link href="/mobile/yeni-test">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          data-testid="button-yeni-test"
          className="w-full min-h-[72px] flex items-center gap-4 p-4 rounded-2xl relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 55%, #006699 100%)',
            boxShadow: '0 8px 32px rgba(0,212,255,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-left relative z-10">
            <p className="text-[17px] font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Yeni Test Başlat</p>
            <p className="text-[11px] text-white/60 mt-0.5">Yeni numune testi kaydet</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50 relative z-10" />
        </motion.button>
      </Link>

      {/* SECONDARY ACTIONS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/mobile/kayitlarim', label: 'Kayıtlarım', Icon: ClipboardList, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', testId: 'button-kayitlarim' },
          { href: '/mobile/qr-tara',   label: 'QR Tara',    Icon: QrCode,        color: '#00D4FF', bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.18)', testId: 'button-qr-tara' },
          { href: '/mobile/sevklerim', label: 'Sevklerim',  Icon: Truck,         color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', testId: 'button-sevklerim' },
        ].map(({ href, label, Icon, color, bg, border, testId }) => (
          <Link key={href} href={href}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              data-testid={testId}
              className="glow-card w-full min-h-[84px] flex flex-col items-center justify-center gap-2.5 rounded-2xl relative overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}`, backdropFilter: 'blur(12px)' }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-[12px] font-semibold text-foreground/90">{label}</span>
            </motion.button>
          </Link>
        ))}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => senkronizeEt()}
          className="glow-card w-full min-h-[84px] flex flex-col items-center justify-center gap-2.5 rounded-2xl relative overflow-hidden"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', backdropFilter: 'blur(12px)' }}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <RefreshCw className={`w-5 h-5 text-emerald-400 ${senkronBekleyenSayisi > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>
          <span className="text-[12px] font-semibold text-foreground/90">
            {senkronBekleyenSayisi > 0 ? `Senkronize (${senkronBekleyenSayisi})` : 'Senkronize Et'}
          </span>
        </motion.button>
      </div>

      {/* RECENT RECORDS */}
      <div className="space-y-3 pt-1">
        <h2 className="section-title">SON KAYITLAR</h2>
        <div className="glass-card-elevated rounded-2xl overflow-hidden">
          {sonKayitlar.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground/50">Henüz kayıt bulunmuyor</p>
            </div>
          ) : (
            sonKayitlar.map((kayit, i) => (
              <motion.div
                key={kayit.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                data-testid={`card-test-kaydi-${kayit.id}`}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-white/[0.03] transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  kayit.testSonucu === 'Pozitif' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  kayit.testSonucu === 'Negatif' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-primary/60">{kayit.operasyonNo}</span>
                    <span className="text-[11px] text-foreground/70 truncate">{kayit.lokasyon}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className={`text-[10px] font-bold ${
                    kayit.testSonucu === 'Pozitif' ? 'text-red-400' :
                    kayit.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {kayit.testSonucu.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-muted-foreground/40">
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
