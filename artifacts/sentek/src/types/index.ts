export type Role = 'Sistem Yöneticisi' | 'Merkez Yönetici' | 'Bölge Yetkilisi' | 'Saha Personeli' | 'Laboratuvar Kullanıcısı';

export interface Kullanici {
  id: string;
  ad: string;
  email: string;
  rol: Role;
  birim: string;
  durum: 'Aktif' | 'Pasif';
  sonGiris: string;
  varsayilanLokasyon?: string;
  varsayilanKontrolNokta?: string;
}

export type TestSonucu = 'Pozitif' | 'Negatif' | 'Geçersiz';
export type SyncDurumu = 'Senkronize Edildi' | 'Senkron Bekliyor';

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
  syncDurumu?: SyncDurumu;
  qrKodu?: string;
  aiOnerisi?: TestSonucu;
  kullaniciOverrideAciklamasi?: string;
  fotografOverlayUrl?: string;
  panelSonuclari?: PanelSonuc[];
}

export interface PanelSonuc {
  kod: string;
  C: boolean;
  T: boolean;
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
  qrKodu?: string;
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

export type BildirimTur = 'pozitif' | 'stok' | 'lab' | 'analiz' | 'rapor' | 'sistem' | 'sync';

export interface Bildirim {
  id: string;
  mesaj: string;
  tur: BildirimTur;
  tarih: string;
  okundu: boolean;
  operasyonNo?: string;
  link?: string;
}

export type AuditIslemTipi =
  | 'Test Oluşturuldu' | 'Fotoğraf Eklendi' | 'AI Analiz' | 'Sonuç Doğrulandı'
  | 'Stok Düşüldü' | 'Lab Sevk Oluşturuldu' | 'Teslim Alındı' | 'Analiz Başlatıldı'
  | 'Rapor Yüklendi' | 'Dosya Kapatıldı' | 'QR Etiket Oluşturuldu' | 'Etiket Yazdırıldı'
  | 'Kullanıcı Girişi' | 'Kayıt Güncellendi' | 'Stok Güncellendi' | 'Senkronize Edildi'
  | 'Rapor Oluşturuldu' | 'Detay Görüntülendi';

export interface AuditLog {
  id: string;
  islemTipi: AuditIslemTipi;
  tarih: string;
  kullanici: string;
  rol: Role;
  aciklama: string;
  kayitNo?: string;
  ipAdresi?: string;
}

export interface OfflineSyncKaydi {
  id: string;
  tur: 'test' | 'labSevk';
  aciklama: string;
  tarih: string;
  durum: SyncDurumu;
}

export interface RaporImzaSatiri {
  unvan: string;
  ad: string;
}

export type RaporRenkTema = 'kurumsal' | 'koyu' | 'klasik';
export type RaporGizlilikSeviyesi = 'GİZLİ' | 'ÖZEL' | 'HİZMETE ÖZEL' | 'TASNİF DIŞI';

export interface RaporAyarlari {
  id: 'singleton';
  kurumAdi: string;
  birimAdi: string;
  kurumAdresi: string;
  iletisim: string;
  belgeNoOnEki: string;
  gizlilikSeviyesi: RaporGizlilikSeviyesi;
  ustBilgi: string;
  altBilgi: string;
  watermarkGoster: boolean;
  watermarkMetin: string;
  kapakSayfasiGoster: boolean;
  qrGoster: boolean;
  aiDetayGoster: boolean;
  panelTablosuGoster: boolean;
  zincirGoster: boolean;
  fotoGoster: boolean;
  imzaSatirlari: RaporImzaSatiri[];
  renkTema: RaporRenkTema;
  kurumLogoDataUrl?: string;
  guncellemeTarihi: string;
}
