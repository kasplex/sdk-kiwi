import { KaspaApi } from '../src/index';

async function testKaspaApi() {
    try {
        // Example 1: Get Kaspa network information
        const blockDagInfo = await KaspaApi.getInfoBlockdag();
        console.log("BlockDAG Info:", blockDagInfo);

        const coinSupply = await KaspaApi.getInfoCoinsupply();
        console.log("Coin Supply Info:", coinSupply);

        const circulatingSupply = await KaspaApi.getInfoCoinsupplyCirculating();
        console.log("Circulating Supply:", circulatingSupply);

        const totalSupply = await KaspaApi.getInfoCoinsupplyTotal();
        console.log("Total Coin Supply:", totalSupply);

        const kaspadInfo = await KaspaApi.getInfoKaspad();
        console.log("Kaspa Daemon Info:", kaspadInfo);

        const networkInfo = await KaspaApi.getInfoNetwork();
        console.log("Network Info:", networkInfo);

        const feeEstimate = await KaspaApi.getInfoFeeEstimate();
        console.log("Fee Estimate:", feeEstimate);

        const marketPrice = await KaspaApi.getInfoPrice();
        console.log("Market Price:", marketPrice);

        const blockReward = await KaspaApi.getInfoBlockReward();
        console.log("Block Reward Info:", blockReward);

        const halvingInfo = await KaspaApi.getInfoHalving();
        console.log("Halving Info:", halvingInfo);

        const hashRate = await KaspaApi.getInfoHashRate();
        console.log("Hash Rate:", hashRate);

        const maxHashRate = await KaspaApi.getInfoHashRateMax();
        console.log("Max Hash Rate:", maxHashRate);

        const healthStatus = await KaspaApi.getInfoHealth();
        console.log("Health Status:", healthStatus);

        const marketCap = await KaspaApi.getInfoMarketcap();
        console.log("Market Capitalization:", marketCap);

        // Example 2: Get Kaspa account balance
        const kaspaAddress = "kaspa:qqf686rsj5cj2rh80mtnyfp2snat4x92pzh6m2arqut3gcl5gm5vcyaezfulr";
        const balance = await KaspaApi.getBalance(kaspaAddress);
        console.log(`Balance for ${kaspaAddress}:`, balance);

        // Example 3: Get balances for multiple addresses
        const addresses = { addresses: [kaspaAddress, "kaspa:qqabcdefghij1234567890lmnopqrstuvwxy"] };
        const multiBalances = await KaspaApi.postBalance(addresses);
        console.log("Multiple Addresses Balance:", multiBalances);

        // Example 4: Get UTXO data for a specific address
        const utxos = await KaspaApi.getUtxo(kaspaAddress);
        console.log(`UTXOs for ${kaspaAddress}:`, utxos);

        // Example 5: Get UTXO data for multiple addresses
        const multiUtxos = await KaspaApi.postUtxos(addresses);
        console.log("Multiple Addresses UTXOs:", multiUtxos);

        // Example 6: Get transaction count for a specific address
        const txCount = await KaspaApi.getTransactionsCount(kaspaAddress);
        console.log(`Transaction count for ${kaspaAddress}:`, txCount);

        // Example 7: Get transaction details by transaction ID
        const transactionId = "0000000000000000000000000000000000000000000000000000000000000000";
        const transactionInfo = await KaspaApi.getTransactionsId(transactionId);
        console.log(`Transaction Info for ${transactionId}:`, transactionInfo);

        // Example 8: Search for transactions based on parameters
        const searchParams = { address: kaspaAddress };
        const searchResults = await KaspaApi.postTransactionsSearch(searchParams);
        console.log("Transaction Search Results:", searchResults);

        // Example 9: Submit a new transaction
        const newTransaction = { from: kaspaAddress, to: "kaspa:qwertyuiopasdfghjklzxcvbnm1234567890", amount: "1000" };
        const txResponse = await KaspaApi.postTransactions(newTransaction);
        console.log("Transaction Submission Response:", txResponse);

        // Example 10: Get block details by block ID
        const blockId = "0000000000000000000000000000000000000000000000000000000000000000";
        const blockInfo = await KaspaApi.getBlocksBlockId(blockId);
        console.log(`Block Info for ${blockId}:`, blockInfo);

        // Example 11: Get a list of recent blocks
        const blocks = await KaspaApi.getBlocks();
        console.log("Latest Blocks:", blocks);

    } catch (error) {
        console.error("An error occurred while testing the Kaspa API:", error);
    }
}

// Run the test
testKaspaApi();
