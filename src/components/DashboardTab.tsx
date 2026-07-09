import React, { useRef } from 'react';
import { 
  Database, RefreshCw, Upload, Scale, Home, Star, Cloud, 
  Calendar, Zap, TrendingUp, Compass, ArrowRight, CheckCircle
} from 'lucide-react';
import { Citizen, ActivityLog, TabId } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardTabProps {
  csvStatus: 'connecting' | 'connected' | 'fallback';
  csvMessage: string;
  totalWeight: number;
  totalPoints: number;
  activeCount: number;
  citizenCount: number;
  co2Saved: number;
  activityLogs: ActivityLog[];
  onUploadClick: () => void;
  onRefreshClick: () => void;
  onSwitchTab: (tab: TabId) => void;
  currentUser?: Citizen | null;
  onOpenOnboarding?: () => void;
  onClearProfile?: () => void;
}

export default function DashboardTab({
  csvStatus,
  csvMessage,
  totalWeight,
  totalPoints,
  activeCount,
  citizenCount,
  co2Saved,
  activityLogs,
  onUploadClick,
  onRefreshClick,
  onSwitchTab,
  currentUser,
  onOpenOnboarding,
  onClearProfile,
}: DashboardTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = () => {
    if (csvStatus === 'connected') return 'bg-brand-primary';
    if (csvStatus === 'connecting') return 'bg-amber-500 animate-pulse';
    return 'bg-rose-500';
  };

  const getDayIndicator = (dayNum: number) => {
    const today = new Date().getDay(); // 0 = Sun, 1 = Mon, 3 = Wed, 5 = Fri
    const isToday = today === dayNum;
    return (
      <div 
        className={`w-3.5 h-3.5 rounded-full ${isToday ? 'lamp-active' : 'lamp-inactive'}`}
        title={isToday ? 'Hari ini aktif!' : 'Mati (Standby)'}
      />
    );
  };

  const participationPercentage = citizenCount > 0 
    ? Math.round((activeCount / citizenCount) * 100) 
    : 0;

  const getUserLevel = (pts: number) => {
    if (pts >= 700) return { name: 'Lestari Bintang 🌟', color: 'text-amber-800 bg-amber-500/15 border-amber-500/30' };
    if (pts >= 450) return { name: 'Pahlawan Hijau 🌿', color: 'text-[#2D331C] bg-[#D6E8C1] border-[#738E61]/30' };
    if (pts >= 250) return { name: 'Pejuang Eco 🌱', color: 'text-brand-muted bg-brand-primary/10 border-brand-accent/20' };
    return { name: 'Pemula Lestari 🍃', color: 'text-brand-dark bg-brand-card border-brand-border' };
  };

  const userLevel = currentUser ? getUserLevel(currentUser.points) : null;
  const levelProgress = currentUser ? Math.min(100, Math.round(((currentUser.points % 250) / 250) * 100)) : 0;

  return (
    <div className="space-y-6 p-4 md:p-6 pb-20 md:pb-6">
      {/* Top Section Grid for Setup Profile & CSV Connection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personalized Profile Card widget */}
        {currentUser ? (
          <div className="bg-brand-card p-4 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-primary text-white w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm select-none shadow-sm">
                    🏡
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-brand-dark leading-tight flex items-center gap-1.5 flex-wrap">
                      Halo, {currentUser.name}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${userLevel?.color}`}>
                        {userLevel?.name}
                      </span>
                    </h3>
                    <p className="text-[10px] text-brand-muted font-mono mt-0.5">
                      Profil Rumah: Blok {currentUser.block} No. {currentUser.houseNo}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClearProfile}
                  className="text-[10px] text-brand-muted hover:text-rose-600 font-extrabold underline cursor-pointer"
                  title="Ganti atau hapus profil rumah Anda"
                >
                  Ganti
                </button>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-brand-border pt-3 mt-3">
                <span className="text-[10px] text-brand-muted font-bold">Poin Hijau Anda:</span>
                <div className="flex items-center gap-1">
                  <span className="bg-[#738E61] text-white font-black px-2 py-0.5 rounded-lg text-[11px] shadow-xs">
                    {currentUser.points} Pts
                  </span>
                  <span className="bg-[#D6E8C1] text-brand-herotext font-extrabold px-1.5 py-0.5 rounded-lg text-[9px]">
                    {currentUser.weight.toFixed(1)} Kg terpilah
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[9px] text-brand-muted font-semibold">
                <span>Progress Level Berikutnya</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border/40">
                <div 
                  className="bg-brand-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {onOpenOnboarding && (
              <div className="flex justify-end pt-0.5">
                <button 
                  onClick={onOpenOnboarding}
                  className="text-[9px] text-brand-primary hover:text-[#5C724D] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Panduan Aplikasi</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#D6E8C1]/30 p-5 rounded-2xl border border-brand-primary/20 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-[#2D331C] font-display">
                Setup Akun Rumah Anda
              </h3>
              <p className="text-[10px] text-brand-muted leading-relaxed">
                Hubungkan dasbor ini dengan nomor rumah Anda untuk melacak poin dan klaim setoran sampah.
              </p>
            </div>
            <button 
              onClick={onOpenOnboarding}
              className="bg-brand-primary hover:bg-[#5C724D] text-white font-extrabold text-[10px] px-3 py-2.5 rounded-xl transition shrink-0 shadow-sm cursor-pointer self-start md:self-end"
            >
              Mulai Setup
            </button>
          </div>
        )}

        {/* CSV Status Connection Bar */}
        <div className="bg-brand-card/70 p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shrink-0 ${getStatusColor()}`} />
            <div className="min-w-0 flex-grow">
              <h4 className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest font-display">
                Koneksi Database Warga
              </h4>
              <p className="text-xs text-brand-dark truncate font-mono mt-0.5">
                {csvMessage}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-brand-border pt-3">
            <button 
              onClick={onUploadClick}
              className="bg-brand-hero/40 hover:bg-brand-hero/60 text-brand-herotext font-bold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-brand-border cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Unggah CSV
            </button>
            <button 
              onClick={onRefreshClick}
              className="bg-brand-card hover:bg-brand-border text-brand-dark font-bold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-[#C5CAAF]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Muat Ulang
            </button>
          </div>
        </div>
      </div>

      {/* Hero Announcement banner */}
      <div className="bg-brand-hero text-brand-herotext rounded-2xl p-6 shadow-sm border border-brand-border relative overflow-hidden">
        {/* Abstract background vector circles */}
        <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute right-4 top-4 opacity-5">
          <Compass className="w-24 h-24" />
        </div>
        
        <div className="relative z-10 space-y-2">
          <span className="bg-[#738E61]/25 text-brand-muted text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
            Aksi Warga RT 005
          </span>
          <h2 className="text-xl md:text-2xl font-black font-display leading-snug text-brand-herotext">
            Bersama Wujudkan Taman Buaran Indah IV Hijau & Asri!
          </h2>
          <p className="text-brand-muted text-xs font-medium leading-relaxed max-w-2xl">
            Pilah sampahmu dari rumah, kumpulkan Green Points, dan bantu RT 005 memenangkan predikat RT Terbaik peduli lingkungan tingkat RW 013.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => onSwitchTab('setor')}
              className="bg-brand-primary text-white hover:bg-brand-muted font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              Catat Setor Sampah
            </button>
            <button 
              onClick={() => onSwitchTab('panduan')}
              className="bg-brand-card/70 hover:bg-brand-card border border-brand-border text-brand-dark font-bold text-xs px-3 py-2.5 rounded-xl transition flex items-center gap-1"
            >
              Cara Pilah
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Grid - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-brand-card/75 p-4 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider font-display">
              Total Terpilah
            </span>
            <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-xl text-xs">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-black text-brand-text font-display">
              {totalWeight.toFixed(1)} <span className="text-xs font-semibold text-brand-muted">kg</span>
            </h4>
            <p className="text-[10px] text-brand-primary mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.4% minggu ini
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-brand-card/75 p-4 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider font-display">
              Partisipasi Rumah
            </span>
            <div className="bg-brand-accent/20 text-brand-muted p-1.5 rounded-xl text-xs">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-black text-brand-text font-display">
              {activeCount} <span className="text-xs font-semibold text-brand-muted">/ {citizenCount}</span>
            </h4>
            <p className="text-[10px] text-brand-muted mt-1 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping"></span>
              {participationPercentage}% Warga Terlibat
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-brand-card/75 p-4 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider font-display">
              Total Poin RT
            </span>
            <div className="bg-brand-hero text-brand-herotext p-1.5 rounded-xl text-xs">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-black text-brand-text font-display">
              {totalPoints.toLocaleString('id-ID')} <span className="text-xs font-semibold text-brand-muted">Pts</span>
            </h4>
            <p className="text-[10px] text-brand-muted mt-1 font-semibold">
              Bisa ditukar kas RT
            </p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-brand-card/75 p-4 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider font-display">
              CO2 Dikurangi
            </span>
            <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-xl text-xs">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-black text-brand-text font-display">
              {co2Saved.toFixed(1)} <span className="text-xs font-semibold text-brand-muted">kg</span>
            </h4>
            <p className="text-[10px] text-brand-primary mt-1 font-semibold">
              Setara pohon ditanam
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Schedule and Feed - Side-by-side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule Card with Dynamic Day Lamp Indicator */}
        <div className="bg-brand-card/75 p-5 rounded-2xl border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-[#DDE1D2]">
            <h3 className="font-bold text-brand-dark flex items-center gap-2 text-xs uppercase tracking-wider font-display">
              <Calendar className="w-4 h-4 text-brand-primary" /> Jadwal Angkut & Aksi RT
            </h3>
            <span className="text-[9px] bg-[#D6E8C1] text-brand-herotext font-extrabold px-2 py-0.5 rounded">
              MINGGUAN
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Monday Row (SEN) */}
            <div className="flex items-center justify-between gap-3 bg-brand-bg/50 p-2.5 rounded-xl border border-brand-border/40">
              <div className="flex gap-3 items-start">
                <div className="bg-brand-primary/10 text-brand-primary font-bold text-xs w-12 py-1.5 rounded-xl text-center flex-shrink-0 flex flex-col justify-center font-display shadow-xs">
                  <span>SEN</span>
                  <span className="text-[9px] font-semibold text-brand-muted">PAGI</span>
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-brand-dark">Sampah Organik (Basah)</h4>
                  <p className="text-brand-muted text-[10px]">Siapkan di ember hijau depan pagar.</p>
                </div>
              </div>
              <div className="flex items-center pl-2 flex-shrink-0">
                {getDayIndicator(1)}
              </div>
            </div>

            {/* Wednesday Row (RAB) */}
            <div className="flex items-center justify-between gap-3 bg-brand-bg/50 p-2.5 rounded-xl border border-brand-border/40">
              <div className="flex gap-3 items-start">
                <div className="bg-[#A2B591]/25 text-brand-muted font-bold text-xs w-12 py-1.5 rounded-xl text-center flex-shrink-0 flex flex-col justify-center font-display shadow-xs">
                  <span>RAB</span>
                  <span className="text-[9px] font-semibold text-brand-muted">PAGI</span>
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-brand-dark">Sampah Anorganik (Kering)</h4>
                  <p className="text-brand-muted text-[10px]">Kardus & botol bersih dalam karung.</p>
                </div>
              </div>
              <div className="flex items-center pl-2 flex-shrink-0">
                {getDayIndicator(3)}
              </div>
            </div>

            {/* Friday Row (JUM) */}
            <div className="flex items-center justify-between gap-3 bg-brand-bg/50 p-2.5 rounded-xl border border-brand-border/40">
              <div className="flex gap-3 items-start">
                <div className="bg-[#44483D]/10 text-brand-dark font-bold text-xs w-12 py-1.5 rounded-xl text-center flex-shrink-0 flex flex-col justify-center font-display shadow-xs">
                  <span>JUM</span>
                  <span className="text-[9px] font-semibold text-[#44483D]">PAGI</span>
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-brand-dark">Residu & B3</h4>
                  <p className="text-brand-muted text-[10px]">Limbah popok & baterai terbungkus rapat.</p>
                </div>
              </div>
              <div className="flex items-center pl-2 flex-shrink-0">
                {getDayIndicator(5)}
              </div>
            </div>

            {/* Sunday Row (MING) */}
            <div className="flex items-center justify-between gap-3 bg-brand-hero/20 p-2.5 rounded-xl border border-dashed border-brand-accent/50">
              <div className="flex gap-3 items-start">
                <div className="bg-brand-hero text-brand-herotext font-bold text-xs w-12 py-1.5 rounded-xl text-center flex-shrink-0 flex flex-col justify-center font-display shadow-xs">
                  <span>MING</span>
                  <span className="text-[8px] font-bold text-brand-muted">07:00</span>
                </div>
                <div className="text-xs">
                  <span className="bg-[#738E61]/20 text-[#2D331C] font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider mb-1 inline-block">
                    KERJA BAKTI
                  </span>
                  <h4 className="font-bold text-brand-dark">Daur Ulang Akbar</h4>
                  <p className="text-brand-muted font-semibold text-[10px]">Pos RT 005. Bawa hasil pilahan bulanan.</p>
                </div>
              </div>
              <div className="flex items-center pl-2 flex-shrink-0">
                {getDayIndicator(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Citizen Activities (Simulated Real-Time Feed) */}
        <div className="bg-brand-card/75 p-5 rounded-2xl border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-[#DDE1D2]">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-brand-dark flex items-center gap-1.5 text-xs uppercase tracking-wider font-display">
                <Zap className="w-4 h-4 text-brand-primary animate-bounce" /> Aktivitas Warga Terkini
              </h3>
              <span className="bg-[#738E61] text-white font-black text-[8px] px-1.5 py-0.5 rounded-full animate-pulse tracking-widest">
                LIVE
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#DDE1D2] max-h-[360px] overflow-y-auto pr-1 space-y-1">
            <AnimatePresence initial={false}>
              {activityLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-brand-muted">
                  <Database className="w-8 h-8 mx-auto text-brand-accent animate-pulse mb-2" />
                  Membuka koneksi database warga...
                </div>
              ) : (
                activityLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={log.isNew ? { opacity: 0, y: -15, scale: 0.95 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="flex items-start gap-3 py-3"
                  >
                    <div className={`${log.bg} p-2 rounded-xl text-base flex-shrink-0 flex items-center justify-center w-9 h-9 shadow-xs`}>
                      <span dangerouslySetInnerHTML={{ __html: log.icon }} />
                    </div>
                    <div className="flex-grow text-xs min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-brand-dark truncate">
                          {log.name} <span className="font-normal text-brand-muted">({log.house})</span>
                        </h4>
                        <span className="text-[9px] text-brand-muted shrink-0 font-medium">
                          {log.time}
                        </span>
                      </div>
                      <p className="text-brand-muted mt-0.5 text-[11px] leading-relaxed">
                        Menyetorkan <span className="font-bold text-brand-dark">{log.amount}</span> {log.type}.
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 self-center pl-2">
                      <span className="bg-[#D6E8C1] text-brand-herotext font-extrabold px-2 py-0.5 rounded-lg text-[10px] border border-brand-accent/20">
                        +{log.points}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
