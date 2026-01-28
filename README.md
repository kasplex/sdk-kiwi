# Kasplex Wallet SDK for web - Kiwi

**Kasplex Wallet SDK for web - Kasplex in Wallet Integration (Kiwi) is a powerful and easy-to-use SDK designed to simplify the management of Kaspa wallet assets. It provides seamless integration with Kaspa nodes, KRC20 tokens, and essential wallet functionalities, enabling developers to build robust Kaspa-based applications effortlessly.

## Features

- **Mnemonic Support**: Generate and restore wallets securely using industry-standard mnemonics.
- **Wallet Generation & Derivation**: Create hierarchical deterministic (HD) wallets and derive multiple addresses.
- **KRC20 Protocol Implementation & API Integration**: Easily interact with **KRC20 tokens** using built-in API functions.
- **Kaspa API & Node Connectivity**: Connect to Kaspa nodes for real-time blockchain data and transaction processing.
- **Multi-Signature Wallet Support**: Implement enhanced security with multi-signature wallet functionality.
- **Message Subscription**: Subscribe to blockchain events, transaction updates, and real-time notifications.

## Installation
Node.js Version Requirement: This SDK requires Node.js version 20.13.1 or higher. You can check your Node.js version by running:
```sh
node -v
```

## Getting Started

To integrate **Kasplex Wallet SDK - Kiwi** into your project, follow these steps:

1. **Install the SDK**:
   ```sh
   npm install @kasplex/kiwi-web
   ```
   
2. **Set up networkType and init rpc client for use**:
   ```typescript
   import { Kiwi, Rpc,  Wasm, initialize } from '@kasplex/kiwi-web'

   // Initialize WASM
   // ⚠️ The wasm file MUST be from kaspa-wasm v1.1.0
   // You can find `kaspa_bg.wasm` in:
   //   node_modules/@kasplex/kiwi-web/dist/kaspa_bg.wasm
   //
   // In browser environments, the wasm file should be copied
   // to your project's public directory and referenced by URL.
   // The path must be publicly accessible and served with `application/wasm` MIME type.
   await initialize('/wasm/kaspa_bg.wasm')

   // Set network type (Mainnet or Testnet)
   await Kiwi.setNetwork(Wasm.NetworkType.Mainnet)
   // Use NetworkType.Testnet for testnet
   // await Kiwi.setNetwork(Wasm.NetworkType.Testnet)

   // Initialize and connect RPC client (optional but required for node queries)
   const rpc = Rpc.setInstance(Wasm.NetworkType.Mainnet)
   await rpc.connect()
   ```

2. **Generate a new wallet**:
   ```typescript
   import { Mnemonic, Wallet } from "@kasplex/kiwi-web";
   const mnemonic = Mnemonic.random(12);
   console.log("Generated Mnemonic:", mnemonic);
   let wallet = Wallet.fromMnemonic(mnemonic)
   ```
   
4. **KAS Transfer**:
   ```typescript
   import { KaspaTransaction } from "@kasplex/kiwi-web";
   const resp = await KaspaTransaction.transferKas(privateKey, toAddress, 130000000n, 10000n)
   ```

5. **KRC20**:
   ```typescript
   import { Enum, Utils, KRC20 } from "@kasplex/kiwi-web";
   const krc20data = Utils.createKrc20Data({
      p: "krc-20",
      op: Enum.OP.Mint,
      tick: 'TCKFE',
   })
   let txid = await KRC20.mint(_privateKey, krc20data, 100000n)
   console.log("Mint txid", txid)
   ```
6. **Browser Extension Integration**:
   ```typescript
   import { BrowerWallet, WalletApi } from "@kasplex/kiwi-web";

   const walletList = await BrowerWallet.getBrowerWalletList();
   console.log("walletList", walletList);
   
   // Create and initialize wallet instance
   const wallet = await WalletApi.create('kasware');
   
   // Request account access
   const accounts = await wallet.requestAccounts();
   console.log('Connected accounts:', accounts);
   
   // Get wallet balance
   const balance = await wallet.getBalance();
   console.log('Wallet balance:', balance);
   ```

   For detailed browser extension integration guide, please refer to our [Browser Extension Documentation](./README-WalletExt.md)


## WASM Initialization (Web)

The Kiwi Web SDK depends on a WebAssembly module (`kaspa_bg.wasm`).
You must initialize it **once** before using any wallet, RPC, or transaction-related functionality.

WASM version requirement

🔒 WASM Version Compatibility

This SDK is tested and compatible only with kaspa-wasm@1.1.0.
❌ 0.x versions are not supported
❌ Mixing JS and WASM from different versions will cause runtime errors
✅ Recommended: kaspa-wasm@1.1.0-rc.2


💡 Tip:
If you encounter errors like
expected magic word 00 61 73 6d or __wbindgen_closure_wrapper
please double-check your WASM version and loading path.



## More Examples
- For more detailed usage examples, check out our [Examples Directory](./examples/)
- For usage of node, check out our [Kiwi for NODE](./README.md)

## Contribution

We welcome contributions from the community! Feel free to submit issues, feature requests, or pull requests to improve the **Kasplex Wallet SDK - Kiwi**.

## License

This project is licensed under the **MIT License**.

🚀 **Start building with Kasplex Wallet SDK - Kiwi today and unlock the full potential of the Kaspa ecosystem!**
