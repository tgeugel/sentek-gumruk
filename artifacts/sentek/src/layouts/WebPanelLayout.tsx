import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, ClipboardList, Package,
  Truck, FlaskConical, FileBarChart, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, User, Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { NotificationBell } from '../components/sentek/NotificationBell';

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/panel/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/test-kayitlari', label: 'Test Kayıtları', icon: ClipboardList, roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'] },
  { path: '/panel/stok', label: 'Stok / Seri No', icon: Package, roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/lab-sevk', label: 'Lab Sevk Takibi', icon: Truck, roles: ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'] },
  { path: '/panel/laboratuvar', label: 'Laboratuvar', icon: FlaskConical, roles: ['Laboratuvar Kullanıcısı', 'Merkez Yönetici'] },
  { path: '/panel/raporlar', label: 'Raporlar', icon: FileBarChart, roles: ['Merkez Yönetici', 'Bölge Yetkilisi'] },
  { path: '/panel/kullanicilar', label: 'Kullanıcılar', icon: Users, roles: ['Sistem Yöneticisi', 'Merkez Yönetici'] },
  { path: '/panel/ayarlar', label: 'Ayarlar', icon: Settings, roles: ['Sistem Yöneticisi'] },
];

interface WebPanelLayoutProps {
  children: React.ReactNode;
}

export default function WebPanelLayout({ children }: WebPanelLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { kullanici, cikisYap } = useAuth();

  const filteredNav = NAV_ITEMS.filter(item =>
    kullanici ? item.roles.includes(kullanici.rol) : false
  );

  const isActive = (path: string) => location === path || location.startsWith(path + '/');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-4 border-b border-sidebar-border flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,212,255,0.15)]">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight">
              SEN<span className="text-primary">TEK</span>
            </p>
            <p className="text-xs text-muted-foreground leading-tight">Operasyon Paneli</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 2 }}
                data-testid={`nav-web-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                  active
                    ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_12px_rgba(0,212,255,0.08)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center flex-col' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{kullanici?.ad}</p>
              <p className="text-xs text-muted-foreground truncate">{kullanici?.rol}</p>
            </div>
          )}
          <button
            onClick={cikisYap}
            data-testid="button-logout-web"
            title="Çıkış Yap"
            className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0 relative"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (desktop + mobile) */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          {/* Mobile menu toggle */}
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
          {/* Right side: notification + user info */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-foreground">{kullanici?.ad}</p>
              <p className="text-xs text-muted-foreground">{kullanici?.rol}</p>
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
