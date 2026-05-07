import { db } from './db';
import { RaporAyarlari } from '../types';

export const VARSAYILAN_RAPOR_AYARLARI: RaporAyarlari = {
  id: 'singleton',
  kurumAdi: 'T.C. Ticaret Bakanlığı',
  birimAdi: 'Gümrükler Muhafaza Genel Müdürlüğü — Saha Operasyon Birimi',
  kurumAdresi: 'Söğütözü Mah. 2176. Sok. No:63, 06530 Çankaya / ANKARA',
  iletisim: 'sentek@ticaret.gov.tr • +90 312 449 10 00',
  belgeNoOnEki: 'SNT-RPR',
  gizlilikSeviyesi: 'GİZLİ',
  ustBilgi: 'Saha Entegre Narkotik Test Yazılımı — Resmî Test Raporu',
  altBilgi: 'Bu belge SENTEK sistemi tarafından otomatik olarak üretilmiştir. Yetkisiz dağıtımı yasaktır.',
  watermarkGoster: true,
  watermarkMetin: 'GİZLİ',
  kapakSayfasiGoster: true,
  qrGoster: true,
  aiDetayGoster: true,
  panelTablosuGoster: true,
  zincirGoster: true,
  fotoGoster: true,
  imzaSatirlari: [
    { unvan: 'SAHA PERSONELİ', ad: '' },
    { unvan: 'BİRİM AMİRİ', ad: '' },
    { unvan: 'ONAYLAYAN', ad: '' },
  ],
  renkTema: 'kurumsal',
  kurumLogoDataUrl: undefined,
  guncellemeTarihi: new Date().toISOString(),
};

export async function getRaporAyarlari(): Promise<RaporAyarlari> {
  try {
    const mevcut = await db.raporAyarlari.get('singleton');
    if (mevcut) return { ...VARSAYILAN_RAPOR_AYARLARI, ...mevcut, id: 'singleton' };
  } catch {
    // tablo henüz yoksa default
  }
  return VARSAYILAN_RAPOR_AYARLARI;
}

export async function saveRaporAyarlari(ayarlar: Omit<RaporAyarlari, 'id' | 'guncellemeTarihi'>): Promise<RaporAyarlari> {
  const tam: RaporAyarlari = {
    ...ayarlar,
    id: 'singleton',
    guncellemeTarihi: new Date().toISOString(),
  };
  await db.raporAyarlari.put(tam);
  return tam;
}

export async function resetRaporAyarlari(): Promise<RaporAyarlari> {
  await db.raporAyarlari.put(VARSAYILAN_RAPOR_AYARLARI);
  return VARSAYILAN_RAPOR_AYARLARI;
}
