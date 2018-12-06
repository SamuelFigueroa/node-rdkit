const rdkit = require("bindings")("node-rdkit");

const test_molblock = `
  ZLAB311291814222D
http://medchemprdimsap.cc.ku.edu
  8  7  0  0  0  0  0  0  0  0999 V2000
    5.0972   -4.9216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.9633   -5.4216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.8293   -4.9216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.8293   -3.9216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.9633   -3.4216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.0972   -3.9216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.9633   -2.4216    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    8.4744   -3.8269    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0
  2  3  1  0  0  0
  3  4  2  0  0  0
  4  5  1  0  0  0
  5  6  2  0  0  0
  6  1  1  0  0  0
  5  7  1  0  0  0
M  CHG  2   7   1   8  -1
M  END`;

// const empty_mol_block = `
//      CWRITER311161812292D
//
//   0  0  0  0  0  0  0  0  0  0999 V2000
// M  END`;

// const benzene_smiles = rdkit.molBlockToSmiles(benzene_mol_block);
// console.log('Benzene: ', benzene_smiles);
//
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
