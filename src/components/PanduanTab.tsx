import React, { useState } from 'react';
import { Search, Info, Leaf, Trash2, ShieldAlert, FileText, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { wasteDb } from '../data';
import { WasteGuideItem } from '../types';

export default function PanduanTab() {
  const [query, setQuery] = useState<string>('');
  const [matchResult, setMatchResult] = useState<WasteGuideItem | null>(null);
  const [noMatchFound, setNoMatchFound] = useState<boolean>(false);

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
    <div className="space-y-5 p-4 pb-20">
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
          <div className="mt-5 pt-3 border-t border-brand-primary/30 flex justify-between items-center text-[9px] text-brand-primary font-bold uppercase tracking-wider">
            <span>Wadah: Ember Hijau Tertutup</span>
            <ArrowRight className="w-3 h-3 text-brand-primary" />
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
              <li>Botol plastik PET & gelas air mineral</li>
              <li>Kardus mie instan, koran, kertas bersih</li>
              <li>Kaleng minuman logam & alumunium</li>
              <li>Botol kecap kaca & wadah beling bersih</li>
            </ul>
          </div>
          <div className="mt-5 pt-3 border-t border-brand-border flex justify-between items-center text-[9px] text-brand-primary font-bold uppercase tracking-wider">
            <span>Wadah: Karung/Plastik Transparan</span>
            <ArrowRight className="w-3 h-3 text-brand-primary" />
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
              Bahan Berbahaya dan Beracun yang memerlukan penanganan terpisah demi melindungi keselamatan kesehatan petugas.
            </p>
            <ul className="text-[11px] text-slate-700 mt-3.5 space-y-1.5 list-disc list-inside">
              <li>Baterai alkali bekas, aki motor</li>
              <li>Bohlam lampu neon / LED rusak</li>
              <li>Botol aerosol semprotan serangga</li>
              <li>Obat kadaluwarsa & jarum suntik medis</li>
            </ul>
          </div>
          <div className="mt-5 pt-3 border-t border-rose-200 flex justify-between items-center text-[9px] text-rose-700 font-bold uppercase tracking-wider">
            <span>Wadah: Serahkan ke Pos Box Merah</span>
            <ArrowRight className="w-3 h-3 text-rose-600" />
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
              <li>Tisu basah/kering bekas, puntung rokok</li>
              <li>Struk belanja kertas thermal mengkilap</li>
              <li>Kemasan sachet permen metallized plastic</li>
            </ul>
          </div>
          <div className="mt-5 pt-3 border-t border-brand-border flex justify-between items-center text-[9px] text-brand-muted font-bold uppercase tracking-wider">
            <span>Wadah: Kantong Plastik Hitam</span>
            <ArrowRight className="w-3 h-3 text-brand-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
