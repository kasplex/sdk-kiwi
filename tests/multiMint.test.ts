import {KasplexApi} from '../src/api/kasplexApi'
import { Rpc } from '../src/rpc/client'
import { KRC20 } from '../src/krc20'
import { createKrc20Data,  } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Kiwi, NetworkType, PrivateKey } from '../src';

import {loadKaspaWasm} from "../src/init";

await loadKaspaWasm()

let _toAddress = 'kaspatest:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg2ttgg7a5t'
let _privateKey = "9c5584ec9a03c7b988fc83e92a88d05ca7587b207ab2f467b1b60b10e74418e0"

async function multiMintTest() {
    Kiwi.setNetwork(NetworkType.Testnet)
    await Rpc.setInstance(NetworkType.Testnet).connect()

    const krc20data = createKrc20Data({
        p: "krc-20",
        op: OP.Mint,
        tick: 'OXXY',
    })
    let pk = new PrivateKey(_privateKey)
    let txid = await KRC20.multiMint(_privateKey, krc20data,5n)
    await Rpc.getInstance().disconnect()
}


await multiMintTest()
