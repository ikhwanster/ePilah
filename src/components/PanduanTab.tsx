import React, { useState } from 'react';
import { Search, Info, Leaf, Trash2, ShieldAlert, FileText, Sparkles, HelpCircle, ArrowRight, X } from 'lucide-react';
import { wasteDb } from '../data';
import { WasteGuideItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Custom Animated Illustration Components
function OrganikAnimation() {
  return (
    <div className="relative w-full h-32 bg-[#E8F0E3] rounded-2xl flex items-center justify-center overflow-hidden border border-[#D6E8C1]">
      {/* Soil layer */}
      <div className="absolute bottom-0 w-full h-7 bg-[#8B5A2B]/20 rounded-b-2xl"></div>
      
      {/* Sprout growing */}
      <motion.div 
        initial={{ scale: 0.8, y: 10 }}
        animate={{ scale: [0.95, 1.1, 0.95], y: [5, 0, 5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-4xl z-10 select-none filter drop-shadow-sm"
      >
        🌱
      </motion.div>

      {/* Floating Leaves */}
      <motion.div
        animate={{ 
          y: [-15, 35], 
          x: [-12, 12], 
          rotate: [0, 180],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-10 text-base select-none"
      >
        🍃
      </motion.div>
      <motion.div
        animate={{ 
          y: [-10, 40], 
          x: [12, -12], 
          rotate: [30, 210],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: 'linear' }}
        className="absolute right-12 text-sm select-none"
      >
        🍂
      </motion.div>

      {/* Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#738E61]/5 to-transparent pointer-events-none"></div>
    </div>
  );
}

function AnorganikAnimation() {
  return (
    <div className="relative w-full h-32 bg-[#E0ECF8] rounded-2xl flex items-center justify-center overflow-hidden border border-[#BCD4EC]">
      {/* Gears spinning in background */}
      <div className="absolute bottom-3 left-1/4 flex gap-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="text-slate-400 opacity-20 text-lg"
        >
          ⚙️
        </motion.div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="text-slate-400 opacity-20 text-lg"
        >
          ⚙️
        </motion.div>
      </div>

      {/* Sliding bottle container */}
      <motion.div
        animate={{ 
          x: [-70, 70],
          rotate: [0, 360]
        }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="text-4xl z-10 select-none filter drop-shadow-sm"
      >
        🥤
      </motion.div>

      <motion.div
        animate={{ 
          x: [-110, 30],
          rotate: [45, 405]
        }}
        transition={{ duration: 3.8, delay: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-3xl z-10 absolute select-none filter drop-shadow-sm"
      >
        🥫
      </motion.div>

      {/* Recycled output sparkles */}
      <motion.div
        animate={{ 
          scale: [0.6, 1.2, 0.6],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-10 top-5 text-[#738E61]"
      >
        <Sparkles className="w-4 h-4 fill-current" />
      </motion.div>
    </div>
  );
}

function B3Animation() {
  return (
    <div className="relative w-full h-32 bg-[#FDF0F0] rounded-2xl flex items-center justify-center overflow-hidden border border-[#F9D4D4]">
      {/* Pulse circle */}
      <motion.div
        animate={{ 
          scale: [0.85, 1.45],
          opacity: [0.5, 0]
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-16 h-16 rounded-full border-2 border-rose-300"
      ></motion.div>

      {/* Shake warning symbol */}
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 1],
          rotate: [-2, 2, -2]
        }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        className="text-4xl z-10 select-none filter drop-shadow-md"
      >
        ⚠️
      </motion.div>

      {/* Tiny floating electric warning symbols */}
      <motion.div
        animate={{ 
          y: [0, -22], 
          x: [0, -8],
          opacity: [1, 0],
          scale: [0.6, 1]
        }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
        className="absolute bottom-8 left-1/3 text-[10px]"
      >
        ⚡
      </motion.div>
      <motion.div
        animate={{ 
          y: [0, -18], 
          x: [0, 10],
          opacity: [1, 0],
          scale: [0.6, 1]
        }}
        transition={{ duration: 1.3, delay: 0.6, repeat: Infinity, ease: 'easeOut' }}
        className="absolute bottom-8 right-1/3 text-[10px]"
      >
        ⚡
      </motion.div>
    </div>
  );
}

function ResiduAnimation() {
  return (
    <div className="relative w-full h-32 bg-[#F0F2F2] rounded-2xl flex items-center justify-center overflow-hidden border border-[#D1D5DB]">
      {/* Smog blur in background */}
      <motion.div
        animate={{ 
          scale: [0.85, 1.15, 0.85],
          opacity: [0.2, 0.45, 0.2]
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-20 h-10 bg-slate-400/15 blur-lg rounded-full top-6"
      ></motion.div>

      {/* Falling garbage bag with slam bounce */}
      <motion.div
        animate={{ 
          y: [-40, 6],
          rotate: [0, -10],
          scale: [0.85, 1]
        }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.8, ease: 'easeOut' }}
        className="text-3xl z-10 select-none filter drop-shadow-xs"
      >
        🗑️
      </motion.div>

      {/* Splash sparks on impact */}
      <motion.div
        animate={{ 
          y: [6, -8, 12],
          x: [0, -15, -25],
          opacity: [0, 0.9, 0]
        }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.8, ease: 'easeOut' }}
        className="absolute text-[10px] select-none"
      >
        💨
      </motion.div>
      <motion.div
        animate={{ 
          y: [6, -8, 12],
          x: [0, 15, 25],
          opacity: [0, 0.9, 0]
        }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.8, ease: 'easeOut' }}
        className="absolute text-[10px] select-none"
      >
        💨
      </motion.div>
    </div>
  );
}

// Category Detailed Content Mapping
const categoryDetails: Record<string, {
  title: string;
  icon: React.ReactNode;
  themeColor: string;
  badgeClass: string;
  wadah: string;
  animation: React.ReactNode;
  processTitle: string;
  processSteps: string[];
  tips: string;
  fullDesc: string;
}> = {
  organik: {
    title: 'Organik (Sampah Basah)',
    icon: <Leaf className="w-5 h-5 text-white" />,
    themeColor: 'bg-[#738E61]',
    badgeClass: 'bg-[#D6E8C1] text-[#2D331C] border border-brand-accent/40',
    wadah: 'Ember Hijau Tertutup',
    animation: <OrganikAnimation />,
    processTitle: 'Alur Pengelolaan Kompos Mandiri RT 005',
    processSteps: [
      'Penyimpanan Sementara: Warga mengumpulkan sisa dapur di Ember Hijau tertutup di depan pagar rumah masing-masing.',
      'Pengangkutan Rutin: Petugas gerobak lingkungan mengambil sampah organik warga setiap Selasa, Kamis, dan Sabtu pagi.',
      'Pengolahan Komposter: Sampah disortir dari plastik, dicacah, lalu dimasukkan ke dalam Bak Kompos Takakura lingkungan.',
      'Pemanenan & Distribusi: Setelah matang (3-4 minggu), pupuk kompos matang diayak dan didistribusikan gratis ke kebun sayur hidroponik RT.'
    ],
    tips: 'Tiriskan air/kuah masakan sesedikit mungkin sebelum membuang sampah organik agar tidak menimbulkan bau becek menyengat.',
    fullDesc: 'Sampah alami yang mudah membusuk dan terurai sempurna oleh mikroba tanah. Sangat berharga untuk dikonversi menjadi pupuk kompos organik berkualitas tinggi bagi penghijauan wilayah RW 013.'
  },
  anorganik: {
    title: 'Anorganik (Sampah Kering)',
    icon: <Sparkles className="w-5 h-5 text-white" />,
    themeColor: 'bg-[#507297]',
    badgeClass: 'bg-[#E0ECF8] text-[#1E4068] border border-[#BCD4EC]',
    wadah: 'Karung/Plastik Transparan',
    animation: <AnorganikAnimation />,
    processTitle: 'Alur Tabungan Bank Sampah Lestari 005',
    processSteps: [
      'Pilah Mandiri: Botol plastik PET, gelas bening, kardus dilipat, kaleng dipisahkan sejak dari dapur rumah.',
      'Bersih & Kering: Pastikan membilas sisa jus manis atau kecap pada botol plastik demi mencegah semut dan lalat.',
      'Penyetoran Minggu: Disetorkan ke gerai Bank Sampah RT setiap hari Minggu pagi (pukul 08:00 - 11:00 WIB).',
      'Timbang & Konversi: Berat sampah ditimbang oleh pengurus, dicatat di sistem, lalu otomatis dikonversi menjadi Poin Hijau warga.'
    ],
    tips: 'Lepaskan label plastik shrink di bagian luar botol dan kumpulkan tutup botol secara terpisah karena jenis plastiknya berbeda.',
    fullDesc: 'Limbah non-alami yang kering dan tidak membusuk. Kategori ini memiliki nilai ekonomi sirkular yang sangat tinggi untuk didaur ulang kembali menjadi serat kain, botol baru, ataupun produk kerajinan kreatif.'
  },
  b3: {
    title: 'Limbah Berbahaya (B3)',
    icon: <ShieldAlert className="w-5 h-5 text-white" />,
    themeColor: 'bg-rose-500',
    badgeClass: 'bg-rose-50 text-rose-800 border border-rose-200',
    wadah: 'Kotak Box Merah Pos Satpam',
    animation: <B3Animation />,
    processTitle: 'Prosedur Aman Pembuangan Limbah B3',
    processSteps: [
      'Pemisahan Mutlak: Dilarang keras menyatukan baterai bekas, lampu LED, maupun kosmetik aerosol dengan sampah biasa.',
      'Pengemasan Aman: Bungkus baterai yang berkarat atau bohlam pecah dengan plastik tebal agar tidak melukai kulit fisik.',
      'Taruh di Dropbox: Masukkan limbah ke Kotak Box Merah Khusus B3 yang disiapkan di depan Pos Keamanan Utama RT 005.',
      'Pengangkutan Dinas: Pengurus RT menyerahkan limbah yang terkumpul ke Dinas Lingkungan Hidup untuk dihancurkan secara ramah lingkungan.'
    ],
    tips: 'Selalu simpan baterai bekas di wadah kering tertutup sebelum mengantarkannya ke pos dropbox, hindari tempat lembab.',
    fullDesc: 'Bahan Berbahaya dan Beracun yang memerlukan jalur pembuangan khusus karena mengandung logam berat, zat korosif, atau bahan kimia aktif yang berpotensi memicu korsleting, kebakaran, atau kontaminasi air tanah.'
  },
  residu: {
    title: 'Residu (Limbah Sisa Akhir)',
    icon: <Trash2 className="w-5 h-5 text-white" />,
    themeColor: 'bg-slate-700',
    badgeClass: 'bg-slate-100 text-slate-800 border border-slate-200',
    wadah: 'Kantong Plastik Hitam',
    animation: <ResiduAnimation />,
    processTitle: 'Mata Rantai Akhir Sampah Residu',
    processSteps: [
      'Kemas Rapat: Masukkan popok bekas, tisu kotor, sachet permen ke kantong plastik hitam tebal lalu ikat kuat.',
      'Pengangkutan Rutin: Diangkut oleh petugas kebersihan gerobak RW setiap hari Senin, Rabu, dan Jumat pagi.',
      'TPS Kelurahan: Sampah dikonsolidasikan sementara di Tempat Pembuangan Sampah kelurahan.',
      'TPA Akhir: Dikirim langsung menggunakan armada truk sampah kota untuk dibuang akhir di TPA Bantar Gebang.'
    ],
    tips: 'Mulai kurangi sampah residu dengan membawa kantong belanja kain mandiri dan kurangi pembelian jajanan kemasan sachet.',
    fullDesc: 'Sampah sisa akhir rumah tangga yang kotor, basah, atau terkontaminasi sehingga tidak layak lagi untuk dikomposkan maupun didaur ulang. Ini adalah musuh lingkungan utama yang harus diminimalisir volumenya.'
  }
};

export default function PanduanTab() {
  const [query, setQuery] = useState<string>('');
  const [matchResult, setMatchResult] = useState<WasteGuideItem | null>(null);
  const [noMatchFound, setNoMatchFound] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenDetail = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCloseDetail = () => {
    setSelectedCategory(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const q = val.toLowerCase().trim();

    if (q === '') {
      setMatchResult(null);
      setNoMatchFound(false);
      return;
    }

    // Attempt fuzzy contains match
    const found = wasteDb.find(item => 
      item.name.toLowerCase().includes(q) || q.includes(item.name.toLowerCase())
    );

    if (found) {
      setMatchResult(found);
      setNoMatchFound(false);
    } else {
      setMatchResult(null);
      setNoMatchFound(true);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    if (category === 'organik') return 'bg-[#D6E8C1] text-[#2D331C] border border-brand-accent/40';
    if (category === 'anorganik') return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30';
    if (category === 'b3') return 'bg-rose-50 text-rose-800 border border-rose-200';
    return 'bg-brand-card text-brand-dark border border-brand-border';
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'organik') return '🌱';
    if (category === 'anorganik') return '🥤';
    if (category === 'b3') return '⚠️';
    return '🗑️';
  };

  return (
    <div className="space-y-5 p-4 pb-20 relative">
      {/* Search Header Container */}
      <div className="bg-brand-card/75 p-5 rounded-2xl border border-brand-border shadow-sm space-y-3.5">
        <div>
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-dark font-display">
            Cari Cara Pilah Sampah
          </h3>
          <p className="text-[11px] text-brand-muted leading-relaxed mt-0.5">
            Bingung barang bekas Anda termasuk kategori apa? Ketik nama benda di bawah ini untuk instruksi resmi RT 005:
          </p>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-muted">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            value={query}
            onChange={handleSearchChange}
            placeholder="Contoh: botol aqua, kulit mangga, lampu, tisu..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-xs text-brand-text"
          />
        </div>

        {/* Dynamic Search Result Panel */}
        {matchResult && (
          <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border animate-fadeIn">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 select-none">{getCategoryIcon(matchResult.category)}</span>
              <div className="text-xs space-y-1.5 flex-grow">
                <h4 className="font-extrabold text-brand-dark capitalize text-sm">
                  {matchResult.name}
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getCategoryBadgeClass(matchResult.category)}`}>
                    {matchResult.category}
                  </span>
                  <span className="bg-brand-card text-brand-muted px-2 py-0.5 rounded-full text-[9px] font-semibold border border-brand-border/40">
                    {matchResult.type}
                  </span>
                </div>
                <div className="text-brand-dark text-[11px] leading-relaxed pt-2 border-t border-brand-border mt-2">
                  <strong className="text-brand-text">Instruksi Pembuangan:</strong> {matchResult.instruction}
                </div>
              </div>
            </div>
          </div>
        )}

        {noMatchFound && (
          <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border flex items-center gap-3">
            <span className="text-2xl shrink-0 select-none">🤔</span>
            <div className="text-xs">
              <p className="font-bold text-brand-dark">
                Maaf, sampah "{query}" belum terdaftar.
              </p>
              <p className="text-brand-muted text-[10px] mt-0.5">
                Silakan laporkan ke admin RT 005 via chat WhatsApp agar kamus segera diupdate!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Guide Categories Cards Stack */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-brand-muted tracking-wider font-display">
          Kategori Pembuangan Sampah
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Organik */}
          <div className="bg-brand-hero/45 p-4.5 rounded-2xl border border-brand-accent/40 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center text-lg mb-3 shadow-xs">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-brand-herotext text-sm font-display">
                1. Organik (Sampah Basah)
              </h4>
              <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                Sampah alami yang mudah membusuk dan terurai. Sangat berharga untuk diolah menjadi kompos warga RT 005.
              </p>
              <ul className="text-[11px] text-brand-muted mt-3.5 space-y-1.5 list-disc list-inside">
                <li>Sisa makanan, sayur, sisa lauk</li>
                <li>Kulit buah & biji-bijian</li>
                <li>Daun kering & potongan dahan</li>
                <li>Ampas kopi, teh, & kelapa</li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-primary/30 flex justify-between items-center">
              <span className="text-[9px] text-brand-primary font-bold uppercase tracking-wider">Wadah: Ember Hijau</span>
              <button 
                onClick={() => handleOpenDetail('organik')}
                className="px-2.5 py-1.5 bg-[#738E61]/10 hover:bg-[#738E61]/25 text-brand-primary font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 flex items-center gap-1 cursor-pointer"
                id="btn-detail-organik"
              >
                Detail 🔍
              </button>
            </div>
          </div>

          {/* Anorganik */}
          <div className="bg-brand-card/60 p-4.5 rounded-2xl border border-brand-border flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-primary/80 text-white flex items-center justify-center text-lg mb-3 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-brand-dark text-sm font-display">
                2. Anorganik (Sampah Kering)
              </h4>
              <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                Limbah padat kering bernilai ekonomi tinggi untuk didaur ulang. Pastikan disetor dalam keadaan bersih & kering.
              </p>
              <ul className="text-[11px] text-brand-dark mt-3.5 space-y-1.5 list-disc list-inside">
                <li>Botol plastik PET & gelas mineral</li>
                <li>Kardus mie, koran, kertas bersih</li>
                <li>Kaleng minuman logam & alumunium</li>
                <li>Botol kecap kaca & beling bersih</li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-border flex justify-between items-center">
              <span className="text-[9px] text-[#507297] font-bold uppercase tracking-wider">Wadah: Karung Transpar</span>
              <button 
                onClick={() => handleOpenDetail('anorganik')}
                className="px-2.5 py-1.5 bg-[#507297]/10 hover:bg-[#507297]/25 text-[#1E4068] font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 flex items-center gap-1 cursor-pointer"
                id="btn-detail-anorganik"
              >
                Detail 🔍
              </button>
            </div>
          </div>

          {/* B3 */}
          <div className="bg-rose-50/40 p-4.5 rounded-2xl border border-rose-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center text-lg mb-3 shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-rose-900 text-sm font-display">
                3. Limbah Berbahaya (B3)
              </h4>
              <p className="text-[11px] text-rose-800/80 mt-1 leading-relaxed">
                Bahan Berbahaya dan Beracun yang memerlukan penanganan terpisah demi keselamatan kesehatan petugas.
              </p>
              <ul className="text-[11px] text-slate-700 mt-3.5 space-y-1.5 list-disc list-inside">
                <li>Baterai alkali bekas, aki motor</li>
                <li>Bohlam lampu neon / LED rusak</li>
                <li>Botol aerosol semprotan serangga</li>
                <li>Obat kadaluwarsa & jarum suntik</li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-rose-200 flex justify-between items-center">
              <span className="text-[9px] text-rose-700 font-bold uppercase tracking-wider">Wadah: Box Merah</span>
              <button 
                onClick={() => handleOpenDetail('b3')}
                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-700 font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 flex items-center gap-1 cursor-pointer"
                id="btn-detail-b3"
              >
                Detail 🔍
              </button>
            </div>
          </div>

          {/* Residu */}
          <div className="bg-brand-bg/60 p-4.5 rounded-2xl border border-[#DDE1D2] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-dark text-white flex items-center justify-center text-lg mb-3 shadow-xs">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-brand-dark text-sm font-display">
                4. Residu (Limbah Sisa)
              </h4>
              <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                Sampah sisa akhir yang tidak bisa dimanfaatkan kembali atau terlalu sulit dan kotor untuk didaur ulang.
              </p>
              <ul className="text-[11px] text-brand-dark mt-3.5 space-y-1.5 list-disc list-inside">
                <li>Popok bayi sekali pakai & pembalut</li>
                <li>Tisu basah/kering bekas, puntung</li>
                <li>Struk belanja kertas thermal</li>
                <li>Kemasan sachet permen metallized</li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-border flex justify-between items-center">
              <span className="text-[9px] text-brand-muted font-bold uppercase tracking-wider">Wadah: Plastik Hitam</span>
              <button 
                onClick={() => handleOpenDetail('residu')}
                className="px-2.5 py-1.5 bg-slate-700/10 hover:bg-slate-700/25 text-slate-700 font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 flex items-center gap-1 cursor-pointer"
                id="btn-detail-residu"
              >
                Detail 🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup Window Overlay */}
      <AnimatePresence>
        {selectedCategory && categoryDetails[selectedCategory] && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-brand-card w-full max-w-lg rounded-2xl border border-brand-border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92%]"
            >
              {/* Header Banner */}
              <div className={`p-4 text-white flex items-center justify-between ${categoryDetails[selectedCategory].themeColor}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {categoryDetails[selectedCategory].icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider font-display leading-tight">
                      Detail Kategori
                    </h3>
                    <p className="text-[11px] text-white/95 font-medium">
                      {categoryDetails[selectedCategory].title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer"
                  id="btn-close-modal-x"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4.5 overflow-y-auto text-xs">
                {/* Animated Illustration Section */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">
                    Visualisasi Animasi:
                  </span>
                  {categoryDetails[selectedCategory].animation}
                </div>

                {/* Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">
                    Penjelasan Kategori:
                  </span>
                  <p className="text-brand-text leading-relaxed bg-brand-bg/40 p-3.5 rounded-xl border border-brand-border/45 text-[11px] font-medium">
                    {categoryDetails[selectedCategory].fullDesc}
                  </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">
                    {categoryDetails[selectedCategory].processTitle}:
                  </span>
                  <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-brand-border">
                    {categoryDetails[selectedCategory].processSteps.map((step, idx) => {
                      const splitIdx = step.indexOf(': ');
                      const title = step.substring(0, splitIdx);
                      const desc = step.substring(splitIdx + 2);
                      return (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[9px] text-white ${categoryDetails[selectedCategory].themeColor}`}>
                            {idx + 1}
                          </span>
                          <div className="text-[10.5px] leading-relaxed">
                            <strong className="text-brand-dark">{title}</strong> <span className="text-brand-muted">{desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl flex gap-2.5 items-start">
                  <span className="text-lg leading-none select-none">💡</span>
                  <div>
                    <h5 className="font-extrabold text-[10.5px] text-amber-900 uppercase tracking-wider leading-none">
                      Tips Praktis Warga:
                    </h5>
                    <p className="text-amber-800 text-[10px] leading-relaxed mt-1 font-medium">
                      {categoryDetails[selectedCategory].tips}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Banner */}
              <div className="p-4 bg-brand-bg/50 border-t border-brand-border flex items-center justify-between shrink-0 select-none">
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${categoryDetails[selectedCategory].badgeClass}`}>
                  Wadah: {categoryDetails[selectedCategory].wadah}
                </span>
                <button
                  onClick={handleCloseDetail}
                  className="px-4 py-2 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
                  id="btn-close-modal-bottom"
                >
                  Mengerti & Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
