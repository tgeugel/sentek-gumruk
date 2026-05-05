import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TestKaydi } from '../../types';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 32, backgroundColor: '#fff', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '2px solid #0A0F1E', paddingBottom: 12 },
  logo: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0A0F1E', letterSpacing: 2 },
  logoSub: { fontSize: 8, color: '#666', marginTop: 2 },
  headerRight: { textAlign: 'right' },
  headerTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0A0F1E' },
  headerDate: { fontSize: 8, color: '#666', marginTop: 2 },
  gizlilik: { fontSize: 7, color: '#cc0000', marginTop: 4, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#666', marginBottom: 6, borderBottom: '1px solid #eee', paddingBottom: 3 },
  row: { flexDirection: 'row', marginBottom: 3 },
  label: { width: '35%', fontSize: 8, color: '#666', fontFamily: 'Helvetica-Bold' },
  value: { width: '65%', fontSize: 8, color: '#1a1a1a' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  pozitif: { backgroundColor: '#fee2e2', color: '#dc2626' },
  negatif: { backgroundColor: '#d1fae5', color: '#065f46' },
  gecersiz: { backgroundColor: '#fef3c7', color: '#92400e' },
  table: { border: '1px solid #e5e7eb', marginTop: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5px solid #f3f4f6' },
  tableCell: { padding: '4px 6px', fontSize: 7 },
  tableHeaderCell: { padding: '4px 6px', fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#6b7280' },
  footer: { position: 'absolute', bottom: 24, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', borderTop: '0.5px solid #e5e7eb', paddingTop: 8 },
  footerText: { fontSize: 6, color: '#9ca3af' },
  qrArea: { alignItems: 'center', marginTop: 8 },
  qrLabel: { fontSize: 7, color: '#666', textAlign: 'center', marginTop: 4 },
});

interface Props {
  kayit: TestKaydi;
  qrDataUrl?: string;
}

export function TestKayitRaporuDoc({ kayit, qrDataUrl }: Props) {
  const sonucStyle = kayit.testSonucu === 'Pozitif' ? styles.pozitif : kayit.testSonucu === 'Negatif' ? styles.negatif : styles.gecersiz;

  return (
    <Document title={`SENTEK Test Kayıt Raporu — ${kayit.operasyonNo}`} author="SENTEK Sistemi">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>SENTEK</Text>
            <Text style={styles.logoSub}>Operasyon Takip Sistemi</Text>
            <Text style={styles.gizlilik}>GİZLİ — YETKİLİ PERSONEL</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>TEST KAYIT RAPORU</Text>
            <Text style={styles.headerDate}>Tarih: {new Date().toLocaleDateString('tr-TR')}</Text>
            <Text style={styles.headerDate}>Saat: {new Date().toLocaleTimeString('tr-TR')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operasyon Bilgileri</Text>
          {[
            ['Operasyon No', kayit.operasyonNo],
            ['Kayıt ID', kayit.id],
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numune Bilgileri</Text>
          {[
            ['Numune Türü', kayit.numuneTuru],
            ['Materyal Açıklaması', kayit.sahisAciklamasi],
          ].map(([l, v]) => (
            <View key={l} style={styles.row}>
              <Text style={styles.label}>{l}:</Text>
              <Text style={styles.value}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Sonucu</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Sonuç:</Text>
            <View><Text style={[styles.badge, sonucStyle]}>{kayit.testSonucu}</Text></View>
          </View>
          {kayit.tespitEdilenMadde && (
            <View style={styles.row}>
              <Text style={styles.label}>Tespit Edilen:</Text>
              <Text style={[styles.value, { color: '#dc2626', fontFamily: 'Helvetica-Bold' }]}>{kayit.tespitEdilenMadde}</Text>
            </View>
          )}
          {kayit.analizGuvenSkoru !== undefined && (
            <View style={styles.row}>
              <Text style={styles.label}>Analiz Güven Skoru:</Text>
              <Text style={styles.value}>%{kayit.analizGuvenSkoru}</Text>
            </View>
          )}
        </View>

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

        {kayit.notlar && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notlar</Text>
            <Text style={{ fontSize: 8, color: '#444', lineHeight: 1.5 }}>{kayit.notlar}</Text>
          </View>
        )}

        {qrDataUrl && (
          <View style={styles.qrArea}>
            <Image src={qrDataUrl} style={{ width: 64, height: 64 }} />
            <Text style={styles.qrLabel}>SENTEK:{kayit.id}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SENTEK Operasyon Takip Sistemi — {new Date().toLocaleDateString('tr-TR')}</Text>
          <Text style={styles.footerText}>GİZLİ — Yetkisiz dağıtım yasaktır</Text>
        </View>
      </Page>
    </Document>
  );
}
