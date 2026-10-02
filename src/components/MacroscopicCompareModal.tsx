import React, { useState } from 'react';
import { Plant } from '../types/plant';
import { X, SplitSquareVertical, ZoomIn, Info, CheckCircle2 } from 'lucide-react';

interface MacroscopicCompareModalProps {
  plant: Plant;
  onClose: () => void;
}

export const MacroscopicCompareModal: React.FC<MacroscopicCompareModalProps> = ({
  plant,
  onClose,
}) => {
  const [zoomFresh, setZoomFresh] = useState(false);
  const [zoomSimplisia, setZoomSimplisia] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-stone-900 text-stone-100 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {plant.id}
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs font-serif italic text-stone-400">
                {plant.namaLatin}
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white mt-1">
              Atlas Komparasi Visual: {plant.namaLokal}
            </h2>
            <p className="text-xs text-stone-400">
              Perbandingan Habitus Tanaman Segar vs Simplisia Makroskopis Kering (Praktikum Farmakognosi FK)
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Side-by-Side Canvas */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Simplisia Kering */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  1. Simplisia Makroskopis (Bahan Obat)
                </span>
                <button
                  onClick={() => setZoomSimplisia(!zoomSimplisia)}
                  className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{zoomSimplisia ? 'Reset Zoom' : 'Perbesar'}</span>
                </button>
              </div>

              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center">
                <img
                  src={plant.fotoSimplisiaMakroskopis}
                  alt={`Simplisia ${plant.namaLokal}`}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    zoomSimplisia ? 'scale-150 cursor-move' : 'cursor-pointer'
                  }`}
                  onClick={() => setZoomSimplisia(!zoomSimplisia)}
                />
                <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded">
                  Bagian: {plant.bagianDigunakan}
                </div>
              </div>

              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700 text-xs text-stone-300 space-y-1">
                <strong className="text-white block font-semibold">Karakteristik Organoleptik:</strong>
                <p className="leading-relaxed">{plant.ciriMakroskopis}</p>
              </div>
            </div>

            {/* 2. Tanaman Segar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  2. Habitus Tanaman Segar (In Situ)
                </span>
                <button
                  onClick={() => setZoomFresh(!zoomFresh)}
                  className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{zoomFresh ? 'Reset Zoom' : 'Perbesar'}</span>
                </button>
              </div>

              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center">
                <img
                  src={plant.fotoTanamanSegar}
                  alt={`Tanaman Segar ${plant.namaLokal}`}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    zoomFresh ? 'scale-150 cursor-move' : 'cursor-pointer'
                  }`}
                  onClick={() => setZoomFresh(!zoomFresh)}
                />
                <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded">
                  Famili: {plant.famili}
                </div>
              </div>

              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700 text-xs text-stone-300 space-y-1">
                <strong className="text-white block font-semibold">Tatanan Taksonomi & Monografi:</strong>
                <p className="leading-relaxed">
                  {plant.namaLatin} terdaftar resmi dalam {plant.sumberMonografi}. Diidentifikasi berdasarkan morfologi organ vegetatif dan generatif.
                </p>
              </div>
            </div>
          </div>

          {/* Quick OSCE diagnostic tips */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block mb-1">
                Kunci Diferensiasi Praktikum Kedokteran:
              </strong>
              <span>
                Pada pemeriksaan makroskopis simplisia kering, amati perbedaan warna setelah dehidrasi, kelengkungan rajangan, aroma minyak atsiri saat digerus halus, serta kelarutan pigmen aktif dalam pelarut air atau etanol.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup Tampilan Komparasi
          </button>
        </div>
      </div>
    </div>
  );
};
