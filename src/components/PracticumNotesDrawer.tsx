import React, { useState } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { Plant } from '../types/plant';
import { getPubChemCompoundUrl, getSwissAdmeUrl } from '../services/pubchemService';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Printer, 
  ExternalLink, 
  FlaskConical, 
  FileText,
  CheckCircle2
} from 'lucide-react';

interface PracticumNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlant: (plant: Plant) => void;
}

export const PracticumNotesDrawer: React.FC<PracticumNotesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPlant,
}) => {
  const { plants, bookmarkedIds, toggleBookmark, userProfile } = usePlantContext();
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const bookmarkedPlants = plants.filter(p => bookmarkedIds.includes(p.id));

  const handleNoteChange = (id: string, text: string) => {
    setStudentNotes(prev => ({ ...prev, [id]: text }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Buku Catatan Praktikum Mahasiswa
              </h2>
              <p className="text-xs text-stone-500">
                {bookmarkedPlants.length} simplisia dipilih untuk meja praktikum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedPlants.length > 0 && (
              <button
                onClick={handlePrint}
                className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
                title="Cetak lembar kerja praktikum"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Bookmarked Items */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {bookmarkedPlants.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FlaskConical className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-stone-700 font-serif">
                Belum ada tanaman yang ditandai
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Gunakan ikon bookmark pada setiap kartu tanaman untuk mengumpulkan simplisia yang akan Anda pelajari saat praktikum laboratorium.
              </p>
            </div>
          ) : (
            bookmarkedPlants.map((plant) => (
              <div
                key={plant.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div 
                    className="cursor-pointer"
                    onClick={() => { onSelectPlant(plant); onClose(); }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {plant.id}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm hover:underline">
                        {plant.namaLokal}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 italic mt-0.5">
                      {plant.namaLatin} · {plant.bagianDigunakan}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleBookmark(plant.id)}
                    className="text-stone-400 hover:text-red-700 p-1"
                    title="Hapus dari catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick actions for SwissADME and PubChem */}
                <div className="flex items-center gap-2 text-xs">
                  {plant.senyawaAktif[0]?.cid && (
                    <a
                      href={getPubChemCompoundUrl(plant.senyawaAktif[0].cid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <span>PubChem ({plant.senyawaAktif[0].nama})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {plant.senyawaAktif[0]?.smiles && (
                    <a
                      href={getSwissAdmeUrl(plant.senyawaAktif[0].smiles)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>SwissADME</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Personal Observation Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Hasil Pengamatan Organoleptik / Makroskopis Mahasiswa:
                  </label>
                  <textarea
                    rows={2}
                    value={studentNotes[plant.id] || ''}
                    onChange={(e) => handleNoteChange(plant.id, e.target.value)}
                    placeholder="Catat bau, rasa, warna fraktur, dan kelarutan yang Anda amati di lab..."
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono text-[11px]">
            Praktikan: {userProfile.nama}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-900 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
