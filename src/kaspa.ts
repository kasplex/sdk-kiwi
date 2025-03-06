import {
    Address,
    PrivateKey, ScriptBuilder,
} from "@/wasm/kaspa";
import { Kiwi } from "@/kiwi";
import {Transaction} from "./tx/transaction";
import { Output } from "./tx/output";

class Kaspa {

    public static async transferKas(privateKey: PrivateKey, address: string | Address, amount: bigint, fee?: bigint | undefined) {
        const fromAddress = privateKey.toKeypair().toAddress(Kiwi.network).toString()
        const outputs = Output.createOutputs(address.toString(), amount)
        return Transaction.createTransactions(fromAddress, outputs, fee).sign([privateKey]).submit()
    }

    public static async transferKasFromMultiSignAddress(fromAddress: string | Address, signTotal: number, script: ScriptBuilder, privateKeyStr: string[], address: string, amount: bigint, fee?: bigint | undefined) {
        const outputs = Output.createOutputs(address, amount)
        let privateKeys = privateKeyStr.map( r => {
            return new PrivateKey(r)
        })
        return Transaction.createTransactions(fromAddress, outputs, fee, [], signTotal)
            .multiSign(privateKeys, script).submit()
    }
}

export { Kaspa };