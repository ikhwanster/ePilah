import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, MoreVertical, ShieldAlert } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  showBack?: boolean;
}

export default function AndroidFrame({
  children,
  title,
  subtitle,
  onBackClick,
  showBack = false,
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden">
      {/* Absolute Decorative Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container - Desktop beautiful card or Mobile full-screen */}
      <div className="w-full max-w-2xl sm:min-h-[750px] sm:max-h-[920px] sm:rounded-3xl bg-brand-bg text-brand-text flex flex-col relative sm:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] sm:border-[8px] sm:border-slate-800 overflow-hidden transition-all duration-300">
        
        {/* Android Top Notch & Status Bar (Visible on desktop mock & full-screen) */}
        <div className="bg-brand-muted text-brand-bg px-6 pt-3 pb-1.5 flex justify-between items-center text-xs font-medium tracking-wide shrink-0 select-none">
          <span className="font-semibold">{time}</span>
          
          {/* Subtle Phone Notch Pin-hole for Camera on screens larger than mobile */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 bg-slate-900 rounded-full border border-slate-800"></div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current rotate-90 sm:rotate-0" />
            <span className="text-[10px] font-bold">88%</span>
          </div>
        </div>

        {/* Android App Header */}
        <header className="bg-brand-primary text-white px-4 py-3 shadow-sm shrink-0 relative z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={onBackClick}
                className="p-1.5 hover:bg-brand-muted rounded-full transition active:scale-95"
                id="header-back-btn"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            ) : (
              <div className="bg-white/15 text-brand-bg p-2 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-base font-bold text-brand-accent">♻️</span>
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-sm tracking-wide font-display leading-tight">{title}</h1>
              {subtitle && <p className="text-[10px] text-brand-bg/95 font-light">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="bg-brand-muted text-brand-bg px-2 py-0.5 rounded-full text-[9px] font-bold border border-brand-primary/30">
              Blok A - D
            </span>
            <button className="p-1 hover:bg-brand-muted rounded-full transition text-brand-bg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Phone App Screen Area */}
        <div className="flex-grow overflow-y-auto bg-brand-bg pb-24 relative" id="android-screen-container">
          {children}
        </div>

        {/* Android Bottom Navigation Bar Virtual Pill (Only on desktop frame) */}
        <div className="hidden sm:flex bg-brand-bg justify-center py-2 border-t border-brand-border shrink-0 z-40 select-none">
          <div className="w-32 h-1 bg-brand-border rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
