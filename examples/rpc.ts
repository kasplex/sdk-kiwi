
import Kiwi from '../src/index';

async function testRpc() {
    try {
        await Kiwi.init(Kiwi.NetworkType.Testnet)
        console.log("RPC client connect successfully");

        const res = await Kiwi.rpcClient.client.getServerInfo();
        console.log("test net server info:", res);

        // Disconnect from the RPC server
        await Kiwi.rpcClient.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testLocalRpc() {
    try {
        await Kiwi.init(Kiwi.NetworkType.Testnet, "https://127.0..0.1")
        // await Rpc.setInstance(NetworkType.Testnet, "https://127.0..0.1").connect();
        console.log("RPC client connect successfully");

        const res = Kiwi.rpcClient.client.getServerInfo();
        console.log("test net server info:", res);

        // Disconnect from the RPC server
        await Kiwi.rpcClient.client.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


async function testSubscribe() {
    try {
        // await Rpc.setInstance(NetworkType.Testnet).connect();
        await Kiwi.init(Kiwi.NetworkType.Testnet)

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        console.log(`Subscribing to UTXO changes for address: ${targetAddress}`, 'INFO');
        await Kiwi.rpcClient.client.subscribeUtxosChanged([targetAddress]);
        while (true) {
            console.log("running....")
            Kiwi.rpcClient.client.addEventListener('utxos-changed', async (event: any) => {
                console.log(`UTXO changes detected for address: ${targetAddress}`, 'INFO');
                console.log(`Event data: ${JSON.stringify(event, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value, 2)}`, 'DEBUG');
            });
            await new Promise(resolve => setTimeout(resolve, 500))
        }
        await Kiwi.rpcClient.disconnect()
        // await Rpc.getInstance().disconnect()

    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}


async function testGetBalance() {
    try {
        // await Rpc.setInstance(NetworkType.Testnet).connect();
        await Kiwi.init(Kiwi.NetworkType.Testnet)

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await Kiwi.rpcClient.client.getBalanceByAddress({
            address: targetAddress
        });
        console.log("address balance is :", resp)

        await Kiwi.rpcClient.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testGetUtxo() {
    try {
        await Kiwi.init(Kiwi.NetworkType.Testnet)

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await Kiwi.rpcClient.client.getUtxosByAddresses({
            addresses: [targetAddress]
        });
        console.log("address utxo is :", resp)

        await Kiwi.rpcClient.disconnect()
    } catch (error) {
        console.error("An error occurred while testing the RPC client:", error);
    }
}

async function testEstimateFee() {
    try {
        await Kiwi.init(Kiwi.NetworkType.Testnet)

        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        const resp = await Kiwi.rpcClient.client.getFeeEstimate({});
        console.log("Estimate Fee is :", resp)

        await Kiwi.rpcClient.disconnect()
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
