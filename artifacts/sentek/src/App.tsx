import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, rolRouteAl } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

import Login from "./pages/Login";
import MobileLayout from "./layouts/MobileLayout";
import WebPanelLayout from "./layouts/WebPanelLayout";

import MobileHome from "./pages/mobile/Home";
import MyRecords from "./pages/mobile/MyRecords";
import MyShipments from "./pages/mobile/MyShipments";
import NewTest from "./pages/mobile/NewTest";
import QRTara from "./pages/mobile/QRTara";

import Dashboard from "./pages/web/Dashboard";
import TestRecords from "./pages/web/TestRecords";
import Inventory from "./pages/web/Inventory";
import LabShipments from "./pages/web/LabShipments";
import Laboratory from "./pages/web/Laboratory";
import Reports from "./pages/web/Reports";
import Users from "./pages/web/Users";
import Settings from "./pages/web/Settings";
import LiveOps from "./pages/web/LiveOps";
import OperasyonHaritasi from "./pages/web/OperasyonHaritasi";

import { UnauthorizedPage } from "./components/sentek/UnauthorizedPage";
import { Role } from "./types";

const queryClient = new QueryClient();

const TUM_WEB_ROLLERI: Role[] = ['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi', 'Laboratuvar Kullanıcısı'];

function ProtectedRoute({
  children,
  mobileOnly,
  webOnly,
  allowedRoles,
  screenName,
}: {
  children: React.ReactNode;
  mobileOnly?: boolean;
  webOnly?: boolean;
  allowedRoles?: Role[];
  screenName?: string;
}) {
  const { kullanici, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!kullanici) return <Redirect to="/" />;

  if (mobileOnly && kullanici.rol !== 'Saha Personeli') return <Redirect to="/panel/dashboard" />;
  if (webOnly && kullanici.rol === 'Saha Personeli') return <Redirect to="/mobile" />;

  if (allowedRoles && !allowedRoles.includes(kullanici.rol)) {
    return (
      <WebPanelLayout>
        <UnauthorizedPage ekranAdi={screenName} />
      </WebPanelLayout>
    );
  }

  return <>{children}</>;
}

function AppRoot() {
  const { kullanici, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (kullanici) return <Redirect to={rolRouteAl(kullanici.rol)} />;
  return <Login />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AppRoot} />
      <Route path="/login" component={Login} />

      {/* ── Mobile Routes ── */}
      <Route path="/mobile">
        {() => (
          <ProtectedRoute mobileOnly>
            <MobileLayout><MobileHome /></MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/yeni-test">
        {() => (
          <ProtectedRoute mobileOnly>
            <MobileLayout><NewTest /></MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/kayitlarim">
        {() => (
          <ProtectedRoute mobileOnly>
            <MobileLayout><MyRecords /></MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/sevklerim">
        {() => (
          <ProtectedRoute mobileOnly>
            <MobileLayout><MyShipments /></MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/qr-tara">
        {() => (
          <ProtectedRoute mobileOnly>
            <MobileLayout><QRTara /></MobileLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* ── Web Panel Routes ── */}
      <Route path="/panel/dashboard">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi']} screenName="Dashboard">
            <WebPanelLayout><Dashboard /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/canli-ops">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi']} screenName="Canlı Operasyon">
            <WebPanelLayout><LiveOps /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/harita">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi']} screenName="Operasyon Haritası">
            <WebPanelLayout><OperasyonHaritasi /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/test-kayitlari">
        {() => (
          <ProtectedRoute webOnly allowedRoles={TUM_WEB_ROLLERI} screenName="Test Kayıtları">
            <WebPanelLayout><TestRecords /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/stok">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi']} screenName="Stok / Seri No">
            <WebPanelLayout><Inventory /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/lab-sevk">
        {() => (
          <ProtectedRoute webOnly allowedRoles={TUM_WEB_ROLLERI} screenName="Lab Sevk Takibi">
            <WebPanelLayout><LabShipments /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/laboratuvar">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici', 'Laboratuvar Kullanıcısı']} screenName="Laboratuvar">
            <WebPanelLayout><Laboratory /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/raporlar">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici', 'Bölge Yetkilisi']} screenName="Raporlar">
            <WebPanelLayout><Reports /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/kullanicilar">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi', 'Merkez Yönetici']} screenName="Kullanıcılar">
            <WebPanelLayout><Users /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/panel/ayarlar">
        {() => (
          <ProtectedRoute webOnly allowedRoles={['Sistem Yöneticisi']} screenName="Ayarlar">
            <WebPanelLayout><Settings /></WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route>{() => <Redirect to="/" />}</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
