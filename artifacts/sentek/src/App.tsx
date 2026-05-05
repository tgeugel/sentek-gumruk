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

import Dashboard from "./pages/web/Dashboard";
import TestRecords from "./pages/web/TestRecords";
import Inventory from "./pages/web/Inventory";
import LabShipments from "./pages/web/LabShipments";
import Laboratory from "./pages/web/Laboratory";
import Reports from "./pages/web/Reports";
import Users from "./pages/web/Users";
import Settings from "./pages/web/Settings";

const queryClient = new QueryClient();

function ProtectedRoute({ children, mobileOnly, webOnly }: {
  children: React.ReactNode;
  mobileOnly?: boolean;
  webOnly?: boolean;
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

      {/* Mobile Routes */}
      <Route path="/mobile">
        {() => (
          <ProtectedRoute>
            <MobileLayout>
              <MobileHome />
            </MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/yeni-test">
        {() => (
          <ProtectedRoute>
            <MobileLayout>
              <NewTest />
            </MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/kayitlarim">
        {() => (
          <ProtectedRoute>
            <MobileLayout>
              <MyRecords />
            </MobileLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/sevklerim">
        {() => (
          <ProtectedRoute>
            <MobileLayout>
              <MyShipments />
            </MobileLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Web Panel Routes */}
      <Route path="/panel/dashboard">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <Dashboard />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/test-kayitlari">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <TestRecords />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/stok">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <Inventory />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/lab-sevk">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <LabShipments />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/laboratuvar">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <Laboratory />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/raporlar">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <Reports />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/kullanicilar">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <Users />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/panel/ayarlar">
        {() => (
          <ProtectedRoute webOnly>
            <WebPanelLayout>
              <Settings />
            </WebPanelLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback */}
      <Route>
        {() => <Redirect to="/" />}
      </Route>
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
