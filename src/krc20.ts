import {
    PrivateKey,
    addressFromScriptPublicKey,
    createTransaction,
    createInputSignature,
    Transaction as KaspaTransaction,
    SighashType,
    type UtxoEntryReference,
    type Address,
    type ScriptBuilder,
    ITransactionOutput,
    ScriptPublicKey,
} from "./wasm/kaspa";

import { Krc20Data } from "./types/interface";
import { Base } from "./base";
import { OP } from "./utils/enum";
import { Transaction } from "./tx/transaction";
import { Entries } from "./tx/entries";
import { Script } from './script/script';
import { BASE_KAS_TO_P2SH_ADDRESS } from "./utils/constants";
import { getFeeByOp } from '@/utils/utils'
import { Output } from "./tx/output";

class KRC20 {
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
        return addressFromScriptPublicKey(scriptPublicKey, Base.network)!;
    }

    /**
     * Creates and submits a transaction with entries.
     * @param privateKey - The private key.
     * @param entries - The transaction entries.
     * @param outputs - The transaction outputs.
     * @param fee - The transaction fee.
     * @param script - The script for signing.
     * @returns The submitted transaction ID.
     */
    private static async createTransactionWithEntries(
        privateKey: PrivateKey,
        entries: any[],
        outputs: any[],
        fee: bigint,
        script?: ScriptBuilder
    ) {
        const address = privateKey.toPublicKey().toAddress(Base.network).toString();
        const tx = await Transaction.createTransactionsWithEntries(entries, outputs, address, fee);
        if (script) {
            tx.sign([privateKey], script);
        }
        return tx.submit();
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
        const address = privateKey.toPublicKey().toAddress(Base.network).toString();
        const outputs = Output.createOutputs(p2shAddress.toString(), BASE_KAS_TO_P2SH_ADDRESS);
        const commitTx = await Transaction.createTransactions(address, outputs, fee).sign([privateKey]).submit();
        console.log('commitTx', commitTx)
        const revealEntries = Entries.revealEntries(p2shAddress, commitTx!, script.createPayToScriptHashScript());
        const getFee = getFeeByOp(data.op);
        return this.createTransactionWithEntries(privateKey, revealEntries, [], fee, script);
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
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing send details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async send(privateKeyStr: string, data: Krc20Data, buyPrivateKey: string,hash: string,amount: bigint, fee: bigint = 0n) {
        if (data.op !== OP.Send) {
            throw new Error("Invalid input: 'op' must be 'send'");
        }
        const signData = await this.signHalf(privateKeyStr, data, hash, amount!);
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
    public static async signHalf(privateKey: string, data: Krc20Data, hash: string, amount: bigint) {
        const _privateKey = new PrivateKey(privateKey);
        const script = Script.krc20Script(_privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
        const scriptPublicKey = script.createPayToScriptHashScript();
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Base.network)!;
        const address = _privateKey.toPublicKey().toAddress(Base.network).toString();
        const entries = await Entries.entries(p2shAddress.toString());
        const enterAmount = this.getEnterAmount(entries, hash)
        const output = Output.createOutputs(address, amount);
        const revealEntries = Entries.revealEntries(p2shAddress, hash, scriptPublicKey, enterAmount);
        const tx = createTransaction(revealEntries, output, 0n, "", 1);
        let signature = createInputSignature(tx, 0, _privateKey, SighashType.SingleAnyOneCanPay);
        tx.inputs[0].signatureScript = script.encodePayToScriptHashSignatureScript(signature)
        return tx.serializeToSafeJSON();
    }


    /**
     * Reveals a partially signed transaction.
     * @param privateKey - The private key.
     * @param signData - The serialized transaction data.
     * @param hash - The transaction hash.
     * @param fee - The transaction fee.
     * @returns The submitted transaction ID.
     */
    public static async revealPskt(buyPrivateKey: string, signData: string, hash: string, fee: bigint = 0n) {
        const _buyPrivateKey = new PrivateKey(buyPrivateKey);
        const address = _buyPrivateKey.toPublicKey().toAddress(Base.network).toString();
        const tx = KaspaTransaction.deserializeFromSafeJSON(signData);
        const txInputs = tx.inputs[0];
        const txOutput = tx.outputs[0];
        const { address: utxoAddress, amount, scriptPublicKey } = txInputs.utxo!;
        const entries = await Entries.entries(address);
        const buyEntries = await Entries.revealEntries(utxoAddress!, hash, scriptPublicKey, amount, entries[0].blockDaaScore)
        entries.unshift(buyEntries[0] as UtxoEntryReference);
        const outputScriptPublicKey = this.getScriptPublicKey(txOutput);
        const receiveAddress = addressFromScriptPublicKey(outputScriptPublicKey, Base.network)!
        const outputs = Output.createOutputs(receiveAddress.toString(), tx.outputs[0].value);
        return await Transaction.createTransactionsWithEntries(entries, outputs, address, fee, entries as []).sign([_buyPrivateKey], txInputs.signatureScript, true).submit()
    }

}

export { KRC20 };
