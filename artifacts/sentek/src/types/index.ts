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
  kitPanelTipi?: string;
  fotografUrl?: string;
  testSonucu: TestSonucu;
  tespitEdilenMadde?: string;
  notlar?: string;
  personelAdi: string;
  labSevkDurumu?: string;
  labSevkId?: string;
  analizGuvenSkoru?: number;
  stokId?: string;
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

export interface LabSevkOlay {
  durum: LabSevkDurumu;
  tarih: string;
  kullanici: string;
  aciklama?: string;
}

export interface TeslimAlmaFormu {
  teslimAlanPersonel: string;
  teslimTarihi: string;
  ambalajButunlugu: 'Uygun' | 'Şüpheli' | 'Uygun Değil';
  muhrKontrol: 'Uygun' | 'Uygun Değil';
  fizikselDurumNotu: string;
  kabulDurumu: 'Kabul' | 'Şartlı Kabul' | 'Reddedildi';
}

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
  kitSeriNo?: string;
  kitSKT?: string;
  sevkEdenBirim: string;
  gonderimYontemi?: string;
  tahminiVaris?: string;
  durum: LabSevkDurumu;
  notlar?: string;
  oncelik: 'Yüksek' | 'Normal' | 'Düşük';
  olaylar?: LabSevkOlay[];
  teslimAlma?: TeslimAlmaFormu;
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

export type BildirimTur = 'pozitif' | 'stok' | 'lab' | 'analiz' | 'rapor' | 'sistem';

export interface Bildirim {
  id: string;
  mesaj: string;
  tur: BildirimTur;
  tarih: string;
  okundu: boolean;
  operasyonNo?: string;
  link?: string;
}
