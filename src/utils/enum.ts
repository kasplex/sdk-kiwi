// Address Prefixes Enum: Defines address prefixes based on the network.
export enum AddressPrefix {
  Mainnet = 'kaspa',
  Testnet = 'kaspatest',
  Devnet = 'kaspadev'
}

// Operations Enum: Defines different operations in the Kaspa blockchain ecosystem.
export enum OP {
  Mint = 'mint',
  Deploy = 'deploy',
  Transfer = 'transfer',
  List = 'list',
  Send = 'send',
  Issue = 'issue',
  Burn = 'burn',
  Blacklist = 'blacklist',
  Chown = 'chown',
}

export enum AddressVersion {
  PubKey = 0,
  PubKeyECDSA = 1,
  ScriptHash = 8
}

export enum WalletType {
  HD = 0,
  PrivateKey = 1,
}