import { Wasm } from "../index";
import { Rpc } from "../rpc/client";

class PendingTransaction {
    public transaction: Wasm.ICreateTransactions;

    constructor(transaction: Wasm.ICreateTransactions) {
        this.transaction = transaction;
    }

    public static async createTransactions(setting: Wasm.IGeneratorSettingsObject): Promise<PendingTransaction> {
        const tx = await Wasm.createTransactions(setting);
        return new PendingTransaction(tx);
    }

    public sign(privateKeys: Wasm.PrivateKey[], script?: Wasm.ScriptBuilder): this {
        if (script) {
            const privateKey = privateKeys[0];
            if (!privateKey) throw Error("PrivateKey not find");
            this.transaction.transactions.forEach(transaction => {
                transaction.transaction.inputs.forEach((input, index) => {
                    const signature = transaction.createInputSignature(index, privateKey);
                    transaction.fillInput(index, script.encodePayToScriptHashSignatureScript(signature));
                });
            });
        } else {
            const privateKey = privateKeys[0];
            if (!privateKey) throw Error("PrivateKey not find");
            this.transaction.transactions.forEach(transaction => {
                transaction.transaction.inputs.forEach((input, index) => {
                    transaction.sign([privateKey]);
                });
            });
        }
        return this;
    }

    public async submit(): Promise<string | undefined> {
        const client = Rpc.getInstance().client;
        for (const transaction of this.transaction.transactions) {
            await transaction.submit(client);
        }
        return this.transaction.summary.finalTransactionId;
    }
}

export { PendingTransaction };
