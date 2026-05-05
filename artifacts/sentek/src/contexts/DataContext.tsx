import { createContext, useContext, useState, ReactNode } from 'react';
import { TestKaydi, LabSevk, LabSevkDurumu, Stok, Kullanici, Bildirim, BildirimTur, TeslimAlmaFormu, AuditLog, AuditIslemTipi, OfflineSyncKaydi } from '../types';
import { mockTestRecords, mockLabShipments, mockInventory, mockUsers, mockBildirimler, mockAuditLogs, mockOfflineSyncKayitlari } from '../data/mockData';

interface DataContextType {
  testKayitlari: TestKaydi[];
  labSevkler: LabSevk[];
  stoklar: Stok[];
  kullanicilar: Kullanici[];
  bildirimler: Bildirim[];
  auditLogs: AuditLog[];
  offlineSyncKayitlari: OfflineSyncKaydi[];
  cevrimici: boolean;
  okunmamisSayisi: number;
  senkronBekleyenSayisi: number;
  testKaydiEkle: (kayit: Omit<TestKaydi, 'id'>, stokId?: string) => TestKaydi;
  labSevkEkle: (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>) => LabSevk;
  labSevkDurumGuncelle: (id: string, durum: LabSevkDurumu, kullanici?: string, aciklama?: string) => void;
  labSevkTeslimAlmaKaydet: (id: string, form: TeslimAlmaFormu) => void;
  bildirimOku: (id: string) => void;
  tumunuOku: () => void;
  bildirimEkle: (mesaj: string, tur: BildirimTur, operasyonNo?: string) => void;
  stokDus: (stokId: string, adet?: number) => void;
  kitSeriNoKontrol: (seriNo: string) => { kullanilmis: boolean; sktGecmis: boolean; sktYaklasan: boolean };
  auditLogEkle: (islemTipi: AuditIslemTipi, kullanici: string, rol: string, aciklama: string, kayitNo?: string) => void;
  setCevrimici: (durum: boolean) => void;
  senkronizeEt: () => void;
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
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [offlineSyncKayitlari, setOfflineSyncKayitlari] = useState<OfflineSyncKaydi[]>(mockOfflineSyncKayitlari);
  const [cevrimici, setCevrimici] = useState(true);

  const okunmamisSayisi = bildirimler.filter(b => !b.okundu).length;
  const senkronBekleyenSayisi = offlineSyncKayitlari.filter(s => s.durum === 'Senkron Bekliyor').length;

  const auditLogEkle = (islemTipi: AuditIslemTipi, kullanici: string, rol: string, aciklama: string, kayitNo?: string) => {
    const yeni: AuditLog = {
      id: `AUD-${Date.now()}`,
      islemTipi,
      tarih: new Date().toISOString(),
      kullanici,
      rol: rol as any,
      aciklama,
      kayitNo,
      ipAdresi: '10.0.2.' + Math.floor(Math.random() * 200 + 50),
    };
    setAuditLogs(prev => [yeni, ...prev]);
  };

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

  const senkronizeEt = () => {
    const bekleyenler = offlineSyncKayitlari.filter(s => s.durum === 'Senkron Bekliyor');
    if (bekleyenler.length === 0) return;

    setOfflineSyncKayitlari(prev =>
      prev.map(s => s.durum === 'Senkron Bekliyor' ? { ...s, durum: 'Senkronize Edildi' as const } : s)
    );
    setTestKayitlari(prev =>
      prev.map(t => t.syncDurumu === 'Senkron Bekliyor' ? { ...t, syncDurumu: 'Senkronize Edildi' as const } : t)
    );
    bekleyenler.forEach(s => {
      bildirimEkle(`${s.aciklama} — merkeze başarıyla aktarıldı.`, 'sync');
      auditLogEkle('Senkronize Edildi', 'Sistem', 'Sistem Yöneticisi', `Offline kayıt merkeze aktarıldı: ${s.aciklama}`, s.id);
    });
  };

  const testKaydiEkle = (kayit: Omit<TestKaydi, 'id'>, stokId?: string): TestKaydi => {
    const syncDurumu = cevrimici ? 'Senkronize Edildi' as const : 'Senkron Bekliyor' as const;
    const yeni: TestKaydi = { ...kayit, id: `TR-${Date.now()}`, syncDurumu };
    setTestKayitlari(prev => [yeni, ...prev]);

    if (stokId) stokDus(stokId);

    if (!cevrimici) {
      const syncKaydi: OfflineSyncKaydi = {
        id: `SYNC-${Date.now()}`,
        tur: 'test',
        aciklama: `${yeni.id} — ${kayit.lokasyon}, ${kayit.numuneTuru}`,
        tarih: new Date().toISOString(),
        durum: 'Senkron Bekliyor',
      };
      setOfflineSyncKayitlari(prev => [syncKaydi, ...prev]);
      bildirimEkle('Yeni offline test kaydı — bağlantı geldiğinde senkronize edilecek.', 'sync');
    } else {
      if (kayit.testSonucu === 'Pozitif') {
        bildirimEkle(
          `Pozitif test — ${kayit.operasyonNo}, ${kayit.lokasyon}.${kayit.tespitEdilenMadde ? ` Tespit: ${kayit.tespitEdilenMadde}.` : ''}`,
          'pozitif', kayit.operasyonNo
        );
      } else if (kayit.testSonucu === 'Geçersiz' && (kayit.analizGuvenSkoru || 100) < 50) {
        bildirimEkle(`Düşük güven skorlu geçersiz test — ${kayit.operasyonNo}. Manuel kontrol önerilir.`, 'analiz', kayit.operasyonNo);
      }
    }

    auditLogEkle('Test Oluşturuldu', kayit.personelAdi, 'Saha Personeli', `Yeni test kaydı oluşturuldu. Sonuç: ${kayit.testSonucu}.`, yeni.id);
    return yeni;
  };

  const labSevkEkle = (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>): LabSevk => {
    const sayac = labSevkler.length + 1;
    const yeni: LabSevk = {
      ...sevk,
      id: `LS-${Date.now()}`,
      numuneTakipNo: generateTakipNo(sayac + 12),
      olaylar: [
        { durum: 'Pozitif Tespit Edildi', tarih: new Date(Date.now() - 3600000).toISOString(), kullanici: sevk.sevkEdenBirim, aciklama: 'Saha testi pozitif sonuç verdi.' },
        { durum: 'Sevk Kaydı Oluşturuldu', tarih: new Date().toISOString(), kullanici: 'Saha Personeli', aciklama: 'Sevk kaydı sisteme girildi.' },
      ],
    };
    setLabSevkler(prev => [yeni, ...prev]);
    bildirimEkle(`Yeni lab sevk — ${yeni.numuneTakipNo}, ${sevk.sevkEdenBirim}.`, 'lab', sevk.operasyonNo);
    auditLogEkle('Lab Sevk Oluşturuldu', 'Saha Personeli', 'Saha Personeli', `Lab sevk kaydı oluşturuldu.`, yeni.id);
    return yeni;
  };

  const labSevkDurumGuncelle = (id: string, durum: LabSevkDurumu, kullanici = 'Sistem', aciklama?: string) => {
    setLabSevkler(prev => prev.map(s => {
      if (s.id !== id) return s;
      const yeniOlay = { durum, tarih: new Date().toISOString(), kullanici, aciklama };
      return { ...s, durum, olaylar: [...(s.olaylar || []), yeniOlay] };
    }));
    const sevk = labSevkler.find(s => s.id === id);
    if (durum === 'Laboratuvara Ulaştı') bildirimEkle(`${sevk?.numuneTakipNo} laboratuvara ulaştı.`, 'lab', sevk?.operasyonNo);
    else if (durum === 'Rapor Yüklendi') bildirimEkle(`${sevk?.numuneTakipNo} için rapor yüklendi.`, 'rapor', sevk?.operasyonNo);
    else if (durum === 'Teslim Alındı') bildirimEkle(`${sevk?.numuneTakipNo} teslim alındı.`, 'lab', sevk?.operasyonNo);
    auditLogEkle(
      durum === 'Analiz Sırasında' ? 'Analiz Başlatıldı' : durum === 'Rapor Yüklendi' ? 'Rapor Yüklendi' : durum === 'Dosya Kapatıldı' ? 'Dosya Kapatıldı' : 'Teslim Alındı',
      kullanici, 'Laboratuvar Kullanıcısı', `Durum güncellendi: ${durum}`, id
    );
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
      return { ...s, durum: 'Teslim Alındı' as LabSevkDurumu, teslimAlma: form, olaylar: [...(s.olaylar || []), yeniOlay] };
    }));
    const sevk = labSevkler.find(s => s.id === id);
    bildirimEkle(`${sevk?.numuneTakipNo || id} teslim alındı — ${form.kabulDurumu}.`, 'lab', sevk?.operasyonNo);
    auditLogEkle('Teslim Alındı', form.teslimAlanPersonel, 'Laboratuvar Kullanıcısı', `Numune teslim alındı. Kabul: ${form.kabulDurumu}.`, id);
  };

  return (
    <DataContext.Provider value={{
      testKayitlari, labSevkler, stoklar, kullanicilar, bildirimler, auditLogs, offlineSyncKayitlari,
      cevrimici, okunmamisSayisi, senkronBekleyenSayisi,
      testKaydiEkle, labSevkEkle, labSevkDurumGuncelle, labSevkTeslimAlmaKaydet,
      bildirimOku, tumunuOku, bildirimEkle, stokDus, kitSeriNoKontrol,
      auditLogEkle, setCevrimici, senkronizeEt,
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
