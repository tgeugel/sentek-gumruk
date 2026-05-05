import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { LabSevk } from '../../types';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 32, backgroundColor: '#fff', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '2px solid #0A0F1E', paddingBottom: 12 },
  logo: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0A0F1E', letterSpacing: 2 },
  logoSub: { fontSize: 8, color: '#666', marginTop: 2 },
  headerTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0A0F1E', textAlign: 'right' },
  headerDate: { fontSize: 8, color: '#666', marginTop: 2, textAlign: 'right' },
  gizlilik: { fontSize: 7, color: '#cc0000', marginTop: 4, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#666', marginBottom: 6, borderBottom: '1px solid #eee', paddingBottom: 3 },
  row: { flexDirection: 'row', marginBottom: 3 },
  label: { width: '35%', fontSize: 8, color: '#666', fontFamily: 'Helvetica-Bold' },
  value: { width: '65%', fontSize: 8, color: '#1a1a1a' },
  timeline: { marginTop: 4 },
  timelineItem: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  timelineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0A0F1E', marginRight: 8, marginTop: 1 },
  timelineText: { fontSize: 8 },
  timelineDate: { fontSize: 7, color: '#9ca3af', marginTop: 1 },
  footer: { position: 'absolute', bottom: 24, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', borderTop: '0.5px solid #e5e7eb', paddingTop: 8 },
  footerText: { fontSize: 6, color: '#9ca3af' },
  qrArea: { alignItems: 'center', marginTop: 8 },
  qrLabel: { fontSize: 7, color: '#666', textAlign: 'center', marginTop: 4 },
});

interface Props {
  sevk: LabSevk;
  qrDataUrl?: string;
}

export function LabSevkRaporuDoc({ sevk, qrDataUrl }: Props) {
  return (
    <Document title={`SENTEK Lab Sevk Raporu — ${sevk.numuneTakipNo}`} author="SENTEK Sistemi">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>SENTEK</Text>
            <Text style={styles.logoSub}>Operasyon Takip Sistemi</Text>
            <Text style={styles.gizlilik}>GİZLİ — YETKİLİ PERSONEL</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>LAB SEVK RAPORU</Text>
            <Text style={styles.headerDate}>Tarih: {new Date().toLocaleDateString('tr-TR')}</Text>
            <Text style={styles.headerDate}>Saat: {new Date().toLocaleTimeString('tr-TR')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sevk Bilgileri</Text>
          {[
            ['Takip No', sevk.numuneTakipNo],
            ['Operasyon No', sevk.operasyonNo],
            ['Durum', sevk.durum],
            ['Öncelik', sevk.oncelik],
            ['Gönderen Birim', sevk.sevkEdenBirim],
            ['Gönderim Yöntemi', sevk.gonderimYontemi || '—'],
            ['Tahmini Varış', sevk.tahminiVaris ? new Date(sevk.tahminiVaris).toLocaleString('tr-TR') : '—'],
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
            ['Numune Türü', sevk.numuneTuru],
            ['Ön Tarama Sonucu', sevk.onTaramaSonucu],
            ['Tespit Edilen', sevk.tespitEdilenMadde || '—'],
            ['Mühür / Etiket No', sevk.muhrEtiketNo || '—'],
            ['Delil Poşeti No', sevk.delilPosetiNo || '—'],
            ['Kit Seri No', sevk.kitSeriNo || '—'],
            ['Kit SKT', sevk.kitSKT || '—'],
          ].map(([l, v]) => (
            <View key={l} style={styles.row}>
              <Text style={styles.label}>{l}:</Text>
              <Text style={[styles.value, l === 'Tespit Edilen' && sevk.tespitEdilenMadde ? { color: '#dc2626', fontFamily: 'Helvetica-Bold' } : {}]}>{v}</Text>
            </View>
          ))}
        </View>

        {sevk.teslimAlma && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Teslim Alma Bilgileri</Text>
            {[
              ['Teslim Alan', sevk.teslimAlma.teslimAlanPersonel],
              ['Ambalaj Bütünlüğü', sevk.teslimAlma.ambalajButunlugu],
              ['Mühür Kontrolü', sevk.teslimAlma.muhrKontrol],
              ['Kabul Durumu', sevk.teslimAlma.kabulDurumu],
              ['Notlar', sevk.teslimAlma.fizikselDurumNotu || '—'],
            ].map(([l, v]) => (
              <View key={l} style={styles.row}>
                <Text style={styles.label}>{l}:</Text>
                <Text style={styles.value}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        {sevk.olaylar && sevk.olaylar.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Süreç Geçmişi</Text>
            <View style={styles.timeline}>
              {sevk.olaylar.map((olay, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View>
                    <Text style={styles.timelineText}>{olay.durum} — {olay.kullanici}</Text>
                    {olay.aciklama && <Text style={[styles.timelineDate]}>{olay.aciklama}</Text>}
                    <Text style={styles.timelineDate}>{new Date(olay.tarih).toLocaleString('tr-TR')}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {qrDataUrl && (
          <View style={styles.qrArea}>
            <Image src={qrDataUrl} style={{ width: 64, height: 64 }} />
            <Text style={styles.qrLabel}>SENTEK:LAB:{sevk.id}</Text>
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
