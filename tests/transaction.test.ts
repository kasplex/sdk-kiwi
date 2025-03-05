import { describe, it, expect } from 'vitest';
import {addressFromScriptPublicKey, NetworkType, PrivateKey} from "../src/wasm/kaspa";
import { Script } from '../src/script/script';
import { createKrc20Data, networkToString } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Rpc } from '../src/rpc/client';
import { Transaction } from "../src/tx/transaction";
import { Entries } from '../src/tx/entries';
import { Kiwi } from '../src/kiwi';
import { Output } from '../src/tx/output';
import { BASE_KAS_TO_P2SH_ADDRESS } from "../src/utils/constants";

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

        const script = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), krc20data)
        const scriptPublicKey = script.createPayToScriptHashScript()
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;

        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString()

        const outputs = Output.createOutputs(p2shAddress.toString(), BASE_KAS_TO_P2SH_ADDRESS);

        const commitTx = await Transaction.createTransactions(address, outputs, 0n).sign([privateKey]).submit()

        let revealEntries = Entries.revealEntries(p2shAddress, commitTx!, scriptPublicKey)

        const revealTx = await Transaction.createTransactionsWithEntries(revealEntries, [], address, 100000000n)
            .sign([privateKey], script).submit()
        console.log("reveal tx", revealTx)

        await Rpc.getInstance().disconnect()
    }, 20000)
})