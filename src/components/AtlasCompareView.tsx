import React from 'react';
import { Plant } from '../types/plant';
import { usePlantContext } from '../context/PlantContext';
import { getPubChemCompoundUrl, getSwissAdmeUrl } from '../services/pubchemService';
import { ExternalLink, Eye, SplitSquareVertical } from 'lucide-react';

interface AtlasCompareViewProps {
  plants: Plant[];
  onOpenDetail: (plant: Plant) => void;
  onOpenCompareModal: (plant: Plant) => void;
}

export const AtlasCompareView: React.FC<AtlasCompareViewProps> = ({
  plants,
  onOpenDetail,
  onOpenCompareModal,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {plants.map((plant) => {
        const primaryCompound = plant.senyawaAktif[0];

        return (
          <div
            key={plant.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            {/* Header info */}
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 flex items-baseline justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-800 font-bold">
                    {plant.id}
                  </span>
                  <h3 className="font-bold text-base text-stone-900 font-serif">
                    {plant.namaLokal}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 italic font-serif">
                  {plant.namaLatin} · {plant.famili}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-stone-800 block">
                  {plant.bagianDigunakan}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {plant.sumberMonografi}
                </span>
              </div>
            </div>

            {/* Split Visual View */}
            <div className="grid grid-cols-2 divide-x divide-stone-200 bg-stone-100 aspect-16/9 relative group">
              {/* Simplisia */}
              <div 
                className="relative overflow-hidden cursor-pointer"
                onClick={() => onOpenCompareModal(plant)}
              >
                <img
                  src={plant.fotoSimplisiaMakroskopis}
                  alt={`Simplisia ${plant.namaLokal}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  Simplisia Lab
                </div>
              </div>

              {/* Segar */}
              <div 
                className="relative overflow-hidden cursor-pointer"
                onClick={() => onOpenCompareModal(plant)}
              >
                <img
                  src={plant.fotoTanamanSegar}
                  alt={`Tanaman Segar ${plant.namaLokal}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  Tanaman Segar
                </div>
              </div>
            </div>

            {/* Macro description & actions */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {plant.ciriMakroskopis}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {primaryCompound?.cid && (
                    <a
                      href={getPubChemCompoundUrl(primaryCompound.cid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>PubChem: {primaryCompound.nama}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {primaryCompound?.smiles && (
                    <a
                      href={getSwissAdmeUrl(primaryCompound.smiles)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 hover:underline flex items-center gap-1 text-[11px] font-medium"
                    >
                      <span>SwissADME</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => onOpenDetail(plant)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium text-xs flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Detail</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
