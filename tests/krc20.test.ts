import { describe, it, expect } from 'vitest';
import {NetworkType, PrivateKey} from "../src/wasm/kaspa";
import { createKrc20Data } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Rpc } from '../src/rpc/client';
import { KRC20 } from '../src/krc20';

let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let privateKey = new PrivateKey("3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828")

describe('Transaction', () => {

    it('mint', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'SNOWDN',
        })
        let txid = await KRC20.mint(privateKey, krc20data, 100000n)
        console.log("Mint txid", txid)
    }, 50000)

    it('transfer', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Transfer,
            tick: "SNOWDN",
            to: toAddress,
            amt: "30",
        })  
        let txid = await KRC20.transfer(privateKey, krc20data, 130000n)
        console.log("Transfer txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('deploy', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const deploydata = createKrc20Data({
            p: "krc-20",
            op: OP.Deploy,
            tick: "SNOWDN",
            to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
            amt: "",
            max: "10000000000000",
            lim: "1000000000",
            dec: "8",
            pre: "1000000000000",
        })  
        let txid = await KRC20.deploy(privateKey, deploydata, 100000n)
        console.log("Deploy txsh", txid)
        await Rpc.getInstance().disconnect()
    })

    it('list', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.List,
            tick: "SNOWDN",
            to: toAddress,
            amt: "1",
        })  
        let txid = await KRC20.transfer(privateKey, krc20data, 100000n)
        console.log("List txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('send', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Send,
            tick: "TKAS",
        })  
        let txid = await KRC20.send(privateKey, krc20data, 100000n)
        console.log("Send txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    it('signTx', async () => {
        const _privateKey = new PrivateKey("2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941")
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Send,
            tick: "oiou",
        })
        const hash = "792f3ee05a83fc162ed30629e22d133ceaa6001755e0008c2a55af232479611d"
        let txid = await KRC20.send(_privateKey, krc20data, 100000n,100000000n, hash)
        console.log("Send txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

})