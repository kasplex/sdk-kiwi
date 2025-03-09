import { describe, expect, test } from 'bun:test';
import {Rpc} from '../src/rpc/client';
import {NetworkType} from "../wasm/kaspa/kaspa";
import { loadKaspaWasm } from "../src/init";
await loadKaspaWasm()

describe('address generator function tests fo mainnet', async () => {
    await loadKaspaWasm();
    // Test for getServerInfo
    test('should return server info with correct rpcApiVersion testnet', async () => {
        let rpc = Rpc.getInstance();
        await rpc.client.connect();
        const res = await rpc.client.getServerInfo();
        console.log("test net server info:", res);
        expect(res.rpcApiVersion).toBe(1);
        rpc.client.disconnect();
    }, 50000);

    test('should return server info with correct rpcApiVersion mainnet', async () => {
        let rpc = Rpc.getInstance();
        const res = await rpc.client.getServerInfo();
        console.log("main net server info:", res);
        expect(res.rpcApiVersion).toBe(1);
        rpc.client.disconnect();
    }, 20000);

    test('should return addEventListener info', async () => {
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
