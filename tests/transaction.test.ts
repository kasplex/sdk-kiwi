import { describe, it } from 'vitest';
import { addressFromScriptPublicKey, NetworkType, PrivateKey, SighashType } from '../wasm/kaspa/kaspa';
import { Script } from '../src/script/script';
import { createKrc20Data, networkToString } from '../src/utils/utils';
import { OP } from '../src/utils/enum';
import { Rpc } from '../src/rpc/client';
import { Transaction } from '../src/tx/transaction';
import { Entries } from '../src/tx/entries';
import { Kiwi } from '../src/kiwi';
import { Output } from '../src/tx/output';
import { BASE_KAS_TO_P2SH_ADDRESS } from '../src/utils/constants';

let toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
let privateKey = new PrivateKey("3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828")

describe('Transaction', () => {

    Kiwi.setNetwork(NetworkType.Testnet);

    it('transaction demo1', async () => {
        await Rpc.setInstance(Kiwi.network).connect()

        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString()

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([address])
        const outputs = Output.createOutputs(toAddress, BASE_KAS_TO_P2SH_ADDRESS);

        let tx = await Transaction.createTransactions({
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
        await Rpc.setInstance(NetworkType.Testnet).connect()

        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'SNOWDN',
        })

        const script = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), krc20data)
        const scriptPublicKey = script.createPayToScriptHashScript()
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;

        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString()
        const outputs = Output.createOutputs(p2shAddress.toString(), BASE_KAS_TO_P2SH_ADDRESS);
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([address])
        let commitTx = await Transaction.createTransactions({
            changeAddress: address,
            outputs: outputs,
            priorityFee: 100000n,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        })
        const commitTxid = await commitTx.sign([privateKey]).submit()
        console.log("reveal tx", commitTxid!)

        let revealEntries = Entries.revealEntries(p2shAddress, commitTxid!, scriptPublicKey)
        let revealTx = await Transaction.createTransactions({
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