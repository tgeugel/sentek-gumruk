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
        <div className="relative flex-shrink-0">
          <div className={`w-full h-1.5 ${
            kayit.testSonucu === 'Pozitif' ? 'bg-destructive/50' : 
            kayit.testSonucu === 'Negatif' ? 'bg-emerald-500/50' : 'bg-amber-500/50'
          }`} />
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Operasyon Dosyası</p>
                <h2 className="text-2xl font-mono font-bold text-primary leading-none">{kayit.operasyonNo}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={
                    kayit.testSonucu === 'Pozitif' ? 'badge-pozitif' :
                    kayit.testSonucu === 'Negatif' ? 'badge-negatif' : 'badge-gecersiz'
                  }>
                    {kayit.testSonucu}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{formatTarih(kayit.tarih)}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={handleQrGoster}
                className="flex-1 py-2.5 bg-secondary/50 border border-border text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary transition-all">
                <QrCode className="w-4 h-4" /> QR KOD
              </button>
              <button onClick={handleEtiket}
                className="flex-1 py-2.5 bg-secondary/50 border border-border text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary transition-all">
                <Printer className="w-4 h-4" /> ETİKET
              </button>
              <button
                className="flex-1 py-2.5 bg-secondary/50 border border-border text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary transition-all">
                <FileText className="w-4 h-4" /> RAPOR
              </button>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex px-6 gap-2 mb-4">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setAktifTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[10px] font-bold transition-all border ${
                aktifTab === tab.key 
                  ? 'bg-primary/10 border-primary/20 text-primary shadow-sm shadow-primary/5' 
                  : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={aktifTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {aktifTab === 'genel' && (
                <>
                  <div className="glass-card-inset p-4">
                    <p className="section-title mb-3">Temel Bilgiler</p>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      {[
                        { l: 'Personel', v: kayit.personelAdi },
                        { l: 'Numune Türü', v: kayit.numuneTuru },
                        { l: 'Lokasyon', v: kayit.lokasyon },
                        { l: 'Kontrol Noktası', v: kayit.kontrolNokta },
                      ].map(({ l, v }) => (
                        <div key={l}>
                          <p className="section-title !text-[9px] !text-muted-foreground/60">{l}</p>
                          <p className="text-sm font-medium text-foreground">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card-inset p-4">
                    <p className="section-title mb-3">Analiz Detayları</p>
                    <div className="space-y-4">
                      {kayit.tespitEdilenMadde && (
                        <div>
                          <p className="section-title !text-[9px] !text-muted-foreground/60">Tespit Edilen Madde</p>
                          <p className="text-sm font-bold text-destructive">{kayit.tespitEdilenMadde}</p>
                        </div>
                      )}
                      <div>
                        <p className="section-title !text-[9px] !text-muted-foreground/60">Materyal Açıklaması</p>
                        <p className="text-sm text-foreground/80 mt-1">{kayit.sahisAciklamasi}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-inset p-4">
                    <p className="section-title mb-3">Test Fotoğrafı</p>
                    <div className="aspect-video bg-black/40 rounded-lg flex flex-col items-center justify-center border border-border/50">
                      <Camera className="w-8 h-8 text-muted-foreground/30 mb-2" />
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Arşiv Görüntüsü Mevcut</p>
                    </div>
                  </div>

                  {kayit.notlar && (
                    <div className="glass-card-inset p-4 border-l-2 border-l-primary/30">
                      <p className="section-title mb-2">Personel Notu</p>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">"{kayit.notlar}"</p>
                    </div>
                  )}
                </>
              )}

              {aktifTab === 'kit' && (
                <div className="space-y-4">
                  <div className="glass-card-inset p-4">
                    <p className="section-title mb-4">Kit Tanımlama</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { l: 'SERİ NO', v: kayit.kitSeriNo },
                        { l: 'SKT', v: kayit.kitSKT || '—' },
                        { l: 'PANEL TİPİ', v: kayit.kitPanelTipi || '—' },
                        { l: 'STOK ID', v: kayit.stokId || '—' },
                      ].map(({ l, v }) => (
                        <div key={l}>
                          <p className="section-title !text-[9px] !text-muted-foreground/60">{l}</p>
                          <p className="text-xs font-mono font-bold text-foreground mt-0.5">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card-inset p-4">
                    <p className="section-title mb-4">AI Görüntü Analizi</p>
                    {kayit.analizGuvenSkoru !== undefined && (
                      <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold text-muted-foreground">GÜVEN SKORU</span>
                          <span className={`text-lg font-mono font-bold ${
                            kayit.analizGuvenSkoru > 70 ? 'text-emerald-400' : 
                            kayit.analizGuvenSkoru > 50 ? 'text-amber-400' : 'text-destructive'
                          }`}>%{kayit.analizGuvenSkoru}</span>
                        </div>
                        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${kayit.analizGuvenSkoru}%` }}
                            className={`h-full rounded-full ${
                              kayit.analizGuvenSkoru > 70 ? 'bg-emerald-500' : 
                              kayit.analizGuvenSkoru > 50 ? 'bg-amber-500' : 'bg-destructive'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
                        <p className="section-title !text-[8px] mb-2">C HATTI</p>
                        <div className="w-1.5 h-6 bg-emerald-500 mx-auto rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <p className="text-[10px] font-bold text-emerald-400 mt-2 uppercase">Belirgin</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
                        <p className="section-title !text-[8px] mb-2">T HATTI</p>
                        <div className={`w-1.5 h-6 mx-auto rounded-full ${
                          kayit.testSonucu === 'Pozitif' ? 'bg-white/5' : 
                          kayit.testSonucu === 'Negatif' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                          'bg-amber-500/30'
                        }`} />
                        <p className={`text-[10px] font-bold mt-2 uppercase ${
                          kayit.testSonucu === 'Pozitif' ? 'text-muted-foreground/40' : 
                          kayit.testSonucu === 'Negatif' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {kayit.testSonucu === 'Pozitif' ? 'Görünmez' : kayit.testSonucu === 'Negatif' ? 'Belirgin' : 'Belirsiz'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
    <div className="page-enter p-6 space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Test Kayıtları</h1>
          <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-xs font-bold">
            {filtrelenmis.length} / {testKayitlari.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
            Yeni Kayıt
          </button>
        </div>
      </div>

      {/* KPI Şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOPLAM KAYIT', value: testKayitlari.length, renk: 'text-primary', border: 'border-primary/10' },
          { label: 'POZİTİF', value: toplamPozitif, renk: 'text-destructive', border: 'border-destructive/10' },
          { label: 'NEGATİF', value: toplamNegatif, renk: 'text-emerald-400', border: 'border-emerald-500/10' },
          { label: 'UYARI / OFFLINE', value: toplamGecersiz + senkronBekleyen, renk: 'text-amber-400', border: 'border-amber-500/10' },
        ].map(({ label, value, renk, border }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 border ${border}`}
          >
            <p className="section-title mb-1">{label}</p>
            <p className={`text-3xl font-bold font-mono ${renk}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card-elevated overflow-hidden flex flex-col">
        {/* Arama + Filtre */}
        <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center bg-card/50">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Operasyon no, lokasyon, kit seri no, personel..."
              value={arama}
              onChange={e => setArama(e.target.value)}
              className="premium-input pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="glass-card-inset flex items-center px-3 py-1.5 gap-2">
              <span className="section-title !text-[10px]">SONUÇ:</span>
              <select 
                value={sonucFiltre} 
                onChange={(e) => setSonucFiltre(e.target.value)}
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
              >
                {['Tümü', 'Pozitif', 'Negatif', 'Geçersiz'].map(s => (
                  <option key={s} value={s} className="bg-card">{s}</option>
                ))}
              </select>
            </div>

            <div className="glass-card-inset flex items-center px-3 py-1.5 gap-2">
              <span className="section-title !text-[10px]">LOKASYON:</span>
              <select 
                value={lokasyonFiltre} 
                onChange={(e) => setLokasyonFiltre(e.target.value)}
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
              >
                {lokasyonlar.map(l => (
                  <option key={l} value={l} className="bg-card">{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th className="text-left">Operasyon No</th>
                <th className="text-left">Lokasyon</th>
                <th className="text-left">Numune Türü</th>
                <th className="text-center">Sonuç</th>
                <th className="text-left">Tarih</th>
                <th className="text-left">Güven Skoru</th>
                <th className="text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmis.map((kayit) => (
                <tr 
                  key={kayit.id} 
                  onClick={() => setSeciliKayit(kayit)}
                  className="cursor-pointer group"
                >
                  <td className="font-mono font-bold text-primary">{kayit.operasyonNo}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">{kayit.lokasyon}</span>
                      <span className="text-[10px] text-muted-foreground">{kayit.kontrolNokta}</span>
                    </div>
                  </td>
                  <td>{kayit.numuneTuru}</td>
                  <td className="text-center">
                    <span className={
                      kayit.testSonucu === 'Pozitif' ? 'badge-pozitif' :
                      kayit.testSonucu === 'Negatif' ? 'badge-negatif' : 'badge-gecersiz'
                    }>
                      {kayit.testSonucu}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{formatTarih(kayit.tarih)}</td>
                  <td className="min-w-[120px]">
                    {kayit.analizGuvenSkoru !== undefined ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span>%{kayit.analizGuvenSkoru}</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              kayit.analizGuvenSkoru > 70 ? 'bg-emerald-500' :
                              kayit.analizGuvenSkoru > 50 ? 'bg-amber-500' : 'bg-destructive'
                            }`}
                            style={{ width: `${kayit.analizGuvenSkoru}%` }}
                          />
                        </div>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="text-right">
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtrelenmis.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-muted-foreground">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
