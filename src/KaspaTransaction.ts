import { Wasm } from "./index";
import { Kiwi } from "./kiwi";
import { Transaction } from "./tx/transaction";
import { Output } from "./tx/output";
import { Rpc } from './rpc/client';

class KaspaTransaction {

    public static async transferKas(privateKey: Wasm.PrivateKey, toAddress: string | Wasm.Address, amount: bigint, fee?: bigint | undefined, payload?: Wasm.HexString | Uint8Array) {
        const outputs = Output.createOutputs(toAddress.toString(), amount)
        return KaspaTransaction.transfer(privateKey, outputs, fee, payload)
    }

    public static async transfer(privateKey: Wasm.PrivateKey, outputs: Wasm.IPaymentOutput[], fee?: bigint | undefined, payload?: Wasm.HexString | Uint8Array,) {
        if (outputs.length === 0) {
            throw new Error("outputs is empty")
        }
        const fromAddress = privateKey.toKeypair().toAddress(Kiwi.network).toString();
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress])
        return await Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: outputs,
            priorityFee: fee,
            entries: entries,
            payload: payload,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())
    }
}

export { KaspaTransaction };