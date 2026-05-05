import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Check } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Kullanici } from '../../types';

function formatTarih(tarih: string) {
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const ROL_RENK: Record<string, string> = {
  'Sistem Yöneticisi': 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  'Merkez Yönetici': 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  'Bölge Yetkilisi': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  'Saha Personeli': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  'Laboratuvar Kullanıcısı': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
};

function KullaniciEkleModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ ad: '', email: '', rol: '', birim: '' });
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-card-border rounded-2xl w-full max-w-md p-6 space-y-5"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <p className="font-bold text-foreground">Yeni Kullanıcı Ekle</p>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-3">
            {[
              { l: 'Ad Soyad', k: 'ad', ph: 'A. Yılmaz' },
              { l: 'E-posta', k: 'email', ph: 'kullanici@sentek.local' },
              { l: 'Birim', k: 'birim', ph: 'Mobil Ekip 1' },
            ].map(item => (
              <div key={item.k}>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{item.l}</label>
                <input
                  type="text"
                  value={(form as any)[item.k]}
                  onChange={e => setForm(f => ({ ...f, [item.k]: e.target.value }))}
                  placeholder={item.ph}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Rol</label>
              <select
                value={form.rol}
                onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Rol seçin</option>
                <option value="Sistem Yöneticisi">Sistem Yöneticisi</option>
                <option value="Merkez Yönetici">Merkez Yönetici</option>
                <option value="Bölge Yetkilisi">Bölge Yetkilisi</option>
                <option value="Saha Personeli">Saha Personeli</option>
                <option value="Laboratuvar Kullanıcısı">Laboratuvar Kullanıcısı</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-semibold hover:text-foreground transition-colors">İptal</button>
            <button
              data-testid="button-kullanici-kaydet"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Kaydet (Demo)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Users() {
  const { kullanicilar } = useData();
  const { kullanici } = useAuth();
  const [modal, setModal] = useState(false);
  const isSistemYoneticisi = kullanici?.rol === 'Sistem Yöneticisi';

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Kullanıcılar</h1>
          <p className="text-sm text-muted-foreground">{kullanicilar.length} kullanıcı</p>
        </div>
        {isSistemYoneticisi && (
          <button
            data-testid="button-kullanici-ekle"
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-[0_0_16px_rgba(0,212,255,0.2)] hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Kullanıcı Ekle
          </button>
        )}
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.keys(ROL_RENK).map(rol => {
          const sayi = kullanicilar.filter(k => k.rol === rol).length;
          return (
            <div key={rol} className={`rounded-xl p-3 text-center border ${ROL_RENK[rol].split(' ').slice(1).join(' ')}`}>
              <p className="text-xl font-bold">{sayi}</p>
              <p className="text-xs opacity-80 mt-0.5 leading-tight">{rol}</p>
            </div>
          );
        })}
      </div>

      {/* User Table */}
      <div className="glass-card rounded-xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Ad Soyad', 'E-posta', 'Rol', 'Birim', 'Durum', 'Son Giriş'].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kullanicilar.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  data-testid={`row-kullanici-${user.id}`}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {user.ad[0]}
                      </div>
                      <span className="text-sm font-medium text-foreground">{user.ad}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${ROL_RENK[user.rol]}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{user.birim}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${user.durum === 'Aktif' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'}`}>
                      {user.durum}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatTarih(user.sonGiris)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <KullaniciEkleModal onClose={() => setModal(false)} />}
    </div>
  );
}
