import { describe, it, expect } from 'vitest';
import {NetworkType, PrivateKey} from "../src/wasm/kaspa";
import { createKrc20Data } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Rpc } from '../src/rpc/client';
import { KRC20 } from '../src/krc20';

let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let privateKey = new PrivateKey("3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828")
let _privateKey = "3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828"

describe('Transaction', () => {

    it('mint', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'SNOWDN',
        })
        let txid = await KRC20.mint(_privateKey, krc20data, 100000n)
        console.log("Mint txid", txid)
    }, 5000)

    it('transfer', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Transfer,
            tick: "SNOWDN",
            to: toAddress,
            amt: "20",
        })  
        let txid = await KRC20.transfer(_privateKey, krc20data, 130000n)
        console.log("Transfer txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('deploy', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const deploydata = createKrc20Data({
            p: "krc-20",
            op: OP.Deploy,
            tick: "JEMEP",
            to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
            amt: "",
            max: "10000000000",
            lim: "1000000",
            dec: "8",
            pre: "10000000000",
        })  
        let txid = await KRC20.deploy(_privateKey, deploydata, 100000n)
        console.log("Deploy txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('list', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.List,
            tick: "SNOWDN",
            amt: "100000",
        })  
        let txid = await KRC20.list(_privateKey, krc20data, 100000n)
        console.log("List txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('send', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Send,
            tick: "SNOWDN",
        })  
        const hash = "3b76a7b1c294c682909caf350bacb24523975423764caabdf1c769e241952cc7"
        const _buyPrivateKey = "fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a"
        let txid = await KRC20.send(_privateKey, krc20data, _buyPrivateKey,hash,100000000n, 100000n)
        console.log("Send txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('pskt', async () => {
        const _privateKey = "3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828"
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Send,
            tick: "snowdn",
        })
        const hash = "b0c7e3b609b23c3fcb19523d257c86226b0d8bcda3858d7186f37a75417d86f6"
        const signData = await KRC20.signHalf(_privateKey, krc20data, hash, 100000000n)
        console.log("pskt signData", signData)

        const _buyPrivateKey = "fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a"
        const txshId = await KRC20.revealPskt(_buyPrivateKey, signData, hash, 10000n)
        console.log("revealPskt txshId", txshId)
        await Rpc.getInstance().disconnect()
    }, 50000)

})