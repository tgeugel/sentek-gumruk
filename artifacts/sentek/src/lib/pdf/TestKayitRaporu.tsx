import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TestKaydi } from '../../types';
import sentekLogo from '../../assets/sentek-logo.jpg';
import sentekKit from '../../assets/sentek-kit.png';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 30, backgroundColor: '#fff', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '2px solid #0A0F1E', paddingBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoImg: { width: 38, height: 38, borderRadius: 4 },
  logoTextWrap: { flexDirection: 'column' },
  logo: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0A0F1E', letterSpacing: 1.5 },
  logoSub: { fontSize: 7, color: '#666', marginTop: 1 },
  gizlilik: { fontSize: 7, color: '#cc0000', marginTop: 3, fontFamily: 'Helvetica-Bold' },
  headerRight: { textAlign: 'right' },
  headerTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0A0F1E' },
  headerDate: { fontSize: 7, color: '#666', marginTop: 2 },

  twoCol: { flexDirection: 'row', gap: 14 },
  colMain: { flex: 1 },
  colSide: { width: 150 },

  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#666', marginBottom: 5, borderBottom: '1px solid #eee', paddingBottom: 3 },
  row: { flexDirection: 'row', marginBottom: 2.5 },
  label: { width: '38%', fontSize: 8, color: '#666', fontFamily: 'Helvetica-Bold' },
  value: { width: '62%', fontSize: 8, color: '#1a1a1a' },

  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  pozitif: { backgroundColor: '#fee2e2', color: '#dc2626' },
  negatif: { backgroundColor: '#d1fae5', color: '#065f46' },
  gecersiz: { backgroundColor: '#fef3c7', color: '#92400e' },

  noteBox: { padding: 6, backgroundColor: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: 3, fontSize: 8, color: '#444', lineHeight: 1.5 },
  overrideBox: { padding: 6, backgroundColor: '#fff7ed', border: '0.5px solid #fdba74', borderRadius: 3, fontSize: 8, color: '#9a3412', lineHeight: 1.5 },

  kitCard: { border: '1px solid #e5e7eb', borderRadius: 4, padding: 6, alignItems: 'center', marginBottom: 8 },
  kitImg: { width: 138, height: 'auto', objectFit: 'contain' },
  kitCaption: { fontSize: 7, color: '#666', textAlign: 'center', marginTop: 4 },

  qrArea: { alignItems: 'center', borderRadius: 4, padding: 6, border: '1px solid #e5e7eb', marginTop: 4 },
  qrImg: { width: 90, height: 90 },
  qrLabel: { fontSize: 7, color: '#666', textAlign: 'center', marginTop: 4, fontFamily: 'Helvetica-Bold' },

  signBox: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  signCell: { flex: 1, borderTop: '1px solid #999', paddingTop: 4 },
  signTitle: { fontSize: 7, color: '#666', fontFamily: 'Helvetica-Bold' },
  signName: { fontSize: 8, color: '#1a1a1a', marginTop: 2 },

  footer: { position: 'absolute', bottom: 18, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', borderTop: '0.5px solid #e5e7eb', paddingTop: 6 },
  footerText: { fontSize: 6, color: '#9ca3af' },
});

interface Props {
  kayit: TestKaydi;
  qrDataUrl?: string;
}

export function TestKayitRaporuDoc({ kayit, qrDataUrl }: Props) {
  const sonucStyle = kayit.testSonucu === 'Pozitif' ? styles.pozitif : kayit.testSonucu === 'Negatif' ? styles.negatif : styles.gecersiz;
  const overrideVar = !!kayit.kullaniciOverrideAciklamasi && !!kayit.aiOnerisi && kayit.aiOnerisi !== kayit.testSonucu;

  return (
    <Document title={`SENTEK Test Raporu — ${kayit.operasyonNo}`} author="SENTEK Sistemi">
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={sentekLogo} style={styles.logoImg} />
            <View style={styles.logoTextWrap}>
              <Text style={styles.logo}>SENTEK</Text>
              <Text style={styles.logoSub}>Saha Entegre Narkotik Test Yazılımı</Text>
              <Text style={styles.gizlilik}>GİZLİ — YETKİLİ PERSONEL</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>SAHA TEST RAPORU</Text>
            <Text style={styles.headerDate}>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</Text>
            <Text style={styles.headerDate}>Saat: {new Date().toLocaleTimeString('tr-TR')}</Text>
            <Text style={styles.headerDate}>Kayıt: {kayit.id}</Text>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.colMain}>
            {/* OPERASYON */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Operasyon Bilgileri</Text>
              {[
                ['Operasyon No', kayit.operasyonNo],
                ['Tarih / Saat', new Date(kayit.tarih).toLocaleString('tr-TR')],
                ['Personel', kayit.personelAdi],
                ['Lokasyon', kayit.lokasyon],
                ['Kontrol Noktası', kayit.kontrolNokta || '—'],
              ].map(([l, v]) => (
                <View key={l} style={styles.row}>
                  <Text style={styles.label}>{l}:</Text>
                  <Text style={styles.value}>{v}</Text>
                </View>
              ))}
            </View>

            {/* NUMUNE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Numune Bilgileri</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Numune Türü:</Text>
                <Text style={styles.value}>{kayit.numuneTuru}</Text>
              </View>
              {kayit.sahisAciklamasi && (
                <View style={{ marginTop: 4 }}>
                  <Text style={[styles.label, { width: '100%', marginBottom: 2 }]}>Materyal Açıklaması:</Text>
                  <Text style={styles.noteBox}>{kayit.sahisAciklamasi}</Text>
                </View>
              )}
            </View>

            {/* KİT */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kit / Materyal Bilgileri</Text>
              {[
                ['Kit Seri No', kayit.kitSeriNo],
                ['Son Kullanma Tarihi', kayit.kitSKT || '—'],
                ['Panel Tipi', kayit.kitPanelTipi || '—'],
              ].map(([l, v]) => (
                <View key={l} style={styles.row}>
                  <Text style={styles.label}>{l}:</Text>
                  <Text style={styles.value}>{v}</Text>
                </View>
              ))}
            </View>

            {/* TEST SONUÇ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Test Sonucu</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Onaylanan Sonuç:</Text>
                <View><Text style={[styles.badge, sonucStyle]}>{kayit.testSonucu}</Text></View>
              </View>
              {kayit.aiOnerisi && (
                <View style={styles.row}>
                  <Text style={styles.label}>AI Önerisi:</Text>
                  <Text style={styles.value}>{kayit.aiOnerisi}</Text>
                </View>
              )}
              {kayit.analizGuvenSkoru !== undefined && (
                <View style={styles.row}>
                  <Text style={styles.label}>AI Güven Skoru:</Text>
                  <Text style={styles.value}>%{kayit.analizGuvenSkoru}</Text>
                </View>
              )}
              {kayit.tespitEdilenMadde && (
                <View style={styles.row}>
                  <Text style={styles.label}>Tespit Edilen Madde:</Text>
                  <Text style={[styles.value, { color: '#dc2626', fontFamily: 'Helvetica-Bold' }]}>{kayit.tespitEdilenMadde}</Text>
                </View>
              )}
            </View>

            {overrideVar && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kullanıcı Override Açıklaması</Text>
                <Text style={styles.overrideBox}>
                  AI önerisi ({kayit.aiOnerisi}) yetkili personel tarafından "{kayit.testSonucu}" olarak değiştirilmiştir.{'\n'}
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
          </View>

          {/* SAĞ KOLON: Kit + QR */}
          <View style={styles.colSide}>
            <Text style={styles.sectionTitle}>Saha Çekim Kaydı</Text>
            <View style={styles.kitCard}>
              <Image src={kayit.fotografOverlayUrl || sentekKit} style={styles.kitImg} />
              <Text style={styles.kitCaption}>
                {kayit.fotografOverlayUrl
                  ? 'AI foto-analiz: Kit + C/T çizgi tespiti overlay\'i'
                  : 'SENTEK Multi-Panel Test Kiti (referans görüntü)'}
              </Text>
            </View>

            {qrDataUrl && (
              <View>
                <Text style={styles.sectionTitle}>Kayıt QR</Text>
                <View style={styles.qrArea}>
                  <Image src={qrDataUrl} style={styles.qrImg} />
                  <Text style={styles.qrLabel}>SENTEK:TEST:{kayit.id}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* İMZA */}
        <View style={styles.signBox}>
          <View style={styles.signCell}>
            <Text style={styles.signTitle}>SAHA PERSONELİ</Text>
            <Text style={styles.signName}>{kayit.personelAdi}</Text>
            <Text style={[styles.signTitle, { marginTop: 2, fontFamily: 'Helvetica' }]}>İmza / Tarih</Text>
          </View>
          <View style={styles.signCell}>
            <Text style={styles.signTitle}>BİRİM AMİRİ</Text>
            <Text style={styles.signName}>____________________</Text>
            <Text style={[styles.signTitle, { marginTop: 2, fontFamily: 'Helvetica' }]}>İmza / Tarih</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SENTEK Operasyon Takip Sistemi — Belge No: {kayit.id} — {new Date().toLocaleDateString('tr-TR')}</Text>
          <Text style={styles.footerText}>GİZLİ — Yetkisiz dağıtım yasaktır</Text>
        </View>
      </Page>
    </Document>
  );
}
