import { Wasm } from "./index";

import { Krc20Data, TransferList, EncodablePayload } from './types/interface';
import { Kiwi } from './kiwi';
import { OP } from './utils/enum';
import { Transaction } from './tx/transaction';
import { Entries } from './tx/entries';
import { Script } from './script/script';
import { BASE_P2SH_TO_KASPA_ADDRESS, DEFAULT_FEE } from './utils/constants';
import { createKrc20Data, getFeeByOp } from './utils/utils';
import { ValidateKrc20Data } from './check';
import { Output } from './tx/output';
import { Rpc } from './rpc/client';
import { RawTransaction } from './tx/rawTransaction';

class KRC20 {

    public static async executeCommit(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n) {
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

    public static async executeReveal(privateKey: Wasm.PrivateKey, data: Krc20Data, commitTxid: string, payload?: EncodablePayload) {
        ValidateKrc20Data.validate(data);
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();

        let { priorityFee } = this.getFeeInfo(data.op)
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
            payload: this.normalizePayload(payload),
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey], script).submit())
    }

    private static isHexString(value: string): boolean {
        const hex = value.startsWith('0x') ? value.slice(2) : value;
        return hex.length > 0 && hex.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(hex);
    }

    private static normalizePayload(payload?: EncodablePayload): Uint8Array | undefined {
        if (payload === undefined || payload === null) return undefined;
        if (payload instanceof Uint8Array) return payload;
        if (typeof payload === 'string') {
            if (this.isHexString(payload)) {
                const hex = payload.startsWith('0x') ? payload.slice(2) : payload;
                const bytes = new Uint8Array(hex.length / 2);
                for (let i = 0; i < hex.length; i += 2) {
                    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
                }
                return bytes;
            }
            return new TextEncoder().encode(payload);
        }
        return new TextEncoder().encode(JSON.stringify(payload));
    }

    /**
     * Executes a KRC20 operation.
     * .param privateKey - The private key.
     * .param data - The KRC20 data.
     * .param fee - The transaction fee.
     * .param payload - The transaction payload.
     * .returns The submitted transaction ID.
     */
    public static async executeOperation(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload,) {
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
            payload: this.normalizePayload(payload),
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey], script).submit())
    }


    /**
     * Executes a direct KRC20 payload transaction.
     *
     * This is different from executeOperation/mint/transfer/deploy:
     * - executeOperation uses the original P2SH commit-reveal flow.
     * - executePayloadOperation creates a normal Kaspa transaction with the KRC20 JSON in tx payload.
     *
     * If payload is not provided, the KRC20 data itself will be used as the transaction payload.
     * This keeps the payload in the standard KRC20 JSON shape:
     * { p: "krc-20", op: "mint" | "transfer" | "deploy", ... }
     *
     * If you pass a custom payload, that custom payload will be written instead.
     * Be careful: custom wrapped payload may not be recognized by a standard KRC20 indexer.
     */
    public static async executePayloadOperation(
        privateKey: Wasm.PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        payload?: EncodablePayload,
    ) {
        ValidateKrc20Data.validate(data);

        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const payloadData = payload === undefined ? (data as unknown as EncodablePayload) : payload;
        const normalizedPayload = this.normalizePayload(payloadData);

        if (!normalizedPayload || normalizedPayload.length === 0) {
            throw new Error("Invalid input: payload must not be empty");
        }

        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress]);
        if (!entries || entries.length === 0) {
            throw new Error("No spendable UTXO found for address: " + fromAddress);
        }

        return Transaction.createTransactions({
            changeAddress: fromAddress,
            outputs: [],
            priorityFee: fee,
            entries: entries,
            payload: normalizedPayload,
            networkId: Kiwi.getNetworkID(),
        }).then(r => r.sign([privateKey]).submit())
    }

    /**
     * Mints KRC20 by direct transaction payload.
     *
     * Default payload: data itself.
     * Optional custom payload: pass payload as the 4th arg.
     */
    public static async mintByPayload(
        privateKey: Wasm.PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        payload?: EncodablePayload,
    ) {
        if (data.op !== OP.Mint) throw new Error("Invalid input: 'op' must be 'mint'")
        return await KRC20.executePayloadOperation(privateKey, data, fee, payload)
    }

    /**
     * Transfers KRC20 by direct transaction payload.
     *
     * Required fields: to, amt.
     * Default payload: data itself.
     * Optional custom payload: pass payload as the 4th arg.
     */
    public static async transferByPayload(
        privateKey: Wasm.PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        payload?: EncodablePayload,
    ) {
        if (data.op !== OP.Transfer) throw new Error("Invalid input: 'op' must be 'transfer'")
        if (!data.to || !data.amt) throw new Error("Invalid input: 'to' and 'amt' must be provided")
        return await KRC20.executePayloadOperation(privateKey, data, fee, payload)
    }

    /**
     * Deploys KRC20 by direct transaction payload.
     *
     * Default payload: data itself.
     * Optional custom payload: pass payload as the 4th arg.
     */
    public static async deployByPayload(
        privateKey: Wasm.PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        payload?: EncodablePayload,
    ) {
        if (data.op !== OP.Deploy) throw new Error("Invalid input: 'op' must be 'deploy'")
        return await KRC20.executePayloadOperation(privateKey, data, fee, payload)
    }

    /**
     * Gets the script public key from a transaction output.
     * .param txOutput - The transaction output.
     * .returns The script public key.
     */
    private static getScriptPublicKey(txOutput: Wasm.ITransactionOutput) {
        if (typeof txOutput.scriptPublicKey === 'string') {
            return txOutput.scriptPublicKey;
        } else if ('toJSON' in txOutput.scriptPublicKey && 'free' in txOutput.scriptPublicKey) {
            return txOutput.scriptPublicKey as Wasm.ScriptPublicKey;
        } else {
            throw new Error('Invalid scriptPublicKey type');
        }
    }

    /**
     * Mints new KRC20 tokens.
     * .param privateKey - The private key for signing the transaction.
     * .param data - The KRC20 data containing mint details.
     * .param fee - The transaction fee.
     * .param payload - (Optional) payload in the transaction.
     * .returns The submitted reveal transaction.
     */
    public static async mint(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
        if (data.op !== OP.Mint) throw new Error("Invalid input: 'op' must be 'mint'")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }

    /**
     * Deploys a new KRC20 token contract.
     * .param privateKey - The private key for signing the transaction.
     * .param data - The KRC20 data containing deployment details.
     * .param fee - The transaction fee.
     * .returns The submitted reveal transaction.
     */
    public static async deploy(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
        if (data.op !== OP.Deploy) throw new Error("Invalid input: 'op' must be 'deploy'")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }

    /**
     * Transfers KRC20 tokens to another address.
     * .param privateKey - The private key for signing the transaction.
     * .param data - The KRC20 data containing transfer details.
     * .param fee - The transaction fee.
     * .returns The submitted reveal transaction.
     */
    public static async transfer(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload,) {
        if (data.op !== OP.Transfer) throw new Error("Invalid input: 'op' must be 'transfer'");
        if (!data.to || !data.amt) throw new Error("Invalid input: 'to' and 'amt' must be provided")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }

    /**
     * Lists KRC20 token details.
     * .param privateKey - The private key for signing the transaction.
     * .param data - The KRC20 data containing listing details.
     * .param fee - The transaction fee.
     * .returns The submitted reveal transaction.
     */
    public static async list(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
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
            payload: this.normalizePayload(payload),
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
        const SendP2SHAddress = Wasm.addressFromScriptPublicKey(sendScript.createPayToScriptHashScript(), Kiwi.network)!;
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
     * .param privateKey - The private key.
     * .param data - The KRC20 data.
     * .param hash - The transaction hash.
     * .param amount - The amount.
     * .param fee - The fee.
     * .param payload - The payload.
     * .returns The serialized transaction.
     */
    public static async sendTransaction(privateKey: Wasm.PrivateKey, data: Krc20Data, hash: string, amount: bigint, payload: EncodablePayload) {
        if (data.op !== OP.Send) {
            throw new Error("Invalid input: 'op' must be 'send'");
        }
        const script = KRC20.createScript(privateKey, data);
        const scriptPublicKey = script.createPayToScriptHashScript();
        const p2shAddress = Wasm.addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;

        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [p2shAddress.toString()] });
        const entry = entries.find(entry => entry.entry.outpoint.transactionId === hash);
        if (entry == undefined) throw Error("commit txid not find")

        const output = Output.createOutputs(fromAddress, amount);
        const revealEntries = Entries.revealEntries(p2shAddress, hash, scriptPublicKey, entry.amount);
        return Transaction.createTransactionWithEntries(revealEntries, output, 0n, this.normalizePayload(payload), 1)
            .sign(privateKey, script, Wasm.SighashType.SingleAnyOneCanPay).toJson()
    }

    /**
     * Sends KRC20 tokens to another address.
     * .param privateKey - The private key for signing the transaction.
     * .param sendTx - The KRC20 data containing send details.
     * .param priorityFee - The transaction fee.
     * .returns The submitted reveal transaction.
     */
    public static async send(privateKey: Wasm.PrivateKey, sendTx: string, priorityFee: bigint = 0n) {
        let send = Wasm.Transaction.deserializeFromSafeJSON(sendTx);
        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network);

        let { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [fromAddress.toString()] });
        // .ts-ignore
        send.inputs.forEach(input => {
            if (input.utxo) {
                entries.unshift(input.utxo);
            } else {
                throw new Error("Invalid input: 'utxo' is undefined");
            }
        })

        const outputs = send.outputs.map(output => ({
            address: Wasm.addressFromScriptPublicKey(output.scriptPublicKey as Wasm.ScriptPublicKey, Kiwi.network)!.toString(),
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
     * .param privateKey - The private key string.
     * .param data - The KRC20 data containing mint details.
     * .param fee - The transaction fee.
     * .param executionCount - The number of mint operations to execute.
     * .param callback - callback function.
     * .returns The submitted reveal transaction IDs.
     */
    public static async multiMint(
        privateKey: Wasm.PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        executionCount: number = 1,
        callback?: (current: number, txid: string) => void
    ): Promise<undefined> {
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
            const outputs = Output.createOutputs(recipientAddress.toString(), payToP2SHAmount - mintFee);
            let tx = Wasm.createTransaction(revealEntries, outputs, 0n, '', 1);
            commitTxid = await new RawTransaction(tx).sign(privateKey, script).submit()
            payToP2SHAmount = payToP2SHAmount - mintFee
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
     * Multi-mints new KRC20 tokens.
     * .param privateKey - The private key string.
     * .param data - The KRC20 data containing mint details.
     * .param fee - The transaction fee.
     * .param executionCount - The number of mint operations to execute.
     * .param callback - callback function.
     * .returns The submitted reveal transaction IDs.
     */
    public static async multiMintWithReuseUtxo(
        privateKey: Wasm.PrivateKey,
        data: Krc20Data,
        fee: bigint = 0n,
        executionCount: number = 1,
        callback?: (current: number, txid: string) => void
    ): Promise<undefined> {
        if (data.op !== OP.Mint) throw new Error("Invalid input: 'op' must be 'mint'");
        if (executionCount < 1) throw new Error("Invalid executionCount");

        const fromAddress = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const mintFee = getFeeByOp(OP.Mint);

        let payToP2SHAmount = mintFee * BigInt(executionCount) + BASE_P2SH_TO_KASPA_ADDRESS

        let p2shBalance = await Rpc.getInstance().client.getBalanceByAddress({
            address: p2shAddress.toString()
        })

        let commitTxid = undefined
        let chargeAmount = payToP2SHAmount
        if (payToP2SHAmount > p2shBalance.balance) {
            chargeAmount = payToP2SHAmount - p2shBalance.balance
            const outputs = Output.createOutputs(p2shAddress.toString(), chargeAmount);
            const { entries } = await Rpc.getInstance().client.getUtxosByAddresses([fromAddress])
            commitTxid = await Transaction.createTransactions({
                changeAddress: fromAddress,
                outputs: outputs,
                priorityFee: fee,
                entries: entries,
                networkId: Kiwi.getNetworkID(),
            }).then(r => r.sign([privateKey]).submit())
        }

        let publicKey = script.createPayToScriptHashScript()
        for (let i = 0; i < executionCount; i++) {
            let revealEntries: Wasm.UtxoEntryReference[] | Wasm.IUtxoEntry[] = []
            if (i == 0) {
                revealEntries = (await Rpc.getInstance().client.getUtxosByAddresses([p2shAddress])).entries
                if (commitTxid) {
                    const entries = Entries.revealEntries(p2shAddress, commitTxid!, publicKey, chargeAmount);
                    revealEntries = revealEntries.concat(entries as Wasm.UtxoEntryReference[])
                }
            } else {
                revealEntries = Entries.revealEntries(p2shAddress, commitTxid!, publicKey, payToP2SHAmount);
            }

            const recipientAddress = i === executionCount - 1 ? fromAddress : p2shAddress.toString();
            const outputs = Output.createOutputs(recipientAddress.toString(), payToP2SHAmount - mintFee);
            let tx = Wasm.createTransaction(revealEntries, outputs, 0n, '', 1);
            commitTxid = await new RawTransaction(tx).sign(privateKey, script).submit()

            payToP2SHAmount = payToP2SHAmount - mintFee
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
     * .param op - The operation type (e.g., 'mint', 'deploy', 'transfer').
     * .returns An object containing the P2SH fee and priority fee.
     */
    private static getFeeInfo(op: OP) {
        const priorityFee = getFeeByOp(op);
        const p2shFee = (priorityFee === 0n ? DEFAULT_FEE : priorityFee) + BASE_P2SH_TO_KASPA_ADDRESS;
        return { p2shFee, priorityFee };
    }

    /**
     * Creates a KRC20 script.
     * .param privateKey - The private key.
     * .param data - The KRC20 data.
     * .returns The generated script.
     */
    private static createScript(privateKey: Wasm.PrivateKey, data: Krc20Data): Wasm.ScriptBuilder {
        return Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
    }

    /**
     * Creates a P2SH address from a script.
     * .param script - The script.
     * .returns The P2SH address.
     */
    private static createP2SHAddress(script: Wasm.ScriptBuilder): Wasm.Address {
        return Wasm.addressFromScriptPublicKey(script.createPayToScriptHashScript(), Kiwi.network)!;
    }


    public static async issue(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
        if (data.op !== OP.Issue) throw new Error("Invalid input: 'op' must be 'issue'")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }


    public static async burn(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
        if (data.op !== OP.Burn) throw new Error("Invalid input: 'op' must be 'burn'")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }

    public static async blacklist(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
        if (data.op !== OP.Blacklist) throw new Error("Invalid input: 'op' must be 'blacklist'")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }

    public static async chown(privateKey: Wasm.PrivateKey, data: Krc20Data, fee: bigint = 0n, payload?: EncodablePayload) {
        if (data.op !== OP.Chown) throw new Error("Invalid input: 'op' must be 'chown'")
        return await KRC20.executeOperation(privateKey, data, fee, payload)
    }

}

export { KRC20 };
