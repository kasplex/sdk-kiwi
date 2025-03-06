import { NetworkType } from "@/wasm/kaspa";
import { httpClient } from '@/utils/http';
import { BASE_URL_TEST, BASE_URL_MAIN } from '@/utils/constants';
import Kiwi from "@/kiwi";

class KasplexApi {

    /**
     * Determines the appropriate API base URL based on the network type.
     * @returns {string} - The base API URL.
     */
    private static getBaseUrl(): string {
        return Kiwi.network === NetworkType.Mainnet ? BASE_URL_MAIN : BASE_URL_TEST;
    }

    /**
     * Fetches general blockchain information.
     * @returns {Promise<any>} - The blockchain info response.
     */
    public static getInfo() {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/info`);
    }

    /**
     * Retrieves the list of KRC20 tokens.
     * @param {Record<string, string>} param - The optional query parameters:
     *   - `next`: Cursor to start next page (optional).
     *   - `prev`: Cursor to start previous page (optional).
     * @returns {Promise<any>} - The token list response.
     */
    public static getTokenList(param: Record<string, string> = {}) {
        return httpClient.get(`${this.getBaseUrl()}/v1/krc20/tokenlist`, param);
    }

    /**
     * Retrieves details of a specific KRC20 token by its ticker symbol.
     * @param {string} tick - The token ticker.
     * @returns {Promise<any>} - The token details response.
     */
    public static getToken(tick: string) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/krc20/token/${tick}`);
    }

    /**
     * Retrieves a list of tokens associated with a specific address.
     * @param {string} address - The wallet address.
     * @param {Record<string, string>} param - The optional query parameters:
     *   - `next`: Cursor to start next page (optional).
     *   - `prev`: Cursor to start previous page (optional).
     * @returns {Promise<any>} - The list of tokens held by the address.
     */
    public static getAddressTokenList(address: string, param: Record<string, string> = {}) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/krc20/address/${address}/tokenlist`, param);
    }

    /**
     * Retrieves the balance of a specific token for a given address.
     * @param {string} address - The wallet address.
     * @param {string} tick - The token ticker.
     * @returns {Promise<any>} - The balance response.
     */
    public static getBalance(address: string, tick: string) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/krc20/address/${address}/token/${tick}`);
    }

    /**
     * Retrieves a list of KRC20 operations based on query parameters.
     * @param {Record<string, string>} param - The optional query parameters:
     *   - `next`: Cursor to start next page (optional).
     *   - `prev`: Cursor to start previous page (optional).
     *   - `address`: Filter by address (case-insensitive) (optional address or tick must have one).
     *   - `tick`: Filter by token symbol (case-insensitive) (optional address or tick must have one).
     * @returns {Promise<any>} - The operations list response.
     */
    public static getOpList(param: Record<string, string>) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/krc20/oplist`, param);
    }

    /**
     * Retrieves details of a specific KRC20 operation by its ID.
     * @param {string} id - The operation ID.
     * @returns {Promise<any>} - The operation details response.
     */
    public static getOpDetail(id: string) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/krc20/op/${id}`);
    }

    /**
     * Retrieves VSPC archive details for a given DAAScore.
     * @param {string} daascore - The DAAScore to look up.
     * @returns {Promise<any>} - The VSPC details response.
     */
    public static getVspcDetail(daascore: string) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/archive/vspc/${daascore}`);
    }

    /**
     * Retrieves a list of archived operations within a specific range.
     * @param {string} oprange - The operation range.
     * @returns {Promise<any>} - The archived operations list response.
     */
    public static getOpListByRange(oprange: string) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/archive/oplist/${oprange}`);
    }

    /**
     * Retrieves market listing details for a specific KRC20 token.
     * @param {string} tick - The token ticker.
     * @param {Record<string, string>} param - The optional query parameters:
     *   - `next`: Cursor to start next page (optional).
     *   - `prev`: Cursor to start previous page (optional).
     *   - `address`: Filter by address (case-insensitive) (optional).
     *   - `txid`: The UTXO hash bound to the order. Must also specify the address. (optional).
     * @returns {Promise<any>} - The listing response.
     */
    public static getListingList(tick: string, param: Record<string, string> = {}) {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/v1/krc20/market/${tick}`, param);
    }
}

export { KasplexApi };
