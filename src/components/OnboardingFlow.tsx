import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, Leaf, Search, Award, 
  Gamepad2, Home, CheckCircle2, Star, Sparkles
} from 'lucide-react';
import { Citizen } from '../types';

interface OnboardingFlowProps {
  citizens: Citizen[];
  onComplete: (selectedCitizen: Citizen) => void;
  onClose: () => void;
}

export default function OnboardingFlow({ citizens, onComplete, onClose }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>('');

  const steps = [
    {
      title: "Selamat Datang di E-Pilah RT 005!",
      subtitle: "Asisten Kebersihan Taman Buaran Indah IV",
      desc: "Aplikasi khusus warga RT 005 RW 013 untuk mewujudkan lingkungan asri bebas sampah tidak terkelola dengan sistem insentif modern.",
      icon: <Leaf className="w-12 h-12 text-[#2D331C]" />,
      bg: "bg-[#D6E8C1]",
      illustrations: (
        <div className="relative h-36 flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-[#738E61]/10 animate-ping" />
          <div className="absolute w-16 h-16 rounded-full bg-[#738E61]/25 animate-pulse" />
          <span className="text-6xl relative z-10 select-none">🏡♻️🌿</span>
        </div>
      )
    },
    {
      title: "Kamus Panduan Pilah Sampah",
      subtitle: "Fitur Pencarian Pintar 24 Jam",
      desc: "Masih bingung memisahkan sisa sayur, botol plastik, lampu neon, atau tisu kotor? Cukup cari nama bendanya untuk instruksi resmi pembuangan RT 005.",
      icon: <Search className="w-12 h-12 text-brand-primary" />,
      bg: "bg-brand-primary/10",
      illustrations: (
        <div className="relative h-36 flex items-center justify-center gap-3 select-none">
          <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-brand-border shadow-xs text-xs">
            <span className="text-xl">🍎</span>
            <span className="font-bold text-[#738E61] mt-1 text-[9px]">Organik</span>
          </div>
          <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-brand-border shadow-xs text-xs">
            <span className="text-xl">🥤</span>
            <span className="font-bold text-brand-primary mt-1 text-[9px]">Anorganik</span>
          </div>
          <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-brand-border shadow-xs text-xs">
            <span className="text-xl">🧻</span>
            <span className="font-bold text-slate-500 mt-1 text-[9px]">Residu</span>
          </div>
        </div>
      )
    },
    {
      title: "Klaim Poin Rumah Anda!",
      subtitle: "Setor Sampah Bersih, Dapatkan Green Points",
      desc: "Setiap kali Anda mendaur ulang plastik, kertas, kaleng, atau mengumpulkan minyak jelantah, laporkan beratnya untuk mengumpulkan Green Points bagi rumah Anda.",
      icon: <Star className="w-12 h-12 text-[#9A7F33]" />,
      bg: "bg-amber-100",
      illustrations: (
        <div className="relative h-36 flex flex-col items-center justify-center select-none">
          <div className="bg-[#D6E8C1] border border-[#738E61]/30 p-3 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="bg-[#738E61] text-white p-1.5 rounded-lg text-xs font-black">
              +150 Pts
            </div>
            <div className="text-left">
              <p className="font-bold text-[10px] text-[#2D331C] uppercase leading-none">ESTIMASI POIN</p>
              <p className="text-xs font-black text-[#2D331C] mt-0.5">10 kg Plastik Bersih</p>
            </div>
          </div>
          <span className="text-xs text-brand-muted mt-2 font-medium italic">"Setor jujur, lingkungan makmur!"</span>
        </div>
      )
    },
    {
      title: "Asah Otak: Pilah Cepat!",
      subtitle: "Main Game Sambil Kumpulkan Poin Bonus",
      desc: "Latih ketangkasan memilah sampah harian Anda secara interaktif. Setiap skor tertinggi game dapat langsung Anda konversi 1:1 menjadi Poin Green komunal rumah!",
      icon: <Gamepad2 className="w-12 h-12 text-rose-700" />,
      bg: "bg-rose-100",
      illustrations: (
        <div className="relative h-36 flex items-center justify-center select-none">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center shadow-md max-w-[160px]">
            <span className="text-xs font-extrabold text-[#D6E8C1] font-mono animate-pulse">LEVEL 5</span>
            <span className="text-3xl my-1.5 animate-bounce">🧴</span>
            <div className="flex gap-1.5">
              <span className="bg-[#738E61] text-white text-[7px] font-bold px-1 py-0.5 rounded">ORGANIK</span>
              <span className="bg-brand-primary text-white text-[7px] font-bold px-1 py-0.5 rounded">ANORGANIK</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pilih Rumah Anda (Setup)",
      subtitle: "Mari Personalisasikan Dashboard Anda",
      desc: "Silakan pilih blok dan nomor rumah Anda dari daftar warga RT 005 resmi untuk melihat perolehan poin rumah Anda secara live dan mencatatkan laporan.",
      icon: <Home className="w-12 h-12 text-brand-primary" />,
      bg: "bg-[#E7E9DE]",
      illustrations: null
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step validation
      if (!selectedCitizenId) {
        alert("Silakan pilih rumah Anda terlebih dahulu untuk menyelesaikan pendaftaran.");
        return;
      }
      const selectedCitizen = citizens.find(c => c.id === selectedCitizenId);
      if (selectedCitizen) {
        onComplete(selectedCitizen);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-bg text-brand-text max-w-sm w-full rounded-[32px] border border-brand-border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Onboarding Step Illustration Container */}
        <div className={`p-6 ${current.bg} transition-colors duration-300 flex flex-col items-center justify-center relative select-none shrink-0 ${currentStep === 4 ? 'py-8' : ''}`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/50 hover:bg-white text-brand-dark px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer"
          >
            Lewati
          </button>
          
          <div className="bg-white p-3.5 rounded-2xl shadow-xs mb-3 flex items-center justify-center border border-white/20">
            {current.icon}
          </div>

          <div className="h-4" />
          
          {current.illustrations}
        </div>

        {/* Info Text Content Container */}
        <div className="p-6 flex-grow overflow-y-auto space-y-4">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] text-brand-primary font-extrabold uppercase tracking-widest font-display">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
            <h3 className="text-base font-black text-brand-dark font-display">
              {current.title}
            </h3>
            <p className="text-[11px] font-bold text-brand-primary">
              {current.subtitle}
            </p>
            <p className="text-[11px] text-brand-muted leading-relaxed pt-1.5">
              {current.desc}
            </p>
          </div>

          {/* Setup Form for Step 5 */}
          {currentStep === 4 && (
            <div className="space-y-3 bg-brand-card p-4 rounded-2xl border border-brand-border">
              <label className="block text-[10px] font-extrabold text-brand-muted uppercase tracking-wider">
                Pilih Profil Rumah / Warga
              </label>
              <select
                value={selectedCitizenId}
                onChange={(e) => setSelectedCitizenId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="" disabled>-- Pilih Rumah & Nama Anda --</option>
                {citizens.map((citizen) => (
                  <option key={citizen.id} value={citizen.id}>
                    {citizen.block} No. {citizen.houseNo} - {citizen.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 items-center bg-[#D6E8C1]/30 p-2 rounded-lg text-[10px] text-[#2D331C] font-medium leading-normal">
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Memilih profil mengunci data statistik rumah agar langsung tersaji di dasbor utama.</span>
              </div>
            </div>
          )}

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 pt-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-5 bg-brand-primary' : 'w-1.5 bg-brand-border'}`}
              />
            ))}
          </div>
        </div>

        {/* Buttons Nav Bar Footer */}
        <div className="p-5 border-t border-brand-border bg-brand-card flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2.5 rounded-xl border border-brand-border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${currentStep === 0 ? 'opacity-30 cursor-not-allowed text-brand-muted' : 'bg-white hover:bg-brand-bg text-brand-dark'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>

          <button
            onClick={handleNext}
            className="flex-grow bg-brand-primary hover:bg-[#5C724D] text-white font-extrabold py-2.5 rounded-xl transition text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                Selesai & Mulai
              </>
            ) : (
              <>
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
