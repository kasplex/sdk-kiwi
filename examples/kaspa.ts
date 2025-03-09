import { Kaspa, Rpc, NetworkType, PrivateKey, Script } from '../src/index';
// import { Kaspa, Rpc, NetworkType, PrivateKey, Script, loadKaspaWasm } from '../dist/index';
// await loadKaspaWasm();
// Example 1: Transfer KAS using a single private key
async function testSingleTransfer() {
    await Rpc.setInstance(NetworkType.Mainnet).connect()
    let toAddress = 'kaspatest:pr6mpn7hgfa99v0rf4pf0k3c83pkmrqtd8h46fn44g9vr8c6khw2u4mn2fgy3'
    let privateKey = new PrivateKey("3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828")

    try {
        const resp = await Kaspa.transferKas(privateKey, toAddress, 130000000n, 10000n)
        console.log("Transaction submitted successfully:", resp!);
    } catch (error) {
        console.error("Transaction failed:", error);
    }

    // Disconnect from the RPC server
    Rpc.getInstance().disconnect()
}

// Example 2: Transfer KAS from a multi-signature address
async function testMultiSigTransfer() {

    let publicKeys = [
        "038c765b0ef3afe5f10e5c84806b9253156fb7f7fbeb127fe8505a220952337903",
        "03b499112e2aef579bbf253ceba756ea8343061cc924e3ba972248ca584bab1b04",
        "02c28cdca2dc5ebafe2069804980174e1601dad2fe3a08d0d59445b5a1a2c4f3cc",
    ]

    try {
        let address = Script.multiSignAddress(2, publicKeys, NetworkType.Testnet)
        let redeemScript = Script.redeemScript(2, publicKeys)
        let signPrivateKeys = [
            "8648d429bd1bd5ff5688fe217a743bf8deb0b1ea02032db647c0e1d482c1f83c",
            "bb93b238bdd351f9f4436d645d359b3f759ad02af13f4119cc77dac2821afe81",
        ]
        let toAddress = "kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf"
        let resp = await Kaspa.transferKasFromMultiSignAddress(address, 3, redeemScript, signPrivateKeys, toAddress, 130000000n, 10000n)
        console.log("resp:", resp)
    } catch (error) {
        console.error("Multi-signature transaction failed:", error);
    }

    // Disconnect from the RPC server
    Rpc.getInstance().disconnect()
}

// Run the examples
testSingleTransfer();
testMultiSigTransfer();
