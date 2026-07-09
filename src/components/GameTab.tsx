import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Play, Heart, RotateCcw, Gift, HelpCircle, ShieldAlert } from 'lucide-react';
import { gameItems } from '../data';
import { GameItem, Citizen } from '../types';

interface GameTabProps {
  citizens: Citizen[];
  onDepositBonus: (citizenId: string, bonusPoints: number) => void;
  currentUser?: Citizen | null;
}

export default function GameTab({ citizens, onDepositBonus, currentUser }: GameTabProps) {
  const [highScore, setHighScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [lives, setLives] = useState<number>(3);
  const [currentItem, setCurrentItem] = useState<GameItem | null>(null);

  // Visual flash feedback flags
  const [feedbackColor, setFeedbackColor] = useState<'normal' | 'correct' | 'wrong'>('normal');
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync highscore on load
  useEffect(() => {
    const saved = localStorage.getItem('epilah_highscore');
    if (saved) {
      setHighScore(parseInt(saved) || 0);
    }
  }, []);

  // Timer loop logic
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleEndGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isGameOver]);

  const handleStartGame = () => {
    setScore(0);
    setTimer(30);
    setLives(3);
    setIsGameOver(false);
    setIsPlaying(true);
    setFeedbackColor('normal');
    setShowClaimModal(false);
    spawnItem();
  };

  const spawnItem = () => {
    const rand = Math.floor(Math.random() * gameItems.length);
    setCurrentItem(gameItems[rand]);
  };

  const handleAnswer = (choice: 'organik' | 'anorganik' | 'b3' | 'residu') => {
    if (!currentItem || isGameOver) return;

    if (choice === currentItem.type) {
      // Correct!
      setScore(prev => prev + 10);
      setTimer(prev => prev + 1); // bonus second
      setFeedbackColor('correct');
      setTimeout(() => setFeedbackColor('normal'), 250);
    } else {
      // Wrong!
      setLives(prev => {
        const next = prev - 1;
        if (next <= 0) {
          handleEndGame();
          return 0;
        }
        return next;
      });
      setFeedbackColor('wrong');
      setTimeout(() => setFeedbackColor('normal'), 250);
    }

    spawnItem();
  };

  const handleEndGame = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Save Highscore
    const saved = parseInt(localStorage.getItem('epilah_highscore') || '0');
    if (score > saved) {
      localStorage.setItem('epilah_highscore', score.toString());
      setHighScore(score);
    }
  };

  const handleOpenClaim = () => {
    if (score <= 0) {
      alert('Kumpulkan skor game terlebih dahulu sebelum mengklaim bonus!');
      return;
    }
    // Pre-fill selection
    if (currentUser) {
      setSelectedClaimId(currentUser.id);
    } else if (citizens.length > 0) {
      setSelectedClaimId(citizens[0].id);
    }
    setShowClaimModal(true);
  };

  const handleSubmitClaim = () => {
    if (!selectedClaimId) return;
    onDepositBonus(selectedClaimId, score);
    
    // Reset score after claim to avoid double claim
    setScore(0);
    setShowClaimModal(false);
    alert('Green Points berhasil ditambahkan ke rumah Anda! Silakan cek di Papan Peringkat.');
  };

  const getFeedbackBorderClass = () => {
    if (feedbackColor === 'correct') return 'border-[#738E61] bg-[#738E61]/15';
    if (feedbackColor === 'wrong') return 'border-rose-500 bg-rose-500/15';
    return 'border-brand-border bg-brand-card';
  };

  return (
    <div className="space-y-5 p-4 pb-20">
      {/* Game Introduction Header */}
      <div className="bg-gradient-to-br from-[#1C1C17] to-[#2D331C] text-[#F4F5EF] p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none">
          <Gamepad2 className="w-32 h-32 text-white" />
        </div>

        <div className="space-y-1 relative z-10">
          <span className="bg-[#738E61]/80 text-[#F4F5EF] font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest font-display">
            Mini Game Interaktif
          </span>
          <h3 className="text-lg font-black font-display text-white">
            Asah Otak: Pilah Cepat!
          </h3>
          <p className="text-[11px] text-[#F4F5EF]/85 leading-relaxed font-light">
            Uji kecepatan & pemahaman Anda dalam memilah sampah harian ke 4 kategori wadah pembuangan yang tepat. Kumpulkan skor setinggi-tingginya!
          </p>
        </div>

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#738E61]/35 relative z-10 select-none">
          <div className="flex items-center gap-1.5 font-semibold text-[#D6E8C1]">
            <Trophy className="w-4 h-4 fill-[#D6E8C1]" />
            <span>Skor Tertinggi Anda: <strong className="font-extrabold text-sm text-white font-mono">{highScore}</strong></span>
          </div>
          {!isPlaying && !isGameOver && (
            <button 
              onClick={handleStartGame}
              className="bg-[#738E61] hover:bg-[#D6E8C1] text-white hover:text-[#1C1C17] font-black px-4 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Mulai
            </button>
          )}
        </div>
      </div>

      {/* Game Arena screen area */}
      {isPlaying && currentItem && (
        <div className="bg-[#1C1C17] text-white rounded-3xl p-5 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-md border border-[#2D331C]">
          
          {/* Game Stats Bar */}
          <div className="flex justify-between items-center pb-3 border-b border-[#2D331C] select-none">
            <div className="flex gap-4">
              <div>
                <span className="text-[#A2A695] block uppercase font-black text-[8px] tracking-widest">
                  SKOR
                </span>
                <span className="text-base font-extrabold text-[#D6E8C1] font-mono">
                  {score}
                </span>
              </div>
              <div>
                <span className="text-[#A2A695] block uppercase font-black text-[8px] tracking-widest">
                  SISA WAKTU
                </span>
                <span className={`text-base font-extrabold font-mono ${timer <= 8 ? 'text-rose-400 animate-pulse' : 'text-rose-300'}`}>
                  {timer}s
                </span>
              </div>
            </div>

            {/* Life hearts */}
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-4 h-4 ${i < lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-neutral-700'}`} 
                />
              ))}
            </div>
          </div>

          {/* Active Card to sort */}
          <div className="flex-grow flex flex-col items-center justify-center py-5 text-center">
            <div className={`transition-all duration-150 py-6 px-8 rounded-2xl border-2 shadow-inner inline-block max-w-xs w-full ${getFeedbackBorderClass()}`}>
              <span className="text-5xl mb-2.5 block select-none">
                {currentItem.icon}
              </span>
              <h4 className="text-base font-extrabold font-display text-brand-dark">
                {currentItem.name}
              </h4>
              <p className="text-[10px] text-brand-muted mt-1">
                Masukkan ke tempat yang sesuai!
              </p>
            </div>
          </div>

          {/* 4 Categorization Bins buttons */}
          <div className="grid grid-cols-2 gap-2 select-none">
            <button 
              onClick={() => handleAnswer('organik')}
              className="bg-[#738E61] hover:bg-[#8AA777] py-2.5 rounded-xl font-bold text-[10px] transition border-b-4 border-[#4A5D3B] hover:-translate-y-0.5 active:translate-y-0 text-center shadow-xs text-white cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base">🌱</span>
              <span className="uppercase tracking-wide font-display mt-0.5">ORGANIK</span>
            </button>
            <button 
              onClick={() => handleAnswer('anorganik')}
              className="bg-[#455A64] hover:bg-[#5C7885] py-2.5 rounded-xl font-bold text-[10px] transition border-b-4 border-[#263238] hover:-translate-y-0.5 active:translate-y-0 text-center shadow-xs text-white cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base">🥤</span>
              <span className="uppercase tracking-wide font-display mt-0.5">ANORGANIK</span>
            </button>
            <button 
              onClick={() => handleAnswer('b3')}
              className="bg-[#D32F2F] hover:bg-[#E53935] py-2.5 rounded-xl font-bold text-[10px] transition border-b-4 border-[#9E0D0D] hover:-translate-y-0.5 active:translate-y-0 text-center shadow-xs text-white cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base">⚠️</span>
              <span className="uppercase tracking-wide font-display mt-0.5">LIMBAH B3</span>
            </button>
            <button 
              onClick={() => handleAnswer('residu')}
              className="bg-[#2E2E2A] hover:bg-[#3E3E38] py-2.5 rounded-xl font-bold text-[10px] transition border-b-4 border-[#1C1C17] hover:-translate-y-0.5 active:translate-y-0 text-center shadow-xs text-white cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base">🗑️</span>
              <span className="uppercase tracking-wide font-display mt-0.5">RESIDU</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Panel */}
      {isGameOver && (
        <div className="bg-[#1C1C17] text-white rounded-3xl p-6 text-center space-y-5 shadow-md border border-rose-950/50 animate-fadeIn">
          <div className="w-14 h-14 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto border border-rose-500 animate-pulse">
            <ShieldAlert className="w-7 h-7" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-lg font-black font-display text-white">
              Selesai / Game Over!
            </h3>
            <p className="text-[11px] text-brand-muted leading-relaxed font-light">
              Hebat! Anda telah memilah berbagai jenis sampah harian dengan cerdas.
            </p>
          </div>

          <div className="bg-[#2E2E2A] p-3.5 rounded-xl max-w-[180px] mx-auto border border-[#1C1C17]">
            <p className="text-[9px] text-brand-muted font-extrabold uppercase tracking-widest">
              Skor Akhir
            </p>
            <h4 className="text-2xl font-black text-[#D6E8C1] mt-1 font-mono">
              {score}
            </h4>
          </div>

          <div className="flex gap-2.5 justify-center">
            <button 
              onClick={handleStartGame}
              className="bg-[#2E2E2A] hover:bg-[#3E3E38] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1 border border-[#1C1C17] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Main Lagi
            </button>
            <button 
              onClick={handleOpenClaim}
              className="bg-[#738E61] hover:bg-[#8AA777] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              Klaim Poin
            </button>
          </div>
        </div>
      )}

      {/* Score Claim Modal inside Game tab */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1C17]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1C1C17] p-5 rounded-3xl max-w-xs w-full space-y-4 shadow-xl border border-[#E7E9DE] text-xs animate-scaleUp">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#738E61]" />
              <h4 className="font-extrabold text-sm font-display text-brand-dark">Kirim Skor ke Rumah Anda</h4>
            </div>
            
            <p className="text-[11px] text-[#738E61] leading-relaxed">
              Konversi skor game Anda <strong>1:1</strong> menjadi Green Points tambahan untuk mengharumkan nama blok rumah Anda di RT 005!
            </p>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-[#738E61] uppercase tracking-wider">
                  Pilih Blok & Rumah Anda
                </label>
                <select 
                  value={selectedClaimId} 
                  onChange={(e) => setSelectedClaimId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E7E9DE] rounded-xl bg-[#F4F5EF] text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-text"
                >
                  {citizens.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.block} No. {c.houseNo} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#F4F5EF] rounded-xl flex justify-between items-center text-xs border border-[#E7E9DE]">
                <span className="font-extrabold text-[#1C1C17]">Poin Ditambahkan:</span>
                <span className="font-black text-[#738E61] font-mono">+{score} Pts</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-[#E7E9DE]">
              <button 
                onClick={handleSubmitClaim}
                className="flex-grow bg-[#738E61] hover:bg-[#5C724D] text-white font-extrabold py-2 rounded-xl transition text-xs shadow-xs cursor-pointer"
              >
                Klaim Sekarang
              </button>
              <button 
                onClick={() => setShowClaimModal(false)}
                className="px-3 py-2 bg-[#E7E9DE] hover:bg-[#DDE1D2] text-[#1C1C17] font-semibold rounded-xl transition text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
