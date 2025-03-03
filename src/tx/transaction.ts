import {
    Address,
    IPaymentOutput,
    IUtxoEntry,
    UtxoEntryReference,
    UtxoContext,
    PaymentOutput,
} from "../../wasm/kaspa";
import { PendingTransaction } from "./pendingTransaction";

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
    public static createTransactions(
        address: string | Address,
        outputs: IPaymentOutput[],
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): PendingTransaction {
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
        outputs: PaymentOutput | IPaymentOutput[],
        address: string | Address,
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): PendingTransaction {
        return PendingTransaction.createTransactionsWithEntries(entries, outputs, address, fee, priorityEntries, sigOpCount);
    }
}

export { Transaction };
