import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

const LAST_SYNC_KEY = 'sentek_last_sync';

export function useSyncManager() {
  const [cevrimici, setCevrimiciState] = useState(navigator.onLine);
  const [sonSenkron, setSonSenkron] = useState<string | null>(
    localStorage.getItem(LAST_SYNC_KEY)
  );

  const bekleyenKayitlar = useLiveQuery(
    () => db.senkronKuyrugu.where('durum').equals('Senkron Bekliyor').toArray(),
    []
  );

  const bekleyenSayisi = bekleyenKayitlar?.length ?? 0;

  useEffect(() => {
    const handleOnline = () => setCevrimiciState(true);
    const handleOffline = () => setCevrimiciState(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setCevrimici = useCallback((durum: boolean) => {
    setCevrimiciState(durum);
  }, []);

  const senkronizeEt = useCallback(async () => {
    if (!cevrimici) return;

    const bekleyenler = await db.senkronKuyrugu
      .where('durum')
      .equals('Senkron Bekliyor')
      .toArray();

    if (bekleyenler.length === 0) return;

    await db.transaction('rw', [db.senkronKuyrugu, db.testKayitlari, db.auditLog, db.bildirimler], async () => {
      for (const kayit of bekleyenler) {
        await db.senkronKuyrugu.update(kayit.id, { durum: 'Senkronize Edildi' });
      }

      await db.testKayitlari
        .where('syncDurumu')
        .equals('Senkron Bekliyor')
        .modify({ syncDurumu: 'Senkronize Edildi' });

      const simdi = new Date().toISOString();
      for (const kayit of bekleyenler) {
        await db.bildirimler.add({
          id: `BLD-SYNC-${Date.now()}-${kayit.id}`,
          mesaj: `${kayit.aciklama} — merkeze başarıyla aktarıldı.`,
          tur: 'sync',
          tarih: simdi,
          okundu: false,
        });
        await db.auditLog.add({
          id: `AUD-SYNC-${Date.now()}-${kayit.id}`,
          islemTipi: 'Senkronize Edildi',
          tarih: simdi,
          kullanici: 'Sistem',
          rol: 'Sistem Yöneticisi',
          aciklama: `Offline kayıt merkeze aktarıldı: ${kayit.aciklama}`,
          kayitNo: kayit.id,
        });
      }
    });

    const now = new Date().toISOString();
    localStorage.setItem(LAST_SYNC_KEY, now);
    setSonSenkron(now);
  }, [cevrimici]);

  return {
    cevrimici,
    setCevrimici,
    bekleyenSayisi,
    sonSenkron,
    senkronizeEt,
  };
}
