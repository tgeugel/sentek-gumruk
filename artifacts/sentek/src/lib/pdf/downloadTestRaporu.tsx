import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { TestKaydi } from '../../types';
import { TestKayitRaporuDoc } from './TestKayitRaporu';
import { getRaporAyarlari } from '../raporAyarlari';

export async function downloadTestRaporu(kayit: TestKaydi) {
  const ayarlar = await getRaporAyarlari();

  let qrDataUrl: string | undefined;
  if (ayarlar.qrGoster) {
    try {
      qrDataUrl = await QRCode.toDataURL(`SENTEK:TEST:${kayit.id}|${ayarlar.belgeNoOnEki}`, {
        width: 320, margin: 1,
        color: { dark: '#0A0F1E', light: '#ffffff' },
      });
    } catch {
      qrDataUrl = undefined;
    }
  }

  const blob = await pdf(<TestKayitRaporuDoc kayit={kayit} ayarlar={ayarlar} qrDataUrl={qrDataUrl} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SENTEK_TestRaporu_${kayit.operasyonNo}_${kayit.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
