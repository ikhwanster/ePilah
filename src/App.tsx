import React, { useState, useEffect, useRef } from 'react';
import { Citizen, ActivityLog, TabId } from './types';
import { fallbackCitizens } from './data';

// Import subcomponents
import AndroidFrame from './components/AndroidFrame';
import DashboardTab from './components/DashboardTab';
import PanduanTab from './components/PanduanTab';
import SetorTab from './components/SetorTab';
import LeaderboardTab from './components/LeaderboardTab';
import GameTab from './components/GameTab';
import BottomNavBar from './components/BottomNavBar';
import OnboardingFlow from './components/OnboardingFlow';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [citizens, setCitizens] = useState<Citizen[]>(fallbackCitizens);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // CSV Connection State
  const [csvStatus, setCsvStatus] = useState<'connecting' | 'connected' | 'fallback'>('connecting');
  const [csvMessage, setCsvMessage] = useState<string>('Mencari file Data_Warga_Terurut.csv...');

  // Toast Alerts State
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastColor, setToastColor] = useState<string>('bg-brand-primary');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  // User Profile and Onboarding State
  const [currentUser, setCurrentUser] = useState<Citizen | null>(() => {
    try {
      const saved = localStorage.getItem('epilah_current_user_rt005');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('epilah_onboarding_completed_rt005') !== 'true';
  });

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto fetch CSV data from Vite public directory on start
  useEffect(() => {
    loadCSVData();
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, []);

  // Keep active profile in sync with live score changes in citizens list
  useEffect(() => {
    if (currentUser) {
      const match = citizens.find(c => c.id === currentUser.id);
      if (match && (match.points !== currentUser.points || match.weight !== currentUser.weight)) {
        setCurrentUser(match);
        localStorage.setItem('epilah_current_user_rt005', JSON.stringify(match));
      }
    }
  }, [citizens]);

  const handleCompleteOnboarding = (selectedCitizen: Citizen) => {
    setCurrentUser(selectedCitizen);
    localStorage.setItem('epilah_current_user_rt005', JSON.stringify(selectedCitizen));
    localStorage.setItem('epilah_onboarding_completed_rt005', 'true');
    setShowOnboarding(false);
    triggerToast(`Halo ${selectedCitizen.name}, profil rumah Anda siap!`);
  };

  const handleClearProfile = () => {
    localStorage.removeItem('epilah_current_user_rt005');
    setCurrentUser(null);
    triggerToast('Profil terhapus. Anda dapat mengatur ulang lewat menu dasbor.', 'bg-[#44483D]');
  };

  const triggerToast = (message: string, colorClass: string = 'bg-brand-primary') => {
    setToastMessage(message);
    setToastColor(colorClass);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  };

  // CSV parsing engine
  const parseCSVText = (csvText: string) => {
    try {
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        throw new Error('Format baris CSV tidak cukup');
      }

      // Detect separator
      const firstLine = lines[0];
      const delimiter = firstLine.includes(';') ? ';' : ',';

      // Parse headers
      const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));

      let blockIdx = headers.findIndex(h => h.includes('blok') || h.includes('block'));
      let houseNoIdx = headers.findIndex(h => h.includes('no_rumah') || h.includes('no rumah') || h.includes('norumah') || h === 'no');
      let nameIdx = headers.findIndex(h => h.includes('nama') || h.includes('name') || h.includes('penghuni'));
      let pointsIdx = headers.findIndex(h => h.includes('poin') || h.includes('point'));
      let weightIdx = headers.findIndex(h => h.includes('berat') || h.includes('weight'));

      // Set fallback indices if headers differ
      if (blockIdx === -1) blockIdx = 0;
      if (houseNoIdx === -1) houseNoIdx = 1;
      if (nameIdx === -1) nameIdx = 2;
      if (pointsIdx === -1) pointsIdx = 3;
      if (weightIdx === -1) weightIdx = 4;

      const parsed: Citizen[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Parse row handling quotes
        const rowText = lines[i];
        let cells: string[] = [];
        let currentCell = '';
        let insideQuotes = false;

        for (let j = 0; j < rowText.length; j++) {
          const char = rowText[j];
          if (char === '"' || char === "'") {
            insideQuotes = !insideQuotes;
          } else if (char === delimiter && !insideQuotes) {
            cells.push(currentCell.trim());
            currentCell = '';
          } else {
            currentCell += char;
          }
        }
        cells.push(currentCell.trim());

        if (cells.length < Math.max(blockIdx, houseNoIdx, nameIdx) + 1) continue;

        let blockVal = cells[blockIdx] || 'LA 1';
        let houseNoVal = cells[houseNoIdx] || String(i);
        const nameVal = cells[nameIdx] || 'Warga';

        if (blockVal.includes('/')) {
          const parts = blockVal.split('/');
          blockVal = parts[0].trim();
          houseNoVal = parts[1].trim();
        } else if (blockVal.trim() === 'LC 1') {
          blockVal = 'LC 1';
          houseNoVal = '1';
        }

        let points = 0;
        if (pointsIdx !== -1 && cells[pointsIdx]) {
          points = parseInt(cells[pointsIdx].replace(/[^\d-]/g, '')) || 0;
        } else {
          points = Math.round(Math.abs(Math.sin(i * 3) * 450 + 150));
        }

        let weight = 0;
        if (weightIdx !== -1 && cells[weightIdx]) {
          weight = parseFloat(cells[weightIdx].replace(/[^\d.-]/g, '')) || 0;
        } else {
          weight = parseFloat((points / 12.5).toFixed(1));
        }

        // Clean block prefix
        let normalizedBlock = blockVal.trim();
        if (!normalizedBlock.toLowerCase().startsWith('blok')) {
          normalizedBlock = 'Blok ' + normalizedBlock;
        }

        // Clean double "Blok Blok" if already prefixed
        if (normalizedBlock.toLowerCase().startsWith('blok blok')) {
          normalizedBlock = normalizedBlock.substring(5);
        }

        const citizenId = `${normalizedBlock.replace(/\s+/g, '')}-${houseNoVal.trim()}`;

        parsed.push({
          id: citizenId,
          block: normalizedBlock,
          houseNo: houseNoVal.trim(),
          name: nameVal.trim(),
          points,
          weight,
          lastActive: 'Impor CSV',
        });
      }

      if (parsed.length > 0) {
        setCitizens(parsed);
        setCsvStatus('connected');
        setCsvMessage(`Terhubung: Memuat ${parsed.length} rumah dari database RT 005.`);
        triggerToast(`Sukses memuat ${parsed.length} rumah warga!`);
        startSimulatedFeed(parsed);
      } else {
        throw new Error('Hasil parse data kosong');
      }
    } catch (err) {
      console.error(err);
      setCsvStatus('fallback');
      setCsvMessage('Mode Fallback: Gagal membaca database CSV. Menggunakan data lokal bawaan.');
      triggerToast('Gagal parse CSV, mengaktifkan data lokal.', 'bg-rose-600');
      startSimulatedFeed(fallbackCitizens);
    }
  };

  const loadCSVData = async () => {
    setCsvStatus('connecting');
    setCsvMessage('Menghubungkan ke Data_Warga_Terurut.csv...');
    try {
      const response = await fetch('/Data_Warga_Terurut.csv');
      if (!response.ok) {
        throw new Error('Gagal fetch otomatis');
      }
      const text = await response.text();
      parseCSVText(text);
    } catch (e) {
      console.warn('Auto CSV load failed. Falling back to internal state.', e);
      setCsvStatus('fallback');
      setCsvMessage('Mode Fallback: Database CSV belum diunggah. Menggunakan data lokal bawaan.');
      startSimulatedFeed(fallbackCitizens);
    }
  };

  // Handle manual CSV uploads
  const handleCustomCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        parseCSVText(text);
      }
    };
    reader.readAsText(file);
  };

  // Background Simulator Engine
  const startSimulatedFeed = (currentCitizens: Citizen[]) => {
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);

    // Initial pre-fill simulation feed logs (4 entries)
    const initialLogs: ActivityLog[] = [];
    const wastePresets = [
      { type: 'Plastik Bersih', unit: 'Kg', multiplier: 15, icon: '🥤', bg: 'bg-[#D6E8C1]/30' },
      { type: 'Kertas & Karton', unit: 'Kg', multiplier: 10, icon: '📦', bg: 'bg-[#E7E9DE]/60' },
      { type: 'Kaleng Alumunium', unit: 'Kg', multiplier: 20, icon: '🥫', bg: 'bg-[#D6E8C1]/30' },
      { type: 'Minyak Jelantah', unit: 'Liter', multiplier: 25, icon: '🍯', bg: 'bg-[#E7E9DE]/90' },
      { type: 'Sampah Organik', unit: 'Kg', multiplier: 5, icon: '🌱', bg: 'bg-[#D6E8C1]/50' },
    ];

    for (let i = 0; i < 4; i++) {
      const resident = currentCitizens[Math.floor(Math.random() * currentCitizens.length)];
      const preset = wastePresets[Math.floor(Math.random() * wastePresets.length)];
      const w = parseFloat((Math.random() * 5 + 0.8).toFixed(1));
      const calculatedPoints = Math.round(w * preset.multiplier);
      const minutesAgo = Math.floor(Math.random() * 50 + 5);

      initialLogs.push({
        id: `sim-hist-${i}-${Date.now()}`,
        name: resident.name,
        house: `${resident.block}-${resident.houseNo}`,
        type: preset.type,
        amount: `${w} ${preset.unit}`,
        points: calculatedPoints,
        time: `${minutesAgo} menit lalu`,
        icon: preset.icon,
        bg: preset.bg,
      });
    }
    setActivityLogs(initialLogs);

    // Periodic generator every 9 seconds
    simulationIntervalRef.current = setInterval(() => {
      setCitizens(prevCitizens => {
        if (prevCitizens.length === 0) return prevCitizens;
        const index = Math.floor(Math.random() * prevCitizens.length);
        const resident = { ...prevCitizens[index] };
        
        const preset = wastePresets[Math.floor(Math.random() * wastePresets.length)];
        const w = parseFloat((Math.random() * 4 + 1.2).toFixed(1));
        const calculatedPoints = Math.round(w * preset.multiplier);

        // Update target resident stats
        resident.points += calculatedPoints;
        resident.weight += w;
        resident.lastActive = 'Baru saja';

        const updated = [...prevCitizens];
        updated[index] = resident;

        // Push new log to feed
        setActivityLogs(prevLogs => {
          const newLog: ActivityLog = {
            id: `sim-live-${Date.now()}`,
            name: resident.name,
            house: `${resident.block}-${resident.houseNo}`,
            type: preset.type,
            amount: `${w} ${preset.unit}`,
            points: calculatedPoints,
            time: 'Baru saja',
            icon: preset.icon,
            bg: preset.bg,
            isNew: true,
          };
          return [newLog, ...prevLogs.slice(0, 11)];
        });

        return updated;
      });
    }, 9000);
  };

  // Add custom manual drop-off report
  const handleAddSetor = (citizenId: string, reporterName: string, wasteType: string, weight: number) => {
    const presetMap: Record<string, { display: string, unit: string, mult: number, icon: string, bg: string }> = {
      plastik: { display: 'Plastik Bersih', unit: 'Kg', mult: 15, icon: '🥤', bg: 'bg-[#D6E8C1]/30' },
      kertas: { display: 'Kertas/Kardus', unit: 'Kg', mult: 10, icon: '📦', bg: 'bg-[#E7E9DE]/60' },
      logam: { display: 'Kaleng Alumunium', unit: 'Kg', mult: 20, icon: '🥫', bg: 'bg-[#D6E8C1]/30' },
      minyak: { display: 'Minyak Jelantah', unit: 'L', mult: 25, icon: '🍯', bg: 'bg-[#E7E9DE]/90' },
      organik: { display: 'Organik Basah', unit: 'Kg', mult: 5, icon: '🌱', bg: 'bg-[#D6E8C1]/50' },
    };

    const preset = presetMap[wasteType];
    const earnedPoints = Math.round(weight * preset.mult);

    setCitizens(prev => {
      const idx = prev.findIndex(c => c.id === citizenId);
      if (idx === -1) return prev;

      const updatedCit = { ...prev[idx] };
      updatedCit.points += earnedPoints;
      updatedCit.weight += weight;
      updatedCit.lastActive = 'Setor Manual';

      const copy = [...prev];
      copy[idx] = updatedCit;

      // Inject new log entry
      setActivityLogs(prevLogs => {
        const customLog: ActivityLog = {
          id: `manual-setor-${Date.now()}`,
          name: reporterName,
          house: `${updatedCit.block}-${updatedCit.houseNo}`,
          type: preset.display,
          amount: `${weight} ${preset.unit}`,
          points: earnedPoints,
          time: 'Baru saja',
          icon: preset.icon,
          bg: preset.bg,
          isNew: true,
        };
        return [customLog, ...prevLogs.slice(0, 11)];
      });

      return copy;
    });

    triggerToast(`Sukses! +${earnedPoints} Poin dicatatkan untuk ${citizenId.replace('Blok', 'Blok ')}.`);
    
    // Switch to home tab
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 800);
  };

  // Handle deposition of game points
  const handleDepositBonus = (citizenId: string, bonusPoints: number) => {
    setCitizens(prev => {
      const idx = prev.findIndex(c => c.id === citizenId);
      if (idx === -1) return prev;

      const updatedCit = { ...prev[idx] };
      updatedCit.points += bonusPoints;
      updatedCit.lastActive = 'Main Game';

      const copy = [...prev];
      copy[idx] = updatedCit;

      // Inject game deposit log entry
      setActivityLogs(prevLogs => {
        const gameLog: ActivityLog = {
          id: `game-bonus-${Date.now()}`,
          name: updatedCit.name,
          house: `${updatedCit.block}-${updatedCit.houseNo}`,
          type: 'Skor Game Edukasi',
          amount: `Skor ${bonusPoints}`,
          points: bonusPoints,
          time: 'Baru saja',
          icon: '🎮',
          bg: 'bg-[#D6E8C1]/50',
          isNew: true,
        };
        return [gameLog, ...prevLogs.slice(0, 11)];
      });

      return copy;
    });

    triggerToast(`Klaim Sukses! +${bonusPoints} Poin ditransfer.`);
    
    // Go to dashboard
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 800);
  };

  // Computations for overall stats
  const totalWeight = citizens.reduce((sum, c) => sum + c.weight, 0);
  const totalPoints = citizens.reduce((sum, c) => sum + c.points, 0);
  const activeCount = citizens.filter(c => c.weight > 0).length;
  const co2Saved = totalWeight * 0.82; // approximate metric

  return (
    <AndroidFrame 
      title="E-Pilah RT 005" 
      subtitle="Taman Buaran Indah IV • RW 013"
      showBack={activeTab !== 'dashboard'}
      onBackClick={() => setActiveTab('dashboard')}
    >
      {/* Hidden upload element */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleCustomCSVUpload} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Floating Header Toast Notification */}
      <div 
        className={`fixed top-14 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 px-4 py-2.5 rounded-2xl shadow-lg border border-white/10 flex items-center gap-2 max-w-xs text-center justify-center ${toastColor} ${toastVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'}`}
      >
        <span className="text-white text-xs font-bold leading-tight select-none">
          {toastMessage}
        </span>
      </div>

      {/* Primary Tab Router Switcher */}
      <div>
        {activeTab === 'dashboard' && (
          <DashboardTab 
            csvStatus={csvStatus}
            csvMessage={csvMessage}
            totalWeight={totalWeight}
            totalPoints={totalPoints}
            activeCount={activeCount}
            citizenCount={citizens.length}
            co2Saved={co2Saved}
            activityLogs={activityLogs}
            onUploadClick={() => fileInputRef.current?.click()}
            onRefreshClick={loadCSVData}
            onSwitchTab={setActiveTab}
            currentUser={currentUser}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onClearProfile={handleClearProfile}
          />
        )}

        {activeTab === 'panduan' && (
          <PanduanTab />
        )}

        {activeTab === 'setor' && (
          <SetorTab 
            citizens={citizens}
            onAddSetor={handleAddSetor}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab 
            citizens={citizens}
          />
        )}

        {activeTab === 'game' && (
          <GameTab 
            citizens={citizens}
            onDepositBonus={handleDepositBonus}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Interactive Onboarding walkthrough overlay */}
      {showOnboarding && (
        <OnboardingFlow 
          citizens={citizens}
          onComplete={handleCompleteOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Sticky Bottom Navigation Bar */}
      <BottomNavBar 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
      />
    </AndroidFrame>
  );
}
