import {describe, it} from 'vitest';
import {NetworkType, PrivateKey} from "../wasm/kaspa-node";
import {Rpc} from '../src/rpc/client';
import { KaspaTransaction } from "../src/KaspaTransaction";
import { Output } from '../src/tx/output';

let toAddress = 'kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3'
let privateKey = new PrivateKey("2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941")

describe('Transaction', () => {

    it('transferKas', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const txid = await KaspaTransaction.transferKas(privateKey, toAddress, 130000000n, 1000000n)
        console.log("txid", txid)
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    });

    it('transfer to multi address', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const outputs = [
            {
                address: 'kaspatest:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg2ttgg7a5t',
                amount: 150000000n
            },
            {
                address: 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf',
                amount: 200000000n
            }
        ]
        const txid = await KaspaTransaction.transfer(privateKey, outputs, 100000n)
        console.log("txid", txid)
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    }, 50000);
})