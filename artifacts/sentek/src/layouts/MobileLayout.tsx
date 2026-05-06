import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, ClipboardList, Truck, User, Shield, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from '../components/sentek/NotificationBell';
import { OfflineBar } from '../components/sentek/OfflineBar';

const NAV_ITEMS = [
  { path: '/mobile', label: 'Ana Ekran', icon: Home, exact: true },
  { path: '/mobile/kayitlarim', label: 'Kayıtlarım', icon: ClipboardList },
  { path: '/mobile/yeni-test', label: 'Yeni Test', icon: Plus, isPrimary: true },
  { path: '/mobile/qr-tara', label: 'QR Tara', icon: QrCode },
  { path: '/mobile/sevklerim', label: 'Sevklerim', icon: Truck },
];

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { kullanici, cikisYap } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location === path;
    return location === path || (location.startsWith(path) && path !== '/mobile');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <OfflineBar />

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'hsl(var(--background) / 0.96)', backdropFilter: 'blur(24px) saturate(1.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.22) 0%, rgba(0,136,204,0.1) 100%)', border: '1px solid rgba(0,212,255,0.28)' }}>
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight">
              SEN<span className="text-primary">TEK</span>
            </span>
            <span className="text-[10px] text-muted-foreground/60 ml-2">Saha</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={cikisYap}
            data-testid="button-logout-mobile"
            title={kullanici?.ad ?? 'Kullanıcı'}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,136,204,0.08) 100%)', border: '1px solid rgba(0,212,255,0.22)' }}
          >
            <User className="w-3.5 h-3.5 text-primary/80" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 mobile-nav-bar">
        <div className="flex items-end justify-around px-2 py-1 pb-safe">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path, item.exact);

            if (item.isPrimary) {
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    data-testid={`nav-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col items-center gap-1 -mt-5 px-2"
                  >
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                      style={{
                        background: active
                          ? 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)'
                          : 'linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(0,136,204,0.85) 100%)',
                        boxShadow: '0 4px 24px rgba(0,212,255,0.4), 0 2px 8px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <span className="text-[10px] font-semibold" style={{ color: active ? '#00D4FF' : 'rgba(255,255,255,0.5)' }}>
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  data-testid={`nav-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="mobile-nav-item"
                  style={{ color: active ? '#00D4FF' : undefined }}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {active && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute -inset-1.5 rounded-xl -z-10"
                        style={{ background: 'rgba(0,212,255,0.1)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                      />
                    )}
                  </div>
                  <span>{item.label}</span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
