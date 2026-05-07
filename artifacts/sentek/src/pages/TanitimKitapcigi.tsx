import { useEffect } from 'react';
import sentekLogo from '../assets/sentek-logo.jpg';
import gmgmLogo from '../assets/gmgm-logo.png';
import sentekKit from '../assets/sentek-kit.png';

import imgDashboard from '../../../../attached_assets/brochure/dashboard.jpg';
import imgTestKayitlari from '../../../../attached_assets/brochure/test-kayitlari.jpg';
import imgStok from '../../../../attached_assets/brochure/stok.jpg';
import imgLabSevk from '../../../../attached_assets/brochure/lab-sevk.jpg';
import imgLab from '../../../../attached_assets/brochure/laboratuvar.jpg';
import imgRaporlar from '../../../../attached_assets/brochure/raporlar.jpg';
import imgMobileHome from '../../../../attached_assets/brochure/mobile-home.jpg';
import imgMobileYeniTest from '../../../../attached_assets/brochure/mobile-yeni-test.jpg';
import imgMobileKayit from '../../../../attached_assets/brochure/mobile-kayitlarim.jpg';

const PRINT_CSS = `
@page { size: A4; margin: 0; }
@media print {
  html, body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
  body * { visibility: hidden; }
  .brochure-root, .brochure-root * { visibility: visible; }
  .brochure-root {
    position: absolute; left: 0; top: 0; width: 210mm;
    padding: 0 !important; margin: 0 !important; min-height: auto !important;
    background: #ffffff !important;
  }
  .brochure-toolbar { display: none !important; }
  .brochure-page {
    box-shadow: none !important; margin: 0 !important;
    page-break-after: always; break-after: page;
    page-break-inside: avoid; break-inside: avoid;
  }
  .brochure-page:last-child { page-break-after: auto; break-after: auto; }
  .no-print { display: none !important; }
}
.brochure-root {
  font-family: 'Inter', 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  background: #e9edf3;
  min-height: 100vh;
  padding: 24px 0 80px;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.brochure-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 24px;
  background: #ffffff;
  color: #0f172a;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px -20px rgba(15, 23, 42, 0.35);
  box-sizing: border-box;
}
.brochure-page * { box-sizing: border-box; }
.b-pad { padding: 14mm 14mm 16mm; }
.b-h1 { font-family: 'Space Grotesk','Inter',sans-serif; font-size: 30pt; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; color: #0b1424; }
.b-h2 { font-family: 'Space Grotesk','Inter',sans-serif; font-size: 18pt; font-weight: 700; letter-spacing: -0.01em; color: #0b1424; margin: 0 0 6mm; }
.b-h3 { font-family: 'Space Grotesk','Inter',sans-serif; font-size: 12pt; font-weight: 700; color: #0b1424; }
.b-eyebrow { font-family: 'Space Grotesk','Inter',sans-serif; font-size: 8.5pt; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #0a8aa8; }
.b-lead { font-size: 11pt; line-height: 1.55; color: #1f2a3a; }
.b-body { font-size: 10pt; line-height: 1.6; color: #2b3548; }
.b-small { font-size: 9pt; line-height: 1.5; color: #475569; }
.b-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 8.5pt; color: #334155; letter-spacing: 0.02em; }

.b-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8mm 14mm 0; height: 18mm;
}
.b-header .b-meta { font-size: 8pt; letter-spacing: 0.18em; text-transform: uppercase; color: #64748b; font-weight: 600; }
.b-header .b-logos { display: flex; align-items: center; gap: 10px; }
.b-footer {
  position: absolute; bottom: 8mm; left: 14mm; right: 14mm;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 8pt; color: #94a3b8; letter-spacing: 0.16em; text-transform: uppercase;
  border-top: 1px solid #e2e8f0; padding-top: 4mm;
}
.b-footer strong { color: #0b1424; letter-spacing: 0.18em; font-weight: 700; }

.b-bullets { list-style: none; padding: 0; margin: 0; display: grid; gap: 5mm; }
.b-bullets li { display: grid; grid-template-columns: 22px 1fr; gap: 8px; align-items: start; font-size: 10pt; line-height: 1.55; color: #1f2a3a; }
.b-bullets li::before {
  content: ''; width: 10px; height: 10px; margin-top: 6px; border-radius: 3px;
  background: linear-gradient(135deg, #00D4FF 0%, #0a8aa8 100%);
  box-shadow: 0 1px 4px rgba(0, 212, 255, 0.4);
}
.b-bullets.dark li { color: #cbd5e1; }
.b-bullets.dark li::before { background: linear-gradient(135deg, #00D4FF 0%, #00d4ff80 100%); }

.b-card {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 6mm;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}
.b-card-accent { border-left: 3px solid #00D4FF; }
.b-card h4 { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 11pt; margin: 0 0 3mm; color: #0b1424; font-weight: 700; }

.b-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.b-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5mm; }
.b-grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4mm; }

.b-stat { padding: 5mm 5mm 6mm; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; }
.b-stat .v { font-family: 'Space Grotesk',sans-serif; font-size: 22pt; font-weight: 700; color: #0a8aa8; line-height: 1; letter-spacing: -0.02em; }
.b-stat .l { font-size: 8.5pt; color: #475569; margin-top: 3mm; line-height: 1.4; letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600; }

.b-shot { width: 100%; display: block; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 8px 24px -8px rgba(15, 23, 42, 0.25); }
.b-shot-mobile { width: 100%; max-width: 64mm; display: block; border: 1px solid #1e293b; border-radius: 18px; box-shadow: 0 10px 26px -8px rgba(15, 23, 42, 0.45); background: #0b1424; padding: 4px; }

.b-pill { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: 999px; background: #ecfeff; border: 1px solid #a5f3fc; color: #0e7490; font-size: 8.5pt; font-weight: 600; letter-spacing: 0.04em; }
.b-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: #06b6d4; box-shadow: 0 0 0 3px rgba(6,182,212,0.18); }

.b-divider { height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); margin: 6mm 0; }

.b-toolbar {
  position: sticky; top: 12px; z-index: 50;
  width: 210mm; margin: 0 auto 16px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-radius: 12px;
  background: rgba(11, 20, 36, 0.94); backdrop-filter: blur(12px);
  color: #e2e8f0; box-shadow: 0 8px 28px -8px rgba(11,20,36,0.5);
}
.b-toolbar .title { font-family: 'Space Grotesk',sans-serif; font-weight: 700; letter-spacing: 0.04em; font-size: 13px; }
.b-toolbar .actions { display: flex; gap: 8px; }
.b-toolbar button {
  padding: 8px 14px; border-radius: 8px; font-family: 'Inter',sans-serif; font-weight: 600; font-size: 12px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); color: #e2e8f0; cursor: pointer; transition: 0.15s;
}
.b-toolbar button.primary { background: linear-gradient(135deg, #00D4FF 0%, #0a8aa8 100%); color: #001018; border: none; }
.b-toolbar button:hover { transform: translateY(-1px); }

/* Cover */
.cover { background: radial-gradient(120% 90% at 80% 0%, #0a2440 0%, #050b18 60%, #02060f 100%); color: #e2e8f0; padding: 0; }
.cover-inner { padding: 22mm 18mm 18mm; height: 297mm; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
.cover-grid-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(0,212,255,0.20), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(99,102,241,0.18), transparent 50%),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 28px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 28px);
}
.cover-top { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 2; }
.cover-logo-block { display: flex; flex-direction: column; gap: 8px; }
.cover-logo-block .badge { font-size: 9pt; letter-spacing: 0.32em; text-transform: uppercase; color: #67e8f9; font-weight: 700; }
.cover-logo-block .sub { font-size: 9pt; color: #94a3b8; letter-spacing: 0.18em; text-transform: uppercase; }
.cover-mid { position: relative; z-index: 2; }
.cover-mid .b-eyebrow { color: #67e8f9; font-size: 9.5pt; }
.cover-mid h1 {
  font-family: 'Space Grotesk',sans-serif; font-size: 48pt; line-height: 1.0; font-weight: 700;
  letter-spacing: -0.025em; color: #ffffff; margin: 6mm 0 4mm;
}
.cover-mid .tag {
  font-size: 14pt; line-height: 1.45; color: #cbd5e1; max-width: 150mm; font-weight: 400;
}
.cover-bottom { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: flex-end; }
.cover-bottom .meta { font-size: 9pt; color: #94a3b8; letter-spacing: 0.18em; text-transform: uppercase; line-height: 1.8; }
.cover-bottom .meta strong { color: #e2e8f0; }
.cover-stripe { position: absolute; left: 0; right: 0; bottom: 0; height: 6mm; background: linear-gradient(90deg, #00D4FF 0%, #0a8aa8 50%, #6366f1 100%); }
`;

function PageHeader({ chapter, title }: { chapter: string; title: string }) {
  return (
    <div className="b-header">
      <div>
        <div className="b-meta">{chapter}</div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10pt', color: '#0b1424', fontWeight: 600, marginTop: 2 }}>{title}</div>
      </div>
      <div className="b-logos">
        <img src={gmgmLogo} alt="GMGM" style={{ height: 32, width: 32, objectFit: 'contain' }} />
        <div style={{ height: 24, width: 1, background: '#cbd5e1' }} />
        <img src={sentekLogo} alt="SENTEK" style={{ height: 32, width: 32, objectFit: 'contain', borderRadius: 6 }} />
      </div>
    </div>
  );
}

function PageFooter({ no, label }: { no: number; label: string }) {
  return (
    <div className="b-footer">
      <span><strong>SENTEK</strong> · Saha Entegre Narkotik Test Sistemi</span>
      <span>{label} · Sayfa {no} / 13</span>
    </div>
  );
}

export default function TanitimKitapcigi() {
  useEffect(() => {
    document.title = 'SENTEK · Tanıtım Kitapçığı';
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="brochure-root">
        <div className="b-toolbar brochure-toolbar no-print">
          <div className="title">SENTEK · Tanıtım Kitapçığı · 13 sayfa A4</div>
          <div className="actions">
            <button onClick={() => window.print()} className="primary">PDF olarak indir</button>
            <button onClick={() => window.print()}>Yazdır</button>
          </div>
        </div>

        {/* ───────── 1 · KAPAK ───────── */}
        <div className="brochure-page cover">
          <div className="cover-inner">
            <div className="cover-grid-bg" />
            <div className="cover-top">
              <div className="cover-logo-block">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={gmgmLogo} alt="GMGM" style={{ height: 64, width: 64, objectFit: 'contain' }} />
                  <div>
                    <div className="badge">T.C. Ticaret Bakanlığı</div>
                    <div className="sub" style={{ marginTop: 4 }}>Gümrükler Muhafaza Genel Müdürlüğü</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={sentekLogo} alt="SENTEK" style={{ height: 56, width: 56, objectFit: 'contain', borderRadius: 12 }} />
              </div>
            </div>

            <div className="cover-mid">
              <div className="b-eyebrow">Tanıtım Kitapçığı · 2026 · v1.0</div>
              <h1>SENTEK</h1>
              <div className="tag">
                Saha Entegre Narkotik Test Sistemi — gümrük muhafaza ekipleri için uçtan uca dijital
                operasyon, izlenebilirlik ve karar destek platformu.
              </div>
              <div style={{ marginTop: '12mm', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="b-pill" style={{ background: 'rgba(6,182,212,0.12)', borderColor: 'rgba(6,182,212,0.4)', color: '#67e8f9' }}><span className="dot" />Saha · Mobil PWA</span>
                <span className="b-pill" style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}><span className="dot" style={{ background: '#818cf8' }} />Komuta Merkezi</span>
                <span className="b-pill" style={{ background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.4)', color: '#d8b4fe' }}><span className="dot" style={{ background: '#a855f7' }} />Laboratuvar Akışı</span>
                <span className="b-pill" style={{ background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.4)', color: '#86efac' }}><span className="dot" style={{ background: '#22c55e' }} />Zincirleme İz</span>
              </div>
            </div>

            <div className="cover-bottom">
              <div className="meta">
                <div><strong>Hazırlayan</strong> · SENTEK Proje Ofisi</div>
                <div><strong>Sürüm</strong> · MVP 1.0 · Mayıs 2026</div>
                <div><strong>Sınıflandırma</strong> · Kurum İçi · Tanıtım</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="meta"><strong>Belge No</strong> · SNT-BRC-2026-001</div>
                <div className="meta"><strong>Tarih</strong> · 07.05.2026</div>
              </div>
            </div>

            <div className="cover-stripe" />
          </div>
        </div>

        {/* ───────── 2 · OPERASYONEL İHTİYAÇ ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="01 · Bağlam" title="Operasyonel İhtiyaç" />
          <div className="b-pad">
            <div className="b-eyebrow">Neden SENTEK</div>
            <h2 className="b-h1" style={{ marginTop: 6, marginBottom: '6mm', fontSize: '26pt' }}>
              Saha bulguları artık dakikalar içinde komuta merkezine.
            </h2>
            <p className="b-lead" style={{ maxWidth: '170mm' }}>
              Sınır kapıları, liman, havalimanı ve karayolu kontrol noktalarında elde edilen şüpheli
              materyal bulguları geleneksel akışta kâğıt formlar, fotoğraf paylaşımları ve manuel
              raporlamalarla yönetilmektedir. SENTEK; bu süreci tek bir saha-merkez-laboratuvar
              ekosistemine bağlar; doğrudan madde testi her saha operasyonu için tek dijital akışa indirgenir.
            </p>

            <div className="b-divider" />

            <div className="b-grid-3">
              <div className="b-stat">
                <div className="v">~%63</div>
                <div className="l">Kâğıt Formdan Tasarruf</div>
              </div>
              <div className="b-stat">
                <div className="v">&lt; 90 sn</div>
                <div className="l">Saha → Merkez Bildirim</div>
              </div>
              <div className="b-stat">
                <div className="v">100%</div>
                <div className="l">Kit Seri No İzlenebilirlik</div>
              </div>
            </div>

            <div style={{ marginTop: '8mm' }} className="b-grid-2">
              <div className="b-card b-card-accent">
                <h4>Mevcut Akıştaki Sorunlar</h4>
                <ul className="b-bullets">
                  <li>Saha bulgusu fotoğraf + kâğıt forma bağlı, dijital eşleşme zayıf.</li>
                  <li>Kit seri numarası, lot ve son kullanma tarihi takipsiz.</li>
                  <li>Pozitif bulgudan lab sevkine kadar geçen süre öngörülemiyor.</li>
                  <li>Bölge ↔ merkez raporlama döngüsü gecikiyor; karar desteği zayıf.</li>
                </ul>
              </div>
              <div className="b-card b-card-accent">
                <h4>SENTEK ile Hedeflenen</h4>
                <ul className="b-bullets">
                  <li>Mobil PWA ile saha kayıt süresi tek ekran, tek akış.</li>
                  <li>QR ile kit doğrulama; geçersiz / SKT geçmiş kitlere otomatik uyarı.</li>
                  <li>Komuta merkezinde anlık harita, KPI, pozitif bildirim akışı.</li>
                  <li>Lab sevk durum makinesi + PDF raporlama ile uçtan uca delil zinciri.</li>
                </ul>
              </div>
            </div>
          </div>
          <PageFooter no={2} label="Bağlam" />
        </div>

        {/* ───────── 3 · SENTEK ÇÖZÜMÜ ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="02 · Çözüm" title="SENTEK Mimarisi" />
          <div className="b-pad">
            <div className="b-eyebrow">Tek Platform · Üç Katman</div>
            <h2 className="b-h1" style={{ marginTop: 6, marginBottom: '6mm', fontSize: '26pt' }}>
              Saha · Merkez · Laboratuvar tek dijital omurgada.
            </h2>
            <p className="b-lead">
              SENTEK üç ana kullanıcı katmanı için tasarlanmış birleşik bir operasyon platformudur.
              Her katman aynı veri zincirine yazar ve okur; hiçbir kayıt sistem dışına çıkmaz.
            </p>

            <div className="b-divider" />

            <div className="b-grid-3">
              <div className="b-card">
                <div className="b-eyebrow" style={{ color: '#0a8aa8' }}>Katman 1</div>
                <h4 style={{ marginTop: 4 }}>Saha · Mobil PWA</h4>
                <p className="b-small" style={{ marginTop: 2 }}>
                  Saha personeli için telefon/tablet üzerinden çalışan PWA. QR ile kit eşleştirme,
                  kompozit fotoğraflama, anlık AI ön analizi ve PDF rapor üretimi.
                </p>
              </div>
              <div className="b-card">
                <div className="b-eyebrow" style={{ color: '#0a8aa8' }}>Katman 2</div>
                <h4 style={{ marginTop: 4 }}>Komuta Kontrol Merkezi</h4>
                <p className="b-small" style={{ marginTop: 2 }}>
                  Merkez ve bölge yetkilileri için web paneli. Türkiye haritası, KPI'lar, canlı saha
                  akışı, kritik stok izleme ve analitik raporlar tek ekranda.
                </p>
              </div>
              <div className="b-card">
                <div className="b-eyebrow" style={{ color: '#0a8aa8' }}>Katman 3</div>
                <h4 style={{ marginTop: 4 }}>Laboratuvar İş Akışı</h4>
                <p className="b-small" style={{ marginTop: 2 }}>
                  Lab kullanıcıları için numune teslim, analiz, dosya kapatma ve rapor yükleme
                  süreçlerini sevk durum makinesiyle yöneten arayüz.
                </p>
              </div>
            </div>

            <div className="b-divider" />

            <h3 className="b-h2" style={{ fontSize: '14pt' }}>Modüller</h3>
            <div className="b-grid-4">
              {[
                ['Komuta Kontrol', 'Harita + KPI + akış'],
                ['Test Kayıtları', 'Filtre, arama, detay'],
                ['Stok / Seri No', 'Lot, SKT, kritik uyarı'],
                ['Lab Sevk Takibi', '8 durumlu makine'],
                ['Laboratuvar', 'Bekleyen / Aktif / Bitti'],
                ['Raporlar & Analitik', 'PDF + grafik analiz'],
                ['Mobil Saha Modu', '6 adımlı test akışı'],
                ['Kullanıcı & Rol', '5 rol, ekran yetkisi'],
              ].map(([t, s]) => (
                <div key={t} className="b-card" style={{ padding: '4mm' }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '10pt', color: '#0b1424' }}>{t}</div>
                  <div className="b-small" style={{ marginTop: 1 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
          <PageFooter no={3} label="Çözüm" />
        </div>

        {/* ───────── 4 · KOMUTA KONTROL MERKEZİ ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="03 · Web Paneli" title="Komuta Kontrol Merkezi" />
          <div className="b-pad">
            <div className="b-eyebrow">Tek Ekran · Tüm Türkiye</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Tüm operasyon, tek görsel komuta merkezinden yönetilir.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Eski Dashboard, Canlı Operasyon ve Harita ekranları tek bir taktiksel komuta arayüzünde
              birleştirilmiştir. Stadia karanlık tema haritasında 33 lokasyon canlı izlenir; KPI'lar,
              saha akışı, kritik stok ve trend grafikleri tek görsel pencerededir.
            </p>

            <img src={imgDashboard} alt="Komuta Kontrol Merkezi" className="b-shot" />

            <div className="b-grid-3" style={{ marginTop: '6mm' }}>
              <div className="b-card">
                <h4>Taktiksel Harita</h4>
                <p className="b-small">33 lokasyon, sınır kapısı / liman / havalimanı / karayolu filtreleri, anlık pozitif yoğunluk göstergesi.</p>
              </div>
              <div className="b-card">
                <h4>KPI Şeridi</h4>
                <p className="b-small">Toplam test, pozitif sayısı, lab sevk, kritik stok, aktif sevk ve bugünkü pozitif — count-up animasyonlu.</p>
              </div>
              <div className="b-card">
                <h4>Saha Akışı</h4>
                <p className="b-small">5 saniyede bir yenilenen canlı bildirim akışı; pozitif tespit, lab sevk başlatma ve kritik stok uyarıları.</p>
              </div>
            </div>
          </div>
          <PageFooter no={4} label="Komuta" />
        </div>

        {/* ───────── 5 · MOBİL SAHA MODU ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="04 · Mobil PWA" title="Saha Modu" />
          <div className="b-pad">
            <div className="b-eyebrow">Tablet & Telefon · Çevrimdışı Hazır</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Saha personeli için saniyeler içinde test başlatma akışı.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Saha personeli telefon veya tablet üzerinden SENTEK'e giriş yaptığında doğrudan saha
              moduna yönlendirilir. Yeni Test akışı 6 adımdan oluşur: operasyon bilgisi → numune →
              açıklama → kit & analiz → sonuç onayı → tamamla.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5mm', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'center' }}>
                <img src={imgMobileHome} alt="Saha Ana Ekran" className="b-shot-mobile" style={{ margin: '0 auto' }} />
                <div className="b-small" style={{ marginTop: '3mm', fontWeight: 600 }}>Ana Ekran</div>
                <div className="b-small">KPI + son kayıtlar + hızlı erişim</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img src={imgMobileYeniTest} alt="Yeni Test" className="b-shot-mobile" style={{ margin: '0 auto' }} />
                <div className="b-small" style={{ marginTop: '3mm', fontWeight: 600 }}>Yeni Test — Adım 1/6</div>
                <div className="b-small">Operasyon profil bilgisi otomatik dolar</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img src={imgMobileKayit} alt="Kayıtlarım" className="b-shot-mobile" style={{ margin: '0 auto' }} />
                <div className="b-small" style={{ marginTop: '3mm', fontWeight: 600 }}>Kayıtlarım</div>
                <div className="b-small">Filtreli geçmiş test listesi</div>
              </div>
            </div>

            <div className="b-divider" />

            <div className="b-grid-2">
              <div className="b-card b-card-accent">
                <h4>PWA Avantajları</h4>
                <ul className="b-bullets">
                  <li>Uygulama mağazası gerektirmez; kurum cihazlarına anında dağıtım.</li>
                  <li>Çevrimdışı hazır; bağlantı kurulduğunda senkronizasyon.</li>
                  <li>Kamera, QR okuyucu, dosya erişimi tek arayüzde.</li>
                </ul>
              </div>
              <div className="b-card b-card-accent">
                <h4>Saha Personeli İçin Tasarım</h4>
                <ul className="b-bullets">
                  <li>Büyük dokunma alanları, yüksek kontrast koyu tema.</li>
                  <li>Tek elle kullanılabilir alt navigasyon barı.</li>
                  <li>Bildirim sayacı, çevrimiçi/çevrimdışı durum göstergesi.</li>
                </ul>
              </div>
            </div>
          </div>
          <PageFooter no={5} label="Mobil" />
        </div>

        {/* ───────── 6 · TEST + ANALİZ AKIŞI ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="05 · Test Akışı" title="QR · Kompozit Fotoğraf · AI Analizi" />
          <div className="b-pad">
            <div className="b-eyebrow">Otomatik Akış · Tek Açma</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Kit kamerayı bir kez açar, sistem geri kalanını yapar.</h2>

            <div className="b-grid-2" style={{ alignItems: 'center', marginTop: '4mm' }}>
              <div>
                <p className="b-body">
                  Saha personeli kit & analiz adımında kamerayı açar açmaz ZXing tabanlı QR çözücü
                  kit kimliğini eşler. Eşleşme tamamlandığında otomatik olarak sistem:
                </p>
                <ul className="b-bullets" style={{ marginTop: '4mm' }}>
                  <li>Stok kaydında lot + SKT + paneli doğrular.</li>
                  <li>Kit görseli üzerine her panel için C/T çizgilerini canvas üzerinde çizer.</li>
                  <li>AI öneri katmanı sonucu pozitif/negatif/geçersiz olarak çıkarır.</li>
                  <li>Operatör isterse 10+ karakter gerekçeyle override edebilir.</li>
                  <li>Kayıt sonrası PDF rapor otomatik indirilir; lab sevk seçeneği sunulur.</li>
                </ul>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img src={sentekKit} alt="SENTEK Kit" style={{ width: '100%', maxWidth: '85mm', borderRadius: 12, border: '1px solid #cbd5e1', boxShadow: '0 8px 24px -8px rgba(15,23,42,0.3)' }} />
                <div className="b-small" style={{ marginTop: '3mm', fontWeight: 600 }}>SENTEK Multi-Panel Kit · Resmi numune fotoğrafı</div>
              </div>
            </div>

            <div className="b-divider" />

            <div className="b-grid-3">
              <div className="b-card"><h4>1 · QR Eşleşme</h4><p className="b-small">Kit seri no okunur, stok ile cross-check yapılır.</p></div>
              <div className="b-card"><h4>2 · Kompozit Görsel</h4><p className="b-small">Panel paterni canvas üzerinde çizilir, delil görseli oluşur.</p></div>
              <div className="b-card"><h4>3 · AI + Onay</h4><p className="b-small">Öneri sunulur, override gerekçesi opsiyoneldir; PDF üretilir.</p></div>
            </div>
          </div>
          <PageFooter no={6} label="Test" />
        </div>

        {/* ───────── 7 · TEST KAYITLARI ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="06 · Veri" title="Test Kayıtları" />
          <div className="b-pad">
            <div className="b-eyebrow">Filtre · Arama · Detay</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Tüm saha kayıtları tek tablo, tek tıkta detay.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Test kayıtları ekranı; operasyon numarası, lokasyon, kit seri no veya personel ile arama
              yapma, sonuç ve lokasyon filtreleri, güven skoru göstergesi ve detay sayfası bağlantısı sunar.
            </p>
            <img src={imgTestKayitlari} alt="Test Kayıtları" className="b-shot" />
            <div className="b-grid-4" style={{ marginTop: '6mm' }}>
              <div className="b-stat"><div className="v">62</div><div className="l">Toplam Kayıt</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#dc2626' }}>32</div><div className="l">Pozitif</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#16a34a' }}>23</div><div className="l">Negatif</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#d97706' }}>7</div><div className="l">Geçersiz</div></div>
            </div>
          </div>
          <PageFooter no={7} label="Test Kayıtları" />
        </div>

        {/* ───────── 8 · STOK / SERİ NO ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="07 · Lojistik" title="Stok & Seri Numarası Yönetimi" />
          <div className="b-pad">
            <div className="b-eyebrow">Lot · SKT · Kritik Uyarı</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Her kit takip edilebilir, hiçbir SKT atlanmaz.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Stok modülü ürün, lot/seri no, kalan miktar, kullanım yüzdesi, durum (Normal / Kritik /
              Tükendi / SKT Yaklaşıyor) ve son kullanma tarihi alanlarını izler. Kritik seviyeye düşen
              ürünler için merkez panelinde uyarı kartı oluşur.
            </p>
            <img src={imgStok} alt="Stok / Seri No" className="b-shot" />
            <div className="b-grid-4" style={{ marginTop: '6mm' }}>
              <div className="b-stat"><div className="v">76.300</div><div className="l">Toplam Stok</div></div>
              <div className="b-stat"><div className="v">52.247</div><div className="l">Kalan</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#dc2626' }}>10</div><div className="l">Kritik Ürün</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#d97706' }}>2</div><div className="l">SKT Yaklaşıyor</div></div>
            </div>
          </div>
          <PageFooter no={8} label="Stok" />
        </div>

        {/* ───────── 9 · LAB SEVK TAKİBİ ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="08 · Lab Lojistiği" title="Lab Sevk Takibi" />
          <div className="b-pad">
            <div className="b-eyebrow">8 Durumlu İş Akışı</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Pozitif bulgu sahadan laboratuvara, durumdan duruma.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Lab Sevk Takibi her sevkin Sevk Kaydı Oluşturuldu → Numune Paketlendi → Laboratuvara
              Yolda → Laboratuvara Ulaştı → Analiz Sırasında → Rapor Yüklendi → Dosya Kapatıldı /
              Teslim Alındı yaşam döngüsünü kart bazlı gösterir; öncelik (Normal / Yüksek) işaretlenir.
            </p>
            <img src={imgLabSevk} alt="Lab Sevk Takibi" className="b-shot" />
            <div className="b-grid-3" style={{ marginTop: '6mm' }}>
              <div className="b-stat"><div className="v" style={{ color: '#d97706' }}>2</div><div className="l">Yolda</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#06b6d4' }}>2</div><div className="l">Analiz Sırasında</div></div>
              <div className="b-stat"><div className="v" style={{ color: '#16a34a' }}>2</div><div className="l">Tamamlanan</div></div>
            </div>
          </div>
          <PageFooter no={9} label="Lab Sevk" />
        </div>

        {/* ───────── 10 · LABORATUVAR ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="09 · Laboratuvar" title="Numune İş Akışı" />
          <div className="b-pad">
            <div className="b-eyebrow">Bekleyen · Aktif · Tamamlanan</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Lab kullanıcıları için sade ve odaklı bir analiz panosu.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Lab kullanıcıları kendilerine sevk edilen numuneleri tek bir kart panosunda görür;
              teslim alma, analiz başlatma, dosya kapatma ve rapor yükleme adımlarını tek arayüzden
              ilerletir. Operasyon ile sevk arasındaki bağ tek tıkla görüntülenir.
            </p>
            <img src={imgLab} alt="Laboratuvar" className="b-shot" />
          </div>
          <PageFooter no={10} label="Laboratuvar" />
        </div>

        {/* ───────── 11 · RAPORLAR & ANALİTİK ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="10 · Karar Desteği" title="Raporlar & Analitik" />
          <div className="b-pad">
            <div className="b-eyebrow">PDF · Filtre · Çoklu Boyut</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Operasyonel veriden stratejik içgörüye.</h2>
            <p className="b-body" style={{ marginBottom: '5mm' }}>
              Raporlar modülü test, lab sevk, stok / SKT, lokasyon ve personel boyutlarında çoklu
              filtre ile analitik sunar. Tarih aralığı seçimi, sonuç & lokasyon kırılımı ve PDF rapor
              dışa aktarımı entegredir.
            </p>
            <img src={imgRaporlar} alt="Raporlar & Analitik" className="b-shot" />
          </div>
          <PageFooter no={11} label="Raporlar" />
        </div>

        {/* ───────── 12 · İZLENEBİLİRLİK ZİNCİRİ ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="11 · Yönetişim" title="Zincirleme İzlenebilirlik & Kurumsal Kazanım" />
          <div className="b-pad">
            <div className="b-eyebrow">Delil Zinciri</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>Her kayıt; test → fotoğraf → sonuç → seri no → stok → sevk → analiz zincirine bağlıdır.</h2>

            <div className="b-grid-2" style={{ marginTop: '4mm' }}>
              <div className="b-card b-card-accent">
                <h4>Operasyonel Kazanımlar</h4>
                <ul className="b-bullets">
                  <li>Saha kayıt süresinde dakikadan saniyelere geçiş.</li>
                  <li>Pozitif bulgudan lab sevkine kadar ölçülebilir SLA.</li>
                  <li>SKT geçmiş veya geçersiz kit kullanımının önlenmesi.</li>
                  <li>Kâğıt form / fotoğraf paylaşımı süreçlerinin sonlandırılması.</li>
                </ul>
              </div>
              <div className="b-card b-card-accent">
                <h4>Yönetişim & Denetim</h4>
                <ul className="b-bullets">
                  <li>Tüm kayıtlar PDF + dijital kayıtla tek delil zincirinde.</li>
                  <li>Bölge / merkez / lab arasında gerçek zamanlı görünürlük.</li>
                  <li>Rol bazlı ekran yetkisi; kişisel veri açığa çıkmaz.</li>
                  <li>Standartlaştırılmış raporlama; istatistiki güvenilirlik.</li>
                </ul>
              </div>
            </div>

            <div className="b-divider" />

            <div className="b-grid-4">
              <div className="b-stat"><div className="v">5</div><div className="l">Tanımlı Rol</div></div>
              <div className="b-stat"><div className="v">8</div><div className="l">Sevk Durumu</div></div>
              <div className="b-stat"><div className="v">33</div><div className="l">İzlenen Lokasyon</div></div>
              <div className="b-stat"><div className="v">100%</div><div className="l">Dijital Delil Zinciri</div></div>
            </div>
          </div>
          <PageFooter no={12} label="Yönetişim" />
        </div>

        {/* ───────── 13 · DEMO AKIŞI & KAPANIŞ ───────── */}
        <div className="brochure-page">
          <PageHeader chapter="12 · Demo & İletişim" title="Sahaya Hazır" />
          <div className="b-pad">
            <div className="b-eyebrow">Demo Akışı</div>
            <h2 className="b-h2" style={{ fontSize: '22pt', marginTop: 6 }}>5 dakikada uçtan uca SENTEK demosu.</h2>

            <ol style={{ paddingLeft: 18, fontSize: '10.5pt', lineHeight: 1.7, color: '#1f2a3a' }}>
              <li><strong>Saha</strong> · Mobil PWA üzerinden Yeni Test başlatılır, QR ile kit eşleşir, AI öneri ile sonuç kaydedilir, PDF rapor indirilir.</li>
              <li><strong>Komuta</strong> · Pozitif bulgu Türkiye haritasında anlık görünür, KPI'lar ve saha akışı güncellenir.</li>
              <li><strong>Lab Sevk</strong> · Pozitif kayıt için sevk oluşturulur; kart durum makinesi izlenir.</li>
              <li><strong>Laboratuvar</strong> · Lab kullanıcısı numune teslim alır, analizi tamamlar, dosyayı kapatır.</li>
              <li><strong>Raporlar</strong> · Tarih ve lokasyon kırılımında analitik gösterge ve PDF rapor üretilir.</li>
            </ol>

            <div className="b-divider" />

            <div className="b-grid-2">
              <div className="b-card">
                <h4>Sahip Olunan Yetenekler</h4>
                <ul className="b-bullets">
                  <li>React 18 · Vite · TypeScript · Tailwind v4</li>
                  <li>Dexie.js (IndexedDB) ile offline-first veri katmanı</li>
                  <li>@react-pdf/renderer ile dinamik PDF üretimi</li>
                  <li>@zxing/browser tabanlı QR akışı</li>
                  <li>Leaflet · Stadia karanlık tema taktiksel harita</li>
                  <li>framer-motion · 2026 premium karanlık tasarım sistemi</li>
                </ul>
              </div>
              <div className="b-card" style={{ background: 'linear-gradient(180deg, #0b1424 0%, #0a2440 100%)', color: '#e2e8f0', borderColor: '#0a2440' }}>
                <h4 style={{ color: '#67e8f9' }}>İletişim</h4>
                <p className="b-small" style={{ color: '#cbd5e1' }}>
                  SENTEK Proje Ofisi
                </p>
                <p className="b-mono" style={{ color: '#94a3b8', marginTop: 6 }}>
                  proje@sentek.local · +90 (XXX) XXX XX XX
                </p>
                <div style={{ marginTop: '6mm', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="b-pill" style={{ background: 'rgba(6,182,212,0.16)', borderColor: 'rgba(6,182,212,0.4)', color: '#67e8f9' }}><span className="dot" />MVP 1.0</span>
                  <span className="b-pill" style={{ background: 'rgba(99,102,241,0.16)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}><span className="dot" style={{ background: '#818cf8' }} />Pilot Hazır</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10mm', textAlign: 'center', paddingTop: '6mm', borderTop: '1px solid #e2e8f0' }}>
              <div className="b-eyebrow">Teşekkürler</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '20pt', fontWeight: 700, color: '#0b1424', marginTop: 4, letterSpacing: '-0.02em' }}>
                Sınırda dijital, merkezde görünür, sahada güçlü.
              </div>
              <div className="b-small" style={{ marginTop: 4 }}>SENTEK · Saha Entegre Narkotik Test Sistemi · 2026</div>
            </div>
          </div>
          <PageFooter no={13} label="Kapanış" />
        </div>
      </div>
    </>
  );
}
