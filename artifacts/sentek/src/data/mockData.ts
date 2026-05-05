import { Kullanici, TestKaydi, LabSevk, Stok, Bildirim, LabSevkOlay } from '../types';

export const mockUsers: Kullanici[] = [
  { id: '1', ad: 'A. Yılmaz', email: 'admin@sentek.local', rol: 'Sistem Yöneticisi', birim: 'Merkez IT', durum: 'Aktif', sonGiris: '2026-05-05T08:30:00Z' },
  { id: '2', ad: 'M. Çelik', email: 'merkez@sentek.local', rol: 'Merkez Yönetici', birim: 'Operasyon Merkezi', durum: 'Aktif', sonGiris: '2026-05-05T09:15:00Z' },
  { id: '3', ad: 'A. Demir', email: 'bolge@sentek.local', rol: 'Bölge Yetkilisi', birim: 'Marmara Bölge Müdürlüğü', durum: 'Aktif', sonGiris: '2026-05-05T10:05:00Z' },
  { id: '4', ad: 'K. Yıldız', email: 'saha@sentek.local', rol: 'Saha Personeli', birim: 'Mobil Ekip 4', durum: 'Aktif', sonGiris: '2026-05-05T07:45:00Z' },
  { id: '5', ad: 'S. Kaya', email: 'lab@sentek.local', rol: 'Laboratuvar Kullanıcısı', birim: 'Merkez Laboratuvar', durum: 'Aktif', sonGiris: '2026-05-05T08:00:00Z' },
  { id: '6', ad: 'B. Öztürk', email: 'b.ozturk@sentek.local', rol: 'Saha Personeli', birim: 'Mobil Ekip 2', durum: 'Aktif', sonGiris: '2026-05-04T16:30:00Z' },
];

const LABS: LabSevkOlay[] = [];

export const mockTestRecords: TestKaydi[] = [
  { id: 'TR-001', operasyonNo: 'OPS-2026-0142', tarih: '2026-05-05T14:30:00Z', lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Peron 3', numuneTuru: 'Tır yedek yakıt deposu', sahisAciklamasi: 'Şüpheli sıvı madde tespiti, akaryakıt deposunda farklı renk katman', kitSeriNo: 'LOT-2026-A1-K045', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Kokain analogu', notlar: 'Detaylı inceleme için laboratuvara sevk edildi.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Sevk Kaydı Oluşturuldu', labSevkId: 'LS-001', analizGuvenSkoru: 89, stokId: 'STK-001' },
  { id: 'TR-002', operasyonNo: 'OPS-2026-0143', tarih: '2026-05-05T11:15:00Z', lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Konteyner Sahası', numuneTuru: 'Emdirilmiş kumaş', sahisAciklamasi: 'Tekstil ürünleri arasında şüpheli koku', kitSeriNo: 'LOT-2026-A1-K046', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Negatif', notlar: 'Temiz çıktı.', personelAdi: 'K. Yıldız', analizGuvenSkoru: 94, stokId: 'STK-001' },
  { id: 'TR-003', operasyonNo: 'OPS-2026-0144', tarih: '2026-05-04T09:45:00Z', lokasyon: 'Antrepo Bölgesi', kontrolNokta: 'Depo Girişi', numuneTuru: 'Toz madde', sahisAciklamasi: 'Gümrüklü sahada sahipsiz paket içi beyaz toz madde', kitSeriNo: 'LOT-2026-H8-K012', kitSKT: '2027-10-31', kitPanelTipi: 'ERO', testSonucu: 'Pozitif', tespitEdilenMadde: 'Eroin türevi', notlar: 'Acil kodlu sevk yapıldı.', personelAdi: 'B. Öztürk', labSevkDurumu: 'Laboratuvara Ulaştı', labSevkId: 'LS-002', analizGuvenSkoru: 92, stokId: 'STK-008' },
  { id: 'TR-004', operasyonNo: 'OPS-2026-0145', tarih: '2026-05-04T16:20:00Z', lokasyon: 'Mobil Saha Ekibi', kontrolNokta: 'Araç Arama Noktası 2', numuneTuru: 'Araç içi yüzey sürüntüsü', sahisAciklamasi: 'Şüpheli araç içi beyaz toz iz', kitSeriNo: 'LOT-2025-C3-K095', kitSKT: '2026-07-15', kitPanelTipi: '3-Panel', testSonucu: 'Geçersiz', notlar: 'Kit kontrol çizgisi belirsiz. Tekrar yapılacak.', personelAdi: 'K. Yıldız', analizGuvenSkoru: 42 },
  { id: 'TR-005', operasyonNo: 'OPS-2026-0146', tarih: '2026-05-04T08:10:00Z', lokasyon: 'Araç Arama Noktası', kontrolNokta: 'Kuzey Hat', numuneTuru: 'Sıvı numune', sahisAciklamasi: 'Araç deposunda normal benzin dışı şüpheli sıvı', kitSeriNo: 'LOT-2026-A1-K047', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Negatif', notlar: 'Standart yakıt kontrolü.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 91 },
  { id: 'TR-006', operasyonNo: 'OPS-2026-0147', tarih: '2026-05-03T15:40:00Z', lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Ro-Ro Terminali', numuneTuru: 'Paket / koli içeriği', sahisAciklamasi: 'Ambalajı açılmış paket, beyaz kristal toz', kitSeriNo: 'LOT-2026-F6-K021', kitSKT: '2028-01-31', kitPanelTipi: '7-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Metamfetamin', notlar: 'Yüksek öncelikli sevk.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Analiz Sırasında', labSevkId: 'LS-003', analizGuvenSkoru: 88, stokId: 'STK-006' },
  { id: 'TR-007', operasyonNo: 'OPS-2026-0148', tarih: '2026-05-03T10:20:00Z', lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Yolcu Kapısı', numuneTuru: 'Bagaj / eşya içi numune', sahisAciklamasi: 'Bavul iç ceplerinde sarımsı toz', kitSeriNo: 'LOT-2026-F6-K022', kitSKT: '2028-01-31', kitPanelTipi: '7-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Amfetamin grubu', notlar: 'Tutanak tutuldu.', personelAdi: 'B. Öztürk', labSevkDurumu: 'Teslim Alındı', labSevkId: 'LS-004', analizGuvenSkoru: 85, stokId: 'STK-006' },
  { id: 'TR-008', operasyonNo: 'OPS-2026-0149', tarih: '2026-05-03T13:55:00Z', lokasyon: 'Antrepo Bölgesi', kontrolNokta: 'Depo B', numuneTuru: 'Konteyner yüzeyi', sahisAciklamasi: 'Konteyner yüzeyinde yapışkan artık iz', kitSeriNo: 'LOT-2026-A1-K048', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Negatif', notlar: 'Negatif. İz madde bulaşması olabilir.', personelAdi: 'K. Yıldız', analizGuvenSkoru: 95 },
  { id: 'TR-009', operasyonNo: 'OPS-2026-0150', tarih: '2026-05-02T09:00:00Z', lokasyon: 'Mobil Saha Ekibi', kontrolNokta: 'Güney Güzergah', numuneTuru: 'Emdirilmiş kağıt', sahisAciklamasi: 'Kargo arası katlanmış kağıt numunesi', kitSeriNo: 'LOT-2025-C3-K096', kitSKT: '2026-07-15', kitPanelTipi: '3-Panel', testSonucu: 'Geçersiz', notlar: 'Yaşlı kit kullanımı şüphesi. Yeni kit ile tekrar yapılacak.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 38 },
  { id: 'TR-010', operasyonNo: 'OPS-2026-0151', tarih: '2026-05-02T14:30:00Z', lokasyon: 'Sınır Kapısı A', kontrolNokta: 'TIR Parkı', numuneTuru: 'Emdirilmiş pamuk', sahisAciklamasi: 'TIR kargo arasında ıslak pamuk bez', kitSeriNo: 'LOT-2026-A1-K049', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Esrar türevi', notlar: 'Sevk başlatıldı.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Numune Paketlendi', labSevkId: 'LS-005', analizGuvenSkoru: 82, stokId: 'STK-001' },
  { id: 'TR-011', operasyonNo: 'OPS-2026-0152', tarih: '2026-05-01T11:00:00Z', lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Konteyner Limanı', numuneTuru: 'Toz madde', sahisAciklamasi: 'Metal kutu içinde gri/bej toz madde', kitSeriNo: 'LOT-2026-H8-K013', kitSKT: '2027-10-31', kitPanelTipi: 'ERO', testSonucu: 'Negatif', notlar: 'Sanayi malzemesi olduğu anlaşıldı.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 96 },
  { id: 'TR-012', operasyonNo: 'OPS-2026-0153', tarih: '2026-05-01T15:45:00Z', lokasyon: 'Araç Arama Noktası', kontrolNokta: 'Orta Hat', numuneTuru: 'Sıvı numune', sahisAciklamasi: 'Şüpheli şeffaf sıvı içeren küçük şişe', kitSeriNo: 'LOT-2026-D4-K003', kitSKT: '2027-08-31', kitPanelTipi: 'FEN', testSonucu: 'Pozitif', tespitEdilenMadde: 'GHB benzeri madde', notlar: 'Kimyasal analiz gerekli.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Rapor Yüklendi', labSevkId: 'LS-006', analizGuvenSkoru: 78, stokId: 'STK-004' },
  { id: 'TR-013', operasyonNo: 'OPS-2026-0154', tarih: '2026-04-30T08:30:00Z', lokasyon: 'Antrepo Bölgesi', kontrolNokta: 'İç Hat Terminal', numuneTuru: 'Araç içi yüzey sürüntüsü', sahisAciklamasi: 'Araç torpido gözü iç yüzey', kitSeriNo: 'LOT-2026-F6-K023', kitSKT: '2028-01-31', kitPanelTipi: '7-Panel', testSonucu: 'Negatif', notlar: 'Temiz.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 97 },
  { id: 'TR-014', operasyonNo: 'OPS-2026-0155', tarih: '2026-04-30T13:10:00Z', lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Gemi Ambarı', numuneTuru: 'Paket / koli içeriği', sahisAciklamasi: 'Gemi ambarında sahipsiz koli içi kırmızı-turuncu toz', kitSeriNo: 'LOT-2026-D4-K004', kitSKT: '2027-08-31', kitPanelTipi: 'FEN', testSonucu: 'Pozitif', tespitEdilenMadde: 'Fentanil türevi', notlar: 'Kritik sevk. Acil bildirim yapıldı.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Dosya Kapatıldı', labSevkId: 'LS-007', analizGuvenSkoru: 91, stokId: 'STK-004' },
  { id: 'TR-015', operasyonNo: 'OPS-2026-0156', tarih: '2026-04-29T10:00:00Z', lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Gümrük Binası', numuneTuru: 'Diğer', sahisAciklamasi: 'Gümrüklü eşya içinde şüpheli bölme', kitSeriNo: 'LOT-2026-A1-K050', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Negatif', notlar: 'Yasal ürün. Belgeler onaylandı.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 93 },
  // Extended records TR-016 to TR-025
  { id: 'TR-016', operasyonNo: 'OPS-2026-0157', tarih: '2026-04-29T14:30:00Z', lokasyon: 'Sınır Kapısı B', kontrolNokta: 'Giriş Kapısı', numuneTuru: 'Toz madde', sahisAciklamasi: 'Araç gövdesinde gizli bölme içi beyaz kristal toz', kitSeriNo: 'LOT-2026-A1-K051', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Kokain', notlar: 'Gizli bölme tespit edildi. Teknik ekip çağrıldı.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Analiz Sırasında', labSevkId: 'LS-008', analizGuvenSkoru: 86, stokId: 'STK-001' },
  { id: 'TR-017', operasyonNo: 'OPS-2026-0158', tarih: '2026-04-28T09:20:00Z', lokasyon: 'Kargo Terminali', kontrolNokta: 'Sortaj Alanı', numuneTuru: 'Emdirilmiş kumaş', sahisAciklamasi: 'İçi yoğun emdirilmiş tekstil ürünü', kitSeriNo: 'LOT-2026-F6-K024', kitSKT: '2028-01-31', kitPanelTipi: '7-Panel', testSonucu: 'Negatif', notlar: 'Temiz. Kargo teslim edildi.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 98 },
  { id: 'TR-018', operasyonNo: 'OPS-2026-0159', tarih: '2026-04-28T16:00:00Z', lokasyon: 'Karayolu Kontrol Noktası', kontrolNokta: 'Güzergah 3', numuneTuru: 'Emdirilmiş pamuk', sahisAciklamasi: 'Koltuk altı gizli ceplerinde birden fazla pamuk parçası', kitSeriNo: 'LOT-2026-F6-K025', kitSKT: '2028-01-31', kitPanelTipi: '7-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Esrar türevi', notlar: 'Yolda sevk edildi.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Laboratuvara Yolda', labSevkId: 'LS-009', analizGuvenSkoru: 79 },
  { id: 'TR-019', operasyonNo: 'OPS-2026-0160', tarih: '2026-04-27T10:15:00Z', lokasyon: 'Araç Arama Noktası', kontrolNokta: 'Güney Hat', numuneTuru: 'Araç içi yüzey sürüntüsü', sahisAciklamasi: 'Bagaj içi yüzey, hafif koku', kitSeriNo: 'LOT-2025-C3-K097', kitSKT: '2026-07-15', kitPanelTipi: '3-Panel', testSonucu: 'Geçersiz', notlar: 'Görüntü kalitesi düşük. SKT yaklaşıyor.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 33 },
  { id: 'TR-020', operasyonNo: 'OPS-2026-0161', tarih: '2026-04-27T14:45:00Z', lokasyon: 'Posta / Kargo Merkezi', kontrolNokta: 'X-Ray Denetim', numuneTuru: 'Paket / koli içeriği', sahisAciklamasi: 'Küçük kargo paketi içi toz artığı', kitSeriNo: 'LOT-2026-A1-K052', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Amfetamin grubu', notlar: 'Teslim alındı. Analiz bekleniyor.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Teslim Alındı', analizGuvenSkoru: 84, stokId: 'STK-001' },
  { id: 'TR-021', operasyonNo: 'OPS-2026-0162', tarih: '2026-04-26T08:30:00Z', lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Araç Geçiş', numuneTuru: 'Sıvı numune', sahisAciklamasi: 'Yakıt deposu dipte biriken sıvı', kitSeriNo: 'LOT-2026-A1-K053', kitSKT: '2027-12-31', kitPanelTipi: '5-Panel', testSonucu: 'Negatif', notlar: 'Motor yağı.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 95 },
  { id: 'TR-022', operasyonNo: 'OPS-2026-0163', tarih: '2026-04-26T12:30:00Z', lokasyon: 'Havalimanı Kargo', kontrolNokta: 'İç Hat Terminal', numuneTuru: 'Toz madde', sahisAciklamasi: 'Kargo paletinin iç yüzeyinde gri toz kalıntı', kitSeriNo: 'LOT-2026-F6-K026', kitSKT: '2028-01-31', kitPanelTipi: '7-Panel', testSonucu: 'Pozitif', tespitEdilenMadde: 'Metamfetamin', notlar: 'Yüksek güven skoru ile pozitif.', personelAdi: 'K. Yıldız', labSevkDurumu: 'Sevk Kaydı Oluşturuldu', analizGuvenSkoru: 91, stokId: 'STK-006' },
  { id: 'TR-023', operasyonNo: 'OPS-2026-0164', tarih: '2026-04-25T09:00:00Z', lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Gemi Ambarı', numuneTuru: 'Konteyner yüzeyi', sahisAciklamasi: 'Konteyner iç yüzey sürüntüsü', kitSeriNo: 'LOT-2026-H8-K014', kitSKT: '2027-10-31', kitPanelTipi: 'ERO', testSonucu: 'Negatif', notlar: 'Temiz.', personelAdi: 'B. Öztürk', analizGuvenSkoru: 96 },
  { id: 'TR-024', operasyonNo: 'OPS-2026-0165', tarih: '2026-04-25T15:10:00Z', lokasyon: 'Karayolu Kontrol Noktası', kontrolNokta: 'Güzergah 1', numuneTuru: 'Emdirilmiş kağıt', sahisAciklamasi: 'Kartvizit benzeri kağıt, hafif nem', kitSeriNo: 'LOT-2026-I9-K002', kitSKT: '2026-08-15', kitPanelTipi: 'Kontrol', testSonucu: 'Geçersiz', notlar: 'Kağıt materyali kit performansını etkilemiş olabilir.', personelAdi: 'K. Yıldız', analizGuvenSkoru: 45 },
  { id: 'TR-025', operasyonNo: 'OPS-2026-0166', tarih: '2026-04-24T11:20:00Z', lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Konteyner Limanı', numuneTuru: 'Toz madde', sahisAciklamasi: 'Sahipsiz metal kutu içi turuncu kristal toz', kitSeriNo: 'LOT-2026-D4-K005', kitSKT: '2027-08-31', kitPanelTipi: 'FEN', testSonucu: 'Pozitif', tespitEdilenMadde: 'Fentanil analogu', notlar: 'Kritik seviye madde. Acil önlem alındı.', personelAdi: 'B. Öztürk', labSevkDurumu: 'Dosya Kapatıldı', analizGuvenSkoru: 93, stokId: 'STK-004' },
];

export const mockLabShipments: LabSevk[] = [
  {
    id: 'LS-001', numuneTakipNo: 'SNT-LAB-2026-000001', operasyonNo: 'OPS-2026-0142', testKaydiId: 'TR-001',
    numuneTuru: 'Tır yedek yakıt deposu', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Kokain analogu',
    muhrEtiketNo: 'MHR-2026-001', delilPosetiNo: 'DP-2026-0088', kitSeriNo: 'LOT-2026-A1-K045', kitSKT: '2027-12-31',
    sevkEdenBirim: 'Sınır Kapısı A', gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-05-06T10:00:00Z',
    durum: 'Sevk Kaydı Oluşturuldu', oncelik: 'Normal', notlar: 'Standart sevk prosedürü uygulandı.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-05-05T14:30:00Z', kullanici: 'K. Yıldız', aciklama: 'Saha testi pozitif sonuç verdi.' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-05-05T15:00:00Z', kullanici: 'K. Yıldız', aciklama: 'Sevk kaydı sisteme girildi.' },
    ]
  },
  {
    id: 'LS-002', numuneTakipNo: 'SNT-LAB-2026-000002', operasyonNo: 'OPS-2026-0144', testKaydiId: 'TR-003',
    numuneTuru: 'Toz madde', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Eroin türevi',
    muhrEtiketNo: 'MHR-2026-002', delilPosetiNo: 'DP-2026-0089', kitSeriNo: 'LOT-2026-H8-K012', kitSKT: '2027-10-31',
    sevkEdenBirim: 'Antrepo Bölgesi', gonderimYontemi: 'Zırhlı Araç', tahminiVaris: '2026-05-05T15:00:00Z',
    durum: 'Laboratuvara Ulaştı', oncelik: 'Yüksek', notlar: 'Acil kod ile sevk edildi.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-05-04T09:45:00Z', kullanici: 'B. Öztürk', aciklama: 'Ön tarama pozitif.' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-05-04T10:30:00Z', kullanici: 'B. Öztürk', aciklama: 'Acil sevk başlatıldı.' },
      { durum: 'Numune Paketlendi', tarih: '2026-05-04T11:00:00Z', kullanici: 'B. Öztürk', aciklama: 'Delil poşetine alındı.' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-05-04T12:00:00Z', kullanici: 'Merkez Kurye', aciklama: 'Zırhlı araç hareket etti.' },
      { durum: 'Laboratuvara Ulaştı', tarih: '2026-05-05T09:30:00Z', kullanici: 'S. Kaya', aciklama: 'Numune laboratuvara teslim edildi.' },
    ]
  },
  {
    id: 'LS-003', numuneTakipNo: 'SNT-LAB-2026-000003', operasyonNo: 'OPS-2026-0147', testKaydiId: 'TR-006',
    numuneTuru: 'Paket / koli içeriği', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Metamfetamin',
    muhrEtiketNo: 'MHR-2026-003', delilPosetiNo: 'DP-2026-0090', kitSeriNo: 'LOT-2026-F6-K021', kitSKT: '2028-01-31',
    sevkEdenBirim: 'Liman Kontrol Noktası', gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-05-04T14:00:00Z',
    durum: 'Analiz Sırasında', oncelik: 'Yüksek', notlar: 'Öncelikli analiz talep edildi.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-05-03T15:40:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-05-03T16:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Numune Paketlendi', tarih: '2026-05-03T17:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-05-03T18:00:00Z', kullanici: 'Liman Kurye' },
      { durum: 'Laboratuvara Ulaştı', tarih: '2026-05-04T08:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Teslim Alındı', tarih: '2026-05-04T08:30:00Z', kullanici: 'S. Kaya', aciklama: 'Ambalaj bütünlüğü uygun.' },
      { durum: 'Analiz Sırasında', tarih: '2026-05-04T10:00:00Z', kullanici: 'S. Kaya', aciklama: 'Kimyasal analiz başlatıldı.' },
    ]
  },
  {
    id: 'LS-004', numuneTakipNo: 'SNT-LAB-2026-000004', operasyonNo: 'OPS-2026-0148', testKaydiId: 'TR-007',
    numuneTuru: 'Bagaj / eşya içi numune', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Amfetamin grubu',
    muhrEtiketNo: 'MHR-2026-004', delilPosetiNo: 'DP-2026-0091', kitSeriNo: 'LOT-2026-F6-K022', kitSKT: '2028-01-31',
    sevkEdenBirim: 'Sınır Kapısı A', gonderimYontemi: 'Resmi Araç', tahminiVaris: '2026-05-03T16:00:00Z',
    durum: 'Teslim Alındı', oncelik: 'Normal', notlar: 'Teslim tutanağı imzalandı.',
    teslimAlma: { teslimAlanPersonel: 'S. Kaya', teslimTarihi: '2026-05-03T14:20:00Z', ambalajButunlugu: 'Uygun', muhrKontrol: 'Uygun', fizikselDurumNotu: 'Numune fiziksel olarak sağlam durumda.', kabulDurumu: 'Kabul' },
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-05-03T10:20:00Z', kullanici: 'B. Öztürk' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-05-03T11:00:00Z', kullanici: 'B. Öztürk' },
      { durum: 'Numune Paketlendi', tarih: '2026-05-03T12:00:00Z', kullanici: 'B. Öztürk' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-05-03T13:00:00Z', kullanici: 'Resmi Araç' },
      { durum: 'Laboratuvara Ulaştı', tarih: '2026-05-03T14:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Teslim Alındı', tarih: '2026-05-03T14:20:00Z', kullanici: 'S. Kaya', aciklama: 'Kabul edildi.' },
    ]
  },
  {
    id: 'LS-005', numuneTakipNo: 'SNT-LAB-2026-000005', operasyonNo: 'OPS-2026-0151', testKaydiId: 'TR-010',
    numuneTuru: 'Emdirilmiş pamuk', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Esrar türevi',
    muhrEtiketNo: 'MHR-2026-005', delilPosetiNo: 'DP-2026-0092', kitSeriNo: 'LOT-2026-A1-K049', kitSKT: '2027-12-31',
    sevkEdenBirim: 'Sınır Kapısı A', gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-05-07T11:00:00Z',
    durum: 'Numune Paketlendi', oncelik: 'Normal', notlar: 'Paketleme tamamlandı, kurye bekleniyor.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-05-02T14:30:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-05-02T15:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Numune Paketlendi', tarih: '2026-05-02T16:00:00Z', kullanici: 'K. Yıldız', aciklama: 'Delil poşetine alındı.' },
    ]
  },
  {
    id: 'LS-006', numuneTakipNo: 'SNT-LAB-2026-000006', operasyonNo: 'OPS-2026-0153', testKaydiId: 'TR-012',
    numuneTuru: 'Sıvı numune', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'GHB benzeri madde',
    muhrEtiketNo: 'MHR-2026-006', delilPosetiNo: 'DP-2026-0093', kitSeriNo: 'LOT-2026-D4-K003', kitSKT: '2027-08-31',
    sevkEdenBirim: 'Araç Arama Noktası', gonderimYontemi: 'Özel Soğuk Zincir', tahminiVaris: '2026-04-30T09:00:00Z',
    durum: 'Rapor Yüklendi', oncelik: 'Yüksek', notlar: 'Kimyasal analiz raporu sisteme yüklendi.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-05-01T15:45:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-05-01T16:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Numune Paketlendi', tarih: '2026-05-01T17:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-05-01T18:00:00Z', kullanici: 'Kurye' },
      { durum: 'Laboratuvara Ulaştı', tarih: '2026-04-29T09:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Teslim Alındı', tarih: '2026-04-29T09:30:00Z', kullanici: 'S. Kaya' },
      { durum: 'Analiz Sırasında', tarih: '2026-04-29T11:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Rapor Yüklendi', tarih: '2026-04-30T08:00:00Z', kullanici: 'S. Kaya', aciklama: 'GHB içeren bileşik tespit edildi.' },
    ]
  },
  {
    id: 'LS-007', numuneTakipNo: 'SNT-LAB-2026-000007', operasyonNo: 'OPS-2026-0155', testKaydiId: 'TR-014',
    numuneTuru: 'Paket / koli içeriği', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Fentanil türevi',
    muhrEtiketNo: 'MHR-2026-007', delilPosetiNo: 'DP-2026-0094', kitSeriNo: 'LOT-2026-D4-K004', kitSKT: '2027-08-31',
    sevkEdenBirim: 'Liman Kontrol Noktası', gonderimYontemi: 'Zırhlı Araç', tahminiVaris: '2026-04-25T14:00:00Z',
    durum: 'Dosya Kapatıldı', oncelik: 'Yüksek', notlar: 'Adli süreç tamamlandı. Dosya arşive alındı.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-04-30T13:10:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-04-30T14:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Numune Paketlendi', tarih: '2026-04-30T15:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-04-30T16:00:00Z', kullanici: 'Zırhlı Araç' },
      { durum: 'Laboratuvara Ulaştı', tarih: '2026-04-25T08:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Teslim Alındı', tarih: '2026-04-25T09:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Analiz Sırasında', tarih: '2026-04-25T11:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Rapor Yüklendi', tarih: '2026-04-26T09:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Dosya Kapatıldı', tarih: '2026-04-27T14:00:00Z', kullanici: 'M. Çelik', aciklama: 'Adli süreç tamamlandı.' },
    ]
  },
  {
    id: 'LS-008', numuneTakipNo: 'SNT-LAB-2026-000008', operasyonNo: 'OPS-2026-0157', testKaydiId: 'TR-016',
    numuneTuru: 'Toz madde', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Kokain',
    muhrEtiketNo: 'MHR-2026-008', delilPosetiNo: 'DP-2026-0095', kitSeriNo: 'LOT-2026-A1-K051', kitSKT: '2027-12-31',
    sevkEdenBirim: 'Sınır Kapısı B', gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-04-30T14:00:00Z',
    durum: 'Analiz Sırasında', oncelik: 'Yüksek', notlar: 'Gizli bölme vakaları için öncelikli analiz.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-04-29T14:30:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-04-29T15:30:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Numune Paketlendi', tarih: '2026-04-29T16:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-04-29T17:00:00Z', kullanici: 'Kurye' },
      { durum: 'Laboratuvara Ulaştı', tarih: '2026-04-30T08:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Teslim Alındı', tarih: '2026-04-30T09:00:00Z', kullanici: 'S. Kaya' },
      { durum: 'Analiz Sırasında', tarih: '2026-04-30T11:00:00Z', kullanici: 'S. Kaya' },
    ]
  },
  {
    id: 'LS-009', numuneTakipNo: 'SNT-LAB-2026-000009', operasyonNo: 'OPS-2026-0159', testKaydiId: 'TR-018',
    numuneTuru: 'Emdirilmiş pamuk', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Esrar türevi',
    muhrEtiketNo: 'MHR-2026-009', delilPosetiNo: 'DP-2026-0096', kitSeriNo: 'LOT-2026-F6-K025', kitSKT: '2028-01-31',
    sevkEdenBirim: 'Karayolu Kontrol Noktası', gonderimYontemi: 'Resmi Araç', tahminiVaris: '2026-04-29T14:00:00Z',
    durum: 'Laboratuvara Yolda', oncelik: 'Normal', notlar: 'Standart sevk.',
    olaylar: [
      { durum: 'Pozitif Tespit Edildi', tarih: '2026-04-28T16:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Sevk Kaydı Oluşturuldu', tarih: '2026-04-28T17:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Numune Paketlendi', tarih: '2026-04-28T18:00:00Z', kullanici: 'K. Yıldız' },
      { durum: 'Laboratuvara Yolda', tarih: '2026-04-29T08:00:00Z', kullanici: 'Resmi Araç' },
    ]
  },
];

export const mockInventory: Stok[] = [
  { id: 'STK-001', urunAdi: 'SENTEK Multi-Panel Kiti A5', panelTipi: '5-Panel (KOK, ERO, MET, AMP, THC)', lotSeriNo: 'LOT-2026-A1', girisAdedi: 5000, kullanilanAdedi: 1545, kalanAdedi: 3455, skt: '2027-12-31', depo: 'Merkez Depo', kritikSeviye: 1000, durum: 'Normal' },
  { id: 'STK-002', urunAdi: 'SENTEK Tekil Panel Kiti KOK', panelTipi: 'KOK (Kokain)', lotSeriNo: 'LOT-2026-B2', girisAdedi: 1000, kullanilanAdedi: 950, kalanAdedi: 50, skt: '2027-06-30', depo: 'Bölge Depo 1', kritikSeviye: 100, durum: 'Kritik' },
  { id: 'STK-003', urunAdi: 'SENTEK Multi-Panel Kiti A3', panelTipi: '3-Panel (KOK, ERO, MET)', lotSeriNo: 'LOT-2025-C3', girisAdedi: 2000, kullanilanAdedi: 1800, kalanAdedi: 200, skt: '2026-07-15', depo: 'Sınır Kapısı A', kritikSeviye: 300, durum: 'SKT Yaklaşıyor' },
  { id: 'STK-004', urunAdi: 'SENTEK Fentanil Tespit Kiti', panelTipi: 'FEN (Fentanil)', lotSeriNo: 'LOT-2026-D4', girisAdedi: 500, kullanilanAdedi: 122, kalanAdedi: 378, skt: '2027-08-31', depo: 'Liman Kontrol Noktası', kritikSeviye: 50, durum: 'Normal' },
  { id: 'STK-005', urunAdi: 'SENTEK Esrar Panel Kiti', panelTipi: 'THC (Tetrahidrokannabinol)', lotSeriNo: 'LOT-2026-E5', girisAdedi: 800, kullanilanAdedi: 800, kalanAdedi: 0, skt: '2027-03-31', depo: 'Mobil Ekip Deposu', kritikSeviye: 80, durum: 'Tükendi' },
  { id: 'STK-006', urunAdi: 'SENTEK Multi-Panel Kiti A7', panelTipi: '7-Panel Geniş Spektrum', lotSeriNo: 'LOT-2026-F6', girisAdedi: 3000, kullanilanAdedi: 455, kalanAdedi: 2545, skt: '2028-01-31', depo: 'Merkez Depo', kritikSeviye: 500, durum: 'Normal' },
  { id: 'STK-007', urunAdi: 'SENTEK Amfetamin Kiti', panelTipi: 'AMP (Amfetamin)', lotSeriNo: 'LOT-2025-G7', girisAdedi: 1500, kullanilanAdedi: 1420, kalanAdedi: 80, skt: '2026-06-30', depo: 'Araç Arama Deposu', kritikSeviye: 150, durum: 'Kritik' },
  { id: 'STK-008', urunAdi: 'SENTEK Heroin Panel Kiti', panelTipi: 'ERO (Eroin/Opioid)', lotSeriNo: 'LOT-2026-H8', girisAdedi: 1200, kullanilanAdedi: 302, kalanAdedi: 898, skt: '2027-10-31', depo: 'Antrepo Bölgesi', kritikSeviye: 200, durum: 'Normal' },
  { id: 'STK-009', urunAdi: 'SENTEK Kalibre Sıvı Seti', panelTipi: 'Kontrol Solüsyonu', lotSeriNo: 'LOT-2026-I9', girisAdedi: 200, kullanilanAdedi: 46, kalanAdedi: 154, skt: '2026-08-15', depo: 'Merkez Laboratuvar', kritikSeviye: 30, durum: 'SKT Yaklaşıyor' },
  { id: 'STK-010', urunAdi: 'SENTEK Delil Poşeti (Küçük)', panelTipi: 'Sarf Malzeme', lotSeriNo: 'LOT-2026-J10', girisAdedi: 10000, kullanilanAdedi: 3200, kalanAdedi: 6800, skt: '2029-12-31', depo: 'Merkez Depo', kritikSeviye: 1000, durum: 'Normal' },
  { id: 'STK-011', urunAdi: 'SENTEK Metamfetamin Kiti', panelTipi: 'MET (Metamfetamin)', lotSeriNo: 'LOT-2026-K11', girisAdedi: 800, kullanilanAdedi: 180, kalanAdedi: 620, skt: '2027-09-30', depo: 'Havalimanı Kargo', kritikSeviye: 100, durum: 'Normal' },
  { id: 'STK-012', urunAdi: 'SENTEK Opioid Panel Kiti', panelTipi: 'OPI (Opioid Grubu)', lotSeriNo: 'LOT-2026-L12', girisAdedi: 600, kullanilanAdedi: 560, kalanAdedi: 40, skt: '2026-09-30', depo: 'Sınır Kapısı B', kritikSeviye: 60, durum: 'Kritik' },
  { id: 'STK-013', urunAdi: 'SENTEK Benzodiazepin Kiti', panelTipi: 'BZO (Benzodiazepin)', lotSeriNo: 'LOT-2026-M13', girisAdedi: 400, kullanilanAdedi: 45, kalanAdedi: 355, skt: '2027-11-30', depo: 'Karayolu Kontrol', kritikSeviye: 50, durum: 'Normal' },
  { id: 'STK-014', urunAdi: 'SENTEK Sentetik Kanabinoid Kiti', panelTipi: 'SCR (Sentetik Kanabinoid)', lotSeriNo: 'LOT-2026-N14', girisAdedi: 300, kullanilanAdedi: 290, kalanAdedi: 10, skt: '2026-10-31', depo: 'Posta / Kargo Merkezi', kritikSeviye: 30, durum: 'Kritik' },
  { id: 'STK-015', urunAdi: 'SENTEK Multi-Panel Kiti A10', panelTipi: '10-Panel Geniş Spektrum', lotSeriNo: 'LOT-2026-O15', girisAdedi: 2000, kullanilanAdedi: 120, kalanAdedi: 1880, skt: '2028-06-30', depo: 'Merkez Depo', kritikSeviye: 300, durum: 'Normal' },
  { id: 'STK-016', urunAdi: 'SENTEK MDMA / Ekstazi Kiti', panelTipi: 'MDM (MDMA/Ekstazi)', lotSeriNo: 'LOT-2026-P16', girisAdedi: 500, kullanilanAdedi: 488, kalanAdedi: 12, skt: '2026-07-31', depo: 'Liman Kontrol Noktası', kritikSeviye: 50, durum: 'Kritik' },
  { id: 'STK-017', urunAdi: 'SENTEK Ketamin Kiti', panelTipi: 'KET (Ketamin)', lotSeriNo: 'LOT-2026-Q17', girisAdedi: 250, kullanilanAdedi: 22, kalanAdedi: 228, skt: '2027-12-31', depo: 'Merkez Depo', kritikSeviye: 30, durum: 'Normal' },
  { id: 'STK-018', urunAdi: 'SENTEK Barbitürat Kiti', panelTipi: 'BAR (Barbitürat)', lotSeriNo: 'LOT-2025-R18', girisAdedi: 300, kullanilanAdedi: 295, kalanAdedi: 5, skt: '2026-06-15', depo: 'Antrepo Bölgesi', kritikSeviye: 30, durum: 'Tükendi' },
  { id: 'STK-019', urunAdi: 'SENTEK Delil Poşeti (Büyük)', panelTipi: 'Sarf Malzeme', lotSeriNo: 'LOT-2026-S19', girisAdedi: 5000, kullanilanAdedi: 800, kalanAdedi: 4200, skt: '2029-12-31', depo: 'Merkez Depo', kritikSeviye: 500, durum: 'Normal' },
  { id: 'STK-020', urunAdi: 'SENTEK Nikel Lateks Eldiven Seti', panelTipi: 'Sarf Malzeme', lotSeriNo: 'LOT-2026-T20', girisAdedi: 10000, kullanilanAdedi: 4500, kalanAdedi: 5500, skt: '2028-12-31', depo: 'Tüm Birimler', kritikSeviye: 1000, durum: 'Normal' },
];

export const mockBildirimler: Bildirim[] = [
  { id: 'BLD-001', mesaj: 'TR-006: Metamfetamin tespiti — Liman Kontrol Noktası, analiz sırasında.', tur: 'analiz', tarih: '2026-05-03T16:00:00Z', okundu: false, operasyonNo: 'OPS-2026-0147' },
  { id: 'BLD-002', mesaj: 'STK-002 (KOK Kiti) kritik stok seviyesinde — 50 adet kaldı.', tur: 'stok', tarih: '2026-05-03T09:00:00Z', okundu: false },
  { id: 'BLD-003', mesaj: 'SNT-LAB-2026-000002 numunesı laboratuvara ulaştı.', tur: 'lab', tarih: '2026-05-05T09:30:00Z', okundu: false, operasyonNo: 'OPS-2026-0144' },
  { id: 'BLD-004', mesaj: 'STK-003 (3-Panel Kiti) SKT 2026-07-15 — 70 gün kaldı.', tur: 'stok', tarih: '2026-05-01T08:00:00Z', okundu: true },
  { id: 'BLD-005', mesaj: 'SNT-LAB-2026-000006 için rapor yüklendi — GHB benzeri madde.', tur: 'rapor', tarih: '2026-04-30T08:00:00Z', okundu: true, operasyonNo: 'OPS-2026-0153' },
  { id: 'BLD-006', mesaj: 'TR-004: Geçersiz test sonucu — düşük güven skoru (%42). Manuel kontrol gerekli.', tur: 'analiz', tarih: '2026-05-04T16:30:00Z', okundu: false, operasyonNo: 'OPS-2026-0145' },
  { id: 'BLD-007', mesaj: 'STK-007 (AMP Kiti) kritik — 80 adet kaldı, SKT 2026-06-30.', tur: 'stok', tarih: '2026-05-02T10:00:00Z', okundu: false },
  { id: 'BLD-008', mesaj: 'Dosya kapatıldı: SNT-LAB-2026-000007 (Fentanil türevi) arşive alındı.', tur: 'rapor', tarih: '2026-04-27T14:00:00Z', okundu: true, operasyonNo: 'OPS-2026-0155' },
];

export const DEMO_CREDENTIALS: Record<string, { sifre: string; kullaniciId: string }> = {
  'admin@sentek.local': { sifre: 'admin123', kullaniciId: '1' },
  'merkez@sentek.local': { sifre: 'merkez123', kullaniciId: '2' },
  'bolge@sentek.local': { sifre: 'bolge123', kullaniciId: '3' },
  'saha@sentek.local': { sifre: 'saha123', kullaniciId: '4' },
  'lab@sentek.local': { sifre: 'lab123', kullaniciId: '5' },
};
