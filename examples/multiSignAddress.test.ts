import { describe, expect, it } from 'vitest';
import { Wasm, Kiwi, Rpc, Script, Tx } from '@kasplex/kiwi';

let privateKeys = [
    "",
    "",
    "",
]
let publicKeys = [
    "",
    "",
    "",
]

describe('multi sign address function tests', () => {

    Kiwi.setNetwork(Wasm.NetworkType.Testnet);

    it('muitiSign address', () => {
        let address = Script.multiSignAddress(2, publicKeys, Wasm.NetworkType.Testnet)
        console.log("muiti sign address:", address)
        expect(address.toString()).toBe("kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3");
    });


    it('muitiSign transaction signed one by one', async () => {

        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()

        let address = Script.multiSignAddress(2, publicKeys, Wasm.NetworkType.Testnet)

        let redeemScript = Script.redeemScript(2, publicKeys)

        let toAddress = "kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf"
        let toAmount = 130000000n

        let fee = 100000n
        const outputs = Tx.Output.createOutputs(toAddress, toAmount)

        let multiSignTx = await Tx.Transaction.createMultiSignTransaction(address, outputs, fee, "", publicKeys.length)
        let txJson = multiSignTx.toJson()
        console.log("tx1", txJson)

        // sign1
        let privatekey1 = new Wasm.PrivateKey("")
        let tx2 = Tx.Transaction.createMultiSignTransactionFromJson(txJson)
        let txWithSign1 = tx2.sign(privatekey1, redeemScript, Wasm.SighashType.All).toJson()
        console.log("tx2", tx2.toJson())

        // sign2
        let privatekey2 = new Wasm.PrivateKey("")
        let tx3 = Tx.Transaction.createMultiSignTransactionFromJson(txWithSign1)
        let txWithSign2 = tx3.sign(privatekey2, redeemScript, Wasm.SighashType.All).toJson()
        console.log("tx3", txWithSign2)

        let txFinal = Tx.Transaction.createMultiSignTransactionFromJson(txWithSign2)
        let txid = await txFinal.signScript(redeemScript).submit()
        console.log("txid", txid)
        await Rpc.setInstance(Wasm.NetworkType.Testnet).disconnect()
    });

    it('muitiSign transaction signed one at same time', async () => {

        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect()

        let address = Script.multiSignAddress(2, publicKeys, Wasm.NetworkType.Testnet)

        let redeemScript = Script.redeemScript(2, publicKeys)

        let toAddress = "kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf"
        let toAmount = 130000000n

        let fee = 100000n
        const outputs = Tx.Output.createOutputs(toAddress, toAmount)

        let multiSignTx = await Tx.Transaction.createMultiSignTransaction(address, outputs, fee, "", publicKeys.length)
        let txJson = multiSignTx.toJson()
        console.log("tx1", txJson)

        // sign1
        let privatekey1 = new Wasm.PrivateKey("")
        let tx2 = Tx.Transaction.createMultiSignTransactionFromJson(txJson)
        let pk1SignMessage = tx2.signMessages(privatekey1, Wasm.SighashType.All)
        console.log("pk1SignMessage", pk1SignMessage)

        //
        // sign2
        let privatekey2 = new Wasm.PrivateKey("")
        let tx3 = Tx.Transaction.createMultiSignTransactionFromJson(txJson)
        let pk2SignMessage = tx3.signMessages(privatekey2, Wasm.SighashType.All)
        console.log("pk2SignMessage", pk2SignMessage)

        let signedTx = multiSignTx.combineSignMessages([pk1SignMessage, pk2SignMessage])
        let txid = await signedTx.signScript(redeemScript).submit()
        console.log("txid", txid)
        await Rpc.setInstance(Wasm.NetworkType.Testnet).disconnect()
    });
});
