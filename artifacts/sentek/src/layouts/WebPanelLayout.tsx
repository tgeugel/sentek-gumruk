import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, ClipboardList, Package,
  Truck, FlaskConical, FileBarChart, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, User, Menu, Radio, Map,
  Bell, ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { NotificationBell } from '../components/sentek/NotificationBell';

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
  badge?: 'live';
}

const NAV_ITEMS: NavItem[] = [
  { path: '/panel/dashboard',      label: 'Dashboard',           icon: LayoutDashboard, roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/canli-ops',      label: 'Canlı Operasyon',     icon: Radio,           roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'], badge: 'live' },
  { path: '/panel/harita',         label: 'Operasyon Haritası',  icon: Map,             roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/test-kayitlari', label: 'Test Kayıtları',      icon: ClipboardList,   roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'] },
  { path: '/panel/stok',           label: 'Stok / Seri No',      icon: Package,         roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/lab-sevk',       label: 'Lab Sevk Takibi',     icon: Truck,           roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'] },
  { path: '/panel/laboratuvar',    label: 'Laboratuvar',          icon: FlaskConical,    roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Laboratuvar Kullanıcısı'] },
  { path: '/panel/raporlar',       label: 'Raporlar',             icon: FileBarChart,    roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/kullanicilar',   label: 'Kullanıcılar',         icon: Users,           roles: ['Sistem Yöneticisi', 'Merkez Yönetici'] },
  { path: '/panel/ayarlar',        label: 'Ayarlar',              icon: Settings,        roles: ['Sistem Yöneticisi'] },
];

const ROL_RENK: Record<Role, string> = {
  'Sistem Yöneticisi':    'bg-violet-500/15 text-violet-400',
  'Merkez Yönetici':      'bg-cyan-500/15 text-cyan-400',
  'Bölge Yetkilisi':      'bg-blue-500/15 text-blue-400',
  'Saha Personeli':       'bg-emerald-500/15 text-emerald-400',
  'Laboratuvar Kullanıcısı': 'bg-amber-500/15 text-amber-400',
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

  const rolRenk = ROL_RENK[kullanici.rol] || 'bg-secondary text-muted-foreground';

  return (
    <div ref={ref} className="relative p-3 border-t border-sidebar-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-secondary/50 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold text-foreground truncate">{kullanici.ad}</p>
          <p className="text-[10px] text-muted-foreground truncate">{kullanici.birim}</p>
        </div>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-3 right-3 mb-1 bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-[200] overflow-hidden"
          >
            <div className="p-3 border-b border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{kullanici.ad}</p>
                  <p className="text-[10px] text-muted-foreground">{kullanici.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${rolRenk}`}>
                {kullanici.rol}
              </span>
            </div>

            <div className="p-1.5 space-y-0.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                <div className="flex-1">
                  <p className="text-foreground font-medium">Birim</p>
                  <p className="text-muted-foreground/70">{kullanici.birim}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground">
                <Bell className="w-3.5 h-3.5" />
                <div className="flex-1">
                  <p className="text-foreground font-medium">Bildirimler</p>
                  <p className="text-muted-foreground/70">Pozitif, Kritik Stok, Lab</p>
                </div>
              </div>
              <div className="h-px bg-border/50 my-1" />
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
        className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
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

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`p-4 border-b border-sidebar-border flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight">SEN<span className="text-primary">TEK</span></p>
            <p className="text-[10px] text-muted-foreground leading-tight uppercase tracking-widest">Operasyon Paneli</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        {filteredNav.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                data-testid={`nav-web-${item.label.toLowerCase().replace(/[\s/]+/g, '-')}`}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  active
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${active ? 'text-primary' : ''}`} />
                  {item.badge === 'live' && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                  </>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {collapsed ? <UserDropdownCollapsed /> : <UserDropdown />}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 248 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0 relative overflow-hidden"
      >
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[4.5rem] w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground z-10 transition-colors"
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
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/70 z-40"
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="md:hidden flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">SEN<span className="text-primary">TEK</span></span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <NotificationBell />
            <div className="hidden md:flex items-center gap-2 pl-2 ml-1 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-tight">{kullanici?.ad}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{kullanici?.rol}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
