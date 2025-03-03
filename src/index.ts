import { Mnemonic } from "./address/mnemonic";
import { Wallet } from "./address/wallet";
import {Rpc} from "./rpc/client";
import { KasplexApi } from "./api/kasplexApi";
import { Kaspa } from "./kaspa";
import { Script } from "./script/script";
import { Transaction } from "./tx/transaction";
import { KRC20 } from "./krc20";
import { Base } from "./base";
import {NetworkType, PrivateKey} from "@/wasm/kaspa";
import { Krc20Data } from './types/interface';
import { OP } from "./utils/enum";

export { Mnemonic, Wallet, Rpc, NetworkType, KasplexApi, Kaspa, PrivateKey, Script }

// async function testEventListen() {
//     let rpc = new Rpc();
//     await rpc.client.connect();
//     let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
//     await rpc.subscribeEvent("utxos-changed", targetAddress, () => {
//         console.log(`UTXO changes detected for address: ${targetAddress}`, 'INFO');
//     });
// }

// async function testEventListen() {
//     await Rpc.setInstance(NetworkType.Testnet).connect()
//
//     // let address = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08"
//     // let to_address = "kaspatest:qzlvpw668jyka4cegq4nagzm70uwlpc9j2xjywwlzthxgw77m3qwv4sggpg74"
//     let privateKey = new PrivateKey("fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a")
//     //
//     // Transaction.transferKas(privateKey, to_address, 200000000n, 10000n).then(r => {
//     //     console.log("resp", r)
//     // })
//
//     // let tx = Transaction.createTransactions(address, [output], 10000n).then(resp => {
//     //     for (const transaction of resp.transactions) {
//     //         transaction.sign([privateKey]);
//     //         await transaction.submit(this.client);
//     //     }
//     // })
//     // tx.then(r => {
//     //     r.transactions.
//     // })
//     // // console.log("tx:", tx)
//     // // return await Rpc.getInstance().client.getServerInfo()
//     // return tx
//     let krc20Data:Krc20Data = {
//         p: "krc-20",
//         op: OP.Mint,
//         tick: "SNOWDN",
//     }
//     let txid = await KRC20.mint(privateKey, krc20Data)
//     console.log("txid", txid)
//     return txid
// }
//
// testEventListen().then( r => {
//     console.log("123123 13: ", r);
//     // Rpc.getInstance().disconnect()
// })
// // Transaction.createTransactions()

console.log("end");


