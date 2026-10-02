import React, { useState } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { X, Lock, User, Eye, EyeOff, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = usePlantContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = login(username, password);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1000);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Autentikasi Pengelola Lab
              </h2>
              <p className="text-xs text-stone-500">
                Ethno PhytoLab Digital Atlas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Username Admin / SuperAdmin
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadm atau dosen1"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Chips for Practical Evaluation */}
          <div className="pt-2 border-t border-stone-100">
            <span className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Pilih Akun Demo Cepat:
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('superadm', 'Sup3r@dm')}
                className="w-full text-left p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[11px] block">SuperAdmin</span>
                  <span className="text-[10px] text-emerald-800 font-mono">user: superadm | pass: Sup3r@dm</span>
                </div>
                <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-mono font-medium">
                  Hak Tertinggi
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('dosen1', 'dosen123')}
                className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-[11px] block">Dosen 1 (Farmakologi)</span>
                  <span className="text-[10px] text-stone-500 font-mono">user: dosen1 | pass: dosen123</span>
                </div>
                <span className="text-[10px] text-stone-600 font-mono">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('dosen2', 'dosen223')}
                className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-[11px] block">Dosen 2 (Biologi Farmasi)</span>
                  <span className="text-[10px] text-stone-500 font-mono">user: dosen2 | pass: dosen223</span>
                </div>
                <span className="text-[10px] text-stone-600 font-mono">Admin</span>
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Masuk Sistem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
