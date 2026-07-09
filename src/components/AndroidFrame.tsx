import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, MoreVertical, ShieldAlert } from 'lucide-react';
import { TabId } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  showBack?: boolean;
  viewMode: 'mobile' | 'web';
  onToggleViewMode: (mode: 'mobile' | 'web') => void;
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
}

export default function AndroidFrame({
  children,
  title,
  subtitle,
  onBackClick,
  showBack = false,
  viewMode,
  onToggleViewMode,
  activeTab,
  onChangeTab,
}: AndroidFrameProps) {
  const [time, setTime] = useState<string>('00:00');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-sans overflow-x-hidden relative">
      {/* Absolute Decorative Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* View Mode Switcher Control Bar (Visible only on desktop screens) */}
      <div className="hidden sm:flex items-center gap-1.5 mb-4 bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/50 shadow-lg text-xs z-50">
        <span className="text-slate-400 font-extrabold px-2.5 uppercase tracking-wider text-[10px]">
          Mode Tampilan:
        </span>
        <button
          onClick={() => onToggleViewMode('web')}
          className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'web'
              ? 'bg-[#738E61] text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-700/50'
          }`}
          id="view-mode-web"
        >
          <span>💻</span> Tampilan Web Responsif
        </button>
        <button
          onClick={() => onToggleViewMode('mobile')}
          className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'mobile'
              ? 'bg-[#738E61] text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-700/50'
          }`}
          id="view-mode-mobile"
        >
          <span>📱</span> Simulator HP
        </button>
      </div>

      {/* Main Container - Desktop Phone mockup or Mobile full-screen / Tablet expansive layout */}
      <div
        className={`w-full bg-brand-bg text-brand-text flex flex-col relative transition-all duration-300 ${
          viewMode === 'web'
            ? 'max-w-6xl w-full sm:min-h-[820px] sm:rounded-3xl sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden'
            : 'max-w-md sm:h-[840px] sm:rounded-[40px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden'
        }`}
      >
        {/* Android Top Notch & Status Bar (Only visible in phone simulator mode) */}
        {viewMode === 'mobile' && (
          <div className="bg-[#44483D] text-brand-bg px-6 pt-3 pb-1.5 flex justify-between items-center text-xs font-medium tracking-wide shrink-0 select-none relative z-30">
            <span className="font-semibold text-[#D6E8C1]">{time}</span>

            {/* Subtle Phone Notch Pin-hole for Camera on screens larger than mobile */}
            <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 bg-slate-900 rounded-full border border-slate-800"></div>

            <div className="flex items-center gap-1.5 text-[#D6E8C1]">
              <Signal className="w-3.5 h-3.5 fill-current" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current rotate-90 sm:rotate-0" />
              <span className="text-[10px] font-bold">88%</span>
            </div>
          </div>
        )}

        {/* Dynamic App Header */}
        <header className="bg-brand-primary text-white px-5 py-4 shadow-md shrink-0 relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {showBack && viewMode === 'mobile' ? (
              <button
                onClick={onBackClick}
                className="p-1.5 hover:bg-brand-muted rounded-full transition active:scale-95"
                id="header-back-btn"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            ) : (
              <div className="bg-white/15 text-brand-bg p-2.5 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-xl font-bold text-brand-accent">♻️</span>
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-base tracking-wide font-display leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-brand-bg/90 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Desktop/Tablet Navigation Menu inside the header when in Web View mode */}
          {viewMode === 'web' && (
            <div className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/5 select-none self-center">
              <button
                onClick={() => onChangeTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
                id="web-nav-dashboard"
              >
                Beranda
              </button>
              <button
                onClick={() => onChangeTab('panduan')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition ${
                  activeTab === 'panduan'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
                id="web-nav-panduan"
              >
                Panduan
              </button>
              <button
                onClick={() => onChangeTab('setor')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition ${
                  activeTab === 'setor'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
                id="web-nav-setor"
              >
                Setor Sampah
              </button>
              <button
                onClick={() => onChangeTab('leaderboard')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition ${
                  activeTab === 'leaderboard'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
                id="web-nav-leaderboard"
              >
                Peringkat
              </button>
              <button
                onClick={() => onChangeTab('game')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition ${
                  activeTab === 'game'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
                id="web-nav-game"
              >
                Game Edukasi
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="bg-[#D6E8C1] text-[#2D331C] px-3 py-1 rounded-full text-[10px] font-extrabold border border-brand-primary/20 shadow-xs uppercase tracking-wider">
              Blok A - D
            </span>
            <button className="p-1.5 hover:bg-white/10 rounded-full transition text-white">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Phone App Screen Area */}
        <div
          className="flex-grow overflow-y-auto bg-brand-bg pb-24 relative"
          id="android-screen-container"
        >
          {children}
        </div>

        {/* Bottom Virtual Pill Bar (Only in phone simulator mode) */}
        {viewMode === 'mobile' && (
          <div className="hidden sm:flex bg-brand-bg justify-center py-2 border-t border-brand-border shrink-0 z-40 select-none">
            <div className="w-32 h-1 bg-brand-border rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
