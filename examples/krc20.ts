import { Rpc, OP, createKrc20Data, KRC20, NetworkType, Kiwi } from '@kasplex/kiwi';

await Kiwi.setNetwork(NetworkType.Testnet);
const _toAddress = 'kaspatest:qpyrh5ev84kc50nrhnc3g59ujr3a3pv4jweg57rge9sydrwyz9drunfa9n4sf'
const _privateKey = "3da233c786bfb4cc6e7319f757a094fc2f33b4217613abe3d29ed684ee464828"

async function testKrc20Mint() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'SNOWDN',
        })
        let txid = await KRC20.mint(_privateKey, krc20data, 100000n)
        console.log("Mint txsh:", txid);
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("Error testing krc20 Mint:", error);
    }
}

async function testKrc20MutilMint() {
    try {
        await Rpc.setInstance(NetworkType.Testnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Mint,
            tick: 'SNOWDN',
        })
        let txids = await KRC20.multiMint(_privateKey, krc20data, 130000000n, 10)
        console.log("mutilMint txids", txids)
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("Error testing krc20 MutilMint:", error);
    }
}

async function testKrc20Deploy() {
    try {
        await Rpc.setInstance(NetworkType.Mainnet).connect()
        const deploydata = createKrc20Data({
            p: "krc-20",
            op: OP.Deploy,
            tick: "SNOWDN",
            to: "kaspatest:qr6uzet8l842fz33kjl4jk0t6t7m43n8rxvfj6jms9jjz0n08rneuej3f0m08",
            amt: "",
            max: "10000000000000",
            lim: "1000000000",
            dec: "8",
            pre: "1000000000000",
        })
        let txid = await KRC20.deploy(_privateKey, deploydata, 100000n)
        console.log("Deploy txsh", txid);

        // Disconnect from the RPC server
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("Error testing krc20 Deploy:", error);
    }
}

async function testKrc20Transfer() {
    try {
        await Rpc.setInstance(NetworkType.Mainnet).connect()
        const krc20data = createKrc20Data({
            p: "krc-20",
            op: OP.Transfer,
            tick: "SNOWDN",
            to: _toAddress,
            amt: "20",
        })
        let txid = await KRC20.transfer(_privateKey, krc20data, 130000n)
        console.log("Deploy txsh", txid);

        // Disconnect from the RPC server
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("Error testing krc20 transfer:", error);
    }
}

async function testKrc20List() {
    try {
        await Rpc.setInstance(NetworkType.Mainnet).connect()
        const listData = createKrc20Data({
            p: "krc-20",
            op: OP.List,
            tick: "SNOWDN",
            amt: "100000",
        })
        let txid = await KRC20.list(_privateKey, listData, 100000n)
        console.log("Deploy txsh", txid);

        // Disconnect from the RPC server
        await Rpc.getInstance().disconnect()
    } catch (error) {
        console.error("Error testing krc20 list:", error);
    }
}

// Run the test
// testKrc20Mint();
testKrc20MutilMint();
// testKrc20Deploy();
// testKrc20List()
// testKrc20Transfer()
