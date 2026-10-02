import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  LayoutGrid, 
  Table, 
  SplitSquareVertical, 
  Bookmark, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';

export interface FilterState {
  searchQuery: string;
  selectedPart: string;
  selectedIndication: string;
  selectedMonograph: string;
  selectedStatus: string;
  onlyPubChem: boolean;
  onlyBookmarked: boolean;
  sortBy: 'no_asc' | 'no_desc' | 'nama_asc' | 'latin_asc';
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  viewMode: 'grid' | 'compare' | 'table';
  onViewModeChange: (mode: 'grid' | 'compare' | 'table') => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  const { userProfile, isLoggedIn, bookmarkedIds, masterParts, masterIndications } = usePlantContext();

  const activeParts = ['Semua', ...masterParts];
  const activeIndications = ['Semua', ...masterIndications];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      selectedPart: 'Semua',
      selectedIndication: 'Semua',
      selectedMonograph: 'Semua',
      selectedStatus: 'Semua',
      onlyPubChem: false,
      onlyBookmarked: false,
      sortBy: 'no_asc',
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.selectedPart !== 'Semua' ||
    filters.selectedIndication !== 'Semua' ||
    filters.selectedMonograph !== 'Semua' ||
    filters.selectedStatus !== 'Semua' ||
    filters.onlyPubChem ||
    filters.onlyBookmarked ||
    filters.sortBy !== 'no_asc';

  return (
    <div className="bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
      {/* Top Search & View Switcher Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearch}
            placeholder="Cari nama lokal, nama latin, famili, metabolit (e.g. Kurkumin, Alisin), indikasi..."
            className="w-full pl-10 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 placeholder-stone-400 transition-all font-sans"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-2 shrink-0 justify-end">
          <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Kartu Ringkas (Ringkasan Praktikum)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kartu Ringkas</span>
            </button>
            <button
              onClick={() => onViewModeChange('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'compare'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Atlas Komparasi Makroskopis (Segar vs Simplisia)"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Komparasi Visual</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Tabel Register Monografi FHI"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tabel FHI</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-700 focus:outline-hidden focus:border-emerald-700"
          >
            <option value="no_asc">Urutan FHI (No. 1 - 119)</option>
            <option value="no_desc">Urutan Terbalik (No. 119 - 1)</option>
            <option value="nama_asc">Nama Lokal (A - Z)</option>
            <option value="latin_asc">Nama Latin (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Chips / Quick Category Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3 h-3 text-stone-400" />
          Bagian:
        </span>

        <div className="flex flex-wrap items-center gap-1">
          {activeParts.map((part) => (
            <button
              key={part}
              onClick={() => onFilterChange({ ...filters, selectedPart: part })}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filters.selectedPart === part
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {part}
            </button>
          ))}
        </div>

        <div className="hidden lg:block w-px h-5 bg-stone-200 mx-1" />

        {/* Indication Quick Select */}
        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Indikasi:
          </span>
          <select
            value={filters.selectedIndication}
            onChange={(e) => onFilterChange({ ...filters, selectedIndication: e.target.value })}
            className="text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-700 focus:outline-hidden"
          >
            {activeIndications.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Admin & SuperAdmin Status filter */}
        {isLoggedIn && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Status:
            </span>
            <select
              value={filters.selectedStatus}
              onChange={(e) => onFilterChange({ ...filters, selectedStatus: e.target.value })}
              className="text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-700 focus:outline-hidden"
            >
              <option value="Semua">Semua Status</option>
              <option value="Published">Hanya Terbit</option>
              <option value="Draft">Hanya Draft</option>
            </select>
          </div>
        )}

        {/* Checkbox Toggles */}
        <div className="flex items-center gap-3 ml-auto flex-wrap text-stone-600">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={filters.onlyPubChem}
              onChange={(e) => onFilterChange({ ...filters, onlyPubChem: e.target.checked })}
              className="rounded text-emerald-800 focus:ring-emerald-700 border-stone-300 w-3.5 h-3.5"
            />
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ada PubChem</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={filters.onlyBookmarked}
              onChange={(e) => onFilterChange({ ...filters, onlyBookmarked: e.target.checked })}
              className="rounded text-emerald-800 focus:ring-emerald-700 border-stone-300 w-3.5 h-3.5"
            />
            <Bookmark className="w-3.5 h-3.5 text-stone-600" />
            <span>Catatan Saya ({bookmarkedIds.length})</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-[11px] text-red-600 hover:text-red-800 font-medium underline underline-offset-2 ml-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Summary stats line */}
      <div className="text-[11px] text-stone-500 font-mono flex items-center justify-between border-t border-stone-100 pt-1.5">
        <span>Menampilkan <strong className="text-stone-800">{totalFiltered}</strong> simplisia tanaman obat</span>
        {filters.selectedPart !== 'Semua' && (
          <span className="text-emerald-800">Filter bagian: {filters.selectedPart}</span>
        )}
      </div>
    </div>
  );
};
