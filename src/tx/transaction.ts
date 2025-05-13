import { Wasm } from "../index";
import { PendingTransaction } from "./pendingTransaction";
import { RawTransaction } from "./rawTransaction";
import { MultiSignTransaction } from "./multiSignTransaction";

class Transaction {

    public static async createTransactions(setting: Wasm.IGeneratorSettingsObject): Promise<PendingTransaction> {
        return PendingTransaction.createTransactions(setting);
    }

    /**
     * creates a transaction.
     *
     * @param address - A list of UTXOs to be used in the transaction of the address.
     * @param outputs - Payment outputs for the transaction.
     * @param priorityFee - (Optional) Transaction fee.
     * @param payload - (Optional) payload in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations to include.
     * @returns A `RawTransaction` instance.
     */
    public static createTransaction(
        address: string,
        outputs: Wasm.IPaymentOutput[],
        priorityFee: bigint,
        payload?: Wasm.HexString | Uint8Array,
        sigOpCount?: number
    ) {
        return RawTransaction.createTransaction(address, outputs, priorityFee, payload, sigOpCount);
    }

    /**
     * creates a transaction.
     *
     * @param entries - A list of UTXOs to be used in the transaction.
     * @param outputs - Payment outputs for the transaction.
     * @param priorityFee - (Optional) Transaction fee.
     * @param payload - (Optional) payload in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations to include.
     * @returns A `RawTransaction` instance.
     */
    public static createTransactionWithEntries(
        entries: Wasm.IUtxoEntry[],
        outputs: Wasm.IPaymentOutput[],
        priorityFee: bigint,
        payload?: Wasm.HexString | Uint8Array,
        sigOpCount?: number
    ) {
        return RawTransaction.createTransactionWithEntries(entries, outputs, priorityFee, payload, sigOpCount);
    }

    /**
     * creates a transaction.
     *
     * @param address - A list of UTXOs to be used in the transaction of the address.
     * @param outputs - Payment outputs for the transaction.
     * @param priorityFee - (Optional) Transaction fee.
     * @param payload - (Optional) payload in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations to include.
     * @returns A `RawTransaction` instance.
     */
    public static async createMultiSignTransaction(
        address: string | Wasm.Address,
        outputs: Wasm.IPaymentOutput[],
        priorityFee?: bigint,
        payload?: Wasm.HexString | Uint8Array,
        sigOpCount?: number
    ): Promise<MultiSignTransaction> {
        return await MultiSignTransaction.createTransaction(address.toString(), outputs, priorityFee, payload, sigOpCount);
    }

    public static createMultiSignTransactionFromJson(json: string): MultiSignTransaction {
        return MultiSignTransaction.createTransactionFromJson(json);
    }
}

export { Transaction };
