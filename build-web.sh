#!/bin/bash

set -e  # Stop immediately if any command fails

echo "📦 Copying WASM files to src/kaspa..."
rm -rf src/wasm
mkdir -p src/wasm
cp -R wasm/kaspa-web/* src/wasm/

echo "🧩 Writing index.ts..."
cat > src/index.ts << EOF
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

export * as Wasm from './wasm';
export * from "./address/mnemonic";
export * from "./address/wallet";
export * from "./rpc/client";
export * from "./api/kasplexApi";
export * from "./api/kaspaApi";
export * from "./KaspaTransaction";
export * from "./script/script";
export * from "./krc20";
export * from './kiwi';
export * from './init';
export * from "./utils/index";
export * from "./browerExtend/index";
export * as Modules from "./types/index";
export * as Tx from "./tx";

EOF

echo "✅ index.ts has been generated successfully."

cp package-web.json package.json

npm run publish

mkdir -p dist/wasm
cp ./src/wasm/kaspa.d.ts dist/wasm/
cp ./src/wasm/kaspa.js dist/wasm/
cp ./src/wasm/package.json dist/wasm/
cp ./src/wasm/kaspa_bg.wasm dist/

npm pack