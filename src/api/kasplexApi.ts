import { Wasm } from "../index";
import { httpClient } from '../utils/http';
import { BASE_URL_TEST, BASE_URL_MAIN } from '../utils/constants';
import { Kiwi } from "../kiwi";
import { 
    StatusInfoResponse, 
    TokenListResponse,
    TokenInfoResponse,
    AddressTokenListResponse,
    BalanceResponse,
    MarketInfoResponse,
    BlackListResponse,
    OpListResponse,
    OperationInfoResponse,
    ArchiveOpListResponse,
    ArchiveVspcListResponse,
} from '../types/kasplexApiType'

class KasplexApi {

    static version = '/v1'

    /**
     * Determines the appropriate API base URL based on the network type.
     * @returns {string} - The base API URL.
     */
    private static getBaseUrl(): string {
        const baseUrl = Kiwi.network === Wasm.NetworkType.Mainnet ? BASE_URL_MAIN : BASE_URL_TEST;
        return `${baseUrl}${this.version}`
    }
    /**
     * Fetches general blockchain information.
     * @returns {Promise<StatusInfoResponse>} - A promise resolving to the blockchain info response.
     */
    public static getInfo(): Promise<StatusInfoResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/info`);
    }

    /**
     * Retrieves the list of KRC20 tokens.
     * @param {Record<string, string>} param - Optional query parameters:
     *   - `next`: Cursor to start the next page (optional).
     *   - `prev`: Cursor to start the previous page (optional).
     * @returns {Promise<TokenListResponse>} - A promise resolving to the token list response.
     */
    public static getTokenList(param: Record<string, string> = {}): Promise<TokenListResponse> {
        return httpClient.get(`${this.getBaseUrl()}/krc20/tokenlist`, param);
    }

    /**
     * Retrieves details of a specific KRC20 token by its ticker symbol.
     * @param {string} tick - The token ticker symbol.
     * @returns {Promise<TokenInfoResponse>} - A promise resolving to the token details response.
     */
    public static getToken(tick: string): Promise<TokenInfoResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/token/${tick}`);
    }

    /**
     * Retrieves a list of tokens associated with a specific address.
     * @param {string} address - The wallet address.
     * @param {Record<string, string>} param - Optional query parameters:
     *   - `next`: Cursor to start the next page (optional).
     *   - `prev`: Cursor to start the previous page (optional).
     * @returns {Promise<AddressTokenListResponse>} - A promise resolving to the list of tokens held by the address.
     */
    public static getAddressTokenList(address: string, param: Record<string, string> = {}): Promise<AddressTokenListResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/address/${address}/tokenlist`, param);
    }

    /**
     * Retrieves the balance of a specific token for a given address.
     * @param {string} address - The wallet address.
     * @param {string} tick - The token ticker symbol.
     * @returns {Promise<BalanceResponse>} - A promise resolving to the balance response.
     */
    public static getBalance(address: string, tick: string): Promise<BalanceResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/address/${address}/token/${tick}`);
    }

    /**
     * Retrieves a list of KRC20 operations based on query parameters.
     * @param {Record<string, string>} param - Optional query parameters:
     *   - `next`: Cursor to start the next page (optional).
     *   - `prev`: Cursor to start the previous page (optional).
     *   - `address`: Filter by address (case-insensitive) (optional, either address or tick must be provided).
     *   - `tick`: Filter by token symbol (case-insensitive) (optional, either address or tick must be provided).
     * @returns {Promise<OpListResponse>} - A promise resolving to the operations list response.
     */
    public static getOpList(param?: Record<string, string>): Promise<OpListResponse>{
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/oplist`, param);
    }

    /**
     * Retrieves details of a specific KRC20 operation by its ID.
     * @param {string} id - The operation ID.
     * @returns {Promise<OperationInfoResponse>} - A promise resolving to the operation details response.
     */
    public static getOperationInfo(id: string): Promise<OperationInfoResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/op/${id}`);
    }

    /**
     * Retrieves VSPC archive details for a given DAAScore.
     * @param {string} daascore - The DAAScore to look up.
     * @returns {Promise<ArchiveVspcListResponse>} - A promise resolving to the VSPC details response.
     */
    public static getVspcDetail(daascore: string): Promise<ArchiveVspcListResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/archive/vspc/${daascore}`);
    }

    /**
     * Retrieves a list of archived operations within a specific range.
     * @param {string} oprange - The operation range.
     * @returns {Promise<ArchiveOpListResponse>} - A promise resolving to the archived operations list response.
     */
    public static getOpListByRange(oprange: string): Promise<ArchiveOpListResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/archive/oplist/${oprange}`);
    }

    /**
     * Retrieves market listing details for a specific KRC20 token.
     * @param {string} tick - The token ticker symbol.
     * @param {Record<string, string>} param - Optional query parameters:
     *   - `next`: Cursor to start the next page (optional).
     *   - `prev`: Cursor to start the previous page (optional).
     *   - `address`: Filter by address (case-insensitive) (optional).
     *   - `txid`: The UTXO hash bound to the order. Must also specify the address (optional).
     * @returns {Promise<MarketInfoResponse>} - A promise resolving to the market listing details response.
     */
    public static getMarketInfo(tick: string, param: Record<string, string> = {}): Promise<MarketInfoResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/market/${tick}`, param);
    }

    /**
     * Retrieves the blacklist for a specific contract address.
     * @param {string} ca - The contract address.
     * @param {Record<string, string>} param - Optional query parameters:
     *   - `next`: Cursor to start the next page (optional).
     *   - `prev`: Cursor to start the previous page (optional).
     * @returns {Promise<BlackListResponse>} - A promise resolving to the blacklist response.
     */
    public static getBlackList(ca: string, param: Record<string, string> = {}): Promise<BlackListResponse> {
        return httpClient.get(`${KasplexApi.getBaseUrl()}/krc20/blacklist/${ca}`, param);
    }
}

export { KasplexApi };
