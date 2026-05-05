import { useLocation, Link } from 'wouter';
import { Home, Plus, ClipboardList, Truck, User, Shield, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from '../components/sentek/NotificationBell';
import { OfflineBar } from '../components/sentek/OfflineBar';

const NAV_ITEMS = [
  { path: '/mobile', label: 'Ana Ekran', icon: Home, exact: true },
  { path: '/mobile/yeni-test', label: 'Yeni Test', icon: Plus },
  { path: '/mobile/qr-tara', label: 'QR Tara', icon: QrCode },
  { path: '/mobile/kayitlarim', label: 'Kayıtlarım', icon: ClipboardList },
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

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-tight">
            SEN<span className="text-primary">TEK</span>
          </span>
          <span className="text-xs text-muted-foreground">Saha</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={cikisYap}
            data-testid="button-logout-mobile"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around px-1 py-2">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path, item.exact);
            const isYeniTest = item.path === '/mobile/yeni-test';
            const isQR = item.path === '/mobile/qr-tara';
            return (
              <Link key={item.path} href={item.path}>
                <button
                  data-testid={`nav-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl min-w-[52px] transition-all ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {isYeniTest ? (
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-[0_0_16px_rgba(0,212,255,0.4)]'
                        : 'bg-primary/20 text-primary'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                  ) : isQR ? (
                    <>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        active ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-secondary/30 border-border'
                      }`}>
                        <item.icon className={`w-4.5 h-4.5 ${active ? 'text-cyan-400' : ''}`} />
                      </div>
                      <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                    </>
                  ) : (
                    <>
                      <item.icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
                      <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                    </>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
