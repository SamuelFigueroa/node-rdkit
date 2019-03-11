#include <napi.h>
#include <GraphMol/FileParsers/FileParsers.h>
#include <GraphMol/SmilesParse/SmilesWrite.h>
#include <GraphMol/SmilesParse/SmilesParse.h>
#include <RDGeneral/FileParseException.h>
#include <GraphMol/Descriptors/MolDescriptors.h>
#include <GraphMol/ChemTransforms/ChemTransforms.h>
#include <GraphMol/MolOps.h>
using namespace std;

Napi::Value MolBlockToSmiles(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  string mol_block = info[0].As<Napi::String>();
  RDKit::ROMOL_SPTR m;
  try {
      m = RDKit::ROMOL_SPTR(RDKit::MolBlockToMol( mol_block ));
  } catch (RDKit::FileParseException &e) {
      Napi::TypeError::New(env, e.message()).ThrowAsJavaScriptException();
      return env.Null();
  }

  string smiles = "";
  if (m != nullptr) {
      try {
          smiles = RDKit::MolToSmiles( *m );
      } catch (exception &e) {
          Napi::TypeError::New(env, e.what()).ThrowAsJavaScriptException();
          return env.Null();
      }
  }
  Napi::String napi_smiles = Napi::String::New(env, smiles);
  return napi_smiles;
}

Napi::Value SmilesToMolBlock(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  string smiles = info[0].As<Napi::String>();
  RDKit::ROMOL_SPTR m;
  try {
      m = RDKit::ROMOL_SPTR(RDKit::SmilesToMol(smiles));
  } catch (RDKit::SmilesParseException &e) {
      Napi::TypeError::New(env, e.message()).ThrowAsJavaScriptException();
      return env.Null();
  }

  string molblock = "";
  if (m != nullptr) {
      try {
          molblock = RDKit::MolToMolBlock(*m);
      } catch (exception &e) {
          Napi::TypeError::New(env, e.what()).ThrowAsJavaScriptException();
          return env.Null();
      }
  }
  Napi::String napi_molblock = Napi::String::New(env, molblock);
  return napi_molblock;
}

Napi::Value MolWtFromSmiles(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  string smiles = info[0].As<Napi::String>();
  RDKit::ROMOL_SPTR m;
  try {
      m = RDKit::ROMOL_SPTR(RDKit::SmilesToMol(smiles));
  } catch (RDKit::SmilesParseException &e) {
      Napi::TypeError::New(env, e.message()).ThrowAsJavaScriptException();
      return env.Null();
  }

  Napi::Number mol_wt = Napi::Number::New(env, RDKit::Descriptors::calcAMW(*m) );

  return mol_wt;
}

Napi::Value HasSubstructMatch(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1) {
      Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
      return env.Null();
    }

    if (!info[0].IsString() || !info[1].IsString()) {
      Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
      return env.Null();
    }

    string molecule = info[0].As<Napi::String>();
    string pattern = info[1].As<Napi::String>();
    RDKit::ROMOL_SPTR m;
    RDKit::ROMOL_SPTR patt;
    try {
        m = RDKit::ROMOL_SPTR(RDKit::SmilesToMol(molecule));
        patt = RDKit::ROMOL_SPTR(RDKit::SmilesToMol(pattern));
    } catch (RDKit::SmilesParseException &e) {
        Napi::TypeError::New(env, e.message()).ThrowAsJavaScriptException();
        return env.Null();
    }

    RDKit::MatchVectType v;

    Napi::Boolean hasSubstructMatch = Napi::Boolean::New(env, RDKit::SubstructMatch(*m, *patt, v, true, true));

    return hasSubstructMatch;
}

//RDKit::ROMOL_SPTR _applyPattern(RDKit::ROMOL_SPTR m, RDKit::ROMOL_SPTR salt, bool notEverything) {

//    unsigned int nAts = m->getNumAtoms();
//    if(nAts == 0)
//        return m;
//    RDKit::ROMOL_SPTR res(m);

//    RDKit::ROMOL_SPTR t(RDKit::deleteSubstructs(*res, *salt, true, true));
//    if(t == nullptr || (notEverything && t->getNumAtoms() == 0))
//        return res;
//    res = t;
//    while (res->getNumAtoms() && nAts > res->getNumAtoms()) {
//        nAts = res->getNumAtoms();
//        RDKit::ROMOL_SPTR temp(RDKit::deleteSubstructs(*res, *salt, true, true));
//        if(notEverything && temp->getNumAtoms() == 0)
//            break;
//        res = temp;
//    }
//    return res;

//}

//Napi::Value RemoveSaltsFromSmiles(const Napi::CallbackInfo& info) {
//  Napi::Env env = info.Env();

//  if (info.Length() < 2) {
//    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
//    return env.Null();
//  }

//  if (!info[0].IsString()) {
//    Napi::TypeError::New(env, "First argument must be a string.").ThrowAsJavaScriptException();
//    return env.Null();
//  }

//  if (!info[1].IsArray()) {
//    Napi::TypeError::New(env, "Second argument must be an array of strings.").ThrowAsJavaScriptException();
//    return env.Null();
//  }

//  string smiles = info[0].As<Napi::String>();

//  vector <string> salts;
//  for(unsigned int i = 0; i < info[1].As<Napi::Array>().Length(); i++)
//      salts.push_back(info[1].As<Napi::Array>().Get(i).As<Napi::String>());

//  bool dontRemoveEverything = !info[2].IsUndefined() ? info[2].As<Napi::Boolean>() : true;

//  RDKit::ROMOL_SPTR mol;
//  try {
//      mol = RDKit::ROMOL_SPTR(RDKit::SmilesToMol(smiles));
//  } catch (RDKit::SmilesParseException &e) {
//      Napi::TypeError::New(env, e.message()).ThrowAsJavaScriptException();
//      return env.Null();
//  }

//  vector<string> removed(0);

//  Napi::Object result = Napi::Object::New(env);
//  result.Set(Napi::String::New(env, "molecule"), smiles);
//  result.Set(Napi::String::New(env, "removed"), Napi::Array::New(env));

//  if(dontRemoveEverything && RDKit::MolOps::getMolFrags(*mol).size() <= 1) {
//      return result;
//  }

//  bool modified = false;
//  unsigned int numAtoms = mol->getNumAtoms();
//  for (unsigned int i = 0; i < salts.size(); i++) {
//      RDKit::ROMOL_SPTR salt;
//      try {
//          salt = RDKit::ROMOL_SPTR(RDKit::SmilesToMol(salts[i]));
//      } catch (RDKit::SmilesParseException &e) {
//          Napi::TypeError::New(env, e.message()).ThrowAsJavaScriptException();
//          return env.Null();
//      }
//      mol = _applyPattern(mol, salt, dontRemoveEverything);
//      if(numAtoms != mol->getNumAtoms()) {
//          numAtoms = mol->getNumAtoms();
//          modified = true;
//          removed.push_back(salts[i]);
//          if(dontRemoveEverything && RDKit::MolOps::getMolFrags(*mol).size() <= 1)
//              break;
//      }
//  }
//  if (modified && mol->getNumAtoms() > 0) {
//      RDKit::RWMOL_SPTR desalted( new RDKit::RWMol(*mol, true));
//      RDKit::MolOps::sanitizeMol(*desalted);
//      string smiles = "";
//      try {
//          smiles = RDKit::MolToSmiles(*desalted);
//      } catch (exception &e) {
//          Napi::TypeError::New(env, e.what()).ThrowAsJavaScriptException();
//          return env.Null();
//      }

//      Napi::Array removed_salts = Napi::Array::New(env, removed.size());
//      for(unsigned int i = 0; i != removed.size(); i++) {
//          removed_salts[i] = Napi::String::New(env, removed[i]);
//      }
//      result.Set(Napi::String::New(env, "molecule"), smiles);
//      result.Set(Napi::String::New(env, "removed"), removed_salts);
//  }

//  return result;

//}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "molBlockToSmiles"),
              Napi::Function::New(env, MolBlockToSmiles));
  exports.Set(Napi::String::New(env, "smilesToMolBlock"),
              Napi::Function::New(env, SmilesToMolBlock));
  exports.Set(Napi::String::New(env, "molWtFromSmiles"),
              Napi::Function::New(env, MolWtFromSmiles));
  exports.Set(Napi::String::New(env, "hasSubstructMatch"),
              Napi::Function::New(env, HasSubstructMatch));
//  exports.Set(Napi::String::New(env, "removeSaltsFromSmiles"),
//              Napi::Function::New(env, RemoveSaltsFromSmiles));
  return exports;
}

NODE_API_MODULE(addon, Init)
