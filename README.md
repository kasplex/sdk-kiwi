# Kasplex Wallet SDK - Kiwi

**Kasplex Wallet SDK - Kasplex in Wallet Integration (Kiwi) is a powerful and easy-to-use SDK designed to simplify the management of Kaspa wallet assets. It provides seamless integration with Kaspa nodes, KRC20 tokens, and essential wallet functionalities, enabling developers to build robust Kaspa-based applications effortlessly.

## Features

- **Mnemonic Support**: Generate and restore wallets securely using industry-standard mnemonics.
- **Wallet Generation & Derivation**: Create hierarchical deterministic (HD) wallets and derive multiple addresses.
- **KRC20 Protocol Implementation & API Integration**: Easily interact with **KRC20 tokens** using built-in API functions.
- **Kaspa API & Node Connectivity**: Connect to Kaspa nodes for real-time blockchain data and transaction process.
- **Multi-Signature Wallet Support**: Implement enhanced security with multi-signature wallet functionality.
- **Message Subscription**: Subscribe to blockchain events, transaction updates, and real-time notifications.

## Installation
Node.js Version Requirement: This SDK requires Node.js version 20.13.1 or higher. You can check the version of Node.js while it is running.

## Getting Started

To integrate **Kasplex Wallet SDK - Kiwi** into your project, follow these steps:

1. **Install the SDK**:
   ```sh
   npm install @kasplex/kiwi
   ```
2. **Set up networkType and init rpc client for use**:
   ```typescript
   import { Kiwi, Rpc,  Wasm } from "@kasplex/kiwi";
   await Rpc.setInstance(Wasm.NetworkType.Mainnet).connect();  // connect kaspa node for fetch information from the node if needed
   ```

2. **Generate a new wallet**:
   ```typescript
   import { Mnemonic, Wallet } from "@kasplex/kiwi";
   const mnemonic = Mnemonic.random(12);
   console.log("Generated Mnemonic:", mnemonic);
   let wallet = Wallet.fromMnemonic(mnemonic)
   ```
   
4. **send $KAS**:
   ```typescript
   import { Kaspa } from "@kasplex/kiwi";
   const resp = await Kaspa.transferKas(privateKey, toAddress, 130000000n, 10000n)
   ```

5. **KRC20**:
   ```typescript
   import { Kaspa, Enum, Utils, KRC20 } from "@kasplex/kiwi";
   const krc20data = Utils.createKrc20Data({
      p: "krc-20",
      op: Enum.OP.Mint,
      tick: 'TCKFE',
   })
   let txid = await KRC20.mint(_privateKey, krc20data, 100000n)
   console.log("Mint txid", txid)
   ```
   
## More Examples
- For more detailed usage examples, check out our [Examples Directory](./example/)
- For web usage, check out our [Kiwi for WEB](./README-WEB.md)

## Integrated wallet method
- Please refer to the details for the method of providing a wallet in the [WalletExt](./README-WalletExt.md)

## Contribution

We welcome contributions from the community! Feel free to submit issues, feature requests, or pull requests to improve the **Kasplex Wallet SDK - Kiwi**.

## License

This project is licensed under the **MIT License**.

🚀 **Start building with Kasplex Wallet SDK - Kiwi today and unlock the full potential of the Kaspa ecosystem!**
