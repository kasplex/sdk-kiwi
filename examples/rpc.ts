
import {  Rpc, PrivateKey, Script, loadKaspaWasm, NetworkType } from '../dist/index';

await loadKaspaWasm()
async function testRpc() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();
        console.log("RPC client connect successfully");

        const res = await Rpc.getInstance().client.getServerInfo();
        console.log("test net server info:", res);

        // Disconnect from the RPC server
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testLocalRpc() {
    try {
        await Rpc.setInstance(NetworkType.Testnet, "https://127.0..0.1")
        // await Rpc.setInstance(NetworkType.Testnet, "https://127.0..0.1").connect();
        console.log("RPC client connect successfully");

        const res = Rpc.getInstance().client.getServerInfo();
        console.log("test net server info:", res);

        // Disconnect from the RPC server
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


async function testSubscribe() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        console.log(`Subscribing to UTXO changes for address: ${targetAddress}`, 'INFO');
        await Rpc.getInstance().client.subscribeUtxosChanged([targetAddress]);
        while (true) {
            console.log("running....")
            Rpc.getInstance().client.addEventListener('utxos-changed', async (event: any) => {
                console.log(`UTXO changes detected for address: ${targetAddress}`, 'INFO');
                console.log(`Event data: ${JSON.stringify(event, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value, 2)}`, 'DEBUG');
            });
            await new Promise(resolve => setTimeout(resolve, 500))
        }
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


async function testGetBalance() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await Rpc.getInstance().client.getBalanceByAddress({
            address: targetAddress
        });
        console.log("address balance is :", resp)

        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testGetUtxo() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await Rpc.getInstance().client.getUtxosByAddresses({
            addresses: [targetAddress]
        });
        console.log("address utxo is :", resp)

        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testEstimateFee() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await Rpc.getInstance().client.getFeeEstimate({});
        console.log("Estimate Fee is :", resp)

        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


// Run the test
testRpc();
// testLocalRpc();
// testSubscribe();
// testGetBalance();
// testGetUtxo();
// testEstimateFee();
