import {
    type Address,
    addressFromScriptPublicKey,
    ITransactionOutput,
    kaspaToSompi,
    PrivateKey,
    ScriptBuilder,
    ScriptPublicKey,
    SighashType,
    Transaction as KaspaTransaction,
    type UtxoEntryReference
} from '../wasm/kaspa/kaspa';

import { Krc20Data } from './types/interface';
import { Kiwi } from './kiwi';
import { OP } from './utils/enum';
import { Transaction } from './tx/transaction';
import { Entries } from './tx/entries';
import { Script } from './script/script';
import { BASE_P2SH_TO_KASPA_ADDRESS, DEFAULT_FEE } from './utils/constants';
import { createKrc20Data, getFeeByOp } from './utils/utils';
import { ValidateKrc20Data } from './check';
import { Output } from './tx/output';
import { Rpc } from '@/rpc/client';

class KRC20 {

    public static async executeCommit(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
        ValidateKrc20Data.validate(data);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();

        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        let { p2shFee, priorityFee } = this.getFeeInfo(data.op)
        const outputs = Output.createOutputs(p2shAddress.toString(), p2shFee);

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress])
        return Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: outputs,
            priorityFee: fee,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())
    }

    public static async executeReveal(privateKey: PrivateKey, data: Krc20Data, commitTxid: string) {
        ValidateKrc20Data.validate(data);
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();

        let { p2shFee, priorityFee } = this.getFeeInfo(data.op)
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([p2shAddress])
        const entry = entries.find(entry => {
            return entry.entry.outpoint.transactionId === commitTxid
        })
        if (entry == undefined) throw Error("commit txid not find")
        priorityFee = priorityFee === 0n ? 100000n : priorityFee;
        return Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: [],
            priorityFee: priorityFee,
            entries: [entry!],
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey], script).submit())
    }

    /**
     * Executes a KRC20 operation.
     * @param privateKey - The private key.
     * @param data - The KRC20 data.
     * @param fee - The transaction fee.
     * @returns The submitted transaction ID.
     */
    public static async executeOperation(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
        ValidateKrc20Data.validate(data);
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();

        let { p2shFee, priorityFee } = this.getFeeInfo(data.op)
        const outputs = Output.createOutputs(p2shAddress.toString(), p2shFee);

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress])
        const commitTxid = await Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: outputs,
            priorityFee: fee,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())

        const revealEntries = Entries.revealEntries(p2shAddress, commitTxid!, script.createPayToScriptHashScript(), p2shFee);
        priorityFee = priorityFee === 0n ? 100000n : priorityFee;

        return Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: [],
            priorityFee: priorityFee,
            entries: revealEntries,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey], script).submit())
    }

    /**
     * Gets the script public key from a transaction output.
     * @param txOutput - The transaction output.
     * @returns The script public key.
     */
    private static getScriptPublicKey(txOutput: ITransactionOutput) {
        if (typeof txOutput.scriptPublicKey === 'string') {
            return txOutput.scriptPublicKey;
        } else if ('toJSON' in txOutput.scriptPublicKey && 'free' in txOutput.scriptPublicKey) {
            return txOutput.scriptPublicKey as ScriptPublicKey;
        } else {
            throw new Error('Invalid scriptPublicKey type');
        }
    }

    /**
     * Mints new KRC20 tokens.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing mint details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async mint(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
        if (data.op !== OP.Mint) throw new Error("Invalid input: 'op' must be 'mint'")
        return await KRC20.executeOperation(privateKey, data, fee)
    }

    /**
     * Deploys a new KRC20 token contract.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing deployment details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async deploy(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
        if (data.op !== OP.Deploy) throw new Error("Invalid input: 'op' must be 'deploy'")
        return await KRC20.executeOperation(privateKey, data, fee)
    }

    /** 
     * Transfers KRC20 tokens to another address.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing transfer details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async transfer(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
        if (!data.to || !data.amt) throw new Error("Invalid input: 'to' and 'amt' must be provided")
        return await KRC20.executeOperation(privateKey, data, fee)
    }

    /**
     * Lists KRC20 token details.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing listing details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async list(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
        if (data.op !== OP.List) throw new Error("Invalid input: 'op' must be 'list'")
        ValidateKrc20Data.validate(data)

        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();

        let { p2shFee, priorityFee } = this.getFeeInfo(data.op)
        const outputs = Output.createOutputs(p2shAddress.toString(), p2shFee);

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress])
        const commitTxid = await Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: outputs,
            priorityFee: fee,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())

        const revealEntries = Entries.revealEntries(p2shAddress, commitTxid!, script.createPayToScriptHashScript(), p2shFee);
        priorityFee = priorityFee === 0n ? 100000n : priorityFee;

        let sendKrc20Data = createKrc20Data({
            p: "krc-20",
            op: OP.Send,
            tick: data.tick,
        })
        let sendScript = KRC20.createScript(privateKey, sendKrc20Data)
        const SendP2SHAddress = addressFromScriptPublicKey(sendScript.createPayToScriptHashScript(), Kiwi.network)!;
        let sendOutputs = Output.createOutputs(SendP2SHAddress.toString(), DEFAULT_FEE)

        return Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: sendOutputs,
            priorityFee: priorityFee,
            entries: revealEntries,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey], script).submit())
    }

    /**
     * Signs a transaction.
     * @param privateKey - The private key.
     * @param data - The KRC20 data.
     * @param hash - The transaction hash.
     * @param amount - The amount.
     * @param fee - The fee.
     * @returns The serialized transaction.
     */
    public static async sendTransaction(privateKey: PrivateKey, data: Krc20Data, hash: string, amount: bigint, payload: string = "") {
        if (data.op !== OP.Send) {
            throw new Error("Invalid input: 'op' must be 'send'");
        }
        const script = KRC20.createScript(privateKey, data);
        const scriptPublicKey = script.createPayToScriptHashScript();
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;

        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [p2shAddress.toString()] });
        const entry = entries.find(entry => entry.entry.outpoint.transactionId === hash);
        if (entry == undefined) throw Error("commit txid not find")

        const output = Output.createOutputs(fromAddress, amount);
        const revealEntries = Entries.revealEntries(p2shAddress, hash, scriptPublicKey, entry.amount);
        return Transaction.createTransactionWithEntries(revealEntries, output, 0n, payload, 1)
            .sign(privateKey, script, SighashType.SingleAnyOneCanPay).toJson()
    }

    /**
     * Sends KRC20 tokens to another address.
     * @param privateKey - The private key for signing the transaction.
     * @param sendTx - The KRC20 data containing send details.
     * @param priorityFee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async send(privateKey: PrivateKey, sendTx: string, priorityFee: bigint = 0n) {
        let send = KaspaTransaction.deserializeFromSafeJSON(sendTx);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network);

        let { entries } = await Rpc.getInstance().client.getUtxosByAddresses({addresses: [fromAddress.toString()]});
        // @ts-ignore
        send.inputs.forEach(input => entries.unshift(input.utxo))

        const outputs = send.outputs.map(output => ({
            address: addressFromScriptPublicKey(output.scriptPublicKey, Kiwi.network)!.toString(),
            amount: output.value
        }));

        let sendPending = await Transaction.createTransactions({
            priorityEntries: [],
            changeAddress: fromAddress,
            outputs: outputs,
            priorityFee: priorityFee,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        })
        let sendTransaction = sendPending.transaction
        sendTransaction.transactions[0].fillInput(0, send.inputs[0].signatureScript!);

        for (const transaction of sendPending.transaction.transactions) {
            transaction.sign([privateKey], false);
        }
        return sendPending.submit()
    }

    /**
     * Multi-mints new KRC20 tokens.
     * @param privateKey - The private key string.
     * @param data - The KRC20 data containing mint details.
     * @param fee - The transaction fee.
     * @param executionCount - The number of mint operations to execute.
     * @param callback - callback function.
     * @returns The submitted reveal transaction IDs.
     */
    public static async multiMint(
        privateKey: PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        executionCount: number = 1,
        callback?: (current: number, txid: string) => void
    ) : Promise<undefined> {
        if (data.op !== OP.Mint) throw new Error("Invalid input: 'op' must be 'mint'");
        if (executionCount < 1) throw new Error("Invalid executionCount");

        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const mintFee = getFeeByOp(OP.Mint);

        let payToP2SHAmount = mintFee * BigInt(executionCount) + BASE_P2SH_TO_KASPA_ADDRESS
        const outputs = Output.createOutputs(p2shAddress.toString(), payToP2SHAmount);

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress])
        let commitTxid = await Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: outputs,
            priorityFee: fee,
            entries: entries,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())

        let publicKey = script.createPayToScriptHashScript()
        for (let i = 0; i < executionCount; i++) {
            const revealEntries = Entries.revealEntries(p2shAddress, commitTxid!, publicKey, payToP2SHAmount);
            const recipientAddress = i === executionCount - 1 ? fromAddress : p2shAddress.toString();
            const revealTx = await Transaction.createTransactions({
                changeAddress: recipientAddress,
                outputs: [],
                priorityFee: mintFee,
                entries: revealEntries,
                networkId: Kiwi.getNetworkID(),
            })
            commitTxid = await revealTx.sign([privateKey], script).submit();
            payToP2SHAmount -= revealTx.transaction.summary.fees;
            if (callback && typeof callback === 'function') {
                try {
                    callback(i + 1, commitTxid!);
                } catch (error) {
                    console.warn(`Callback error at step ${i + 1}:`, error);
                }
            }
        }
        return;
    }

    /**
     * Get the fee information based on the operation type.
     *
     * @param op - The operation type (e.g., 'mint', 'deploy', 'transfer').
     * @returns An object containing the P2SH fee and priority fee.
     */
    private static getFeeInfo(op: OP) {
        const priorityFee = getFeeByOp(op);
        const p2shFee = (priorityFee === 0n ? DEFAULT_FEE : priorityFee) + BASE_P2SH_TO_KASPA_ADDRESS;
        return { p2shFee, priorityFee };
    }

    /**
     * Creates a KRC20 script.
     * @param privateKey - The private key.
     * @param data - The KRC20 data.
     * @returns The generated script.
     */
    private static createScript(privateKey: PrivateKey, data: Krc20Data): ScriptBuilder {
        return Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
    }

    /**
     * Creates a P2SH address from a script.
     * @param script - The script.
     * @returns The P2SH address.
     */
    private static createP2SHAddress(script: ScriptBuilder): Address {
        return addressFromScriptPublicKey(script.createPayToScriptHashScript(), Kiwi.network)!;
    }
}

export { KRC20 };
