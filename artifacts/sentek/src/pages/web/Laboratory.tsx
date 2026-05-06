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
          <div className="glass-card-inset p-4 space-y-2 text-xs">
            <p className="section-title mb-1">Numune Özeti</p>
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
            <label className="section-title mb-2 flex items-center gap-1">
              <User className="w-3 h-3" /> Teslim Alan Personel *
            </label>
            <input
              type="text"
              value={form.teslimAlanPersonel}
              onChange={e => setField('teslimAlanPersonel', e.target.value)}
              placeholder="Personel adı soyadı"
              className="premium-input"
            />
          </div>

          {/* Tarih / Saat */}
          <div>
            <label className="section-title mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Teslim Alma Tarihi / Saati
            </label>
            <input
              type="datetime-local"
              value={form.teslimTarihi}
              onChange={e => setField('teslimTarihi', e.target.value)}
              className="premium-input"
            />
          </div>

          {/* Ambalaj Bütünlüğü */}
          <div>
            <label className="section-title mb-2 flex items-center gap-1">
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
            <label className="section-title mb-2 block">
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
            <label className="section-title mb-2 block">
              Fiziksel Durum Notu
            </label>
            <textarea
              value={form.fizikselDurumNotu}
              onChange={e => setField('fizikselDurumNotu', e.target.value)}
              placeholder="Numune fiziksel durumunu kısaca açıklayın..."
              rows={3}
              className="premium-input resize-none"
            />
          </div>

          {/* Teslim Alma Fotoğrafı */}
          <div>
            <label className="section-title mb-2 flex items-center gap-1">
              <Camera className="w-3 h-3" /> Teslim Alma Fotoğrafı (İsteğe bağlı)
            </label>
            <button className="w-full h-16 border-dashed border-2 border-border rounded-xl flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-primary/40 transition-colors">
              <Camera className="w-4 h-4" /> Fotoğraf Ekle
            </button>
          </div>

          {/* Kabul Durumu */}
          <div>
            <label className="section-title mb-2 block">
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
            className="flex-1 h-[44px] bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/70 transition-colors">
            İptal
          </button>
          <button
            onClick={() => { if (gecerli) onKaydet(form); }}
            disabled={!gecerli}
            className={`flex-1 h-[44px] rounded-xl font-bold text-sm transition-all ${
              gecerli 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98]' 
                : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
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
        className="glass-card-elevated w-full max-w-md h-full max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-foreground">{sevk.numuneTakipNo}</h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{sevk.operasyonNo}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <LabDurumBadge durum={sevk.durum} />
            <OncelikBadge oncelik={sevk.oncelik} />
          </div>

          <div className="glass-card-inset p-4 space-y-2.5 text-xs">
            <p className="section-title mb-1">Numune Detayları</p>
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
              <div key={k} className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground flex-shrink-0">{k}</span>
                <span className="font-medium text-foreground text-right">{v}</span>
              </div>
            ))}
          </div>

          {sevk.teslimAlma && (
            <div className="glass-card-inset p-4 border-emerald-500/20 space-y-2.5 text-xs">
              <p className="section-title text-emerald-400 mb-1 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Teslim Bilgileri
              </p>
              {[
                ['Teslim Alan', sevk.teslimAlma.teslimAlanPersonel],
                ['Ambalaj', sevk.teslimAlma.ambalajButunlugu],
                ['Mühür Kontrolü', sevk.teslimAlma.muhrKontrol],
                ['Kabul Durumu', sevk.teslimAlma.kabulDurumu],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold text-foreground">{v}</span>
                </div>
              ))}
              {sevk.teslimAlma.fizikselDurumNotu && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <p className="text-muted-foreground italic leading-relaxed">{sevk.teslimAlma.fizikselDurumNotu}</p>
                </div>
              )}
            </div>
          )}

          {sevk.notlar && (
            <div className="bg-secondary/30 rounded-xl p-4 text-xs text-muted-foreground italic leading-relaxed">
              "{sevk.notlar}"
            </div>
          )}

          <div>
            <p className="section-title mb-4">Süreç Timeline</p>
            <LabTimeline mevcutDurum={sevk.durum} olaylar={sevk.olaylar} />
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="p-5 border-t border-border/50 flex-shrink-0 space-y-3 bg-card/50">
          {sevk.durum === 'Laboratuvara Ulaştı' && (
            <button onClick={() => onTeslimAl(sevk)}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
              <Check className="w-4 h-4" /> Teslim Al
            </button>
          )}
          {sevk.durum === 'Teslim Alındı' && (
            <button onClick={() => onAnalizBaslat(sevk.id)}
              className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
              <FlaskConical className="w-4 h-4" /> Analizi Başlat
            </button>
          )}
          {sevk.durum === 'Analiz Sırasında' && (
            <button onClick={() => onRaporYukle(sevk.id)}
              className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
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

  const getBorderColor = (durum: string) => {
    if (['Laboratuvara Yolda', 'Sevk Kaydı Oluşturuldu', 'Numune Paketlendi'].includes(durum)) return 'border-l-amber-500';
    if (['Laboratuvara Ulaştı', 'Teslim Alındı', 'Analiz Sırasında'].includes(durum)) return 'border-l-violet-500';
    if (['Rapor Yüklendi', 'Dosya Kapatıldı'].includes(durum)) return 'border-l-emerald-500';
    return 'border-l-transparent';
  };

  return (
    <div className="p-6 space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="page-title mb-1">Laboratuvar</h1>
          <p className="text-sm text-muted-foreground">Numune teslim alma ve analiz iş akışı</p>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
          <div className="kpi-chip border-l-4 border-l-amber-500">
            <span className="metric-label">Bekleyen</span>
            <span className="text-xl font-bold text-amber-400">{bekleyenler.length}</span>
          </div>
          <div className="kpi-chip border-l-4 border-l-violet-500">
            <span className="metric-label">Analiz</span>
            <span className="text-xl font-bold text-violet-400">{labSevkler.filter(s => s.durum === 'Analiz Sırasında').length}</span>
          </div>
          <div className="kpi-chip border-l-4 border-l-emerald-500">
            <span className="metric-label">Tamamlanan</span>
            <span className="text-xl font-bold text-emerald-400">{tamamlananlar.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 max-w-md">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {listelenecek.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center">
            <FlaskConical className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-base text-muted-foreground">Bu kategoride numune bulunmamaktadır</p>
          </div>
        ) : (
          listelenecek.map(sevk => (
            <motion.div
              key={sevk.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card-elevated border-l-[3px] ${getBorderColor(sevk.durum)} overflow-hidden group cursor-pointer`}
              onClick={() => setSeciliSevk(sevk)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono text-cyan-400 tracking-tight leading-none">
                        {sevk.numuneTakipNo}
                      </span>
                      <OncelikBadge oncelik={sevk.oncelik} />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground opacity-60 leading-none">
                      {sevk.operasyonNo}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <LabDurumBadge durum={sevk.durum} />
                    <span className="badge-info text-[10px] py-0 px-1.5">{sevk.onTaramaSonucu}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      {sevk.numuneTuru}
                    </div>
                    <div className="text-muted-foreground text-xs flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {sevk.sevkEdenBirim}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                      <Clock className="w-3 h-3" />
                      {sevk.tahminiVaris ? new Date(sevk.tahminiVaris).toLocaleDateString('tr-TR') : 'Tarih Belirsiz'}
                    </div>

                    <div className="flex items-center gap-2">
                      {sevk.durum === 'Laboratuvara Ulaştı' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setTeslimAlmaModalSevk(sevk); }}
                          className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                        >
                          Teslim Al
                        </button>
                      )}
                      {sevk.durum === 'Teslim Alındı' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAnalizBaslat(sevk.id); }}
                          className="px-4 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-violet-500/10 hover:text-violet-400 border border-transparent hover:border-violet-500/30 transition-all"
                        >
                          Analiz Başlat
                        </button>
                      )}
                      {sevk.durum === 'Analiz Sırasında' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRaporYukle(sevk.id); }}
                          className="px-4 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 border border-transparent hover:border-emerald-500/30 transition-all"
                        >
                          Rapor Yükle
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
