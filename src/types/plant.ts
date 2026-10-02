export interface Metabolite {
  nama: string;
  cid: number;
  smiles: string;
  rumus?: string;
  beratMolekul?: number;
  peran?: string; // e.g. 'Senyawa Marka', 'Bioaktif Utama', 'Minyak Atsiri'
}

export interface Plant {
  id: string;
  no: number;
  namaLokal: string;
  namaLatin: string;
  famili: string;
  bagianDigunakan: string;
  sumberMonografi: string;
  indikasiKlinis: string[];
  indikasiFOHAI?: string;
  ciriMakroskopis: string;
  fotoTanamanSegar: string;
  fotoSimplisiaMakroskopis: string;
  pubchemCid: number | null;
  pubchemLink?: string;
  senyawaAktif: Metabolite[];
  statusKurasi: 'Published' | 'Draft';
  terakhirDiperbarui: string;
  dikurasiOleh: string;
  catatanLaboratorium?: string;
}

export type RoleLevel = 'SUPERADMIN' | 'ADMIN' | 'USER';

export type UserRole = 'SUPERADMIN' | 'ADMIN_DOSEN_1' | 'ADMIN_DOSEN_2' | 'MAHASISWA';

export interface UserProfile {
  id: UserRole;
  username?: string;
  nama: string;
  gelar: string;
  departemen: string;
  peran: RoleLevel;
  avatarInitials: string;
}
