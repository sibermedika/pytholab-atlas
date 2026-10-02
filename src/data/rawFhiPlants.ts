export interface RawFhiEntry {
  no: number;
  namaLokal: string;
  namaLatin: string;
  famili: string;
  bagian: string;
  sumber: string;
}

export const RAW_FHI_CSV = `No.,Nama Tanaman / Simplisia,Nama Latin Tumbuhan (Spesies),Suku (Famili),Bagian yang Digunakan,Sumber Monografi
1,Adas,Foeniculum vulgare Mill.,Apiaceae,Buah,FHI Edisi II
2,Afrika,Vernonia amygdalina Delile,Asteraceae,Daun,FHI Edisi II
3,Akar Kucing,Acalypha indica L.,Euphorbiaceae,Akar,FHI Edisi II
4,Akar Wangi,Vetiveria zizanioides (L.) Nash,Poaceae,Akar,FHI Edisi II
5,Angsana,Pterocarpus indicus Willd.,Fabaceae,Kulit Batang,Suplemen II FHI
6,Anyang-Anyang,Elaeocarpus grandiflorus Sm.,Elaeocarpaceae,Buah,FHI Edisi II
7,Asam,Tamarindus indica L.,Leguminosae,Daun,FHI Edisi II
8,Bandotan,Ageratum conyzoides (L.) L.,Compositae,Herba,FHI Edisi II
9,Bangun-Bangun,Coleus amboinicus Lour.,Lamiaceae,Daun,Suplemen II FHI
10,Bawang Putih,Allium sativum L.,Liliaceae / Amaryllidaceae,Umbi Lapis,FHI Edisi II
11,Bayam Duri,Amaranthus spinosus L.,Amaranthaceae,Daun,FHI Edisi II
12,Beluntas,Pluchea indica (L.) Less.,Asteraceae,Daun,FHI Edisi II
13,Benalu,Scurrula atropurpurea (Bl.) Danser,Loranthaceae,Herba,FHI Edisi II
14,Bengle,Zingiber montanum (J.Koenig) Link ex A.Dietr.,Zingiberaceae,Rimpang,FHI Edisi II
15,Binahong,Anredera cordifolia (Ten.) Steenis,Basellaceae,Daun,FHI Edisi II
16,Bungur,Lagerstroemia speciosa (L.) Pers.,Lythraceae,Daun,FHI Edisi II
17,Ceplukan,Physalis minima L.,Solanaceae,Herba,FHI Edisi II
18,Ceremai,Phyllanthus acidus (L.) Skeels,Euphorbiaceae,Daun,FHI Edisi II
19,Daruju,Acanthus ilicifolius L.,Acanthaceae,Daun,FHI Edisi II
20,Dewa,Gynura pseudochina (L.) DC.,Asteraceae,Daun,FHI Edisi II
21,Ekaliptus,Eucalyptus globulus Labill.,Myrtaceae,Daun,FHI Edisi II
22,Gambir,Uncaria gambir (Hunter) Roxb.,Rubiaceae,Ekstrak Daun,FHI Edisi II
23,Gandapura,Gaultheria fragrantissima Auct. non Wall.,Ericaceae,Daun,FHI Edisi II
24,Gringsingan,Hyptis suaveolens (L.) Poit.,Lamiaceae,Daun,FHI Edisi II
25,Jagung,Zea mays L.,Poaceae,Rambut (Tangkai Putik),FHI Edisi II
26,Jahe Merah,Zingiber officinale Rosc. var. rubrum,Zingiberaceae,Rimpang,FHI Edisi II
27,Jamblang,Syzygium cumini (L.) Skeels,Myrtaceae,Kulit Batang / Biji,FHI Edisi II / Sup. II
28,Jambu Biji,Psidium guajava L.,Myrtaceae,Daun,FHI Edisi II
29,Jambu Mete,Anacardium occidentale L.,Anacardiaceae,Daun,FHI Edisi II
30,Jarak Kaliki,Ricinus communis L.,Euphorbiaceae,Daun,Suplemen II FHI
31,Jati Blanda,Guazuma ulmifolia Lam.,Malvaceae,Daun,FHI Edisi II
32,Johar,Senna siamea (Lam.) H.S.Irwin & Barneby,Leguminosae,Daun,FHI Edisi II
33,Kapulaga,Amomum compactum Sol. ex Maton,Zingiberaceae,Buah,FHI Edisi II
34,Katuk,Sauropus androgynus (L.) Merr.,Euphorbiaceae,Daun,FHI Edisi II
35,Kayu Kuning,Arcangelisia flava (L.) Merr.,Menispermaceae,Batang,FHI Edisi II
36,Kayu Putih,Melaleuca leucadendra (L.) L.,Myrtaceae,Buah / Daun,FHI Edisi II
37,Kayu Rapat,Parameria laevigata (Juss.) Moldenke,Apocynaceae,Kulit Batang,FHI Edisi II
38,Kecombrang,Nicolaia speciosa (Bl.) Horan / Etlingera elatior,Zingiberaceae,Bunga,FHI Edisi II / Sup. II
39,Kejibeling,Sericocalyx crispus (L.) Bremek,Acanthaceae,Daun,FHI Edisi II
40,Kelembak,Rheum officinale Baill.,Polygonaceae,Akar,FHI Edisi II
41,Kelor,Moringa oleifera Lam.,Moringaceae,Daun,FHI Edisi II
42,Kemangi,Ocimum basilicum L. forma citratum Back.,Lamiaceae,Daun,FHI Edisi II
43,Kembang Pukul Empat,Mirabilis jalapa L.,Nyctaginaceae,Daun,Suplemen II FHI
44,Kemiri,Aleurites moluccana (L.) Willd.,Euphorbiaceae,Biji,Suplemen II FHI
45,Kemukus,Piper cubeba L.f.,Piperaceae,Buah,FHI Edisi II
46,Kemuning,Murraya paniculata (L.) Jack,Rutaceae,Daun,FHI Edisi II
47,Kencur,Kaempferia galanga L.,Zingiberaceae,Rimpang,FHI Edisi II
48,Kenikir,Cosmos caudatus Kunth,Asteraceae,Daun,FHI Edisi II
49,Kepel,Stelechocarpus burahol (Blume.) Hook. f. & Thomson,Annonaceae,Daun,FHI Edisi II
50,Kesumba,Carthamus tinctorius L.,Asteraceae,Bunga,FHI Edisi II
51,Ketapang,Terminalia catappa L.,Combretaceae,Daun,Suplemen II FHI
52,Kirinyuh,Chromolaena odorata (L.) R.M.King & H.Rob,Compositae,Daun,FHI Edisi II
53,Kol Banda,Pisonia alba Span.,Nyctaginaceae,Daun,Suplemen II FHI
54,Krangean,Litsea cubeba (Lour.) Pers.,Lauraceae,Kulit Batang,FHI Edisi II
55,Krisan,Chrysanthemum morifolium Ramatuelle,Asteraceae / Compositae,Bunga,FHI Edisi II / Sup. II
56,Kucai,Allium schoenoprasum L.,Liliaceae,Umbi Lapis,FHI Edisi II
57,Kumis Kucing,Orthosiphon stamineus Benth.,Lamiaceae,Daun,FHI Edisi II
58,Kunci Pepet,Kaempferia angustifolia Roscoe,Zingiberaceae,Rimpang,FHI Edisi II
59,Kunyit,Curcuma longa L.,Zingiberaceae,Rimpang,FHI Edisi II
60,Lampes,Ocimum sanctum L.,Lamiaceae,Daun,FHI Edisi II
61,Legundi,Vitex trifolia L.,Verbenaceae,Daun,FHI Edisi II
62,Lempuyang Gajah,Zingiber zerumbet (L.) Roscoe ex Sm.,Zingiberaceae,Rimpang,FHI Edisi II
63,Lempuyang Wangi,Zingiber aromaticum Val.,Zingiberaceae,Rimpang,FHI Edisi II
64,Lengkuas,Alpinia galanga (L.) Willd.,Zingiberaceae,Rimpang,FHI Edisi II
65,Lidah Buaya,Aloe vera (L.) Burm.f.,Xanthorrhoeaceae,Daun Segar,FHI Edisi II
66,Makasar,Brucea javanica (L.) Merr.,Simaroubaceae,Buah,Suplemen II FHI
67,Melati,Jasminum sambac L.,Oleaceae,Bunga,Suplemen II FHI
68,Mengkudu,Morinda citrifolia L.,Rubiaceae,Buah,FHI Edisi II
69,Meniran,Phyllanthus niruri L.,Euphorbiaceae,Herba,FHI Edisi II
70,Mindi,Melia azedarach L.,Meliaceae,Daun,Suplemen II FHI
71,Murbei,Morus alba L.,Moraceae,Daun,FHI Edisi II
72,Paliasa,Kleinhovia hospita L.,Malvaceae,Daun,FHI Edisi II
73,Paria,Momordica charantia L.,Cucurbitaceae,Daging Buah,FHI Edisi II
74,Patikan Cina,Euphorbia prostrata Aiton,Euphorbiaceae,Herba,FHI Edisi II
75,Patikan Kebo,Euphorbia hirta L.,Euphorbiaceae,Herba,FHI Edisi II
76,Pecut Kuda,Stachytarpheta jamaicensis (L.) Vahl,Verbenaceae,Daun,Suplemen II FHI
77,Pegagan,Centella asiatica (L.) Urb.,Apiaceae / Umbelliferae,Herba,FHI Edisi II
78,Pisang Batu,Musa balbisiana Colla,Musaceae,Buah / Bonggol,FHI Edisi II / Sup. II
79,Pulasari,Alyxia reinwardtii Blume,Apocynaceae,Kulit Batang,FHI Edisi II
80,Pule,Alstonia scholaris (L.) R. Br.,Apocynaceae,Kulit Batang/Ranting,FHI Edisi II
81,Putri Malu,Mimosa pudica L.,Fabaceae,Daun,Suplemen II FHI
82,Rosela,Hibiscus sabdariffa L.,Malvaceae,Perhiasan Bunga,FHI Edisi II
83,Rumput Mutiara,Oldenlandia corymbosa L.,Rubiaceae,Herba,FHI Edisi II
84,Salam,Syzygium polyanthum (Wight) Walp.,Myrtaceae,Daun,FHI Edisi II
85,Sambiloto,Andrographis paniculata (Burm.f.) Nees,Acanthaceae,Herba,FHI Edisi II
86,Sambung Nyawa,Gynura procumbens (Lour) Merr.,Compositae,Daun,FHI Edisi II
87,Sangketan,Achyranthes aspera L.,Amaranthaceae,Akar / Daun,Suplemen II FHI
88,Sanrego,Lunasia amara Blanco,Rutaceae,Daun / Kayu,FHI Edisi II
89,Sawi Langit,Cyanthillium cinereum (L.) H.Rob.,Compositae,Daun,FHI Edisi II
90,Secang,Caesalpinia sappan L.,Fabaceae,Potongan Kayu,FHI Edisi II
91,Selasih,Ocimum basilicum L. forma violaceum Back.,Lamiaceae,Daun,FHI Edisi II
92,Seledri,Apium graveolens L.,Apiaceae,Daun,FHI Edisi II
93,Sembung,Blumea balsamifera (L.) DC.,Asteraceae,Daun,FHI Edisi II
94,Sendok,Plantago major L.,Plantaginaceae,Daun,FHI Edisi II
95,Senggugu,Clerodendrum serratum (L.) Moon,Verbenaceae,Daun,FHI Edisi II
96,Sengitan,Sambucus javanica Reinw. ex Bl.,Caprifoliaceae,Daun,FHI Edisi II
97,Seprantu,Sindora sumatrana Miq.,Fabaceae,Buah,FHI Edisi II
98,Sereh Dapur,Cymbopogon citratus (DC. ex Nees) Stapf,Poaceae,Batang & Pelepah,Suplemen II FHI
99,Sidaguri,Sida rhombifolia L.,Malvaceae,Herba,FHI Edisi II
100,Sidowayah,Woodfordia fruticosa (L.) Kurz,Lythraceae,Bunga,FHI Edisi II
101,Sirih,Piper betle L.,Piperaceae,Daun,FHI Edisi II
102,Sirih Merah,Piper crocatum Ruiz & Pav.,Piperaceae,Daun,FHI Edisi II
103,Sirsak,Annona muricata L.,Annonaceae,Daun,FHI Edisi II
104,Suji,Dracaena angustifolia Roxb.,Asparagaceae,Daun,Suplemen II FHI
105,Sukun,Artocarpus altilis (Parkinson ex F.A.Zorn) Fosberg,Moraceae,Daun,FHI Edisi II
106,Suren,Toona sureni (Blume) Merr.,Meliaceae,Kulit Batang,Suplemen II FHI
107,Suruhan,Peperomia pellucida (L.) Kunth,Piperaceae,Herba,FHI Edisi II
108,Tapak Liman,Elephantopus scaber L.,Asteraceae,Daun,FHI Edisi II
109,Teki,Cyperus rotundus L.,Cyperaceae,Rimpang,FHI Edisi II
110,Tekokak,Solanum torvum Sw.,Solanaceae,Buah,Suplemen II FHI
111,Tempuyung,Sonchus arvensis L.,Asteraceae,Daun,FHI Edisi II
112,Temu Giring,Curcuma heyneana Valeton & Zijp,Zingiberaceae,Rimpang,FHI Edisi II
113,Temu Ireng,Curcuma aeruginosa Roxb.,Zingiberaceae,Rimpang,FHI Edisi II
114,Temu Kunci,Boesenbergia pandurata (Roxb.) Schlecht.,Zingiberaceae,Rimpang,FHI Edisi II
115,Temu Mangga,Curcuma mangga Valeton & Zijp,Zingiberaceae,Rimpang,FHI Edisi II
116,Temu Putih,Curcuma zedoaria (Christm.) Roscoe,Zingiberaceae,Rimpang,FHI Edisi II
117,Temulawak,Curcuma xanthorrhiza Roxb.,Zingiberaceae,Rimpang,FHI Edisi II
118,Timi,Thymus vulgaris L.,Lamiaceae,Herba,Suplemen II FHI
119,Wungu,Graptophyllum pictum (L.) Griff.,Acanthaceae,Daun,FHI Edisi II`;

export function parseRawFhiCsv(): RawFhiEntry[] {
  const lines = RAW_FHI_CSV.trim().split('\n');
  const entries: RawFhiEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple robust comma separation
    const parts = line.split(',');
    if (parts.length >= 6) {
      entries.push({
        no: parseInt(parts[0], 10),
        namaLokal: parts[1].trim(),
        namaLatin: parts[2].trim(),
        famili: parts[3].trim(),
        bagian: parts[4].trim(),
        sumber: parts.slice(5).join(',').trim(),
      });
    }
  }

  return entries;
}
