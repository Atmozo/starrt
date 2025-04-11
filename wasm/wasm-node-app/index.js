const fs = require('fs');
const path = require('path');

(async () => {
  const wasmBuffer = fs.readFileSync(path.resolve(__dirname, '../add.wasm'));
  const wasmModule = await WebAssembly.compile(wasmBuffer);
  const instance = await WebAssembly.instantiate(wasmModule);

  const result = instance.exports.add(10, 20);
  console.log("Result from WebAssembly:", result); 
})();

