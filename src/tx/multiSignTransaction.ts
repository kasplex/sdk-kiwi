import {
    PrivateKey,
    IPaymentOutput,
    createTransaction,
    IUtxoEntry,
    ScriptBuilder,
    HexString,
    Transaction,
    createInputSignature,
    createTransactions,
    PendingTransaction,
    SighashType
} from "../../wasm/kaspa/kaspa";
import { Rpc } from '@/rpc/client';
import { transaction_set_payload_from_js_value } from '../../wasm/kaspa/kaspa_bg.wasm';

/**
 * Represents a raw Kaspa transaction, providing methods for creation and signing.
 */
class MultiSignTransaction {
    public transaction: Transaction;

    /**
     * Initializes a new instance of `RawTransaction` with a given transaction object.
     *
     * @param transaction - The transaction object.
     */
    constructor(transaction: Transaction) {
        this.transaction = transaction;
    }

    public static async createTransaction(
        address: string,
        outputs: IPaymentOutput[],
        priorityFee?: bigint,
        payload?: HexString | Uint8Array,
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
        let tx = createTransaction(entries, outputs, priorityFee, payload, sigOpCount)
        console.log("tx", tx)

        return new MultiSignTransaction(tx)
    }

    public static createTransactionFromJson(
        json: string,
    ): MultiSignTransaction {
        let tx = Transaction.deserializeFromSafeJSON(json)
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
    public sign(privateKey: PrivateKey, script: ScriptBuilder, sigHashType?: SighashType): this {
        let length = this.transaction.inputs.length;
        for (var i = 0; i < length; i++) {
           const signature = createInputSignature(this.transaction, i, privateKey, sigHashType);
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
    public signMessages(privateKey: PrivateKey, sigHashType?: SighashType): string[] {
        let resp = []
        let length = this.transaction.inputs.length;
        for (var i = 0; i < length; i++) {
            const signature = createInputSignature(this.transaction, i, privateKey, sigHashType);
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
    public signScript(script: ScriptBuilder, sigHashType?: SighashType): this {
        console.log(3333)
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
