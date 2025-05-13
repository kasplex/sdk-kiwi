import { describe, it } from 'vitest';
import { Wasm, Script, Utils, Kiwi, Tx, Enum, Rpc } from '@kasplex/kiwi';

let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let privateKey = new Wasm.PrivateKey("")

describe('Transaction', () => {

    Kiwi.setNetwork(Wasm.NetworkType.Testnet);

    it('transaction demo1', async () => {
        await Rpc.setInstance(Kiwi.network).connect()

        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString()

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([address])
        const outputs = Tx.Output.createOutputs(toAddress, 130000000n);

        let tx = await Tx.Transaction.createTransactions({
            changeAddress: address,
            outputs: outputs,
            priorityFee: 100000n,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
            payload: "6b6173706c6578"
        })
        const commitTx = await tx.sign([privateKey]).submit()
        console.log("reveal tx", tx.transaction.transactions, commitTx!)
        await Rpc.getInstance().disconnect()
    }, 200000)

    it('transaction for krc20 mint', async () => {
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()

        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'SNOWDN',
        })

        const script = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), krc20data)
        const scriptPublicKey = script.createPayToScriptHashScript()
        const p2shAddress = Wasm.addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;

        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString()
        const outputs = Tx.Output.createOutputs(p2shAddress.toString(), 130000000n);
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([address])
        let commitTx = await Tx.Transaction.createTransactions({
            changeAddress: address,
            outputs: outputs,
            priorityFee: 100000n,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        })
        const commitTxid = await commitTx.sign([privateKey]).submit()
        console.log("reveal tx", commitTxid!)

        let revealEntries = Tx.Entries.revealEntries(p2shAddress, commitTxid!, scriptPublicKey)
        let revealTx = await Tx.Transaction.createTransactions({
            changeAddress: address,
            outputs: [],
            priorityFee: 100000000n,
            entries: revealEntries,
            networkId: Kiwi.getNetworkID(),
        })
        const revealTxid = await revealTx.sign([privateKey], script).submit()
        console.log("reveal tx", revealTxid!)

        await Rpc.getInstance().disconnect()
    }, 20000)
})