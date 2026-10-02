import React, { useState } from 'react';
import { Plant, Metabolite } from '../types/plant';
import { usePlantContext } from '../context/PlantContext';
import { 
  autoFetchMetabolitesForPlant, 
  fetchPubChemByCID, 
  fetchPubChemByName 
} from '../services/pubchemService';
import { 
  X, 
  Upload, 
  Sparkles, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

interface PlantFormModalProps {
  initialPlant?: Plant | null;
  onClose: () => void;
}

export const PlantFormModal: React.FC<PlantFormModalProps> = ({
  initialPlant,
  onClose,
}) => {
  const { addPlant, updatePlant, userProfile, masterParts, masterMonographs } = usePlantContext();

  const isEditing = !!initialPlant;

  // Form states
  const [namaLokal, setNamaLokal] = useState(initialPlant?.namaLokal || '');
  const [namaLatin, setNamaLatin] = useState(initialPlant?.namaLatin || '');
  const [famili, setFamili] = useState(initialPlant?.famili || '');
  const [bagianDigunakan, setBagianDigunakan] = useState(initialPlant?.bagianDigunakan || 'Daun');
  const [sumberMonografi, setSumberMonografi] = useState(initialPlant?.sumberMonografi || 'FHI Edisi II');
  const [statusKurasi, setStatusKurasi] = useState<'Published' | 'Draft'>(initialPlant?.statusKurasi || 'Published');
  
  const [indikasiList, setIndikasiList] = useState<string[]>(initialPlant?.indikasiKlinis || ['Antiinflamasi']);
  const [newIndikasiInput, setNewIndikasiInput] = useState('');
  
  const [indikasiFOHAI, setIndikasiFOHAI] = useState(
    initialPlant?.indikasiFOHAI || 'Digunakan berdasarkan monografi FHI untuk pengobatan komplementer dan fitoterapi klinis.'
  );
  const [ciriMakroskopis, setCiriMakroskopis] = useState(
    initialPlant?.ciriMakroskopis || 'Karakteristik simplisia: rajangan bersih berbau khas aromatis, bebas jamur dan kotoran.'
  );

  // Photos
  const [fotoTanamanSegar, setFotoTanamanSegar] = useState(
    initialPlant?.fotoTanamanSegar || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80'
  );
  const [fotoSimplisiaMakroskopis, setFotoSimplisiaMakroskopis] = useState(
    initialPlant?.fotoSimplisiaMakroskopis || 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
  );

  // Metabolites list
  const [senyawaAktif, setSenyawaAktif] = useState<Metabolite[]>(initialPlant?.senyawaAktif || []);
  const [pubchemCid, setPubchemCid] = useState<number | null>(initialPlant?.pubchemCid || null);

  // PubChem Auto-fetching state
  const [isFetchingPubChem, setIsFetchingPubChem] = useState(false);
  const [pubchemMessage, setPubchemMessage] = useState<string | null>(null);

  // Manual compound input
  const [tempCompoundName, setTempCompoundName] = useState('');
  const [tempCompoundCid, setTempCompoundCid] = useState('');

  // Handle local file uploads (Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'fresh' | 'simplisia') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'fresh') {
          setFotoTanamanSegar(result);
        } else {
          setFotoSimplisiaMakroskopis(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add indication
  const handleAddIndikasi = () => {
    if (newIndikasiInput.trim() && !indikasiList.includes(newIndikasiInput.trim())) {
      setIndikasiList([...indikasiList, newIndikasiInput.trim()]);
      setNewIndikasiInput('');
    }
  };

  const handleRemoveIndikasi = (index: number) => {
    setIndikasiList(indikasiList.filter((_, i) => i !== index));
  };

  // Trigger automated PubChem metabolite pulling
  const handleTriggerPubChemAuto = async () => {
    if (!namaLatin.trim()) {
      setPubchemMessage('Harap masukkan Nama Latin terlebih dahulu sebelum menarik data PubChem.');
      return;
    }

    setIsFetchingPubChem(true);
    setPubchemMessage('Menghubungi NCBI PubChem PUG-REST API...');

    try {
      const result = await autoFetchMetabolitesForPlant(namaLatin, senyawaAktif);
      if (result.metabolites && result.metabolites.length > 0) {
        setSenyawaAktif(result.metabolites);
        if (result.primaryCid) {
          setPubchemCid(result.primaryCid);
        }
        setPubchemMessage(`Sukses! Ditemukan ${result.metabolites.length} metabolit aktif dari PubChem dengan Canonical SMILES.`);
      } else {
        setPubchemMessage('PubChem tidak mengembalikan senyawa spesifik untuk spesies ini. Anda dapat menambahkan senyawa secara manual.');
      }
    } catch (err) {
      console.error(err);
      setPubchemMessage('Gagal mengambil data dari PubChem. Periksa koneksi internet atau gunakan input manual.');
    } finally {
      setIsFetchingPubChem(false);
    }
  };

  // Add individual compound via PubChem lookup
  const handleAddCompoundFromPubChem = async () => {
    if (!tempCompoundName.trim() && !tempCompoundCid.trim()) return;

    setIsFetchingPubChem(true);
    try {
      let prop = null;
      if (tempCompoundCid.trim()) {
        prop = await fetchPubChemByCID(parseInt(tempCompoundCid.trim(), 10));
      } else if (tempCompoundName.trim()) {
        prop = await fetchPubChemByName(tempCompoundName.trim());
      }

      if (prop) {
        const newCompound: Metabolite = {
          nama: prop.title || tempCompoundName.trim(),
          cid: prop.cid,
          smiles: prop.canonicalSmiles,
          rumus: prop.molecularFormula,
          beratMolekul: prop.molecularWeight,
          peran: 'Senyawa Aktif Terdaftar',
        };
        setSenyawaAktif([...senyawaAktif, newCompound]);
        if (!pubchemCid) setPubchemCid(prop.cid);
        setTempCompoundName('');
        setTempCompoundCid('');
        setPubchemMessage(`Berhasil menambahkan ${prop.title} (CID: ${prop.cid}) dari PubChem.`);
      } else {
        // Fallback manual compound
        setSenyawaAktif([
          ...senyawaAktif,
          {
            nama: tempCompoundName.trim() || `Senyawa ${tempCompoundCid}`,
            cid: tempCompoundCid ? parseInt(tempCompoundCid, 10) : 0,
            smiles: '',
            peran: 'Metabolit Sekunder',
          },
        ]);
        setTempCompoundName('');
        setTempCompoundCid('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingPubChem(false);
    }
  };

  const handleRemoveCompound = (index: number) => {
    const updated = senyawaAktif.filter((_, i) => i !== index);
    setSenyawaAktif(updated);
    if (updated.length > 0) {
      setPubchemCid(updated[0].cid);
    } else {
      setPubchemCid(null);
    }
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLokal.trim() || !namaLatin.trim()) {
      alert('Nama Lokal dan Nama Latin wajib diisi.');
      return;
    }

    const payload = {
      namaLokal: namaLokal.trim(),
      namaLatin: namaLatin.trim(),
      famili: famili.trim() || 'Zingiberaceae',
      bagianDigunakan: bagianDigunakan.trim() || 'Daun',
      sumberMonografi: sumberMonografi.trim() || 'FHI Edisi II',
      indikasiKlinis: indikasiList.length > 0 ? indikasiList : ['Fitoterapi Umum'],
      indikasiFOHAI,
      ciriMakroskopis,
      fotoTanamanSegar,
      fotoSimplisiaMakroskopis,
      pubchemCid: pubchemCid || (senyawaAktif[0]?.cid ?? null),
      pubchemLink: pubchemCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}` : undefined,
      senyawaAktif,
      statusKurasi,
    };

    if (isEditing && initialPlant) {
      updatePlant(initialPlant.id, payload);
    } else {
      addPlant(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Form Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-[11px] font-mono text-emerald-800 font-semibold uppercase tracking-wider">
              {isEditing ? `Kurasi Tanaman: ${initialPlant?.id}` : 'Entri Tanaman Baru'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isEditing ? `Edit Data: ${initialPlant?.namaLokal}` : 'Tambah Tanaman Obat ke Atlas'}
            </h2>
            <p className="text-xs text-stone-500">
              Kurator Aktif: {userProfile.nama} ({userProfile.departemen})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. Botanical Classification */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900 font-serif pb-1 border-b border-stone-200">
              1. Identitas Taksonomi & Monografi Resmi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Lokal (Indonesia) *
                </label>
                <input
                  type="text"
                  required
                  value={namaLokal}
                  onChange={(e) => setNamaLokal(e.target.value)}
                  placeholder="e.g. Kunyit, Sambiloto"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Latin (Spesies botanis) *
                </label>
                <input
                  type="text"
                  required
                  value={namaLatin}
                  onChange={(e) => setNamaLatin(e.target.value)}
                  placeholder="e.g. Curcuma longa L."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 italic focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Suku (Famili) *
                </label>
                <input
                  type="text"
                  required
                  value={famili}
                  onChange={(e) => setFamili(e.target.value)}
                  placeholder="e.g. Zingiberaceae"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Bagian yang Digunakan *
                </label>
                <select
                  value={bagianDigunakan}
                  onChange={(e) => setBagianDigunakan(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                >
                  {masterParts.map((part) => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                  {!masterParts.includes(bagianDigunakan) && (
                    <option value={bagianDigunakan}>{bagianDigunakan}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Sumber Monografi Baku *
                </label>
                <select
                  value={sumberMonografi}
                  onChange={(e) => setSumberMonografi(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                >
                  {masterMonographs.map((mono) => (
                    <option key={mono} value={mono}>{mono}</option>
                  ))}
                  {!masterMonographs.includes(sumberMonografi) && (
                    <option value={sumberMonografi}>{sumberMonografi}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Status Kurasi *
                </label>
                <select
                  value={statusKurasi}
                  onChange={(e) => setStatusKurasi(e.target.value as 'Published' | 'Draft')}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                >
                  <option value="Published">Published (Tampil di Atlas Mahasiswa)</option>
                  <option value="Draft">Draft (Dalam Penelaahan Kurator)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Visual Media: Fresh Plant vs Macroscopic Simplisia */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900 font-serif pb-1 border-b border-stone-200">
              2. Manajemen Media Visual (Foto Segar & Simplisia Makroskopis)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Foto Simplisia */}
              <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="block font-semibold text-stone-800">
                  Foto Simplisia Makroskopis Kering (Lab)
                </label>
                <div className="aspect-16/10 rounded-lg overflow-hidden border border-stone-200 bg-stone-200">
                  <img
                    src={fotoSimplisiaMakroskopis}
                    alt="Pratinjau Simplisia"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 pt-1">
                  <input
                    type="url"
                    value={fotoSimplisiaMakroskopis}
                    onChange={(e) => setFotoSimplisiaMakroskopis(e.target.value)}
                    placeholder="URL gambar..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-md"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>atau unggah dari lab:</span>
                    <label className="cursor-pointer text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Pilih Berkas Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'simplisia')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Foto Tanaman Segar */}
              <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="block font-semibold text-stone-800">
                  Foto Tanaman Segar (Habitus Alamiah)
                </label>
                <div className="aspect-16/10 rounded-lg overflow-hidden border border-stone-200 bg-stone-200">
                  <img
                    src={fotoTanamanSegar}
                    alt="Pratinjau Tanaman Segar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 pt-1">
                  <input
                    type="url"
                    value={fotoTanamanSegar}
                    onChange={(e) => setFotoTanamanSegar(e.target.value)}
                    placeholder="URL gambar..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-md"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>atau unggah dari kamera:</span>
                    <label className="cursor-pointer text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Pilih Berkas Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'fresh')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Clinical Indications & Organoleptic Specs */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900 font-serif pb-1 border-b border-stone-200">
              3. Indikasi Klinis & Karakteristik Makroskopis
            </h3>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Indikasi & Khasiat Klinis (FOHAI / FROTI)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {indikasiList.map((ind, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-md font-medium"
                  >
                    <span>{ind}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIndikasi(i)}
                      className="text-emerald-700 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIndikasiInput}
                  onChange={(e) => setNewIndikasiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIndikasi(); } }}
                  placeholder="Ketik indikasi baru (mis. Antihipertensi, Hepatoprotektor) lalu tekan Tambah..."
                  className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddIndikasi}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-lg"
                >
                  Tambah
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Keterangan Monografi Herbal Medik (FOHAI)
              </label>
              <textarea
                rows={2}
                value={indikasiFOHAI}
                onChange={(e) => setIndikasiFOHAI(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Ciri Makroskopis & Organoleptik (Uji Praktikum Lab)
              </label>
              <textarea
                rows={2}
                value={ciriMakroskopis}
                onChange={(e) => setCiriMakroskopis(e.target.value)}
                placeholder="Deskripsikan bentuk rajangan, bau aromatis, rasa (pahit/getir/manis), warna permukaan dan fraktur..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 4. Automated PubChem Metabolite Trigger */}
          <div className="space-y-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-emerald-950 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Integrasi Otomatis PubChem PUG-REST API</span>
                </h3>
                <p className="text-stone-600 text-[11px] mt-0.5">
                  Tarik otomatis daftar metabolit sekunder, formula, dan Canonical SMILES untuk SwissADME
                </p>
              </div>

              <button
                type="button"
                onClick={handleTriggerPubChemAuto}
                disabled={isFetchingPubChem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs transition-colors shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingPubChem ? 'animate-spin' : ''}`} />
                <span>Tarik Data PubChem Otomatis</span>
              </button>
            </div>

            {pubchemMessage && (
              <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{pubchemMessage}</span>
              </div>
            )}

            {/* List of active metabolites */}
            <div className="space-y-2 pt-2">
              <span className="font-semibold text-stone-800 block text-xs">
                Daftar Senyawa Aktif Terdaftar ({senyawaAktif.length}):
              </span>

              {senyawaAktif.length > 0 ? (
                <div className="space-y-1.5">
                  {senyawaAktif.map((met, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-lg border border-stone-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-stone-900">{met.nama}</span>
                        {met.cid > 0 && (
                          <span className="ml-2 font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            CID: {met.cid}
                          </span>
                        )}
                        {met.smiles && (
                          <span className="block text-[10px] font-mono text-stone-400 truncate">
                            SMILES: {met.smiles}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCompound(idx)}
                        className="text-stone-400 hover:text-red-700 p-1"
                        title="Hapus senyawa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 italic text-[11px]">
                  Belum ada senyawa. Masukkan Nama Latin di atas lalu klik &quot;Tarik Data PubChem Otomatis&quot; atau tambahkan secara manual di bawah.
                </p>
              )}

              {/* Add compound manually / search */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={tempCompoundName}
                  onChange={(e) => setTempCompoundName(e.target.value)}
                  placeholder="Nama Senyawa (e.g. Curcumin)"
                  className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900"
                />
                <input
                  type="number"
                  value={tempCompoundCid}
                  onChange={(e) => setTempCompoundCid(e.target.value)}
                  placeholder="CID (e.g. 969516)"
                  className="w-32 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddCompoundFromPubChem}
                  disabled={isFetchingPubChem}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-lg"
                >
                  Tambah Senyawa
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              {isEditing ? 'Simpan Perubahan Tanaman' : 'Tambahkan Tanaman ke Direktori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
