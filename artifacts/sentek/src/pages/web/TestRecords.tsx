import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, QrCode, Printer, FileText,
  Camera, Truck, Clock, AlertTriangle, CheckCircle,
  RefreshCw, Shield, ChevronRight, FlaskConical, Package
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
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
  const { kullanici } = useAuth();
  const [aktifTab, setAktifTab] = useState<TabKey>('genel');
  const [qrAcik, setQrAcik] = useState(false);
  const [etiketAcik, setEtiketAcik] = useState(false);

  if (!kayit) return null;

  const personelAdi = kullanici?.ad ?? kayit.personelAdi;
  const personelRol = kullanici?.rol ?? 'Saha Personeli';

  const handleQrGoster = () => {
    setQrAcik(true);
    auditLogEkle('QR Etiket Oluşturuldu', personelAdi, personelRol, 'QR kodu görüntülendi.', kayit.id);
  };

  const handleEtiket = () => {
    setEtiketAcik(true);
    auditLogEkle('Etiket Yazdırıldı', personelAdi, personelRol, 'Test etiketi oluşturuldu.', kayit.id);
  };

  const kayitAuditLogs = auditLogs.filter(l => l.kayitNo === kayit.id);

  const TABS: { key: TabKey; label: string; icon: typeof Shield }[] = [
    { key: 'genel',    label: 'Genel',           icon: Shield },
    { key: 'kit',      label: 'Kit / Analiz',    icon: Package },
    { key: 'labsevk',  label: 'Lab Sevk',        icon: Truck },
    { key: 'audit',    label: 'İşlem Geçmişi',   icon: Clock },
  ];

  const sonucRenk = kayit.testSonucu === 'Pozitif'
    ? 'bg-red-500/10 border-red-500/25 text-red-400'
    : kayit.testSonucu === 'Negatif'
    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
    : 'bg-amber-500/10 border-amber-500/25 text-amber-400';

  const SonucIcon = kayit.testSonucu === 'Pozitif' ? AlertTriangle : kayit.testSonucu === 'Negatif' ? CheckCircle : AlertTriangle;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.26 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-card-border z-50 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex-shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-foreground text-base">{kayit.operasyonNo}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatTarih(kayit.tarih)}</p>
              <p className="text-xs text-muted-foreground">{kayit.lokasyon} · {kayit.kontrolNokta}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <TestSonucBadge sonuc={kayit.testSonucu} />
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {kayit.syncDurumu === 'Senkron Bekliyor' && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs bg-amber-500/10 rounded-lg px-2.5 py-1.5 border border-amber-500/20">
              <RefreshCw className="w-3 h-3" /> Senkron Bekliyor — Çevrimdışı kayıt
            </div>
          )}

          {/* İzlenebilirlik Aksiyonları */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">İzlenebilirlik Aksiyonları</p>
            <div className="flex gap-2">
              <button onClick={handleQrGoster}
                className="flex-1 py-2 border border-primary/30 text-primary text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary/10 transition-colors">
                <QrCode className="w-3.5 h-3.5" /> QR Kod
              </button>
              <button onClick={handleEtiket}
                className="flex-1 py-2 border border-border text-foreground text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors">
                <Printer className="w-3.5 h-3.5" /> Etiket
              </button>
              <button
                className="flex-1 py-2 border border-border text-foreground text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors">
                <FileText className="w-3.5 h-3.5" /> Rapor
              </button>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-border px-4 flex-shrink-0 bg-card">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setAktifTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                aktifTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="w-3 h-3" />
              {tab.label}
              {tab.key === 'audit' && kayitAuditLogs.length > 0 && (
                <span className="ml-0.5 text-[9px] bg-primary/20 text-primary rounded-full px-1.5 py-0.5 leading-none">
                  {kayitAuditLogs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={aktifTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="p-5 space-y-4"
            >
              {aktifTab === 'genel' && (
                <>
                  {/* Sonuç Kartı */}
                  <div className={`rounded-2xl border p-4 ${sonucRenk}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <SonucIcon className="w-5 h-5" />
                      <span className="text-base font-bold">{kayit.testSonucu}</span>
                      {kayit.tespitEdilenMadde && (
                        <span className="text-sm font-medium opacity-80">— {kayit.tespitEdilenMadde}</span>
                      )}
                    </div>
                    {kayit.analizGuvenSkoru !== undefined && (
                      <div className="mt-1.5">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="opacity-70">Analiz Güven Skoru</span>
                          <span className="font-bold">%{kayit.analizGuvenSkoru}</span>
                        </div>
                        <div className="w-full h-2 bg-black/15 rounded-full overflow-hidden">
                          <div className="h-full bg-current rounded-full transition-all" style={{ width: `${kayit.analizGuvenSkoru}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Temel Bilgiler */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Temel Bilgiler</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { l: 'Personel', v: kayit.personelAdi },
                        { l: 'Numune Türü', v: kayit.numuneTuru },
                        { l: 'Lokasyon', v: kayit.lokasyon },
                        { l: 'Kontrol Noktası', v: kayit.kontrolNokta },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-secondary/50 rounded-xl p-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{l}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materyal Açıklaması */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Materyal Açıklaması</p>
                    <div className="bg-secondary/30 border border-border/50 rounded-xl p-3.5 text-sm text-foreground/85 leading-relaxed">
                      {kayit.sahisAciklamasi}
                    </div>
                  </div>

                  {/* Fotoğraf Alanı */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Test Fotoğrafı</p>
                    <div className="border border-dashed border-border/60 rounded-xl p-5 flex flex-col items-center gap-2 bg-secondary/20">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Camera className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-foreground/60 font-medium">Fotoğraf sisteme kaydedildi</p>
                        <p className="text-[10px] text-muted-foreground/40 mt-0.5">Operasyon arşivinde tutulmaktadır</p>
                      </div>
                    </div>
                  </div>

                  {/* Notlar */}
                  {kayit.notlar && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Personel Notları</p>
                      <div className="bg-secondary/30 border border-border/50 rounded-xl p-3.5 text-xs text-muted-foreground/90 leading-relaxed italic">
                        "{kayit.notlar}"
                      </div>
                    </div>
                  )}
                </>
              )}

              {aktifTab === 'kit' && (
                <>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Kit Bilgileri</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { l: 'Seri No', v: kayit.kitSeriNo },
                        { l: 'Son Kullanma', v: kayit.kitSKT || '—' },
                        { l: 'Panel Tipi', v: kayit.kitPanelTipi || '—' },
                        { l: 'Stok ID', v: kayit.stokId || '—' },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-secondary/50 rounded-xl p-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{l}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5 font-mono text-xs">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Görüntü Analizi</p>
                    <div className="glass-card p-4 space-y-3 rounded-xl">
                      {kayit.analizGuvenSkoru !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Güven Skoru</span>
                            <span className={`font-bold text-sm ${kayit.analizGuvenSkoru >= 75 ? 'text-emerald-400' : kayit.analizGuvenSkoru >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                              %{kayit.analizGuvenSkoru}
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${kayit.analizGuvenSkoru}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={`h-full rounded-full ${kayit.analizGuvenSkoru >= 75 ? 'bg-emerald-500' : kayit.analizGuvenSkoru >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            />
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-secondary/40 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">C Çizgisi</p>
                          <div className="w-2 h-8 bg-emerald-500 rounded-full mx-auto mb-1" />
                          <p className="text-xs font-bold text-emerald-400">Belirgin</p>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">T Çizgisi</p>
                          <div className={`w-2 h-8 rounded-full mx-auto mb-1 ${
                            kayit.testSonucu === 'Pozitif' ? 'bg-secondary' : kayit.testSonucu === 'Negatif' ? 'bg-emerald-500' : 'bg-amber-500/50'
                          }`} />
                          <p className={`text-xs font-bold ${kayit.testSonucu === 'Pozitif' ? 'text-red-400' : kayit.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {kayit.testSonucu === 'Pozitif' ? 'Görünmez' : kayit.testSonucu === 'Negatif' ? 'Belirgin' : 'Belirsiz'}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 bg-secondary/30 rounded-lg p-2.5 leading-relaxed">
                        Görüntü analizi tamamlandı. Sonuç personel tarafından sahada doğrulandı ve sistem kaydına alındı.
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
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Sevk Bilgileri</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { l: 'Takip No', v: labSevk.numuneTakipNo },
                            { l: 'Öncelik', v: labSevk.oncelik },
                            { l: 'Gönderen Birim', v: labSevk.sevkEdenBirim },
                            { l: 'Gönderim Yöntemi', v: labSevk.gonderimYontemi || '—' },
                            { l: 'Mühür No', v: labSevk.muhrEtiketNo || '—' },
                            { l: 'Delil Poşeti', v: labSevk.delilPosetiNo || '—' },
                          ].map(({ l, v }) => (
                            <div key={l} className="bg-secondary/50 rounded-xl p-3">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{l}</p>
                              <p className="text-xs font-medium text-foreground mt-0.5 font-mono truncate">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Süreç Takip Zinciri</p>
                        <LabTimeline mevcutDurum={labSevk.durum} olaylar={labSevk.olaylar} />
                      </div>
                    </>
                  ) : kayit.labSevkDurumu ? (
                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-cyan-400">Sevk Durumu</span>
                      </div>
                      <p className="text-sm text-foreground">{kayit.labSevkDurumu}</p>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                        <FlaskConical className="w-7 h-7 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Lab sevk kaydı yok</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Yalnızca pozitif kayıtlar laboratuvara sevk edilir</p>
                    </div>
                  )}
                </>
              )}

              {aktifTab === 'audit' && (
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">İşlem Geçmişi</p>
                  <AuditLogList logs={auditLogs} kayitNoFilter={kayit.id} />
                  {kayitAuditLogs.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground/60">Bu kayıt için henüz işlem geçmişi yok</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {qrAcik && (
        <QRModal
          title="Test Kayıt QR Kodu"
          value={`SENTEK:TEST:${kayit.id}`}
          subtitle={`${kayit.operasyonNo} · ${kayit.lokasyon}`}
          onClose={() => setQrAcik(false)}
        />
      )}

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
            qrDeger: `SENTEK:TEST:${kayit.id}`,
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

  const toplamPozitif = testKayitlari.filter(t => t.testSonucu === 'Pozitif').length;
  const toplamNegatif = testKayitlari.filter(t => t.testSonucu === 'Negatif').length;
  const toplamGecersiz = testKayitlari.filter(t => t.testSonucu === 'Geçersiz').length;
  const senkronBekleyen = testKayitlari.filter(t => t.syncDurumu === 'Senkron Bekliyor').length;

  return (
    <div className="p-6 space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test Kayıtları</h1>
          <p className="text-sm text-muted-foreground">{filtrelenmis.length} / {testKayitlari.length} kayıt gösteriliyor</p>
        </div>
      </div>

      {/* KPI Şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Toplam Kayıt', value: testKayitlari.length, renk: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/15' },
          { label: 'Pozitif', value: toplamPozitif, renk: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15' },
          { label: 'Negatif', value: toplamNegatif, renk: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
          { label: 'Geçersiz / Offline', value: toplamGecersiz + senkronBekleyen, renk: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
        ].map(({ label, value, renk, bg, border }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 border ${border}`}
          >
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${renk}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Arama + Filtre */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Operasyon no, lokasyon, kit seri no, personel, madde..."
            value={arama}
            onChange={e => setArama(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
          />
          {arama && (
            <button onClick={() => setArama('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltrePanelAcik(!filtrePanelAcik)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            filtrePanelAcik || sonucFiltre !== 'Tümü' || lokasyonFiltre !== 'Tümü'
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-border text-foreground hover:bg-secondary'
          }`}>
          <Filter className="w-4 h-4" />
          Filtre
          <ChevronDown className={`w-3 h-3 transition-transform ${filtrePanelAcik ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {filtrePanelAcik && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 rounded-xl space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Sonuç</p>
                <div className="flex gap-2 flex-wrap">
                  {['Tümü', 'Pozitif', 'Negatif', 'Geçersiz'].map(v => (
                    <button key={v} onClick={() => setSonucFiltre(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        sonucFiltre === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                      }`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Lokasyon</p>
                <div className="flex gap-2 flex-wrap">
                  {lokasyonlar.slice(0, 10).map(v => (
                    <button key={v} onClick={() => setLokasyonFiltre(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        lokasyonFiltre === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                      }`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              {(sonucFiltre !== 'Tümü' || lokasyonFiltre !== 'Tümü') && (
                <button
                  onClick={() => { setSonucFiltre('Tümü'); setLokasyonFiltre('Tümü'); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Filtreleri temizle
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste */}
      <div className="space-y-2">
        {filtrelenmis.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Shield className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Aramanızla eşleşen kayıt bulunamadı</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Filtre kriterlerini değiştirmeyi deneyin</p>
          </div>
        ) : (
          filtrelenmis.map((kayit, i) => {
            const borderColor = kayit.testSonucu === 'Pozitif' ? 'border-l-red-500' : kayit.testSonucu === 'Negatif' ? 'border-l-emerald-500' : 'border-l-amber-500';
            return (
              <motion.button
                key={kayit.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => setSeciliKayit(kayit)}
                className={`w-full glass-card p-4 text-left border-l-4 ${borderColor} hover:border-primary/40 transition-all group`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-bold font-mono text-primary">{kayit.operasyonNo}</span>
                      {kayit.syncDurumu === 'Senkron Bekliyor' && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5" /> Offline
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-xs text-muted-foreground">{kayit.lokasyon}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-xs text-muted-foreground">{kayit.numuneTuru}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] text-muted-foreground/60 font-mono">{kayit.kitSeriNo}</span>
                      {kayit.tespitEdilenMadde && (
                        <span className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />{kayit.tespitEdilenMadde}
                        </span>
                      )}
                      {kayit.labSevkId && (
                        <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" />Sevk Var
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <TestSonucBadge sonuc={kayit.testSonucu} />
                    <div className="flex items-center gap-2">
                      {kayit.analizGuvenSkoru !== undefined && (
                        <span className={`text-[11px] font-semibold ${
                          kayit.analizGuvenSkoru >= 75 ? 'text-emerald-400' : kayit.analizGuvenSkoru >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          %{kayit.analizGuvenSkoru}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground/60 mt-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {formatTarih(kayit.tarih)} · {kayit.personelAdi}
                </p>
              </motion.button>
            );
          })
        )}
      </div>

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
