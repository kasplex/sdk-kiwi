import {describe, expect, it} from 'vitest';
import {Rpc} from '../src/rpc/client';
import {NetworkType} from "../src/wasm/kaspa";

describe('address generator function tests fo mainnet', async () => {

    await Rpc.setInstance(NetworkType.Testnet).connect()

    // Test for getServerInfo
    it('should return server info with correct rpcApiVersion testnet', async () => {
        let rpc = Rpc.getInstance();
        await rpc.client.connect();
        const res = await rpc.client.getServerInfo();
        console.log("test net server info:", res);
        expect(res.rpcApiVersion).toBe(1);
        rpc.client.disconnect();
    }, 50000);

    it('should return server info with correct rpcApiVersion mainnet', async () => {
        let rpc = Rpc.getInstance();
        const res = await rpc.client.getServerInfo();
        console.log("main net server info:", res);
        expect(res.rpcApiVersion).toBe(1);
        rpc.client.disconnect();
    }, 20000);

    it('should return addEventListener info', async () => {
        let rpc = Rpc.getInstance();
        await rpc.client.connect();
        let targetAddress = "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08";
        console.log(`Subscribing to UTXO changes for address: ${targetAddress}`, 'INFO');
        await rpc.client.subscribeUtxosChanged([targetAddress]);
        while (true) {
            console.log("running....")
            rpc.client.addEventListener('utxos-changed', async (event: any) => {
              console.log(`UTXO changes detected for address: ${targetAddress}`, 'INFO');
              console.log(`Event data: ${JSON.stringify(event, (key, value) =>
                  typeof value === 'bigint' ? value.toString() : value, 2)}`, 'DEBUG');
            });
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }, 50000);
});
