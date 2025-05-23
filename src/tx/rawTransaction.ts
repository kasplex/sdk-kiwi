import { Wasm } from "../index";

import { Rpc } from '../rpc/client';

/**
 * Represents a raw Kaspa transaction, providing methods for creation and signing.
 */
class RawTransaction {
    public transaction: Wasm.Transaction;

    /**
     * Initializes a new instance of `RawTransaction` with a given transaction object.
     *
     * @param transaction - The transaction object.
     */
    constructor(transaction: Wasm.Transaction) {
        this.transaction = transaction;
    }

    /**
     * Creates a new transaction.
     *
     * @param entries - A list of UTXOs (Unspent Transaction Outputs) to be used as inputs.
     * @param outputs - The payment outputs for the transaction.
     * @param priorityFee - The transaction fee (optional).
     * @param payload - Additional data to include in the transaction (optional).
     * @param sigOpCount - The number of signature operations to include (optional).
     * @returns A new instance of `RawTransaction`.
     */
    public static createTransactionWithEntries(
        entries: Wasm.IUtxoEntry[],
        outputs: Wasm.IPaymentOutput[],
        priorityFee: bigint,
        payload?: Wasm.HexString | Uint8Array,
        sigOpCount?: number
    ): RawTransaction {
        const tx = Wasm.createTransaction(entries, outputs, priorityFee, payload, sigOpCount);
        return new RawTransaction(tx);
    }

    /**
     * Creates a new transaction.
     *
     * @param entries - A list of UTXOs (Unspent Transaction Outputs) to be used as inputs.
     * @param outputs - The payment outputs for the transaction.
     * @param priorityFee - The transaction fee (optional).
     * @param payload - Additional data to include in the transaction (optional).
     * @param sigOpCount - The number of signature operations to include (optional).
     * @returns A new instance of `RawTransaction`.
     */
    public static async createTransaction(
        address: string,
        outputs: Wasm.IPaymentOutput[],
        priorityFee: bigint,
        payload?: Wasm.HexString | Uint8Array,
        sigOpCount?: number
    ): Promise<RawTransaction> {
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [address] });
        const tx = Wasm.createTransaction(entries, outputs, priorityFee, payload, sigOpCount);
        return new RawTransaction(tx);
    }

    /**
     * Signs the transaction using the provided private key.
     *
     * @param privateKey - The private key used for signing.
     * @param script - A custom script used for signature encoding.
     * @param sigHashType - The signature hash type (optional).
     * @returns The updated instance of `RawTransaction`.
     */
    public sign(privateKey: Wasm.PrivateKey, script?: Wasm.ScriptBuilder, sigHashType?: Wasm.SighashType): this {
        if (script) {
            const length = this.transaction.inputs.length
            for (let i = 0; i < length; i++) {
                const signature = Wasm.createInputSignature(this.transaction, i, privateKey, sigHashType);
                this.transaction.inputs[i].signatureScript = script.encodePayToScriptHashSignatureScript(signature);
            }
        } else {
            this.transaction = Wasm.signTransaction(this.transaction, [privateKey], false)
        }
        return this;
    }

    /**
     * Serializes the transaction into a JSON string format.
     *
     * @returns A JSON representation of the transaction.
     */
    public toJson(): string {
        return this.transaction.serializeToSafeJSON();
    }


    /**
     * Serializes the transaction into a JSON string format.
     *
     * @returns A JSON representation of the transaction.
     */
    public async submit(): Promise<string> {
        let resp = await Rpc.getInstance().client.submitTransaction({ transaction: this.transaction })
        return resp.transactionId
    }
}

export { RawTransaction };
