import {KasplexApi} from '../src/api/kasplexApi'
import { describe, expect, test } from '@jest/globals';

let address = `kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf`
describe('api', () => {

    //Test for getBalance
    test('getBalance', async () => {
        console.log('getBalance test')
        const res = await KasplexApi.getBalance(address, 'SNOWDN')
        console.log(`getBalance response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
        expect(res)
    })

    // //Test for getTokenList
    // test('getTokenList', async () => {
    //     const res = await KasplexApi.getTokenList()
    //     console.log(`getTokenList response: \x1B[32m%s\x1B[0m`, res)
    //     expect(res)
    // })

    // // //Test for getTickInfo
    // test('getTickInfo', async () => {
    //     const res = await KasplexApi.getToken('TASK')
    //     console.log(`getTickInfo response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })

    // // //Test for getOpListByAddress
    // test('getAddressTokenList', async () => {
    //     const res = await KasplexApi.getAddressTokenList(address)
    //     console.log(`getAddressTokenList response:\x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })

    // //Test for getBalance
    // test('getOpList', async () => {
    //     const res = await KasplexApi.getOpList({address: address})
    //     console.log(`getOpList response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })

    // // Test for getOpDetail
    // test('getOpDetail', async () => {
    //     const id = `0af800789c14d8a044bebae4c3335fbb22286e41e02799a0dbae1adcfcba81d5`
    //     const res = await KasplexApi.getOpDetail(id)
    //     console.log(`getOpDetail response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })

    // // Test for getListingList
    // test('getListingList', async () => {
    //     const res = await KasplexApi.getListingList('SNOWDN')
    //     console.log(`getListingList response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })

    // // Test for getOpDetail
    // test('get address tick info', async () => {
    //     const addr = `kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08`
    //     const res = await KasplexApi.getBalance(addr, "SNOWDN")
    //     console.log(`getOpDetail response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })


    // test('get address tick info2', async () => {
    //     const addr = `kaspatest:qzlvpw668jyka4cegq4nagzm70uwlpc9j2xjywwlzthxgw77m3qwv4sggpg74`
    //     const res = await KasplexApi.getBalance(addr, "SNOWDN")
    //     console.log(`getOpDetail response: \x1B[32m%s\x1B[0m `, JSON.stringify(res))
    //     expect(res)
    // })

})
