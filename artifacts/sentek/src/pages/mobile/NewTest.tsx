import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Camera, AlertTriangle, Zap, Activity } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { TestSonucu } from '../../types';
import { useToast } from '../../hooks/use-toast';

const LOKASYONLAR = ['Sınır Kapısı A', 'Liman Kontrol Noktası', 'Antrepo Bölgesi', 'Mobil Saha Ekibi', 'Araç Arama Noktası'];
const KONTROL_NOKTALARI: Record<string, string[]> = {
  'Sınır Kapısı A': ['Peron 1', 'Peron 2', 'Peron 3', 'TIR Parkı', 'Yolcu Kapısı'],
  'Liman Kontrol Noktası': ['Konteyner Sahası', 'Ro-Ro Terminali', 'Gemi Ambarı', 'Konteyner Limanı'],
  'Antrepo Bölgesi': ['Depo A', 'Depo B', 'Depo Girişi', 'İç Hat Terminal'],
  'Mobil Saha Ekibi': ['Güney Güzergah', 'Kuzey Güzergah', 'Araç Arama Noktası 2'],
  'Araç Arama Noktası': ['Kuzey Hat', 'Orta Hat', 'Güney Hat'],
};
const NUMUNE_TURLERI = [
  'Tır yedek yakıt deposu', 'Emdirilmiş kumaş', 'Emdirilmiş kağıt', 'Emdirilmiş pamuk',
  'Sıvı numune', 'Toz madde', 'Araç içi yüzey sürüntüsü', 'Paket / koli içeriği',
  'Konteyner yüzeyi', 'Bagaj / eşya içi numune', 'Diğer',
];
const MADDELER = ['Kokain analogu', 'Eroin türevi', 'Metamfetamin', 'Amfetamin grubu', 'Esrar türevi', 'Fentanil türevi', 'GHB benzeri madde', 'Sentetik opioid', 'Bilinmiyor'];

const ADIMLAR = [
  'Lokasyon', 'Numune Türü', 'Malzeme Açıklama', 'Kit Bilgileri',
  'Fotoğraf', 'AI Analiz', 'Sonuç', 'Tespit & Not', 'Tamamla'
];

interface FormData {
  lokasyon: string;
  kontrolNokta: string;
  numuneTuru: string;
  sahisAciklamasi: string;
  kitSeriNo: string;
  kitSKT: string;
  fotografYuklendi: boolean;
  testSonucu: TestSonucu | '';
  tespitEdilenMadde: string;
  notlar: string;
}

export default function NewTest() {
  const [adim, setAdim] = useState(0);
  const [form, setForm] = useState<FormData>({
    lokasyon: '', kontrolNokta: '', numuneTuru: '', sahisAciklamasi: '',
    kitSeriNo: '', kitSKT: '', fotografYuklendi: false, testSonucu: '',
    tespitEdilenMadde: '', notlar: '',
  });
  const [analizTamamlandi, setAnalizTamamlandi] = useState(false);
  const [analizYukleniyor, setAnalizYukleniyor] = useState(false);
  const [sevkBaslatildi, setSevkBaslatildi] = useState(false);
  const { testKaydiEkle, labSevkEkle } = useData();
  const { kullanici } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const geriGit = () => setAdim(a => Math.max(0, a - 1));
  const ileriGit = () => setAdim(a => Math.min(ADIMLAR.length - 1, a + 1));

  const baslatAnaliz = async () => {
    setAnalizYukleniyor(true);
    await new Promise(r => setTimeout(r, 2000));
    setAnalizYukleniyor(false);
    setAnalizTamamlandi(true);
  };

  const kaydiTamamla = () => {
    const kayit = testKaydiEkle({
      operasyonNo: `OPS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      tarih: new Date().toISOString(),
      lokasyon: form.lokasyon,
      kontrolNokta: form.kontrolNokta,
      numuneTuru: form.numuneTuru,
      sahisAciklamasi: form.sahisAciklamasi,
      kitSeriNo: form.kitSeriNo,
      kitSKT: form.kitSKT,
      testSonucu: form.testSonucu as TestSonucu,
      tespitEdilenMadde: form.tespitEdilenMadde || undefined,
      notlar: form.notlar || undefined,
      personelAdi: kullanici?.ad || 'Bilinmiyor',
      labSevkDurumu: form.testSonucu === 'Pozitif' ? undefined : undefined,
    });
    toast({ title: 'Test kaydı oluşturuldu', description: kayit.operasyonNo });
    ileriGit();
  };

  const sevkBaslat = () => {
    labSevkEkle({
      operasyonNo: `OPS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      testKaydiId: 'yeni',
      numuneTuru: form.numuneTuru,
      onTaramaSonucu: 'Pozitif',
      tespitEdilenMadde: form.tespitEdilenMadde,
      muhrEtiketNo: `MHR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      delilPosetiNo: `DP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      sevkEdenBirim: form.lokasyon,
      gonderimYontemi: 'Güvenli Kurye',
      tahminiVaris: new Date(Date.now() + 86400000).toISOString(),
      durum: 'Sevk Kaydı Oluşturuldu',
      notlar: form.notlar,
      oncelik: 'Normal',
    });
    setSevkBaslatildi(true);
    toast({ title: 'Lab sevk kaydı oluşturuldu', description: 'Numune sevk sürecine alındı.' });
  };

  const simulasyonSonucu = form.testSonucu || 'Pozitif';

  return (
    <div className="p-4 space-y-4">
      {/* Step Indicator */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-base font-bold text-foreground">Yeni Test Kaydı</h1>
          <span className="text-xs text-muted-foreground">{adim + 1} / {ADIMLAR.length}</span>
        </div>
        <div className="flex gap-1">
          {ADIMLAR.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= adim ? 'bg-primary' : 'bg-secondary'}`}
              animate={{ scaleX: i <= adim ? 1 : 0.5 }}
            />
          ))}
        </div>
        <p className="text-xs text-primary mt-1 font-medium">{ADIMLAR[adim]}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={adim}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Adim 0: Lokasyon */}
          {adim === 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Test Lokasyonu</label>
              <div className="grid grid-cols-1 gap-2">
                {LOKASYONLAR.map(lok => (
                  <button
                    key={lok}
                    data-testid={`btn-lokasyon-${lok}`}
                    onClick={() => setForm(f => ({ ...f, lokasyon: lok, kontrolNokta: '' }))}
                    className={`p-4 rounded-xl text-left border transition-all ${form.lokasyon === lok ? 'bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(0,212,255,0.15)]' : 'glass-card border-card-border text-foreground hover:border-primary/30'}`}
                  >
                    <span className="font-medium text-sm">{lok}</span>
                  </button>
                ))}
              </div>
              {form.lokasyon && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Kontrol Noktası</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(KONTROL_NOKTALARI[form.lokasyon] || []).map(kn => (
                      <button
                        key={kn}
                        onClick={() => setForm(f => ({ ...f, kontrolNokta: kn }))}
                        className={`p-3 rounded-lg text-xs font-medium text-center border transition-all ${form.kontrolNokta === kn ? 'bg-primary/10 border-primary text-primary' : 'glass-card border-card-border text-muted-foreground hover:text-foreground'}`}
                      >
                        {kn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Adim 1: Numune Türü */}
          {adim === 1 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Numune Türü Seçin</label>
              {NUMUNE_TURLERI.map(tur => (
                <button
                  key={tur}
                  data-testid={`btn-numune-${tur}`}
                  onClick={() => setForm(f => ({ ...f, numuneTuru: tur }))}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${form.numuneTuru === tur ? 'bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(0,212,255,0.12)]' : 'glass-card border-card-border text-foreground hover:border-primary/30'}`}
                >
                  <span className="font-medium text-sm">{tur}</span>
                </button>
              ))}
            </div>
          )}

          {/* Adim 2: Açıklama */}
          {adim === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Şüpheli Materyal Açıklaması</label>
                <textarea
                  data-testid="input-aciklama"
                  value={form.sahisAciklamasi}
                  onChange={e => setForm(f => ({ ...f, sahisAciklamasi: e.target.value }))}
                  rows={5}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Şüpheli materyalin görünümü, kokusu, bulunduğu yer ve koşullar hakkında açıklama girin..."
                />
              </div>
            </div>
          )}

          {/* Adim 3: Kit Bilgileri */}
          {adim === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Test Kiti Seri No</label>
                <input
                  data-testid="input-seri-no"
                  type="text"
                  value={form.kitSeriNo}
                  onChange={e => setForm(f => ({ ...f, kitSeriNo: e.target.value }))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="SN-XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Son Kullanma Tarihi</label>
                <input
                  data-testid="input-skt"
                  type="date"
                  value={form.kitSKT}
                  onChange={e => setForm(f => ({ ...f, kitSKT: e.target.value }))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Adim 4: Fotoğraf */}
          {adim === 4 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Test Fotoğrafı</label>
              <div
                onClick={() => setForm(f => ({ ...f, fotografYuklendi: true }))}
                data-testid="area-fotograf"
                className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  form.fotografYuklendi
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    : 'bg-secondary/30 border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {form.fotografYuklendi ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-3">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="font-semibold">Fotoğraf yüklendi</p>
                    <p className="text-xs opacity-70 mt-1">test_kit_foto.jpg</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="font-semibold">Fotoğraf Yükle</p>
                    <p className="text-xs opacity-60 mt-1">Dokunun veya kamera kullanın</p>
                  </>
                )}
              </div>
              {form.fotografYuklendi && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setForm(f => ({ ...f, fotografYuklendi: false }))}
                  className="w-full py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
                >
                  Fotoğrafı kaldır
                </motion.button>
              )}
            </div>
          )}

          {/* Adim 5: AI Analiz */}
          {adim === 5 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kit Görüntü Analizi</label>
              <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
                {/* Image preview area */}
                <div className="bg-secondary/50 aspect-video flex items-center justify-center relative">
                  {form.fotografYuklendi ? (
                    <div className="text-center text-muted-foreground">
                      <div className="w-24 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-xs">Test kit görüntüsü</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground/50">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-xs">Fotoğraf yüklenmedi</p>
                    </div>
                  )}
                </div>

                {!analizTamamlandi ? (
                  <div className="p-5 space-y-3">
                    {!analizYukleniyor ? (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={baslatAnaliz}
                        data-testid="button-analiz-baslat"
                        className="w-full py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        AI Analiz Başlat
                      </motion.button>
                    ) : (
                      <div className="space-y-3 py-2">
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative w-8 h-8">
                            <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
                            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          </div>
                          <p className="text-sm text-cyan-400 font-medium">Görüntü analiz ediliyor...</p>
                        </div>
                        {['Kontrol çizgisi tespit ediliyor', 'Test çizgisi analiz ediliyor', 'Panel doğrulanıyor', 'Sonuç hesaplanıyor'].map((adm, i) => (
                          <motion.div
                            key={adm}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.4 }}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
                            {adm}
                          </motion.div>
                        ))}
                        <p className="text-xs text-center text-muted-foreground/50 mt-2">AI analizi simüle edilmektedir</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 space-y-3"
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Analiz Sonuçları</p>
                    {[
                      { label: 'Algılanan Panel', deger: '5-Panel (KOK, ERO, MET, AMP, THC)', renk: 'text-cyan-400' },
                      { label: 'Kontrol Çizgisi', deger: 'Belirgin ✓', renk: 'text-emerald-400' },
                      { label: 'Test Çizgisi', deger: 'Pozitif ✓', renk: 'text-red-400' },
                      { label: 'Güven Skoru', deger: '%87', renk: 'text-amber-400' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-1 border-b border-border/30">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className={`text-xs font-semibold ${item.renk}`}>{item.deger}</span>
                      </div>
                    ))}
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Önerilen Sonuç</p>
                      <p className="text-sm font-bold text-red-400">POZİTİF</p>
                    </div>
                    <p className="text-xs text-muted-foreground/50 text-center">AI analizi simüle edilmektedir — Manuel doğrulama gereklidir</p>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Adim 6: Sonuç */}
          {adim === 6 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Test Sonucunu Doğrulayın</label>
              {(['Pozitif', 'Negatif', 'Geçersiz'] as TestSonucu[]).map(sonuc => {
                const renkler = {
                  'Pozitif': 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_16px_rgba(239,68,68,0.2)]',
                  'Negatif': 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.2)]',
                  'Geçersiz': 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.2)]',
                };
                const renklerPassif = {
                  'Pozitif': 'glass-card border-card-border text-muted-foreground hover:border-red-500/30',
                  'Negatif': 'glass-card border-card-border text-muted-foreground hover:border-emerald-500/30',
                  'Geçersiz': 'glass-card border-card-border text-muted-foreground hover:border-amber-500/30',
                };
                return (
                  <motion.button
                    key={sonuc}
                    data-testid={`btn-sonuc-${sonuc.toLowerCase()}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setForm(f => ({ ...f, testSonucu: sonuc }))}
                    className={`w-full p-5 rounded-2xl text-center border-2 font-bold text-xl transition-all ${form.testSonucu === sonuc ? renkler[sonuc] : renklerPassif[sonuc]}`}
                  >
                    {sonuc}
                  </motion.button>
                );
              })}
              {form.testSonucu === 'Geçersiz' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-400">Geçersiz sonuçlar yeni kit ile tekrarlanmalıdır. Kit bilgilerini kontrol edin.</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Adim 7: Tespit & Not */}
          {adim === 7 && (
            <div className="space-y-3">
              {form.testSonucu === 'Pozitif' && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tespit Edilen Madde / Panel</label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {MADDELER.map(madde => (
                      <button
                        key={madde}
                        onClick={() => setForm(f => ({ ...f, tespitEdilenMadde: madde }))}
                        className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${form.tespitEdilenMadde === madde ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'glass-card border-card-border text-muted-foreground hover:text-foreground'}`}
                      >
                        {madde}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Notlar (Opsiyonel)</label>
                <textarea
                  data-testid="input-notlar"
                  value={form.notlar}
                  onChange={e => setForm(f => ({ ...f, notlar: e.target.value }))}
                  rows={4}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Ek notlar, gözlemler..."
                />
              </div>
            </div>
          )}

          {/* Adim 8: Tamamla */}
          {adim === 8 && (
            <div className="space-y-4">
              {!sevkBaslatildi ? (
                <>
                  <div className="glass-card rounded-2xl border border-card-border p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Test Özeti</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        form.testSonucu === 'Pozitif' ? 'bg-red-500/15 text-red-400' :
                        form.testSonucu === 'Negatif' ? 'bg-emerald-500/15 text-emerald-400' :
                        'bg-amber-500/15 text-amber-400'
                      }`}>{form.testSonucu}</span>
                    </div>
                    {[
                      { label: 'Lokasyon', deger: form.lokasyon },
                      { label: 'Kontrol Noktası', deger: form.kontrolNokta },
                      { label: 'Numune Türü', deger: form.numuneTuru },
                      { label: 'Kit Seri No', deger: form.kitSeriNo },
                      { label: 'Tespit Edilen', deger: form.tespitEdilenMadde || '-' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs border-b border-border/30 pb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground font-medium text-right max-w-[60%]">{item.deger}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="button-kayit-tamamla"
                    onClick={kaydiTamamla}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-[0_0_24px_rgba(0,212,255,0.25)]"
                  >
                    Kaydı Tamamla
                  </motion.button>

                  {form.testSonucu === 'Pozitif' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-xl border border-red-500/30 p-4"
                    >
                      <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">Pozitif Sonuç Tespit Edildi</p>
                      <p className="text-xs text-muted-foreground mb-3">Bu numune laboratuvara sevk edilmesi gerekiyor. Sevk kaydı oluşturmak ister misiniz?</p>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid="button-lab-sevk"
                        onClick={sevkBaslat}
                        className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        Laboratuvara Sevk Et
                      </motion.button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">Tamamlandı</p>
                    <p className="text-sm text-muted-foreground mt-1">Test kaydı ve lab sevk kaydı oluşturuldu.</p>
                  </div>
                  <button
                    onClick={() => setLocation('/mobile')}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
                  >
                    Ana Ekrana Dön
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {adim < 8 && (
        <div className="flex gap-3 pt-2">
          {adim > 0 && (
            <button
              onClick={geriGit}
              className="flex-1 py-3.5 rounded-xl glass-card border border-card-border text-foreground font-semibold flex items-center justify-center gap-2 hover:border-primary/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Geri
            </button>
          )}
          <button
            data-testid="button-ileri"
            onClick={ileriGit}
            disabled={
              (adim === 0 && (!form.lokasyon || !form.kontrolNokta)) ||
              (adim === 1 && !form.numuneTuru) ||
              (adim === 2 && !form.sahisAciklamasi) ||
              (adim === 3 && (!form.kitSeriNo || !form.kitSKT)) ||
              (adim === 5 && !analizTamamlandi) ||
              (adim === 6 && !form.testSonucu)
            }
            className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(0,212,255,0.2)] transition-all"
          >
            İleri
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
