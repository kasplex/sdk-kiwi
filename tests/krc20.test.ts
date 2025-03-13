import { describe, test } from '@jest/globals';
import {  NetworkType } from "../wasm/kaspa/kaspa";
import { createKrc20Data } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Rpc } from '../src/rpc/client';
import { KRC20 } from '../src/krc20';
import { Kiwi } from '../src/kiwi'


let _toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let _privateKey = "3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828"
await Kiwi.setNetwork(NetworkType.Testnet)
describe('Transaction', () => {
    // test('mint', async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     console.log('rpc connect...')
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.Mint,
    //         tick: 'SNOWDN',
    //     })
    //     let txid = await KRC20.mint(_privateKey, krc20data)
    //     console.log("Mint txid", txid)
    //     await Rpc.getInstance().disconnect()
    // }, 50000)

    // test('mutilMint', async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.Mint,
    //         tick: 'SNOWDN',
    //     })
    //     console.log('rpc connect...')
    //     let txid = await KRC20.multiMint(_privateKey, krc20data, 0n, 2)
    //     console.log("mutilMint txid", txid)
    //     await Rpc.getInstance().disconnect()
    // }, 300000)


    // test('transfer', async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.Transfer,
    //         tick: "",
    //         to: _toAddress,
    //         amt: "22",
    //     })  
    //     let txid = await KRC20.transfer(_privateKey, krc20data, 100000n)
    //     console.log("Transfer txid", txid)
    //     await Rpc.getInstance().disconnect()
    // }, 50000)

    test('deploy', async () => {
        console.log('deploy start')
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const deploydata = createKrc20Data({
            p: "krc-20",
            op: OP.Deploy,
            tick: "BOBOK",
            to: _toAddress,
            amt: "",
            max: "1000000000000",
            lim: "1000000000",
            dec: "8",
            pre: "1000000000000",
        })  
        let txid = await KRC20.deploy(_privateKey, deploydata)
        console.log("Deploy txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    // test('list', async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.List,
    //         tick: "SNOWDN",
    //         amt: "100000",
    //     })
    //     let txid = await KRC20.list(_privateKey, krc20data, 100000n)
    //     console.log("List txid", txid)
    //     await Rpc.getInstance().disconnect()
    // }, 50000)

    // test('send', async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.Send,
    //         tick: "SNOWDN",
    //     })
    //     const hash = "e2c89a8350049ca89a3ac4aa7cd60575c309a6997eb5bc1797d09c3a6a74db57"
    //     const _buyPrivateKey = "fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a"
    //     let txid = await KRC20.send(_privateKey, krc20data, _buyPrivateKey,hash,100000000n, 100000n)
    //     console.log("Send txid", txid)
    //     await Rpc.getInstance().disconnect()
    // }, 50000)

    // test("transferMulti", async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.Transfer,
    //         tick: "SNOWDN",
    //         to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
    //         amt: "20000000",
    //     })

    //     const requireSigNum = 2;
    //     const useEcdsa = false
    //     let privateKeys = [
    //         "2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941",
    //         "4a6338cdc39ea7ba6503f45bfdca02ff9be5ef1cb4d665ca7e94afe52adabafc",
    //         "eb2570115b126c59b76d797d5cc5b21c92af98344f4a5f0c04df159205d10377",
    //     ]

    //     let publicKeys = [
    //         "02f5c16567f9eaa48a31b4bf5959ebd2fdbac6671998996a5b8165213e6f38e79e",
    //         "024af3fac87b66e378923aea14e16f87fe83dc6e7c54f108f4ccd95e63f049ea14",
    //         "02bec0bb5a3c896ed719402b3ea05bf3f8ef8705928d2239df12ee643bdedc40e6",
    //     ]
    //     let txid = await KRC20.transferMulti(requireSigNum, publicKeys, krc20data, privateKeys, useEcdsa, 10000n)
    //     console.log("TransferMulti txid", txid)
    //     await Rpc.getInstance().disconnect()
    // }, 50000)

})