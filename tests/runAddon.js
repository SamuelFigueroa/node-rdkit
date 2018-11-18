const rdkit = require("bindings")("node-rdkit");

const benzene_mol_block = `
     CWRITER311071816342D

  6  6  0  0  0  0  0  0  0  0999 V2000
    3.6046    6.0097    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.4706    5.5097    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.3366    6.0097    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.3366    7.0097    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.4706    7.5097    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.6046    7.0097    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0
  2  3  1  0  0  0
  3  4  2  0  0  0
  4  5  1  0  0  0
  5  6  2  0  0  0
  6  1  1  0  0  0
M  END`;

const empty_mol_block = `
     CWRITER311161812292D

  0  0  0  0  0  0  0  0  0  0999 V2000
M  END`;

const benzene_smiles = rdkit.molBlockToSmiles(benzene_mol_block);
console.log('Benzene: ', benzene_smiles);

const empty_mol_smiles = rdkit.molBlockToSmiles(empty_mol_block);
console.log('Empty mol: ', empty_mol_smiles);

const empty_string_smiles = rdkit.molBlockToSmiles('');
console.log('Empty string: ', empty_string_smiles);

const benzene_molblock = rdkit.smilesToMolBlock(benzene_smiles);
console.log('Benzene Mol Block: ', benzene_molblock);

const empty_molblock = rdkit.smilesToMolBlock('');
console.log('Empty Mol Block: ', empty_molblock);

const benzene_molwt = rdkit.molWtFromSmiles(benzene_smiles);
console.log('Mol Wt: ', benzene_molwt);

const empty_molwt = rdkit.molWtFromSmiles('');
console.log('Empty Mol Wt: ', empty_molwt);
