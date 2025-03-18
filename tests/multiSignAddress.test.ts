import { describe, expect, it } from 'vitest';
import { Script } from '../src/script/script';
import { NetworkType, PrivateKey, SighashType } from '../wasm/kaspa/kaspa';
import { Rpc } from "../src/rpc/client";
import { Kiwi } from '../src/kiwi';
import { Output } from '../src/tx/output';
import { Transaction } from '../src/tx/transaction';

let privateKeys = [
    "8648d429bd1bd5ff5688fe217a743bf8deb0b1ea02032db647c0e1d482c1f83c",
    "bb93b238bdd351f9f4436d645d359b3f759ad02af13f4119cc77dac2821afe81",
    "b3a6163f85f740c5746b99cc81a1aca887ba312e045ebe4acd46842cd472f94b",
]
let publicKeys = [
    "038c765b0ef3afe5f10e5c84806b9253156fb7f7fbeb127fe8505a220952337903",
    "03b499112e2aef579bbf253ceba756ea8343061cc924e3ba972248ca584bab1b04",
    "02c28cdca2dc5ebafe2069804980174e1601dad2fe3a08d0d59445b5a1a2c4f3cc",
]

describe('multi sign address function tests', () => {

    Kiwi.setNetwork(NetworkType.Testnet);

    it('muitiSign address', () => {
        let address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet)
        console.log("muiti sign address:", address)
        expect(address.toString()).toBe("kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3");
    });


    it('muitiSign transaction signed one by one', async () => {

        await Rpc.setInstance(NetworkType.Testnet).connect()

        let address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet)

        let redeemScript = Script.redeemScript(2, publicKeys)

        let toAddress = "kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf"
        let toAmount = 130000000n

        let fee = 100000n
        const outputs = Output.createOutputs(toAddress, toAmount)

        let multiSignTx = await Transaction.createMultiSignTransaction(address, outputs, fee, "", publicKeys.length)
        let txJson = multiSignTx.toJson()
        console.log("tx1", txJson)

        // sign1
        let privatekey1 = new PrivateKey("8648d429bd1bd5ff5688fe217a743bf8deb0b1ea02032db647c0e1d482c1f83c")
        let tx2 = Transaction.createMultiSignTransactionFromJson(txJson)
        let txWithSign1 = tx2.sign(privatekey1, redeemScript, SighashType.All).toJson()
        console.log("tx2", tx2.toJson())

        // sign2
        let privatekey2 = new PrivateKey("bb93b238bdd351f9f4436d645d359b3f759ad02af13f4119cc77dac2821afe81")
        let tx3 = Transaction.createMultiSignTransactionFromJson(txWithSign1)
        let txWithSign2 = tx3.sign(privatekey2, redeemScript, SighashType.All).toJson()
        console.log("tx3", txWithSign2)

        let txFinal = Transaction.createMultiSignTransactionFromJson(txWithSign2)
        let txid = await txFinal.signScript(redeemScript).submit()
        console.log("txid", txid)
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    });

    it('muitiSign transaction signed one at same time', async () => {

        await Rpc.setInstance(NetworkType.Testnet).connect()

        let address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet)

        let redeemScript = Script.redeemScript(2, publicKeys)

        let toAddress = "kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf"
        let toAmount = 130000000n

        let fee = 100000n
        const outputs = Output.createOutputs(toAddress, toAmount)

        let multiSignTx = await Transaction.createMultiSignTransaction(address, outputs, fee, "", publicKeys.length)
        let txJson = multiSignTx.toJson()
        console.log("tx1", txJson)

        // sign1
        let privatekey1 = new PrivateKey("8648d429bd1bd5ff5688fe217a743bf8deb0b1ea02032db647c0e1d482c1f83c")
        let tx2 = Transaction.createMultiSignTransactionFromJson(txJson)
        let pk1SignMessage = tx2.signMessages(privatekey1, SighashType.All)
        console.log("pk1SignMessage", pk1SignMessage)

        //
        // sign2
        let privatekey2 = new PrivateKey("bb93b238bdd351f9f4436d645d359b3f759ad02af13f4119cc77dac2821afe81")
        let tx3 = Transaction.createMultiSignTransactionFromJson(txJson)
        let pk2SignMessage = tx3.signMessages(privatekey2, SighashType.All)
        console.log("pk2SignMessage", pk2SignMessage)

        let signedTx = multiSignTx.combineSignMessages([pk1SignMessage, pk2SignMessage])
        let txid = await signedTx.signScript(redeemScript).submit()
        console.log("txid", txid)
        await Rpc.setInstance(NetworkType.Testnet).disconnect()
    });
});
