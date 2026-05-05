import { ShieldOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface UnauthorizedPageProps {
  ekranAdi?: string;
}

export function UnauthorizedPage({ ekranAdi }: UnauthorizedPageProps) {
  const { kullanici } = useAuth();

  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <ShieldOff className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Erişim Yetkisi Yok</h2>
        <p className="text-sm text-muted-foreground mb-1">
          {ekranAdi
            ? <><span className="font-semibold text-foreground">"{ekranAdi}"</span> ekranı için</>
            : 'Bu ekran için'
          } yetkiniz bulunmamaktadır.
        </p>
        {kullanici && (
          <p className="text-xs text-muted-foreground/70 mt-3 bg-secondary/30 rounded-xl px-3 py-2">
            Mevcut rol: <span className="font-semibold text-foreground">{kullanici.rol}</span>
            <br />Lütfen sistem yöneticinizle iletişime geçin.
          </p>
        )}
      </motion.div>
    </div>
  );
}
