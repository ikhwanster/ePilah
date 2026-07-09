import React from 'react';
import { Home, BookOpen, Plus, Trophy, Gamepad2 } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavBarProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
}

export default function BottomNavBar({ activeTab, onChangeTab }: BottomNavBarProps) {
  return (
    <div className="fixed md:absolute bottom-0 left-0 right-0 bg-[#E7E9DE] border-t border-[#DDE1D2] py-3 px-6 flex justify-around items-center z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] select-none rounded-b-none md:rounded-b-[22px] transition-all duration-300">
      
      {/* Home Button */}
      <button 
        onClick={() => onChangeTab('dashboard')} 
        className={`flex flex-col items-center gap-0.5 transition-colors duration-150 cursor-pointer ${activeTab === 'dashboard' ? 'text-brand-primary scale-105' : 'text-brand-muted hover:text-brand-primary/80'}`}
        id="mob-dashboard"
      >
        <Home className="w-5 h-5" />
        <span className={`text-[10px] uppercase tracking-wide ${activeTab === 'dashboard' ? 'font-extrabold text-brand-primary' : 'font-medium'}`}>
          Beranda
        </span>
      </button>

      {/* Guide Button */}
      <button 
        onClick={() => onChangeTab('panduan')} 
        className={`flex flex-col items-center gap-0.5 transition-colors duration-150 cursor-pointer ${activeTab === 'panduan' ? 'text-brand-primary scale-105' : 'text-brand-muted hover:text-brand-primary/80'}`}
        id="mob-panduan"
      >
        <BookOpen className="w-5 h-5" />
        <span className={`text-[10px] uppercase tracking-wide ${activeTab === 'panduan' ? 'font-extrabold' : 'font-medium'}`}>
          Panduan
        </span>
      </button>

      {/* Floating Setor Button */}
      <button 
        onClick={() => onChangeTab('setor')} 
        className="flex flex-col items-center gap-0.5 transition-transform duration-150 active:scale-95 cursor-pointer"
        id="mob-setor"
      >
        <div className={`w-12 h-12 -mt-7 rounded-full flex items-center justify-center shadow-md border-4 border-[#E7E9DE] transition-all ${activeTab === 'setor' ? 'bg-brand-primary scale-110 shadow-brand-primary/20' : 'bg-[#A2B591] hover:bg-brand-primary/90'}`}>
          <Plus className="w-5 h-5 text-white" />
        </div>
        <span className={`text-[10px] uppercase tracking-wide mt-0.5 ${activeTab === 'setor' ? 'text-brand-primary font-extrabold' : 'text-brand-muted font-medium'}`}>
          Setor
        </span>
      </button>

      {/* Leaderboard Button */}
      <button 
        onClick={() => onChangeTab('leaderboard')} 
        className={`flex flex-col items-center gap-0.5 transition-colors duration-150 cursor-pointer ${activeTab === 'leaderboard' ? 'text-brand-primary scale-105' : 'text-brand-muted hover:text-brand-primary/80'}`}
        id="mob-leaderboard"
      >
        <Trophy className="w-5 h-5" />
        <span className={`text-[10px] uppercase tracking-wide ${activeTab === 'leaderboard' ? 'font-extrabold' : 'font-medium'}`}>
          Peringkat
        </span>
      </button>

      {/* Game Button */}
      <button 
        onClick={() => onChangeTab('game')} 
        className={`flex flex-col items-center gap-0.5 transition-colors duration-150 cursor-pointer ${activeTab === 'game' ? 'text-brand-primary scale-105' : 'text-brand-muted hover:text-brand-primary/80'}`}
        id="mob-game"
      >
        <Gamepad2 className="w-5 h-5" />
        <span className={`text-[10px] uppercase tracking-wide ${activeTab === 'game' ? 'font-extrabold' : 'font-medium'}`}>
          Game
        </span>
      </button>
      
    </div>
  );
}
