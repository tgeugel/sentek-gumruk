import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Zap, Shield, MonitorPlay, BookOpen } from 'lucide-react';
import { useAuth, rolRouteAl } from '../contexts/AuthContext';
import { Role } from '../types';

const DEMO_ROLES: { label: string; email: string; sifre: string; rol: Role; renk: string; bg: string; border: string }[] = [
  { label: 'Sistem Yöneticisi', email: 'admin@sentek.local',  sifre: 'admin123',  rol: 'Sistem Yöneticisi',       renk: 'text-violet-400', bg: 'bg-violet-500/8',  border: 'border-violet-500/20' },
  { label: 'Merkez Yönetici',   email: 'merkez@sentek.local', sifre: 'merkez123', rol: 'Merkez Yönetici',         renk: 'text-cyan-400',   bg: 'bg-cyan-500/8',    border: 'border-cyan-500/20' },
  { label: 'Bölge Yetkilisi',   email: 'bolge@sentek.local',  sifre: 'bolge123',  rol: 'Bölge Yetkilisi',         renk: 'text-blue-400',   bg: 'bg-blue-500/8',    border: 'border-blue-500/20' },
  { label: 'Saha Personeli',    email: 'saha@sentek.local',   sifre: 'saha123',   rol: 'Saha Personeli',          renk: 'text-emerald-400',bg: 'bg-emerald-500/8', border: 'border-emerald-500/20' },
  { label: 'Laboratuvar',       email: 'lab@sentek.local',    sifre: 'lab123',    rol: 'Laboratuvar Kullanıcısı', renk: 'text-amber-400',  bg: 'bg-amber-500/8',   border: 'border-amber-500/20' },
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'hsl(225 48% 5.5%)' }}>
      {/* Extra local glow for login page depth */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(0,136,204,0.08) 100%)',
              border: '1px solid rgba(0,212,255,0.35)',
              boxShadow: '0 0 50px rgba(0,212,255,0.2), 0 0 100px rgba(0,212,255,0.06), inset 0 1px 0 rgba(0,212,255,0.15)'
            }}
          >
            <Shield className="w-9 h-9 text-primary" style={{ filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.7))' }} />
            <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(circle at 40% 35%, rgba(0,212,255,0.12) 0%, transparent 60%)' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }}>
            <h1 className="text-4xl font-bold mb-1.5" style={{ fontFamily: "'Neon Zone', sans-serif", letterSpacing: '0.06em' }}>
              <span className="text-gradient-white">SEN</span><span className="text-gradient-cyan">TEK</span>
            </h1>
            <p className="text-[10px] text-muted-foreground/60 tracking-[0.22em] uppercase">
              Saha Entegre Narkotik Test Yazılımı
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card-premium glow-card rounded-2xl p-6 mb-4 relative overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.5), transparent)' }} />

          <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-primary" style={{ boxShadow: '0 0 8px rgba(0,212,255,0.6)' }} />
            Sisteme Giriş
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-[0.14em]">
                E-posta
              </label>
              <input
                data-testid="input-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(0,212,255,0.4)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1), 0 0 20px rgba(0,212,255,0.06)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.09)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="kullanici@sentek.local"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-[0.14em]">
                Şifre
              </label>
              <div className="relative">
                <input
                  data-testid="input-password"
                  type={goster ? 'text' : 'password'}
                  value={sifre}
                  onChange={e => setSifre(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(0,212,255,0.4)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1), 0 0 20px rgba(0,212,255,0.06)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.09)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setGoster(!goster)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {goster ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {hata && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {hata}
              </motion.div>
            )}

            <motion.button
              data-testid="button-login"
              type="submit"
              disabled={yukleniyor}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 60%, #0077AA 100%)',
                color: '#080d1a',
                boxShadow: '0 4px 28px rgba(0,212,255,0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
              }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              {yukleniyor ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Doğrulanıyor...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Giriş Yap
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Demo Quick Login */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="glass-card-elevated glow-card rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.25), transparent)' }} />

          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3 h-3 text-primary/60" />
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Demo Hızlı Giriş</p>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_ROLES.map((role, i) => (
              <motion.button
                key={role.email}
                data-testid={`button-demo-${role.rol.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => hizliGiris(role.email, role.sifre)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.04 }}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all text-left group ${role.bg} ${role.border}`}
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${role.renk.replace('text-', 'bg-')}`} style={{ boxShadow: `0 0 6px currentColor` }} />
                  <div>
                    <p className={`text-xs font-bold ${role.renk}`}>{role.label}</p>
                    <p className="text-[10px] text-muted-foreground/50 font-mono">{role.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold opacity-40 group-hover:opacity-70 transition-opacity ${role.renk}`}>{role.sifre}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Sunum & Tanıtım Kitapçığı Linkleri */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-3 grid grid-cols-2 gap-2"
        >
          <a
            href="/sunum"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border transition-all text-xs font-semibold"
            style={{
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.18)',
              color: 'rgba(0,212,255,0.85)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,212,255,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,212,255,0.35)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.12)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,212,255,0.06)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,212,255,0.18)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}
          >
            <MonitorPlay className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Sunum</span>
          </a>

          <a
            href="/tanitim-kitapcigi"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border transition-all text-xs font-semibold"
            style={{
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.18)',
              color: 'rgba(167,139,250,0.85)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(139,92,246,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(139,92,246,0.35)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(139,92,246,0.12)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(139,92,246,0.06)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(139,92,246,0.18)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}
          >
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Tanıtım Kitapçığı</span>
          </a>
        </motion.div>

        <p className="text-center text-[10px] text-muted-foreground/25 mt-4 tracking-widest uppercase">
          SENTEK v1.0 · Demo Ortamı
        </p>
      </motion.div>
    </div>
  );
}
