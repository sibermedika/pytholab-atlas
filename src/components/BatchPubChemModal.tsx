import React, { useState } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { 
  fetchPubChemByCID, 
  fetchPubChemByName, 
  getPubChemCompoundUrl, 
  getSwissAdmeUrl, 
  PubChemPropertyResult 
} from '../services/pubchemService';
import { 
  X, 
  Sparkles, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  RefreshCw 
} from 'lucide-react';

interface BatchPubChemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchPubChemModal: React.FC<BatchPubChemModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { plants, triggerPubChemSync, isSyncingId } = usePlantContext();

  const [queryType, setQueryType] = useState<'name' | 'cid'>('name');
  const [queryInput, setQueryInput] = useState('Curcumin');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<PubChemPropertyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Batch sync tracker
  const [batchStatus, setBatchStatus] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  if (!isOpen) return null;

  const handleTestQuery = async () => {
    if (!queryInput.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setTestResult(null);

    try {
      let res: PubChemPropertyResult | null = null;
      if (queryType === 'cid') {
        const cidNum = parseInt(queryInput.trim(), 10);
        if (isNaN(cidNum)) throw new Error('CID harus berupa angka');
        res = await fetchPubChemByCID(cidNum);
      } else {
        res = await fetchPubChemByName(queryInput.trim());
      }

      if (res) {
        setTestResult(res);
      } else {
        setErrorMsg(`Tidak ditemukan data di PubChem PUG-REST untuk "${queryInput}".`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menghubungi PubChem API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunBatchSync = async () => {
    setIsBatchRunning(true);
    setBatchStatus('Memulai sinkronisasi metabolit dari PubChem...');

    const targets = plants.slice(0, 15); // Sync first 15 for responsiveness
    let successCount = 0;

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      setBatchStatus(`Menyelaraskan [${i + 1}/${targets.length}]: ${p.namaLokal} (${p.namaLatin})...`);
      const res = await triggerPubChemSync(p.id);
      if (res.success) successCount++;
    }

    setBatchStatus(`Selesai! Berhasil menyelaraskan ${successCount} tanaman dari ${targets.length} target.`);
    setIsBatchRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Pusat Integrasi PubChem PUG-REST & SwissADME
              </h2>
              <p className="text-xs text-stone-500">
                Uji langsung koneksi API PUG-REST dan verifikasi parameter Canonical SMILES
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Query Testing Tool */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="font-semibold text-stone-800 flex items-center justify-between">
              <span>Uji Kueri Langsung ke NCBI PubChem PUG-REST</span>
              <span className="font-mono text-[10px] text-stone-500">Live Endpoint</span>
            </div>

            <div className="flex gap-2">
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as 'name' | 'cid')}
                className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800"
              >
                <option value="name">Berdasarkan Nama</option>
                <option value="cid">Berdasarkan CID</option>
              </select>

              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={queryType === 'name' ? 'e.g. Andrographolide, Allicin' : 'e.g. 969516'}
                className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
              />

              <button
                onClick={handleTestQuery}
                disabled={isLoading}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Uji Kueri</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {testResult && (
              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2 mt-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span>HASIL RESPON PUG-REST: OK (200)</span>
                  <span className="text-stone-500">CID: {testResult.cid}</span>
                </div>
                <div><strong>Nama Senyawa:</strong> {testResult.title}</div>
                <div><strong>Rumus Molekul:</strong> {testResult.molecularFormula}</div>
                <div><strong>Bobot Molekul:</strong> {testResult.molecularWeight} g/mol</div>
                <div className="break-all"><strong>Canonical SMILES:</strong> {testResult.canonicalSmiles}</div>

                <div className="pt-2 flex items-center gap-2 border-t border-stone-100 font-sans">
                  <a
                    href={getPubChemCompoundUrl(testResult.cid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded text-xs flex items-center gap-1"
                  >
                    <span>Buka PubChem</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={getSwissAdmeUrl(testResult.canonicalSmiles)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-800 text-white hover:bg-emerald-900 rounded text-xs flex items-center gap-1 font-semibold"
                  >
                    <span>Simulasikan di SwissADME</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Batch Synchronization Tool */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div>
              <h3 className="font-semibold text-stone-800">
                Penyelarasan Batch Koleksi Monografi FHI
              </h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Secara otomatis menelusuri spesies tanaman dan memperbarui data metabolit penanda dari PubChem.
              </p>
            </div>

            {batchStatus && (
              <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-mono">
                {batchStatus}
              </div>
            )}

            <button
              onClick={handleRunBatchSync}
              disabled={isBatchRunning}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBatchRunning ? 'animate-spin' : ''}`} />
              <span>{isBatchRunning ? 'Menyelaraskan...' : 'Jalankan Pemeriksaan Batch'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
