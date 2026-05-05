import { AuditLog, AuditIslemTipi } from '../../types';
import { Shield, TestTube2, Camera, CheckCircle, Package, Truck, FlaskConical, FileText, FolderOpen, QrCode, Printer, LogIn, PenLine, RefreshCw, Eye } from 'lucide-react';

function formatTarih(t: string) {
  return new Date(t).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const ISLEM_ICON: Record<AuditIslemTipi, typeof Shield> = {
  'Test Oluşturuldu': TestTube2,
  'Fotoğraf Eklendi': Camera,
  'AI Analiz': Shield,
  'Sonuç Doğrulandı': CheckCircle,
  'Stok Düşüldü': Package,
  'Lab Sevk Oluşturuldu': Truck,
  'Teslim Alındı': CheckCircle,
  'Analiz Başlatıldı': FlaskConical,
  'Rapor Yüklendi': FileText,
  'Dosya Kapatıldı': FolderOpen,
  'QR Etiket Oluşturuldu': QrCode,
  'Etiket Yazdırıldı': Printer,
  'Kullanıcı Girişi': LogIn,
  'Kayıt Güncellendi': PenLine,
  'Stok Güncellendi': Package,
  'Senkronize Edildi': RefreshCw,
  'Rapor Oluşturuldu': FileText,
  'Detay Görüntülendi': Eye,
};

const ISLEM_RENK: Record<string, string> = {
  'Test Oluşturuldu': 'text-cyan-400',
  'Fotoğraf Eklendi': 'text-blue-400',
  'AI Analiz': 'text-violet-400',
  'Sonuç Doğrulandı': 'text-emerald-400',
  'Stok Düşüldü': 'text-amber-400',
  'Lab Sevk Oluşturuldu': 'text-primary',
  'Teslim Alındı': 'text-emerald-400',
  'Analiz Başlatıldı': 'text-violet-400',
  'Rapor Yüklendi': 'text-emerald-400',
  'Dosya Kapatıldı': 'text-muted-foreground',
  'QR Etiket Oluşturuldu': 'text-cyan-400',
  'Etiket Yazdırıldı': 'text-muted-foreground',
  'Kullanıcı Girişi': 'text-blue-400',
  'Kayıt Güncellendi': 'text-amber-400',
  'Stok Güncellendi': 'text-amber-400',
  'Senkronize Edildi': 'text-emerald-400',
  'Rapor Oluşturuldu': 'text-emerald-400',
  'Detay Görüntülendi': 'text-muted-foreground',
};

interface AuditLogListProps {
  logs: AuditLog[];
  maxItems?: number;
  kayitNoFilter?: string;
}

export function AuditLogList({ logs, maxItems, kayitNoFilter }: AuditLogListProps) {
  let filtered = kayitNoFilter
    ? logs.filter(l => l.kayitNo === kayitNoFilter || l.kayitNo?.includes(kayitNoFilter))
    : logs;
  if (maxItems) filtered = filtered.slice(0, maxItems);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-6">
        <Shield className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Bu kayıt için işlem geçmişi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map(log => {
        const Icon = ISLEM_ICON[log.islemTipi] || Shield;
        const renk = ISLEM_RENK[log.islemTipi] || 'text-muted-foreground';
        return (
          <div key={log.id} className="flex gap-3 bg-secondary/20 rounded-xl p-3 hover:bg-secondary/30 transition-colors">
            <div className={`w-7 h-7 rounded-lg bg-card flex items-center justify-center flex-shrink-0 mt-0.5 ${renk.replace('text-', 'bg-').replace('-400', '-500/15').replace('-foreground', '-foreground/15')}`}>
              <Icon className={`w-3.5 h-3.5 ${renk}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-xs font-semibold ${renk}`}>{log.islemTipi}</p>
                {log.kayitNo && (
                  <span className="text-xs font-mono text-muted-foreground/70 flex-shrink-0">{log.kayitNo}</span>
                )}
              </div>
              <p className="text-xs text-foreground/80 mt-0.5">{log.aciklama}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{log.kullanici}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs text-muted-foreground">{log.rol}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs text-muted-foreground font-mono">{formatTarih(log.tarih)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
