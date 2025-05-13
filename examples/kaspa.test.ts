import {describe, it} from 'vitest';
import {Rpc, Wasm, Kiwi, KaspaTransaction} from "@kasplex/kiwi";

Kiwi.setNetwork(Wasm.NetworkType.Testnet)

describe('Transaction', () => {

    let privateKeyStr = ""

    it('transferKas', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        let privateKey = new Wasm.PrivateKey(privateKeyStr)
        let toAddress = 'kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3'
        let payload = new TextEncoder().encode("kasplex")
        const txid = await KaspaTransaction.transferKas(privateKey, toAddress, 130000000n, 1000000n, payload)
        console.log("txid", txid)
        await Rpc.setInstance(Wasm.NetworkType.Testnet).disconnect()
    }, 20000);

    it('transfer to multi address', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
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
        let privateKey = new Wasm.PrivateKey(privateKeyStr)
        const txid = await KaspaTransaction.transfer(privateKey, outputs, 100000n)
        console.log("txid", txid)
        await Rpc.setInstance(Wasm.NetworkType.Testnet).disconnect()
    }, 50000);
})