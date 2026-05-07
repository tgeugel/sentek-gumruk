import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, RotateCcw, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import {
  getRaporAyarlari,
  saveRaporAyarlari,
  resetRaporAyarlari,
  VARSAYILAN_RAPOR_AYARLARI,
} from '../../lib/raporAyarlari';
import { RaporAyarlari, RaporGizlilikSeviyesi, RaporRenkTema } from '../../types';

const GIZLILIK_OPSIYONLARI: RaporGizlilikSeviyesi[] = ['GİZLİ', 'ÖZEL', 'HİZMETE ÖZEL', 'TASNİF DIŞI'];
const TEMA_OPSIYONLARI: { v: RaporRenkTema; l: string }[] = [
  { v: 'kurumsal', l: 'Kurumsal Mavi' },
  { v: 'koyu', l: 'Koyu Cyan' },
  { v: 'klasik', l: 'Klasik Gri' },
];

const inputBase =
  'w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-cyan-400/60 transition-colors';

export default function RaporAyarlariCard() {
  const { toast } = useToast();
  const { kullanici } = useAuth();
  const [ayarlar, setAyarlar] = useState<RaporAyarlari>(VARSAYILAN_RAPOR_AYARLARI);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediyor, setKaydediyor] = useState(false);

  const isAdmin = kullanici?.rol === 'Sistem Yöneticisi' || kullanici?.rol === 'Merkez Yönetici';

  useEffect(() => {
    getRaporAyarlari().then((a) => {
      setAyarlar(a);
      setYukleniyor(false);
    });
  }, []);

  const set = <K extends keyof RaporAyarlari>(key: K, value: RaporAyarlari[K]) =>
    setAyarlar((a) => ({ ...a, [key]: value }));

  const handleKaydet = async () => {
    if (!isAdmin) {
      toast({ title: 'Yetkisiz işlem', description: 'Yalnızca yöneticiler rapor ayarlarını değiştirebilir.', variant: 'destructive' });
      return;
    }
    setKaydediyor(true);
    try {
      const { id: _id, guncellemeTarihi: _g, ...rest } = ayarlar;
      const yeni = await saveRaporAyarlari(rest);
      setAyarlar(yeni);
      toast({ title: 'Rapor ayarları kaydedildi', description: 'Yeni PDF\'ler güncel ayarlarla üretilecek.' });
    } finally {
      setKaydediyor(false);
    }
  };

  const handleReset = async () => {
    if (!isAdmin) return;
    const reset = await resetRaporAyarlari();
    setAyarlar(reset);
    toast({ title: 'Varsayılanlar geri yüklendi' });
  };

  const addImzaSatiri = () => set('imzaSatirlari', [...ayarlar.imzaSatirlari, { unvan: 'YENİ ROL', ad: '' }]);
  const removeImzaSatiri = (i: number) => set('imzaSatirlari', ayarlar.imzaSatirlari.filter((_, idx) => idx !== i));
  const updateImzaSatiri = (i: number, field: 'unvan' | 'ad', val: string) =>
    set('imzaSatirlari', ayarlar.imzaSatirlari.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));

  // GİZLİ kapsamdaki rapor ayarları yalnızca yöneticiler için görünür
  if (!isAdmin) return null;

  if (yukleniyor) {
    return (
      <div className="glass-card rounded-xl border border-card-border p-5 text-sm text-muted-foreground">
        Rapor ayarları yükleniyor…
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl border border-card-border p-5 space-y-5"
      data-testid="card-rapor-ayarlari"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-foreground">PDF Rapor Ayarları</p>
        </div>
        {!isAdmin && (
          <span className="flex items-center gap-1 text-[11px] text-amber-400">
            <ShieldCheck className="w-3 h-3" /> Salt görüntüleme — düzenleme yöneticiye özel
          </span>
        )}
      </div>

      {/* Kurum bilgileri */}
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Kurum Bilgileri</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Kurum Adı">
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.kurumAdi} onChange={(e) => set('kurumAdi', e.target.value)} data-testid="input-kurumAdi" />
          </Field>
          <Field label="Birim Adı">
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.birimAdi} onChange={(e) => set('birimAdi', e.target.value)} data-testid="input-birimAdi" />
          </Field>
          <Field label="Kurum Adresi" full>
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.kurumAdresi} onChange={(e) => set('kurumAdresi', e.target.value)} />
          </Field>
          <Field label="İletişim">
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.iletisim} onChange={(e) => set('iletisim', e.target.value)} />
          </Field>
          <Field label="Belge No Ön Eki">
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.belgeNoOnEki} onChange={(e) => set('belgeNoOnEki', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Gizlilik & Görsel */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Gizlilik ve Görsel Tema</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Gizlilik Seviyesi">
            <select className={inputBase} disabled={!isAdmin} value={ayarlar.gizlilikSeviyesi} onChange={(e) => set('gizlilikSeviyesi', e.target.value as RaporGizlilikSeviyesi)} data-testid="select-gizlilik">
              {GIZLILIK_OPSIYONLARI.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Watermark Metni">
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.watermarkMetin} onChange={(e) => set('watermarkMetin', e.target.value)} placeholder="Boş bırakılırsa gizlilik seviyesi" />
          </Field>
          <Field label="Renk Teması">
            <select className={inputBase} disabled={!isAdmin} value={ayarlar.renkTema} onChange={(e) => set('renkTema', e.target.value as RaporRenkTema)} data-testid="select-tema">
              {TEMA_OPSIYONLARI.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </Field>
          <Field label="Üst Bilgi (Alt Başlık)" full>
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.ustBilgi} onChange={(e) => set('ustBilgi', e.target.value)} />
          </Field>
          <Field label="Alt Bilgi (Footer)" full>
            <input className={inputBase} disabled={!isAdmin} value={ayarlar.altBilgi} onChange={(e) => set('altBilgi', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Bölüm görünürlüğü */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Rapor Bölümleri</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {([
            ['kapakSayfasiGoster', 'Kapak Sayfası'],
            ['watermarkGoster', 'Watermark Damgası'],
            ['panelTablosuGoster', 'Panel Sonuç Tablosu'],
            ['aiDetayGoster', 'AI Analiz Detayı'],
            ['fotoGoster', 'Kit Fotoğraf Kanıtı'],
            ['zincirGoster', 'İzlenebilirlik Zinciri'],
            ['qrGoster', 'Doğrulama QR'],
          ] as [keyof RaporAyarlari, string][]).map(([key, label]) => (
            <Toggle key={key} label={label} disabled={!isAdmin} value={ayarlar[key] as boolean} onChange={(v) => set(key, v as never)} testId={`toggle-${String(key)}`} />
          ))}
        </div>
      </div>

      {/* İmza satırları */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">İmza Satırları</p>
          <button
            type="button"
            disabled={!isAdmin || ayarlar.imzaSatirlari.length >= 4}
            onClick={addImzaSatiri}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-cyan-400/40 text-cyan-400 text-xs hover:bg-cyan-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
            data-testid="button-imza-ekle"
          >
            <Plus className="w-3 h-3" /> Satır Ekle
          </button>
        </div>
        <div className="space-y-2">
          {ayarlar.imzaSatirlari.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className={inputBase + ' flex-1'}
                placeholder="ÜNVAN"
                disabled={!isAdmin}
                value={s.unvan}
                onChange={(e) => updateImzaSatiri(i, 'unvan', e.target.value)}
                data-testid={`input-imza-unvan-${i}`}
              />
              <input
                className={inputBase + ' flex-1'}
                placeholder="Ad Soyad (boş bırakılırsa imza alanı boş kalır)"
                disabled={!isAdmin}
                value={s.ad}
                onChange={(e) => updateImzaSatiri(i, 'ad', e.target.value)}
              />
              <button
                type="button"
                disabled={!isAdmin || ayarlar.imzaSatirlari.length <= 1}
                onClick={() => removeImzaSatiri(i)}
                className="p-2 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aksiyon */}
      <div className="flex flex-col md:flex-row gap-2 pt-3 border-t border-border/40">
        <motion.button
          whileHover={{ scale: isAdmin ? 1.01 : 1 }}
          whileTap={{ scale: isAdmin ? 0.99 : 1 }}
          disabled={!isAdmin || kaydediyor}
          onClick={handleKaydet}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,212,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-rapor-ayarlari-kaydet"
        >
          <Save className="w-4 h-4" />
          {kaydediyor ? 'Kaydediliyor…' : 'Rapor Ayarlarını Kaydet'}
        </motion.button>
        <button
          type="button"
          disabled={!isAdmin}
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="button-rapor-ayarlari-sifirla"
        >
          <RotateCcw className="w-4 h-4" /> Varsayılana Dön
        </button>
      </div>

      <p className="text-[11px] text-muted-foreground pt-1">
        Son güncelleme: {new Date(ayarlar.guncellemeTarihi).toLocaleString('tr-TR')} • Değişiklikler bundan sonra üretilen tüm PDF raporlara uygulanır.
      </p>
    </motion.div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-[11px] text-muted-foreground mb-1 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange, disabled, testId }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; testId?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!value)}
      data-testid={testId}
      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors ${value ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300' : 'border-border bg-secondary/30 text-muted-foreground'} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="font-medium text-left">{label}</span>
      <span className={`w-8 h-4 rounded-full relative ${value ? 'bg-primary' : 'bg-secondary border border-border'}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-4' : 'left-0.5'}`} />
      </span>
    </button>
  );
}
