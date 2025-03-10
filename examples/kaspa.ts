import { Kaspa, Rpc, NetworkType, PrivateKey, Script, Kiwi } from '@kasplex/kiwi';

await Kiwi.setNetwork(NetworkType.Mainnet);

// Example 1: Transfer KAS using a single private key
async function testSingleTransfer() {
    await Rpc.setInstance(NetworkType.Mainnet).connect()
    let toAddress = 'kaspa:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg22dwn3r90'
    let privateKey = new PrivateKey("fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a")

    try {
        const resp = await Kaspa.transferKas(privateKey, toAddress, 130000000n, 10000n)
        console.log("Transaction submitted successfully:", resp!);
    } catch (error) {
        console.error("Transaction failed:", error);
    }

    // Disconnect from the RPC server
    await Rpc.getInstance().disconnect()
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
    await Rpc.getInstance().disconnect()
}

// Run the examples
testSingleTransfer();
// testMultiSigTransfer();
