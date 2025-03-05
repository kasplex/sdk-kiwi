
import Kiwi from '../src/index';

const { KasplexApi, NetworkType } = Kiwi

async function testKasplexApi() {
    try {
        // Example 1: Get general blockchain information
        const blockchainInfo = await KasplexApi.getInfo();
        console.log("Blockchain Info:", blockchainInfo);

        // Example 2: Get the list of KRC20 tokens
        const tokenList = await KasplexApi.getTokenList({"next" : "878553520000"});
        console.log("KRC20 Token List:", tokenList);

        // Example 3: Get details of a specific KRC20 token by its ticker symbol
        const tokenDetails = await KasplexApi.getToken('AMANU');
        console.log("Token Details for AMANU:", tokenDetails);

        // Example 4: Get the list of tokens associated with a specific address
        const address1 = "kaspatest:qqf686rsj5cj2rh80mtnyfp2snat4x92pzh6m2arqut3gcl5gm5vcyaezfulr";
        const addressTokens = await KasplexApi.getAddressTokenList(address1, {"next": "AMANP"});
        console.log(`Tokens for address ${address1}:`, addressTokens);

        // Example 5: Get the balance of a specific token for a given address
        const address2 = "kaspatest:qqf686rsj5cj2rh80mtnyfp2snat4x92pzh6m2arqut3gcl5gm5vcyaezfulr";
        const tick = "AABBCC"
        const tokenBalance = await KasplexApi.getBalance(address2, tick);
        console.log(`Balance of ${tick} for address ${address2}:`, tokenBalance);

        // Example 6: Get a list of KRC20 operations with query parameters
        const opsList = await KasplexApi.getOpList({"tick": "AABBCC"});
        console.log("KRC20 Operations List:", opsList);

        // Example 7: Get details of a specific KRC20 operation by its ID
        const opDetail = await KasplexApi.getOpDetail('878142570000');
        console.log("Operation Detail:", opDetail);

        // Example 8: Get VSPC archive details for a given DAAScore
        const daascore = "87814257";
        const vspcDetail = await KasplexApi.getVspcDetail(daascore);
        console.log("VSPC Detail:", vspcDetail);

        // Example 9: Get archived operations within a specific range
        const opRange = "8781425";
        const archivedOps = await KasplexApi.getOpListByRange(opRange);
        console.log(`Archived Operations in range ${opRange}:`, archivedOps);

        // Example 10: Get market listing details for a specific KRC20 token
        const listingDetails = await KasplexApi.getListingList('TRILIA');
        console.log("Market Listing for KAS:", listingDetails);

    } catch (error) {
        console.error("An error occurred while interacting with the Kasplex API:", error);
    }
}

// Run the test
testKasplexApi();
