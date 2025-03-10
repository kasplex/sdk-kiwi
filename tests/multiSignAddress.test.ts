import { describe, expect, test } from '@jest/globals';
import {Wallet} from '../src/address/wallet';
import {Script} from '../src/script/script';
import {Kaspa} from '../src/kaspa';
import {Mnemonic} from '../src/address/mnemonic';
import { NetworkType} from "../wasm/kaspa/kaspa";
import {Rpc} from "../src/rpc/client";
import { loadKaspaWasm } from "../src/init";
await loadKaspaWasm()

let privateKeys = [
    "8648d429bd1bd5ff5688fe217a743bf8deb0b1ea02032db647c0e1d482c1f83c",
    "bb93b238bdd351f9f4436d645d359b3f759ad02af13f4119cc77dac2821afe81",
    "b3a6163f85f740c5746b99cc81a1aca887ba312e045ebe4acd46842cd472f94b",
]
let publicKeys = [
    "038c765b0ef3afe5f10e5c84806b9253156fb7f7fbeb127fe8505a220952337903",
    "03b499112e2aef579bbf253ceba756ea8343061cc924e3ba972248ca584bab1b04",
    "02c28cdca2dc5ebafe2069804980174e1601dad2fe3a08d0d59445b5a1a2c4f3cc",
]

describe('multi sign address function tests', () => {

    test('muitiSign address', () => {
        let address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet)
        expect(address.toString()).toBe("kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3");
        console.log("muiti sign address:", address)
    });


    test('muitiSign address transaction', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        let address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet)
        let redeemScript = Script.redeemScript(2, publicKeys)
        let signPrivateKeys = [
            "8648d429bd1bd5ff5688fe217a743bf8deb0b1ea02032db647c0e1d482c1f83c",
            "bb93b238bdd351f9f4436d645d359b3f759ad02af13f4119cc77dac2821afe81",
        ]

        let toAddress = "kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf"
        let resp = await Kaspa.transferKasFromMultiSignAddress(address, 3, redeemScript, signPrivateKeys, toAddress, 130000000n, 10000n)
        console.log("resp:", resp)
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    });
});
