const rdkit = require("bindings")("node-rdkit");

const mol_block = `
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

console.log(rdkit.molBlockToSmiles(mol_block));

// const mol = rdkit.MolBlockToMol(mol_block);
//
// console.log(rdkit.MolToSmiles(mol));
