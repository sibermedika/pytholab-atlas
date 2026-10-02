import { Metabolite } from '../types/plant';

export interface PlantEnrichment {
  indikasiKlinis: string[];
  indikasiFOHAI: string;
  ciriMakroskopis: string;
  fotoTanamanSegar: string;
  fotoSimplisiaMakroskopis: string;
  senyawaAktif: Metabolite[];
}

// Curated dictionary keyed by plant No. (1-119)
export const PLANT_ENRICHMENT_DB: Record<number, Partial<PlantEnrichment>> = {
  1: { // Adas
    indikasiKlinis: ['Karminatif (Kembung)', 'Ekspektoran', 'Spasmolitik Saluran Cerna'],
    indikasiFOHAI: 'Membantu meredakan perut kembung, gangguan pencernaan fungsional, dan batuk berdahak.',
    ciriMakroskopis: 'Buah beruas-ruas berbentuk bulat telur memanjang, warna cokelat kehijauan, berbau aromatis khas, rasa manis agak pedas.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'trans-Anethole', cid: 637563, smiles: 'CC=CC1=CC=C(C=C1)OC', rumus: 'C10H12O', beratMolekul: 148.2, peran: 'Senyawa Marka Utama FHI Minyak Atsiri' },
      { nama: 'Fenchone', cid: 14525, smiles: 'CC1(C2CCC(C2)(C1=O)C)C', rumus: 'C10H16O', beratMolekul: 152.23, peran: 'Monoterpen Karminatif' }
    ]
  },
  10: { // Bawang Putih
    indikasiKlinis: ['Antihipertensi', 'Antikolesterol (Dislipidemia)', 'Antitrombotik'],
    indikasiFOHAI: 'Menurunkan tekanan darah arterial ringan-sedang dan memperbaiki profil lipid serum.',
    ciriMakroskopis: 'Umbi lapis majemuk berbentuk bulat gepeng, terdiri dari 8-20 siung berlapis kulit putih tipis, bau menyengat khas sulfur, rasa pedas getir.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Allicin', cid: 65036, smiles: 'C=CCSS(=O)CC=C', rumus: 'C6H10OS2', beratMolekul: 162.27, peran: 'Senyawa Tiosulfinat Bioaktif Utama' },
      { nama: 'Alliin', cid: 87310, smiles: 'C=CCS(=O)CC(C(=O)O)N', rumus: 'C6H11NO3S', beratMolekul: 177.22, peran: 'Prekursor Alisin (Asam Amino Sulfur)' }
    ]
  },
  26: { // Jahe Merah
    indikasiKlinis: ['Antiinflamasi', 'Analgesik', 'Antiemetik (Mual/Muntah)', 'Imunostimulan'],
    indikasiFOHAI: 'Meredakan nyeri sendi akibat osteoartritis, mual pasca-operasi/kehamilan, dan menghangatkan tubuh.',
    ciriMakroskopis: 'Rimpang berwarna merah muda hingga keunguan pada kulit luar, irisan dalam berserat kemerahan, aroma sangat aromatis dan rasa pedas menusuk.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1615485290176-57cb591bfbfa?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1635843104411-058e587a8b3f?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: '6-Gingerol', cid: 442793, smiles: 'CCCCCC(CC(=O)CCC1=CC(=C(C=C1)O)OC)O', rumus: 'C17H26O4', beratMolekul: 294.39, peran: 'Senyawa Marka Pedas & Antiinflamasi' },
      { nama: '6-Shogaol', cid: 5281794, smiles: 'CCCCCC=CC(=O)CCC1=CC(=C(C=C1)O)OC', rumus: 'C17H24O3', beratMolekul: 276.37, peran: 'Metabolit Dehidrasi Bioaktif' }
    ]
  },
  28: { // Jambu Biji
    indikasiKlinis: ['Antidiare (Adstringen)', 'Trombositopoiesis (DBD)', 'Antimikroba'],
    indikasiFOHAI: 'Mengurangi frekuensi buang air besar pada diare non-spesifik dan membantu menaikkan trombosit.',
    ciriMakroskopis: 'Helaian daun bundar telur memanjang, permukaan bawah berbulu halus, warna hijau kecokelatan kusam, rasa kelat dan pahit.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1536511135899-73e44535cf26?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Quercetin', cid: 5280343, smiles: 'C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O', rumus: 'C15H10O7', beratMolekul: 302.24, peran: 'Flavonoid Antispasmodik Diare' },
      { nama: 'Guaijaverin', cid: 5281656, smiles: 'C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)OC4C(C(C(CO4)O)O)O)O)O', rumus: 'C20H18O11', beratMolekul: 434.35, peran: 'Glikosida Kuersetin Adstringen' }
    ]
  },
  41: { // Kelor
    indikasiKlinis: ['Antioksidan Kuat', 'Antidiabetes', 'Antiinflamasi', 'Nutrisi Mikronutrien'],
    indikasiFOHAI: 'Membantu memelihara daya tahan tubuh dan memperbaiki sensitivitas insulin.',
    ciriMakroskopis: 'Anak daun kecil membundar sungsang, warna hijau kelabu, bau khas langu, rasa agak pahit asin.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Quercetin', cid: 5280343, smiles: 'C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O', rumus: 'C15H10O7', beratMolekul: 302.24, peran: 'Flavonoid Marka FHI' },
      { nama: 'Kaempferol', cid: 5280863, smiles: 'C1=CC(=CC=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O', rumus: 'C15H10O6', beratMolekul: 286.24, peran: 'Flavonoid Antioksidan' }
    ]
  },
  47: { // Kencur
    indikasiKlinis: ['Antitusif & Ekspektoran', 'Analgesik Ringan', 'Gastroprotektif'],
    indikasiFOHAI: 'Mengatasi radang tenggorokan, batuk rejan, dan nyeri lambung.',
    ciriMakroskopis: 'Irisan rimpang pipih membundar, bagian tengah putih kapur, tepi bergerigi cokelat muda, bau sangat aromatis tajam, rasa pedas hangat.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1615485290176-57cb591bfbfa?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Ethyl p-methoxycinnamate', cid: 6432029, smiles: 'CCOC(=O)C=CC1=CC=C(C=C1)OC', rumus: 'C12H14O3', beratMolekul: 206.24, peran: 'Senyawa Marka Utama FHI Kencur' },
      { nama: 'Ethyl cinnamate', cid: 10344, smiles: 'CCOC(=O)C=CC1=CC=CC=C1', rumus: 'C11H12O2', beratMolekul: 176.21, peran: 'Senyawa Ester Aromatis' }
    ]
  },
  57: { // Kumis Kucing
    indikasiKlinis: ['Diuretik (Peluruh Kencing)', 'Nefrolitiasis (Batu Ginjal)', 'Antihipertensi'],
    indikasiFOHAI: 'Membantu meluruhkan batu ginjal dan saluran kemih, serta melancarkan buang air kecil.',
    ciriMakroskopis: 'Remahan daun rapuh berkerut, warna hijau kecokelatan gelap, bau aromatis lemah, rasa agak pahit dan asin.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Sinensetin', cid: 145659, smiles: 'COC1=CC(=C2C(=C1)OC(=CC2=O)C3=CC(=C(C=C3)OC)OC)OC', rumus: 'C20H20O7', beratMolekul: 372.37, peran: 'Flavonoid Polimetoksi Marka FHI' },
      { nama: 'Eupatorin', cid: 97214, smiles: 'COC1=CC(=C2C(=C1)OC(=CC2=O)C3=CC(=C(C=C3)O)OC)O', rumus: 'C18H16O7', beratMolekul: 344.32, peran: 'Flavonoid Diuretik Aktif' }
    ]
  },
  59: { // Kunyit
    indikasiKlinis: ['Antiinflamasi Kuat', 'Dispepsia & Maag', 'Hepatoprotektor', 'Antioksidan'],
    indikasiFOHAI: 'Meredakan keluhan maag, kembung, nyeri osteoartritis, dan memperbaiki enzim fungsi hati.',
    ciriMakroskopis: 'Potongan rimpang melintang jingga kemerahan terang, berkerut dengan garis melingkar, aroma aromatis tajam khas kurkuminoid, rasa agak pedas getir.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1615485290176-57cb591bfbfa?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Curcumin', cid: 969516, smiles: 'COC1=C(C=CC(=C1)C=CC(=O)CC(=O)C=CC2=CC(=C(C=C2)O)OC)O', rumus: 'C21H20O6', beratMolekul: 368.38, peran: 'Senyawa Marka Utama FHI (Kurkuminoid)' },
      { nama: 'Demethoxycurcumin', cid: 5469424, smiles: 'COC1=C(C=CC(=C1)C=CC(=O)CC(=O)C=CC2=CC=C(C=C2)O)O', rumus: 'C20H18O5', beratMolekul: 338.35, peran: 'Kurkuminoid Bioaktif Pendamping' }
    ]
  },
  68: { // Mengkudu
    indikasiKlinis: ['Antihipertensi (Vasodilatasi)', 'Antidiabetes', 'Imunomodulator'],
    indikasiFOHAI: 'Membantu menurunkan tekanan darah sistolik dan diastolik, serta menurunkan gula darah puasa.',
    ciriMakroskopis: 'Irisan buah kering permukaan berbenjol tidak beraturan, warna cokelat kelabu kehitaman, bau busuk asam khas asam kaproat, rasa asam getir.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Scopoletin', cid: 5280460, smiles: 'COC1=C(C=C2C(=C1)C=CC(=O)O2)O', rumus: 'C10H8O4', beratMolekul: 192.17, peran: 'Kumarin Hipotensif Marka FHI' },
      { nama: 'Ursolic acid', cid: 64945, smiles: 'CC1CCC2(CCC3(C(=CCC4C3(CCC5C4(CCC(C5(C)C)O)C)C)C2C1C)C)C(=O)O', rumus: 'C30H48O3', beratMolekul: 456.7, peran: 'Asam Triterpenoid Sitoprotektif' }
    ]
  },
  69: { // Meniran
    indikasiKlinis: ['Imunomodulator (Infeksi Viral/Bakteri)', 'Hepatoprotektor (Hepatitis B)', 'Urolitiasis'],
    indikasiFOHAI: 'Meningkatkan sistem imun seluler fagositosis dan membantu terapi ajuvan hepatitis.',
    ciriMakroskopis: 'Herba kecil bercabang, daun majemuk menyirip berseling kecil, buah bulat di ketiak daun, rasa pahit dingin.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Phyllanthin', cid: 119427, smiles: 'COC1=CC(=C(C(=C1)OC)CC(CC2=CC(=C(C(=C2)OC)OC)OC)CO)OC', rumus: 'C24H34O6', beratMolekul: 418.52, peran: 'Lignan Marka FHI Hepatoprotektor' },
      { nama: 'Corilagin', cid: 73568, smiles: 'C1C2C(C(C(O1)OC(=O)C3=CC(=C(C(=C3)O)O)O)OC(=O)C4=CC(=C(C(=C4)O)O)O)OC(=O)C5=CC(=C(C(=C5)O)O)O', rumus: 'C27H22O18', beratMolekul: 634.45, peran: 'Tanin Imunostimulan' }
    ]
  },
  77: { // Pegagan
    indikasiKlinis: ['Nootropik (Kognitif & Memori)', 'Penyembuh Luka (Epitelisasi)', 'Ansiolitik'],
    indikasiFOHAI: 'Membantu memperbaiki sirkulasi mikrovaskular serebral dan mempercepat sintesis kolagen kulit.',
    ciriMakroskopis: 'Helaian daun berbentuk ginjal dengan tepi bergerigi tumpul, tangkai daun bergaris, warna hijau abu-abu, rasa manis sejuk lalu agak pahit.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Asiaticoside', cid: 108062, smiles: 'CC1CCC2(CCC3(C(=CCC4C3(CCC5C4(CCC(C5(C)C)O)C)C)C2C1C)C)C(=O)OC6C(C(C(C(O6)CO)O)OC7C(C(C(CO7)O)O)O)O', rumus: 'C48H78O19', beratMolekul: 959.1, peran: 'Triterpenoid Saponin Marka FHI' },
      { nama: 'Asiatic acid', cid: 119034, smiles: 'CC1CCC2(CCC3(C(=CCC4C3(CCC5C4(CCC(C5(C)CO)O)C)C)C2C1C)C)C(=O)O', rumus: 'C30H48O5', beratMolekul: 488.7, peran: 'Agikon Nootropik & Neuroprotektif' }
    ]
  },
  85: { // Sambiloto
    indikasiKlinis: ['Antidiabetes (Sensitizer Insulin)', 'Antipiretik (Demam)', 'Antiinflamasi', 'Imunomodulator'],
    indikasiFOHAI: 'Menurunkan kadar gula darah pada Diabetes Melitus Tipe 2 dan meredakan demam/radang saluran napas.',
    ciriMakroskopis: 'Batang segi empat berusuk, daun berhadapan lanset berkerut, warna hijau tua kecokelatan, rasa sangat pahit menusuk lidah.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Andrographolide', cid: 5318517, smiles: 'CC12CCC(C(=C)C1CCC(=C)C2O)C3=CC(=O)OC3', rumus: 'C20H30O5', beratMolekul: 350.45, peran: 'Diterpen Lakton Marka FHI Paling Pahit' },
      { nama: 'Neoandrographolide', cid: 9848024, smiles: 'CC12CCC(C(=C)C1CCC(=C)C2O)C3=CC(=O)OC3', rumus: 'C26H40O8', beratMolekul: 480.6, peran: 'Diterpenoid Glikosida Antivirus' }
    ]
  },
  90: { // Secang
    indikasiKlinis: ['Antimikroba', 'Antioksidan Kuat', 'Antidiabetes', 'Antiinflamasi'],
    indikasiFOHAI: 'Meningkatkan daya tahan tubuh, meredakan diare infeksi, dan memperbaiki peredaran darah perifer.',
    ciriMakroskopis: 'Serutan kayu keras kaku berbentuk lembaran tipis melengkung, warna merah jingga cerah, bila diseduh menghasilkan cairan merah jernih, rasa tawar sepet.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Brazilin', cid: 73384, smiles: 'C1C2=C(C=C(C=C2)O)OCC3(C1CC4=CC(=C(C=C34)O)O)O', rumus: 'C16H14O5', beratMolekul: 286.28, peran: 'Homoisoflavonoid Pigmen Merah Marka FHI' },
      { nama: 'Brazilein', cid: 9814757, smiles: 'C1C2=C(C=C(C=C2)O)OCC3(C1CC(=O)C4=CC(=C(C=C34)O)O)O', rumus: 'C16H12O5', beratMolekul: 284.26, peran: 'Bentuk Teroksidasi Antioksidan' }
    ]
  },
  92: { // Seledri
    indikasiKlinis: ['Antihipertensi (Vasodilatasi)', 'Diuretik', 'Penurun Asam Urat (Gout)'],
    indikasiFOHAI: 'Menurunkan tekanan darah esensial dan meningkatkan ekskresi asam urat urine.',
    ciriMakroskopis: 'Potongan daun bercuping rapuh dengan tangkai berusuk membujur, warna hijau zaitun, bau aromatis khas seledri, rasa asin pedas lemah.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Apigenin', cid: 5280443, smiles: 'C1=CC(=CC=C1C2=CC(=O)C3=C(C=C(C=C3O2)O)O)O', rumus: 'C15H10O5', beratMolekul: 270.24, peran: 'Flavonoid Marka FHI Antihipertensi' },
      { nama: '3-n-Butylphthalide', cid: 65243, smiles: 'CCCCC1C2=CC=CC=C2C(=O)O1', rumus: 'C12H14O2', beratMolekul: 190.24, peran: 'Ftalida Vasodilator Endotel' }
    ]
  },
  101: { // Sirih
    indikasiKlinis: ['Antiseptik / Antibakteri Topikal', 'Antijamur (Kandidiasis)', 'Adstringen Mukosa'],
    indikasiFOHAI: 'Mengatasi keputihan patologis, luka mukosa mulut (sariawan), dan bau mulut.',
    ciriMakroskopis: 'Helaian daun berbentuk jantung melebar, ujung runcing, pertulangan daun melengkung menonjol di bawah, warna hijau tua kusam, aroma pedas khas aromatis.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Eugenol', cid: 3314, smiles: 'CC=CC1=CC(=C(C=C1)O)OC', rumus: 'C10H12O2', beratMolekul: 164.2, peran: 'Fenilpropanoid Antiseptik Marka FHI' },
      { nama: 'Chavicol', cid: 10793, smiles: 'C=CCC1=CC=C(C=C1)O', rumus: 'C9H10O', beratMolekul: 134.18, peran: 'Fenol Bakterisidal Kuat' }
    ]
  },
  114: { // Temu Kunci
    indikasiKlinis: ['Antimikroba (Gingivitis)', 'Antiinflamasi', 'Gastroprotektif'],
    indikasiFOHAI: 'Membantu mengatasi radang gusi, infeksi rongga mulut, dan gangguan kembung.',
    ciriMakroskopis: 'Rimpang memanjang silindris meruncing bergerombol seperti anak kunci, warna cokelat muda pucat, bau segar spesifik mirip kapulaga, rasa agak pedas sejuk.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Panduratin A', cid: 10429282, smiles: 'CC1=CC(=CC=C1)C2C=CC(C3C2C(=O)C4=C(C=C(C=C4O3)O)O)C5=CC=CC=C5', rumus: 'C26H24O4', beratMolekul: 400.5, peran: 'Kalkon Sikloheksenil Marka FHI' },
      { nama: 'Pinostrobin', cid: 73201, smiles: 'COC1=CC(=C2C(=C1)OC(CC2=O)C3=CC=CC=C3)O', rumus: 'C16H14O4', beratMolekul: 270.28, peran: 'Flavanon Antibakteri' }
    ]
  },
  117: { // Temulawak
    indikasiKlinis: ['Hepatoprotektor (Peningkat Enzim Empedu)', 'Peningkat Nafsu Makan', 'Antiinflamasi Dispepsia'],
    indikasiFOHAI: 'Memelihara kesehatan fungsi organ hati (hepatoprotektor) dan memperbaiki sekresi empedu serta dispepsia.',
    ciriMakroskopis: 'Kepingan rimpang pipih bundar kuning kecokelatan hingga oranye gelap, serat cincin kambium jelas di tengah, aroma aromatis khas xanthorrhizol, rasa pahit pedas.',
    fotoTanamanSegar: 'https://images.unsplash.com/photo-1615485290176-57cb591bfbfa?w=800&auto=format&fit=crop&q=80',
    fotoSimplisiaMakroskopis: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    senyawaAktif: [
      { nama: 'Xanthorrhizol', cid: 108134, smiles: 'CC1=CC(=C(C=C1)C(C)CCCC(=C)C)O', rumus: 'C15H22O', beratMolekul: 218.33, peran: 'Seskuiterpenoid Marka Spesifik FHI Temulawak' },
      { nama: 'Curcumin', cid: 969516, smiles: 'COC1=C(C=CC(=C1)C=CC(=O)CC(=O)C=CC2=CC(=C(C=C2)O)OC)O', rumus: 'C21H20O6', beratMolekul: 368.38, peran: 'Kurkuminoid Koleretik & Hepatoprotektif' }
    ]
  }
};
