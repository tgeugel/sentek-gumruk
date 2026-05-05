import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth, rolRouteAl } from '../contexts/AuthContext';
import { Role } from '../types';

const DEMO_ROLES: { label: string; email: string; sifre: string; rol: Role }[] = [
  { label: 'Sistem Yöneticisi', email: 'admin@sentek.local', sifre: 'admin123', rol: 'Sistem Yöneticisi' },
  { label: 'Merkez Yönetici', email: 'merkez@sentek.local', sifre: 'merkez123', rol: 'Merkez Yönetici' },
  { label: 'Bölge Yetkilisi', email: 'bolge@sentek.local', sifre: 'bolge123', rol: 'Bölge Yetkilisi' },
  { label: 'Saha Personeli', email: 'saha@sentek.local', sifre: 'saha123', rol: 'Saha Personeli' },
  { label: 'Laboratuvar', email: 'lab@sentek.local', sifre: 'lab123', rol: 'Laboratuvar Kullanıcısı' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [goster, setGoster] = useState(false);
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const { girisYap } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);
    await new Promise(r => setTimeout(r, 600));
    const basarili = girisYap(email, sifre);
    setYukleniyor(false);
    if (!basarili) {
      setHata('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
      return;
    }
    const saved = localStorage.getItem('sentek_user');
    if (saved) {
      const user = JSON.parse(saved);
      setLocation(rolRouteAl(user.rol));
    }
  };

  const hizliGiris = (e: string, s: string) => {
    setEmail(e);
    setSifre(s);
    setTimeout(() => {
      const basarili = girisYap(e, s);
      if (basarili) {
        const saved = localStorage.getItem('sentek_user');
        if (saved) {
          const user = JSON.parse(saved);
          setLocation(rolRouteAl(user.rol));
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-4 shadow-[0_0_30px_rgba(0,212,255,0.15)]"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              SEN<span className="text-primary">TEK</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
              Saha Entegre Narkotik Test Yazılımı
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-card-border"
        >
          <h2 className="text-lg font-semibold text-foreground mb-5">Sisteme Giriş</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                E-posta
              </label>
              <input
                data-testid="input-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="kullanici@sentek.local"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Şifre
              </label>
              <div className="relative">
                <input
                  data-testid="input-password"
                  type={goster ? 'text' : 'password'}
                  value={sifre}
                  onChange={e => setSifre(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setGoster(!goster)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {goster ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {hata && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {hata}
              </motion.div>
            )}

            <motion.button
              data-testid="button-login"
              type="submit"
              disabled={yukleniyor}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm transition-all hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              {yukleniyor ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Doğrulanıyor...
                </span>
              ) : 'Giriş Yap'}
            </motion.button>
          </form>
        </motion.div>

        {/* Demo Quick Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 glass-card rounded-2xl p-4 border border-card-border"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 text-center">Demo Hızlı Giriş</p>
          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_ROLES.map(role => (
              <motion.button
                key={role.email}
                data-testid={`button-demo-${role.rol.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => hizliGiris(role.email, role.sifre)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border/50 hover:border-primary/30 hover:bg-secondary/70 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{role.label}</p>
                  <p className="text-xs text-muted-foreground/60">{role.email}</p>
                </div>
                <span className="text-xs text-muted-foreground/40 group-hover:text-primary/60 transition-colors">{role.sifre}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/40 mt-4">
          SENTEK v1.0 — Demo Ortamı
        </p>
      </motion.div>
    </div>
  );
}
