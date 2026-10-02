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

export interface AuthAccount {
  username: string;
  password: string;
  roleId: UserRole;
  nama: string;
  departemen: string;
}

export const INITIAL_AUTH_CREDENTIALS: AuthAccount[] = [
  {
    username: 'superadm',
    password: 'Sup3r@dm',
    roleId: 'SUPERADMIN',
    nama: 'Super Administrator (dr. Penggalih)',
    departemen: 'Fakultas Kedokteran UNWAHAS',
  },
  {
    username: 'dosen1',
    password: 'dosen123',
    roleId: 'ADMIN_DOSEN_1',
    nama: 'Dr. dr. Hendra Prasetyo, Sp.FK',
    departemen: 'Departemen Farmakologi & Terapi FK',
  },
  {
    username: 'dosen2',
    password: 'dosen223',
    roleId: 'ADMIN_DOSEN_2',
    nama: 'Prof. Apt. Sri Rahayu, M.Si., Ph.D.',
    departemen: 'Laboratorium Herbal Medik & FHI',
  },
];

export const INITIAL_MASTER_PARTS = [
  'Rimpang',
  'Daun',
  'Kulit Batang',
  'Buah',
  'Herba',
  'Bunga',
  'Akar',
  'Umbi Lapis',
  'Biji',
  'Batang',
  'Kayu',
  'Ekstrak Daun',
  'Rambut (Tangkai Putik)',
];

export const INITIAL_MASTER_INDICATIONS = [
  'Antiinflamasi',
  'Antihipertensi',
  'Antidiabetes',
  'Antimikroba',
  'Hepatoprotektor',
  'Karminatif',
  'Diuretik',
  'Antioksidan',
  'Analgesik',
  'Nootropik',
  'Antidiare',
  'Antipiretik',
  'Imunomodulator',
  'Gastroprotektif',
  'Antikolesterol (Dislipidemia)',
];

export const INITIAL_MASTER_MONOGRAPHS = [
  'FHI Edisi II',
  'Suplemen II FHI',
  'FHI Edisi I',
  'Formularium Obat Herbal Asli Indonesia (FOHAI)',
  'Formularium Ramuan Obat Tradisional Indonesia (FROTI)',
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
  batchDelete: (ids: string[]) => void;
  batchUpdateStatus: (ids: string[], status: 'Published' | 'Draft') => void;
  importFromJson: (jsonData: Plant[]) => boolean;
  triggerPubChemSync: (id: string) => Promise<{ success: boolean; message: string }>;
  resetToDefaultData: () => void;
  exportToCsv: () => string;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isSyncingId: string | null;

  // Master Reference Data
  masterParts: string[];
  masterIndications: string[];
  masterMonographs: string[];
  addMasterPart: (part: string) => void;
  deleteMasterPart: (part: string) => void;
  addMasterIndication: (indication: string) => void;
  deleteMasterIndication: (indication: string) => void;
  addMasterMonograph: (monograph: string) => void;
  deleteMasterMonograph: (monograph: string) => void;

  // User Accounts Master
  accounts: AuthAccount[];
  addAccount: (account: AuthAccount) => void;
  updateAccount: (username: string, updates: Partial<AuthAccount>) => void;
  deleteAccount: (username: string) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

const STORAGE_KEY_PLANTS = 'ETHNO_PHYTOLAB_PLANTS_V3';
const STORAGE_KEY_USER = 'ETHNO_PHYTOLAB_ACTIVE_USER';
const STORAGE_KEY_BOOKMARKS = 'ETHNO_PHYTOLAB_BOOKMARKS';
const STORAGE_KEY_PARTS = 'ETHNO_PHYTOLAB_MASTER_PARTS';
const STORAGE_KEY_IND = 'ETHNO_PHYTOLAB_MASTER_INDICATIONS';
const STORAGE_KEY_MONO = 'ETHNO_PHYTOLAB_MASTER_MONOGRAPHS';
const STORAGE_KEY_ACCOUNTS = 'ETHNO_PHYTOLAB_MASTER_ACCOUNTS';

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

  // Master Data categories
  const [masterParts, setMasterParts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARTS);
      return saved ? JSON.parse(saved) : INITIAL_MASTER_PARTS;
    } catch {
      return INITIAL_MASTER_PARTS;
    }
  });

  const [masterIndications, setMasterIndications] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IND);
      return saved ? JSON.parse(saved) : INITIAL_MASTER_INDICATIONS;
    } catch {
      return INITIAL_MASTER_INDICATIONS;
    }
  });

  const [masterMonographs, setMasterMonographs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MONO);
      return saved ? JSON.parse(saved) : INITIAL_MASTER_MONOGRAPHS;
    } catch {
      return INITIAL_MASTER_MONOGRAPHS;
    }
  });

  const [accounts, setAccounts] = useState<AuthAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_AUTH_CREDENTIALS;
    } catch {
      return INITIAL_AUTH_CREDENTIALS;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PARTS, JSON.stringify(masterParts));
  }, [masterParts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IND, JSON.stringify(masterIndications));
  }, [masterIndications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONO, JSON.stringify(masterMonographs));
  }, [masterMonographs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  const userProfile = USER_PROFILES[activeUser];
  const isLoggedIn = userProfile.peran === 'SUPERADMIN' || userProfile.peran === 'ADMIN';

  const login = (username: string, password: string): { success: boolean; message: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    const matched = accounts.find(
      (c) => c.username.toLowerCase() === trimmedUser && c.password === trimmedPass
    );

    if (matched) {
      setActiveUser(matched.roleId);
      const roleName = USER_PROFILES[matched.roleId].peran;
      return {
        success: true,
        message: `Selamat datang! Berhasil masuk sebagai ${roleName} (${matched.nama}).`,
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

  const batchDelete = (ids: string[]) => {
    setPlants(prev => prev.filter(p => !ids.includes(p.id)));
    setBookmarkedIds(prev => prev.filter(bId => !ids.includes(bId)));
  };

  const batchUpdateStatus = (ids: string[], status: 'Published' | 'Draft') => {
    setPlants(prev =>
      prev.map(p => {
        if (ids.includes(p.id)) {
          return {
            ...p,
            statusKurasi: status,
            terakhirDiperbarui: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const importFromJson = (jsonData: Plant[]): boolean => {
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      setPlants(jsonData);
      return true;
    }
    return false;
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
    setMasterParts(INITIAL_MASTER_PARTS);
    setMasterIndications(INITIAL_MASTER_INDICATIONS);
    setMasterMonographs(INITIAL_MASTER_MONOGRAPHS);
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

  // Master Categories handlers
  const addMasterPart = (part: string) => {
    const trimmed = part.trim();
    if (trimmed && !masterParts.includes(trimmed)) {
      setMasterParts(prev => [...prev, trimmed]);
    }
  };

  const deleteMasterPart = (part: string) => {
    setMasterParts(prev => prev.filter(p => p !== part));
  };

  const addMasterIndication = (ind: string) => {
    const trimmed = ind.trim();
    if (trimmed && !masterIndications.includes(trimmed)) {
      setMasterIndications(prev => [...prev, trimmed]);
    }
  };

  const deleteMasterIndication = (ind: string) => {
    setMasterIndications(prev => prev.filter(i => i !== ind));
  };

  const addMasterMonograph = (m: string) => {
    const trimmed = m.trim();
    if (trimmed && !masterMonographs.includes(trimmed)) {
      setMasterMonographs(prev => [...prev, trimmed]);
    }
  };

  const deleteMasterMonograph = (m: string) => {
    setMasterMonographs(prev => prev.filter(item => item !== m));
  };

  // User Accounts Handlers
  const addAccount = (newAcc: AuthAccount) => {
    setAccounts(prev => {
      const filtered = prev.filter(a => a.username.toLowerCase() !== newAcc.username.toLowerCase());
      return [...filtered, newAcc];
    });
  };

  const updateAccount = (username: string, updates: Partial<AuthAccount>) => {
    setAccounts(prev =>
      prev.map(a => {
        if (a.username.toLowerCase() === username.toLowerCase()) {
          return { ...a, ...updates };
        }
        return a;
      })
    );
  };

  const deleteAccount = (username: string) => {
    if (username === 'superadm') return; // protect default superadmin
    setAccounts(prev => prev.filter(a => a.username !== username));
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
        batchDelete,
        batchUpdateStatus,
        importFromJson,
        triggerPubChemSync,
        resetToDefaultData,
        exportToCsv,
        bookmarkedIds,
        toggleBookmark,
        isSyncingId,

        masterParts,
        masterIndications,
        masterMonographs,
        addMasterPart,
        deleteMasterPart,
        addMasterIndication,
        deleteMasterIndication,
        addMasterMonograph,
        deleteMasterMonograph,

        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
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
