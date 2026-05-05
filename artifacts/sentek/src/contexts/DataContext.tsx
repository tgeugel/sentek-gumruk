import { createContext, useContext, useState, ReactNode } from 'react';
import { TestKaydi, LabSevk, LabSevkDurumu, Stok, Kullanici, Bildirim, BildirimTur, TeslimAlmaFormu } from '../types';
import { mockTestRecords, mockLabShipments, mockInventory, mockUsers, mockBildirimler } from '../data/mockData';

interface DataContextType {
  testKayitlari: TestKaydi[];
  labSevkler: LabSevk[];
  stoklar: Stok[];
  kullanicilar: Kullanici[];
  bildirimler: Bildirim[];
  okunmamisSayisi: number;
  testKaydiEkle: (kayit: Omit<TestKaydi, 'id'>, stokId?: string) => TestKaydi;
  labSevkEkle: (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>) => LabSevk;
  labSevkDurumGuncelle: (id: string, durum: LabSevkDurumu, kullanici?: string, aciklama?: string) => void;
  labSevkTeslimAlmaKaydet: (id: string, form: TeslimAlmaFormu) => void;
  bildirimOku: (id: string) => void;
  tumunuOku: () => void;
  bildirimEkle: (mesaj: string, tur: BildirimTur, operasyonNo?: string) => void;
  stokDus: (stokId: string, adet?: number) => void;
  kitSeriNoKontrol: (seriNo: string) => { kullanilmis: boolean; sktGecmis: boolean; sktYaklasan: boolean };
}

const DataContext = createContext<DataContextType | null>(null);

function generateTakipNo(index: number) {
  return `SNT-LAB-2026-${String(index).padStart(6, '0')}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [testKayitlari, setTestKayitlari] = useState<TestKaydi[]>(mockTestRecords);
  const [labSevkler, setLabSevkler] = useState<LabSevk[]>(mockLabShipments);
  const [stoklar, setStoklar] = useState<Stok[]>(mockInventory);
  const [kullanicilar] = useState<Kullanici[]>(mockUsers);
  const [bildirimler, setBildirimler] = useState<Bildirim[]>(mockBildirimler);

  const okunmamisSayisi = bildirimler.filter(b => !b.okundu).length;

  const bildirimEkle = (mesaj: string, tur: BildirimTur, operasyonNo?: string) => {
    const yeni: Bildirim = {
      id: `BLD-${Date.now()}`,
      mesaj,
      tur,
      tarih: new Date().toISOString(),
      okundu: false,
      operasyonNo,
    };
    setBildirimler(prev => [yeni, ...prev]);
  };

  const bildirimOku = (id: string) => {
    setBildirimler(prev => prev.map(b => b.id === id ? { ...b, okundu: true } : b));
  };

  const tumunuOku = () => {
    setBildirimler(prev => prev.map(b => ({ ...b, okundu: true })));
  };

  const stokDus = (stokId: string, adet = 1) => {
    setStoklar(prev => prev.map(s => {
      if (s.id !== stokId) return s;
      const yeniKalan = Math.max(0, s.kalanAdedi - adet);
      const yeniKullanilan = s.kullanilanAdedi + adet;
      let yeniDurum: Stok['durum'] = s.durum;
      if (yeniKalan === 0) yeniDurum = 'Tükendi';
      else if (yeniKalan <= s.kritikSeviye) yeniDurum = 'Kritik';
      if (yeniKalan <= s.kritikSeviye && yeniKalan > 0 && s.durum !== 'Kritik') {
        bildirimEkle(
          `${s.urunAdi} (${s.lotSeriNo}) kritik stok seviyesine düştü — ${yeniKalan} adet kaldı.`,
          'stok'
        );
      }
      return { ...s, kalanAdedi: yeniKalan, kullanilanAdedi: yeniKullanilan, durum: yeniDurum };
    }));
  };

  const kitSeriNoKontrol = (seriNo: string) => {
    const kullanilmis = testKayitlari.some(t => t.kitSeriNo === seriNo);
    const stok = stoklar.find(s => seriNo.startsWith(s.lotSeriNo));
    const now = new Date();
    const sktTarih = stok ? new Date(stok.skt) : null;
    const sktGecmis = sktTarih ? sktTarih < now : false;
    const sktYaklasan = sktTarih ? (!sktGecmis && (sktTarih.getTime() - now.getTime()) < 90 * 24 * 60 * 60 * 1000) : false;
    return { kullanilmis, sktGecmis, sktYaklasan };
  };

  const testKaydiEkle = (kayit: Omit<TestKaydi, 'id'>, stokId?: string): TestKaydi => {
    const yeni: TestKaydi = { ...kayit, id: `TR-${Date.now()}` };
    setTestKayitlari(prev => [yeni, ...prev]);

    if (stokId) {
      stokDus(stokId);
    }

    if (kayit.testSonucu === 'Pozitif') {
      bildirimEkle(
        `Pozitif test kaydı oluşturuldu — ${kayit.operasyonNo}, ${kayit.lokasyon}.${kayit.tespitEdilenMadde ? ` Tespit: ${kayit.tespitEdilenMadde}.` : ''}`,
        'pozitif',
        kayit.operasyonNo
      );
    } else if (kayit.testSonucu === 'Geçersiz' && (kayit.analizGuvenSkoru || 100) < 50) {
      bildirimEkle(
        `Düşük güven skorlu geçersiz test — ${kayit.operasyonNo}. Manuel kontrol önerilir.`,
        'analiz',
        kayit.operasyonNo
      );
    }

    return yeni;
  };

  const labSevkEkle = (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>): LabSevk => {
    const sayac = labSevkler.length + 1;
    const yeni: LabSevk = {
      ...sevk,
      id: `LS-${Date.now()}`,
      numuneTakipNo: generateTakipNo(sayac + 9),
      olaylar: [
        { durum: 'Pozitif Tespit Edildi', tarih: new Date(Date.now() - 3600000).toISOString(), kullanici: sevk.sevkEdenBirim, aciklama: 'Saha testi pozitif sonuç verdi.' },
        { durum: 'Sevk Kaydı Oluşturuldu', tarih: new Date().toISOString(), kullanici: 'Saha Personeli', aciklama: 'Sevk kaydı sisteme girildi.' },
      ],
    };
    setLabSevkler(prev => [yeni, ...prev]);
    bildirimEkle(
      `Yeni lab sevk kaydı oluşturuldu — ${yeni.numuneTakipNo}, ${sevk.sevkEdenBirim}.`,
      'lab',
      sevk.operasyonNo
    );
    return yeni;
  };

  const labSevkDurumGuncelle = (id: string, durum: LabSevkDurumu, kullanici = 'Sistem', aciklama?: string) => {
    setLabSevkler(prev => prev.map(s => {
      if (s.id !== id) return s;
      const yeniOlay = { durum, tarih: new Date().toISOString(), kullanici, aciklama };
      return { ...s, durum, olaylar: [...(s.olaylar || []), yeniOlay] };
    }));

    const sevk = labSevkler.find(s => s.id === id);
    if (durum === 'Laboratuvara Ulaştı') {
      bildirimEkle(`${sevk?.numuneTakipNo} numunesı laboratuvara ulaştı.`, 'lab', sevk?.operasyonNo);
    } else if (durum === 'Rapor Yüklendi') {
      bildirimEkle(`${sevk?.numuneTakipNo} için rapor yüklendi.`, 'rapor', sevk?.operasyonNo);
    } else if (durum === 'Teslim Alındı') {
      bildirimEkle(`${sevk?.numuneTakipNo} teslim alındı.`, 'lab', sevk?.operasyonNo);
    }
  };

  const labSevkTeslimAlmaKaydet = (id: string, form: TeslimAlmaFormu) => {
    setLabSevkler(prev => prev.map(s => {
      if (s.id !== id) return s;
      const yeniOlay = {
        durum: 'Teslim Alındı' as LabSevkDurumu,
        tarih: new Date().toISOString(),
        kullanici: form.teslimAlanPersonel,
        aciklama: `Kabul: ${form.kabulDurumu} — Ambalaj: ${form.ambalajButunlugu}`,
      };
      return {
        ...s,
        durum: 'Teslim Alındı' as LabSevkDurumu,
        teslimAlma: form,
        olaylar: [...(s.olaylar || []), yeniOlay],
      };
    }));

    const sevk = labSevkler.find(s => s.id === id);
    bildirimEkle(`${sevk?.numuneTakipNo || id} teslim alındı — ${form.kabulDurumu}.`, 'lab', sevk?.operasyonNo);
  };

  return (
    <DataContext.Provider value={{
      testKayitlari, labSevkler, stoklar, kullanicilar, bildirimler, okunmamisSayisi,
      testKaydiEkle, labSevkEkle, labSevkDurumGuncelle, labSevkTeslimAlmaKaydet,
      bildirimOku, tumunuOku, bildirimEkle, stokDus, kitSeriNoKontrol,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
