import { createContext, useContext, useState, ReactNode } from 'react';
import { TestKaydi, LabSevk, Stok, Kullanici } from '../types';
import { mockTestRecords, mockLabShipments, mockInventory, mockUsers } from '../data/mockData';

interface DataContextType {
  testKayitlari: TestKaydi[];
  labSevkler: LabSevk[];
  stoklar: Stok[];
  kullanicilar: Kullanici[];
  testKaydiEkle: (kayit: Omit<TestKaydi, 'id'>) => TestKaydi;
  labSevkEkle: (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>) => LabSevk;
  labSevkDurumGuncelle: (id: string, durum: LabSevk['durum']) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [testKayitlari, setTestKayitlari] = useState<TestKaydi[]>(mockTestRecords);
  const [labSevkler, setLabSevkler] = useState<LabSevk[]>(mockLabShipments);
  const [stoklar] = useState<Stok[]>(mockInventory);
  const [kullanicilar] = useState<Kullanici[]>(mockUsers);

  const testKaydiEkle = (kayit: Omit<TestKaydi, 'id'>): TestKaydi => {
    const yeni: TestKaydi = { ...kayit, id: `TR-${Date.now()}` };
    setTestKayitlari(prev => [yeni, ...prev]);
    return yeni;
  };

  const labSevkEkle = (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>): LabSevk => {
    const sayac = String(labSevkler.length + 1).padStart(6, '0');
    const yeni: LabSevk = {
      ...sevk,
      id: `LS-${Date.now()}`,
      numuneTakipNo: `SNT-LAB-2026-${sayac}`,
    };
    setLabSevkler(prev => [yeni, ...prev]);
    return yeni;
  };

  const labSevkDurumGuncelle = (id: string, durum: LabSevk['durum']) => {
    setLabSevkler(prev => prev.map(s => s.id === id ? { ...s, durum } : s));
  };

  return (
    <DataContext.Provider value={{ testKayitlari, labSevkler, stoklar, kullanicilar, testKaydiEkle, labSevkEkle, labSevkDurumGuncelle }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
