import {
    PrivateKey,
    addressFromScriptPublicKey,
    Transaction as KaspaTransaction,
    SighashType,
    ScriptBuilder,
    ITransactionOutput,
    ScriptPublicKey,
    kaspaToSompi,
    type UtxoEntryReference,
    type Address,
} from "../wasm/kaspa/kaspa";

import { Krc20Data } from "./types/interface";
import { Kiwi } from "./kiwi";
import { OP } from "./utils/enum";
import { Transaction } from "./tx/transaction";
import { Entries } from "./tx/entries";
import { Script } from './script/script';
import { BASE_P2SH_TO_KASPA_ADDRESS, BASE_KAS_TO_P2SH_ADDRESS } from "./utils/constants";
import { Address as AddressUtil } from "./utils/address";
import { getFeeByOp } from './utils/utils'
import { Output } from "./tx/output";
import { Rpc } from "./rpc/client";
import { EventEmitter } from 'events'
class KRC20 extends EventEmitter {
    private static instance: KRC20;
    private static mintQueue: Array<{ data: Krc20Data; privateKey: PrivateKey; fee?: bigint }> = [];
    private isMinting = false;

    private constructor() {
        super();
    }

    public static getInstance(): KRC20 {
        if (!KRC20.instance) {
            KRC20.instance = new KRC20();
        }
        return KRC20.instance;
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
        const scriptPublicKey = script.createPayToScriptHashScript();
        return addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;
    }

    /**
     * Creates a transaction with the given UTXO entries, outputs, fee, script, and address.
     * This method signs the transaction with the provided private key and submits it.
     *
     * @param privateKey - The private key used to sign the transaction.
     * @param entries - The UTXO entries to be used as inputs for the transaction.
     * @param outputs - The outputs of the transaction.
     * @param fee - The transaction fee in the smallest unit (e.g., satoshis for Bitcoin).
     * @param script - The script builder used to construct the transaction script.
     * @param address - The recipient address for the transaction.
     * @returns A promise that resolves to the transaction ID (or hash) after submission.
     */
    private static async createTransactionWithEntries(
        privateKey: PrivateKey,
        entries: any[],
        outputs: any[],
        fee: bigint,
        script: ScriptBuilder,
        address: string,
    ) {
        return await Transaction.createTransactionsWithEntries(entries, outputs, address, fee)
            .then(r => r.sign([privateKey], script).submit());
    }

    /**
     * Executes a KRC20 operation.
     * @param privateKey - The private key.
     * @param data - The KRC20 data.
     * @param fee - The transaction fee.
     * @returns The submitted transaction ID.
     */
    private static async executeKrc20Operation(privateKeyStr: string, data: Krc20Data, fee: bigint) {
        if (!data.op) {
            throw new Error("Invalid input: 'op' must be provided");
        }
        const privateKey = new PrivateKey(privateKeyStr);
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        if (data.to && typeof data.to === 'string' && !AddressUtil.validate(data.to)) {
            throw new Error(`Invalid 'to' address: ${data.to}`);
        }
        const { p2shFee, priorityFee } = this.getFeeInfo(data.op, fee)
        // const outputs = Output.createOutputs(p2shAddress.toString(), p2shFee);
        // const commitTx = await Transaction.createTransactions(address, outputs, fee)
        //     .then(r => r.sign([privateKey]).submit());
        const commitTx = '48fe3a8177aec05bc1cfc81b5fbedbf91c78d0733312a2616b5a32836d967ff9'
        const revealAmount = data.op === OP.Deploy ? p2shFee : BASE_KAS_TO_P2SH_ADDRESS
        const revealEntries = Entries.revealEntries(p2shAddress, commitTx!, script.createPayToScriptHashScript(), revealAmount);
        return this.createTransactionWithEntries(privateKey, revealEntries, [], priorityFee, script, address);
    }


    /**
     * Gets the amount from UTXO entries for a specific transaction hash.
     * @param entries - The UTXO entries.
     * @param hash - The transaction hash.
     * @returns The amount.
     */
    private static getEnterAmount(entries: UtxoEntryReference[], hash: string): bigint {
        const entry = entries.find(entry => entry.outpoint.transactionId === hash);
        return entry ? entry.amount : 0n;
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
    public static async mint(privateKey: string, data: Krc20Data, fee: bigint = 0n) {
        if (data.op !== OP.Mint) {
            throw new Error("Invalid input: 'op' must be 'mint'");
        }
        return await KRC20.executeKrc20Operation(privateKey, data, fee);
    }

    private static getFeeInfo(op: OP, fee: bigint = 0n) {
        const DEFAULT_FEE = 100000000n;
        const getFee = getFeeByOp(op);
        const p2shFee = (getFee === 0n ? DEFAULT_FEE : getFee) + BASE_P2SH_TO_KASPA_ADDRESS;
        const priorityFee = op === OP.Transfer ? 0n : (fee === 0n ? DEFAULT_FEE : fee);
        return { p2shFee, priorityFee };
    }

    /**
     * Multi-mints new KRC20 tokens.
     * @param privateKeyStr - The private key string.
     * @param data - The KRC20 data containing mint details.
     * @param fee - The transaction fee.
     * @param executionCount - The number of mint operations to execute.
     * @returns The submitted reveal transaction IDs.
     */
    public static async multiMint(privateKeyStr: string, data: Krc20Data, fee: bigint = 0n, executionCount: number = 1) {
        if (data.op !== OP.Mint) {
            throw new Error("Invalid input: 'op' must be'mint'");
        }
        if (executionCount === 1) {
            return this.mint(privateKeyStr, data, fee);
        }
        const privateKey = new PrivateKey(privateKeyStr);
        const script = this.createScript(privateKey, data);
        const p2shAddress = this.createP2SHAddress(script);
        const { p2shFee } = this.getFeeInfo(data.op, fee)
        const address = privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const client = Rpc.getInstance().client
        
        const outputs = Output.createOutputs(p2shAddress.toString(), BASE_KAS_TO_P2SH_ADDRESS);
        await Transaction.createTransactions(address, outputs, fee)
            .then(r => r.sign([privateKey]).submit());

        let revealTxIds: string[] = [];
        const revealFee = kaspaToSompi("0.0001")!;
        if (executionCount > 1 && data.op === OP.Mint) {
            const maxValue = 30;
            console.log('for start...')
            await client.subscribeUtxosChanged([p2shAddress.toString()]);
            for (let i = 0; i < executionCount; i++) {
                const revealEntries = await Entries.entries(p2shAddress.toString());
                const revealTxId = await this.createTransactionWithEntries(privateKey, revealEntries, [], revealFee, script, p2shAddress.toString());
                console.log('revealTxId', revealTxId)
                let eventReceived = false
                let attempts = 1
                while(!eventReceived && attempts <= maxValue){
                    client.addEventListener('utxos-changed', async (event: any) => {
                        attempts++
                        console.log('执行监听', attempts)
                        const { removed, added } = event.data
                        const removedEntry = removed.find((entry: any) =>
                            entry.address.payload === address.toString().split(':')[1]
                        );
                        const addedEntry = added.find((entry: any) =>
                            entry.address.payload === address.toString().split(':')[1]
                        );
                        if (removedEntry) {
                            const addedEventTrxId = addedEntry.outpoint.transactionId;
                            console.log('addedEventTrxId', addedEventTrxId)
                            if (addedEventTrxId == revealTxId) {
                                console.log('addedEventTrxId', addedEventTrxId)
                                console.log('revealTxId while', revealTxId)
                                eventReceived = true
                                revealTxIds.push(revealTxId as string);
                            }
                        }
                    })
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }
            console.log('执行完成 end...')
            client.removeEventListener('utxos-changed')
            return revealTxIds;
        }
    }


    /**
     * Deploys a new KRC20 token contract.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing deployment details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async deploy(privateKey: string, data: Krc20Data, fee: bigint = 0n) {
        if (data.op !== OP.Deploy) {
            throw new Error("Invalid input: 'op' must be 'deploy'");
        }
        return await KRC20.executeKrc20Operation(privateKey, data, fee);
    }

    /** 
     * Transfers KRC20 tokens to another address.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing transfer details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async transfer(privateKey: string, data: Krc20Data, fee: bigint = 0n) {
        if (!data.to || !data.amt) {
            throw new Error("Invalid input: 'to' and 'amt' must be provided");
        }
        return await KRC20.executeKrc20Operation(privateKey, data, fee);
    }

    /**
     * Lists KRC20 token details.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing listing details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async list(privateKey: string, data: Krc20Data, fee: bigint = 0n) {
        if (data.op !== OP.List) {
            throw new Error("Invalid input: 'op' must be 'list'");
        }
        return await KRC20.executeKrc20Operation(privateKey, data, fee);
    }

    /**
     * Sends KRC20 tokens to another address.
     * @param privateKeyStr - The private key for signing the transaction.
     * @param data - The KRC20 data containing send details.
     * @param buyPrivateKey - The buyer's private key.
     * @param hash - The transaction hash.
     * @param amount - The amount to send.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async send(privateKeyStr: string, data: Krc20Data, buyPrivateKey: string, hash: string, amount: bigint, fee: bigint = 0n) {
        if (data.op !== OP.Send) {
            throw new Error("Invalid input: 'op' must be 'send'");
        }
        const signData = await this.signPartiaHalf(privateKeyStr, data, hash, amount!);
        if (!signData) {
            throw new Error("Invalid input: 'signData' must be provided");
        }
        return await this.revealPskt(buyPrivateKey, signData, hash, fee);
    }

    /**
     * Signs a transaction partially.
     * @param privateKey - The private key.
     * @param data - The KRC20 data.
     * @param hash - The transaction hash.
     * @param amount - The amount.
     * @returns The serialized transaction.
     */
    public static async signPartiaHalf(privateKey: string, data: Krc20Data, hash: string, amount: bigint): Promise<string> {
        const _privateKey = new PrivateKey(privateKey);
        const script = Script.krc20Script(_privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
        const scriptPublicKey = script.createPayToScriptHashScript();
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;
        const address = _privateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const entries = await Entries.entries(p2shAddress.toString());
        const enterAmount = this.getEnterAmount(entries, hash)
        const output = Output.createOutputs(address, amount);
        const revealEntries = Entries.revealEntries(p2shAddress, hash, scriptPublicKey, enterAmount);
        return Transaction.createTransaction(revealEntries, output, 0n, "", 1)
            .sign(_privateKey, script, SighashType.SingleAnyOneCanPay).toJson()
    }


    /**
     * Reveals a partially signed transaction.
     * @param buyPrivateKey - The private key.
     * @param signData - The serialized transaction data.
     * @param hash - The transaction hash.
     * @param fee - The transaction fee.
     * @returns The submitted transaction ID.
     */
    public static async revealPskt(buyPrivateKey: string, signData: string, hash: string, fee: bigint = 0n) {
        const _buyPrivateKey = new PrivateKey(buyPrivateKey);
        const address = _buyPrivateKey.toPublicKey().toAddress(Kiwi.network).toString();
        const tx = KaspaTransaction.deserializeFromSafeJSON(signData);
        const txInputs = tx.inputs[0];
        const txOutput = tx.outputs[0];
        const { address: utxoAddress, amount, scriptPublicKey } = txInputs.utxo!;
        const entries = await Entries.entries(address);
        const buyEntries = await Entries.revealEntries(utxoAddress!, hash, scriptPublicKey, amount, entries[0].blockDaaScore)
        entries.unshift(buyEntries[0] as UtxoEntryReference);
        const outputScriptPublicKey = this.getScriptPublicKey(txOutput);
        const receiveAddress = addressFromScriptPublicKey(outputScriptPublicKey, Kiwi.network)!
        const outputs = Output.createOutputs(receiveAddress.toString(), tx.outputs[0].value);
        return await Transaction.createTransactionsWithEntries(entries, outputs, address, fee, entries as []).then(r =>
            r.sign([_buyPrivateKey], txInputs.signatureScript, true).submit())
    }


    /**
     * Transfers KRC20 tokens to multiple addresses using multi-signature.
     * @param require - The number of required signatures.
     * @param publicKeysStr - The array of public keys.
     * @param data - The KRC20 data containing transfer details.
     * @param privateKeys - The array of private keys for signing.
     * @param ecdsa - Whether to use ECDSA.
     * @param fee - The transaction fee.
     * @returns The submitted transaction ID.
     */
    public static async transferMulti(require: number, publicKeysStr: string[], data: Krc20Data, privateKeys: string[], ecdsa?: boolean, fee?: bigint) {
        const redeemScript = Script.redeemMultiSignAddress(require, publicKeysStr, ecdsa || false);
        const address = Script.multiSignAddress(require, publicKeysStr, Kiwi.network, ecdsa || false);
        const scriptAddress = Script.multiSignTxKrc20Script(publicKeysStr, data, require, ecdsa || false)
        const scriptPublicKey = scriptAddress.createPayToScriptHashScript()
        const P2SHAddress = addressFromScriptPublicKey(scriptPublicKey, Kiwi.network)!;
        const scriptOp = new ScriptBuilder().addData(scriptAddress.toString())
        const _privateKeys = privateKeys.map(pk => new PrivateKey(pk))
        const outputs = Output.createOutputs(P2SHAddress.toString(), kaspaToSompi("0.3")!);
        const commitTx = await Transaction.createTransactions(address, outputs, 0n, undefined, 3)
            .then(r => r.multiSign(_privateKeys, redeemScript).submit());
        const revealEntries = Entries.revealEntries(P2SHAddress, commitTx!, scriptPublicKey);
        return await Transaction.createTransactionsWithEntries(revealEntries, [], address, fee, revealEntries as [])
            .then(r => r.sign(_privateKeys, scriptOp).submit());
    }
}

export { KRC20 };
