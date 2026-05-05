import { Kullanici, TestKaydi, LabSevk, Stok } from '../types';

export const mockUsers: Kullanici[] = [
  { id: '1', ad: 'A. Yılmaz', email: 'admin@sentek.local', rol: 'Sistem Yöneticisi', birim: 'Merkez IT', durum: 'Aktif', sonGiris: '2026-05-05T08:30:00Z' },
  { id: '2', ad: 'M. Çelik', email: 'merkez@sentek.local', rol: 'Merkez Yönetici', birim: 'Operasyon Merkezi', durum: 'Aktif', sonGiris: '2026-05-05T09:15:00Z' },
  { id: '3', ad: 'A. Demir', email: 'bolge@sentek.local', rol: 'Bölge Yetkilisi', birim: 'Marmara Bölge Müdürlüğü', durum: 'Aktif', sonGiris: '2026-05-05T10:05:00Z' },
  { id: '4', ad: 'K. Yıldız', email: 'saha@sentek.local', rol: 'Saha Personeli', birim: 'Mobil Ekip 4', durum: 'Aktif', sonGiris: '2026-05-05T07:45:00Z' },
  { id: '5', ad: 'S. Kaya', email: 'lab@sentek.local', rol: 'Laboratuvar Kullanıcısı', birim: 'Merkez Laboratuvar', durum: 'Aktif', sonGiris: '2026-05-05T08:00:00Z' },
  { id: '6', ad: 'B. Öztürk', email: 'b.ozturk@sentek.local', rol: 'Saha Personeli', birim: 'Mobil Ekip 2', durum: 'Aktif', sonGiris: '2026-05-04T16:30:00Z' },
];

export const mockTestRecords: TestKaydi[] = [
  {
    id: 'TR-001', operasyonNo: 'OPS-2026-0142', tarih: '2026-05-05T14:30:00Z',
    lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Peron 3', numuneTuru: 'Tır yedek yakıt deposu',
    sahisAciklamasi: 'Şüpheli sıvı madde tespiti, akaryakıt deposunda farklı renk katman',
    kitSeriNo: 'SN-99882211', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'Kokain analogu', notlar: 'Detaylı inceleme için laboratuvara sevk edildi.',
    personelAdi: 'K. Yıldız', labSevkDurumu: 'Sevk Kaydı Oluşturuldu'
  },
  {
    id: 'TR-002', operasyonNo: 'OPS-2026-0143', tarih: '2026-05-05T11:15:00Z',
    lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Konteyner Sahası', numuneTuru: 'Emdirilmiş kumaş',
    sahisAciklamasi: 'Tekstil ürünleri arasında şüpheli koku',
    kitSeriNo: 'SN-99882212', kitSKT: '2027-12-31', testSonucu: 'Negatif',
    notlar: 'Temiz çıktı.', personelAdi: 'K. Yıldız'
  },
  {
    id: 'TR-003', operasyonNo: 'OPS-2026-0144', tarih: '2026-05-04T09:45:00Z',
    lokasyon: 'Antrepo Bölgesi', kontrolNokta: 'Depo Girişi', numuneTuru: 'Toz madde',
    sahisAciklamasi: 'Gümrüklü sahada sahipsiz paket içi beyaz toz madde',
    kitSeriNo: 'SN-99882213', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'Eroin türevi', notlar: 'Acil kodlu sevk yapıldı.',
    personelAdi: 'B. Öztürk', labSevkDurumu: 'Laboratuvara Ulaştı'
  },
  {
    id: 'TR-004', operasyonNo: 'OPS-2026-0145', tarih: '2026-05-04T16:20:00Z',
    lokasyon: 'Mobil Saha Ekibi', kontrolNokta: 'Araç Arama Noktası 2', numuneTuru: 'Araç içi yüzey sürüntüsü',
    sahisAciklamasi: 'Şüpheli araç içi beyaz toz iz',
    kitSeriNo: 'SN-99882214', kitSKT: '2027-12-31', testSonucu: 'Geçersiz',
    notlar: 'Kit kontrol çizgisi belirsiz. Tekrar yapılacak.', personelAdi: 'K. Yıldız'
  },
  {
    id: 'TR-005', operasyonNo: 'OPS-2026-0146', tarih: '2026-05-04T08:10:00Z',
    lokasyon: 'Araç Arama Noktası', kontrolNokta: 'Kuzey Hat', numuneTuru: 'Sıvı numune',
    sahisAciklamasi: 'Araç deposunda normal benzin dışı şüpheli sıvı',
    kitSeriNo: 'SN-99882215', kitSKT: '2027-12-31', testSonucu: 'Negatif',
    notlar: 'Standart yakıt kontrolü.', personelAdi: 'B. Öztürk'
  },
  {
    id: 'TR-006', operasyonNo: 'OPS-2026-0147', tarih: '2026-05-03T15:40:00Z',
    lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Ro-Ro Terminali', numuneTuru: 'Paket / koli içeriği',
    sahisAciklamasi: 'Ambalajı açılmış paket, beyaz kristal toz',
    kitSeriNo: 'SN-99882216', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'Metamfetamin', notlar: 'Yüksek öncelikli sevk.',
    personelAdi: 'K. Yıldız', labSevkDurumu: 'Analiz Sırasında'
  },
  {
    id: 'TR-007', operasyonNo: 'OPS-2026-0148', tarih: '2026-05-03T10:20:00Z',
    lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Yolcu Kapısı', numuneTuru: 'Bagaj / eşya içi numune',
    sahisAciklamasi: 'Bavul iç ceplerinde sarımsı toz',
    kitSeriNo: 'SN-99882217', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'Amfetamin grubu', notlar: 'Tutanak tutuldu.',
    personelAdi: 'B. Öztürk', labSevkDurumu: 'Teslim Alındı'
  },
  {
    id: 'TR-008', operasyonNo: 'OPS-2026-0149', tarih: '2026-05-03T13:55:00Z',
    lokasyon: 'Antrepo Bölgesi', kontrolNokta: 'Depo B', numuneTuru: 'Konteyner yüzeyi',
    sahisAciklamasi: 'Konteyner yüzeyinde yapışkan artık iz',
    kitSeriNo: 'SN-99882218', kitSKT: '2027-12-31', testSonucu: 'Negatif',
    notlar: 'Negatif. İz madde bulaşması olabilir.', personelAdi: 'K. Yıldız'
  },
  {
    id: 'TR-009', operasyonNo: 'OPS-2026-0150', tarih: '2026-05-02T09:00:00Z',
    lokasyon: 'Mobil Saha Ekibi', kontrolNokta: 'Güney Güzergah', numuneTuru: 'Emdirilmiş kağıt',
    sahisAciklamasi: 'Kargo arası katlanmış kağıt numunesi',
    kitSeriNo: 'SN-99882219', kitSKT: '2027-12-31', testSonucu: 'Geçersiz',
    notlar: 'Yaşlı kit kullanımı şüphesi. Yeni kit ile tekrar yapılacak.', personelAdi: 'B. Öztürk'
  },
  {
    id: 'TR-010', operasyonNo: 'OPS-2026-0151', tarih: '2026-05-02T14:30:00Z',
    lokasyon: 'Sınır Kapısı A', kontrolNokta: 'TIR Parkı', numuneTuru: 'Emdirilmiş pamuk',
    sahisAciklamasi: 'TIR kargo arasında ıslak pamuk bez',
    kitSeriNo: 'SN-99882220', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'Esrar türevi', notlar: 'Sevk başlatıldı.',
    personelAdi: 'K. Yıldız', labSevkDurumu: 'Numune Paketlendi'
  },
  {
    id: 'TR-011', operasyonNo: 'OPS-2026-0152', tarih: '2026-05-01T11:00:00Z',
    lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Konteyner Limanı', numuneTuru: 'Toz madde',
    sahisAciklamasi: 'Metal kutu içinde gri/bej toz madde',
    kitSeriNo: 'SN-99882221', kitSKT: '2027-12-31', testSonucu: 'Negatif',
    notlar: 'Sanayi malzemesi olduğu anlaşıldı.', personelAdi: 'B. Öztürk'
  },
  {
    id: 'TR-012', operasyonNo: 'OPS-2026-0153', tarih: '2026-05-01T15:45:00Z',
    lokasyon: 'Araç Arama Noktası', kontrolNokta: 'Orta Hat', numuneTuru: 'Sıvı numune',
    sahisAciklamasi: 'Şüpheli şeffaf sıvı içeren küçük şişe',
    kitSeriNo: 'SN-99882222', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'GHB benzeri madde', notlar: 'Kimyasal analiz gerekli.',
    personelAdi: 'K. Yıldız', labSevkDurumu: 'Rapor Yüklendi'
  },
  {
    id: 'TR-013', operasyonNo: 'OPS-2026-0154', tarih: '2026-04-30T08:30:00Z',
    lokasyon: 'Antrepo Bölgesi', kontrolNokta: 'İç Hat Terminal', numuneTuru: 'Araç içi yüzey sürüntüsü',
    sahisAciklamasi: 'Araç torpido gözü iç yüzey',
    kitSeriNo: 'SN-99882223', kitSKT: '2027-12-31', testSonucu: 'Negatif',
    notlar: 'Temiz.', personelAdi: 'B. Öztürk'
  },
  {
    id: 'TR-014', operasyonNo: 'OPS-2026-0155', tarih: '2026-04-30T13:10:00Z',
    lokasyon: 'Liman Kontrol Noktası', kontrolNokta: 'Gemi Ambarı', numuneTuru: 'Paket / koli içeriği',
    sahisAciklamasi: 'Gemi ambarında sahipsiz koli içi kırmızı-turuncu toz',
    kitSeriNo: 'SN-99882224', kitSKT: '2027-12-31', testSonucu: 'Pozitif',
    tespitEdilenMadde: 'Fentanil türevi', notlar: 'Kritik sevk. Acil bildirim yapıldı.',
    personelAdi: 'K. Yıldız', labSevkDurumu: 'Dosya Kapatıldı'
  },
  {
    id: 'TR-015', operasyonNo: 'OPS-2026-0156', tarih: '2026-04-29T10:00:00Z',
    lokasyon: 'Sınır Kapısı A', kontrolNokta: 'Gümrük Binası', numuneTuru: 'Diğer',
    sahisAciklamasi: 'Gümrüklü eşya içinde şüpheli bölme',
    kitSeriNo: 'SN-99882225', kitSKT: '2027-12-31', testSonucu: 'Negatif',
    notlar: 'Yasal ürün. Belgeler onaylandı.', personelAdi: 'B. Öztürk'
  },
];

export const mockLabShipments: LabSevk[] = [
  {
    id: 'LS-001', numuneTakipNo: 'SNT-LAB-2026-000001', operasyonNo: 'OPS-2026-0142', testKaydiId: 'TR-001',
    numuneTuru: 'Tır yedek yakıt deposu', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Kokain analogu',
    muhrEtiketNo: 'MHR-2026-001', delilPosetiNo: 'DP-2026-0088', sevkEdenBirim: 'Sınır Kapısı A',
    gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-05-06T10:00:00Z',
    durum: 'Sevk Kaydı Oluşturuldu', oncelik: 'Normal', notlar: 'Standart sevk prosedürü uygulandı.'
  },
  {
    id: 'LS-002', numuneTakipNo: 'SNT-LAB-2026-000002', operasyonNo: 'OPS-2026-0144', testKaydiId: 'TR-003',
    numuneTuru: 'Toz madde', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Eroin türevi',
    muhrEtiketNo: 'MHR-2026-002', delilPosetiNo: 'DP-2026-0089', sevkEdenBirim: 'Antrepo Bölgesi',
    gonderimYontemi: 'Zırhlı Araç', tahminiVaris: '2026-05-05T15:00:00Z',
    durum: 'Laboratuvara Ulaştı', oncelik: 'Yüksek', notlar: 'Acil kod ile sevk edildi.'
  },
  {
    id: 'LS-003', numuneTakipNo: 'SNT-LAB-2026-000003', operasyonNo: 'OPS-2026-0147', testKaydiId: 'TR-006',
    numuneTuru: 'Paket / koli içeriği', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Metamfetamin',
    muhrEtiketNo: 'MHR-2026-003', delilPosetiNo: 'DP-2026-0090', sevkEdenBirim: 'Liman Kontrol Noktası',
    gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-05-04T14:00:00Z',
    durum: 'Analiz Sırasında', oncelik: 'Yüksek', notlar: 'Öncelikli analiz talep edildi.'
  },
  {
    id: 'LS-004', numuneTakipNo: 'SNT-LAB-2026-000004', operasyonNo: 'OPS-2026-0148', testKaydiId: 'TR-007',
    numuneTuru: 'Bagaj / eşya içi numune', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Amfetamin grubu',
    muhrEtiketNo: 'MHR-2026-004', delilPosetiNo: 'DP-2026-0091', sevkEdenBirim: 'Sınır Kapısı A',
    gonderimYontemi: 'Resmi Araç', tahminiVaris: '2026-05-03T16:00:00Z',
    durum: 'Teslim Alındı', oncelik: 'Normal', notlar: 'Teslim tutanağı imzalandı.'
  },
  {
    id: 'LS-005', numuneTakipNo: 'SNT-LAB-2026-000005', operasyonNo: 'OPS-2026-0151', testKaydiId: 'TR-010',
    numuneTuru: 'Emdirilmiş pamuk', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Esrar türevi',
    muhrEtiketNo: 'MHR-2026-005', delilPosetiNo: 'DP-2026-0092', sevkEdenBirim: 'Sınır Kapısı A',
    gonderimYontemi: 'Güvenli Kurye', tahminiVaris: '2026-05-07T11:00:00Z',
    durum: 'Numune Paketlendi', oncelik: 'Normal', notlar: 'Paketleme tamamlandı, kurye bekleniyor.'
  },
  {
    id: 'LS-006', numuneTakipNo: 'SNT-LAB-2026-000006', operasyonNo: 'OPS-2026-0153', testKaydiId: 'TR-012',
    numuneTuru: 'Sıvı numune', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'GHB benzeri madde',
    muhrEtiketNo: 'MHR-2026-006', delilPosetiNo: 'DP-2026-0093', sevkEdenBirim: 'Araç Arama Noktası',
    gonderimYontemi: 'Özel Soğuk Zincir', tahminiVaris: '2026-04-30T09:00:00Z',
    durum: 'Rapor Yüklendi', oncelik: 'Yüksek', notlar: 'Kimyasal analiz raporu sisteme yüklendi.'
  },
  {
    id: 'LS-007', numuneTakipNo: 'SNT-LAB-2026-000007', operasyonNo: 'OPS-2026-0155', testKaydiId: 'TR-014',
    numuneTuru: 'Paket / koli içeriği', onTaramaSonucu: 'Pozitif', tespitEdilenMadde: 'Fentanil türevi',
    muhrEtiketNo: 'MHR-2026-007', delilPosetiNo: 'DP-2026-0094', sevkEdenBirim: 'Liman Kontrol Noktası',
    gonderimYontemi: 'Zırhlı Araç', tahminiVaris: '2026-04-25T14:00:00Z',
    durum: 'Dosya Kapatıldı', oncelik: 'Yüksek', notlar: 'Adli süreç tamamlandı. Dosya arşive alındı.'
  },
];

export const mockInventory: Stok[] = [
  {
    id: 'STK-001', urunAdi: 'SENTEK Multi-Panel Kiti A5', panelTipi: '5-Panel (KOK, ERO, MET, AMP, THC)',
    lotSeriNo: 'LOT-2026-A1', girisAdedi: 5000, kullanilanAdedi: 1500, kalanAdedi: 3500,
    skt: '2027-12-31', depo: 'Merkez Depo', kritikSeviye: 1000, durum: 'Normal'
  },
  {
    id: 'STK-002', urunAdi: 'SENTEK Tekil Panel Kiti KOK', panelTipi: 'KOK (Kokain)',
    lotSeriNo: 'LOT-2026-B2', girisAdedi: 1000, kullanilanAdedi: 950, kalanAdedi: 50,
    skt: '2027-06-30', depo: 'Bölge Depo 1', kritikSeviye: 100, durum: 'Kritik'
  },
  {
    id: 'STK-003', urunAdi: 'SENTEK Multi-Panel Kiti A3', panelTipi: '3-Panel (KOK, ERO, MET)',
    lotSeriNo: 'LOT-2025-C3', girisAdedi: 2000, kullanilanAdedi: 1800, kalanAdedi: 200,
    skt: '2026-07-15', depo: 'Sınır Kapısı A', kritikSeviye: 300, durum: 'SKT Yaklaşıyor'
  },
  {
    id: 'STK-004', urunAdi: 'SENTEK Fentanil Tespit Kiti', panelTipi: 'FEN (Fentanil)',
    lotSeriNo: 'LOT-2026-D4', girisAdedi: 500, kullanilanAdedi: 120, kalanAdedi: 380,
    skt: '2027-08-31', depo: 'Liman Kontrol Noktası', kritikSeviye: 50, durum: 'Normal'
  },
  {
    id: 'STK-005', urunAdi: 'SENTEK Esrar Panel Kiti', panelTipi: 'THC (Tetrahidrokannabinol)',
    lotSeriNo: 'LOT-2026-E5', girisAdedi: 800, kullanilanAdedi: 800, kalanAdedi: 0,
    skt: '2027-03-31', depo: 'Mobil Ekip Deposu', kritikSeviye: 80, durum: 'Tükendi'
  },
  {
    id: 'STK-006', urunAdi: 'SENTEK Multi-Panel Kiti A7', panelTipi: '7-Panel Geniş Spektrum',
    lotSeriNo: 'LOT-2026-F6', girisAdedi: 3000, kullanilanAdedi: 450, kalanAdedi: 2550,
    skt: '2028-01-31', depo: 'Merkez Depo', kritikSeviye: 500, durum: 'Normal'
  },
  {
    id: 'STK-007', urunAdi: 'SENTEK Amfetamin Kiti', panelTipi: 'AMP (Amfetamin)',
    lotSeriNo: 'LOT-2025-G7', girisAdedi: 1500, kullanilanAdedi: 1420, kalanAdedi: 80,
    skt: '2026-06-30', depo: 'Araç Arama Deposu', kritikSeviye: 150, durum: 'Kritik'
  },
  {
    id: 'STK-008', urunAdi: 'SENTEK Heroin Panel Kiti', panelTipi: 'ERO (Eroin/Opioid)',
    lotSeriNo: 'LOT-2026-H8', girisAdedi: 1200, kullanilanAdedi: 300, kalanAdedi: 900,
    skt: '2027-10-31', depo: 'Antrepo Bölgesi', kritikSeviye: 200, durum: 'Normal'
  },
  {
    id: 'STK-009', urunAdi: 'SENTEK Kalibre Sıvı Seti', panelTipi: 'Kontrol Solüsyonu',
    lotSeriNo: 'LOT-2026-I9', girisAdedi: 200, kullanilanAdedi: 45, kalanAdedi: 155,
    skt: '2026-08-15', depo: 'Merkez Laboratuvar', kritikSeviye: 30, durum: 'SKT Yaklaşıyor'
  },
  {
    id: 'STK-010', urunAdi: 'SENTEK Delil Poşeti (Küçük)', panelTipi: 'Sarf Malzeme',
    lotSeriNo: 'LOT-2026-J10', girisAdedi: 10000, kullanilanAdedi: 3200, kalanAdedi: 6800,
    skt: '2029-12-31', depo: 'Merkez Depo', kritikSeviye: 1000, durum: 'Normal'
  },
];

export const DEMO_CREDENTIALS: Record<string, { sifre: string; kullaniciId: string }> = {
  'admin@sentek.local': { sifre: 'admin123', kullaniciId: '1' },
  'merkez@sentek.local': { sifre: 'merkez123', kullaniciId: '2' },
  'bolge@sentek.local': { sifre: 'bolge123', kullaniciId: '3' },
  'saha@sentek.local': { sifre: 'saha123', kullaniciId: '4' },
  'lab@sentek.local': { sifre: 'lab123', kullaniciId: '5' },
};
