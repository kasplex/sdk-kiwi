#!/bin/bash

set -e  # Stop immediately if any command fails

echo "📦 Copying WASM files to src/wasm/kaspa..."
rm -rf src/wasm/*
mkdir -p src/wasm
cp -R wasm/kaspa-node/ src/wasm/

echo "🧩 Writing index.ts..."
cat > src/index.ts << EOF
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

export * as Wasm from './wasm';
export { Kiwi } from './kiwi';
export { Rpc } from './rpc/client';
export { KRC20 } from './krc20';
export { Utils, Enum } from './utils';

export * from "./address/mnemonic";
export * from "./address/wallet";
export * from "./api/kasplexApi";
export * from "./api/kaspaApi";
export * from "./KaspaTransaction";
export * from "./script/script";
export * from './init';
export * as Modules from "./types";
export * as Tx from "./tx";
EOF

echo "✅ index.ts has been generated successfully."

cp package-node.json package.json

npm run publish

mkdir -p dist/wasm
cp ./src/wasm/kaspa.d.ts dist/wasm/
cp ./src/wasm/package.json dist/wasm/
cp ./src/wasm/kaspa_bg.wasm dist/

npm pack