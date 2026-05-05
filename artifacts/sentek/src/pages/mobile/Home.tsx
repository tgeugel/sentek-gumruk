import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Plus, ClipboardList, Truck, QrCode, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TestSonucBadge } from '../../components/sentek/StatusBadge';

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
    { baslik: 'Bugünkü Test', deger: bugunTestler.length, renk: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { baslik: 'Pozitif Kayıt', deger: pozitifler.length, renk: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { baslik: 'Sevk Bekleyen', deger: bekleyenSevk.length, renk: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { baslik: 'Toplam Sevk', deger: labSevkler.length, renk: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="p-4 space-y-5">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Hoş geldiniz</p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">{kullanici?.ad}</h1>
        <p className="text-xs text-muted-foreground">{kullanici?.birim} · {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </motion.div>

      {/* Offline/Sync Alert */}
      {senkronBekleyenSayisi > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-amber-400">{senkronBekleyenSayisi} kayıt senkron bekliyor</p>
            <p className="text-xs text-muted-foreground/70">Bağlantı geldiğinde otomatik aktarılacak</p>
          </div>
          {cevrimici && (
            <button
              onClick={() => senkronizeEt()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Senkronize Et
            </button>
          )}
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {istatistikler.map((stat, i) => (
          <motion.div
            key={stat.baslik}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className={`glass-card rounded-xl p-4 border ${stat.renk.split(' ')[2]}`}
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.baslik}</p>
            <p className={`text-2xl font-bold ${stat.renk.split(' ')[0]}`}>{stat.deger}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Hızlı İşlemler</p>

        <Link href="/mobile/yeni-test">
          <motion.button
            whileTap={{ scale: 0.98 }}
            data-testid="button-yeni-test"
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-[0_0_24px_rgba(0,212,255,0.25)] mb-2 min-h-[60px]"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-base">Yeni Test Başlat</p>
              <p className="text-xs opacity-75">Yeni numune testi kaydet</p>
            </div>
          </motion.button>
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <Link href="/mobile/kayitlarim">
            <motion.button
              whileTap={{ scale: 0.97 }}
              data-testid="button-kayitlarim"
              className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl glass-card border border-blue-500/20 min-h-[80px]"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-blue-400" />
              </div>
              <p className="font-semibold text-foreground text-sm">Kayıtlarım</p>
            </motion.button>
          </Link>

          <Link href="/mobile/qr-tara">
            <motion.button
              whileTap={{ scale: 0.97 }}
              data-testid="button-qr-tara"
              className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl glass-card border border-cyan-500/20 min-h-[80px]"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="font-semibold text-foreground text-sm">QR Tara</p>
            </motion.button>
          </Link>

          <Link href="/mobile/sevklerim">
            <motion.button
              whileTap={{ scale: 0.97 }}
              data-testid="button-sevklerim"
              className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl glass-card border border-violet-500/20 min-h-[80px]"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-violet-400" />
              </div>
              <p className="font-semibold text-foreground text-sm">Sevklerim</p>
            </motion.button>
          </Link>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => senkronizeEt()}
            className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl glass-card border border-emerald-500/20 min-h-[80px]"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <RefreshCw className={`w-5 h-5 text-emerald-400 ${senkronBekleyenSayisi > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <p className="font-semibold text-foreground text-sm">
              {senkronBekleyenSayisi > 0 ? `Senkronize Et (${senkronBekleyenSayisi})` : 'Senkronize Et'}
            </p>
          </motion.button>
        </div>
      </div>

      {/* Recent Records */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Son Test Kayıtları</p>
        <div className="space-y-2">
          {sonKayitlar.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Henüz kayıt yok</div>
          ) : (
            sonKayitlar.map((kayit, i) => (
              <motion.div
                key={kayit.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                data-testid={`card-test-kaydi-${kayit.id}`}
                className="glass-card rounded-xl p-3 border border-card-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-cyan-400">{kayit.operasyonNo}</span>
                  <TestSonucBadge sonuc={kayit.testSonucu} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{kayit.lokasyon} · {kayit.numuneTuru}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{formatTarih(kayit.tarih)}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
