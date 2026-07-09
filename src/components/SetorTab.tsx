import React, { useState, useEffect } from 'react';
import { Send, Info, CheckCircle2, Award } from 'lucide-react';
import { Citizen } from '../types';

interface SetorTabProps {
  citizens: Citizen[];
  onAddSetor: (citizenId: string, reporterName: string, wasteType: string, weight: number) => void;
  currentUser?: Citizen | null;
}

export default function SetorTab({ citizens, onAddSetor, currentUser }: SetorTabProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [wasteType, setWasteType] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [estimatedPoints, setEstimatedPoints] = useState<number>(0);

  // Pre-select if currentUser is set on load
  useEffect(() => {
    if (currentUser && !selectedId) {
      setSelectedId(currentUser.id);
      setReporterName(currentUser.name);
    }
  }, [currentUser]);

  // Sync estimated points dynamically
  useEffect(() => {
    const w = parseFloat(weight) || 0;
    if (w <= 0 || !wasteType) {
      setEstimatedPoints(0);
      return;
    }

    let multiplier = 0;
    if (wasteType === 'plastik') multiplier = 15;
    else if (wasteType === 'kertas') multiplier = 10;
    else if (wasteType === 'logam') multiplier = 20;
    else if (wasteType === 'minyak') multiplier = 25;
    else if (wasteType === 'organik') multiplier = 5;

    setEstimatedPoints(Math.round(w * multiplier));
  }, [wasteType, weight]);

  // Handle address change to auto-fill corresponding resident name as default guess
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setSelectedId(cid);
    const cit = citizens.find(c => c.id === cid);
    if (cit) {
      setReporterName(cit.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);

    if (!selectedId || !reporterName.trim() || !wasteType || isNaN(w) || w <= 0) {
      alert('Mohon lengkapi seluruh kolom formulir setor sampah secara valid!');
      return;
    }

    onAddSetor(selectedId, reporterName.trim(), wasteType, w);

    // Reset Form state
    setSelectedId('');
    setReporterName('');
    setWasteType('');
    setWeight('');
    setEstimatedPoints(0);
  };

  return (
    <div className="space-y-5 p-4 pb-20">
      {/* Manual Input Form Container */}
      <div className="bg-brand-card/75 p-5 rounded-2xl border border-brand-border shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-dark font-display">
            Catat Pemilahan & Daur Ulang Mandiri
          </h3>
          <p className="text-[11px] text-brand-muted leading-relaxed mt-0.5">
            Setelah Anda mengukur atau menyetorkannya saat bank sampah mingguan / kerja bakti, laporkan di sini untuk mengumpulkan Green Points rumah Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Address selection */}
          <div className="space-y-1">
            <label className="block font-bold text-brand-muted uppercase tracking-wide">
              No Rumah / Blok (RT 005)
            </label>
            <select 
              value={selectedId} 
              onChange={handleAddressChange} 
              required
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-xs bg-white text-brand-text"
            >
              <option value="" disabled>Pilih Blok & No Rumah Anda</option>
              {citizens.map(c => (
                <option key={c.id} value={c.id}>
                  {c.block} No. {c.houseNo} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Resident Name */}
          <div className="space-y-1">
            <label className="block font-bold text-brand-muted uppercase tracking-wide">
              Nama Penghuni / Pengirim
            </label>
            <input 
              type="text" 
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Contoh: Pak Hendra / Bu Rahmi" 
              required
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-xs text-brand-text bg-white"
            />
          </div>

          {/* Waste Categories & Weight Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-brand-muted uppercase tracking-wide">
                Jenis Sampah
              </label>
              <select 
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-xs bg-white text-brand-text"
              >
                <option value="" disabled>Pilih Kategori...</option>
                <option value="plastik">Plastik Bersih [15 Pts/Kg]</option>
                <option value="kertas">Kertas/Kardus [10 Pts/Kg]</option>
                <option value="logam">Logam/Kaleng [20 Pts/Kg]</option>
                <option value="minyak">Minyak Jelantah [25 Pts/L]</option>
                <option value="organik">Organik Basah [5 Pts/Kg]</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-brand-muted uppercase tracking-wide">
                Berat / Volume
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1" 
                  min="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0" 
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-xs text-brand-text bg-white"
                />
                <span className="absolute right-3 inset-y-0 flex items-center text-[10px] font-bold text-brand-muted">
                  {wasteType === 'minyak' ? 'L' : 'Kg'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Points Estimate Banner */}
          <div className="bg-[#D6E8C1] p-4 rounded-xl border border-brand-accent/20 flex justify-between items-center">
            <div>
              <p className="text-[9px] text-brand-herotext uppercase font-black tracking-widest">
                Estimasi Green Points didapat
              </p>
              <h4 className="text-lg font-black text-brand-herotext mt-0.5">
                {estimatedPoints} Poin
              </h4>
            </div>
            <div className="text-right text-[10px] text-brand-muted font-light">
              <p>Sistem Validasi Mandiri</p>
              <p className="italic text-[9px] text-brand-muted/90">Setor jujur, lingkungan makmur!</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-primary hover:bg-brand-muted text-white font-extrabold py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim Laporan & Klaim Poin
          </button>
        </form>
      </div>

      {/* Cleanliness Guidelines Section */}
      <div className="space-y-3.5">
        <div className="bg-brand-card/75 p-5 rounded-2xl border border-brand-border shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-dark font-display flex items-center gap-1.5">
            <Info className="w-4 h-4 text-brand-primary" /> Standar Kebersihan Sampah
          </h3>
          <p className="text-[11px] text-brand-muted leading-relaxed">
            Harap pastikan sampah anorganik yang dilaporkan memenuhi kriteria kebersihan agar tidak mengundang lalat & bau menyengat:
          </p>
          <ul className="text-xs text-brand-dark space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong>Dibilas:</strong> Sisa minuman susu/manis wajib dibilas seperlunya dan ditiriskan hingga benar-benar kering.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong>Dikempeskan:</strong> Botol plastik sebaiknya ditekan/dikempeskan agar menghemat volume wadah kumpul komunal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong>Diikat Rapi:</strong> Tumpukan lembaran kardus dilipat datar kemudian diikat kokoh dengan tali rafia.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-brand-hero/40 to-brand-card/60 p-5 rounded-2xl border border-brand-accent/30 space-y-2">
          <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-brand-herotext font-display flex items-center gap-1">
            <Award className="w-4 h-4 text-brand-primary" /> Reward Bulanan Warga
          </h4>
          <p className="text-[11px] text-brand-muted leading-relaxed">
            Poin yang dikumpulkan setiap rumah warga akan direkap setiap akhir bulan. 3 Rumah dengan poin tertinggi berhak mendapatkan sticker eksklusif <strong>"Rumah Eco-Asri RT 005"</strong> serta hadiah menarik dari RT!
          </p>
        </div>
      </div>
    </div>
  );
}
