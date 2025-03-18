import {describe, test} from '@jest/globals';
import {NetworkType, PrivateKey} from "../wasm/kaspa/kaspa";
import {Rpc} from '../src/rpc/client';
import {Kaspa} from "../src/kaspa";
import {loadKaspaWasm} from "../src/init";

await loadKaspaWasm()
// let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let toAddress = 'kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3'
let privateKey = new PrivateKey("2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941")

describe('Transaction', () => {

    // test('transferKas', async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const txid = await Kaspa.transferKas(privateKey, toAddress, 1300000000n, 10000n)
    //     console.log("txid", txid)
    //     await Rpc.setInstance(NetworkType.Testnet).disconnect()
    // });

    // test('transferKas', async () => {
    //     let eventMap: Map<string, boolean> = new Map();
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     let address = privateKey.toPublicKey().toXOnlyPublicKey().toAddress(NetworkType.Testnet)
    //     await Rpc.getInstance().client.subscribeUtxosChanged([address.toString()]);
    //     Rpc.getInstance().client.addEventListener('utxos-changed', async (event: any) => {
    //         const addedEntry = event.data.added.find((entry: any) =>
    //             entry.address.payload === address.toString().split(':')[1]
    //         );
    //         if (addedEntry) {
    //             let txid = addedEntry.outpoint.transactionId.toString()
    //             eventMap.set(txid, true)
    //         }
    //     });
    //     for (let i = 0; i< 5; i++) {
    //         const txid = await Kaspa.transferKas(privateKey, toAddress, 1300000000n, 10000n)
    //         while (eventMap.get(txid!) == undefined) {
    //             await new Promise(resolve => setTimeout(resolve, 500)); // wait and check every 500ms
    //         }
    //         eventMap.delete(txid!);
    //     }
    //     await Rpc.setInstance(NetworkType.Testnet).disconnect()
    // }, 500000);

    test('transferkASToMultiSignAddress', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const addressList = [
            {
                address: 'kaspatest:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg2ttgg7a5t',
                amount: 1300000000n
            },
            {
                address: 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf',
                amount: 2000000000n
            }
        ]
        const txid = await Kaspa.transferkASToMultiSignAddress(privateKey, addressList, 13000000n)
        console.log("txid", txid)
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    }, 50000);
})