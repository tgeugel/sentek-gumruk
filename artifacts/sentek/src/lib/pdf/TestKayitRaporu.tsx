import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TestKaydi, RaporAyarlari, RaporRenkTema } from '../../types';
import sentekLogo from '../../assets/sentek-logo.jpg';
import sentekKit from '../../assets/sentek-kit.png';

interface TemaRenkleri {
  primary: string;
  primaryDark: string;
  accent: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  classification: string;
}

const TEMA: Record<RaporRenkTema, TemaRenkleri> = {
  kurumsal: {
    primary: '#0A2A5E', primaryDark: '#061A3D', accent: '#0066CC',
    surface: '#ffffff', surfaceAlt: '#f1f5f9', border: '#cbd5e1',
    text: '#0f172a', muted: '#475569', classification: '#b91c1c',
  },
  koyu: {
    primary: '#0A0F1E', primaryDark: '#000', accent: '#00D4FF',
    surface: '#ffffff', surfaceAlt: '#0f172a', border: '#334155',
    text: '#0f172a', muted: '#475569', classification: '#dc2626',
  },
  klasik: {
    primary: '#1f2937', primaryDark: '#111827', accent: '#374151',
    surface: '#ffffff', surfaceAlt: '#f9fafb', border: '#d1d5db',
    text: '#111827', muted: '#4b5563', classification: '#991b1b',
  },
};

const PANEL_MADDELERI: Record<string, string> = {
  AMP: 'Amfetamin grubu', THC: 'Esrar türevi (THC)', COC: 'Kokain',
  MET: 'Metamfetamin', MOP: 'Eroin türevi (Opiat)', MTD: 'Metadon',
};
const PANEL_SIRASI = ['AMP', 'COC', 'THC', 'MET', 'MOP', 'MTD'];

interface Props {
  kayit: TestKaydi;
  ayarlar: RaporAyarlari;
  qrDataUrl?: string;
}

function makeStyles(t: TemaRenkleri) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, paddingTop: 80, paddingBottom: 60, paddingHorizontal: 36, backgroundColor: '#fff', color: t.text },
    pageCover: { fontFamily: 'Helvetica', fontSize: 10, padding: 0, backgroundColor: '#fff', color: t.text },

    classificationTop: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: t.classification, color: '#fff', textAlign: 'center', padding: 6, fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 3 },
    classificationBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: t.classification, color: '#fff', textAlign: 'center', padding: 6, fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 3 },

    headerBar: { position: 'absolute', top: 26, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${t.primary}`, paddingBottom: 6 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoMini: { width: 26, height: 26, borderRadius: 3 },
    headerKurum: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: t.primary },
    headerBirim: { fontSize: 7, color: t.muted },
    headerRight: { textAlign: 'right' },
    headerBelgeNo: { fontSize: 7, color: t.muted, fontFamily: 'Helvetica-Bold' },
    headerSayfa: { fontSize: 7, color: t.muted, marginTop: 1 },

    footerBar: { position: 'absolute', bottom: 26, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', borderTop: `0.5px solid ${t.border}`, paddingTop: 4 },
    footerText: { fontSize: 6.5, color: t.muted },

    watermark: { position: 'absolute', top: 320, left: 0, right: 0, textAlign: 'center', fontSize: 110, fontFamily: 'Helvetica-Bold', color: t.classification, opacity: 0.07 },

    coverWrap: { flex: 1, padding: 50, justifyContent: 'space-between' },
    coverHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${t.primary}`, paddingBottom: 18 },
    coverLogoBlock: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    coverLogo: { width: 60, height: 60, borderRadius: 6 },
    coverKurum: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: t.primary, maxWidth: 280 },
    coverBirim: { fontSize: 9, color: t.muted, marginTop: 2, maxWidth: 280 },
    coverAdres: { fontSize: 7, color: t.muted, marginTop: 4, maxWidth: 280 },
    coverSeal: { borderWidth: 2, borderColor: t.classification, borderStyle: 'solid', padding: 8, alignItems: 'center', borderRadius: 4 },
    coverSealText: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: t.classification, letterSpacing: 4 },
    coverSealSub: { fontSize: 6, color: t.classification, marginTop: 2, letterSpacing: 1 },

    coverCenter: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 30 },
    coverEyebrow: { fontSize: 9, color: t.accent, fontFamily: 'Helvetica-Bold', letterSpacing: 6, marginBottom: 14 },
    coverTitle: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: t.primary, textAlign: 'center', letterSpacing: 1, lineHeight: 1.2 },
    coverSubtitle: { fontSize: 11, color: t.muted, textAlign: 'center', marginTop: 14, fontFamily: 'Helvetica-Oblique' },
    coverDivider: { width: 60, height: 3, backgroundColor: t.accent, marginTop: 20, marginBottom: 20 },
    coverMetaGrid: { width: '100%', maxWidth: 420, marginTop: 20 },
    coverMetaRow: { flexDirection: 'row', borderBottom: `0.5px solid ${t.border}`, paddingVertical: 6 },
    coverMetaLabel: { width: '40%', fontSize: 8.5, color: t.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
    coverMetaValue: { width: '60%', fontSize: 9.5, color: t.text },

    coverFooter: { borderTop: `1px solid ${t.border}`, paddingTop: 12, alignItems: 'center' },
    coverFooterText: { fontSize: 7.5, color: t.muted, textAlign: 'center', lineHeight: 1.5 },
    coverDocId: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: t.primary, marginTop: 6 },

    bigSectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: t.primary, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4, marginBottom: 8, paddingBottom: 4, borderBottom: `1.5px solid ${t.primary}` },
    section: { marginBottom: 14 },
    sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.2, color: t.primary, marginBottom: 6, paddingBottom: 3, borderBottom: `0.8px solid ${t.border}` },

    twoCol: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },

    infoGrid: { backgroundColor: t.surfaceAlt, padding: 8, borderRadius: 4, border: `0.5px solid ${t.border}` },
    infoRow: { flexDirection: 'row', marginBottom: 3, paddingBottom: 2 },
    infoLabel: { width: '42%', fontSize: 8, color: t.muted, fontFamily: 'Helvetica-Bold' },
    infoValue: { width: '58%', fontSize: 8.5, color: t.text },

    sonucBigBox: { padding: 12, borderRadius: 6, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sonucEtiket: { fontSize: 7.5, color: t.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 },
    sonucDeger: { fontSize: 22, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
    sonucMadde: { fontSize: 9, marginTop: 4, fontFamily: 'Helvetica-Bold' },

    panelTable: { border: `0.8px solid ${t.border}`, borderRadius: 4, overflow: 'hidden' },
    tHead: { flexDirection: 'row', backgroundColor: t.primary, color: '#fff', padding: 6 },
    tHeadCell: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#fff', letterSpacing: 0.5 },
    tRow: { flexDirection: 'row', borderTop: `0.5px solid ${t.border}`, padding: 6, alignItems: 'center' },
    tRowAlt: { backgroundColor: t.surfaceAlt },
    tCell: { fontSize: 8, color: t.text },

    badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3, fontSize: 8, fontFamily: 'Helvetica-Bold', alignSelf: 'flex-start' },
    bPos: { backgroundColor: '#fee2e2', color: '#b91c1c' },
    bNeg: { backgroundColor: '#d1fae5', color: '#065f46' },
    bGec: { backgroundColor: '#fef3c7', color: '#92400e' },

    noteBox: { padding: 8, backgroundColor: t.surfaceAlt, border: `0.5px solid ${t.border}`, borderRadius: 4, fontSize: 8.5, color: t.text, lineHeight: 1.5 },
    overrideBox: { padding: 8, backgroundColor: '#fff7ed', borderLeft: '3px solid #ea580c', borderRadius: 3, fontSize: 8.5, color: '#7c2d12', lineHeight: 1.5, marginTop: 6 },
    aiBox: { padding: 8, backgroundColor: '#eff6ff', borderLeft: `3px solid ${t.accent}`, borderRadius: 3, fontSize: 8.5, color: t.text, lineHeight: 1.5 },

    photoCard: { border: `0.8px solid ${t.border}`, borderRadius: 4, padding: 8, alignItems: 'center', backgroundColor: t.surfaceAlt },
    photoImg: { width: '100%', maxHeight: 380, objectFit: 'contain' },
    photoCaption: { fontSize: 7.5, color: t.muted, textAlign: 'center', marginTop: 6, fontFamily: 'Helvetica-Oblique' },

    qrBlock: { alignItems: 'center', padding: 8, border: `0.5px solid ${t.border}`, borderRadius: 4 },
    qrImg: { width: 110, height: 110 },
    qrLabel: { fontSize: 7, color: t.muted, marginTop: 4, fontFamily: 'Helvetica-Bold', textAlign: 'center' },

    chainStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
    chainDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: t.accent, marginTop: 2 },
    chainText: { flex: 1, fontSize: 8, color: t.text },
    chainTime: { fontSize: 7, color: t.muted, marginTop: 1 },

    signGrid: { flexDirection: 'row', gap: 12, marginTop: 8 },
    signCell: { flex: 1, borderTop: `1px solid ${t.text}`, paddingTop: 6, minHeight: 60 },
    signTitle: { fontSize: 7, color: t.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    signName: { fontSize: 9, color: t.text, marginTop: 4, fontFamily: 'Helvetica-Bold' },
    signSub: { fontSize: 6.5, color: t.muted, marginTop: 18 },
  });
}

function badgeStyle(s: TestKaydi['testSonucu'], styles: ReturnType<typeof makeStyles>) {
  if (s === 'Pozitif') return styles.bPos;
  if (s === 'Negatif') return styles.bNeg;
  return styles.bGec;
}

function sonucColor(s: TestKaydi['testSonucu']): string {
  if (s === 'Pozitif') return '#b91c1c';
  if (s === 'Negatif') return '#065f46';
  return '#92400e';
}

function sonucBg(s: TestKaydi['testSonucu']): string {
  if (s === 'Pozitif') return '#fef2f2';
  if (s === 'Negatif') return '#ecfdf5';
  return '#fffbeb';
}

export function TestKayitRaporuDoc({ kayit, ayarlar, qrDataUrl }: Props) {
  const t = TEMA[ayarlar.renkTema] || TEMA.kurumsal;
  const styles = makeStyles(t);
  const overrideVar = !!kayit.kullaniciOverrideAciklamasi && !!kayit.aiOnerisi && kayit.aiOnerisi !== kayit.testSonucu;
  const belgeNo = `${ayarlar.belgeNoOnEki}-${kayit.id.replace(/^TR-/, '')}`;
  const raporTarih = new Date().toLocaleString('tr-TR');

  // Panel-by-panel sentetik tablo: pozitifte tespit edilen madde paneli pozitif, kalanlar negatif
  const panelRows = PANEL_SIRASI.map((kod) => {
    const isInvalid = kayit.testSonucu === 'Geçersiz';
    const isPositivePanel = kayit.testSonucu === 'Pozitif' && kayit.tespitEdilenMadde && PANEL_MADDELERI[kod] === kayit.tespitEdilenMadde;
    const C = !isInvalid; // Geçersizde C yok varsayım
    const T = !isPositivePanel; // T görünür ⇒ NEG
    const sonuc: TestKaydi['testSonucu'] = isInvalid ? 'Geçersiz' : isPositivePanel ? 'Pozitif' : 'Negatif';
    return { kod, madde: PANEL_MADDELERI[kod] || kod, C, T, sonuc };
  });

  // Zincir adımları
  const zincirAdimlari = [
    { tarih: kayit.tarih, baslik: 'Saha Numune Alımı', aciklama: `${kayit.lokasyon} • ${kayit.kontrolNokta || '—'} — ${kayit.personelAdi}` },
    { tarih: kayit.tarih, baslik: 'Kit Çekimi & Foto-Analiz', aciklama: `Kit Seri: ${kayit.kitSeriNo} • AI Önerisi: ${kayit.aiOnerisi || kayit.testSonucu}` },
    { tarih: kayit.tarih, baslik: 'Sonuç Onayı', aciklama: `Onaylanan sonuç: ${kayit.testSonucu}${overrideVar ? ' (override)' : ''}` },
    ...(kayit.labSevkId ? [{ tarih: kayit.tarih, baslik: 'Laboratuvara Sevk', aciklama: `Sevk No: ${kayit.labSevkId}` }] : []),
  ];

  const Header = () => (
    <>
      <Text style={styles.classificationTop} fixed>{ayarlar.gizlilikSeviyesi}</Text>
      <View style={styles.headerBar} fixed>
        <View style={styles.headerLeft}>
          <Image src={sentekLogo} style={styles.logoMini} />
          <View>
            <Text style={styles.headerKurum}>{ayarlar.kurumAdi}</Text>
            <Text style={styles.headerBirim}>{ayarlar.birimAdi}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerBelgeNo}>Belge No: {belgeNo}</Text>
          <Text style={styles.headerSayfa} render={({ pageNumber, totalPages }) => `Sayfa ${pageNumber} / ${totalPages}`} />
        </View>
      </View>
    </>
  );

  const Footer = () => (
    <>
      <View style={styles.footerBar} fixed>
        <Text style={styles.footerText}>{ayarlar.altBilgi}</Text>
        <Text style={styles.footerText}>{ayarlar.iletisim}</Text>
      </View>
      <Text style={styles.classificationBottom} fixed>{ayarlar.gizlilikSeviyesi} — Yetkisiz Kişilere Verilemez</Text>
    </>
  );

  const Watermark = () =>
    ayarlar.watermarkGoster ? <Text style={styles.watermark} fixed>{ayarlar.watermarkMetin || ayarlar.gizlilikSeviyesi}</Text> : null;

  return (
    <Document title={`SENTEK Test Raporu — ${kayit.operasyonNo}`} author={ayarlar.kurumAdi} subject={ayarlar.ustBilgi}>
      {/* KAPAK SAYFASI */}
      {ayarlar.kapakSayfasiGoster && (
        <Page size="A4" style={styles.pageCover}>
          <Text style={styles.classificationTop}>{ayarlar.gizlilikSeviyesi}</Text>
          <View style={styles.coverWrap}>
            <View style={styles.coverHeader}>
              <View style={styles.coverLogoBlock}>
                <Image src={sentekLogo} style={styles.coverLogo} />
                <View>
                  <Text style={styles.coverKurum}>{ayarlar.kurumAdi}</Text>
                  <Text style={styles.coverBirim}>{ayarlar.birimAdi}</Text>
                  <Text style={styles.coverAdres}>{ayarlar.kurumAdresi}</Text>
                </View>
              </View>
              <View style={styles.coverSeal}>
                <Text style={styles.coverSealText}>{ayarlar.gizlilikSeviyesi}</Text>
                <Text style={styles.coverSealSub}>SAHA OPERASYON BELGESİ</Text>
              </View>
            </View>

            <View style={styles.coverCenter}>
              <Text style={styles.coverEyebrow}>SAHA ENTEGRE NARKOTİK TEST RAPORU</Text>
              <Text style={styles.coverTitle}>RESMÎ TEST{'\n'}KAYIT RAPORU</Text>
              <View style={styles.coverDivider} />
              <Text style={styles.coverSubtitle}>{ayarlar.ustBilgi}</Text>

              <View style={styles.coverMetaGrid}>
                {[
                  ['Operasyon No', kayit.operasyonNo],
                  ['Kayıt ID', kayit.id],
                  ['Belge No', belgeNo],
                  ['Saha Personeli', kayit.personelAdi],
                  ['Lokasyon', `${kayit.lokasyon}${kayit.kontrolNokta ? ' / ' + kayit.kontrolNokta : ''}`],
                  ['Test Tarihi', new Date(kayit.tarih).toLocaleString('tr-TR')],
                  ['Onaylanan Sonuç', kayit.testSonucu + (kayit.tespitEdilenMadde ? ` — ${kayit.tespitEdilenMadde}` : '')],
                ].map(([l, v]) => (
                  <View key={l} style={styles.coverMetaRow}>
                    <Text style={styles.coverMetaLabel}>{l}</Text>
                    <Text style={styles.coverMetaValue}>{v}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.coverFooter}>
              <Text style={styles.coverFooterText}>
                Bu belge SENTEK Saha Entegre Narkotik Test Yazılımı tarafından otomatik olarak üretilmiştir.{'\n'}
                Gizlilik seviyesi: {ayarlar.gizlilikSeviyesi}. Yetkisiz dağıtımı yasak olup yasal işlem gerektirir.
              </Text>
              <Text style={styles.coverDocId}>RAPOR ÜRETİM TARİHİ: {raporTarih}</Text>
            </View>
          </View>
          <Text style={styles.classificationBottom}>{ayarlar.gizlilikSeviyesi}</Text>
        </Page>
      )}

      {/* DETAY SAYFASI */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Watermark />

        <Text style={styles.bigSectionTitle}>1. Operasyon ve Numune Bilgileri</Text>
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Operasyon</Text>
            <View style={styles.infoGrid}>
              {[
                ['Operasyon No', kayit.operasyonNo],
                ['Tarih / Saat', new Date(kayit.tarih).toLocaleString('tr-TR')],
                ['Saha Personeli', kayit.personelAdi],
                ['Lokasyon', kayit.lokasyon],
                ['Kontrol Noktası', kayit.kontrolNokta || '—'],
              ].map(([l, v]) => (
                <View key={l} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{l}</Text>
                  <Text style={styles.infoValue}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Numune & Kit</Text>
            <View style={styles.infoGrid}>
              {[
                ['Numune Türü', kayit.numuneTuru],
                ['Kit Seri No', kayit.kitSeriNo],
                ['Kit SKT', kayit.kitSKT || '—'],
                ['Panel Tipi', kayit.kitPanelTipi || '6 Panel Multi-Drug'],
                ['Senkron Durumu', kayit.syncDurumu || 'Senkronize Edildi'],
              ].map(([l, v]) => (
                <View key={l} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{l}</Text>
                  <Text style={styles.infoValue}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {kayit.sahisAciklamasi && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materyal Açıklaması</Text>
            <Text style={styles.noteBox}>{kayit.sahisAciklamasi}</Text>
          </View>
        )}

        <Text style={styles.bigSectionTitle}>2. Test Sonucu</Text>
        <View style={[styles.sonucBigBox, { backgroundColor: sonucBg(kayit.testSonucu), borderLeft: `4px solid ${sonucColor(kayit.testSonucu)}` }]}>
          <View>
            <Text style={styles.sonucEtiket}>ONAYLANAN SAHA TEST SONUCU</Text>
            <Text style={[styles.sonucDeger, { color: sonucColor(kayit.testSonucu) }]}>{kayit.testSonucu.toUpperCase()}</Text>
            {kayit.tespitEdilenMadde && (
              <Text style={[styles.sonucMadde, { color: sonucColor(kayit.testSonucu) }]}>Tespit: {kayit.tespitEdilenMadde}</Text>
            )}
          </View>
          {ayarlar.aiDetayGoster && kayit.analizGuvenSkoru !== undefined && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sonucEtiket}>AI GÜVEN SKORU</Text>
              <Text style={[styles.sonucDeger, { color: t.primary, fontSize: 18 }]}>%{kayit.analizGuvenSkoru}</Text>
              {kayit.aiOnerisi && <Text style={{ fontSize: 8, color: t.muted, marginTop: 2 }}>AI Önerisi: {kayit.aiOnerisi}</Text>}
            </View>
          )}
        </View>

        {ayarlar.panelTablosuGoster && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Panel Bazlı Sonuçlar (6 Panel Multi-Drug)</Text>
            <View style={styles.panelTable}>
              <View style={styles.tHead}>
                <Text style={[styles.tHeadCell, { width: '14%' }]}>PANEL</Text>
                <Text style={[styles.tHeadCell, { width: '38%' }]}>MADDE GRUBU</Text>
                <Text style={[styles.tHeadCell, { width: '14%', textAlign: 'center' }]}>C ÇİZGİSİ</Text>
                <Text style={[styles.tHeadCell, { width: '14%', textAlign: 'center' }]}>T ÇİZGİSİ</Text>
                <Text style={[styles.tHeadCell, { width: '20%', textAlign: 'right' }]}>SONUÇ</Text>
              </View>
              {panelRows.map((p, i) => (
                <View key={p.kod} style={[styles.tRow, ...(i % 2 === 1 ? [styles.tRowAlt] : [])]}>
                  <Text style={[styles.tCell, { width: '14%', fontFamily: 'Helvetica-Bold' }]}>{p.kod}</Text>
                  <Text style={[styles.tCell, { width: '38%' }]}>{p.madde}</Text>
                  <Text style={[styles.tCell, { width: '14%', textAlign: 'center' }]}>{p.C ? '✓ Görünür' : '— Yok'}</Text>
                  <Text style={[styles.tCell, { width: '14%', textAlign: 'center' }]}>{p.T ? '✓ Görünür' : '— Yok'}</Text>
                  <View style={{ width: '20%', alignItems: 'flex-end' }}>
                    <Text style={[styles.badge, badgeStyle(p.sonuc, styles)]}>{p.sonuc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 7, color: t.muted, marginTop: 6, fontFamily: 'Helvetica-Oblique' }}>
              İmmunoassay yorumu: T çizgisi GÖRÜNÜR ise NEGATİF; T çizgisi YOK ise POZİTİF; C çizgisi YOK ise GEÇERSİZ.
            </Text>
          </View>
        )}

        {ayarlar.aiDetayGoster && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Foto-Analiz Özeti</Text>
            <Text style={styles.aiBox}>
              Kit fotoğrafı SENTEK foto-analiz motoru ile değerlendirilmiştir. AI önerisi: {kayit.aiOnerisi || kayit.testSonucu}.
              {kayit.analizGuvenSkoru !== undefined ? ` Güven skoru: %${kayit.analizGuvenSkoru}.` : ''}
              {' '}Sonuç, görsel C/T çizgi tespiti ve panel kanal analizi sonucu üretilmiştir.
              {overrideVar ? ' Yetkili personel override gerekçesi aşağıdadır.' : ''}
            </Text>
          </View>
        )}

        {overrideVar && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kullanıcı Override Kaydı (Audit)</Text>
            <Text style={styles.overrideBox}>
              AI önerisi: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{kayit.aiOnerisi}</Text>{'\n'}
              Onaylanan sonuç: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{kayit.testSonucu}</Text>{'\n'}
              Override eden: {kayit.personelAdi}{'\n'}
              Gerekçe: {kayit.kullaniciOverrideAciklamasi}
            </Text>
          </View>
        )}

        {kayit.notlar && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saha Notları</Text>
            <Text style={styles.noteBox}>{kayit.notlar}</Text>
          </View>
        )}

        <Footer />
      </Page>

      {/* KANIT & ZİNCİR SAYFASI */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Watermark />

        {ayarlar.fotoGoster && (
          <View style={styles.section}>
            <Text style={styles.bigSectionTitle}>3. Kit Fotoğraf Kanıtı</Text>
            <View style={styles.photoCard}>
              <Image src={kayit.fotografOverlayUrl || sentekKit} style={styles.photoImg} />
              <Text style={styles.photoCaption}>
                {kayit.fotografOverlayUrl
                  ? 'AI foto-analiz overlay\'i — kit kanalları üzerinde gerçek C/T çizgi tespiti gösterilmektedir.'
                  : 'SENTEK Multi-Panel Test Kiti referans görüntüsü.'}
              </Text>
            </View>
          </View>
        )}

        {ayarlar.zincirGoster && (
          <View style={styles.section}>
            <Text style={styles.bigSectionTitle}>4. İzlenebilirlik Zinciri (Chain of Custody)</Text>
            <View style={{ paddingLeft: 4 }}>
              {zincirAdimlari.map((s, i) => (
                <View key={i} style={styles.chainStep}>
                  <View style={styles.chainDot} />
                  <View style={styles.chainText}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9 }}>{s.baslik}</Text>
                    <Text style={{ fontSize: 8, color: t.muted, marginTop: 1 }}>{s.aciklama}</Text>
                    <Text style={styles.chainTime}>{new Date(s.tarih).toLocaleString('tr-TR')}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.twoCol}>
          {ayarlar.qrGoster && qrDataUrl && (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>5. Doğrulama QR</Text>
              <View style={styles.qrBlock}>
                <Image src={qrDataUrl} style={styles.qrImg} />
                <Text style={styles.qrLabel}>SENTEK:TEST:{kayit.id}</Text>
                <Text style={{ fontSize: 7, color: t.muted, marginTop: 2 }}>Belge No: {belgeNo}</Text>
              </View>
            </View>
          )}
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>6. Belge Bilgileri</Text>
            <View style={styles.infoGrid}>
              {[
                ['Belge No', belgeNo],
                ['Üretim Tarihi', raporTarih],
                ['Kayıt ID', kayit.id],
                ['Üreten Sistem', 'SENTEK v1.0 — Saha Entegre'],
                ['Gizlilik', ayarlar.gizlilikSeviyesi],
                ['Ayarlar Sürümü', new Date(ayarlar.guncellemeTarihi).toLocaleString('tr-TR')],
              ].map(([l, v]) => (
                <View key={l} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{l}</Text>
                  <Text style={styles.infoValue}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.bigSectionTitle}>7. İmza ve Onaylar</Text>
          <View style={styles.signGrid}>
            {ayarlar.imzaSatirlari.map((s, i) => (
              <View key={i} style={styles.signCell}>
                <Text style={styles.signTitle}>{s.unvan}</Text>
                <Text style={styles.signName}>{s.ad || (i === 0 ? kayit.personelAdi : '____________________')}</Text>
                <Text style={styles.signSub}>İmza / Tarih</Text>
              </View>
            ))}
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

