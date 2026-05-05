import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Stok } from '../../types';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 32, backgroundColor: '#fff', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '2px solid #0A0F1E', paddingBottom: 12 },
  logo: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0A0F1E', letterSpacing: 2 },
  logoSub: { fontSize: 8, color: '#666', marginTop: 2 },
  headerTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0A0F1E', textAlign: 'right' },
  headerDate: { fontSize: 8, color: '#666', marginTop: 2, textAlign: 'right' },
  gizlilik: { fontSize: 7, color: '#cc0000', marginTop: 4, fontFamily: 'Helvetica-Bold' },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#666', marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 3 },
  table: { border: '1px solid #e5e7eb' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderBottom: '1px solid #d1d5db' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5px solid #f3f4f6' },
  tableRowAlt: { flexDirection: 'row', borderBottom: '0.5px solid #f3f4f6', backgroundColor: '#fafafa' },
  cell: { padding: '4px 6px', fontSize: 7, flex: 1 },
  cellBold: { padding: '4px 6px', fontSize: 7, flex: 1, fontFamily: 'Helvetica-Bold', color: '#374151' },
  cellStatus: { padding: '4px 6px', fontSize: 7, width: 60 },
  normal: { color: '#065f46' },
  kritik: { color: '#dc2626', fontFamily: 'Helvetica-Bold' },
  sktYaklasan: { color: '#d97706' },
  tukendi: { color: '#6b7280' },
  ozet: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  ozetKart: { flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: 8 },
  ozetSayi: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0A0F1E' },
  ozetLabel: { fontSize: 7, color: '#6b7280', marginTop: 2 },
  footer: { position: 'absolute', bottom: 24, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', borderTop: '0.5px solid #e5e7eb', paddingTop: 8 },
  footerText: { fontSize: 6, color: '#9ca3af' },
});

interface Props {
  stoklar: Stok[];
}

export function StokSeriNoRaporuDoc({ stoklar }: Props) {
  const toplamAdet = stoklar.reduce((s, k) => s + k.girisAdedi, 0);
  const kalanAdet = stoklar.reduce((s, k) => s + k.kalanAdedi, 0);
  const kritikSayisi = stoklar.filter(s => s.durum === 'Kritik' || s.durum === 'Tükendi').length;
  const sktSayisi = stoklar.filter(s => s.durum === 'SKT Yaklaşıyor').length;

  return (
    <Document title="SENTEK Stok / Seri No Raporu" author="SENTEK Sistemi">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>SENTEK</Text>
            <Text style={styles.logoSub}>Operasyon Takip Sistemi</Text>
            <Text style={styles.gizlilik}>GİZLİ — YETKİLİ PERSONEL</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>STOK / SERİ NO RAPORU</Text>
            <Text style={styles.headerDate}>Tarih: {new Date().toLocaleDateString('tr-TR')}</Text>
            <Text style={styles.headerDate}>Saat: {new Date().toLocaleTimeString('tr-TR')}</Text>
          </View>
        </View>

        <View style={styles.ozet}>
          {[
            { sayi: stoklar.length, label: 'Toplam Ürün Kalemi' },
            { sayi: toplamAdet, label: 'Toplam Giriş Adedi' },
            { sayi: kalanAdet, label: 'Kalan Adet' },
            { sayi: kritikSayisi, label: 'Kritik / Tükenen' },
            { sayi: sktSayisi, label: 'SKT Yaklaşan' },
          ].map(({ sayi, label }) => (
            <View key={label} style={styles.ozetKart}>
              <Text style={styles.ozetSayi}>{sayi}</Text>
              <Text style={styles.ozetLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Ürün Envanteri</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {['Ürün Adı', 'Lot / Seri No', 'Panel Tipi', 'Giriş', 'Kalan', 'SKT', 'Durum'].map(col => (
              <Text key={col} style={styles.cellBold}>{col}</Text>
            ))}
          </View>
          {stoklar.map((s, i) => {
            const statusStyle = s.durum === 'Kritik' || s.durum === 'Tükendi' ? styles.kritik :
              s.durum === 'SKT Yaklaşıyor' ? styles.sktYaklasan : styles.normal;
            return (
              <View key={s.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={styles.cell}>{s.urunAdi}</Text>
                <Text style={[styles.cell, { fontFamily: 'Helvetica-Bold' }]}>{s.lotSeriNo}</Text>
                <Text style={styles.cell}>{s.panelTipi}</Text>
                <Text style={styles.cell}>{s.girisAdedi}</Text>
                <Text style={styles.cell}>{s.kalanAdedi}</Text>
                <Text style={styles.cell}>{s.skt}</Text>
                <Text style={[styles.cellStatus, statusStyle]}>{s.durum}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SENTEK Operasyon Takip Sistemi — {new Date().toLocaleDateString('tr-TR')}</Text>
          <Text style={styles.footerText}>GİZLİ — Yetkisiz dağıtım yasaktır</Text>
        </View>
      </Page>
    </Document>
  );
}
