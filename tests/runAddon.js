const rdkit = require("bindings")("node-rdkit");
const fs = require('fs');
const test_molblock = `
  CWRITER303141916052D
Created with ChemWriter - http://chemwriter.com
  5  5  0  0  0  0  0  0  0  0999 V2000
   61.2829  -31.8055    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   70.4184  -35.8728    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   77.1097  -28.4414    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   72.1097  -19.7811    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   62.3282  -21.8602    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0
  2  3  1  0  0  0
  3  4  1  0  0  0
  4  5  1  0  0  0
  5  1  1  0  0  0
M  END`;

const test_molblock2 = `
  CWRITER303141916072D
Created with ChemWriter - http://chemwriter.com
 15 15  0  0  0  0  0  0  0  0999 V2000
   61.2829  -31.8055    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   70.4184  -35.8728    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   77.1097  -28.4414    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   72.1097  -19.7811    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   62.3282  -21.8602    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   52.6227  -36.8055    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   52.8962  -26.3591    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   72.4975  -45.6543    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   62.6469  -42.1660    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   87.0549  -29.4867    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   80.6934  -37.7772    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   76.1771  -10.6457    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   65.8165  -12.0097    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   54.8968  -15.1689    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   64.9164  -12.2010    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0
  2  3  1  0  0  0
  3  4  1  0  0  0
  4  5  1  0  0  0
  5  1  1  0  0  0
  1  6  1  0  0  0
  1  7  1  0  0  0
  2  8  1  0  0  0
  2  9  1  0  0  0
  3 10  1  0  0  0
  3 11  1  0  0  0
  4 12  1  0  0  0
  4 13  1  0  0  0
  5 14  1  0  0  0
  5 15  1  0  0  0
M  END`;

const empty_mol_block = `
     CWRITER311161812292D

  0  0  0  0  0  0  0  0  0  0999 V2000
M  END`;

const molecules = {
  '10836': { smiles:'C[C@@H](CC1=CC=CC=C1)NC', name:'methyl-[(1~{S})-1-methyl-2-phenyl-ethyl]amine' },
  '11147261': { smiles:'CC1=CC(=C(C(=C1)C)N2CCN(C2=[Ru](=CC3=CC=CC=C3)(Cl)Cl)C4=C(C=C(C=C4C)C)C)C.C1CCC(CC1)P(C2CCCCC2)C3CCCCC3', name:'benzal-dichloro-(1,3-dimesitylimidazolidin-2-ylidene)ruthenium;tricyclohexylphosphine' },
  '1140': { smiles:'CC1=CC=CC=C1', name:'toluene' },
  '11515494': { smiles:'CC1=CC=C(C=C1)N2C[C@@]3(C(=O)[C@H]4[C@@H](CO3)OC(O4)(C)C)OC2=O', name:'(3~{a}~{R},6~{S},7~{a}~{R})-2,2-dimethyl-3\'-(p-tolyl)spiro[4,7~{a}-dihydro-3~{a}~{H}-[1,3]dioxolo[4,5-c]pyran-6,5\'-oxazolidine]-2\',7-quinone' },
  '11762': { smiles:'C1=CC=C2C(=C1)C=CC(=C2C3=C(C=CC4=CC=CC=C43)O)O', name:'1-(2-hydroxy-1-naphthyl)-2-naphthol' },
  '11763533': { smiles:'CC1=CC(=C(C(=C1)C)N2CCN(C2=[Ru](=CC3=CC=CC=C3OC(C)C)(Cl)Cl)C4=C(C=C(C=C4C)C)C)C', name:'dichloro-(1,3-dimesitylimidazolidin-2-ylidene)-(2-isopropoxybenzylidene)ruthenium' },
  '11982471': { smiles:'C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.[Cu].[Cu].[Cu].[Cu].[Cu].[Cu]', name:'copper;triphenylphosphine' },
  '123596': { smiles:'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5.CS(=O)(=O)O', name:'mesylic' },
  '124886': { smiles:'C(CC(=O)N[C@@H](CS)C(=O)NCC(=O)O)[C@@H](C(=O)O)N', name:'(2~{S})-2-amino-5-[[(1~{R})-2-(carboxymethylamino)-2-keto-1-(mercaptomethyl)ethyl]amino]-5-keto-valeric' },
  '131710810': { smiles:'CC(=O)[O-].CC(=O)[O-].[Pd].[Pd].[Pb+2]', name:'plumbous;palladium;diacetate' },
  '14284': { smiles:'CN(C)C1=CC=NC=C1', name:'dimethyl(4-pyridyl)amine' },
  '18730': { smiles:'C1=CC2=C(C=C1N=C=S)C(=O)OC23C4=C(C=C(C=C4)O)OC5=C3C=CC(=C5)O', name:'3\',6\'-dihydroxy-6-isothiocyanato-spiro[phthalan-3,9\'-xanthene]-1-one' },
  '190': { smiles:'C1=NC2=C(N1)C(=NC=N2)N', name:'7~{H}-adenine' },
  '21157': { smiles:'CCCCS(=N)(=O)CCC(C(=O)O)N', name:'2-amino-4-(butylsulfonimidoyl)butyric' },
  '2244': { smiles:'CC(=O)OC1=CC=CC=C1C(=O)O', name:'2-acetoxybenzoic' },
  '2294': { smiles:'CCC1(C(=O)NC(=O)NC1=O)CC', name:'barbital' },
  '24247': { smiles:'OCl(=O)(=O)=O', name:'perchloric' },
  '2723939': { smiles:'CCN=C=NCCCN(C)C.Cl', name:'??' },
  '2724699': { smiles:'C1CCN(C1)[P+](N2CCCC2)(N3CCCC3)ON4C5=CC=CC=C5N=N4.F[P-](F)(F)(F)(F)F', name:'benzotriazol-1-yloxy(tripyrrolidino)phosphonium;hexafluorophosphate' },
  '2802': { smiles:'C1C(=O)NC2=C(C=C(C=C2)[N+](=O)[O-])C(=N1)C3=CC=CC=C3Cl', name:'5-(2-chlorophenyl)-7-nitro-1,3-dihydro-1,4-benzodiazepin-2-one' },
  '3034034': { smiles:'COC1=CC2=C(C=CN=C2C=C1)[C@H]([C@@H]3C[C@@H]4CCN3C[C@@H]4C=C)O', name:'(~{R})-(6-methoxy-4-quinolyl)-[(2~{S},4~{S},5~{R})-5-vinylquinuclidin-2-yl]methanol' },
  '31404': { smiles:'CC1=CC(=C(C(=C1)C(C)(C)C)O)C(C)(C)C', name:'2,6-di~{tert}-butyl-4-methyl-phenol' },
  '31703': { smiles:'C[C@H]1[C@H]([C@H](C[C@@H](O1)O[C@H]2C[C@@](CC3=C(C4=C(C(=C23)O)C(=O)C5=C(C4=O)C=CC=C5OC)O)(C(=O)CO)O)N)O', name:'(7~{S},9~{S})-7-[(2~{R},4~{S},5~{S},6~{S})-4-amino-5-hydroxy-6-methyl-tetrahydropyran-2-yl]oxy-9-glycoloyl-6,9,11-trihydroxy-4-methoxy-8,10-dihydro-7~{H}-tetracene-5,12-quinone' },
  '36314': { smiles:'CC1=C2[C@H](C(=O)[C@@]3([C@H](C[C@@H]4[C@]([C@H]3[C@@H]([C@@](C2(C)C)(C[C@@H]1OC(=O)[C@@H]([C@H](C5=CC=CC=C5)NC(=O)C6=CC=CC=C6)O)O)OC(=O)C7=CC=CC=C7)(CO4)OC(=O)C)O)C)OC(=O)C', name:'benzoic' },
  '3672': { smiles:'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', name:'2-(4-isobutylphenyl)propionic' },
  '44141878': { smiles:'CC(=O)O.CC(=O)O.C1=CC=C(C=C1)S(=O)CCS(=O)C2=CC=CC=C2.[Pd]', name:'acetic' },
  '44190959': { smiles:'C[C@H]1C(=O)N([C@@H](N1)C(C)(C)C)C', name:'(2~{R},5~{S})-2-~{tert}-butyl-3,5-dimethyl-4-imidazolidinone' },
  '444899': { smiles:'CCCCC/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCC(=O)O', name:'(5~{Z},8~{Z},11~{Z},14~{Z})-eicosa-5,8,11,14-tetraenoic' },
  '445643': { smiles:'C[C@@H]1C[C@@H]([C@@H]2[C@H](C[C@H]([C@@](O2)(C(=O)C(=O)N3CCCC[C@H]3C(=O)O[C@@H]([C@@H]([C@H](CC(=O)[C@@H](/C=C(/C1)\\C)CC=C)O)C)/C(=C/[C@@H]4CC[C@H]([C@@H](C4)OC)O)/C)O)C)OC)OC', name:'(1~{R},9~{S},12~{S},13~{R},14~{S},17~{R},18~{E},21~{S},23~{S},24~{R},25~{S},27~{R})-17-allyl-1,14-dihydroxy-12-[(~{E})-2-[(1~{R},3~{R},4~{R})-4-hydroxy-3-methoxy-cyclohexyl]-1-methyl-vinyl]-23,25-dimethoxy-13,19,21,27-tetramethyl-11,28-dioxa-4-azatricyclo[22.3.1.0^{4,9}]octacos-18-ene-2,3,10,16-diquinone' },
  '446094': { smiles:'C([C@H]([C@@H](CS)O)O)S', name:'(2~{S},3~{S})-1,4-dimercaptobutane-2,3-diol' },
  '446220': { smiles:'CN1[C@H]2CC[C@@H]1[C@H]([C@H](C2)OC(=O)C3=CC=CC=C3)C(=O)OC', name:'(1~{R},2~{R},3~{S},5~{S})-3-benzoyloxy-8-methyl-8-azabicyclo[3.2.1]octane-2-carboxylic' },
  '46846327': { smiles:'C1=CC=NC=C1.O=[Cr](=O)=O.Cl', name:'pyridine;triketochromium;hydrochloride' },
  '5284371': { smiles:'CN1CC[C@]23[C@@H]4[C@H]1CC5=C2C(=C(C=C5)OC)O[C@H]3[C@H](C=C4)O', name:'(4~{R},4~{a}~{R},7~{S},7~{a}~{R},12~{b}~{S})-9-methoxy-3-methyl-2,4,4~{a},7,7~{a},13-hexahydro-1~{H}-4,12-methanobenzofuro[3,2-e]isoquinolin-7-ol' },
  '5318432': { smiles:'C1=CC=C2C(=C1)C(=O)/C(=C\\3/C(=O)C4=CC=CC=C4N3)/N2', name:'(2~{E})-2-(3-ketoindolin-2-ylidene)pseudoindoxyl' },
  '5360373': { smiles:'CC1=C(N=C(N=C1N)[C@H](CC(=O)N)NC[C@@H](C(=O)N)N)C(=O)N[C@@H]([C@H](C2=CN=CN2)OC3C(C(C(C(O3)CO)O)O)OC4C(C(C(C(O4)CO)O)OC(=O)N)O)C(=O)N[C@H](C)[C@H]([C@H](C)C(=O)N[C@@H]([C@@H](C)O)C(=O)NCCC5=NC(=CS5)C6=NC(=CS6)C(=O)NCCC[S+](C)C)O', name:'3-[[2-[2-[2-[[(2~{S},3~{R})-2-[[(2~{S},3~{S},4~{R})-4-[[(2~{S},3~{R})-2-[[6-amino-2-[(1~{S})-3-amino-1-[[(2~{S})-2,3-diamino-3-keto-propyl]amino]-3-keto-propyl]-5-methyl-pyrimidine-4-carbonyl]amino]-3-[3-(4-carbamoyloxy-3,5-dihydroxy-6-methylol-tetrahydropyran-2-yl)oxy-4,5-dihydroxy-6-methylol-tetrahydropyran-2-yl]oxy-3-(1~{H}-imidazol-5-yl)propanoyl]amino]-3-hydroxy-2-methyl-pentanoyl]amino]-3-hydroxy-butanoyl]amino]ethyl]thiazol-4-yl]thiazole-4-carbonyl]amino]propyl-dimethyl-sulfonium' },
  '5426': { smiles:'C1CC(=O)NC(=O)C1N2C(=O)C3=CC=CC=C3C2=O', name:'thalidomide' },
  '54670067': { smiles:'C([C@@H]([C@@H]1C(=C(C(=O)O1)O)O)O)O', name:'(2~{R})-2-[(1~{S})-1,2-dihydroxyethyl]-3,4-dihydroxy-2~{H}-furan-5-one' },
  '5484207': { smiles:'C1[C@@H](N/C(=C\\2/N=C3C=CC(=O)C=C3S2)/S1)C(=O)O', name:'(2~{E},4~{S})-2-(6-keto-1,3-benzothiazol-2-ylidene)thiazolidine-4-carboxylic' },
  '5497163': { smiles:'CCCCCCCC/C=C\\CCCCCCCC(=O)OCC(OC(=O)CCCCCCC/C=C\\CCCCCCCC)COC(=O)CCCCCCC/C=C\\CCCCCCCC', name:'(~{Z})-octadec-9-enoic' },
  '56845452': { smiles:'[C-]#[O+].[C-]#[O+].[C-]#[O+].[C-]#[O+].C1=CC=C(C=C1)C2=C(C(=O)C(=C2C3=CC=CC=C3)C4=CC=CC=C4)C5=CC=CC=C5.C1=CC=C(C=C1)[C]2[C]([C]([C]([C]2C3=CC=CC=C3)O)C4=CC=CC=C4)C5=CC=CC=C5.[Ru].[Ru]', name:'carbon' },
  '5761': { smiles:'CCN(CC)C(=O)[C@H]1CN([C@@H]2CC3=CNC4=CC=CC(=C34)C2=C1)C', name:'(6~{a}~{R},9~{R})-~{N},~{N}-diethyl-7-methyl-6,6~{a},8,9-tetrahydro-4~{H}-indolo[4,3-fg]quinoline-9-carboxamide' },
  '5884': { smiles:'C1C=CN(C=C1C(=O)N)[C@H]2[C@@H]([C@@H]([C@H](O2)COP(=O)(O)OP(=O)(O)OC[C@@H]3[C@H]([C@H]([C@@H](O3)N4C=NC5=C4N=CN=C5N)OP(=O)(O)O)O)O)O', name:'[[(2~{R},3~{R},4~{R},5~{R})-5-adenin-9-yl-3-hydroxy-4-phosphonooxy-tetrahydrofuran-2-yl]methoxy-hydroxy-phosphoryl]' },
  '5904': { smiles:'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C', name:'(2~{S},5~{R},6~{R})-7-keto-3,3-dimethyl-6-[(2-phenylacetyl)amino]-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic' },
  '5988': { smiles:'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O[C@]2([C@H]([C@@H]([C@H](O2)CO)O)O)CO)O)O)O)O', name:'(2~{R},3~{R},4~{S},5~{S},6~{R})-2-[(2~{S},3~{S},4~{S},5~{R})-3,4-dihydroxy-2,5-dimethylol-tetrahydrofuran-2-yl]oxy-6-methylol-tetrahydropyran-3,4,5-triol' },
  '5997': { smiles:'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C', name:'(3~{S},8~{S},9~{S},10~{R},13~{R},14~{S},17~{R})-17-[(1~{R})-1,5-dimethylhexyl]-10,13-dimethyl-2,3,4,7,8,9,11,12,14,15,16,17-dodecahydro-1~{H}-cyclopenta[a]phenanthren-3-ol' },
  '60823': { smiles:'CC(C)C1=C(C(=C(N1CC[C@H](C[C@H](CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4', name:'(3~{R},5~{R})-7-[2-(4-fluorophenyl)-5-isopropyl-3-phenyl-4-(phenylcarbamoyl)pyrrol-1-yl]-3,5-dihydroxy-enanthic' },
  '6228': { smiles:'CN(C)C=O', name:'~{N},~{N}-dimethylformamide' },
  '6410': { smiles:'CC(C)(C)OO', name:'2-hydroperoxy-2-methyl-propane' },
  '6503': { smiles:'C(C(CO)(CO)N)O', name:'2-amino-2-methylol-propane-1,3-diol' },
  '6623': { smiles:'CC(C)(C1=CC=C(C=C1)O)C2=CC=C(C=C2)O', name:'4-[1-(4-hydroxyphenyl)-1-methyl-ethyl]phenol' },
  '679': { smiles:'CS(=O)C', name:'methylsulfinylmethane' },
  '68827': { smiles:'C[C@@H]1CC[C@H]2[C@H](C(=O)O[C@H]3[C@@]24[C@H]1CC[C@](O3)(OO4)C)C', name:'(1~{R},4~{S},5~{R},8~{S},9~{R},12~{S},13~{R})-1,5,9-trimethyl-11,14,15,16-tetraoxatetracyclo[10.3.1.0^{4,13}.0^{8,13}]hexadecan-10-one' },
  '6992788': { smiles:'CO[C@@](C1=CC=CC=C1)(C(=O)O)C(F)(F)F', name:'(2~{S})-3,3,3-trifluoro-2-methoxy-2-phenyl-propionic' },
  '7054': { smiles:'C1=CC=C2C(=C1)C(=O)C(=O)N2', name:'isatin' },
  '73602790': { smiles:'CC(C)(C)C1=CC(=C(C(=C1)C=N[C@@H]2CCCC[C@H]2N=CC3=CC(=CC(=C3[O-])C(C)(C)C)C(C)(C)C)[O-])C(C)(C)C.[Cl-].[Mn+3]', name:'manganic;2,4-di~{tert}-butyl-6-[[(1~{R},2~{R})-2-[(3,5-di~{tert}-butyl-2-oxido-benzylidene)amino]cyclohexyl]iminomethyl]phenolate;chloride' },
  '7501': { smiles:'C=CC1=CC=CC=C1', name:'styrene' },
  '84599': { smiles:'C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3.[Cl-].[Rh]', name:'rhodium;triphenylphosphine;chloride' },
  '875': { smiles:'C(C(C(=O)O)O)(C(=O)O)O', name:'tartaric' },
  '89594': { smiles:'CN1CCC[C@H]1C2=CN=CC=C2', name:'3-[(2~{S})-1-methylpyrrolidin-2-yl]pyridine' },
  '9357': { smiles:'[C@@H]([C@H](C(=O)[O-])O)(C(=O)[O-])O.[Na+].[K+]', name:'potassium;sodium;(2~{R},3~{R})-2,3-dihydroxysuccinate' },
  '9838490': { smiles:'B1(N2CCC[C@@H]2C(O1)(C3=CC=CC=C3)C4=CC=CC=C4)C', name:'(3~{a}~{R})-1-methyl-3,3-diphenyl-3~{a},4,5,6-tetrahydropyrrolo[1,2-c][1,3,2]oxazaborole' },
  '9888549': { smiles:'COC(=O)NC1=C\\2[C@H](C#C/C=C\\C#C[C@@](/C2=C\\CSSSC)(CC1=O)O)O', name:'~{N}-[(1~{R},4~{Z},8~{S},13~{Z})-1,8-dihydroxy-11-keto-13-[2-(methyltrisulfanyl)ethylidene]-10-bicyclo[7.3.1]trideca-4,9-dien-2,6-diynyl]carbamic' },
  '9942167': { smiles:'[OH-].[OH-].[Pd+2]', name:'palladium(2+);dihydroxide' }
};

const smiles = Object.keys(molecules).map(key => molecules[key].smiles);
const formulas = smiles.map(smile => rdkit.smilesToMolFormula(smile));
console.log(formulas);
// const empty_mol_smiles = rdkit.molBlockToSmiles(empty_mol_block);
// console.log('Empty mol: ', empty_mol_smiles);
//
// const empty_string_smiles = rdkit.molBlockToSmiles('');
// console.log('Empty string: ', empty_string_smiles);
//
// const benzene_molblock = rdkit.smilesToMolBlock(benzene_smiles);
// console.log('Benzene Mol Block: ', benzene_molblock);
//
// const empty_molblock = rdkit.smilesToMolBlock('');
// console.log('Empty Mol Block: ', empty_molblock);
//
// const benzene_molwt = rdkit.molWtFromSmiles(benzene_smiles);
// console.log('Mol Wt: ', benzene_molwt);
//
// const empty_molwt = rdkit.molWtFromSmiles('');
// console.log('Empty Mol Wt: ', empty_molwt);
