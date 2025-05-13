import { KasplexApi } from '@kasplex/kiwi'
import { describe, expect, it } from 'vitest';

let address = `kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08`
describe('api', () => {

    //Test for getBalance
    it('getBalance', async () => {
        console.log('getBalance test')
        const res = await KasplexApi.getBalance(address, 'SNOWDN')
        console.log(`getBalance response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    //Test for getTokenList
    it('getTokenList', async () => {
        const res = await KasplexApi.getTokenList()
        console.log(`getTokenList response: \x1B[32m%s\x1B[0m`, res)
        expect(res)
    })

    // //Test for getTickInfo
    it('getTickInfo', async () => {
        const res = await KasplexApi.getToken('SNOWDN')
        console.log(`getTickInfo response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // //Test for getOpListByAddress
    it('getAddressTokenList', async () => {
        const res = await KasplexApi.getAddressTokenList(address)
        console.log(`getAddressTokenList response:\x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    //Test for getOpList
    it('getOpList', async () => {
        const res = await KasplexApi.getOpList({ address, tick: 'SNOWDN' })
        console.log(`getOpList response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // Test for getOperationInfo
    it('getOperationInfo', async () => {
        const id = `b82a85199c4377dcf4295fbd2ccc916a75759746ad11791fd274f4916126bb36`
        const res = await KasplexApi.getOperationInfo(id)
        console.log(`getOperationInfo response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // Test for getMarketInfo
    it('getMarketInfo', async () => {
        const res = await KasplexApi.getMarketInfo('SNOWDN')
        console.log(`getMarketInfo response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // Test for getBlackList
    it('getBlackList', async () => {
        const ca = `4ec279c72ade6d2a9a7fd2022fee6aa2067271f0a049038a4088fd094ef90c33`
        const res = await KasplexApi.getBlackList(ca)
        console.log(`getBlackList response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

})
