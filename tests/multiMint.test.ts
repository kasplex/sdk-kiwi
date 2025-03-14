import { Rpc } from '../src/rpc/client'
import { KRC20 } from '../src/krc20'
import { createKrc20Data,  } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Kiwi, NetworkType, PrivateKey } from '../src';

import {loadKaspaWasm} from "../src/init";

await loadKaspaWasm()

let _toAddress = 'kaspatest:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg2ttgg7a5t'
let _privateKey = "fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a"

async function multiMintTest() {
    Kiwi.setNetwork(NetworkType.Testnet)
    await Rpc.setInstance(NetworkType.Testnet).connect()
    console.log('rpc connect...')
    const krc20data = createKrc20Data({
        p: "krc-20",
        op: OP.Mint,
        tick: 'KFWFS',
    })
    let txid = await KRC20.multiMint(_privateKey, krc20data,5)
    console.log('multiMint txid', txid)
    await Rpc.getInstance().disconnect()
}


await multiMintTest()
