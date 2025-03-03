import {
    PrivateKey,
    addressFromScriptPublicKey,
    createTransaction,
    createInputSignature,
    Transaction as KaspaTransaction,
    SighashType,
    Address,
    type UtxoEntryReference,
    kaspaToSompi,
} from "../wasm/kaspa";
import { Krc20Data } from "./types/interface";
import { Base } from "./base";
import { OP } from "./utils/enum";
import { Transaction } from "./tx/transaction";
import { Entries } from "./tx/entries";
import { Script } from '../src/script/script';
import { BASE_KAS_TO_P2SH_ADDRESS } from "./utils/constants";
import { getFeeByOp } from '@/utils/utils'
import { Output } from "./tx/output";

class KRC20 {

    /**
     * Creates a KRC20 transaction.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing operation details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    private static async executeKrc20Operation(privateKey: PrivateKey, data: Krc20Data, fee: bigint) {
        if (!data.op) {
            throw new Error("Invalid input: 'op' must be provided");
        }
        const script = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
        const scriptPublicKey = script.createPayToScriptHashScript();
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Base.network)!;
        const address = privateKey.toPublicKey().toAddress(Base.network).toString();
        const outputs = Output.createOutputs(p2shAddress.toString(), BASE_KAS_TO_P2SH_ADDRESS);
        const commitTx = await Transaction.createTransactions(address, outputs, fee).sign([privateKey]).submit()
        const revealEntries = Entries.revealEntries(p2shAddress, commitTx!, scriptPublicKey);
        const getFee = getFeeByOp(data.op);
        return await Transaction.createTransactionsWithEntries(revealEntries, [], address, getFee)
    }

    /**
     * Mints new KRC20 tokens.
     * @param privateKey - The private key for signing the transaction.
     * @param data - The KRC20 data containing mint details.
     * @param fee - The transaction fee.
     * @returns The submitted reveal transaction.
     */
    public static async mint(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
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
    public static async deploy(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
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
    public static async transfer(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
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
    public static async list(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n) {
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
    public static async send(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n, amount?: bigint, hash?: string) {
        if (data.op !== OP.Send) {
            throw new Error("Invalid input: 'op' must be 'send'");
        }
        const {signData } = await this.signTx(privateKey, data, hash!, amount!)
        if (!signData) {
            throw new Error("Invalid input: 'signData' must be provided");
        }
        const { txId, P2SHAddressBuyer, receiveAddress} = await this.sendKrc20Transaction(privateKey, data, signData, hash!)
        return await this.buy(privateKey, data, undefined,P2SHAddressBuyer,hash!, receiveAddress.toString())
    }

    private static async signTx(privateKey:PrivateKey, data: Krc20Data, hash: string, amount: bigint) {
        const script = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
        const scriptPublicKey = script.createPayToScriptHashScript();
        const p2shAddress = addressFromScriptPublicKey(scriptPublicKey, Base.network)!;
        const address = privateKey.toPublicKey().toAddress(Base.network).toString();
        const entries = await Entries.entries(p2shAddress.toString());
        let enterAmount = 0n
        for (const entry of entries) {
            if (entry.outpoint.transactionId == hash) {
                enterAmount = entry.amount
                break
            }
        }
        const entries1 = Entries.revealEntries(p2shAddress, hash, scriptPublicKey, enterAmount);
        const output = Output.createOutputs(address, amount);
        const tx = createTransaction(entries1, output, 0n, "", 1);
        const signature = await createInputSignature(tx, 0, privateKey, SighashType.SingleAnyOneCanPay);
        tx.inputs[0].signatureScript = script.encodePayToScriptHashSignatureScript(signature)
        return { signData: tx.serializeToSafeJSON(), address }
    }

    private static async sendKrc20Transaction(privateKey: PrivateKey, dataSend: Krc20Data, signData: string, hash: string) {
        const tx = KaspaTransaction.deserializeFromSafeJSON(signData);
        console.log('sendKrc20Transaction tx :', tx)
        const address = privateKey.toPublicKey().toAddress(Base.network).toString();
        const entries = await Entries.entries(address);
        const txInputs = tx.inputs[0];
        const { address: utxoAddress, amount, scriptPublicKey } = txInputs.utxo!;
        const buyEntries = await Entries.revealEntries(utxoAddress!,hash, scriptPublicKey, amount, entries[0].blockDaaScore)
        entries.unshift(buyEntries[0] as UtxoEntryReference);
        const receiveAddress = addressFromScriptPublicKey(scriptPublicKey, Base.network)!

        const scriptBuyer = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), dataSend);
        const scriptPublicKeyBuyer = scriptBuyer.createPayToScriptHashScript()
        const P2SHAddressBuyer = addressFromScriptPublicKey(scriptPublicKeyBuyer, Base.network)!;

        const outputs = Output.createOutputs(receiveAddress.toString(), tx.outputs[0].value);
        const txId = await Transaction.createTransactions(address, outputs, 0n).sign([privateKey], txInputs.signatureScript).submit()
        return { txId, P2SHAddressBuyer, receiveAddress}
    }

    private static async buy(privateKey: PrivateKey, data: Krc20Data, fee: bigint = 0n, listAddress: Address, listHash: string, receiveAddress: string) {
        const address = privateKey.toPublicKey().toAddress(Base.network).toString();
        const entries = await Entries.entries(address);
        const scriptBuyer = Script.krc20Script(privateKey.toPublicKey().toXOnlyPublicKey().toString(), data);
        const scriptPublicKeyBuyer = scriptBuyer.createPayToScriptHashScript()
        const buyEntries = await Entries.revealEntries(listAddress, listHash, scriptPublicKeyBuyer, kaspaToSompi('1'), entries[0].blockDaaScore)
        entries.unshift(buyEntries[0] as UtxoEntryReference);

        const outputs = Output.createOutputs(receiveAddress.toString(), kaspaToSompi('1')!);
        return await Transaction.createTransactions(address, outputs, 0n).sign([privateKey]).submit()
    }

}

export { KRC20 };
