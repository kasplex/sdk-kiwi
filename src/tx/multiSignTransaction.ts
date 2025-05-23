import { Wasm } from "../index";
import { Rpc } from '../rpc/client';
/**
 * Represents a raw Kaspa transaction, providing methods for creation and signing.
 */
class MultiSignTransaction {
    public transaction: Wasm.Transaction;

    /**
     * Initializes a new instance of `RawTransaction` with a given transaction object.
     *
     * @param transaction - The transaction object.
     */
    constructor(transaction: Wasm.Transaction) {
        this.transaction = transaction;
    }

    public static async createTransaction(
        address: string,
        outputs: Wasm.IPaymentOutput[],
        priorityFee?: bigint,
        payload?: Wasm.HexString | Uint8Array,
        sigOpCount?: number
    ): Promise<MultiSignTransaction> {
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [address] });
        let total = entries.reduce((agg, curr) => {
            return curr.amount + agg;
        }, 0n);
        if (priorityFee == undefined || priorityFee === 0n) {
            priorityFee = 10000n
        }
        let left = total - priorityFee
        outputs.forEach(output => {
            left -= output.amount
        })
        outputs.push({ address: address, amount: left })
        let tx = Wasm.createTransaction(entries, outputs, priorityFee, payload, sigOpCount)
        console.log("tx", tx)

        return new MultiSignTransaction(tx)
    }

    public static createTransactionFromJson(
        json: string,
    ): MultiSignTransaction {
        let tx = Wasm.Transaction.deserializeFromSafeJSON(json)
        return new MultiSignTransaction(tx)
    }

    /**
     * Signs the transaction using the provided private key.
     *
     * @param privateKey - The private key used for signing.
     * @param script - A custom script used for signature encoding.
     * @param sigHashType - The signature hash type (optional).
     * @returns The updated instance of `RawTransaction`.
     */
    public sign(privateKey: Wasm.PrivateKey, script: Wasm.ScriptBuilder, sigHashType?: Wasm.SighashType): this {
        let length = this.transaction.inputs.length;
        for (var i = 0; i < length; i++) {
            const signature = Wasm.createInputSignature(this.transaction, i, privateKey, sigHashType);
            if (this.transaction.inputs[i].signatureScript) {
                this.transaction.inputs[i].signatureScript += signature
            } else {
                this.transaction.inputs[i].signatureScript = signature;
            }
            this.transaction.payload
        }
        return this;
    }


    /**
     * Signs the transaction using the provided private key.
     *
     * @param privateKey - The private key used for signing.
     * @param sigHashType - The signature hash type (optional).
     * @returns The updated instance of `RawTransaction`.
     */
    public signMessages(privateKey: Wasm.PrivateKey, sigHashType?: Wasm.SighashType): string[] {
        let resp = []
        let length = this.transaction.inputs.length;
        for (var i = 0; i < length; i++) {
            const signature = Wasm.createInputSignature(this.transaction, i, privateKey, sigHashType);
            resp.push(signature)
        }
        return resp;
    }

    /**
     * Signs the transaction using the provided private key.
     *
     * @param signMessage - The signed message.
     * @returns The updated instance of `RawTransaction`.
     */
    public combineSignMessages(signMessage: string[][]): this {
        let length = this.transaction.inputs.length;
        for (var i = 0; i < length; i++) {
            let sign = ""
            signMessage.forEach(signs => {
                sign += signs[i]
            })
            this.transaction.inputs[i].signatureScript = sign;
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
     * Signs the transaction using the provided private key.
     *
     * @param privateKey - The private key used for signing.
     * @param script - A custom script used for signature encoding.
     * @param sigHashType - The signature hash type (optional).
     * @returns The updated instance of `RawTransaction`.
     */
    public signScript(script: Wasm.ScriptBuilder, sigHashType?: Wasm.SighashType): this {
        let length = this.transaction.inputs.length;
        for (var i = 0; i < length; i++) {
            this.transaction.inputs[i].signatureScript += script.toString();
        }
        return this;
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

export { MultiSignTransaction };
