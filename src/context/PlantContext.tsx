import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plant, UserRole, UserProfile } from '../types/plant';
import { buildInitialPlants } from '../data/initialPlants';
import { autoFetchMetabolitesForPlant } from '../services/pubchemService';

export const USER_PROFILES: Record<UserRole, UserProfile> = {
  SUPERADMIN: {
    id: 'SUPERADMIN',
    username: 'superadm',
    nama: 'Super Administrator Lab',
    gelar: 'Pengembang & Kurator Utama',
    departemen: 'Ethno PhytoLab Digital Atlas · FK UNWAHAS',
    peran: 'SUPERADMIN',
    avatarInitials: 'SA',
  },
  ADMIN_DOSEN_1: {
    id: 'ADMIN_DOSEN_1',
    username: 'dosen1',
    nama: 'Dr. dr. Hendra Prasetyo, Sp.FK',
    gelar: 'Dosen Spesialis Farmakologi Klinik',
    departemen: 'Departemen Farmakologi & Terapi FK',
    peran: 'ADMIN',
    avatarInitials: 'HP',
  },
  ADMIN_DOSEN_2: {
    id: 'ADMIN_DOSEN_2',
    username: 'dosen2',
    nama: 'Prof. Apt. Sri Rahayu, M.Si., Ph.D.',
    gelar: 'Dosen Fitokimia & Biologi Farmasi',
    departemen: 'Laboratorium Herbal Medik & FHI',
    peran: 'ADMIN',
    avatarInitials: 'SR',
  },
  MAHASISWA: {
    id: 'MAHASISWA',
    username: 'mahasiswa',
    nama: 'Mahasiswa / Praktikan Laboratorium',
    gelar: 'Pengguna Publik (Read-Only)',
    departemen: 'Modul Fitoterapi & Farmakognosi FK',
    peran: 'USER',
    avatarInitials: 'FK',
  },
};

// Registered Authentication Credentials
export const AUTH_CREDENTIALS = [
  {
    username: 'superadm',
    password: 'Sup3r@dm',
    roleId: 'SUPERADMIN' as UserRole,
  },
  {
    username: 'dosen1',
    password: 'dosen123',
    roleId: 'ADMIN_DOSEN_1' as UserRole,
  },
  {
    username: 'dosen2',
    password: 'dosen223',
    roleId: 'ADMIN_DOSEN_2' as UserRole,
  },
];

interface PlantContextType {
  plants: Plant[];
  activeUser: UserRole;
  userProfile: UserProfile;
  isLoggedIn: boolean;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  switchUser: (role: UserRole) => void;
  addPlant: (newPlantData: Omit<Plant, 'id' | 'no' | 'terakhirDiperbarui' | 'dikurasiOleh'>) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  triggerPubChemSync: (id: string) => Promise<{ success: boolean; message: string }>;
  resetToDefaultData: () => void;
  exportToCsv: () => string;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isSyncingId: string | null;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

const STORAGE_KEY_PLANTS = 'FK_MED_HERBAL_PLANTS_V2';
const STORAGE_KEY_USER = 'ETHNO_PHYTOLAB_ACTIVE_USER';
const STORAGE_KEY_BOOKMARKS = 'ETHNO_PHYTOLAB_BOOKMARKS';

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load plants from storage, initializing defaults:', e);
    }
    return buildInitialPlants();
  });

  const [activeUser, setActiveUser] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved && (saved in USER_PROFILES)) {
      return saved as UserRole;
    }
    return 'MAHASISWA'; // Default: Mahasiswa / Read-Only
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANTS, JSON.stringify(plants));
    } catch (e) {
      console.warn('Storage quota limit reached for plants cache', e);
    }
  }, [plants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, activeUser);
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const userProfile = USER_PROFILES[activeUser];
  const isLoggedIn = userProfile.peran === 'SUPERADMIN' || userProfile.peran === 'ADMIN';

  const login = (username: string, password: string): { success: boolean; message: string } => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    const matched = AUTH_CREDENTIALS.find(
      (c) => c.username.toLowerCase() === trimmedUser.toLowerCase() && c.password === trimmedPass
    );

    if (matched) {
      setActiveUser(matched.roleId);
      const roleName = USER_PROFILES[matched.roleId].peran;
      return {
        success: true,
        message: `Selamat datang! Berhasil masuk sebagai ${roleName} (${USER_PROFILES[matched.roleId].nama}).`,
      };
    }

    return {
      success: false,
      message: 'Username atau kata sandi tidak valid. Silakan periksa kembali kredensial Anda.',
    };
  };

  const logout = () => {
    setActiveUser('MAHASISWA');
  };

  const switchUser = (role: UserRole) => {
    setActiveUser(role);
  };

  const addPlant = (newPlantData: Omit<Plant, 'id' | 'no' | 'terakhirDiperbarui' | 'dikurasiOleh'>) => {
    const nextNo = plants.length > 0 ? Math.max(...plants.map(p => p.no)) + 1 : 1;
    const newPlant: Plant = {
      ...newPlantData,
      id: `FHI-${String(nextNo).padStart(3, '0')}`,
      no: nextNo,
      terakhirDiperbarui: new Date().toISOString().split('T')[0],
      dikurasiOleh: userProfile.nama,
    };

    setPlants(prev => [newPlant, ...prev]);
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            terakhirDiperbarui: new Date().toISOString().split('T')[0],
            dikurasiOleh: userProfile.nama,
          };
        }
        return p;
      })
    );
  };

  const deletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
    setBookmarkedIds(prev => prev.filter(bId => bId !== id));
  };

  const triggerPubChemSync = async (id: string): Promise<{ success: boolean; message: string }> => {
    const target = plants.find(p => p.id === id);
    if (!target) return { success: false, message: 'Tanaman tidak ditemukan' };

    setIsSyncingId(id);
    try {
      const syncResult = await autoFetchMetabolitesForPlant(target.namaLatin, target.senyawaAktif);

      if (syncResult.metabolites && syncResult.metabolites.length > 0) {
        updatePlant(id, {
          senyawaAktif: syncResult.metabolites,
          pubchemCid: syncResult.primaryCid,
          pubchemLink: syncResult.primaryCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${syncResult.primaryCid}` : target.pubchemLink,
        });
        return {
          success: true,
          message: `Berhasil sinkronisasi ${syncResult.metabolites.length} metabolit dari PubChem PUG-REST.`,
        };
      } else {
        return {
          success: false,
          message: `PubChem tidak mengembalikan senyawa aktif baru untuk spesies "${target.namaLatin}". Data lama tetap dipertahankan.`,
        };
      }
    } catch (error) {
      console.error('PubChem sync error:', error);
      return {
        success: false,
        message: 'Gagal menghubungi PubChem PUG-REST API. Periksa koneksi internet.',
      };
    } finally {
      setIsSyncingId(null);
    }
  };

  const resetToDefaultData = () => {
    const defaults = buildInitialPlants();
    setPlants(defaults);
    localStorage.removeItem(STORAGE_KEY_PLANTS);
  };

  const exportToCsv = () => {
    const headers = [
      'No',
      'ID Tanaman',
      'Nama Lokal',
      'Nama Latin',
      'Famili',
      'Bagian yang Digunakan',
      'Sumber Monografi',
      'Indikasi Klinis',
      'Senyawa Aktif Utama',
      'PubChem CID',
      'Status Kurasi',
      'Terakhir Diperbarui'
    ];

    const rows = plants.map(p => [
      p.no,
      p.id,
      `"${p.namaLokal.replace(/"/g, '""')}"`,
      `"${p.namaLatin.replace(/"/g, '""')}"`,
      `"${p.famili.replace(/"/g, '""')}"`,
      `"${p.bagianDigunakan.replace(/"/g, '""')}"`,
      `"${p.sumberMonografi.replace(/"/g, '""')}"`,
      `"${p.indikasiKlinis.join('; ').replace(/"/g, '""')}"`,
      `"${p.senyawaAktif.map(s => s.nama).join('; ').replace(/"/g, '""')}"`,
      p.pubchemCid || '',
      p.statusKurasi,
      p.terakhirDiperbarui
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        activeUser,
        userProfile,
        isLoggedIn,
        login,
        logout,
        switchUser,
        addPlant,
        updatePlant,
        deletePlant,
        triggerPubChemSync,
        resetToDefaultData,
        exportToCsv,
        bookmarkedIds,
        toggleBookmark,
        isSyncingId,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
};
