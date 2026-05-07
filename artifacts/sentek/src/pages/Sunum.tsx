import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import sentekLogo from '../assets/sentek-logo.jpg';
import gmgmLogo from '../assets/gmgm-logo.png';
import sentekKit from '../assets/sentek-kit.png';

import imgDashboard from '../../../../attached_assets/brochure/dashboard.jpg';
import imgTestKayitlari from '../../../../attached_assets/brochure/test-kayitlari.jpg';
import imgStok from '../../../../attached_assets/brochure/stok.jpg';
import imgLabSevk from '../../../../attached_assets/brochure/lab-sevk.jpg';
import imgRaporlar from '../../../../attached_assets/brochure/raporlar.jpg';
import imgMobileHome from '../../../../attached_assets/brochure/mobile-home.jpg';
import imgMobileYeniTest from '../../../../attached_assets/brochure/mobile-yeni-test.jpg';

const CyanDot = () => (
  <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: 'linear-gradient(135deg,#00D4FF,#0a8aa8)', boxShadow: '0 0 6px rgba(0,212,255,.55)', marginRight: 12, marginTop: 5, flexShrink: 0 }} />
);

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 0, fontSize: '1.1rem', lineHeight: 1.55, color: '#cbd5e1', margin: '0.45em 0' }}>
      <CyanDot /><span>{children}</span>
    </li>
  );
}

function Stat({ value, label, color = '#00D4FF' }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '1.6rem 1.4rem 1.8rem', textAlign: 'center', flex: 1 }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.8rem', fontWeight: 700, color, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function Screen({ src, alt, radius = 10 }: { src: string; alt: string; radius?: number }) {
  return (
    <img
      src={src} alt={alt}
      style={{ width: '100%', borderRadius: radius, border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7)', display: 'block' }}
    />
  );
}

function MobileScreen({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ background: '#0b1424', borderRadius: 22, border: '1px solid rgba(255,255,255,0.12)', padding: 5, boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7)', maxWidth: 180, flexShrink: 0 }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: 18, display: 'block' }} />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#00D4FF', marginBottom: '0.8rem' }}>{children}</div>;
}

function H1({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(2.2rem,5vw,3.6rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 0.6rem', ...style }}>{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 1.2rem' }}>{children}</h2>;
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.6, color: '#94a3b8', margin: '0 0 1.2rem', maxWidth: 680 }}>{children}</p>;
}

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '1.4rem 1.6rem', backdropFilter: 'blur(8px)', ...style }}>
      {children}
    </div>
  );
}

const slides = [
  /* 1 — KAPAK */
  {
    id: 'kapak',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '1.6rem', padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={gmgmLogo} alt="GMGM" style={{ height: 72, width: 72, objectFit: 'contain' }} />
          <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.15)' }} />
          <img src={sentekLogo} alt="SENTEK" style={{ height: 72, width: 72, objectFit: 'contain', borderRadius: 14 }} />
        </div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#00D4FF', marginBottom: '0.8rem' }}>T.C. Gümrükler Muhafaza Genel Müdürlüğü</div>
          <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(4rem,10vw,7rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, margin: 0 }}>SENTEK</h1>
          <div style={{ fontSize: 'clamp(1rem,2.5vw,1.4rem)', color: '#94a3b8', marginTop: '0.6rem', fontWeight: 400 }}>Saha Entegre Narkotik Test Sistemi</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          {['Saha · Mobil PWA', 'Komuta Merkezi', 'Laboratuvar Akışı', 'Zincirleme İz'].map(t => (
            <span key={t} style={{ background: 'rgba(0,212,255,0.10)', border: '1px solid rgba(0,212,255,0.30)', borderRadius: 999, padding: '5px 14px', fontSize: '0.82rem', color: '#67e8f9', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#475569', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 8 }}>MVP 1.0 · Mayıs 2026</div>
      </div>
    ),
  },

  /* 2 — SORUN */
  {
    id: 'sorun',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '3.5rem 5rem' }}>
        <Eyebrow>01 · Sorun</Eyebrow>
        <H1>Saha verisi neden hâlâ kâğıtta?</H1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          <GlassCard style={{ borderLeft: '3px solid #ef4444' }}>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fca5a5', marginBottom: '0.8rem' }}>Mevcut Akıştaki Sorunlar</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Bullet>Kâğıt form + fotoğraf paylaşımı; kayıt süresi yüksek</Bullet>
              <Bullet>Kit seri no / lot / SKT takipsiz</Bullet>
              <Bullet>Pozitif bulgudan lab sevkine geçiş öngörülemiyor</Bullet>
              <Bullet>Bölge–merkez raporlama döngüsü gecikiyor</Bullet>
            </ul>
          </GlassCard>
          <GlassCard style={{ borderLeft: '3px solid #00D4FF' }}>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#67e8f9', marginBottom: '0.8rem' }}>SENTEK ile Hedeflenen</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Bullet>Mobil akış — kayıt dakikadan saniyelere</Bullet>
              <Bullet>QR kit doğrulama + geçersiz/SKT geçmiş uyarısı</Bullet>
              <Bullet>Komutada anlık harita, KPI ve pozitif akışı</Bullet>
              <Bullet>PDF + dijital delil zinciriyle uçtan uca sevk</Bullet>
            </ul>
          </GlassCard>
        </div>
      </div>
    ),
  },

  /* 3 — PLATFORM */
  {
    id: 'platform',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '3.5rem 5rem' }}>
        <Eyebrow>02 · Platform</Eyebrow>
        <H1>Tek omurga, üç katman.</H1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '1.5rem' }}>
          {[
            { n: '01', title: 'Saha · Mobil PWA', desc: 'Saha personeline özel telefon/tablet arayüzü. QR kit eşleme, AI analiz, PDF rapor — uygulama mağazası gerektirmez.', c: '#00D4FF' },
            { n: '02', title: 'Komuta Merkezi', desc: 'Merkez ve bölge yetkilileri için web paneli. Taktiksel harita, KPI şeridi, canlı saha akışı, kritik stok izleme.', c: '#818cf8' },
            { n: '03', title: 'Laboratuvar', desc: 'Lab kullanıcıları için numune teslim alma, analiz ve dosya kapatma iş akışı. 8 durumlu sevk takip makinesi.', c: '#a78bfa' },
          ].map(({ n, title, desc, c }) => (
            <GlassCard key={n} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2.2rem', fontWeight: 700, color: c, lineHeight: 1, letterSpacing: '-0.04em' }}>{n}</div>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{title}</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.55 }}>{desc}</div>
            </GlassCard>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginTop: '1.6rem' }}>
          {['Test Kayıtları', 'Stok / Seri No', 'Lab Sevk Takibi', 'Raporlar & Analitik', '5 Rol · Ekran Yetkisi', 'Offline Hazır'].map(m => (
            <span key={m} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '4px 12px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{m}</span>
          ))}
        </div>
      </div>
    ),
  },

  /* 4 — KOMUTA */
  {
    id: 'komuta',
    content: (
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', height: '100%', padding: '3rem 4rem' }}>
        <div style={{ flex: '0 0 55%' }}>
          <Screen src={imgDashboard} alt="Komuta Kontrol" />
        </div>
        <div style={{ flex: 1 }}>
          <Eyebrow>03 · Komuta Kontrol</Eyebrow>
          <H2>Tüm Türkiye,<br />tek ekranda.</H2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>33 lokasyon canlı taktiksel harita</Bullet>
            <Bullet>6 KPI — anlık sayaç animasyonu</Bullet>
            <Bullet>5 saniyede bir yenilenen saha akışı</Bullet>
            <Bullet>Kritik stok uyarıları sağ panelde</Bullet>
            <Bullet>Alan grafiği, donut, izlenebilirlik zinciri</Bullet>
          </ul>
        </div>
      </div>
    ),
  },

  /* 5 — MOBİL */
  {
    id: 'mobil',
    content: (
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', height: '100%', padding: '3rem 4rem' }}>
        <div style={{ flex: 1 }}>
          <Eyebrow>04 · Mobil Saha</Eyebrow>
          <H2>Saha personeli için tasarlandı.</H2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '1.4rem' }}>
            <Bullet>Yeni test — 6 adım, tek akış</Bullet>
            <Bullet>Operasyon profili otomatik dolar</Bullet>
            <Bullet>Büyük dokunma alanları, yüksek kontrast</Bullet>
            <Bullet>Çevrimdışı hazır; bağlanınca senkronizasyon</Bullet>
            <Bullet>Bildirim sayacı, çevrimiçi durum göstergesi</Bullet>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
          <MobileScreen src={imgMobileHome} alt="Mobil Ana" />
          <MobileScreen src={imgMobileYeniTest} alt="Yeni Test" />
        </div>
      </div>
    ),
  },

  /* 6 — TEST & ANALİZ */
  {
    id: 'test',
    content: (
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', height: '100%', padding: '3rem 4rem' }}>
        <div style={{ flex: '0 0 38%', display: 'flex', justifyContent: 'center' }}>
          <img src={sentekKit} alt="SENTEK Kit" style={{ width: '100%', maxWidth: 280, borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <Eyebrow>05 · Doğrudan Madde Testi</Eyebrow>
          <H2>Kamera bir kez<br />açılır, sistem<br />geri kalanını yapar.</H2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
            {[
              ['QR Eşleme', 'Kit seri no okunur, stok cross-check'],
              ['Kompozit Görsel', 'Panel paterni canvas\'a çizilir, delil görseli oluşur'],
              ['AI + Onay', 'Öneri sunulur; override gerekçeli opsiyonel'],
              ['PDF Rapor', 'Otomatik indirme; lab sevk seçeneği'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CyanDot />
                <div>
                  <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '0.95rem' }}>{title}</span>
                  <span style={{ color: '#64748b', fontSize: '0.88rem' }}> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  /* 7 — KAYITLAR & STOK */
  {
    id: 'kayitlar',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '2.5rem 4rem' }}>
        <Eyebrow>06 · Veri & Lojistik</Eyebrow>
        <H2>Kayıtlar, stok ve sevk — hepsi izlenebilir.</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginTop: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.6rem' }}>Test Kayıtları</div>
            <Screen src={imgTestKayitlari} alt="Test Kayıtları" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.6rem' }}>Stok / Seri No</div>
            <Screen src={imgStok} alt="Stok" />
          </div>
        </div>
      </div>
    ),
  },

  /* 8 — LAB SEVK & RAPORLAR */
  {
    id: 'lab',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '2.5rem 4rem' }}>
        <Eyebrow>07 · Lab & Analitik</Eyebrow>
        <H2>Sevk zinciri ve stratejik raporlama.</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginTop: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.6rem' }}>Lab Sevk Takibi · 8 Durum</div>
            <Screen src={imgLabSevk} alt="Lab Sevk" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.6rem' }}>Raporlar & Analitik</div>
            <Screen src={imgRaporlar} alt="Raporlar" />
          </div>
        </div>
      </div>
    ),
  },

  /* 9 — KAZANIMLAR */
  {
    id: 'kazanim',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '3.5rem 5rem' }}>
        <Eyebrow>08 · Kazanımlar</Eyebrow>
        <H1>Sayılarla SENTEK.</H1>
        <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.6rem' }}>
          <Stat value="&lt;90 sn" label="Saha → Merkez Bildirim" />
          <Stat value="~%63" label="Kâğıt Form Tasarrufu" color="#818cf8" />
          <Stat value="33" label="İzlenen Lokasyon" color="#a78bfa" />
          <Stat value="100%" label="Dijital Delil Zinciri" color="#34d399" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '1.6rem' }}>
          <GlassCard>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#67e8f9', marginBottom: '0.6rem' }}>Operasyonel</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Bullet>Kayıt süresi dakikadan saniyelere</Bullet>
              <Bullet>SKT geçmiş kit kullanımı önlendi</Bullet>
              <Bullet>Pozitiften sevke ölçülebilir SLA</Bullet>
            </ul>
          </GlassCard>
          <GlassCard>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.6rem' }}>Yönetişim & Denetim</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Bullet>Rol bazlı ekran yetkisi; 5 ayrı profil</Bullet>
              <Bullet>Standartlaştırılmış raporlama</Bullet>
              <Bullet>Gerçek zamanlı bölge–merkez görünürlüğü</Bullet>
            </ul>
          </GlassCard>
        </div>
      </div>
    ),
  },

  /* 10 — KAPANIS */
  {
    id: 'kapanis',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '1.4rem', padding: '3rem' }}>
        <Eyebrow>09 · Demo & İletişim</Eyebrow>
        <H1 style={{ maxWidth: 680, margin: '0 auto' }}>Sınırda dijital, merkezde görünür, sahada güçlü.</H1>
        <Lead>5 dakikada uçtan uca demo: Yeni Test → Komuta Haritası → Lab Sevk → Raporlama.</Lead>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <GlassCard style={{ minWidth: 200 }}>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#67e8f9', marginBottom: 6 }}>İletişim</div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8' }}>SENTEK Proje Ofisi</div>
            <div style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace', color: '#475569', marginTop: 4 }}>proje@sentek.local</div>
          </GlassCard>
          <GlassCard style={{ minWidth: 200 }}>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#a5b4fc', marginBottom: 6 }}>Doküman</div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8' }}>A4 Tanıtım Kitapçığı</div>
            <div style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace', color: '#475569', marginTop: 4 }}>SNT-BRC-2026-001</div>
          </GlassCard>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <img src={gmgmLogo} alt="GMGM" style={{ height: 48, width: 48, objectFit: 'contain' }} />
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.15)' }} />
          <img src={sentekLogo} alt="SENTEK" style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: 10 }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#334155', letterSpacing: '0.2em', textTransform: 'uppercase' }}>SENTEK · MVP 1.0 · 2026</div>
      </div>
    ),
  },
];

const SLIDE_LABELS = [
  'Kapak', 'Sorun', 'Platform', 'Komuta Kontrol', 'Mobil Saha',
  'Test & Analiz', 'Kayıtlar & Stok', 'Lab & Raporlar', 'Kazanımlar', 'Kapanış',
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '6%' : '-6%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? '6%' : '-6%', opacity: 0 }),
};

export default function Sunum() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;

  const go = useCallback((delta: number) => {
    setCurrent(prev => {
      const next = Math.max(0, Math.min(total - 1, prev + delta));
      setDirection(delta);
      return next;
    });
  }, [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') go(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  useEffect(() => { document.title = `SENTEK · Sunum — ${SLIDE_LABELS[current]}`; }, [current]);

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(120% 90% at 75% 0%, #0a2440 0%, #050b18 55%, #02060f 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg,#00D4FF,#6366f1)', originX: 0 }}
          animate={{ scaleX: (current + 1) / total }}
          initial={false}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px 0', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={sentekLogo} alt="SENTEK" style={{ height: 28, width: 28, objectFit: 'contain', borderRadius: 6 }} />
          <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '0.88rem', letterSpacing: '0.06em' }}>SENTEK</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, letterSpacing: '0.14em' }}>
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {SLIDE_LABELS[current]}
        </div>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {slides[current].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10 }}>
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 20px', color: current === 0 ? '#334155' : '#e2e8f0', fontSize: '0.88rem', fontWeight: 600, cursor: current === 0 ? 'default' : 'pointer', transition: '0.15s', fontFamily: 'inherit' }}
        >← Geri</button>

        {/* Dot nav */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              style={{
                width: i === current ? 24 : 7, height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', transition: 'all 0.25s',
                background: i === current ? '#00D4FF' : 'rgba(255,255,255,0.18)',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={current === total - 1}
          style={{ background: current === total - 1 ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg,#00D4FF,#0a8aa8)', border: 'none', borderRadius: 10, padding: '9px 20px', color: current === total - 1 ? '#334155' : '#001018', fontSize: '0.88rem', fontWeight: 700, cursor: current === total - 1 ? 'default' : 'pointer', transition: '0.15s', fontFamily: 'inherit' }}
        >İleri →</button>
      </div>

      {/* Keyboard hint */}
      <div style={{ position: 'absolute', bottom: 28, right: 28, fontSize: '0.7rem', color: '#1e293b', letterSpacing: '0.14em' }}>← → tuşları</div>
    </div>
  );
}
