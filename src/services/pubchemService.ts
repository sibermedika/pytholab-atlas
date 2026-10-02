import { Metabolite } from '../types/plant';

// PubChem PUG-REST API Base URL
const PUBCHEM_PUG_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

export interface PubChemPropertyResult {
  cid: number;
  title: string;
  iupacName?: string;
  canonicalSmiles: string;
  molecularFormula: string;
  molecularWeight?: number;
}

/**
 * Fetch compound details by PubChem CID using PUG-REST API
 */
export async function fetchPubChemByCID(cid: number): Promise<PubChemPropertyResult | null> {
  try {
    const url = `${PUBCHEM_PUG_BASE}/compound/cid/${cid}/property/Title,IUPACName,CanonicalSMILES,MolecularFormula,MolecularWeight/JSON`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PubChem API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) return null;

    return {
      cid: props.CID,
      title: props.Title || `Compound ${props.CID}`,
      iupacName: props.IUPACName,
      canonicalSmiles: props.CanonicalSMILES || '',
      molecularFormula: props.MolecularFormula || '',
      molecularWeight: props.MolecularWeight ? Number(props.MolecularWeight) : undefined,
    };
  } catch (error) {
    console.warn(`[PubChem PUG-REST] Gagal mengambil data untuk CID ${cid}:`, error);
    return null;
  }
}

/**
 * Fetch compound details by Compound Name using PUG-REST API
 */
export async function fetchPubChemByName(compoundName: string): Promise<PubChemPropertyResult | null> {
  try {
    const cleanName = compoundName.trim();
    if (!cleanName) return null;

    const url = `${PUBCHEM_PUG_BASE}/compound/name/${encodeURIComponent(cleanName)}/property/Title,IUPACName,CanonicalSMILES,MolecularFormula,MolecularWeight/JSON`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PubChem API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) return null;

    return {
      cid: props.CID,
      title: props.Title || cleanName,
      iupacName: props.IUPACName,
      canonicalSmiles: props.CanonicalSMILES || '',
      molecularFormula: props.MolecularFormula || '',
      molecularWeight: props.MolecularWeight ? Number(props.MolecularWeight) : undefined,
    };
  } catch (error) {
    console.warn(`[PubChem PUG-REST] Gagal mengambil data untuk nama "${compoundName}":`, error);
    return null;
  }
}

/**
 * Curated knowledge base of primary marker metabolites for Indonesian medicinal species
 * Enables intelligent auto-resolution when Admin clicks "Tarik Data PubChem"
 */
export const PLANT_SPECIES_METABOLITE_MAP: Record<string, Array<{ name: string; fallbackCid: number; defaultRole: string }>> = {
  'Curcuma longa': [
    { name: 'Curcumin', fallbackCid: 969516, defaultRole: 'Senyawa Marka Utama (Kurkuminoid)' },
    { name: 'Demethoxycurcumin', fallbackCid: 5469424, defaultRole: 'Kurkuminoid Pendamping' },
    { name: 'Bisdemethoxycurcumin', fallbackCid: 5315472, defaultRole: 'Kurkuminoid' },
    { name: 'Turmerone', fallbackCid: 559779, defaultRole: 'Minyak Atsiri (Seskuiterpen)' },
  ],
  'Curcuma xanthorrhiza': [
    { name: 'Xanthorrhizol', fallbackCid: 108134, defaultRole: 'Senyawa Marka Spesifik Temulawak' },
    { name: 'Curcumin', fallbackCid: 969516, defaultRole: 'Kurkuminoid Bioaktif' },
    { name: 'Camphor', fallbackCid: 2537, defaultRole: 'Komponen Atsiri' },
  ],
  'Andrographis paniculata': [
    { name: 'Andrographolide', fallbackCid: 5318517, defaultRole: 'Diterpen Lakton (Marka FHI)' },
    { name: 'Neoandrographolide', fallbackCid: 9848024, defaultRole: 'Diterpen Glikosida' },
    { name: '14-Deoxy-11,12-didehydroandrographolide', fallbackCid: 5318518, defaultRole: 'Metabolit Aktif' },
  ],
  'Zingiber officinale': [
    { name: '6-Gingerol', fallbackCid: 442793, defaultRole: 'Senyawa Pedas & Marka Utama' },
    { name: '6-Shogaol', fallbackCid: 5281794, defaultRole: 'Metabolit Dehidrasi Gingerol' },
    { name: 'Zingiberene', fallbackCid: 92776, defaultRole: 'Minyak Atsiri Utama' },
  ],
  'Piper betle': [
    { name: 'Eugenol', fallbackCid: 3314, defaultRole: 'Fenilpropanoid Antiseptik Utama' },
    { name: 'Chavicol', fallbackCid: 10793, defaultRole: 'Senyawa Fenolik Bakterisidal' },
    { name: 'Hydroxychavicol', fallbackCid: 5281517, defaultRole: 'Antioksidan & Antimikroba' },
  ],
  'Allium sativum': [
    { name: 'Allicin', fallbackCid: 65036, defaultRole: 'Tiosulfinat Bioaktif Utama' },
    { name: 'Alliin', fallbackCid: 87310, defaultRole: 'Prekursor Alisin (Asam Amino Sulfur)' },
    { name: 'Ajoene', fallbackCid: 5386591, defaultRole: 'Senyawa Organosulfur Antitrombotik' },
  ],
  'Centella asiatica': [
    { name: 'Asiaticoside', fallbackCid: 108062, defaultRole: 'Triterpenoid Saponin Marka FHI' },
    { name: 'Madecassoside', fallbackCid: 13915878, defaultRole: 'Triterpenoid Penyembuh Luka' },
    { name: 'Asiatic acid', fallbackCid: 119034, defaultRole: 'Sapogenin Aktif' },
  ],
  'Orthosiphon stamineus': [
    { name: 'Sinensetin', fallbackCid: 145659, defaultRole: 'Flavonoid Polimetoksi Marka FHI' },
    { name: 'Eupatorin', fallbackCid: 97214, defaultRole: 'Flavonoid Diuretik' },
    { name: 'Rosmarinic acid', fallbackCid: 5281792, defaultRole: 'Asam Polifenol Antiinflamasi' },
  ],
  'Phyllanthus niruri': [
    { name: 'Phyllanthin', fallbackCid: 119427, defaultRole: 'Lignan Marka FHI (Hepatoprotektor)' },
    { name: 'Hypophyllanthin', fallbackCid: 119428, defaultRole: 'Lignan Pendamping' },
    { name: 'Corilagin', fallbackCid: 73568, defaultRole: 'Tanin Terhidrolisis Imunomodulator' },
  ],
  'Morinda citrifolia': [
    { name: 'Scopoletin', fallbackCid: 5280460, defaultRole: 'Kumarin Hipotensif Marka FHI' },
    { name: 'Damnacanthal', fallbackCid: 160481, defaultRole: 'Antrakuinon Sitotoksik' },
    { name: 'Ursolic acid', fallbackCid: 64945, defaultRole: 'Asam Triterpenoid Protektif' },
  ],
  'Moringa oleifera': [
    { name: 'Quercetin', fallbackCid: 5280343, defaultRole: 'Flavonoid Antioksidan Utama' },
    { name: 'Kaempferol', fallbackCid: 5280863, defaultRole: 'Flavonol Kardioprotektif' },
    { name: 'Chlorogenic acid', fallbackCid: 1794427, defaultRole: 'Polifenol Hipoglikemik' },
  ],
  'Kaempferia galanga': [
    { name: 'Ethyl p-methoxycinnamate', fallbackCid: 6432029, defaultRole: 'Ester Sinamat Marka FHI Kencur' },
    { name: 'Ethyl cinnamate', fallbackCid: 10344, defaultRole: 'Komponen Aromatik' },
  ],
  'Piper cubeba': [
    { name: 'Cubebin', fallbackCid: 119024, defaultRole: 'Lignan Marka Kemukus' },
    { name: 'Piperine', fallbackCid: 638024, defaultRole: 'Alkaloid Pedas' },
  ],
  'Syzygium polyanthum': [
    { name: 'Eugenol', fallbackCid: 3314, defaultRole: 'Senyawa Fenolik Daun Salam' },
    { name: 'Quercetin 3-O-glucoside', fallbackCid: 5271805, defaultRole: 'Flavonoid Antidiabetes' },
  ],
  'Caesalpinia sappan': [
    { name: 'Brazilin', fallbackCid: 73384, defaultRole: 'Homoisoflavonoid Pigmen Merah Marka FHI' },
    { name: 'Brazilein', fallbackCid: 9814757, defaultRole: 'Produk Oksidasi Brazilin' },
  ],
  'Psidium guajava': [
    { name: 'Quercetin', fallbackCid: 5280343, defaultRole: 'Flavonoid Antidiare & Spasmolitik' },
    { name: 'Guaijaverin', fallbackCid: 5281656, defaultRole: 'Glikosida Kuersetin Antiviral' },
  ],
  'Cymbopogon citratus': [
    { name: 'Citral', fallbackCid: 638011, defaultRole: 'Campuran Geranial & Neral Minyak Sereh' },
    { name: 'Geraniol', fallbackCid: 637566, defaultRole: 'Monoterpen Alkohol Aromatis' },
    { name: 'Myrcene', fallbackCid: 31253, defaultRole: 'Monoterpen Analgesik' },
  ],
  'Sonchus arvensis': [
    { name: 'Luteolin 7-O-glucoside', fallbackCid: 5280637, defaultRole: 'Flavonoid Luruh Batu Ginjal' },
    { name: 'Taraxasterol', fallbackCid: 115250, defaultRole: 'Triterpen Antiinflamasi' },
  ],
  'Carthamus tinctorius': [
    { name: 'Carthamin', fallbackCid: 5281233, defaultRole: 'Pigmen Flavonoid Merah Kesumba' },
    { name: 'Hydroxysafflor yellow A', fallbackCid: 6443665, defaultRole: 'Kalkon Kardioprotektif' },
  ],
  'Aloe vera': [
    { name: 'Aloin', fallbackCid: 12305761, defaultRole: 'Antron C-glikosida Laksatif' },
    { name: 'Aloe emodin', fallbackCid: 10207, defaultRole: 'Agikon Antrakuinon' },
  ],
  'Foeniculum vulgare': [
    { name: 'trans-Anethole', fallbackCid: 637563, defaultRole: 'Fenilpropen Utama Minyak Adas' },
    { name: 'Fenchone', fallbackCid: 14525, defaultRole: 'Monoterpen Keton Karminatif' },
    { name: 'Estragole', fallbackCid: 8815, defaultRole: 'Komponen Atsiri Aromatis' },
  ],
  'Gynura procumbens': [
    { name: 'Chlorogenic acid', fallbackCid: 1794427, defaultRole: 'Asam Fenolat Antioksidan Sambung Nyawa' },
    { name: 'Rutin', fallbackCid: 5280805, defaultRole: 'Flavonoid Antihipertensi' },
  ],
  'Boesenbergia pandurata': [
    { name: 'Panduratin A', fallbackCid: 10429282, defaultRole: 'Kalkon Sikloheksenil Marka Temu Kunci' },
    { name: 'Pinostrobin', fallbackCid: 73201, defaultRole: 'Flavanon Antiinflamasi & Antibakteri' },
    { name: 'Cardamonin', fallbackCid: 641785, defaultRole: 'Kalkon Antikanker' },
  ],
  'Alpinia galanga': [
    { name: '1-Acetoxychavicol acetate', fallbackCid: 5378772, defaultRole: 'Fenilpropanoid Asetat Marka Lengkuas' },
    { name: 'Galangin', fallbackCid: 5281616, defaultRole: 'Flavonol Antimikroba' },
    { name: '1,8-Cineole', fallbackCid: 2758, defaultRole: 'Komponen Atsiri Karminatif' },
  ],
  'Apium graveolens': [
    { name: 'Apigenin', fallbackCid: 5280443, defaultRole: 'Flavonoid Hipotensif Marka Seledri' },
    { name: '3-n-Butylphthalide', fallbackCid: 65243, defaultRole: 'Ftalida Vasodilator Endotel' },
  ],
  'Thymus vulgaris': [
    { name: 'Thymol', fallbackCid: 6989, defaultRole: 'Monoterpen Fenol Antiseptik Marka Timi' },
    { name: 'Carvacrol', fallbackCid: 10364, defaultRole: 'Isomer Timol Antibakteri Kuat' },
  ],
};

/**
 * Intelligent metabolite synchronizer:
 * Takes species name, matches candidates, fetches real PubChem data via PUG-REST API.
 */
export async function autoFetchMetabolitesForPlant(
  namaLatin: string,
  existingMetabolites: Metabolite[] = []
): Promise<{ metabolites: Metabolite[]; primaryCid: number | null }> {
  // Normalize botanical name (e.g. 'Curcuma longa L.' -> 'Curcuma longa')
  const cleanSpecies = namaLatin.replace(/\s+(L\.|Mill\.|Roxb\.|Burm\.f\.|Back\.|Nees|Vahl|DC\.|Jacq\.|Lam\.|Pers\.|Willd\.|Benth\.|Merr\.|Blume|Sm\.|Aubl\.|Less\.|(L\.)\s+[A-Za-z.]+).*$/i, '').trim();

  // Find candidate matches
  let candidateMetabolites: Array<{ name: string; fallbackCid: number; defaultRole: string }> = [];

  for (const [key, list] of Object.entries(PLANT_SPECIES_METABOLITE_MAP)) {
    if (namaLatin.toLowerCase().includes(key.toLowerCase()) || cleanSpecies.toLowerCase().includes(key.toLowerCase())) {
      candidateMetabolites = list;
      break;
    }
  }

  // If no predefined list, try query PubChem for the plant name itself
  if (candidateMetabolites.length === 0) {
    // Try querying the first word of latin or common compounds
    const genus = cleanSpecies.split(' ')[0];
    const candidateName = genus ? `${genus}in` : '';
    if (candidateName) {
      const searchRes = await fetchPubChemByName(candidateName);
      if (searchRes) {
        return {
          metabolites: [
            {
              nama: searchRes.title,
              cid: searchRes.cid,
              smiles: searchRes.canonicalSmiles,
              rumus: searchRes.molecularFormula,
              beratMolekul: searchRes.molecularWeight,
              peran: 'Senyawa Bioaktif Terdeteksi via PubChem',
            },
          ],
          primaryCid: searchRes.cid,
        };
      }
    }

    return {
      metabolites: existingMetabolites.length > 0 ? existingMetabolites : [],
      primaryCid: existingMetabolites[0]?.cid || null,
    };
  }

  // Fetch real PUG-REST data for the candidate metabolites in parallel
  const fetchedList: Metabolite[] = [];

  for (const item of candidateMetabolites) {
    try {
      // First try fetching by CID
      const prop = await fetchPubChemByCID(item.fallbackCid);
      if (prop) {
        fetchedList.push({
          nama: item.name,
          cid: prop.cid,
          smiles: prop.canonicalSmiles,
          rumus: prop.molecularFormula,
          beratMolekul: prop.molecularWeight,
          peran: item.defaultRole,
        });
      } else {
        // Fallback to name search
        const propByName = await fetchPubChemByName(item.name);
        if (propByName) {
          fetchedList.push({
            nama: item.name,
            cid: propByName.cid,
            smiles: propByName.canonicalSmiles,
            rumus: propByName.molecularFormula,
            beratMolekul: propByName.molecularWeight,
            peran: item.defaultRole,
          });
        }
      }
    } catch (e) {
      console.warn(`Error resolving metabolite ${item.name}:`, e);
    }
  }

  const resultList = fetchedList.length > 0 ? fetchedList : existingMetabolites;
  const primaryCid = resultList[0]?.cid || null;

  return {
    metabolites: resultList,
    primaryCid,
  };
}

/**
 * Direct SwissADME simulation URL generator
 * Format: http://www.swissadme.ch/index.php#smiles=<ENCODED_SMILES>
 */
export function getSwissAdmeUrl(smiles: string): string {
  if (!smiles) return 'http://www.swissadme.ch';
  return `http://www.swissadme.ch/index.php#smiles=${encodeURIComponent(smiles.trim())}`;
}

/**
 * Direct PubChem compound URL generator
 */
export function getPubChemCompoundUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
}
