import React, { useState, useRef, useEffect } from 'react';
import { usePlantContext, AuthAccount } from '../context/PlantContext';
import { Plant, UserRole } from '../types/plant';
import { 
  X, 
  Database, 
  Layers, 
  Tag, 
  BookOpen, 
  Users, 
  Download, 
  Upload, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Crown,
  Search,
  ExternalLink,
  Sparkles,
  FileSpreadsheet,
  Edit2,
  KeyRound
} from 'lucide-react';

interface MasterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddPlant: () => void;
  initialTab?: 'plants' | 'categories' | 'indications' | 'monographs' | 'users' | 'backup';
}

export const MasterDataModal: React.FC<MasterDataModalProps> = ({
  isOpen,
  onClose,
  onOpenAddPlant,
  initialTab = 'plants',
}) => {
  const { 
    plants, 
    userProfile, 
    batchDelete, 
    batchUpdateStatus, 
    importFromJson, 
    resetToDefaultData, 
    exportToCsv,
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
    deleteAccount
  } = usePlantContext();

  const [activeTab, setActiveTab] = useState<'plants' | 'categories' | 'indications' | 'monographs' | 'users' | 'backup'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  
  // Table search & selection in Master Data
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New item inputs
  const [newPartInput, setNewPartInput] = useState('');
  const [newIndicationInput, setNewIndicationInput] = useState('');
  const [newMonographInput, setNewMonographInput] = useState('');

  // Account editing & inputs
  const [editingUsername, setEditingUsername] = useState<string | null>(null);
  const [editAccPass, setEditAccPass] = useState('');
  const [editAccName, setEditAccName] = useState('');
  const [editAccDept, setEditAccDept] = useState('');
  const [editAccRole, setEditAccRole] = useState<UserRole>('ADMIN_DOSEN_1');

  // New account inputs
  const [newAccUser, setNewAccUser] = useState('');
  const [newAccPass, setNewAccPass] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccDept, setNewAccDept] = useState('');
  const [newAccRole, setNewAccRole] = useState<UserRole>('ADMIN_DOSEN_1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Hak Akses Khusus: Hanya SuperAdmin yang berwenang membuka Master Data
  if (userProfile.peran !== 'SUPERADMIN') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-stone-200 animate-in fade-in duration-150">
          <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center mx-auto">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">Akses Khusus SuperAdmin</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Menu <strong>Pengelolaan Master Data</strong> hanya dapat diakses secara eksklusif oleh akun <strong>SuperAdmin</strong> (<code className="font-mono text-purple-900 font-bold">superadm</code>). Dosen/Admin reguler hanya memiliki akses pengelolaan simplisia pada halaman direktori utama.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const filteredPlants = plants.filter(p => 
    p.namaLokal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.famili.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPlants.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkPublish = () => {
    if (selectedIds.length === 0) return;
    batchUpdateStatus(selectedIds, 'Published');
    showFeedback(`${selectedIds.length} simplisia berhasil diterbitkan.`);
    setSelectedIds([]);
  };

  const handleBulkDraft = () => {
    if (selectedIds.length === 0) return;
    batchUpdateStatus(selectedIds, 'Draft');
    showFeedback(`${selectedIds.length} simplisia dialihkan ke status Draft.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} simplisia yang dipilih?`)) {
      batchDelete(selectedIds);
      showFeedback(`${selectedIds.length} simplisia berhasil dihapus dari master data.`);
      setSelectedIds([]);
    }
  };

  // Backup & Restore
  const handleDownloadBackup = () => {
    const backupData = {
      version: '3.0',
      app: 'Ethno PhytoLab Digital Atlas',
      exportDate: new Date().toISOString(),
      curator: userProfile.nama,
      totalPlants: plants.length,
      plants,
      masterParts,
      masterIndications,
      masterMonographs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_EthnoPhytoLab_MasterData_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('Berkas cadangan JSON berhasil diunduh.');
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.plants)) {
            const ok = importFromJson(parsed.plants);
            if (ok) {
              showFeedback(`Berhasil memulihkan ${parsed.plants.length} tanaman dari berkas cadangan JSON!`);
            } else {
              showFeedback('Format data tanaman dalam berkas tidak valid.', 'error');
            }
          } else if (Array.isArray(parsed)) {
            const ok = importFromJson(parsed);
            if (ok) {
              showFeedback(`Berhasil mengimpor ${parsed.length} tanaman!`);
            }
          }
        } catch (err) {
          showFeedback('Gagal membaca berkas JSON. Pastikan berkas berformat JSON valid.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Add category handlers
  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPartInput.trim()) {
      addMasterPart(newPartInput.trim());
      setNewPartInput('');
      showFeedback('Kategori bagian tanaman berhasil ditambahkan.');
    }
  };

  const handleAddIndication = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIndicationInput.trim()) {
      addMasterIndication(newIndicationInput.trim());
      setNewIndicationInput('');
      showFeedback('Kategori indikasi klinis berhasil ditambahkan.');
    }
  };

  const handleAddMonograph = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMonographInput.trim()) {
      addMasterMonograph(newMonographInput.trim());
      setNewMonographInput('');
      showFeedback('Sumber monografi baku berhasil ditambahkan.');
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccUser.trim() || !newAccPass.trim() || !newAccName.trim()) {
      showFeedback('Username, kata sandi, dan nama lengkap wajib diisi.', 'error');
      return;
    }
    const newAcc: AuthAccount = {
      username: newAccUser.trim().toLowerCase(),
      password: newAccPass.trim(),
      roleId: newAccRole,
      nama: newAccName.trim(),
      departemen: newAccDept.trim() || 'Fakultas Kedokteran',
    };
    addAccount(newAcc);
    setNewAccUser('');
    setNewAccPass('');
    setNewAccName('');
    setNewAccDept('');
    showFeedback(`Akun pengguna ${newAcc.username} (${newAcc.nama}) berhasil ditambahkan.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900 text-purple-200 flex items-center justify-center shadow-inner">
              <Database className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  Pengelolaan Master Data
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold border border-purple-200">
                  Konsol SuperAdmin & Dosen
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pusat kendali master data simplisia, taksonomi, indikasi klinis FOHAI, akun pengguna, dan cadangan sistem
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

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('plants')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'plants'
                ? 'border-purple-800 text-purple-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Master Simplisia ({plants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-purple-800 text-purple-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Bagian Tanaman ({masterParts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('indications')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'indications'
                ? 'border-purple-800 text-purple-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Indikasi FOHAI ({masterIndications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('monographs')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'monographs'
                ? 'border-purple-800 text-purple-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sumber Monografi ({masterMonographs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-purple-800 text-purple-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Akun Pengguna ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-purple-800 text-purple-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cadangan & Pemulihan</span>
          </button>
        </div>

        {/* Notification feedback */}
        {feedbackMsg && (
          <div 
            className={`mx-6 mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-150 ${
              feedbackMsg.type === 'error'
                ? 'bg-red-50 text-red-900 border border-red-200'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            {feedbackMsg.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-stone-800">
          
          {/* TAB 1: MASTER SIMPLISIA (MASS MANAGEMENT) */}
          {activeTab === 'plants' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter nama lokal, latin, famili..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedIds.length > 0 && (
                    <>
                      <span className="text-[11px] text-stone-600 font-mono">
                        {selectedIds.length} terpilih:
                      </span>
                      <button
                        onClick={handleBulkPublish}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-semibold"
                      >
                        Set Terbit
                      </button>
                      <button
                        onClick={handleBulkDraft}
                        className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-[11px] font-semibold"
                      >
                        Set Draft
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded text-[11px] font-semibold"
                      >
                        Hapus Terpilih
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAddPlant();
                    }}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris Baru</span>
                  </button>
                </div>
              </div>

              {/* Plants Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[460px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-100 text-stone-700 font-mono text-[11px] sticky top-0 z-10 border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredPlants.length > 0 && selectedIds.length === filteredPlants.length}
                            onChange={handleSelectAll}
                            className="rounded border-stone-300 text-purple-800 focus:ring-purple-700"
                          />
                        </th>
                        <th className="py-2.5 px-3 w-14">ID / No</th>
                        <th className="py-2.5 px-3">Nama Lokal</th>
                        <th className="py-2.5 px-3">Nama Latin & Famili</th>
                        <th className="py-2.5 px-3">Bagian</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Metabolit & CID</th>
                        <th className="py-2.5 px-3 text-right">Terakhir Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-sans">
                      {filteredPlants.map((plant) => (
                        <tr 
                          key={plant.id}
                          className={`hover:bg-purple-50/40 transition-colors ${selectedIds.includes(plant.id) ? 'bg-purple-50/70' : ''}`}
                        >
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(plant.id)}
                              onChange={() => handleToggleSelect(plant.id)}
                              className="rounded border-stone-300 text-purple-800 focus:ring-purple-700"
                            />
                          </td>
                          <td className="py-2 px-3 font-mono text-stone-500 font-medium">
                            {plant.id}
                          </td>
                          <td className="py-2 px-3 font-bold text-stone-900">
                            {plant.namaLokal}
                          </td>
                          <td className="py-2 px-3">
                            <span className="italic font-serif text-stone-800 block">
                              {plant.namaLatin}
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {plant.famili}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-stone-700">
                            {plant.bagianDigunakan}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              plant.statusKurasi === 'Published'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {plant.statusKurasi}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {plant.senyawaAktif[0] ? (
                              <span className="font-mono text-[11px] text-stone-700 truncate max-w-[140px] block">
                                {plant.senyawaAktif[0].nama} {plant.senyawaAktif[0].cid > 0 && `(${plant.senyawaAktif[0].cid})`}
                              </span>
                            ) : (
                              <span className="text-stone-400 italic text-[10px]">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-[11px] text-stone-500">
                            {plant.terakhirDiperbarui}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER BAGIAN TANAMAN */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Master Kategori Bagian Tanaman (Plant Parts)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Daftar baku bagian tanaman yang digunakan dalam pembuatan simplisia obat sesuai standar Farmakope Herbal Indonesia.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddPart} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  required
                  value={newPartInput}
                  onChange={(e) => setNewPartInput(e.target.value)}
                  placeholder="Tambah bagian baru (mis. Umbi, Getah)..."
                  className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </form>

              {/* Chips grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
                {masterParts.map((part) => (
                  <div
                    key={part}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-2 hover:border-stone-300"
                  >
                    <span className="font-semibold text-stone-800">{part}</span>
                    <button
                      type="button"
                      onClick={() => deleteMasterPart(part)}
                      className="text-stone-400 hover:text-red-700 p-1"
                      title="Hapus kategori"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MASTER INDIKASI FOHAI */}
          {activeTab === 'indications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Master Kategori Indikasi Klinis (FOHAI / FROTI)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Daftar taksonomi efek terapeutik dan farmakoterapi yang diselaraskan dengan Formularium Obat Herbal Asli Indonesia.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddIndication} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  required
                  value={newIndicationInput}
                  onChange={(e) => setNewIndicationInput(e.target.value)}
                  placeholder="Tambah indikasi klinis baru (mis. Vasodilator)..."
                  className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </form>

              {/* Chips grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
                {masterIndications.map((ind) => (
                  <div
                    key={ind}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-2 hover:border-stone-300"
                  >
                    <span className="font-semibold text-stone-800">{ind}</span>
                    <button
                      type="button"
                      onClick={() => deleteMasterIndication(ind)}
                      className="text-stone-400 hover:text-red-700 p-1"
                      title="Hapus indikasi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MASTER SUMBER MONOGRAFI */}
          {activeTab === 'monographs' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Master Sumber Monografi Resmi
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Daftar baku buku kompendium dan monografi rujukan resmi Kementerian Kesehatan RI.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddMonograph} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  required
                  value={newMonographInput}
                  onChange={(e) => setNewMonographInput(e.target.value)}
                  placeholder="Tambah sumber monografi..."
                  className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </form>

              <div className="space-y-2 pt-2 max-w-xl">
                {masterMonographs.map((mono) => (
                  <div
                    key={mono}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{mono}</span>
                      <span className="text-[10px] text-stone-500 font-mono">Baku Mutu Simplisia & Ekstrak</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMasterMonograph(mono)}
                      className="text-stone-400 hover:text-red-700 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MASTER PENGGUNA & KREDENSIAL */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Pengelolaan Akun Pengguna & Hak Akses
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Kelola akun dosen, kurator laboratorium, dan super administrator sistem Ethno PhytoLab.
                </p>
              </div>

              {/* Accounts list */}
              <div className="space-y-2.5">
                {accounts.map((acc) => (
                  <div
                    key={acc.username}
                    className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          acc.roleId === 'SUPERADMIN' 
                            ? 'bg-purple-900 text-purple-200' 
                            : 'bg-emerald-900 text-emerald-200'
                        }`}>
                          {acc.roleId === 'SUPERADMIN' ? <Crown className="w-4 h-4" /> : 'DS'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{acc.nama}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-800 font-semibold">
                              @{acc.username}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              acc.roleId === 'SUPERADMIN' 
                                ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}>
                              {acc.roleId}
                            </span>
                          </div>
                          <span className="text-stone-500 text-[11px]">{acc.departemen}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <span className="text-[11px] font-mono text-stone-500 bg-white px-2 py-1 rounded border border-stone-200">
                          pass: <strong className="text-stone-800">{acc.password}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (editingUsername === acc.username) {
                              setEditingUsername(null);
                            } else {
                              setEditingUsername(acc.username);
                              setEditAccName(acc.nama);
                              setEditAccPass(acc.password);
                              setEditAccDept(acc.departemen);
                              setEditAccRole(acc.roleId);
                            }
                          }}
                          className="px-2 py-1 text-[11px] bg-white hover:bg-stone-100 text-stone-700 font-medium rounded border border-stone-200 flex items-center gap-1"
                          title="Ubah data atau kata sandi"
                        >
                          <Edit2 className="w-3 h-3 text-stone-500" />
                          <span>{editingUsername === acc.username ? 'Batal' : 'Edit'}</span>
                        </button>

                        {acc.username !== 'superadm' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus akun @${acc.username}?`)) {
                                deleteAccount(acc.username);
                                showFeedback(`Akun @${acc.username} dihapus.`);
                              }
                            }}
                            className="text-stone-400 hover:text-red-700 p-1 rounded"
                            title="Hapus akun"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Edit Form for this Account */}
                    {editingUsername === acc.username && (
                      <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 bg-white p-3 rounded-lg border border-purple-200">
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">Nama Lengkap</label>
                          <input
                            type="text"
                            value={editAccName}
                            onChange={(e) => setEditAccName(e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">Kata Sandi Baru</label>
                          <input
                            type="text"
                            value={editAccPass}
                            onChange={(e) => setEditAccPass(e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-200 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">Departemen</label>
                          <input
                            type="text"
                            value={editAccDept}
                            onChange={(e) => setEditAccDept(e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-200 rounded"
                          />
                        </div>
                        <div className="flex items-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              updateAccount(acc.username, {
                                nama: editAccName.trim() || acc.nama,
                                password: editAccPass.trim() || acc.password,
                                departemen: editAccDept.trim() || acc.departemen,
                                roleId: editAccRole,
                              });
                              setEditingUsername(null);
                              showFeedback(`Perubahan akun @${acc.username} berhasil disimpan.`);
                            }}
                            className="flex-1 py-1 px-3 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded text-xs"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUsername(null)}
                            className="py-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Form to add new account */}
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-3">
                <span className="font-bold text-purple-950 block">
                  Daftarkan Dosen / Kurator Baru:
                </span>
                <form onSubmit={handleAddAccount} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAccUser}
                      onChange={(e) => setNewAccUser(e.target.value)}
                      placeholder="e.g. dosen3"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Kata Sandi *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAccPass}
                      onChange={(e) => setNewAccPass(e.target.value)}
                      placeholder="e.g. Pass123!"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Peran Hak Akses *
                    </label>
                    <select
                      value={newAccRole}
                      onChange={(e) => setNewAccRole(e.target.value as UserRole)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                    >
                      <option value="ADMIN_DOSEN_1">Dosen / Admin Farmakologi</option>
                      <option value="ADMIN_DOSEN_2">Dosen / Admin Biologi Farmasi</option>
                      <option value="SUPERADMIN">SuperAdmin Sistem</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAccName}
                      onChange={(e) => setNewAccName(e.target.value)}
                      placeholder="e.g. Dr. Apt. Budi Santoso, M.Farm."
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Departemen / Lab
                    </label>
                    <input
                      type="text"
                      value={newAccDept}
                      onChange={(e) => setNewAccDept(e.target.value)}
                      placeholder="e.g. Lab Farmakognosi"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-lg text-xs"
                    >
                      Simpan Akun Baru
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: CADANGAN & PEMULIHAN DATABASE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Cadangan & Pemulihan Master Data (Backup & Restore)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Amankan seluruh data 119 simplisia, foto makroskopis, dan riwayat kurasi PubChem dalam berkas arsip JSON mandiri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Download Backup */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Download className="w-4 h-4 text-purple-800" />
                      <span>Unduh Cadangan JSON</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Menghasilkan berkas cadangan JSON lengkap mencakup data {plants.length} tanaman, seluruh metabolit, dan kategori.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Cadangan (.json)</span>
                  </button>
                </div>

                {/* 2. Upload Restore */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Upload className="w-4 h-4 text-emerald-800" />
                      <span>Pulihkan dari JSON</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Unggah berkas cadangan JSON untuk memulihkan atau menimpa database koleksi laboratorium Anda.
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".json"
                      onChange={handleUploadBackup}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Berkas JSON</span>
                    </button>
                  </div>
                </div>

                {/* 3. Reset Default */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <RefreshCw className="w-4 h-4 text-red-700" />
                      <span>Reset ke 119 Baku FHI</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Mengembalikan seluruh daftar 119 tanaman obat resmi ke standar awal Farmakope Herbal Indonesia Edisi II.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin mengatur ulang seluruh database ke 119 tanaman baku FHI?')) {
                        resetToDefaultData();
                        showFeedback('Database berhasil diatur ulang ke 119 tanaman baku FHI Edisi II.');
                      }
                    }}
                    className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Data Baku</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <div className="text-stone-500 font-mono text-[11px]">
            Konsol Master Data · Pengembang: dr.penggalih@unwahas.ac.id
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-lg transition-colors"
          >
            Tutup Konsol
          </button>
        </div>
      </div>
    </div>
  );
};
