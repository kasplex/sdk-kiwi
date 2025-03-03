# Kasplex Wallet SDK - Kiwi

**Kasplex Wallet SDK - Kasplex in Wallet Integration (Kiwi) is a powerful and easy-to-use SDK designed to simplify the management of Kaspa wallet assets. It provides seamless integration with Kaspa nodes, KRC20 tokens, and essential wallet functionalities, enabling developers to build robust Kaspa-based applications effortlessly..

## Features

- **Mnemonic Support**: Generate and restore wallets securely using industry-standard mnemonics.
- **Wallet Generation & Derivation**: Create hierarchical deterministic (HD) wallets and derive multiple addresses.
- **KRC20 Protocol Implementation & API Integration**: Easily interact with **KRC20 tokens** using built-in API functions.
- **Kaspa API & Node Connectivity**: Connect to Kaspa nodes for real-time blockchain data and transaction processing.
- **Multi-Signature Wallet Support**: Implement enhanced security with multi-signature wallet functionality.
- **Message Subscription**: Subscribe to blockchain events, transaction updates, and real-time notifications.

## Getting Started

To integrate **Kasplex Wallet SDK - Kiwi** into your project, follow these steps:

1. **Install the SDK**:
   ```sh
   npm install "@kasplex/kiwi"
   ```
2. **Set up networkType and init rpc client for use**:
   ```typescript
   import { Base, Rpc, NetworkType } from "@kasplex/kiwi";
   Base.setNetwork(NetworkType.Mainnet)      // NetworkType.Testnet for test net
   await Rpc.setInstance(NetworkType.Testnet).connect();
   ```
3. **Generate a new wallet**:
   ```typescript
   import { Mnemonic, Wallet } from "@kasplex/kiwi";
   const mnemonic = Mnemonic.random(12);
   console.log("Generated Mnemonic:", mnemonic);
   let wallet = Wallet.fromMnemonic(mnemonic)
   ```
   
4. **Connect to the Kaspa network**:
   ```typescript
   import { Kaspa } from "@kasplex/kiwi";
   const resp = await Kaspa.transferKas(privateKey, toAddress, 130000000n, 10000n)
   ```

## More Examples
For more detailed usage examples, check out our [Examples Directory](./examples/)
.

## Contribution

We welcome contributions from the community! Feel free to submit issues, feature requests, or pull requests to improve the **Kasplex Wallet SDK - Kiwi**.

## License

This project is licensed under the **MIT License**.

🚀 **Start building with Kasplex Wallet SDK - Kiwi today and unlock the full potential of the Kaspa ecosystem!**

