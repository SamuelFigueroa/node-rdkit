#include <napi.h>
#include <GraphMol/FileParsers/FileParsers.h>
#include <GraphMol/SmilesParse/SmilesWrite.h>
#include <RDGeneral/FileParseException.h>

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

  Napi::String smiles = Napi::String::New(env, RDKit::MolToSmiles(*m, true) );

  return smiles;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "molBlockToSmiles"),
              Napi::Function::New(env, MolBlockToSmiles));
  return exports;
}

NODE_API_MODULE(addon, Init)
