import React, { useState } from 'react';
import { Plant, Metabolite } from '../types/plant';
import { usePlantContext } from '../context/PlantContext';
import { getPubChemCompoundUrl, getSwissAdmeUrl } from '../services/pubchemService';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Bookmark, 
  SplitSquareVertical, 
  FlaskConical, 
  BookOpen, 
  Sparkles, 
  Printer, 
  ShieldCheck,
  Calendar,
  User,
  RefreshCw
} from 'lucide-react';

interface PlantDetailModalProps {
  plant: Plant;
  onClose: () => void;
  onOpenCompare: (plant: Plant) => void;
  onEdit: (plant: Plant) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  onOpenCompare,
  onEdit,
}) => {
  const { userProfile, isLoggedIn, bookmarkedIds, toggleBookmark, triggerPubChemSync, isSyncingId } = usePlantContext();
  const [activeTab, setActiveTab] = useState<'monograph' | 'metabolites' | 'macroscopic'>('monograph');
  const [selectedPhoto, setSelectedPhoto] = useState<'simplisia' | 'fresh'>('simplisia');
  const [copiedSmilesIndex, setCopiedSmilesIndex] = useState<number | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const isBookmarked = bookmarkedIds.includes(plant.id);
  const isSyncing = isSyncingId === plant.id;

  const handleCopySmiles = (smiles: string, index: number) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmilesIndex(index);
    setTimeout(() => setCopiedSmilesIndex(null), 2500);
  };

  const handleSync = async () => {
    const res = await triggerPubChemSync(plant.id);
    setSyncStatusMsg(res.message);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-start justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                {plant.id} (No. {plant.no})
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-500 font-mono">
                {plant.sumberMonografi}
              </span>
              {plant.statusKurasi === 'Draft' && (
                <span className="text-xs font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Status: Draft
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif mt-1">
              {plant.namaLokal}
            </h2>
            <p className="text-sm text-stone-600 italic font-serif">
              {plant.namaLatin} · <span className="not-italic text-stone-500 font-sans text-xs">Famili {plant.famili}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(plant.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'bg-emerald-800 text-white border-emerald-900' 
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
              }`}
              title={isBookmarked ? 'Hapus bookmark' : 'Simpan ke Catatan Praktikum'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {isLoggedIn && (
              <button
                onClick={() => onEdit(plant)}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 transition-colors"
              >
                Edit Data
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <button
              onClick={() => setActiveTab('monograph')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'monograph'
                  ? 'border-emerald-800 text-emerald-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Monografi & Khasiat Klinis
            </button>
            <button
              onClick={() => setActiveTab('metabolites')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'metabolites'
                  ? 'border-emerald-800 text-emerald-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>Metabolit PubChem & SwissADME</span>
              <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-700 text-[10px] flex items-center justify-center font-mono">
                {plant.senyawaAktif?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('macroscopic')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'macroscopic'
                  ? 'border-emerald-800 text-emerald-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Atlas Visual Makroskopis
            </button>
          </div>

          <button
            onClick={() => onOpenCompare(plant)}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 py-1 px-2 rounded hover:bg-stone-100"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Mode Layar Penuh Komparasi</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {syncStatusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs">
              {syncStatusMsg}
            </div>
          )}

          {/* TAB 1: MONOGRAFI & KHASIAT */}
          {activeTab === 'monograph' && (
            <div className="space-y-6">
              {/* Media Preview Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                    <span>Foto Simplisia Makroskopis Kering</span>
                    <span className="text-[11px] text-stone-500 font-mono">Spesimen Lab</span>
                  </div>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative group">
                    <img
                      src={plant.fotoSimplisiaMakroskopis}
                      alt={`Simplisia ${plant.namaLokal}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                    <span>Foto Tanaman Segar (Habitus)</span>
                    <span className="text-[11px] text-stone-500 font-mono">In Situ</span>
                  </div>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative group">
                    <img
                      src={plant.fotoTanamanSegar}
                      alt={`Tanaman Segar ${plant.namaLokal}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Monograph Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 font-mono">
                    Bagian Tanaman Digunakan
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {plant.bagianDigunakan}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    Standar baku mutu Farmakope Herbal Indonesia
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 font-mono">
                    Sumber Monografi Resmi
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {plant.sumberMonografi}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    Kementerian Kesehatan Republik Indonesia
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 font-mono">
                    Kurasi & Terakhir Diperbarui
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {plant.terakhirDiperbarui}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 truncate">
                    {plant.dikurasiOleh}
                  </div>
                </div>
              </div>

              {/* Clinical Indications Section */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  <span>Indikasi Klinis & Farmakologi (FOHAI / FROTI)</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {plant.indikasiKlinis.map((ind, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-50 text-emerald-950 font-medium rounded-lg text-xs border border-emerald-200/80"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <strong className="font-semibold text-stone-900 block mb-1">
                    Keterangan Monografi Herbal Medik:
                  </strong>
                  {plant.indikasiFOHAI}
                </div>
              </div>

              {/* Macroscopic Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Karakteristik Makroskopis & Organoleptik Laboratorium
                </h3>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed font-sans">
                  {plant.ciriMakroskopis}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: METABOLIT PUBCHEM & SWISSADME */}
          {activeTab === 'metabolites' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Profil Metabolit Sekunder Terverifikasi PUG-REST
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Data struktur, bobot molekul, dan Canonical SMILES siap simulasi ADME komputasional
                  </p>
                </div>

                {isLoggedIn && (
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sinkronisasi Ulang PubChem</span>
                  </button>
                )}
              </div>

              {plant.senyawaAktif && plant.senyawaAktif.length > 0 ? (
                <div className="space-y-4">
                  {plant.senyawaAktif.map((compound, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 hover:border-stone-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-stone-900">
                              {compound.nama}
                            </span>
                            {compound.cid > 0 && (
                              <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                CID: {compound.cid}
                              </span>
                            )}
                          </div>
                          {compound.peran && (
                            <span className="text-xs text-stone-500 mt-0.5 block">
                              Peran: {compound.peran}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {compound.cid > 0 && (
                            <a
                              href={getPubChemCompoundUrl(compound.cid)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors"
                            >
                              <span>Buka di PubChem</span>
                              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                            </a>
                          )}

                          {compound.smiles && (
                            <a
                              href={getSwissAdmeUrl(compound.smiles)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-xs"
                            >
                              <span>Simulasi di SwissADME</span>
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Chemical Properties Metadata */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        <div className="p-2 bg-stone-50 rounded-lg">
                          <span className="text-stone-400 block text-[10px]">Rumus Molekul</span>
                          <span className="font-semibold text-stone-800">{compound.rumus || '-'}</span>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-lg">
                          <span className="text-stone-400 block text-[10px]">Bobot Molekul</span>
                          <span className="font-semibold text-stone-800">
                            {compound.beratMolekul ? `${compound.beratMolekul} g/mol` : '-'}
                          </span>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-lg">
                          <span className="text-stone-400 block text-[10px]">Database Rujukan</span>
                          <span className="font-semibold text-stone-800">NCBI PUG-REST</span>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-lg">
                          <span className="text-stone-400 block text-[10px]">Pemberi Nilai ADME</span>
                          <span className="font-semibold text-stone-800">SIB SwissADME</span>
                        </div>
                      </div>

                      {/* Canonical SMILES with 1-click copy */}
                      {compound.smiles && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                            <span>Canonical SMILES:</span>
                            <button
                              onClick={() => handleCopySmiles(compound.smiles, index)}
                              className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium"
                            >
                              {copiedSmilesIndex === index ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin SMILES</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-2.5 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all select-all border border-stone-800">
                            {compound.smiles}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-stone-50 rounded-xl border border-stone-200">
                  <FlaskConical className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700">Belum ada metabolit aktif terdaftar</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    {userProfile.peran === 'ADMIN'
                      ? 'Klik tombol "Sinkronisasi Ulang PubChem" untuk menarik data otomatis dari NCBI PUG-REST API.'
                      : 'Data metabolit sedang dalam proses kurasi oleh tim dosen farmakologi.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATLAS VISUAL MAKROSKOPIS */}
          {activeTab === 'macroscopic' && (
            <div className="space-y-6">
              <div className="flex items-center justify-center p-1 bg-stone-100 rounded-lg max-w-xs mx-auto text-xs font-medium">
                <button
                  onClick={() => setSelectedPhoto('simplisia')}
                  className={`flex-1 py-1.5 px-3 rounded-md transition-colors ${
                    selectedPhoto === 'simplisia' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Simplisia Makroskopis
                </button>
                <button
                  onClick={() => setSelectedPhoto('fresh')}
                  className={`flex-1 py-1.5 px-3 rounded-md transition-colors ${
                    selectedPhoto === 'fresh' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Tanaman Segar
                </button>
              </div>

              {/* Large Image Showcase */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 relative aspect-16/10 max-h-[460px] flex items-center justify-center">
                <img
                  src={selectedPhoto === 'simplisia' ? plant.fotoSimplisiaMakroskopis : plant.fotoTanamanSegar}
                  alt={`${plant.namaLokal} - ${selectedPhoto}`}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                  {selectedPhoto === 'simplisia' ? '🔬 Potongan Simplisia Makroskopis Kering' : '🌱 Habitus & Daun Tanaman Segar'}
                </div>
              </div>

              {/* Lab Diagnostic Guide */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  <span>Panduan Identifikasi OSCE / Ujian Praktikum Farmakognosi</span>
                </div>
                <p className="leading-relaxed">
                  {plant.ciriMakroskopis}
                </p>
                <div className="text-[11px] text-amber-800 font-mono pt-1">
                  Catatan: Perhatikan tekstur fraktur potongan, aroma esensial ketika dihangatkan di telapak tangan, dan rasa karakteristik saat uji organoleptik.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <div className="text-stone-500 font-mono text-[11px]">
            Direktori Herbal Kedokteran · Terhubung NCBI PUG-REST & SwissADME
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
