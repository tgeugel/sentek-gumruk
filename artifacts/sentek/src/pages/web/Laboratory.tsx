import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Check, X, Clock, Camera, Package,
  Truck, BarChart3, FileText, AlertTriangle, ChevronRight, User
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { LabDurumBadge, OncelikBadge } from '../../components/sentek/StatusBadge';
import { LabTimeline } from '../../components/sentek/LabTimeline';
import { LabSevk, LabSevkDurumu, TeslimAlmaFormu } from '../../types';

function TeslimAlmaModal({ sevk, onClose, onKaydet }: {
  sevk: LabSevk;
  onClose: () => void;
  onKaydet: (form: TeslimAlmaFormu) => void;
}) {
  const [form, setForm] = useState<TeslimAlmaFormu>({
    teslimAlanPersonel: '',
    teslimTarihi: new Date().toISOString().slice(0, 16),
    ambalajButunlugu: 'Uygun',
    muhrKontrol: 'Uygun',
    fizikselDurumNotu: '',
    kabulDurumu: 'Kabul',
  });

  const setField = (k: keyof TeslimAlmaFormu, v: string) => setForm(p => ({ ...p, [k]: v }));
  const gecerli = form.teslimAlanPersonel.length >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-card-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h3 className="text-base font-bold text-foreground">Teslim Alma Formu</h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{sevk.numuneTakipNo}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Numune özeti */}
          <div className="bg-secondary/50 rounded-xl p-3 space-y-1.5 text-xs">
            {[
              ['Operasyon No', sevk.operasyonNo],
              ['Numune Türü', sevk.numuneTuru],
              ['Ön Tarama', sevk.onTaramaSonucu],
              ['Gönderen', sevk.sevkEdenBirim],
              ['Mühür / Etiket', sevk.muhrEtiketNo || '—'],
              ['Delil Poşeti', sevk.delilPosetiNo || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>

          {/* Teslim Alan */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" /> Teslim Alan Personel *
            </label>
            <input
              type="text"
              value={form.teslimAlanPersonel}
              onChange={e => setField('teslimAlanPersonel', e.target.value)}
              placeholder="Personel adı soyadı"
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Tarih / Saat */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Teslim Alma Tarihi / Saati
            </label>
            <input
              type="datetime-local"
              value={form.teslimTarihi}
              onChange={e => setField('teslimTarihi', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
            />
          </div>

          {/* Ambalaj Bütünlüğü */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Package className="w-3 h-3" /> Ambalaj Bütünlüğü
            </label>
            <div className="flex gap-2">
              {(['Uygun', 'Şüpheli', 'Uygun Değil'] as const).map(v => (
                <button key={v} onClick={() => setField('ambalajButunlugu', v)}
                  className={`flex-1 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all ${
                    form.ambalajButunlugu === v
                      ? v === 'Uygun' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      : v === 'Şüpheli' ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                      : 'border-red-500 bg-red-500/15 text-red-400'
                      : 'border-border bg-card text-foreground hover:border-border-active'
                  }`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Mühür Kontrolü */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Mühür Kontrolü
            </label>
            <div className="flex gap-2">
              {(['Uygun', 'Uygun Değil'] as const).map(v => (
                <button key={v} onClick={() => setField('muhrKontrol', v)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    form.muhrKontrol === v
                      ? v === 'Uygun' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      : 'border-red-500 bg-red-500/15 text-red-400'
                      : 'border-border bg-card text-foreground'
                  }`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Fiziksel Durum Notu */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Fiziksel Durum Notu
            </label>
            <textarea
              value={form.fizikselDurumNotu}
              onChange={e => setField('fizikselDurumNotu', e.target.value)}
              placeholder="Numune fiziksel durumunu kısaca açıklayın..."
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground/40 resize-none"
            />
          </div>

          {/* Teslim Alma Fotoğrafı */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Camera className="w-3 h-3" /> Teslim Alma Fotoğrafı (İsteğe bağlı)
            </label>
            <button className="w-full h-16 border-dashed border-2 border-border rounded-xl flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-primary/40 transition-colors">
              <Camera className="w-4 h-4" /> Fotoğraf Ekle
            </button>
          </div>

          {/* Kabul Durumu */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Kabul Durumu *
            </label>
            <div className="space-y-2">
              {(['Kabul', 'Şartlı Kabul', 'Reddedildi'] as const).map(v => (
                <button key={v} onClick={() => setField('kabulDurumu', v)}
                  className={`w-full py-3 px-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                    form.kabulDurumu === v
                      ? v === 'Kabul' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : v === 'Şartlı Kabul' ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-border bg-card text-foreground'
                  }`}>
                  <span className="text-sm font-semibold">{v}</span>
                  {form.kabulDurumu === v && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 pt-0 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/70 transition-colors">
            İptal
          </button>
          <button
            onClick={() => { if (gecerli) onKaydet(form); }}
            disabled={!gecerli}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              gecerli ? 'bg-primary text-primary-foreground active:scale-[0.98]' : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
            }`}>
            Teslim Almayı Onayla
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DetayModal({ sevk, onClose, onTeslimAl, onAnalizBaslat, onRaporYukle }: {
  sevk: LabSevk | null;
  onClose: () => void;
  onTeslimAl: (sevk: LabSevk) => void;
  onAnalizBaslat: (id: string) => void;
  onRaporYukle: (id: string) => void;
}) {
  if (!sevk) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        onClick={e => e.stopPropagation()}
        className="bg-card border border-card-border rounded-2xl w-full max-w-md h-full max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div>
            <h3 className="text-sm font-bold text-foreground">{sevk.numuneTakipNo}</h3>
            <p className="text-xs text-muted-foreground font-mono">{sevk.operasyonNo}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <LabDurumBadge durum={sevk.durum} />
            <OncelikBadge oncelik={sevk.oncelik} />
          </div>

          <div className="glass-card p-3 space-y-1.5 text-xs">
            {[
              ['Numune Türü', sevk.numuneTuru],
              ['Ön Tarama', sevk.onTaramaSonucu],
              ...(sevk.tespitEdilenMadde ? [['Tespit', sevk.tespitEdilenMadde]] : []),
              ['Gönderen Birim', sevk.sevkEdenBirim],
              ['Gönderim', sevk.gonderimYontemi || '—'],
              ['Tahmini Varış', sevk.tahminiVaris ? new Date(sevk.tahminiVaris).toLocaleString('tr-TR') : '—'],
              ['Mühür / Etiket', sevk.muhrEtiketNo || '—'],
              ['Delil Poşeti', sevk.delilPosetiNo || '—'],
              ['Kit Seri No', sevk.kitSeriNo || '—'],
              ['Kit SKT', sevk.kitSKT || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground flex-shrink-0">{k}</span>
                <span className="font-medium text-foreground text-right truncate max-w-[55%]">{v}</span>
              </div>
            ))}
          </div>

          {sevk.teslimAlma && (
            <div className="glass-card p-3 border-emerald-500/20 space-y-1.5 text-xs">
              <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Teslim Bilgileri
              </p>
              {[
                ['Teslim Alan', sevk.teslimAlma.teslimAlanPersonel],
                ['Ambalaj', sevk.teslimAlma.ambalajButunlugu],
                ['Mühür Kontrolü', sevk.teslimAlma.muhrKontrol],
                ['Kabul Durumu', sevk.teslimAlma.kabulDurumu],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold text-foreground">{v}</span>
                </div>
              ))}
              {sevk.teslimAlma.fizikselDurumNotu && (
                <p className="text-muted-foreground/70 border-t border-border/30 pt-1.5">{sevk.teslimAlma.fizikselDurumNotu}</p>
              )}
            </div>
          )}

          {sevk.notlar && (
            <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground">{sevk.notlar}</div>
          )}

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Süreç Timeline</p>
            <LabTimeline mevcutDurum={sevk.durum} olaylar={sevk.olaylar} />
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="p-4 border-t border-border flex-shrink-0 space-y-2">
          {sevk.durum === 'Laboratuvara Ulaştı' && (
            <button onClick={() => onTeslimAl(sevk)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Teslim Al
            </button>
          )}
          {sevk.durum === 'Teslim Alındı' && (
            <button onClick={() => onAnalizBaslat(sevk.id)}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <FlaskConical className="w-4 h-4" /> Analizi Başlat
            </button>
          )}
          {sevk.durum === 'Analiz Sırasında' && (
            <button onClick={() => onRaporYukle(sevk.id)}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Raporu Yükle
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Laboratory() {
  const { labSevkler, labSevkDurumGuncelle, labSevkTeslimAlmaKaydet } = useData();
  const [seciliSevk, setSeciliSevk] = useState<LabSevk | null>(null);
  const [teslimAlmaModalSevk, setTeslimAlmaModalSevk] = useState<LabSevk | null>(null);
  const [aktifTab, setAktifTab] = useState<'bekleyen' | 'aktif' | 'tamamlanan'>('bekleyen');

  const bekleyenler = labSevkler.filter(s =>
    ['Sevk Kaydı Oluşturuldu', 'Numune Paketlendi', 'Laboratuvara Yolda'].includes(s.durum)
  );
  const aktifler = labSevkler.filter(s =>
    ['Laboratuvara Ulaştı', 'Teslim Alındı', 'Analiz Sırasında'].includes(s.durum)
  );
  const tamamlananlar = labSevkler.filter(s =>
    ['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(s.durum)
  );

  const TABS = [
    { key: 'bekleyen', label: 'Bekleyen', count: bekleyenler.length, color: 'text-amber-400' },
    { key: 'aktif', label: 'Aktif / Analiz', count: aktifler.length, color: 'text-cyan-400' },
    { key: 'tamamlanan', label: 'Tamamlanan', count: tamamlananlar.length, color: 'text-emerald-400' },
  ];

  const listelenecek = aktifTab === 'bekleyen' ? bekleyenler : aktifTab === 'aktif' ? aktifler : tamamlananlar;

  const handleTeslimAlmaKaydet = (form: TeslimAlmaFormu) => {
    if (!teslimAlmaModalSevk) return;
    labSevkTeslimAlmaKaydet(teslimAlmaModalSevk.id, form);
    setTeslimAlmaModalSevk(null);
    setSeciliSevk(null);
  };

  const handleAnalizBaslat = (id: string) => {
    labSevkDurumGuncelle(id, 'Analiz Sırasında', 'S. Kaya', 'Kimyasal analiz başlatıldı.');
    setSeciliSevk(null);
  };

  const handleRaporYukle = (id: string) => {
    labSevkDurumGuncelle(id, 'Rapor Yüklendi', 'S. Kaya', 'Analiz raporu sisteme yüklendi.');
    setSeciliSevk(null);
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-0.5">Laboratuvar</h1>
        <p className="text-sm text-muted-foreground">Gelen numuneler ve analiz süreçleri</p>
      </div>

      {/* Stat Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Truck, label: 'Yolda', value: labSevkler.filter(s => s.durum === 'Laboratuvara Yolda').length, color: 'text-amber-400' },
          { icon: Package, label: 'Ulaştı / Teslim', value: aktifler.length, color: 'text-cyan-400' },
          { icon: BarChart3, label: 'Analiz Sırasında', value: labSevkler.filter(s => s.durum === 'Analiz Sırasında').length, color: 'text-violet-400' },
          { icon: FileText, label: 'Raporlanan', value: tamamlananlar.length, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color.replace('text-', 'bg-').replace('-400', '-500/15')}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setAktifTab(t.key as 'bekleyen' | 'aktif' | 'tamamlanan')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              aktifTab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            {t.label}
            <span className={`font-bold ${aktifTab === t.key ? t.color : ''}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {listelenecek.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <FlaskConical className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Bu kategoride numune yok</p>
          </div>
        ) : (
          listelenecek.map(sevk => (
            <motion.button
              key={sevk.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSeciliSevk(sevk)}
              className="w-full glass-card p-4 text-left hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold font-mono text-primary">{sevk.numuneTakipNo}</span>
                    <OncelikBadge oncelik={sevk.oncelik} />
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{sevk.numuneTuru}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sevk.sevkEdenBirim}</p>
                  {sevk.tespitEdilenMadde && (
                    <p className="text-xs text-red-400 mt-1 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />{sevk.tespitEdilenMadde}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <LabDurumBadge durum={sevk.durum} />
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Detay Drawer */}
      <AnimatePresence>
        {seciliSevk && (
          <DetayModal
            sevk={seciliSevk}
            onClose={() => setSeciliSevk(null)}
            onTeslimAl={(s) => { setSeciliSevk(null); setTeslimAlmaModalSevk(s); }}
            onAnalizBaslat={handleAnalizBaslat}
            onRaporYukle={handleRaporYukle}
          />
        )}
      </AnimatePresence>

      {/* Teslim Alma Modal */}
      <AnimatePresence>
        {teslimAlmaModalSevk && (
          <TeslimAlmaModal
            sevk={teslimAlmaModalSevk}
            onClose={() => setTeslimAlmaModalSevk(null)}
            onKaydet={handleTeslimAlmaKaydet}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
