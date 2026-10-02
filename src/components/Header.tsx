import React, { useState } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { 
  Leaf, 
  FlaskConical, 
  Plus, 
  Download, 
  Bookmark, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  LogIn,
  LogOut,
  ShieldCheck,
  Crown,
  Mail,
  UserCheck,
  Database,
  Users
} from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenPracticumDrawer: () => void;
  onOpenBatchSyncModal: () => void;
  onOpenLoginModal: () => void;
  onOpenMasterDataModal: (tab?: 'plants' | 'categories' | 'indications' | 'monographs' | 'users' | 'backup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenPracticumDrawer,
  onOpenBatchSyncModal,
  onOpenLoginModal,
  onOpenMasterDataModal,
}) => {
  const { 
    plants, 
    activeUser, 
    userProfile, 
    isLoggedIn, 
    logout, 
    bookmarkedIds, 
    exportToCsv,
    resetToDefaultData 
  } = usePlantContext();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const publishedCount = plants.filter(p => p.statusKurasi === 'Published').length;
  const draftCount = plants.filter(p => p.statusKurasi === 'Draft').length;
  const pubchemConnectedCount = plants.filter(p => (p.pubchemCid && p.pubchemCid > 0) || (p.senyawaAktif && p.senyawaAktif.length > 0)).length;

  const handleExport = () => {
    const csvData = exportToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ethno_PhytoLab_Digital_Atlas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Institutional Top Bar with Academic Developer Credit */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-xs font-mono flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
        <div className="flex items-center gap-2 tracking-wide flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-white">ETHNO PHYTOLAB DIGITAL ATLAS</span>
          <span className="text-stone-500">·</span>
          <span>Fakultas Kedokteran</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">Farmakope Herbal Indonesia (FHI)</span>
        </div>

        {/* Academic Developer Credit */}
        <div className="flex items-center gap-3 text-stone-300 text-[11px]">
          <a
            href="mailto:dr.penggalih@unwahas.ac.id"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-sans hover:underline"
            title="Hubungi Pengembang Sistem"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>dikembangkan oleh <strong>dr.penggalih@unwahas.ac.id</strong></span>
          </a>
          <span className="text-stone-700 hidden sm:inline">|</span>
          <span className="text-stone-400 hidden sm:inline">PubChem & SwissADME Ready</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center shadow-inner shrink-0">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
                Ethno PhytoLab Digital Atlas
              </h1>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Kedokteran & Herbal Medik
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Direktori & Atlas Interaktif Tanaman Obat · Penelusuran Makroskopis & Senyawa Komputasional
            </p>
          </div>
        </div>

        {/* Action Controls, Login/Logout & User Profile */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Practicum Bookmarks Button */}
          <button
            onClick={onOpenPracticumDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            title="Buku Catatan Praktikum Mahasiswa"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
            <span>Catatan Lab</span>
            {bookmarkedIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">
                {bookmarkedIds.length}
              </span>
            )}
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            title="Ekspor seluruh database ke file CSV"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          {/* Pengelolaan Master Data Button (Eksklusif SuperAdmin) */}
          {userProfile.peran === 'SUPERADMIN' && (
            <>
              <button
                onClick={() => onOpenMasterDataModal('users')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors shadow-xs"
                title="Langsung Buka Master Data Pengguna & Akun Dosen"
              >
                <Users className="w-3.5 h-3.5 text-stone-700" />
                <span>Master Pengguna</span>
              </button>

              <button
                onClick={() => onOpenMasterDataModal('plants')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-950 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg transition-colors shadow-xs"
                title="Konsol Lengkap Master Data (Eksklusif SuperAdmin)"
              >
                <Database className="w-3.5 h-3.5 text-purple-800" />
                <span>Kelola Master Data</span>
              </button>
            </>
          )}

          {/* Admin / SuperAdmin Add Plant Button */}
          {isLoggedIn && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tanaman</span>
            </button>
          )}

          {/* Auth State Control: Login Button OR User Badge + Logout */}
          {!isLoggedIn ? (
            /* TOMBOL LOGIN UNTUK ADMIN / SUPERADMIN */
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login Admin</span>
            </button>
          ) : (
            /* STATUS PENGGUNA TERAUTENTIKASI + TOMBOL LOGOUT */
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/90 rounded-lg p-1 pr-2">
              <div className="flex items-center gap-2 pl-1.5">
                <div 
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    userProfile.peran === 'SUPERADMIN' 
                      ? 'bg-purple-900 text-purple-200' 
                      : 'bg-emerald-900 text-emerald-200'
                  }`}
                >
                  {userProfile.peran === 'SUPERADMIN' ? <Crown className="w-3.5 h-3.5" /> : userProfile.avatarInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-stone-900 leading-tight">
                      {userProfile.peran}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-stone-200 text-stone-700">
                      @{userProfile.username}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 block truncate max-w-[130px]">
                    {userProfile.nama.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Reset database button (SuperAdmin only) */}
              {userProfile.peran === 'SUPERADMIN' && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-1 text-stone-400 hover:text-amber-700 rounded hover:bg-amber-50"
                  title="Kembalikan 119 Tanaman Baku FHI"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* TOMBOL LOGOUT */}
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md border border-red-200/80 transition-colors ml-1"
                title="Keluar dari sesi Admin (Kembali ke mode Mahasiswa)"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Laboratory Quick Metrics Bar */}
      <div className="bg-stone-50/70 border-t border-stone-200/80 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-mono">
          <span>Koleksi FHI: <strong className="text-stone-900">{plants.length} Spesies</strong></span>
          <span className="text-stone-300">|</span>
          <span>Status Terbit: <strong className="text-emerald-700">{publishedCount}</strong></span>
          {draftCount > 0 && (
            <>
              <span className="text-stone-300">|</span>
              <span>Draft Kurasi: <strong className="text-amber-700">{draftCount}</strong></span>
            </>
          )}
          <span className="text-stone-300">|</span>
          <span>Koneksi PubChem: <strong className="text-stone-800">{pubchemConnectedCount} Simplisia</strong></span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500">Mode: <strong className={isLoggedIn ? 'text-emerald-800' : 'text-blue-800'}>{userProfile.peran}</strong></span>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-2">
            {userProfile.peran === 'SUPERADMIN' && (
              <button
                onClick={() => onOpenMasterDataModal('plants')}
                className="text-[11px] font-semibold text-purple-900 hover:text-purple-950 flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded transition-colors"
                title="Buka Konsol Master Data (SuperAdmin)"
              >
                <Database className="w-3 h-3 text-purple-700" />
                <span>Menu Master Data</span>
              </button>
            )}
            <button
              onClick={onOpenBatchSyncModal}
              className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-100/60 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors"
            >
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>Pemeriksa PubChem PUG-REST</span>
            </button>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal (SuperAdmin only) */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-stone-200 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Kembalikan ke Database Baku FHI?
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh 119 tanaman obat resmi sesuai monografi Farmakope Herbal Indonesia Edisi II dan Suplemen II.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs"
              >
                Reset Database Baku
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
