import React from 'react';
import { Plant } from '../types/plant';
import { usePlantContext } from '../context/PlantContext';
import { getPubChemCompoundUrl, getSwissAdmeUrl } from '../services/pubchemService';
import { ExternalLink, Eye, Bookmark, Edit3, Trash2 } from 'lucide-react';

interface TableViewProps {
  plants: Plant[];
  onOpenDetail: (plant: Plant) => void;
  onEdit: (plant: Plant) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  plants,
  onOpenDetail,
  onEdit,
}) => {
  const { userProfile, isLoggedIn, bookmarkedIds, toggleBookmark, deletePlant } = usePlantContext();

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/90 text-stone-700 font-semibold border-b border-stone-200 font-mono text-[11px]">
              <th className="py-3 px-3 w-12 text-center">No.</th>
              <th className="py-3 px-3">Nama Lokal / Simplisia</th>
              <th className="py-3 px-3">Nama Latin (Spesies) & Famili</th>
              <th className="py-3 px-3">Bagian Digunakan</th>
              <th className="py-3 px-3">Monografi</th>
              <th className="py-3 px-3">Indikasi Klinis</th>
              <th className="py-3 px-3">Metabolit & CID</th>
              <th className="py-3 px-3 text-center">PubChem / SwissADME</th>
              <th className="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-sans">
            {plants.map((plant) => {
              const primaryCompound = plant.senyawaAktif[0];
              const isBookmarked = bookmarkedIds.includes(plant.id);

              return (
                <tr key={plant.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-mono text-stone-500 font-medium">
                    {plant.no}
                  </td>

                  <td className="py-3 px-3 font-semibold text-stone-900">
                    <div className="flex items-center gap-1.5">
                      <span>{plant.namaLokal}</span>
                      {plant.statusKurasi === 'Draft' && (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="italic font-serif text-stone-800 block">
                      {plant.namaLatin}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {plant.famili}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-stone-700 font-medium">
                    {plant.bagianDigunakan}
                  </td>

                  <td className="py-3 px-3 text-stone-600 font-mono text-[11px]">
                    {plant.sumberMonografi}
                  </td>

                  <td className="py-3 px-3 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {plant.indikasiKlinis.slice(0, 2).map((ind, i) => (
                        <span key={i} className="text-[10px] text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                          {ind}
                        </span>
                      ))}
                      {plant.indikasiKlinis.length > 2 && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          +{plant.indikasiKlinis.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 max-w-[160px]">
                    {primaryCompound ? (
                      <div>
                        <div className="font-semibold text-stone-800 truncate">
                          {primaryCompound.nama}
                        </div>
                        {primaryCompound.cid > 0 && (
                          <span className="text-[10px] font-mono text-emerald-800">
                            CID: {primaryCompound.cid}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 italic text-[11px]">-</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {primaryCompound?.cid ? (
                        <a
                          href={getPubChemCompoundUrl(primaryCompound.cid)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                          title="PubChem"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : null}

                      {primaryCompound?.smiles ? (
                        <a
                          href={getSwissAdmeUrl(primaryCompound.smiles)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[10px] font-semibold border border-emerald-200"
                          title="Simulasi SwissADME"
                        >
                          ADME
                        </a>
                      ) : null}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => toggleBookmark(plant.id)}
                        className={`p-1.5 rounded transition-colors ${
                          isBookmarked ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title="Tandai di catatan lab"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => onOpenDetail(plant)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                        title="Buka detail monograf"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isLoggedIn && (
                        <>
                          <button
                            onClick={() => onEdit(plant)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus ${plant.namaLokal}?`)) {
                                deletePlant(plant.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-stone-100"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
