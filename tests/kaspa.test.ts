import { describe, expect, test } from '@jest/globals';
import {NetworkType, PrivateKey} from "../wasm/kaspa/kaspa";
import { Rpc } from '../src/rpc/client';
import {Kaspa} from "../src/kaspa";
import { loadKaspaWasm } from "../src/init";
await loadKaspaWasm()
// let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let toAddress = 'kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3'
let privateKey = new PrivateKey("2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941")

describe('Transaction', () => {

    test('transferKas', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        for (let i = 0; i< 2; i++) {
            const transKas = await Kaspa.transferKas(privateKey, toAddress, 1300000000n, 10000n)
            console.log('transKas: ', transKas )
        }
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    });
})