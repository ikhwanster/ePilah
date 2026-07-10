import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Phone, Lock, Home, User, Key, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  updateDoc, 
  getDocs, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Citizen } from '../types';

interface ClaimModalProps {
  citizens: Citizen[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function ClaimModal({ citizens, isOpen, onClose, onSuccess }: ClaimModalProps) {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Filter out citizens that are already claimed to avoid double claims
  const availableCitizens = citizens.filter(c => !c.claimedBy);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegisterMode) {
        // Validation
        if (!selectedId) {
          throw new Error('Silakan pilih nomor rumah Anda terlebih dahulu.');
        }
        if (!email.trim() || !phone.trim() || !password.trim()) {
          throw new Error('Mohon lengkapi seluruh kolom isian.');
        }
        if (password.length < 6) {
          throw new Error('Kata sandi harus minimal 6 karakter.');
        }

        // Check if citizen is already claimed in the latest snapshot
        const citizenRef = doc(db, 'citizens', selectedId);
        
        // Register in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update citizen document in Firestore to bind to this user
        await updateDoc(citizenRef, {
          claimedBy: user.uid,
          email: email.trim(),
          phone: phone.trim(),
          isVerified: true,
          lastActive: 'Klaim Akun'
        });

        onSuccess('Selamat! Kepemilikan rumah berhasil diklaim dan terverifikasi secara aman! 🎉');
        onClose();
      } else {
        // Login Mode
        if (!email.trim() || !password.trim()) {
          throw new Error('Mohon masukkan email dan kata sandi Anda.');
        }

        await signInWithEmailAndPassword(auth, email, password);
        onSuccess('Berhasil masuk! Selamat datang kembali ke E-Pilah RT 005. 👋');
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      let message = err.message;
      if (err.code === 'auth/email-already-in-use') {
        message = 'Alamat email ini sudah terdaftar. Silakan masuk menggunakan menu Login.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Metode masuk Email/Sandi belum diaktifkan di Firebase Console. Silakan aktifkan di menu Authentication > Sign-in method.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Sandi terlalu lemah. Minimal harus terdiri dari 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Format alamat email tidak valid.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Email atau kata sandi salah. Silakan coba lagi.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-brand-bg text-brand-text max-w-sm w-full rounded-[32px] border border-brand-border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-border bg-[#D6E8C1] flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-primary" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-brand-dark font-display">
              {isRegisterMode ? 'Klaim Rumah (Verifikasi)' : 'Masuk Akun Warga'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition cursor-pointer text-brand-dark"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleAuthAction} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <p className="text-[10px] leading-relaxed font-bold">{errorMsg}</p>
            </div>
          )}

          {isRegisterMode ? (
            <>
              {/* Select Household */}
              <div className="space-y-1">
                <label className="block font-extrabold text-brand-muted uppercase tracking-wider text-[9px]">
                  Pilih Alamat Rumah Anda
                </label>
                <div className="relative">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs"
                  >
                    <option value="" disabled>-- Pilih Rumah & Nama Anda --</option>
                    {availableCitizens.map((citizen) => (
                      <option key={citizen.id} value={citizen.id}>
                        {citizen.block} No. {citizen.houseNo} - {citizen.name}
                      </option>
                    ))}
                  </select>
                  <Home className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block font-extrabold text-brand-muted uppercase tracking-wider text-[9px]">
                  Alamat Email Aktif
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                </div>
              </div>

              {/* WhatsApp/HP Phone Number */}
              <div className="space-y-1">
                <label className="block font-extrabold text-brand-muted uppercase tracking-wider text-[9px]">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Email Address for Login */}
              <div className="space-y-1">
                <label className="block font-extrabold text-brand-muted uppercase tracking-wider text-[9px]">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                </div>
              </div>
            </>
          )}

          {/* Password field */}
          <div className="space-y-1">
            <label className="block font-extrabold text-brand-muted uppercase tracking-wider text-[9px]">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
            </div>
          </div>

          {/* Verification Warning message */}
          {isRegisterMode && (
            <div className="flex gap-2 items-center bg-[#D6E8C1]/30 p-2.5 rounded-xl border border-[#738E61]/20 text-[9px] text-[#2D331C] font-semibold">
              <CheckCircle className="w-4 h-4 text-[#738E61] shrink-0" />
              <span>Verifikasi ini mengunci formulir setor agar hanya Anda yang bisa menyetor poin untuk rumah Anda!</span>
            </div>
          )}

          {/* Form Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-[#5C724D] text-white font-extrabold py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : isRegisterMode ? (
              'Klaim & Verifikasi Sekarang 🛡️'
            ) : (
              'Masuk ke Akun Warga 🔓'
            )}
          </button>

          {/* Toggle Switch */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
              }}
              className="text-[10px] text-brand-primary hover:underline font-bold"
            >
              {isRegisterMode 
                ? 'Sudah klaim rumah Anda? Masuk ke akun Anda di sini' 
                : 'Belum klaim rumah Anda? Klaim & verifikasi di sini'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
