import { KaspaApi, Wasm, Kiwi, Modules } from '@kasplex/kiwi'
import { describe, expect, it } from 'vitest';

describe('KaspaApi', () => {

    Kiwi.setNetwork(Wasm.NetworkType.Mainnet)


    const address = `kaspa:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg22dwn3r90`
    const params: Modules.Params = {
        addresses: [address],
    };

    // Test for getBalance
    it('getBalance', async () => {
        const res = await KaspaApi.getBalance(address)
        console.log(`getBalance response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    it('postBalance', async () => {
        const res = await KaspaApi.postBalance({ address: address })
        console.log(`postBalance response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // Test for getUtxo
    it('getUtxo', async () => {
        const res = await KaspaApi.getUtxo(address)
        console.log(`getUtxo response: \x1B[32m%s\x1B[0m`, res)
        expect(res)
    }, 5000)

    it('getBalance', async () => {
        const res = await KaspaApi.getBalance(address);
        console.log(`getBalance response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('postBalance', async () => {
        const res = await KaspaApi.postBalance(params);
        console.log(`postBalance response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getUtxo', async () => {
        const res = await KaspaApi.getUtxo(address);
        console.log(`getUtxo response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('postUtxos', async () => {
        const res = await KaspaApi.postUtxos(params);
        console.log(`postUtxos response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    });

    it('getTransactionsCount', async () => {
        const res = await KaspaApi.getTransactionsCount(address);
        console.log(`getTransactionsCount response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    // -----Kaspa network info-----
    it('getInfoBlockdag', async () => {
        const res = await KaspaApi.getInfoBlockdag();
        console.log(`getInfoBlockdag response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoCoinsupply', async () => {
        const res = await KaspaApi.getInfoCoinsupply();
        console.log(`getInfoCoinsupply response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoCoinsupplyCirculating', async () => {
        const res = await KaspaApi.getInfoCoinsupplyCirculating();
        console.log(`getInfoCoinsupplyCirculating response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoCoinsupplyTotal', async () => {
        const res = await KaspaApi.getInfoCoinsupplyTotal();
        console.log(`getInfoCoinsupplyTotal response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoKaspad', async () => {
        const res = await KaspaApi.getInfoKaspad();
        console.log(`getInfoKaspad response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoNetwork', async () => {
        const res = await KaspaApi.getInfoNetwork();
        console.log(`getInfoNetwork response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoFeeEstimate', async () => {
        const res = await KaspaApi.getInfoFeeEstimate();
        console.log(`getInfoFeeEstimate response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoPrice', async () => {
        const res = await KaspaApi.getInfoPrice();
        console.log(`getInfoPrice response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoBlockReward', async () => {
        const res = await KaspaApi.getInfoBlockReward();
        console.log(`getInfoBlockReward response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoHalving', async () => {
        const res = await KaspaApi.getInfoHalving();
        console.log(`getInfoHalving response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoHashRate', async () => {
        const res = await KaspaApi.getInfoHashRate();
        console.log(`getInfoHashRate response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoHashRateMax', async () => {
        const res = await KaspaApi.getInfoHashRateMax();
        console.log(`getInfoHashRateMax response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoHealth', async () => {
        const res = await KaspaApi.getInfoHealth();
        console.log(`getInfoHealth response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('getInfoMarketcap', async () => {
        const res = await KaspaApi.getInfoMarketcap();
        console.log(`getInfoMarketcap response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);


    it('getTransactionsId', async () => {
        const transactionId = '9475b4302a505d30d5aa3f98883b33e5e0bb6dd4a4560df844cd72954055aaaf';
        const res = await KaspaApi.getTransactionsId(transactionId);
        console.log(`getTransactionsId response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    });

    it('postTransactionsSearch', async () => {
        const res = await KaspaApi.postTransactionsSearch(params);
        console.log(`postTransactionsSearch response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('postTransactions', async () => {
        const res = await KaspaApi.postTransactions(params);
        console.log(`postTransactions response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

    it('postTransactionsMass', async () => {
        const res = await KaspaApi.postTransactionsMass(params);
        console.log(`postTransactionsMass response: \x1B[32m%s\x1B[0m`, JSON.stringify(res, null, 2));
        expect(res)
    }, 5000);

})
