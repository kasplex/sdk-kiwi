import {
    Address,
    IPaymentOutput,
    IUtxoEntry,
    UtxoEntryReference,
    UtxoContext,
    HexString,
} from "../../wasm/kaspa/kaspa";
import { PendingTransaction } from "./pendingTransaction";
import { RawTransaction } from "./rawTransaction";
import { MultiSignTransaction } from "./multiSignTransaction";

class Transaction {
    /**
     * Creates a new transaction by retrieving UTXOs for the given address and generating raw transactions.
     *
     * @param address - The address from which to retrieve UTXOs.
     * @param outputs - Payment outputs for the transaction.
     * @param fee - (Optional) Transaction fee in satoshis.
     * @param priorityEntries - (Optional) UTXOs to prioritize in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations to include.
     * @returns A `PendingTransaction` instance representing the created transaction.
     */
    public static async createTransactions(
        address: string | Address,
        outputs: IPaymentOutput[],
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): Promise<PendingTransaction> {
        return PendingTransaction.createTransactions(address.toString(), outputs, fee, priorityEntries, sigOpCount);
    }

    /**
     * Creates a new transaction using a predefined set of UTXO entries instead of fetching them dynamically.
     *
     * @param entries - A list of UTXOs to be used in the transaction.
     * @param outputs - Payment outputs for the transaction.
     * @param address - Change address for the transaction.
     * @param fee - (Optional) Transaction fee in satoshis.
     * @param priorityEntries - (Optional) UTXOs to prioritize in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations to include.
     * @returns A `PendingTransaction` instance representing the created transaction.
     */
    public static createTransactionsWithEntries(
        entries: IUtxoEntry[] | UtxoEntryReference[] | UtxoContext,
        outputs: IPaymentOutput[],
        address: string | Address,
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): Promise<PendingTransaction> {
        return PendingTransaction.createTransactionsWithEntries(entries, outputs, address, fee, priorityEntries, sigOpCount);
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
        outputs: IPaymentOutput[],
        priorityFee: bigint,
        payload?: HexString | Uint8Array,
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
        entries: IUtxoEntry[],
        outputs: IPaymentOutput[],
        priorityFee: bigint,
        payload?: HexString | Uint8Array,
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
        address: string | Address,
        outputs: IPaymentOutput[],
        priorityFee?: bigint,
        payload?: HexString | Uint8Array,
        sigOpCount?: number
    ): Promise<MultiSignTransaction> {
        return await MultiSignTransaction.createTransaction(address.toString(), outputs, priorityFee, payload, sigOpCount);
    }

    public static createMultiSignTransactionFromJson(json: string): MultiSignTransaction {
        return MultiSignTransaction.createTransactionFromJson(json);
    }
}

export { Transaction };
