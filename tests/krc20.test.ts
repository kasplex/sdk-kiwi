import { describe, test } from 'vitest';
import { NetworkType, PrivateKey } from '../wasm/kaspa/kaspa';
import { Kiwi } from '../src/kiwi'
import { createKrc20Data } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Rpc } from '../src/rpc/client';
import { KRC20 } from '../src/krc20';

describe('Transaction', () => {

    let _toAddress = 'kaspatest:qp5aflmtqc9zk9s8cnlkne7sxh895eqqjscpad0wgjpjxtrgqszy55v22vejn'
    let _privateKey = new PrivateKey("2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941")
    Kiwi.setNetwork(NetworkType.Testnet)

    test('mint', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'TCKFE',
        })
        let txid = await KRC20.mint(_privateKey, krc20data, 100000n)
        console.log("Mint txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('krc20 opration: the commit demo', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'TCKFE',
        })
        const committxid = await KRC20.executeCommit(_privateKey, krc20data, 10000n)
        console.log("commit txid: ", committxid!)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('krc20 opration: the reveal demo', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'TCKFE',
        })
        const commitTxid = "de888944bf0e56227841745f52c1e06cfc63f8e796e7b492f3d142a51a6d6945"
        const committxid = await KRC20.executeReveal(_privateKey, krc20data, commitTxid)
        console.log("commit txid: ", committxid!)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('mint times', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'KFWFS',
        })
        let mintTimes = 3;
        await KRC20.multiMint(_privateKey, krc20data, 10000n, mintTimes, (index, txid) => {
            console.log("current mint index:", index, txid)
        })
        await Rpc.getInstance().disconnect()
    }, 300000)


    test('transfer', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Transfer,
            tick: "KFWFS",
            to: _toAddress,
            amt: "1000000",
        })
        let txid = await KRC20.transfer(_privateKey, krc20data, 100000n)
        console.log("Transfer txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('deploy', async () => {
        console.log('deploy start')
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const deploydata = createKrc20Data({
            p: "krc-20",
            op: OP.Deploy,
            tick: "KFWFS",
            to: _toAddress,
            amt: "",
            max: "1000000000000",
            lim: "10000",
            dec: "8",
            pre: "1000000000000",
        })
        let txid = await KRC20.deploy(_privateKey, deploydata)
        console.log("Deploy txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('list', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.List,
            tick: "KFWFS",
            amt: "10000000",
        })
        let txid = await KRC20.list(_privateKey, krc20data, 100000n)
        console.log("List txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('sendTransaction create send Transation with krc20 price', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Send,
            tick: "KFWFS",
        })
        const hash = "d51915302f757f0e2d7b887870e0f0fafc0ac5b5c3f06e34a719ec354e7658fb"
        let sendTx = await KRC20.sendTransaction(_privateKey, krc20data, hash,100000000n, "")
        console.log("Send tx", sendTx)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('send', async () => {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const sendTx = "{\"id\":\"6e180937e5239d87a75a45158ec105a51e80c79aa14883253e48d8e99a2699f2\",\"version\":0,\"inputs\":[{\"transactionId\":\"d51915302f757f0e2d7b887870e0f0fafc0ac5b5c3f06e34a719ec354e7658fb\",\"index\":0,\"sequence\":\"0\",\"sigOpCount\":1,\"signatureScript\":\"411b82742ffccf0c50cf28f4ed4de73a41b7efc0f8e3179542048048d78854ec1a83c8d1fd8b07fe0512606f758fe33c8b757a82c328c5c00d744f3a8e519adf4b844c5820f5c16567f9eaa48a31b4bf5959ebd2fdbac6671998996a5b8165213e6f38e79eac0063076b6173706c657800297b2270223a226b72632d3230222c226f70223a2273656e64222c227469636b223a224b46574653227d68\",\"utxo\":{\"address\":\"kaspatest:prn6wfluvyw09qs9rvjne2k8khqrx8dsy8e2kn2xzhyflxnt04utq7zfn6m2s\",\"amount\":\"100000000\",\"scriptPublicKey\":\"0000aa20e7a727fc611cf282051b253caac7b5c0331db021f2ab4d4615c89f9a6b7d78b087\",\"blockDaaScore\":\"18446744073709551615\",\"isCoinbase\":false}}],\"outputs\":[{\"value\":\"100000000\",\"scriptPublicKey\":\"000020f5c16567f9eaa48a31b4bf5959ebd2fdbac6671998996a5b8165213e6f38e79eac\"}],\"subnetworkId\":\"0000000000000000000000000000000000000000\",\"lockTime\":\"0\",\"gas\":\"0\",\"mass\":\"0\",\"payload\":\"\"}\n"
        const _buyPrivateKey = new PrivateKey("eb2570115b126c59b76d797d5cc5b21c92af98344f4a5f0c04df159205d10377")
        let txid = await KRC20.send(_buyPrivateKey, sendTx, 100000n)
        console.log("Send txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    // test("transferMulti", async () => {
    //     await Rpc.setInstance(NetworkType.Testnet).connect()
    //     const krc20data = createKrc20Data({
    //         p: "krc-20",
    //         op: OP.Transfer,
    //         tick: "SNOWDN",
    //         to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
    //         amt: "20000000",
    //     })
    //
    //     const requireSigNum = 2;
    //     const useEcdsa = false
    //     let privateKeys = [
    //         "2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941",
    //         "4a6338cdc39ea7ba6503f45bfdca02ff9be5ef1cb4d665ca7e94afe52adabafc",
    //         "eb2570115b126c59b76d797d5cc5b21c92af98344f4a5f0c04df159205d10377",
    //     ]
    //
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