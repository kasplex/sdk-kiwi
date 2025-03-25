import { httpClient } from '@/utils/http';
import { BASE_URL_KASPA } from '@/utils/constants';
import { Params } from '@/types/interface';
import { NetworkType } from "wasm/kaspa";
import { Kiwi } from "@/kiwi";

class KaspaApi {

    /**
     * Determines the appropriate API base URL based on the network type.
     * @returns {string} - The base API URL.
     */
    private static getBaseUrl(): string {
        const url = Kiwi.network === NetworkType.Mainnet ? BASE_URL_KASPA.MAIN : BASE_URL_KASPA.TEST;
        if (!url) {
            throw new Error("The current testing environment cannot call related interfaces.");
        }
        return url;
    }

    /**
     * Get balance for a specific Kaspa address.
     * @param kaspaAddress The Kaspa wallet address
     */
    public static getBalance(kaspaAddress: string) {
        return httpClient.get(`${this.getBaseUrl()}/addresses/${kaspaAddress}/balance`);
    }

    /**
     * Get balances for multiple addresses.
     * @param params List of addresses
     */
    public static postBalance(params: Params) {
        return httpClient.post(`${this.getBaseUrl()}/addresses/balances`, params);
    }

    /**
     * Get UTXOs for a specific Kaspa address.
     * @param kaspaAddress The Kaspa wallet address
     */
    public static getUtxo(kaspaAddress: string) {
        return httpClient.get(`${this.getBaseUrl()}/addresses/${kaspaAddress}/utxos`);
    }

    /**
     * Get UTXOs for multiple addresses.
     * @param params List of addresses
     */
    public static postUtxos(params: Params) {
        return httpClient.post(`${this.getBaseUrl()}/addresses/utxos`, params);
    }

    /**
     * Get transaction count for a specific Kaspa address.
     * @param kaspaAddress The Kaspa wallet address
     */
    public static getTransactionsCount(kaspaAddress: string) {
        return httpClient.get(`${this.getBaseUrl()}/addresses/${kaspaAddress}/transactions-count`);
    }


    /** Get BlockDAG info */
    public static getInfoBlockdag() {
        return httpClient.get(`${this.getBaseUrl()}/info/blockdag`);
    }

    public static getInfoCoinsupply() {
        return httpClient.get(`${this.getBaseUrl()}/info/coinsupply`);
    }

    public static getInfoCoinsupplyCirculating() {
        return httpClient.get(`${this.getBaseUrl()}/info/coinsupply/circulating`);
    }

    public static getInfoCoinsupplyTotal() {
        return httpClient.get(`${this.getBaseUrl()}/info/coinsupply/total`);
    }
    public static getInfoKaspad() {
        return httpClient.get(`${this.getBaseUrl()}/info/kaspad`);
    }
    public static getInfoNetwork() {
        return httpClient.get(`${this.getBaseUrl()}/info/network`);
    }
    public static getInfoFeeEstimate() {
        return httpClient.get(`${this.getBaseUrl()}/info/fee-estimate`);
    }
    public static getInfoPrice() {
        return httpClient.get(`${this.getBaseUrl()}/info/price`);
    }

    public static getInfoBlockReward() {
        return httpClient.get(`${this.getBaseUrl()}/info/blockreward`);
    }
    public static getInfoHalving() {
        return httpClient.get(`${this.getBaseUrl()}/info/halving`);
    }

    public static getInfoHashRate() {
        return httpClient.get(`${this.getBaseUrl()}/info/hashrate`);
    }

    public static getInfoHashRateMax() {
        return httpClient.get(`${this.getBaseUrl()}/info/hashrate/max`);
    }
    public static getInfoHealth() {
        return httpClient.get(`${this.getBaseUrl()}/info/health`);
    }

    public static getInfoMarketcap() {
        return httpClient.get(`${this.getBaseUrl()}/info/marketcap`);
    }


    /**
     * Get block details by block ID.
     * @param blockId The block identifier
     */
    public static getBlocksBlockId(blockId: string) {
        return httpClient.get(`${this.getBaseUrl()}/blocks/${blockId}`);
    }

    public static getBlocks() {
        return httpClient.get(`${this.getBaseUrl()}/blocks`);
    }

    public static getBlocksFromBluescore() {
        return httpClient.get(`${this.getBaseUrl()}/blocks-from-bluescore`);
    }


    /**
     * Get transaction details by transaction ID.
     * @param transactionId The transaction identifier
     */
    public static getTransactionsId(transactionId: string) {
        return httpClient.get(`${this.getBaseUrl()}/transactions/${transactionId}`);
    }

    /**
     * Search transactions based on parameters.
     * @param params The search query parameters
     */
    public static postTransactionsSearch(params: Params) {
        return httpClient.post(`${this.getBaseUrl()}/transactions/search`, params);
    }

    /**
     * Submit a new transaction.
     * @param params The transaction data
     */
    public static postTransactions(params: Params) {
        return httpClient.post(`${this.getBaseUrl()}/transactions`, params);
    }

    /**
     * Submit multiple transactions in a batch.
     * @param params The batch transaction data
     */
    public static postTransactionsMass(params: Params) {
        return httpClient.post(`${this.getBaseUrl()}/transactions/mass`, params);
    }
}

export { KaspaApi };