import { KaspaApi } from '../src/api/kaspaApi'
import { Params } from "../src/types/interface";
import { describe, expect, test } from 'bun:test';
import { NetworkType } from '../wasm/kaspa/kaspa'
import { Kiwi } from '../src/kiwi'

const address = `kaspa:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg22dwn3r90`
const params: Params = {
    addresses: [address],
};
Kiwi.setNetwork(NetworkType.Mainnet)

describe('KaspaApi', () => {

    // Test for getBalance
    test('getBalance', async () => {
        
        const res = await KaspaApi.getBalance(address)
        console.log(`getBalance response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    test('postBalance', async () => {
        const res = await KaspaApi.postBalance({ address: address })
        console.log(`postBalance response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // Test for getUtxo
    test('getUtxo', async () => {
        const res = await KaspaApi.getUtxo(address)
        console.log(`getUtxo response: \x1B[32m%s\x1B[0m`, res)
        expect(res)
    }, 5000)

    test('getBalance', async () => {
        const res = await KaspaApi.getBalance(address);
        console.log(`getBalance response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('postBalance', async () => {
        const res = await KaspaApi.postBalance(params);
        console.log(`postBalance response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getUtxo', async () => {
        const res = await KaspaApi.getUtxo(address);
        console.log(`getUtxo response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('postUtxos', async () => {
        const res = await KaspaApi.postUtxos(params);
        console.log(`postUtxos response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    });

    test('getTransactionsCount', async () => {
        const res = await KaspaApi.getTransactionsCount(address);
        console.log(`getTransactionsCount response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    // -----Kaspa network info-----
    test('getInfoBlockdag', async () => {
        const res = await KaspaApi.getInfoBlockdag();
        console.log(`getInfoBlockdag response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoCoinsupply', async () => {
        const res = await KaspaApi.getInfoCoinsupply();
        console.log(`getInfoCoinsupply response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoCoinsupplyCirculating', async () => {
        const res = await KaspaApi.getInfoCoinsupplyCirculating();
        console.log(`getInfoCoinsupplyCirculating response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoCoinsupplyTotal', async () => {
        const res = await KaspaApi.getInfoCoinsupplyTotal();
        console.log(`getInfoCoinsupplyTotal response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoKaspad', async () => {
        const res = await KaspaApi.getInfoKaspad();
        console.log(`getInfoKaspad response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoNetwork', async () => {
        const res = await KaspaApi.getInfoNetwork();
        console.log(`getInfoNetwork response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoFeeEstimate', async () => {
        const res = await KaspaApi.getInfoFeeEstimate();
        console.log(`getInfoFeeEstimate response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoPrice', async () => {
        const res = await KaspaApi.getInfoPrice();
        console.log(`getInfoPrice response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoBlockReward', async () => {
        const res = await KaspaApi.getInfoBlockReward();
        console.log(`getInfoBlockReward response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoHalving', async () => {
        const res = await KaspaApi.getInfoHalving();
        console.log(`getInfoHalving response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoHashRate', async () => {
        const res = await KaspaApi.getInfoHashRate();
        console.log(`getInfoHashRate response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoHashRateMax', async () => {
        const res = await KaspaApi.getInfoHashRateMax();
        console.log(`getInfoHashRateMax response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoHealth', async () => {
        const res = await KaspaApi.getInfoHealth();
        console.log(`getInfoHealth response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    test('getInfoMarketcap', async () => {
        const res = await KaspaApi.getInfoMarketcap();
        console.log(`getInfoMarketcap response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);


    // test('getTransactionsId', async () => {
    //     const transactionId = '9475b4302a505d30d5aa3f98883b33e5e0bb6dd4a4560df844cd72954055aaaf';
    //     const res = await KaspaApi.getTransactionsId(transactionId);
    //     console.log(`getTransactionsId response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
    //     expect(res)
    // });

    // test('postTransactionsSearch', async () => {
    //     const res = await KaspaApi.postTransactionsSearch(params);
    //     console.log(`postTransactionsSearch response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
    //     expect(res)
    // }, 5000);

    // test('postTransactions', async () => {
    //     const res = await KaspaApi.postTransactions(params);
    //     console.log(`postTransactions response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
    //     expect(res)
    // }, 5000);

    // test('postTransactionsMass', async () => {
    //     const res = await KaspaApi.postTransactionsMass(params);
    //     console.log(`postTransactionsMass response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
    //     expect(res)
    // }, 5000);

})
