import {
    Address,
    PrivateKey,
    IPaymentOutput,
    createTransactions,
    IUtxoEntry,
    UtxoEntryReference,
    UtxoContext,
    PaymentOutput,
    ICreateTransactions,
    ScriptBuilder
} from "../../wasm/kaspa/kaspa";
import { networkToString } from "../utils/utils";
import { Rpc } from "../rpc/client";
import { Kiwi } from "../kiwi";

class PendingTransaction {
    private transaction: ICreateTransactions;

    constructor(transaction: ICreateTransactions) {
        this.transaction = transaction;
    }

    /**
     * Creates raw transactions using predefined UTXOs, outputs, and transaction parameters.
     *
     * @param entries - A list of UTXOs to be used in the transaction.
     * @param outputs - Payment outputs for the transaction.
     * @param address - Address to receive change.
     * @param fee - (Optional) Transaction fee in satoshis.
     * @param priorityEntries - (Optional) UTXOs to prioritize in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations.
     * @returns A promise resolving to an `ICreateTransactions` instance.
     */
    private static async createRawTransactions(
        entries: IUtxoEntry[] | UtxoEntryReference[] | UtxoContext,
        outputs: PaymentOutput | IPaymentOutput[],
        address: string | Address,
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): Promise<ICreateTransactions> {
        return createTransactions({
            priorityEntries,
            entries,
            outputs,
            changeAddress: address,
            priorityFee: fee,
            networkId: networkToString(Kiwi.network),
            sigOpCount,
        });
    }

    /**
     * Creates a transaction using predefined UTXO entries.
     *
     * @param entries - A list of UTXOs to be used in the transaction.
     * @param outputs - Payment outputs for the transaction.
     * @param address - Address to receive change.
     * @param fee - (Optional) Transaction fee in satoshis.
     * @param priorityEntries - (Optional) UTXOs to prioritize in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations.
     * @returns A `PendingTransaction` instance.
     */
    public static async createTransactionsWithEntries(
        entries: IUtxoEntry[] | UtxoEntryReference[] | UtxoContext,
        outputs: PaymentOutput | IPaymentOutput[],
        address: string | Address,
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): Promise<PendingTransaction> {
        const tx = await PendingTransaction.createRawTransactions(entries, outputs, address, fee, priorityEntries, sigOpCount);
        return new PendingTransaction(tx);
    }

    /**
     * Fetches UTXOs for the given address and creates a transaction.
     *
     * @param address - Address for which to retrieve UTXOs.
     * @param outputs - Payment outputs for the transaction.
     * @param fee - (Optional) Transaction fee in satoshis.
     * @param priorityEntries - (Optional) UTXOs to prioritize in the transaction.
     * @param sigOpCount - (Optional) Number of signature operations.
     * @returns A `PendingTransaction` instance.
     */
    public static async createTransactions(
        address: string,
        outputs: IPaymentOutput[],
        fee?: bigint,
        priorityEntries?: [],
        sigOpCount?: number
    ): Promise<PendingTransaction> {
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [address] });
        const tx = await PendingTransaction.createRawTransactions(entries, outputs, address, fee, priorityEntries, sigOpCount);
        return new PendingTransaction(tx);
    }

    /**
     * Signs the transaction using provided private keys.
     *
     * @param privateKeys - List of private keys to sign the transaction.
     * @param script - (Optional) Custom script to use in signature.
     * @returns The updated `PendingTransaction` instance.
     */
    public sign(privateKeys: PrivateKey[], script?: ScriptBuilder, isPskt?:boolean): this {
        if (script) {
            return isPskt ? this.signPskt(privateKeys, script) : this.signReveal(privateKeys, script);
        }
        this.transaction.transactions.forEach(transaction => transaction.sign(privateKeys));
        return this;
    }

    /**
     * Signs the transaction with a single private key and fills the input with a script.
     *
     * @param privateKeys - List of private keys (uses the first one).
     * @param script - Script to use for signing.
     * @returns The updated `PendingTransaction` instance.
     */
    private signReveal(privateKeys: PrivateKey[], script: ScriptBuilder): this {
        const privateKey = privateKeys.shift();
        if (!privateKey) return this;
        // this.transaction = this.transaction.then(async transactions => {
        this.transaction.transactions.forEach(transaction => {
            const inputIndex = transaction.transaction.inputs.findIndex(input => input.signatureScript === '');
            if (inputIndex !== -1) {
                const signature = transaction.createInputSignature(inputIndex, privateKey);
                transaction.fillInput(inputIndex, script.encodePayToScriptHashSignatureScript(signature));
            }
        });
            // return transactions;
        // });
        return this;
    }

    public signPskt(privateKeys: PrivateKey[], script: ScriptBuilder): this  {
        const privateKey = privateKeys.shift();
        if (!privateKey) return this;
        // this.transaction = this.transaction.then(async transactions => {
        this.transaction.transactions.forEach((transaction, index) => {
            transaction.fillInput(index, script.toString());
            transaction.sign([privateKey], false);
        });
            // return transactions;
        // })
        return this;
    }

    /**
     * Signs the transaction with multiple private keys and a script.
     *
     * @param privateKeys - List of private keys.
     * @param script - Custom script to use in the signature.
     * @returns The updated `PendingTransaction` instance.
     */
    public multiSign(privateKeys: PrivateKey[], script: ScriptBuilder): this {
        // this.transaction = this.transaction.then(async transactions => {
        //     for (const transaction of transactions.transactions) {
        //         transaction.transaction.inputs.forEach((_, i) => {
        //             const signatures = privateKeys.map(pk => transaction.createInputSignature(i, pk)).join('');
        //             transaction.fillInput(i, signatures + script.toString());
        //         });
        //     }
        //     return transactions;
        // });
        return this;
    }

    /**
     * Submits the signed transaction to the network.
     *
     * @returns A promise resolving to the final transaction ID.
     */
    public async submit(): Promise<string | undefined> {
        const client = Rpc.getInstance().client;
        for (const transaction of this.transaction.transactions) {
            await transaction.submit(client);
        }
        return this.transaction.summary.finalTransactionId;
    }
}

export { PendingTransaction };
