import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, QrCode, Printer, FileText,
  Camera, Package, Truck, Clock, AlertTriangle, CheckCircle,
  RefreshCw, Eye, Shield, ChevronRight
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TestSonucBadge } from '../../components/sentek/StatusBadge';
import { LabTimeline } from '../../components/sentek/LabTimeline';
import { QRModal } from '../../components/sentek/QRModal';
import { LabelModal } from '../../components/sentek/LabelModal';
import { AuditLogList } from '../../components/sentek/AuditLogList';
import { TestKaydi, LabSevk } from '../../types';

function formatTarih(tarih: string) {
  return new Date(tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type TabKey = 'genel' | 'kit' | 'labsevk' | 'audit';

function DetailDrawer({ kayit, onClose, labSevk }: { kayit: TestKaydi | null; onClose: () => void; labSevk?: LabSevk }) {
  const { auditLogs, auditLogEkle } = useData();
  const { kullanici } = (window as any).__sentekAuth || {};
  const [aktifTab, setAktifTab] = useState<TabKey>('genel');
  const [qrAcik, setQrAcik] = useState(false);
  const [etiketAcik, setEtiketAcik] = useState(false);

  if (!kayit) return null;

  const handleQrGoster = () => {
    setQrAcik(true);
    auditLogEkle('QR Etiket Oluşturuldu', kayit.personelAdi, 'Saha Personeli', 'QR kodu görüntülendi.', kayit.id);
  };

  const handleEtiket = () => {
    setEtiketAcik(true);
    auditLogEkle('Etiket Yazdırıldı', kayit.personelAdi, 'Saha Personeli', 'Test etiketi oluşturuldu.', kayit.id);
  };

  const kayitAuditLogs = auditLogs.filter(l => l.kayitNo === kayit.id);

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'genel', label: 'Genel' },
    { key: 'kit', label: 'Kit / Analiz' },
    { key: 'labsevk', label: 'Lab Sevk' },
    { key: 'audit', label: 'İşlem Geçmişi' },
  ];

  const sonucRenk = kayit.testSonucu === 'Pozitif' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
    kayit.testSonucu === 'Negatif' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
      'bg-amber-500/10 border-amber-500/20 text-amber-400';

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-card-border z-50 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-foreground">{kayit.operasyonNo}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatTarih(kayit.tarih)}</p>
              <p className="text-xs text-muted-foreground">{kayit.lokasyon} — {kayit.kontrolNokta}</p>
            </div>
            <div className="flex items-center gap-2">
              <TestSonucBadge sonuc={kayit.testSonucu} />
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Sync Badge */}
          {kayit.syncDurumu === 'Senkron Bekliyor' && (
            <div className="mt-2 flex items-center gap-1.5 text-amber-400 text-xs bg-amber-500/10 rounded-lg px-2 py-1">
              <RefreshCw className="w-3 h-3" /> Senkron Bekliyor
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="flex gap-2 mt-3">
            <button onClick={handleQrGoster}
              className="flex-1 py-2 border border-primary/30 text-primary text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-primary/10 transition-colors">
              <QrCode className="w-3.5 h-3.5" /> QR Görüntüle
            </button>
            <button onClick={handleEtiket}
              className="flex-1 py-2 border border-border text-foreground text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-secondary transition-colors">
              <Printer className="w-3.5 h-3.5" /> Etiket Yazdır
            </button>
            <button
              className="flex-1 py-2 border border-border text-foreground text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-secondary transition-colors">
              <FileText className="w-3.5 h-3.5" /> Rapor
            </button>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-border px-4 flex-shrink-0">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setAktifTab(tab.key)}
              className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all ${
                aktifTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              } ${tab.key === 'audit' && kayitAuditLogs.length > 0 ? 'relative' : ''}`}>
              {tab.label}
              {tab.key === 'audit' && kayitAuditLogs.length > 0 && (
                <span className="ml-1 text-[9px] bg-primary/20 text-primary rounded-full px-1">{kayitAuditLogs.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {aktifTab === 'genel' && (
            <>
              {/* Sonuç Özeti */}
              <div className={`rounded-xl border p-3 ${sonucRenk}`}>
                <div className="flex items-center gap-2">
                  {kayit.testSonucu === 'Pozitif'
                    ? <AlertTriangle className="w-4 h-4" />
                    : kayit.testSonucu === 'Negatif'
                    ? <CheckCircle className="w-4 h-4" />
                    : <AlertTriangle className="w-4 h-4" />}
                  <span className="text-sm font-bold">{kayit.testSonucu}</span>
                  {kayit.tespitEdilenMadde && <span className="text-xs ml-1">— {kayit.tespitEdilenMadde}</span>}
                </div>
                {kayit.analizGuvenSkoru !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>AI Analiz Güveni</span>
                      <span className="font-bold">%{kayit.analizGuvenSkoru}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-current rounded-full" style={{ width: `${kayit.analizGuvenSkoru}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Temel Bilgiler */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Genel Bilgiler</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: 'Personel', v: kayit.personelAdi },
                    { l: 'Numune Türü', v: kayit.numuneTuru },
                    { l: 'Lokasyon', v: kayit.lokasyon },
                    { l: 'Kontrol Noktası', v: kayit.kontrolNokta },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-secondary/40 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{l}</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materyal Açıklaması */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Materyal Açıklaması</p>
                <div className="bg-secondary/30 rounded-xl p-3 text-sm text-foreground/80">{kayit.sahisAciklamasi}</div>
              </div>

              {/* Fotoğraf Alanı */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Test Fotoğrafı</p>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground">
                  <Camera className="w-6 h-6" />
                  <p className="text-xs text-center">Fotoğraf kaydedildi<br/><span className="text-muted-foreground/50">Önizleme sistemde tutulmaktadır</span></p>
                </div>
              </div>

              {/* Notlar */}
              {kayit.notlar && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Notlar</p>
                  <div className="bg-secondary/30 rounded-xl p-3 text-xs text-muted-foreground">{kayit.notlar}</div>
                </div>
              )}
            </>
          )}

          {aktifTab === 'kit' && (
            <>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Kit Bilgileri</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: 'Seri No', v: kayit.kitSeriNo },
                    { l: 'Son Kullanma', v: kayit.kitSKT || '—' },
                    { l: 'Panel Tipi', v: kayit.kitPanelTipi || '—' },
                    { l: 'Stok ID', v: kayit.stokId || '—' },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-secondary/40 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{l}</p>
                      <p className="text-sm font-medium text-foreground mt-0.5 font-mono">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">AI Analiz Özeti</p>
                <div className="glass-card p-3 space-y-2">
                  {kayit.analizGuvenSkoru !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Güven Skoru</span>
                        <span className={`font-bold ${kayit.analizGuvenSkoru >= 75 ? 'text-emerald-400' : kayit.analizGuvenSkoru >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          %{kayit.analizGuvenSkoru}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${kayit.analizGuvenSkoru >= 75 ? 'bg-emerald-500' : kayit.analizGuvenSkoru >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${kayit.analizGuvenSkoru}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-secondary/30 rounded-lg p-2 text-center">
                      <p className="text-muted-foreground mb-0.5">C Çizgisi</p>
                      <p className="font-bold text-emerald-400">Belirgin</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-2 text-center">
                      <p className="text-muted-foreground mb-0.5">T Çizgisi</p>
                      <p className={`font-bold ${kayit.testSonucu === 'Pozitif' ? 'text-red-400' : kayit.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {kayit.testSonucu === 'Pozitif' ? 'Yok' : kayit.testSonucu === 'Negatif' ? 'Belirgin' : 'Belirsiz'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2">
                    Görüntü analizi tamamlandı. Sonuç personel tarafından doğrulandı.
                  </p>
                </div>
              </div>
            </>
          )}

          {aktifTab === 'labsevk' && (
            <>
              {kayit.labSevkId && labSevk ? (
                <>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Lab Sevk Bilgisi</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { l: 'Takip No', v: labSevk.numuneTakipNo },
                        { l: 'Durum', v: labSevk.durum },
                        { l: 'Öncelik', v: labSevk.oncelik },
                        { l: 'Gönderen', v: labSevk.sevkEdenBirim },
                        { l: 'Mühür No', v: labSevk.muhrEtiketNo || '—' },
                        { l: 'Delil Poşeti', v: labSevk.delilPosetiNo || '—' },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-secondary/40 rounded-lg p-2">
                          <p className="text-xs text-muted-foreground">{l}</p>
                          <p className="text-xs font-medium text-foreground mt-0.5 font-mono truncate">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Süreç Timeline</p>
                    <LabTimeline mevcutDurum={labSevk.durum} olaylar={labSevk.olaylar} />
                  </div>
                </>
              ) : kayit.labSevkDurumu ? (
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-400">Sevk Bilgisi</span>
                  </div>
                  <p className="text-xs text-foreground">{kayit.labSevkDurumu}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Bu test için lab sevk kaydı yok</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Yalnızca pozitif kayıtlar lab'a sevk edilir</p>
                </div>
              )}
            </>
          )}

          {aktifTab === 'audit' && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">İşlem Geçmişi</p>
              <AuditLogList logs={auditLogs} kayitNoFilter={kayit.id} />
              {kayitAuditLogs.length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center py-4">Bu kayıt için henüz işlem geçmişi yok.</p>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* QR Modal */}
      {qrAcik && (
        <QRModal
          title="Test Kayıt QR Kodu"
          value={kayit.id}
          subtitle={`${kayit.operasyonNo} · ${kayit.lokasyon}`}
          onClose={() => setQrAcik(false)}
        />
      )}

      {/* Etiket Modal */}
      {etiketAcik && (
        <LabelModal
          data={{
            tip: 'test',
            baslikNo: kayit.id,
            operasyonNo: kayit.operasyonNo,
            numuneTuru: kayit.numuneTuru,
            testSonucu: kayit.testSonucu,
            tarih: kayit.tarih,
            lokasyon: kayit.lokasyon,
            personel: kayit.personelAdi,
            kitSeriNo: kayit.kitSeriNo,
            qrDeger: kayit.id,
          }}
          onClose={() => setEtiketAcik(false)}
        />
      )}
    </>
  );
}

export default function TestRecords() {
  const { testKayitlari, labSevkler } = useData();
  const [arama, setArama] = useState('');
  const [sonucFiltre, setSonucFiltre] = useState<string>('Tümü');
  const [lokasyonFiltre, setLokasyonFiltre] = useState<string>('Tümü');
  const [seciliKayit, setSeciliKayit] = useState<TestKaydi | null>(null);
  const [filtrePanelAcik, setFiltrePanelAcik] = useState(false);

  const lokasyonlar = ['Tümü', ...Array.from(new Set(testKayitlari.map(t => t.lokasyon)))];

  const filtrelenmis = testKayitlari.filter(t => {
    const aramaEsles = !arama || [t.operasyonNo, t.lokasyon, t.numuneTuru, t.kitSeriNo, t.personelAdi, t.tespitEdilenMadde].some(f => f?.toLowerCase().includes(arama.toLowerCase()));
    const sonucEsles = sonucFiltre === 'Tümü' || t.testSonucu === sonucFiltre;
    const lokasyonEsles = lokasyonFiltre === 'Tümü' || t.lokasyon === lokasyonFiltre;
    return aramaEsles && sonucEsles && lokasyonEsles;
  });

  const labSevkBul = (kayit: TestKaydi) => labSevkler.find(s => s.id === kayit.labSevkId);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test Kayıtları</h1>
          <p className="text-sm text-muted-foreground">{filtrelenmis.length} / {testKayitlari.length} kayıt</p>
        </div>
      </div>

      {/* Arama + Filtre */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Operasyon no, lokasyon, kit seri no, personel..."
            value={arama}
            onChange={e => setArama(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60"
          />
        </div>
        <button onClick={() => setFiltrePanelAcik(!filtrePanelAcik)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${filtrePanelAcik ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-foreground hover:bg-secondary'}`}>
          <Filter className="w-4 h-4" />
          Filtre
          <ChevronDown className={`w-3 h-3 transition-transform ${filtrePanelAcik ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filtre Paneli */}
      <AnimatePresence>
        {filtrePanelAcik && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="glass-card p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sonuç</p>
                <div className="flex gap-2 flex-wrap">
                  {['Tümü', 'Pozitif', 'Negatif', 'Geçersiz'].map(v => (
                    <button key={v} onClick={() => setSonucFiltre(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${sonucFiltre === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lokasyon</p>
                <div className="flex gap-2 flex-wrap">
                  {lokasyonlar.slice(0, 8).map(v => (
                    <button key={v} onClick={() => setLokasyonFiltre(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${lokasyonFiltre === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste */}
      <div className="space-y-2">
        {filtrelenmis.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Shield className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aramanızla eşleşen kayıt bulunamadı</p>
          </div>
        ) : (
          filtrelenmis.map(kayit => {
            const sonucRenk = kayit.testSonucu === 'Pozitif' ? 'border-l-red-500' : kayit.testSonucu === 'Negatif' ? 'border-l-emerald-500' : 'border-l-amber-500';
            return (
              <motion.button
                key={kayit.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSeciliKayit(kayit)}
                className={`w-full glass-card p-4 text-left border-l-4 ${sonucRenk} hover:border-primary/40 transition-all group`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-bold font-mono text-primary">{kayit.operasyonNo}</span>
                      {kayit.syncDurumu === 'Senkron Bekliyor' && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5" /> Offline
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{kayit.lokasyon}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{kayit.numuneTuru}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">{kayit.kitSeriNo}</span>
                      {kayit.tespitEdilenMadde && (
                        <span className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />{kayit.tespitEdilenMadde}
                        </span>
                      )}
                      {kayit.labSevkId && (
                        <span className="text-xs text-cyan-400 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" />Sevk
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <TestSonucBadge sonuc={kayit.testSonucu} />
                    <div className="flex items-center gap-2">
                      {kayit.analizGuvenSkoru !== undefined && (
                        <span className={`text-xs ${kayit.analizGuvenSkoru >= 75 ? 'text-emerald-400' : kayit.analizGuvenSkoru >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          %{kayit.analizGuvenSkoru}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {formatTarih(kayit.tarih)} · {kayit.personelAdi}
                </p>
              </motion.button>
            );
          })
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {seciliKayit && (
          <DetailDrawer
            kayit={seciliKayit}
            onClose={() => setSeciliKayit(null)}
            labSevk={labSevkBul(seciliKayit)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
