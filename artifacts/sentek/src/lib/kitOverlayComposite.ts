import sentekKitImg from '../assets/sentek-kit.png';

export interface PanelOverlay {
  kod: string;
  pos: { left: string; top: string };
  T: boolean;
  C: boolean;
}

let kitImgPromise: Promise<HTMLImageElement> | null = null;
function loadKitImage(): Promise<HTMLImageElement> {
  if (!kitImgPromise) {
    kitImgPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = sentekKitImg;
    });
  }
  return kitImgPromise;
}

/**
 * Kit fotoğrafının üzerine simüle edilmiş C/T çizgi etiketlerini bindiren
 * bir kompozit PNG üretir ve data URL olarak döner. Saha çekim kaydı olarak
 * Dexie'ye saklanır ve PDF raporunda kullanılır.
 */
export async function buildKitOverlayComposite(
  panels: PanelOverlay[],
  meta: { operasyonNo: string; tarih: string; personel: string; kitSeri: string }
): Promise<string> {
  const img = await loadKitImage();
  const W = img.naturalWidth || 1024;
  const H = img.naturalHeight || 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sentekKitImg;

  // Arka plan + kit
  ctx.drawImage(img, 0, 0, W, H);

  // Üst koyu bant (saha kayıt damgası)
  ctx.fillStyle = 'rgba(8,13,26,0.78)';
  ctx.fillRect(0, 0, W, Math.round(H * 0.08));
  ctx.fillStyle = '#00D4FF';
  ctx.font = `bold ${Math.round(H * 0.028)}px sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(`SENTEK SAHA KAYIT • ${meta.operasyonNo}`, Math.round(W * 0.02), Math.round(H * 0.04));
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `${Math.round(H * 0.018)}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(
    `${meta.personel} • ${new Date(meta.tarih).toLocaleString('tr-TR')} • Kit ${meta.kitSeri}`,
    Math.round(W * 0.98),
    Math.round(H * 0.04)
  );
  ctx.textAlign = 'left';

  // Panel etiketleri
  const fontSize = Math.round(H * 0.024);
  ctx.font = `bold ${fontSize}px sans-serif`;
  panels.forEach((p) => {
    const x = (parseFloat(p.pos.left) / 100) * W;
    const y = (parseFloat(p.pos.top) / 100) * H;
    const label = !p.C ? `${p.kod}  GEÇERSİZ` : p.T ? `${p.kod}  POZİTİF (T+)` : `${p.kod}  NEG`;
    const padX = 14;
    const padY = 8;
    const metrics = ctx.measureText(label);
    const w = metrics.width + padX * 2;
    const h = fontSize + padY * 2;

    let bg = 'rgba(16,185,129,0.85)';
    let stroke = '#10b981';
    if (!p.C) { bg = 'rgba(245,158,11,0.9)'; stroke = '#f59e0b'; }
    else if (p.T) { bg = 'rgba(239,68,68,0.9)'; stroke = '#ef4444'; }

    // Pin çizgisi
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, Math.round(H * 0.003));
    ctx.beginPath();
    ctx.arc(x, y, Math.max(6, Math.round(H * 0.012)), 0, Math.PI * 2);
    ctx.stroke();

    // Etiket
    const lx = x + Math.round(W * 0.02);
    const ly = y - h / 2;
    ctx.fillStyle = bg;
    roundRect(ctx, lx, ly, w, h, 8);
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillText(label, lx + padX, ly + h / 2);
    ctx.textBaseline = 'middle';
  });

  // Alt damga
  ctx.fillStyle = 'rgba(8,13,26,0.78)';
  ctx.fillRect(0, Math.round(H * 0.94), W, Math.round(H * 0.06));
  ctx.fillStyle = '#00D4FF';
  ctx.font = `${Math.round(H * 0.018)}px sans-serif`;
  ctx.fillText(`AI Foto-Analiz • C/T çizgi tespiti • SENTEK Multi-Panel`, Math.round(W * 0.02), Math.round(H * 0.97));

  return canvas.toDataURL('image/png');
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
