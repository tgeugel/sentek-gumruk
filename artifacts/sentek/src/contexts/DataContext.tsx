import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { TestKaydi, LabSevk, LabSevkDurumu, Stok, Kullanici, Bildirim, BildirimTur, TeslimAlmaFormu, AuditLog, AuditIslemTipi, OfflineSyncKaydi } from '../types';
import { mockTestRecords, mockLabShipments, mockInventory, mockUsers, mockBildirimler, mockAuditLogs } from '../data/mockData';
import { db } from '../lib/db';
import { useSyncManager } from '../hooks/useSyncManager';

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
  sonSenkron: string | null;
  testKaydiEkle: (kayit: Omit<TestKaydi, 'id'>, stokId?: string) => Promise<TestKaydi>;
  labSevkEkle: (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>) => Promise<LabSevk>;
  labSevkDurumGuncelle: (id: string, durum: LabSevkDurumu, kullanici?: string, aciklama?: string) => Promise<void>;
  labSevkTeslimAlmaKaydet: (id: string, form: TeslimAlmaFormu) => Promise<void>;
  bildirimOku: (id: string) => Promise<void>;
  tumunuOku: () => Promise<void>;
  bildirimEkle: (mesaj: string, tur: BildirimTur, operasyonNo?: string) => Promise<void>;
  stokDus: (stokId: string, adet?: number) => Promise<void>;
  kitSeriNoKontrol: (seriNo: string) => { kullanilmis: boolean; sktGecmis: boolean; sktYaklasan: boolean };
  auditLogEkle: (islemTipi: AuditIslemTipi, kullanici: string, rol: string, aciklama: string, kayitNo?: string) => Promise<void>;
  setCevrimici: (durum: boolean) => void;
  senkronizeEt: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

function generateTakipNo(index: number) {
  return `SNT-LAB-2026-${String(index).padStart(6, '0')}`;
}

let dbSeeded = false;

async function seedDB() {
  if (dbSeeded) return;
  dbSeeded = true;
  const count = await db.testKayitlari.count();
  if (count > 0) return;

  await db.transaction('rw', [db.testKayitlari, db.labSevkKayitlari, db.stokHareketleri, db.bildirimler, db.auditLog], async () => {
    await db.testKayitlari.bulkAdd(mockTestRecords);
    await db.labSevkKayitlari.bulkAdd(mockLabShipments);
    await db.stokHareketleri.bulkAdd(mockInventory);
    await db.bildirimler.bulkAdd(mockBildirimler);
    await db.auditLog.bulkAdd(mockAuditLogs);
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { cevrimici, setCevrimici, bekleyenSayisi, sonSenkron, senkronizeEt: syncManagerSenkronizeEt } = useSyncManager();

  const [kullanicilar] = useState<Kullanici[]>(mockUsers);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    seedDB().then(() => setSeeded(true));
  }, []);

  const testKayitlari = useLiveQuery(() => db.testKayitlari.orderBy('tarih').reverse().toArray(), [], []) as TestKaydi[];
  const labSevkler = useLiveQuery(() => db.labSevkKayitlari.orderBy('id').reverse().toArray(), [], []) as LabSevk[];
  const stoklar = useLiveQuery(() => db.stokHareketleri.toArray(), [], []) as Stok[];
  const bildirimler = useLiveQuery(() => db.bildirimler.orderBy('tarih').reverse().toArray(), [], []) as Bildirim[];
  const auditLogs = useLiveQuery(() => db.auditLog.orderBy('tarih').reverse().toArray(), [], []) as AuditLog[];
  const senkronKuyrugu = useLiveQuery(() => db.senkronKuyrugu.toArray(), [], []);

  const offlineSyncKayitlari: OfflineSyncKaydi[] = (senkronKuyrugu || []).map(k => ({
    id: k.id,
    tur: k.tur as 'test' | 'labSevk',
    aciklama: k.aciklama,
    tarih: k.tarih,
    durum: k.durum === 'Senkronize Edildi' ? 'Senkronize Edildi' : 'Senkron Bekliyor',
  }));

  const okunmamisSayisi = (bildirimler || []).filter(b => !b.okundu).length;
  const senkronBekleyenSayisi = bekleyenSayisi;

  const auditLogEkle = async (islemTipi: AuditIslemTipi, kullanici: string, rol: string, aciklama: string, kayitNo?: string) => {
    await db.auditLog.add({
      id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      islemTipi,
      tarih: new Date().toISOString(),
      kullanici,
      rol: rol as any,
      aciklama,
      kayitNo,
      ipAdresi: '10.0.2.' + Math.floor(Math.random() * 200 + 50),
    });
  };

  const bildirimEkle = async (mesaj: string, tur: BildirimTur, operasyonNo?: string) => {
    await db.bildirimler.add({
      id: `BLD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mesaj,
      tur,
      tarih: new Date().toISOString(),
      okundu: false,
      operasyonNo,
    });
  };

  const bildirimOku = async (id: string) => {
    await db.bildirimler.update(id, { okundu: true });
  };

  const tumunuOku = async () => {
    await db.bildirimler.toCollection().modify({ okundu: true });
  };

  const stokDus = async (stokId: string, adet = 1) => {
    const stok = await db.stokHareketleri.get(stokId);
    if (!stok) return;
    const yeniKalan = Math.max(0, stok.kalanAdedi - adet);
    const yeniKullanilan = stok.kullanilanAdedi + adet;
    let yeniDurum: Stok['durum'] = stok.durum;
    if (yeniKalan === 0) yeniDurum = 'Tükendi';
    else if (yeniKalan <= stok.kritikSeviye) yeniDurum = 'Kritik';
    if (yeniKalan <= stok.kritikSeviye && yeniKalan > 0 && stok.durum !== 'Kritik') {
      await bildirimEkle(
        `${stok.urunAdi} (${stok.lotSeriNo}) kritik stok seviyesine düştü — ${yeniKalan} adet kaldı.`,
        'stok'
      );
    }
    await db.stokHareketleri.update(stokId, {
      kalanAdedi: yeniKalan,
      kullanilanAdedi: yeniKullanilan,
      durum: yeniDurum,
    });
  };

  const kitSeriNoKontrol = (seriNo: string) => {
    const kullanilmis = (testKayitlari || []).some(t => t.kitSeriNo === seriNo);
    const stok = (stoklar || []).find(s => seriNo.startsWith(s.lotSeriNo));
    const now = new Date();
    const sktTarih = stok ? new Date(stok.skt) : null;
    const sktGecmis = sktTarih ? sktTarih < now : false;
    const sktYaklasan = sktTarih ? (!sktGecmis && (sktTarih.getTime() - now.getTime()) < 90 * 24 * 60 * 60 * 1000) : false;
    return { kullanilmis, sktGecmis, sktYaklasan };
  };

  const senkronizeEt = async () => {
    await syncManagerSenkronizeEt();
  };

  const testKaydiEkle = async (kayit: Omit<TestKaydi, 'id'>, stokId?: string): Promise<TestKaydi> => {
    const syncDurumu = cevrimici ? 'Senkronize Edildi' as const : 'Senkron Bekliyor' as const;
    const yeni: TestKaydi = { ...kayit, id: `TR-${Date.now()}`, syncDurumu };
    await db.testKayitlari.add(yeni);

    if (stokId) await stokDus(stokId);

    if (!cevrimici) {
      await db.senkronKuyrugu.add({
        id: `SYNC-${Date.now()}`,
        tur: 'test',
        aciklama: `${yeni.id} — ${kayit.lokasyon}, ${kayit.numuneTuru}`,
        tarih: new Date().toISOString(),
        durum: 'Senkron Bekliyor',
      });
      await bildirimEkle('Yeni offline test kaydı — bağlantı geldiğinde senkronize edilecek.', 'sync');
    } else {
      if (kayit.testSonucu === 'Pozitif') {
        await bildirimEkle(
          `Pozitif test — ${kayit.operasyonNo}, ${kayit.lokasyon}.${kayit.tespitEdilenMadde ? ` Tespit: ${kayit.tespitEdilenMadde}.` : ''}`,
          'pozitif', kayit.operasyonNo
        );
      } else if (kayit.testSonucu === 'Geçersiz' && (kayit.analizGuvenSkoru || 100) < 50) {
        await bildirimEkle(`Düşük güven skorlu geçersiz test — ${kayit.operasyonNo}. Manuel kontrol önerilir.`, 'analiz', kayit.operasyonNo);
      }
    }

    await auditLogEkle('Test Oluşturuldu', kayit.personelAdi, 'Saha Personeli', `Yeni test kaydı oluşturuldu. Sonuç: ${kayit.testSonucu}.`, yeni.id);
    return yeni;
  };

  const labSevkEkle = async (sevk: Omit<LabSevk, 'id' | 'numuneTakipNo'>): Promise<LabSevk> => {
    const sayac = (labSevkler || []).length + 1;
    const yeni: LabSevk = {
      ...sevk,
      id: `LS-${Date.now()}`,
      numuneTakipNo: generateTakipNo(sayac + 12),
      olaylar: [
        { durum: 'Pozitif Tespit Edildi', tarih: new Date(Date.now() - 3600000).toISOString(), kullanici: sevk.sevkEdenBirim, aciklama: 'Saha testi pozitif sonuç verdi.' },
        { durum: 'Sevk Kaydı Oluşturuldu', tarih: new Date().toISOString(), kullanici: 'Saha Personeli', aciklama: 'Sevk kaydı sisteme girildi.' },
      ],
    };
    await db.labSevkKayitlari.add(yeni);
    await bildirimEkle(`Yeni lab sevk — ${yeni.numuneTakipNo}, ${sevk.sevkEdenBirim}.`, 'lab', sevk.operasyonNo);
    await auditLogEkle('Lab Sevk Oluşturuldu', 'Saha Personeli', 'Saha Personeli', `Lab sevk kaydı oluşturuldu.`, yeni.id);
    return yeni;
  };

  const labSevkDurumGuncelle = async (id: string, durum: LabSevkDurumu, kullanici = 'Sistem', aciklama?: string) => {
    const sevk = await db.labSevkKayitlari.get(id);
    if (!sevk) return;
    const yeniOlay = { durum, tarih: new Date().toISOString(), kullanici, aciklama };
    await db.labSevkKayitlari.update(id, {
      durum,
      olaylar: [...(sevk.olaylar || []), yeniOlay],
    });
    if (durum === 'Laboratuvara Ulaştı') await bildirimEkle(`${sevk.numuneTakipNo} laboratuvara ulaştı.`, 'lab', sevk.operasyonNo);
    else if (durum === 'Rapor Yüklendi') await bildirimEkle(`${sevk.numuneTakipNo} için rapor yüklendi.`, 'rapor', sevk.operasyonNo);
    else if (durum === 'Teslim Alındı') await bildirimEkle(`${sevk.numuneTakipNo} teslim alındı.`, 'lab', sevk.operasyonNo);
    await auditLogEkle(
      durum === 'Analiz Sırasında' ? 'Analiz Başlatıldı' : durum === 'Rapor Yüklendi' ? 'Rapor Yüklendi' : durum === 'Dosya Kapatıldı' ? 'Dosya Kapatıldı' : 'Teslim Alındı',
      kullanici, 'Laboratuvar Kullanıcısı', `Durum güncellendi: ${durum}`, id
    );
  };

  const labSevkTeslimAlmaKaydet = async (id: string, form: TeslimAlmaFormu) => {
    const sevk = await db.labSevkKayitlari.get(id);
    if (!sevk) return;
    const yeniOlay = {
      durum: 'Teslim Alındı' as LabSevkDurumu,
      tarih: new Date().toISOString(),
      kullanici: form.teslimAlanPersonel,
      aciklama: `Kabul: ${form.kabulDurumu} — Ambalaj: ${form.ambalajButunlugu}`,
    };
    await db.labSevkKayitlari.update(id, {
      durum: 'Teslim Alındı' as LabSevkDurumu,
      teslimAlma: form,
      olaylar: [...(sevk.olaylar || []), yeniOlay],
    });
    await bildirimEkle(`${sevk.numuneTakipNo || id} teslim alındı — ${form.kabulDurumu}.`, 'lab', sevk.operasyonNo);
    await auditLogEkle('Teslim Alındı', form.teslimAlanPersonel, 'Laboratuvar Kullanıcısı', `Numune teslim alındı. Kabul: ${form.kabulDurumu}.`, id);
  };

  return (
    <DataContext.Provider value={{
      testKayitlari: testKayitlari || [],
      labSevkler: labSevkler || [],
      stoklar: stoklar || [],
      kullanicilar,
      bildirimler: bildirimler || [],
      auditLogs: auditLogs || [],
      offlineSyncKayitlari,
      cevrimici,
      okunmamisSayisi,
      senkronBekleyenSayisi,
      sonSenkron,
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
