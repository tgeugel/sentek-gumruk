export type Role = 'Sistem Yöneticisi' | 'Merkez Yönetici' | 'Bölge Yetkilisi' | 'Saha Personeli' | 'Laboratuvar Kullanıcısı';

export interface Kullanici {
  id: string;
  ad: string;
  email: string;
  rol: Role;
  birim: string;
  durum: 'Aktif' | 'Pasif';
  sonGiris: string;
}

export type TestSonucu = 'Pozitif' | 'Negatif' | 'Geçersiz';

export interface TestKaydi {
  id: string;
  operasyonNo: string;
  tarih: string;
  lokasyon: string;
  kontrolNokta: string;
  numuneTuru: string;
  sahisAciklamasi: string;
  kitSeriNo: string;
  kitSKT: string;
  fotografUrl?: string;
  testSonucu: TestSonucu;
  tespitEdilenMadde?: string;
  notlar?: string;
  personelAdi: string;
  labSevkDurumu?: string;
}

export type LabSevkDurumu = 
  | 'Pozitif Tespit Edildi'
  | 'Sevk Kaydı Oluşturuldu'
  | 'Numune Paketlendi'
  | 'Laboratuvara Yolda'
  | 'Laboratuvara Ulaştı'
  | 'Teslim Alındı'
  | 'Analiz Sırasında'
  | 'Rapor Yüklendi'
  | 'Dosya Kapatıldı';

export interface LabSevk {
  id: string;
  numuneTakipNo: string;
  operasyonNo: string;
  testKaydiId: string;
  numuneTuru: string;
  onTaramaSonucu: string;
  tespitEdilenMadde?: string;
  muhrEtiketNo?: string;
  delilPosetiNo?: string;
  sevkEdenBirim: string;
  gonderimYontemi?: string;
  tahminiVaris?: string;
  durum: LabSevkDurumu;
  notlar?: string;
  oncelik: 'Yüksek' | 'Normal' | 'Düşük';
}

export interface Stok {
  id: string;
  urunAdi: string;
  panelTipi: string;
  lotSeriNo: string;
  girisAdedi: number;
  kullanilanAdedi: number;
  kalanAdedi: number;
  skt: string;
  depo: string;
  kritikSeviye: number;
  durum: 'Normal' | 'Kritik' | 'SKT Yaklaşıyor' | 'Tükendi';
}
