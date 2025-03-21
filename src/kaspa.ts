import {
    Address, type IPaymentOutput,
    PrivateKey
} from 'kasp-platform';;
import { Kiwi } from "@/kiwi";
import { Transaction } from "./tx/transaction";
import { Output } from "./tx/output";
import { Rpc } from '@/rpc/client';

class Kaspa {

    public static async transferKas(privateKey: PrivateKey, toAddress: string | Address, amount: bigint, fee?: bigint | undefined) {
        const outputs = Output.createOutputs(toAddress.toString(), amount)
        return Kaspa.transfer(privateKey, outputs, fee)
    }

    public static async transfer(privateKey: PrivateKey, outputs: IPaymentOutput[], fee?: bigint | undefined) {
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
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())
    }
}

export { Kaspa };