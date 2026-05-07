import { motion } from 'framer-motion';
import { Database, Bell, Lock, Info, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import RaporAyarlariCard from '../../components/sentek/RaporAyarlariCard';

export default function Settings() {
  const { toast } = useToast();
  const [bildirimler, setBildirimler] = useState({ pozitif: true, kritikStok: true, labSevk: false, skt: true });

  const handleKaydet = () => {
    toast({ title: 'Ayarlar kaydedildi', description: 'Değişiklikler uygulandı.' });
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Sistem yapılandırması ve tercihler</p>
      </div>

      {/* System Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl border border-card-border p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-foreground">Sistem Bilgileri</p>
        </div>
        {[
          { l: 'Sistem Adı', v: 'SENTEK - Saha Entegre Narkotik Test Yazılımı' },
          { l: 'Versiyon', v: '1.0.0-MVP' },
          { l: 'Ortam', v: 'Demo / Geliştirme' },
          { l: 'Son Güncelleme', v: '05 Mayıs 2026' },
          { l: 'Lisans', v: 'Kurumsal Demo' },
        ].map(item => (
          <div key={item.l} className="flex justify-between py-1.5 border-b border-border/30 text-sm">
            <span className="text-muted-foreground">{item.l}</span>
            <span className="text-foreground font-medium">{item.v}</span>
          </div>
        ))}
      </motion.div>

      {/* PDF Rapor Ayarları (yöneticiye özel düzenleme) */}
      <RaporAyarlariCard />

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl border border-card-border p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-foreground">Bildirim Tercihleri</p>
        </div>
        {[
          { k: 'pozitif', l: 'Pozitif Test Sonuçları', ac: 'Pozitif sonuç oluştuğunda bildirim al' },
          { k: 'kritikStok', l: 'Kritik Stok Uyarıları', ac: 'Stok seviyesi kritik eşiğe düştüğünde' },
          { k: 'labSevk', l: 'Lab Sevk Güncellemeleri', ac: 'Numune durum güncellemelerinde bildirim' },
          { k: 'skt', l: 'SKT Yaklaşım Uyarıları', ac: '30 gün öncesinden son kullanma tarihi uyarısı' },
        ].map(item => (
          <div key={item.k} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">{item.l}</p>
              <p className="text-xs text-muted-foreground">{item.ac}</p>
            </div>
            <button
              data-testid={`toggle-bildirim-${item.k}`}
              onClick={() => setBildirimler(b => ({ ...b, [item.k]: !b[item.k as keyof typeof b] }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${(bildirimler as any)[item.k] ? 'bg-primary' : 'bg-secondary border border-border'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${(bildirimler as any)[item.k] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-xl border border-card-border p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-foreground">Güvenlik</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs text-muted-foreground">
          Oturum zaman aşımı, iki faktörlü doğrulama ve güvenlik politikaları gerçek sistem entegrasyonunda yapılandırılacaktır.
        </div>
        {[
          { l: 'Oturum Zaman Aşımı', v: '8 saat (Demo)' },
          { l: '2FA Durumu', v: 'Devre dışı (Demo)' },
          { l: 'Şifre Politikası', v: 'Standart (Demo)' },
        ].map(item => (
          <div key={item.l} className="flex justify-between py-1.5 border-b border-border/30 text-sm">
            <span className="text-muted-foreground">{item.l}</span>
            <span className="text-foreground font-medium">{item.v}</span>
          </div>
        ))}
      </motion.div>

      {/* DB */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl border border-card-border p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-foreground">Veri Yönetimi</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs text-muted-foreground">
          Mevcut aşamada tüm veriler demo/mock yapıdadır. Gerçek database entegrasyonu, offline senkronizasyon ve PDF rapor üretimi sonraki sürümlerde eklenecektir.
        </div>
        {[
          { l: 'Veri Kaynağı', v: 'Mock Data (Demo)' },
          { l: 'Toplam Kayıt', v: '15 test, 7 sevk, 10 stok ürünü' },
          { l: 'Offline Mod', v: 'Gelecek sürüm' },
          { l: 'PDF Rapor', v: 'Gelecek sürüm' },
        ].map(item => (
          <div key={item.l} className="flex justify-between py-1.5 border-b border-border/30 text-sm">
            <span className="text-muted-foreground">{item.l}</span>
            <span className="text-foreground font-medium">{item.v}</span>
          </div>
        ))}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleKaydet}
        data-testid="button-ayarlar-kaydet"
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,212,255,0.2)]"
      >
        <Check className="w-4 h-4" />
        Ayarları Kaydet
      </motion.button>
    </div>
  );
}
