import { describe, test } from 'vitest';
import { NetworkType, Wasm, Kiwi, KRC20, Enum, Rpc, Utils } from '@kasplex/kiwi';

describe('Transaction', () => {

    let _toAddress = 'kaspatest:qp5aflmtqc9zk9s8cnlkne7sxh895eqqjscpad0wgjpjxtrgqszy55v22vejn'
    let privateKeyStr = ""
    let _privateKey = new Wasm.PrivateKey(privateKeyStr)
    Kiwi.setNetwork(Wasm.NetworkType.Testnet)

    test('mint', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'TCKFE',
        })
        let txid = await KRC20.mint(_privateKey, krc20data, 100000n)
        console.log("Mint txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('krc20 opration: the commit demo', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'TCKFE',
        })
        const committxid = await KRC20.executeCommit(_privateKey, krc20data, 10000n)
        console.log("commit txid: ", committxid!)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('krc20 opration: the reveal demo', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'TCKFE',
        })
        const commitTxid = "8cd0632adf7f60fd70dbfb372ba54251c0374ba5609c87a07348c339b1af610d"
        const committxid = await KRC20.executeReveal(_privateKey, krc20data, commitTxid)
        console.log("commit txid: ", committxid!)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('mint times', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'JMSIS',
        })
        let mintTimes = 2;
        await KRC20.multiMint(_privateKey, krc20data, 10000n, mintTimes, (index, txid) => {
            console.log("current mint index:", index, txid)
        })
        await Rpc.getInstance().disconnect()
    }, 300000)

    test('mint times with resue utxo', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'JMSER',
        })
        let mintTimes = 4
        await KRC20.multiMintWithReuseUtxo(_privateKey, krc20data, 10000n, mintTimes, (index, txid) => {
            console.log("current mint index:", index, txid)
        })
        await Rpc.getInstance().disconnect()
    }, 300000)

    test('transfer', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Transfer,
            tick: "JMSIS",
            to: _toAddress,
            amt: "100000000",
        })
        let txid = await KRC20.transfer(_privateKey, krc20data, 100000n)
        console.log("Transfer txid", txid)
        await Rpc.getInstance().disconnect()

        // await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        // const krc20data = Utils.createKrc20Data({
        //     p: "krc-20",
        //     op: Enum.OP.Transfer,
        //     ca: "4ec279c72ade6d2a9a7fd2022fee6aa2067271f0a049038a4088fd094ef90c33",
        //     amt: "100000000",
        //     to: _toAddress,
        // })
        // let txid = await KRC20.transfer(_privateKey, krc20data, 100000n)
        // console.log("Transfer txid", txid)
        // await Rpc.getInstance().disconnect()
    }, 50000)

    test('deploy', async () => {
        console.log('deploy start')
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const deploydata = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Deploy,
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
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.List,
            tick: "KFWFS",
            amt: "10000000",
        })
        let txid = await KRC20.list(_privateKey, krc20data, 100000n)
        console.log("List txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('sendTransaction create send Transation with krc20 price', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Send,
            tick: "KFWFS",
        })
        const hash = "dc7af0edb5e781e403075f41cc7b357d5dc2079e42eba07756015f9a11c8b102"
        let sendTx = await KRC20.sendTransaction(_privateKey, krc20data, hash,250000000n, "")
        console.log("Send tx", sendTx)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('send', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const sendTx = "{\"id\":\"ef205ae6555ce88887a670c2bc34dcb94c7d14d80e5e71ad242aae075da42d7b\",\"version\":0,\"inputs\":[{\"transactionId\":\"dc7af0edb5e781e403075f41cc7b357d5dc2079e42eba07756015f9a11c8b102\",\"index\":0,\"sequence\":\"0\",\"sigOpCount\":1,\"signatureScript\":\"4115a7a69bc88fa1847ad93a0a56afbd567062cc697ea01b994bddc4bf3a22484985be6fcfc3a280838bd0c0179e2b86a42f9cce02bd9d7bff6005a27b424076ef844c5820f5c16567f9eaa48a31b4bf5959ebd2fdbac6671998996a5b8165213e6f38e79eac0063076b6173706c657800297b2270223a226b72632d3230222c226f70223a2273656e64222c227469636b223a224b46574653227d68\",\"utxo\":{\"address\":\"kaspatest:prn6wfluvyw09qs9rvjne2k8khqrx8dsy8e2kn2xzhyflxnt04utq7zfn6m2s\",\"amount\":\"100000000\",\"scriptPublicKey\":\"0000aa20e7a727fc611cf282051b253caac7b5c0331db021f2ab4d4615c89f9a6b7d78b087\",\"blockDaaScore\":\"18446744073709551615\",\"isCoinbase\":false}}],\"outputs\":[{\"value\":\"250000000\",\"scriptPublicKey\":\"000020f5c16567f9eaa48a31b4bf5959ebd2fdbac6671998996a5b8165213e6f38e79eac\"}],\"subnetworkId\":\"0000000000000000000000000000000000000000\",\"lockTime\":\"0\",\"gas\":\"0\",\"mass\":\"0\",\"payload\":\"\"}\n"
        const _buy  = new Wasm.PrivateKey("")
        let txid = await KRC20.send(_buy, sendTx, 100000n)
        console.log("Send txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test("transferMulti", async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Transfer,
            tick: "SNOWDN",
            to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
            amt: "20000000",
        })

        const requireSigNum = 2;
        const useEcdsa = false
        let privateKeys = [
            "",
            "",
            "",
        ]

        let publicKeys = [
            "",
            "",
            "",
        ]
        // let txid = await KRC20.transferMulti(requireSigNum, publicKeys, krc20data, privateKeys, useEcdsa, 10000n)
        // console.log("TransferMulti txid", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('deploy issue', async () => {
        console.log('deploy start')
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const deploydata = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Deploy,
            mod: "issue",
            name: "JMESM",
            to: "",
            max: "1000000000000",
            dec: "8",
            pre: "",
        })
        let txid = await KRC20.deploy(_privateKey, deploydata)
        console.log("Deploy txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('OP issue', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const issuedata = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Issue,
            ca: "4ec279c72ade6d2a9a7fd2022fee6aa2067271f0a049038a4088fd094ef90c33",
            amt: "9901000000000000",
            to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
        })
        let txid = await KRC20.issue(_privateKey, issuedata)
        console.log("Issue txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('OP burn', async () => {
        // await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        // const burndata = Utils.createKrc20Data({
        //     p: "krc-20",
        //     op: Enum.OP.Burn,
        //     tick: "JMSIS",
        //     amt: "9900000000",
        // })
        // let txid = await KRC20.burn(_privateKey, burndata)
        // console.log("Issue txsh", txid)
        // await Rpc.getInstance().disconnect()


        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const issuedata = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Burn,
            ca: "4ec279c72ade6d2a9a7fd2022fee6aa2067271f0a049038a4088fd094ef90c33",
            amt: "9900000000",
        })
        let txid = await KRC20.burn(_privateKey, issuedata)
        console.log("Issue txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)


    test('OP blacklist', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const issuedata = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Blacklist,
            ca: "4ec279c72ade6d2a9a7fd2022fee6aa2067271f0a049038a4088fd094ef90c33",
            mod: "remove",
            to: "kaspatest:qrek4ydvt0jxpxeu2fnjp8phnf4mfmtw3q2mj2693njft294eg34wuyp5vc67",
        })
        let txid = await KRC20.blacklist(_privateKey, issuedata)
        console.log("Issue txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

    test('OP chown', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()
        const issuedata = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Chown,
            ca: "4ec279c72ade6d2a9a7fd2022fee6aa2067271f0a049038a4088fd094ef90c33",
            to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
        })
        let txid = await KRC20.chown(_privateKey, issuedata)
        console.log("Issue txsh", txid)
        await Rpc.getInstance().disconnect()
    }, 50000)

})