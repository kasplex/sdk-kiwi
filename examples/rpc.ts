
import {  Rpc, NetworkType, PrivateKey, Script } from '../src/index';
const rpcClient = Rpc.getInstance();

async function testRpc() {
    try {
        await rpcClient.connect();
        console.log("RPC client connect successfully");

        const res = await rpcClient.client.getServerInfo();
        console.log("test net server info:", res);

        // Disconnect from the RPC server
        await rpcClient.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testLocalRpc() {
    try {
        await rpcClient.client.setInstance(NetworkType.Testnet, "https://127.0..0.1")
        // await Rpc.setInstance(NetworkType.Testnet, "https://127.0..0.1").connect();
        console.log("RPC client connect successfully");

        const res = rpcClient.client.getServerInfo();
        console.log("test net server info:", res);

        // Disconnect from the RPC server
        await rpcClient.client.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


async function testSubscribe() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        console.log(`Subscribing to UTXO changes for address: ${targetAddress}`, 'INFO');
        await rpcClient.client.subscribeUtxosChanged([targetAddress]);
        while (true) {
            console.log("running....")
            rpcClient.client.addEventListener('utxos-changed', async (event: any) => {
                console.log(`UTXO changes detected for address: ${targetAddress}`, 'INFO');
                console.log(`Event data: ${JSON.stringify(event, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value, 2)}`, 'DEBUG');
            });
            await new Promise(resolve => setTimeout(resolve, 500))
        }
        // await Kiwi.rpcClient.disconnect()
        await Rpc.getInstance().disconnect()

    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


async function testGetBalance() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await rpcClient.client.getBalanceByAddress({
            address: targetAddress
        });
        console.log("address balance is :", resp)

        await rpcClient.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testGetUtxo() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await rpcClient.client.getUtxosByAddresses({
            addresses: [targetAddress]
        });
        console.log("address utxo is :", resp)

        await rpcClient.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testEstimateFee() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect();

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await rpcClient.client.getFeeEstimate({});
        console.log("Estimate Fee is :", resp)

        await rpcClient.disconnect()
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
