import Dexie, { type EntityTable } from 'dexie';
import { TestKaydi, LabSevk, Stok, Bildirim, AuditLog, OfflineSyncKaydi } from '../types';

interface SenkronKuyruguKaydi {
  id: string;
  tur: 'test' | 'labSevk' | 'stok';
  aciklama: string;
  tarih: string;
  durum: 'Senkron Bekliyor' | 'Senkronize Edildi' | 'Senkron Hatasi';
  veri?: string;
}

class SentekDB extends Dexie {
  testKayitlari!: EntityTable<TestKaydi, 'id'>;
  labSevkKayitlari!: EntityTable<LabSevk, 'id'>;
  stokHareketleri!: EntityTable<Stok, 'id'>;
  auditLog!: EntityTable<AuditLog, 'id'>;
  bildirimler!: EntityTable<Bildirim, 'id'>;
  senkronKuyrugu!: EntityTable<SenkronKuyruguKaydi, 'id'>;

  constructor() {
    super('SentekDB');
    this.version(1).stores({
      testKayitlari: 'id, operasyonNo, tarih, lokasyon, testSonucu, syncDurumu, personelAdi',
      labSevkKayitlari: 'id, numuneTakipNo, operasyonNo, durum, testKaydiId',
      stokHareketleri: 'id, lotSeriNo, durum, panelTipi',
      auditLog: 'id, islemTipi, tarih, kullanici, kayitNo',
      bildirimler: 'id, tarih, okundu, tur',
      senkronKuyrugu: 'id, tarih, durum, tur',
    });
  }
}

export const db = new SentekDB();
export type { SenkronKuyruguKaydi };
