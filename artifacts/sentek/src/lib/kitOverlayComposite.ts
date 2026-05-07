import sentekKitImg from '../assets/sentek-kit.png';

export interface PanelOverlay {
  kod: string;
  pos: { left: string; top: string }; // panel test penceresi merkezi (%)
  T: boolean; // T çizgisi GÖRÜNÜR mü? (görünür ⇒ negatif)
  C: boolean; // C çizgisi GÖRÜNÜR mü? (yok ⇒ geçersiz)
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
 * Saha kit fotoğrafı üzerine her panel için gerçek C/T kırmızı çizgileri çizer.
 * Etiket/POZ-NEG yazısı yok — yorum tamamen çizgilere göre yapılır.
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

  ctx.drawImage(img, 0, 0, W, H);

  // Üst koyu bant — saha kayıt damgası
  ctx.fillStyle = 'rgba(8,13,26,0.78)';
  ctx.fillRect(0, 0, W, Math.round(H * 0.075));
  ctx.fillStyle = '#00D4FF';
  ctx.font = `bold ${Math.round(H * 0.026)}px sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(`SENTEK SAHA ÇEKİM • ${meta.operasyonNo}`, Math.round(W * 0.02), Math.round(H * 0.0375));
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `${Math.round(H * 0.016)}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(
    `${meta.personel} • ${new Date(meta.tarih).toLocaleString('tr-TR')} • Kit ${meta.kitSeri}`,
    Math.round(W * 0.98),
    Math.round(H * 0.0375)
  );
  ctx.textAlign = 'left';

  // Panel test pencereleri + C/T kırmızı çizgileri
  // Gerçek kanalı tam saran ölçü: kanal genişliği ~5%, yüksekliği ~11.5%
  const winW = W * 0.050;
  const winH = H * 0.115;

  panels.forEach((p) => {
    const cx = (parseFloat(p.pos.left) / 100) * W;
    const cy = (parseFloat(p.pos.top) / 100) * H;
    const x = cx - winW / 2;
    const y = cy - winH / 2;

    // Pencere çerçevesi (saydam)
    const isInvalid = !p.C;
    const frameColor = isInvalid ? '#f59e0b' : '#00D4FF';
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = Math.max(2, Math.round(H * 0.0028));
    roundRect(ctx, x, y, winW, winH, 6);
    ctx.stroke();

    // Panel kodu — pencerenin üstünde küçük rozet
    ctx.fillStyle = isInvalid ? 'rgba(245,158,11,0.95)' : 'rgba(0,212,255,0.95)';
    const codeFont = Math.round(H * 0.013);
    ctx.font = `bold ${codeFont}px sans-serif`;
    const codeMetrics = ctx.measureText(p.kod);
    const tagPad = 3;
    const tagW = codeMetrics.width + tagPad * 2;
    const tagH = codeFont + tagPad * 2;
    roundRect(ctx, x + winW / 2 - tagW / 2, y - tagH - 4, tagW, tagH, 3);
    ctx.fill();
    ctx.fillStyle = '#0b1220';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.kod, x + winW / 2 - codeMetrics.width / 2, y - tagH / 2 - 4);

    // C ve T çizgileri (gerçek kırmızı kontrol/test çizgileri) — kanal içindeki gerçek konuma oturtulmuş
    const lineThickness = Math.max(2, Math.round(H * 0.0035));
    const lineInset = winW * 0.12;
    const lineLen = winW - lineInset * 2;
    const lineX = x + lineInset;

    // C çizgisi: kanalın üst kısmında (yaklaşık %28)
    const cY = y + winH * 0.28;
    if (p.C) {
      drawTestLine(ctx, lineX, cY, lineLen, lineThickness);
    }

    // T çizgisi: kanalın alt kısmında (yaklaşık %72)
    const tY = y + winH * 0.72;
    if (p.T) {
      drawTestLine(ctx, lineX, tY, lineLen, lineThickness);
    }

    ctx.textBaseline = 'alphabetic';
  });

  // Alt damga
  ctx.fillStyle = 'rgba(8,13,26,0.78)';
  ctx.fillRect(0, Math.round(H * 0.945), W, Math.round(H * 0.055));
  ctx.fillStyle = '#00D4FF';
  ctx.font = `${Math.round(H * 0.016)}px sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(`AI Foto-Analiz • Kırmızı çizgi = mevcut C/T tepkisi • SENTEK Multi-Panel`, Math.round(W * 0.02), Math.round(H * 0.972));

  return canvas.toDataURL('image/png');
}

function drawTestLine(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, len: number, thickness: number,
) {
  // Asıl kırmızı çizgi
  ctx.fillStyle = 'rgba(220,38,38,0.92)';
  roundRect(ctx, x, y - thickness / 2, len, thickness, thickness / 2);
  ctx.fill();
  // Hafif glow / yumuşak kenar
  ctx.fillStyle = 'rgba(239,68,68,0.35)';
  roundRect(ctx, x - 1, y - thickness / 2 - 1, len + 2, thickness + 2, thickness / 2);
  ctx.fill();
  // Tekrar üstten net kırmızı
  ctx.fillStyle = 'rgba(220,38,38,0.95)';
  roundRect(ctx, x, y - thickness / 2, len, thickness, thickness / 2);
  ctx.fill();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
