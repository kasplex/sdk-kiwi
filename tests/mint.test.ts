import { Rpc } from '../src/rpc/client'
import { KRC20 } from '../src/krc20'
import { createKrc20Data,  } from '../src/utils/utils'
import { OP } from '../src/utils/enum'
import { Kiwi, NetworkType, PrivateKey } from '../src';

import {loadKaspaWasm} from "../src/init";

await loadKaspaWasm()

let _toAddress = 'kaspatest:qrxh35ysr2hchag9gtam5vlkvpmn89ph78t6nqvg44yj3xf8rpeg2ttgg7a5t'
let _privateKey = "fd67dcd4f94b20ac5f7c5eea83bb886c388d7a7787fd315810ee6d002cf5eb9a"
// let _privateKey = "2596b6e6a76c75148fa41a5f72ea83c5b25f6fc4252d86a1ff8e7021f7632941"

async function mintTest() {
    Kiwi.setNetwork(NetworkType.Testnet)
    await Rpc.setInstance(NetworkType.Testnet).connect()

    const krc20data = createKrc20Data({
        p: "krc-20",
        op: OP.Mint,
        tick: 'OXXY',
    })
    let pk = new PrivateKey(_privateKey)
    let txid = await KRC20.mint(_privateKey, krc20data, 100000000n)
    console.log("txid", txid)
    await Rpc.getInstance().disconnect()
}


await mintTest()
