import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Kullanici, Role } from '../types';
import { mockUsers, DEMO_CREDENTIALS } from '../data/mockData';

interface AuthContextType {
  kullanici: Kullanici | null;
  girisYap: (email: string, sifre: string) => boolean;
  cikisYap: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sentek_user');
    if (saved) {
      try {
        setKullanici(JSON.parse(saved));
      } catch {}
    }
    setLoading(false);
  }, []);

  const girisYap = (email: string, sifre: string): boolean => {
    const creds = DEMO_CREDENTIALS[email.toLowerCase()];
    if (!creds || creds.sifre !== sifre) return false;
    const user = mockUsers.find(u => u.id === creds.kullaniciId);
    if (!user) return false;
    setKullanici(user);
    localStorage.setItem('sentek_user', JSON.stringify(user));
    return true;
  };

  const cikisYap = () => {
    setKullanici(null);
    localStorage.removeItem('sentek_user');
  };

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, cikisYap, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function rolRouteAl(rol: Role): string {
  if (rol === 'Saha Personeli') return '/mobile';
  return '/panel/dashboard';
}
