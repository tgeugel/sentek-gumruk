import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ClipboardList, Package,
  Truck, FlaskConical, FileBarChart, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, User, Menu, Radio,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { NotificationBell } from '../components/sentek/NotificationBell';
import sentekIcon from '../assets/sentek-icon.png';

interface NavItem {
  path: string;
  label: string;
  icon: typeof Radio;
  roles: Role[];
  badge?: 'live';
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/panel/dashboard',      label: 'Komuta Kontrol',      icon: Radio,           roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'], badge: 'live', group: 'Operasyon' },
  { path: '/panel/test-kayitlari', label: 'Test Kayıtları',      icon: ClipboardList,   roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'], group: 'Operasyon' },
  { path: '/panel/stok',           label: 'Stok / Seri No',      icon: Package,         roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'], group: 'Lojistik' },
  { path: '/panel/lab-sevk',       label: 'Lab Sevk Takibi',     icon: Truck,           roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'], group: 'Lojistik' },
  { path: '/panel/laboratuvar',    label: 'Laboratuvar',          icon: FlaskConical,    roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Laboratuvar Kullanıcısı'], group: 'Lojistik' },
  { path: '/panel/raporlar',       label: 'Raporlar',             icon: FileBarChart,    roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'], group: 'Analiz' },
  { path: '/panel/kullanicilar',   label: 'Kullanıcılar',         icon: Users,           roles: ['Sistem Yöneticisi', 'Merkez Yönetici'], group: 'Yönetim' },
  { path: '/panel/ayarlar',        label: 'Ayarlar',              icon: Settings,        roles: ['Sistem Yöneticisi'], group: 'Yönetim' },
];

const ROL_RENK: Record<Role, string> = {
  'Sistem Yöneticisi':       'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'Merkez Yönetici':         'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Bölge Yetkilisi':         'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Saha Personeli':          'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Laboratuvar Kullanıcısı': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

function UserDropdown() {
  const { kullanici, cikisYap } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!kullanici) return null;
  const rolRenk = ROL_RENK[kullanici.rol] || 'bg-secondary text-muted-foreground border-border';

  return (
    <div ref={ref} className="relative p-3 border-t border-sidebar-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,136,204,0.1) 100%)', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 12px rgba(0,212,255,0.08)' }}
        >
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">{kullanici.ad}</p>
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{kullanici.birim}</p>
        </div>
        <ChevronDown className={`w-3 h-3 text-muted-foreground/60 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-3 right-3 mb-1 z-[200] overflow-hidden"
            style={{
              background: 'hsl(224 44% 11%)',
              border: '1px solid rgba(0,212,255,0.12)',
              borderRadius: 14,
              boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)'
            }}
          >
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,136,204,0.1) 100%)', border: '1px solid rgba(0,212,255,0.3)' }}>
                  <User className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{kullanici.ad}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{kullanici.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${rolRenk}`}>
                {kullanici.rol}
              </span>
            </div>

            <div className="p-1.5 space-y-0.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-muted-foreground/60" />
                <div className="flex-1">
                  <p className="text-foreground font-medium text-xs">Birim</p>
                  <p className="text-muted-foreground/70 text-[11px]">{kullanici.birim}</p>
                </div>
              </div>
              <div className="h-px bg-white/5 my-1" />
              <button
                onClick={() => { setOpen(false); cikisYap(); }}
                data-testid="button-logout-web"
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Oturumu Kapat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserDropdownCollapsed() {
  const { cikisYap } = useAuth();
  return (
    <div className="p-2 border-t border-sidebar-border flex flex-col items-center gap-1.5">
      <button
        onClick={cikisYap}
        data-testid="button-logout-web"
        title="Oturumu Kapat"
        className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted-foreground/60 transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function WebPanelLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { kullanici } = useAuth();

  const filteredNav = NAV_ITEMS.filter(item =>
    kullanici ? item.roles.includes(kullanici.rol) : false
  );

  const isActive = (path: string) => location === path || location.startsWith(path + '/');

  const groups = Array.from(new Set(filteredNav.map(i => i.group)));

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`flex-shrink-0 border-b border-sidebar-border ${collapsed ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img src={sentekIcon} alt="SENTEK" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.55))' }} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                <span style={{ background: 'linear-gradient(135deg, #fff 0%, #e0f7ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SEN</span>
                <span className="text-primary">TEK</span>
              </p>
              <p className="text-[9px] text-muted-foreground/50 leading-tight uppercase tracking-[0.15em] mt-0.5">Operasyon Paneli</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 p-2 overflow-y-auto space-y-4 mt-1">
        {groups.map(group => {
          const items = filteredNav.filter(i => i.group === group);
          return (
            <div key={group}>
              {!collapsed && (
                <p className="section-title px-3 mb-1.5" style={{ fontSize: '0.6rem' }}>{group}</p>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
                      <div
                        data-testid={`nav-web-${item.label.toLowerCase().replace(/[\s/]+/g, '-')}`}
                        title={collapsed ? item.label : undefined}
                        className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                      >
                        <div className="relative flex-shrink-0">
                          <item.icon className="w-4 h-4" />
                          {item.badge === 'live' && (
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && active && (
                          <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {collapsed && <div className="h-2" />}
      {collapsed ? <UserDropdownCollapsed /> : <UserDropdown />}
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 244 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0 relative overflow-hidden"
        style={{ borderRight: '1px solid rgba(0,212,255,0.08)' }}
      >
        {/* Sidebar inner glow */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 100%)' }} />

        <NavContent />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[4.25rem] w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-primary transition-colors z-10"
          style={{ background: 'hsl(224 44% 11%)', border: '1px solid rgba(0,212,255,0.15)' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <header
          className="sticky top-0 z-30 px-5 py-3 flex items-center gap-3"
          style={{
            background: 'hsl(var(--background) / 0.92)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            borderBottom: '1px solid rgba(0,212,255,0.07)',
            boxShadow: '0 1px 0 rgba(0,212,255,0.04)'
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="md:hidden flex items-center gap-2">
            <img src={sentekIcon} alt="SENTEK" style={{ width: 22, height: 22, objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.5))' }} />
            <span className="font-bold text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-white">SEN</span>
              <span className="text-primary">TEK</span>
            </span>
          </div>

          <div className="flex-1" />

          {/* System status */}
          <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1 rounded-full"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-bold">Sistem Aktif</span>
          </div>

          <NotificationBell />

          <div className="hidden md:flex items-center gap-2 pl-3 ml-1"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,136,204,0.1) 100%)', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-tight">{kullanici?.ad}</p>
              <p className="text-[10px] text-muted-foreground/70 leading-tight">{kullanici?.rol}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
