# Wallet Extension SDK

A unified wallet API interface for interacting with various cryptocurrency wallets. This SDK provides standardized methods for account management, transactions, and wallet operations.

## Quick Start

```typescript
import { WalletApi } from '@kasplex/kiwi-web';

// Create and initialize wallet instance
const wallet = await WalletApi.create('kasware');

// Request account access
const accounts = await wallet.authorize();
console.log('Connected accounts:', accounts);

// Send KAS
const txId = await wallet.sendKaspa(
    'kaspatest:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg2ttgg7a5t',
    100000000,
)
console.log('Transaction ID Info:', txId);
```

## Supported Wallets

- Kasware
- Kaskeeper
- Kastle

## Core Features

- Account Management
- Transaction Operations
- Network Management
- Event Handling
- KRC20 Token Operations
- Message Signing
- PSBT Operations

### Account Management

#### `authorize()`
Requests access to wallet accounts.
```typescript
const accounts = await wallet.authorize();
```

#### `getAccounts()`
Get currently connected accounts.
```typescript
const account = await wallet.getAccounts();
```

## Wallet Method Support Comparison

| Method Name            | KasKeeper | Kastle | KasWare |
|------------------------|-----------|--------|---------|
| **Authorization & Connection** |           |        |         |
| authorize              | Yes       | Yes    | Yes     |
| connect                | Yes       | Yes    | No      |
| requestAccounts        | Yes       |        | Yes     |
| getAccounts            | Yes       |        | Yes     |
| getAccount             | No        | Yes    | No      |
| **Network & Version**  |           |        |         |
| getVersion             | Yes       |        | Yes     |
| getNetwork             | Yes       |        | Yes     |
| switchNetwork          | Yes       |        | Yes     |
| disconnect             | Yes       |        | Yes     |
| **Account Info**       |           |        |         |
| getPublicKey           | Yes       |        | Yes     |
| getBalance             | Yes       |        | Yes     |
| getKRC20Balance        | Yes       |        | Yes     |
| getUtxoEntries         | No        |        | Yes     |
| **Transaction Operations** |           |        |         |
| sendKaspa              | Yes       |        | Yes     |
| signPskt               | No        |        | Yes     |
| buildScript            | No        |        | Yes     |
| submitCommitReveal     | No        |        | Yes     |
| createKRC20Order       | No        |        | Yes     |
| buyKRC20Token          | No        |        | Yes     |
| cancelKRC20Order       | No        |        | Yes     |
| signMessage            | Yes       |        | Yes     |
| signKRC20Transaction   | No        |        | Yes     |
| **Chain & Inscriptions** |           |        |         |
| getChain               | No        |        | No      |
| switchChain            | No        |        | No      |
| getInscriptions        | No        |        | No      |
| sendBitcoin            | No        |        | No      |
| sendRunes              | No        |        | No      |
| inscribeTransfer       | No        |        | No      |
| **PSBT Operations**    |           |        |         |
| pushTx                 | Yes       |        | Yes     |
| signPsbt               | Yes       |        | No      |
| signPsbts              | Yes       |        | No      |
| pushPsbt               | Yes       |        | No      |
| **Other Features**     |           |        |         |
| initialize             | Yes       |        | Yes     |
| openDeployKrc20View    | Yes       |        | No      |
| openMintKrc20View      | Yes       |        | No      |
| verifyMessage          | Yes       |        | No      |


## Reference Connection

- **[Kasware Documentation](https://docs.kasware.xyz/wallet/dev-base/dev-integration#requestaccounts)**: Official documentation for integrating with the Kasware wallet.

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