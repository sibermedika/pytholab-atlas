import React, { useState } from 'react';
import { Plant, Metabolite } from '../types/plant';
import { usePlantContext } from '../context/PlantContext';
import { getPubChemCompoundUrl, getSwissAdmeUrl } from '../services/pubchemService';
import { 
  ExternalLink, 
  FlaskConical, 
  Bookmark, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  SplitSquareVertical, 
  Layers,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onOpenDetail: (plant: Plant) => void;
  onEdit: (plant: Plant) => void;
  onOpenCompare: (plant: Plant) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onOpenDetail,
  onEdit,
  onOpenCompare,
}) => {
  const { 
    userProfile, 
    isLoggedIn,
    deletePlant, 
    triggerPubChemSync, 
    isSyncingId, 
    bookmarkedIds, 
    toggleBookmark 
  } = usePlantContext();

  // Media preview toggle: 'fresh' (Tanaman Segar) vs 'simplisia' (Simplisia Makroskopis Kering)
  const [activeMediaTab, setActiveMediaTab] = useState<'fresh' | 'simplisia'>('simplisia');
  const [imageError, setImageError] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const isBookmarked = bookmarkedIds.includes(plant.id);
  const isSyncing = isSyncingId === plant.id;

  // Primary compound for quick direct links
  const primaryCompound: Metabolite | undefined = plant.senyawaAktif[0];
  const activeImage = activeMediaTab === 'fresh' ? plant.fotoTanamanSegar : plant.fotoSimplisiaMakroskopis;

  const handleSyncPubChem = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await triggerPubChemSync(plant.id);
    setSyncFeedback(res.message);
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Yakin ingin menghapus tanaman ${plant.namaLokal} (${plant.namaLatin}) dari atlas?`)) {
      deletePlant(plant.id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Visual Header / Media Preview Area */}
      <div className="relative aspect-16/10 bg-stone-100 overflow-hidden border-b border-stone-200/60">
        <img
          src={activeImage}
          alt={`${plant.namaLokal} - ${activeMediaTab === 'fresh' ? 'Tanaman Segar' : 'Simplisia Makroskopis'}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Media Mode Switcher (Clean Segmented Tab) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center bg-stone-900/80 backdrop-blur-xs p-0.5 rounded-lg text-[11px] font-medium text-stone-200 shadow-sm border border-stone-700/50">
          <button
            onClick={() => setActiveMediaTab('simplisia')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeMediaTab === 'simplisia'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'hover:text-white text-stone-300'
            }`}
          >
            Simplisia Makro
          </button>
          <button
            onClick={() => setActiveMediaTab('fresh')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeMediaTab === 'fresh'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'hover:text-white text-stone-300'
            }`}
          >
            Tanaman Segar
          </button>
        </div>

        {/* Top-Right Badges & Controls */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {/* Compare Button */}
          <button
            onClick={() => onOpenCompare(plant)}
            className="p-1.5 bg-stone-900/75 hover:bg-stone-900 backdrop-blur-xs text-stone-200 hover:text-white rounded-md transition-colors border border-stone-700/50"
            title="Komparasi Makroskopis (Side-by-side)"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </button>

          {/* Student Bookmark Button */}
          <button
            onClick={() => toggleBookmark(plant.id)}
            className={`p-1.5 backdrop-blur-xs rounded-md transition-colors border ${
              isBookmarked
                ? 'bg-emerald-800 text-white border-emerald-900'
                : 'bg-stone-900/75 hover:bg-stone-900 text-stone-200 hover:text-white border-stone-700/50'
            }`}
            title={isBookmarked ? 'Hapus dari catatan lab' : 'Simpan ke catatan praktikum'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner on Image: Monograph Tag & Part */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent p-2.5 pt-6 flex items-end justify-between text-white text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-emerald-300 font-semibold">{plant.id}</span>
            <span className="text-stone-400">·</span>
            <span className="font-medium text-stone-200">{plant.bagianDigunakan}</span>
          </div>
          <span className="text-stone-300 text-[10px] font-mono">{plant.sumberMonografi}</span>
        </div>
      </div>

      {/* Main Body - Clean Directory View */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Botanical Nomenclature */}
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-stone-900 tracking-tight font-serif">
                {plant.namaLokal}
              </h2>
              {plant.statusKurasi === 'Draft' && (
                <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Draft
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 italic font-serif">
              {plant.namaLatin}
            </p>
            <div className="text-[11px] text-stone-500 font-mono mt-0.5">
              Famili: <span className="text-stone-700 font-medium">{plant.famili}</span>
            </div>
          </div>

          {/* Indikasi & Khasiat Utama (Clean Typographic Presentation) */}
          <div className="mt-3 pt-3 border-t border-stone-100">
            <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Indikasi Klinis Utama (FOHAI/FROTI)
            </div>
            <div className="flex flex-wrap gap-1">
              {plant.indikasiKlinis.map((ind, idx) => (
                <span
                  key={idx}
                  className="text-[11px] text-stone-700 bg-stone-100/90 px-2 py-0.5 rounded-md font-medium"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Senyawa Aktif Utama (Clean Marker Metabolites List) */}
          <div className="mt-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              <span>Metabolit Sekunder / Senyawa Aktif</span>
              {plant.pubchemCid && (
                <span className="font-mono text-emerald-800 lowercase">
                  CID: {plant.pubchemCid}
                </span>
              )}
            </div>

            {plant.senyawaAktif && plant.senyawaAktif.length > 0 ? (
              <div className="space-y-1">
                {plant.senyawaAktif.slice(0, 3).map((met, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-stone-50 hover:bg-stone-100 transition-colors border border-stone-100"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-stone-800">{met.nama}</span>
                      {met.peran && (
                        <span className="text-[10px] text-stone-500 block truncate">
                          {met.peran}
                        </span>
                      )}
                    </div>
                    {met.cid > 0 && (
                      <span className="text-[10px] font-mono text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                        {met.cid}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                Belum ada data metabolit spesifik
              </p>
            )}
          </div>
        </div>

        {/* Sync feedback notification */}
        {syncFeedback && (
          <div className="text-[11px] p-2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 animate-in fade-in duration-200">
            {syncFeedback}
          </div>
        )}

        {/* Direct Navigation Links (PubChem & SwissADME) */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Direct PubChem Link */}
            {primaryCompound?.cid ? (
              <a
                href={getPubChemCompoundUrl(primaryCompound.cid)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-blue-800 border border-blue-200/80 font-medium transition-colors text-center text-[11px]"
                title={`Buka entri PubChem resmi untuk ${primaryCompound.nama}`}
              >
                <span>PubChem</span>
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
            ) : (
              <button
                disabled
                className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-400 text-[11px] font-medium cursor-not-allowed text-center"
              >
                PubChem N/A
              </button>
            )}

            {/* Direct SwissADME Simulation Link */}
            {primaryCompound?.smiles ? (
              <a
                href={getSwissAdmeUrl(primaryCompound.smiles)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-medium transition-colors text-center text-[11px]"
                title={`Kirim SMILES ${primaryCompound.nama} ke SwissADME untuk simulasi bioavailabilitas & farmakokinetik`}
              >
                <span>SwissADME</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>
            ) : (
              <button
                disabled
                className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-400 text-[11px] font-medium cursor-not-allowed text-center"
              >
                SwissADME N/A
              </button>
            )}
          </div>

          {/* Primary View Action & Admin Controls */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => onOpenDetail(plant)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span>Detail Monograf & Lab</span>
            </button>

            {/* Admin & SuperAdmin quick actions */}
            {isLoggedIn && (
              <>
                <button
                  onClick={handleSyncPubChem}
                  disabled={isSyncing}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSyncing
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 border-stone-200'
                  }`}
                  title="Tarik data metabolit otomatis dari PubChem PUG-REST"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-700' : ''}`} />
                </button>
                <button
                  onClick={() => onEdit(plant)}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 rounded-lg border border-stone-200 transition-colors"
                  title="Edit data tanaman"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-700 rounded-lg border border-stone-200 transition-colors"
                  title="Hapus baris tanaman"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
