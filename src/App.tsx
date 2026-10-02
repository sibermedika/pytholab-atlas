import React, { useState, useMemo } from 'react';
import { PlantProvider, usePlantContext } from './context/PlantContext';
import { Plant } from './types/plant';
import { Header } from './components/Header';
import { FilterBar, FilterState } from './components/FilterBar';
import { PlantCard } from './components/PlantCard';
import { TableView } from './components/TableView';
import { AtlasCompareView } from './components/AtlasCompareView';
import { PlantDetailModal } from './components/PlantDetailModal';
import { PlantFormModal } from './components/PlantFormModal';
import { MacroscopicCompareModal } from './components/MacroscopicCompareModal';
import { PracticumNotesDrawer } from './components/PracticumNotesDrawer';
import { BatchPubChemModal } from './components/BatchPubChemModal';
import { LoginModal } from './components/LoginModal';
import { FlaskConical, BookOpen, Layers, ExternalLink, Mail, ShieldCheck } from 'lucide-react';

function AtlasDirectoryMain() {
  const { plants, userProfile, isLoggedIn, bookmarkedIds } = usePlantContext();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedPart: 'Semua',
    selectedIndication: 'Semua',
    selectedMonograph: 'Semua',
    selectedStatus: 'Semua',
    onlyPubChem: false,
    onlyBookmarked: false,
    sortBy: 'no_asc',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'compare' | 'table'>('grid');

  // Modals & Drawers
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [comparePlant, setComparePlant] = useState<Plant | null>(null);
  const [isPracticumDrawerOpen, setIsPracticumDrawerOpen] = useState(false);
  const [isBatchSyncModalOpen, setIsBatchSyncModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filtered & Sorted Plants
  const filteredPlants = useMemo(() => {
    return plants
      .filter((plant) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchLokal = plant.namaLokal.toLowerCase().includes(q);
          const matchLatin = plant.namaLatin.toLowerCase().includes(q);
          const matchFamili = plant.famili.toLowerCase().includes(q);
          const matchPart = plant.bagianDigunakan.toLowerCase().includes(q);
          const matchIndikasi = plant.indikasiKlinis.some((ind) => ind.toLowerCase().includes(q));
          const matchMetabolite = plant.senyawaAktif.some((m) => m.nama.toLowerCase().includes(q));

          if (!matchLokal && !matchLatin && !matchFamili && !matchPart && !matchIndikasi && !matchMetabolite) {
            return false;
          }
        }

        // Part filter
        if (filters.selectedPart !== 'Semua') {
          if (!plant.bagianDigunakan.toLowerCase().includes(filters.selectedPart.toLowerCase())) {
            return false;
          }
        }

        // Indication filter
        if (filters.selectedIndication !== 'Semua') {
          const hasIndication = plant.indikasiKlinis.some((ind) =>
            ind.toLowerCase().includes(filters.selectedIndication.toLowerCase())
          );
          if (!hasIndication) return false;
        }

        // Status filter
        if (filters.selectedStatus !== 'Semua') {
          if (plant.statusKurasi !== filters.selectedStatus) return false;
        } else {
          // If Student (Read-Only User), hide Drafts by default
          if (!isLoggedIn && plant.statusKurasi === 'Draft') {
            return false;
          }
        }

        // PubChem connected
        if (filters.onlyPubChem) {
          const hasPubchem = (plant.pubchemCid && plant.pubchemCid > 0) || plant.senyawaAktif.some((m) => m.cid > 0);
          if (!hasPubchem) return false;
        }

        // Bookmarked only
        if (filters.onlyBookmarked) {
          if (!bookmarkedIds.includes(plant.id)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'no_asc') return a.no - b.no;
        if (filters.sortBy === 'no_desc') return b.no - a.no;
        if (filters.sortBy === 'nama_asc') return a.namaLokal.localeCompare(b.namaLokal);
        if (filters.sortBy === 'latin_asc') return a.namaLatin.localeCompare(b.namaLatin);
        return 0;
      });
  }, [plants, filters, isLoggedIn, bookmarkedIds]);

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* Top App Header with Login/Logout & Credit */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenPracticumDrawer={() => setIsPracticumDrawerOpen(true)}
        onOpenBatchSyncModal={() => setIsBatchSyncModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFiltered={filteredPlants.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {filteredPlants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <FlaskConical className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 font-serif">
              Tidak Ada Simplisia yang Sesuai Filter
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-4 leading-relaxed">
              Silakan periksa kata kunci pencarian Anda atau reset kriteria filter untuk melihat seluruh koleksi Farmakope Herbal Indonesia.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  selectedPart: 'Semua',
                  selectedIndication: 'Semua',
                  selectedMonograph: 'Semua',
                  selectedStatus: 'Semua',
                  onlyPubChem: false,
                  onlyBookmarked: false,
                  sortBy: 'no_asc',
                })
              }
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onOpenDetail={setDetailPlant}
                    onEdit={setEditingPlant}
                    onOpenCompare={setComparePlant}
                  />
                ))}
              </div>
            )}

            {viewMode === 'compare' && (
              <AtlasCompareView
                plants={filteredPlants}
                onOpenDetail={setDetailPlant}
                onOpenCompareModal={setComparePlant}
              />
            )}

            {viewMode === 'table' && (
              <TableView
                plants={filteredPlants}
                onOpenDetail={setDetailPlant}
                onEdit={setEditingPlant}
              />
            )}
          </>
        )}
      </main>

      {/* Institutional Academic Footer with Developer Credit */}
      <footer className="bg-white border-t border-stone-200 py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 font-serif text-sm">
                Ethno PhytoLab Digital Atlas
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Fakultas Kedokteran
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1">
              Basis Data Resmi: Farmakope Herbal Indonesia (FHI Edisi II & Suplemen II) · Formularium Obat Herbal Asli Indonesia (FOHAI)
            </p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-700">
              <span className="font-semibold text-stone-800">Credit:</span>
              <span>dikembangkan oleh</span>
              <a
                href="mailto:dr.penggalih@unwahas.ac.id"
                className="text-emerald-800 font-semibold hover:underline flex items-center gap-1 font-mono"
              >
                <Mail className="w-3 h-3 text-emerald-700" />
                <span>dr.penggalih@unwahas.ac.id</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PubChem PUG-REST API
            </span>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <a
              href="http://www.swissadme.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>SIB SwissADME Tool</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Detail Modal */}
      {detailPlant && (
        <PlantDetailModal
          plant={detailPlant}
          onClose={() => setDetailPlant(null)}
          onOpenCompare={(p) => {
            setDetailPlant(null);
            setComparePlant(p);
          }}
          onEdit={(p) => {
            setDetailPlant(null);
            setEditingPlant(p);
          }}
        />
      )}

      {/* 2. Form Modal (Admin / SuperAdmin Create / Edit) */}
      {(isAddModalOpen || editingPlant) && (
        <PlantFormModal
          initialPlant={editingPlant}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingPlant(null);
          }}
        />
      )}

      {/* 3. Macroscopic Full-Screen Comparison Modal */}
      {comparePlant && (
        <MacroscopicCompareModal
          plant={comparePlant}
          onClose={() => setComparePlant(null)}
        />
      )}

      {/* 4. Practicum Notes Drawer */}
      <PracticumNotesDrawer
        isOpen={isPracticumDrawerOpen}
        onClose={() => setIsPracticumDrawerOpen(false)}
        onSelectPlant={(p) => setDetailPlant(p)}
      />

      {/* 5. Batch PubChem & PUG-REST Modal */}
      <BatchPubChemModal
        isOpen={isBatchSyncModalOpen}
        onClose={() => setIsBatchSyncModalOpen(false)}
      />

      {/* 6. Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlantProvider>
      <AtlasDirectoryMain />
    </PlantProvider>
  );
}
