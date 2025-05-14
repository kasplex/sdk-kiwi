# Wallet Extension SDK

A unified wallet API interface for interacting with various cryptocurrency wallets. This SDK provides standardized methods for account management, transactions, and wallet operations.

## Quick Start

```typescript
import { WalletApi } from '@kasplex/kiwi-web';

// Create and initialize wallet instance
const wallet = await WalletApi.create('unisat');

// Request account access
const accounts = await wallet.authorize();
console.log('Connected accounts:', accounts);
```

## Supported Wallets

- Kasware
- Kastle
- Kaskeeper
- Unisat

## Core Features

- Account Management
- Transaction Operations
- Network Management
- Event Handling
- KRC20 Token Operations
- Message Signing
- PSBT Operations

## API Reference

### Account Management

#### `authorize()`
Requests access to wallet accounts.
```typescript
const accounts = await wallet.authorize();
```

#### `getAccounts()`
Gets currently connected accounts.
```typescript
const account = await wallet.getAccounts();
```

# Wallet Method Support Comparison

| Method Name            | KasKeeper | Kastle | KasWare | UniSat |
|------------------------|-----------|--------|---------|--------|
| **Authorization & Connection** |           |        |         |        |
| authorize              | Yes       | Yes    | Yes     | Yes    |
| connect                | Yes       | Yes    | No      | No     |
| requestAccounts        | Yes       |        | Yes     | Yes    |
| getAccounts            | Yes       |        | Yes     | Yes    |
| getAccount             | No        | Yes    | No      | No     |
| **Network & Version**  |           |        |         |        |
| getVersion             | Yes       |        | Yes     | No     |
| getNetwork             | Yes       |        | Yes     | Yes    |
| switchNetwork          | Yes       |        | Yes     | Yes    |
| disconnect             | Yes       |        | Yes     | Yes    |
| **Account Info**       |           |        |         |        |
| getPublicKey           | Yes       |        | Yes     | Yes    |
| getBalance             | Yes       |        | Yes     | Yes    |
| getKRC20Balance        | Yes       |        | Yes     | Yes    |
| getUtxoEntries         | No        |        | Yes     | Yes    |
| **Transaction Operations** |           |        |         |        |
| sendKaspa              | Yes       |        | Yes     | Yes    |
| signPskt               | No        |        | Yes     | Yes    |
| buildScript            | No        |        | Yes     | Yes    |
| submitCommitReveal     | No        |        | Yes     | Yes    |
| createKRC20Order       | No        |        | Yes     | Yes    |
| buyKRC20Token          | No        |        | Yes     | Yes    |
| cancelKRC20Order       | No        |        | Yes     | Yes    |
| signMessage            | Yes       |        | Yes     | Yes    |
| signKRC20Transaction   | No        |        | Yes     | Yes    |
| **Chain & Inscriptions** |           |        |         |        |
| getChain               | No        |        | No      | Yes    |
| switchChain            | No        |        | No      | Yes    |
| getInscriptions        | No        |        | No      | Yes    |
| sendBitcoin            | No        |        | No      | Yes    |
| sendRunes              | No        |        | No      | Yes    |
| inscribeTransfer       | No        |        | No      | Yes    |
| **PSBT Operations**    |           |        |         |        |
| pushTx                 | Yes       |        | Yes     | Yes    |
| signPsbt               | Yes       |        | No      | Yes    |
| signPsbts              | Yes       |        | No      | Yes    |
| pushPsbt               | Yes       |        | No      | Yes    |
| **Other Features**     |           |        |         |        |
| initialize             | Yes       |        | Yes     | No     |
| openDeployKrc20View    | Yes       |        | No      | No     |
| openMintKrc20View      | Yes       |        | No      | No     |
| verifyMessage          | Yes       |        | No      | No     |


## Reference Connection

- **[Kasware Documentation](https://docs.kasware.xyz/wallet/dev-base/dev-integration#requestaccounts)**: Official documentation for integrating with the Kasware wallet.
- **[Unisat Developer Center](https://docs.unisat.io/dev/unisat-developer-center/unisat-wallet)**: Official developer resources for integrating with the Unisat wallet.

## Best Practices

1. Always initialize wallet using `WalletApi.create()`
2. Handle wallet events appropriately
3. Implement proper error handling
4. Check network compatibility before operations
5. Verify transaction parameters before sending

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions for all methods and parameters.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License 