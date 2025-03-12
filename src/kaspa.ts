import {
    Address,
    PrivateKey, ScriptBuilder,
} from "../wasm/kaspa/kaspa";
import { Kiwi } from "@/kiwi";
import {Transaction} from "./tx/transaction";
import { Output } from "./tx/output";

class Kaspa {

    /**
     * Transfers KASPA from a single-signature address to another address.
     * 
     * @param {PrivateKey} privateKey - The private key of the sender.
     * @param {string | Address} address - The recipient's address.
     * @param {bigint} amount - The amount of KASPA to transfer.
     * @param {bigint | undefined} fee - The transaction fee (optional).
     * @returns {Promise<any>} - A promise that resolves when the transaction is submitted.
     */
    public static async transferKas(privateKey: PrivateKey, address: string | Address, amount: bigint, fee?: bigint | undefined) {
        const fromAddress = privateKey.toKeypair().toAddress(Kiwi.network).toString()
        const outputs = Output.createOutputs(address.toString(), amount)
        let tx = await Transaction.createTransactions(fromAddress, outputs, fee)
        return tx.sign([privateKey]).submit()
    }

    /**
     * Transfers KASPA from a multi-signature address to another address.
     * 
     * @param {string | Address} fromAddress - The sender's multi-signature address.
     * @param {number} signTotal - The total number of signatures required.
     * @param {ScriptBuilder} script - The script builder for the multi-signature address.
     * @param {string[]} privateKeyStr - An array of private keys for signing.
     * @param {string} address - The recipient's address.
     * @param {bigint} amount - The amount of KASPA to transfer.
     * @param {bigint | undefined} fee - The transaction fee (optional).
     * @returns {Promise<any>} - A promise that resolves when the transaction is submitted.
     */

    public static async transferKasFromMultiSignAddress(fromAddress: string | Address, signTotal: number, script: ScriptBuilder, privateKeyStr: string[], address: string, amount: bigint, fee?: bigint | undefined) {
        const outputs = Output.createOutputs(address, amount)
        let privateKeys = privateKeyStr.map( r => {
            return new PrivateKey(r)
        })
        let tx = await Transaction.createTransactions(fromAddress, outputs, fee, [], signTotal)
        return tx.multiSign(privateKeys, script).submit()
    }
}

export { Kaspa };