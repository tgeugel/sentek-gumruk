import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { TestKaydi } from '../../types';
import { TestKayitRaporuDoc } from './TestKayitRaporu';

export async function downloadTestRaporu(kayit: TestKaydi) {
  let qrDataUrl: string | undefined;
  try {
    qrDataUrl = await QRCode.toDataURL(`SENTEK:TEST:${kayit.id}`, {
      width: 256, margin: 1,
      color: { dark: '#0A0F1E', light: '#ffffff' },
    });
  } catch {
    qrDataUrl = undefined;
  }

  const blob = await pdf(<TestKayitRaporuDoc kayit={kayit} qrDataUrl={qrDataUrl} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SENTEK_TestRaporu_${kayit.operasyonNo}_${kayit.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
