import React, { useState, useEffect, useRef } from 'react';
import { Citizen, ActivityLog, TabId } from './types';
import { fallbackCitizens } from './data';
import { AnimatePresence } from 'motion/react';

import { 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  getDocs, 
  writeBatch,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import ClaimModal from './components/ClaimModal';

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
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Firebase Auth and Claim State
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);

  // CSV Connection State
  const [csvStatus, setCsvStatus] = useState<'connecting' | 'connected' | 'fallback'>('connecting');
  const [csvMessage, setCsvMessage] = useState<string>('Menghubungkan ke Cloud Firestore...');

  // Toast Alerts State
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastColor, setToastColor] = useState<string>('bg-brand-primary');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  // User Profile and Onboarding State
  const [currentUser, setCurrentUser] = useState<Citizen | null>(null);

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('epilah_onboarding_completed_rt005') !== 'true';
  });

  // Responsive viewMode state: 'web' (default fluid responsive) or 'mobile' (simulator frame)
  const [viewMode, setViewMode] = useState<'mobile' | 'web'>(() => {
    try {
      const saved = localStorage.getItem('epilah_view_mode');
      return (saved as 'mobile' | 'web') || 'web';
    } catch {
      return 'web';
    }
  });

  const handleToggleViewMode = (mode: 'mobile' | 'web') => {
    setViewMode(mode);
    localStorage.setItem('epilah_view_mode', mode);
    triggerToast(
      mode === 'web'
        ? 'Beralih ke Tampilan Web Responsif 💻'
        : 'Beralih ke Simulator Handphone 📱',
      'bg-[#738E61]'
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Firestore Sync for Citizens and Activity Logs
  useEffect(() => {
    setCsvStatus('connecting');
    setCsvMessage('Menghubungkan ke Cloud Database...');

    // 1. Subscribe to Citizens
    const unsubscribeCitizens = onSnapshot(collection(db, 'citizens'), async (snapshot) => {
      if (snapshot.empty) {
        setCsvMessage('Seeding database RT 005 ke Cloud...');
        try {
          const batch = writeBatch(db);
          fallbackCitizens.forEach((citizen) => {
            const docRef = doc(db, 'citizens', citizen.id);
            batch.set(docRef, {
              ...citizen,
              points: citizen.points,
              weight: citizen.weight,
              lastActive: citizen.lastActive
            });
          });
          await batch.commit();
          setCsvStatus('connected');
          setCsvMessage('Cloud Database RT 005 berhasil diinisialisasi.');
          triggerToast('Berhasil menginisialisasi Cloud Database RT 005! ☁️');
        } catch (err) {
          console.error('Gagal melakukan seeding:', err);
          setCsvStatus('fallback');
          setCsvMessage('Koneksi Cloud Gagal. Menjalankan fallback database lokal.');
          setCitizens(fallbackCitizens);
        }
      } else {
        const list: Citizen[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Citizen);
        });
        setCitizens(list);
        setCsvStatus('connected');
        setCsvMessage(`Server Real-Time Terhubung. Sinkronisasi ${list.length} rumah warga.`);
      }
    }, (err) => {
      console.error('Firestore citizens subscription error:', err);
      setCsvStatus('fallback');
      setCsvMessage('Gagal tersambung ke server real-time.');
      setCitizens(fallbackCitizens);
    });

    // 2. Subscribe to Activity Logs (Retrieve all, sort locally to bypass indexing errors)
    const unsubscribeLogs = onSnapshot(collection(db, 'activityLogs'), (snapshot) => {
      const list: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        let timestampDate = new Date();
        if (data.timestamp) {
          if (typeof data.timestamp.toDate === 'function') {
            timestampDate = data.timestamp.toDate();
          } else {
            timestampDate = new Date(data.timestamp);
          }
        }
        list.push({
          id: doc.id,
          name: data.name,
          house: data.house,
          type: data.type,
          amount: data.amount,
          points: data.points,
          time: data.time || 'Baru saja',
          timestamp: timestampDate,
          icon: data.icon,
          bg: data.bg,
          isNew: data.isNew || false,
        });
      });

      // Local Descending Sort by Timestamp
      list.sort((a, b) => {
        const timeA = a.timestamp ? (a.timestamp as Date).getTime() : 0;
        const timeB = b.timestamp ? (b.timestamp as Date).getTime() : 0;
        return timeB - timeA;
      });

      setActivityLogs(list.slice(0, 15));
    }, (err) => {
      console.error('Firestore activityLogs subscription error:', err);
    });

    return () => {
      unsubscribeCitizens();
      unsubscribeLogs();
    };
  }, []);

  // 3. Real-time Firebase Authentication Sync & Verified Citizen Matcher
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Query citizen where claimedBy === user.uid
        const q = query(collection(db, 'citizens'), where('claimedBy', '==', user.uid));
        try {
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const matchedCitizen = snapshot.docs[0].data() as Citizen;
            setCurrentUser(matchedCitizen);
            localStorage.setItem('epilah_current_user_rt005', JSON.stringify(matchedCitizen));
          }
        } catch (err) {
          console.error("Gagal sinkronisasi data user terverifikasi:", err);
        }
      } else {
        // Logged out
        const saved = localStorage.getItem('epilah_current_user_rt005');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.isVerified) {
              setCurrentUser(null);
              localStorage.removeItem('epilah_current_user_rt005');
            } else {
              setCurrentUser(parsed);
            }
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 4. Keep currentUser profile stats synced with live updates from Firestore
  useEffect(() => {
    if (currentUser) {
      const match = citizens.find(c => c.id === currentUser.id);
      if (match && (match.points !== currentUser.points || match.weight !== currentUser.weight || match.isVerified !== currentUser.isVerified)) {
        setCurrentUser(match);
        localStorage.setItem('epilah_current_user_rt005', JSON.stringify(match));
      }
    }
  }, [citizens]);

  const handleCompleteOnboarding = async (selectedCitizen: Citizen) => {
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('epilah_current_user_rt005');
      setCurrentUser(null);
      triggerToast('Berhasil keluar dari akun warga.', 'bg-[#44483D]');
    } catch (err) {
      console.error("Logout error:", err);
    }
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
  const parseCSVText = async (csvText: string) => {
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
        setCsvStatus('connecting');
        setCsvMessage('Menyinkronkan data CSV ke cloud...');
        const batch = writeBatch(db);
        parsed.forEach((citizen) => {
          const docRef = doc(db, 'citizens', citizen.id);
          batch.set(docRef, {
            id: citizen.id,
            block: citizen.block,
            houseNo: citizen.houseNo,
            name: citizen.name,
            points: citizen.points,
            weight: citizen.weight,
            lastActive: citizen.lastActive
          }, { merge: true });
        });
        await batch.commit();
        setCsvStatus('connected');
        setCsvMessage(`Terhubung: Memperbarui ${parsed.length} rumah dari data CSV.`);
        triggerToast(`Berhasil sinkronisasi ${parsed.length} rumah ke cloud! 🎉`);
      } else {
        throw new Error('Hasil parse data kosong');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('Gagal memproses data CSV.', 'bg-rose-600');
    }
  };

  const loadCSVData = async () => {
    setCsvStatus('connected');
    setCsvMessage('Server Real-Time Terhubung. Sinkronisasi Aktif.');
  };

  // Handle manual CSV uploads
  const handleCustomCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        await parseCSVText(text);
      }
    };
    reader.readAsText(file);
  };

  // Add custom real-time Firestore trash drop-off report
  const handleAddSetor = async (citizenId: string, reporterName: string, wasteType: string, weight: number) => {
    const presetMap: Record<string, { display: string, unit: string, mult: number, icon: string, bg: string }> = {
      plastik: { display: 'Plastik Bersih', unit: 'Kg', mult: 15, icon: '🥤', bg: 'bg-[#D6E8C1]/30' },
      kertas: { display: 'Kertas/Kardus', unit: 'Kg', mult: 10, icon: '📦', bg: 'bg-[#E7E9DE]/60' },
      logam: { display: 'Kaleng Alumunium', unit: 'Kg', mult: 20, icon: '🥫', bg: 'bg-[#D6E8C1]/30' },
      minyak: { display: 'Minyak Jelantah', unit: 'L', mult: 25, icon: '🍯', bg: 'bg-[#E7E9DE]/90' },
      organik: { display: 'Organik Basah', unit: 'Kg', mult: 5, icon: '🌱', bg: 'bg-[#D6E8C1]/50' },
    };

    const preset = presetMap[wasteType];
    const earnedPoints = Math.round(weight * preset.mult);

    try {
      const citizenRef = doc(db, 'citizens', citizenId);
      const targetCit = citizens.find(c => c.id === citizenId);
      
      if (!targetCit) {
        throw new Error('Warga tidak ditemukan');
      }

      await updateDoc(citizenRef, {
        points: (targetCit.points || 0) + earnedPoints,
        weight: (targetCit.weight || 0) + weight,
        lastActive: 'Setor Sampah'
      });

      await addDoc(collection(db, 'activityLogs'), {
        name: reporterName,
        house: `${targetCit.block}-${targetCit.houseNo}`,
        type: preset.display,
        amount: `${weight} ${preset.unit}`,
        points: earnedPoints,
        time: 'Baru saja',
        timestamp: new Date(),
        icon: preset.icon,
        bg: preset.bg,
        isNew: true
      });

      triggerToast(`Sukses! +${earnedPoints} Poin dicatatkan secara Real-Time.`);
    } catch (err: any) {
      console.error(err);
      triggerToast('Gagal menyetor data ke cloud server.', 'bg-rose-600');
    }

    // Switch to home tab
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 800);
  };

  // Handle deposition of game points to Cloud Firestore
  const handleDepositBonus = async (citizenId: string, bonusPoints: number) => {
    try {
      const citizenRef = doc(db, 'citizens', citizenId);
      const targetCit = citizens.find(c => c.id === citizenId);

      if (!targetCit) {
        throw new Error('Warga tidak ditemukan');
      }

      await updateDoc(citizenRef, {
        points: (targetCit.points || 0) + bonusPoints,
        lastActive: 'Main Game'
      });

      await addDoc(collection(db, 'activityLogs'), {
        name: targetCit.name,
        house: `${targetCit.block}-${targetCit.houseNo}`,
        type: 'Skor Game Edukasi',
        amount: `Skor ${bonusPoints}`,
        points: bonusPoints,
        time: 'Baru saja',
        timestamp: new Date(),
        icon: '🎮',
        bg: 'bg-[#D6E8C1]/50',
        isNew: true
      });

      triggerToast(`Klaim Sukses! +${bonusPoints} Poin ditransfer secara Real-Time.`);
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memproses bonus game ke cloud.', 'bg-rose-600');
    }

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
      viewMode={viewMode}
      onToggleViewMode={handleToggleViewMode}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
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
            onOpenClaim={() => setIsClaimModalOpen(true)}
            onLogout={handleLogout}
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

      {/* Verified Claim Registration and Login Modal */}
      <AnimatePresence>
        {isClaimModalOpen && (
          <ClaimModal
            citizens={citizens}
            isOpen={isClaimModalOpen}
            onClose={() => setIsClaimModalOpen(false)}
            onSuccess={(msg) => triggerToast(msg, 'bg-[#738E61]')}
          />
        )}
      </AnimatePresence>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNavBar 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        forceShow={viewMode === 'mobile'}
      />
    </AndroidFrame>
  );
}
