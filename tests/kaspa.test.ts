import { describe, it } from 'vitest';
import {NetworkType, PrivateKey} from "../wasm/kaspa";
import { Rpc } from '../src/rpc/client';

import {Kaspa} from "../src/kaspa";

// let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let toAddress = 'kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3'
let privateKey = new PrivateKey("3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828")

describe('Transaction', () => {

    it('transferKas', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const transKas = await Kaspa.transferKas(privateKey, toAddress, 1300000000n, 10000n)
        console.log('transKas: ', transKas )
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    });
})