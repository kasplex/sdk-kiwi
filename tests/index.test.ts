import { describe, expect, test } from 'bun:test';
import { Rpc } from '../src/rpc/client';
import { NetworkType } from "../wasm/kaspa/kaspa";
import { loadKaspaWasm } from "../src/init";

// expect('address generator function tests fo mainnet', async () => {
//     loadKaspaWasm();
//     setTimeout(async () => {
//         await Rpc.setInstance(NetworkType.Testnet).connect()
//     }, 1000)
// })

describe("arithmetic", () => {
    test("rpc", async () => {
        loadKaspaWasm();
        console.log('hello world')
        setTimeout(async () => {
            console.log('rpc. cline')
            await Rpc.setInstance(NetworkType.Testnet).connect()
            console.log('rpc. cline')
        }, 1000)
    }, 10000);

})
    // test("2 * 2", () => {
    //     expect(2 * 2).toBe(4);
    // });

    // test('greet function', () => {
    //     loadKaspaWasm();
    //     expect(() => {
    //         console.log('hello world')
    //     })
    //     setTimeout(async () => {
    //         console.log('rpc. cline')
    //         await Rpc.setInstance(NetworkType.Testnet).connect()
    //         console.log('rpc. cline')
    //     }, 1000)
    //     // expect('hello world').toBe('hello world');
    // });