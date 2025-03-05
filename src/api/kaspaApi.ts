import { httpClient } from '@/utils/http';
import { BASE_URL_KASPA } from '@/utils/constants';
interface Params {
    [key: string]: string | number | boolean | Array<string>;
}
class KaspaApi {
    private static readonly baseUrl: string = BASE_URL_KASPA;

    /** -----Kaspa addresses----- */

    /**
     * Get balance for a specific Kaspa address.
     * @param kaspaAddress The Kaspa wallet address
     */
    public static getBalance(kaspaAddress: string) {
        return httpClient.get(`${this.baseUrl}/addresses/${kaspaAddress}/balance`);
    }

    /**
     * Get balances for multiple addresses.
     * @param params List of addresses
     */
    public static postBalance(params: Params) {
        return httpClient.post(`${this.baseUrl}/addresses/balances`, params);
    }

    /**
     * Get UTXOs for a specific Kaspa address.
     * @param kaspaAddress The Kaspa wallet address
     */
    public static getUtxo(kaspaAddress: string) {
        return httpClient.get(`${this.baseUrl}/addresses/${kaspaAddress}/utxos`);
    }

    /**
     * Get UTXOs for multiple addresses.
     * @param params List of addresses
     */
    public static postUtxos(params: Params) {
        return httpClient.post(`${this.baseUrl}/addresses/utxos`, params);
    }

    /**
     * Get transaction count for a specific Kaspa address.
     * @param kaspaAddress The Kaspa wallet address
     */
    public static getTransactionsCount(kaspaAddress: string) {
        return httpClient.get(`${this.baseUrl}/addresses/${kaspaAddress}/transactions-count`);
    }

    /** -----Kaspa network info----- */
    /** Get BlockDAG info */
    public static getInfoBlockdag() {
        return httpClient.get(`${this.baseUrl}/info/blockdag`);
    }

    public static getInfoCoinsupply() {
        return httpClient.get(`${this.baseUrl}/info/coinsupply`);
    }

    public static getInfoCoinsupplyCirculating() {
        return httpClient.get(`${this.baseUrl}/info/coinsupply/circulating`);
    }
    
    public static getInfoCoinsupplyTotal() {
        return httpClient.get(`${this.baseUrl}/info/coinsupply/total`);
    }
    public static getInfoKaspad() {
        return httpClient.get(`${this.baseUrl}/info/kaspad`);
    }
    public static getInfoNetwork() {
        return httpClient.get(`${this.baseUrl}/info/network`);
    }
    public static getInfoFeeEstimate() {
        return httpClient.get(`${this.baseUrl}/info/fee-estimate`);
    }
    public static getInfoPrice() {
        return httpClient.get(`${this.baseUrl}/info/price`);
    }

    public static getInfoBlockReward() {
        return httpClient.get(`${this.baseUrl}/info/blockreward`);
    }
    public static getInfoHalving() {
        return httpClient.get(`${this.baseUrl}/info/halving`);
    }

    public static getInfoHashRate() {
        return httpClient.get(`${this.baseUrl}/info/hashrate`);
    }

    public static getInfoHashRateMax() {
        return httpClient.get(`${this.baseUrl}/info/hashrate/max`);
    }
    public static getInfoHealth() {
        return httpClient.get(`${this.baseUrl}/info/health`);
    }

    public static getInfoMarketcap() {
        return httpClient.get(`${this.baseUrl}/info/marketcap`);
    }

    /** -----Kaspa blocks----- */
    /**
     * Get block details by block ID.
     * @param blockId The block identifier
     */
    public static getBlocksBlockId(blockId: string) {
        return httpClient.get(`${this.baseUrl}/blocks/${blockId}`);
    }

    public static getBlocks() {
        return httpClient.get(`${this.baseUrl}/blocks`);
    }

    public static getBlocksFromBluescore() {
        return httpClient.get(`${this.baseUrl}/blocks-from-bluescore`);
    }

    /** -----Kaspa transactions----- */
    /**
     * Get transaction details by transaction ID.
     * @param transactionId The transaction identifier
     */
    public static getTransactionsId(transactionId: string) {
        return httpClient.get(`${this.baseUrl}/transactions/${transactionId}`);
    }

    /**
     * Search transactions based on parameters.
     * @param params The search query parameters
     */
    public static postTransactionsSearch(params: Params) {
        return httpClient.post(`${this.baseUrl}/transactions/search`, params);
    }

    /**
     * Submit a new transaction.
     * @param params The transaction data
     */
    public static postTransactions(params: Params) {
        return httpClient.post(`${this.baseUrl}/transactions`, params);
    }

    /**
     * Submit multiple transactions in a batch.
     * @param params The batch transaction data
     */
    public static postTransactionsMass(params: Params) {
        return httpClient.post(`${this.baseUrl}/transactions/mass`, params);
    }
}

export { KaspaApi, Params };