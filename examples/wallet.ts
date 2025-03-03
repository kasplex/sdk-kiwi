import { Wallet, NetworkType } from '../src/index';

// Example 1: Create a wallet from a mnemonic
const mnemonic = "oil style genre huge push sword security deposit reveal where height orphan file brass umbrella wrap poverty elite slam child glad carbon verify organ";
const walletFromMnemonic = Wallet.fromMnemonic(mnemonic, "yourPassword");

// Display the private key and address
console.log("Private Key:", walletFromMnemonic.toPrivateKey());
console.log("Public Key:", walletFromMnemonic.toPublicKey().toString());

// Example 2: Create a wallet from an existing private key
const existingPrivateKey = "d299294c903737f3ebc81e73bc125ee119acddea6519b718f887b86e97543fb9";
const walletFromPrivateKey = Wallet.fromPrivateKey(existingPrivateKey);

// Display the private key and address
console.log("Private Key:", walletFromPrivateKey.toPrivateKey());
console.log("Public Key:", walletFromPrivateKey.toPublicKey().toString());

// Example 3: Derive a new wallet from the current HD wallet
const newWallet = walletFromMnemonic.newWallet();
console.log("New Wallet Private Key:", newWallet.toPrivateKey());
console.log("New Wallet Address:", newWallet.toAddress(NetworkType.Mainnet).toString());

// Example 4: Sign a message with the wallet's private key
const message = "This is a test message";
const signature = walletFromMnemonic.signMessage(message);
console.log("Message Signature:", signature);

// Example 5: Verify the signature of the signed message
const isValidSignature = walletFromMnemonic.verifyMessage(message, signature);
console.log("Is the signature valid?", isValidSignature);

// Example 6: Validate an address
const address = "kaspa:qqqxmpu7p6lnt63jducjafwf9f5lgj8rhv8snw0a6xv2uc5856xv6hdcrphvr";
const isValidAddress = Wallet.validate(address);
console.log("Is the address valid?", isValidAddress);
