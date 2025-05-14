import { BrowerWallet } from "./walletDetector";
import { errorMsg } from './errorMsg'

/**
 * A unified wallet API interface for interacting with various cryptocurrency wallets.
 * Provides standardized methods for account management, transactions, and wallet operations.
 */
class WalletApi {
    private walletObj: Record<string, any> | null = null;
    private initialized: boolean = false;
    public walletName: string = '';

    private constructor() { }

    /**
     * Initializes the wallet instance with the specified wallet provider
     * @param walletName - Name of the wallet provider (e.g., 'kasware', 'unisat')
     * @throws Error if wallet is not found or invalid
     */
    private async initWallet(walletName: string) {
        this.walletObj = await BrowerWallet.getWallet(walletName);
        if (!this.walletObj) {
            throw new Error(errorMsg.WALLET_NOT_FOUND(walletName));
        }
        this.walletName = walletName;
        this.initialized = true;
    }

    /**
     * Factory method to create a new WalletApi instance
     * @param walletName - Name of the wallet provider
     * @returns Promise<WalletApi> - Initialized wallet instance
     */
    public static async create(walletName: string): Promise<WalletApi> {
        const instance = new WalletApi();
        await instance.initWallet(walletName);
        return instance;
    }
    /**
     * Validates that the wallet instance is properly initialized
     * @throws Error if instance is not initialized
     */
    private async ensureInitialized() {
        if (!this.initialized) {
            throw new Error(errorMsg.WALLET_NOT_INITIALIZED);
        }
    }

    /**
     * Validates and returns a wallet method
     * @param functionName - Name of the wallet method to call
     * @returns Function - Bound wallet method
     * @throws Error if method is invalid or unavailable
     */
    public async checkFun(functionName: string) {
        try {
            await this.ensureInitialized();
            if (!this.walletObj) {
                throw new Error(errorMsg.WALLET_OBJECT_NOT_INITIALIZED);
            }
            if (!functionName) {
                throw new Error(errorMsg.FUNCTION_NAME_REQUIRED);
            }
            const fn = this.walletObj[functionName];
            if (typeof fn !== 'function') {
                throw new Error(errorMsg.METHOD_NOT_FUNCTION(functionName));
            }
            return fn.bind(this.walletObj);
        } catch (error) {
            throw Error(error as string);
        }
    }

    /**
     * Performs wallet-specific authorization flow
     * @returns Promise<string> - Authorization result (varies by wallet)
     */
    public async authorize() {
        if (!this.walletName) return '';
        const walletName = this.walletName.toLowerCase();
        switch (walletName) {
            case 'kastle':
                return await this.connect();
            case 'kasware':
            case 'unisat':
                return await this.requestAccounts();
            case 'kaskeeper':
                return await this.disconnect();
            default:
                return '';
        }
    }

    /**
     * Validates wallet object is initialized
     * @private
     * @throws {Error} When wallet object is not available
     */
    private validateWalletObject(): void {
        if (!this.walletObj) {
            throw new Error(errorMsg.WALLET_PROVIDER_NOT_INITIALIZED);
        }
    }
    /**
     * Registers a handler for the 'accountsChanged' event.
     * @param handler - Callback function to handle the event.
     */
    public async onAccountsChanged(handler: (accounts: string[]) => void): Promise<void> {
        await this.ensureInitialized();
        this.validateWalletObject();
        this.walletObj && this.walletObj.on('accountsChanged', handler);
    }

    /**
     * Removes a handler for the 'accountsChanged' event.
     * @param handler - Callback function to remove.
     */
    public async offAccountsChanged(handler: (accounts: string[]) => void): Promise<void> {
        await this.ensureInitialized();
        this.validateWalletObject();
        this.walletObj && this.walletObj.removeListener('accountsChanged', handler);
    }

    /**
     * Registers a callback for network change events
     * @param handler - Callback function that receives new network identifier
     * @throws {Error} When wallet is not initialized
     * @example
     * wallet.onNetworkChanged((network) => {
     *   console.log('Network changed to:', network);
     * });
     */
    public async onNetworkChanged(handler: (network: string) => void): Promise<void> {
        await this.ensureInitialized();
        this.validateWalletObject();
        this.walletObj && this.walletObj.on('networkChanged', handler);
    }

    /**
     * Unregisters a network change callback
     * @param handler - Previously registered callback function to remove
     * @throws {Error} When wallet is not initialized
     */
    public async offNetworkChanged(handler: (network: string) => void): Promise<void> {
        await this.ensureInitialized();
        this.validateWalletObject();
        this.walletObj && this.walletObj.removeListener('networkChanged', handler);
    }

    /**
     * Requests access to wallet accounts
     * @returns Promise<string[]> - Array of authorized account addresses
     */
    public async requestAccounts(): Promise<string[]> {
        const fn = await this.checkFun('requestAccounts');
        return await fn();
    }

    /**
     * Gets currently connected accounts
     * @returns Promise<string> - Primary account address
     */
    public async getAccounts(): Promise<string> {
        const fn = await this.checkFun('getAccounts');
        return await fn();
    }
    /**
     * Gets current network version
     * @returns Promise<string> - Network version identifier
     */
    public async getVersion(): Promise<string> {
        const fn = await this.checkFun('getVersion');
        return await fn();
    }

    /**
     * Gets current network information
     * @returns Promise<string> - Network name/identifier
     */
    public async getNetwork(): Promise<string> {
        const fn = await this.checkFun('getNetwork');
        return await fn();
    }

    /**
     * Switches wallet to specified network
     * @param network - Target network identifier
     * @returns Promise<string> - Operation result
     */
    public async switchNetwork(network: string): Promise<string> {
        const fn = await this.checkFun('switchNetwork');
        return await fn(network);
    }

    /**
     * Disconnects from wallet
     * @param origin - Optional origin identifier
     * @returns Promise<string> - Disconnection result
     */
    public async disconnect(orgin?: string): Promise<string> {
        const fn = await this.checkFun('disconnect');
        return await fn(orgin);
    }

    /**
     * Retrieves the public key from the wallet.
     * @returns {Promise<string>} - Public key.
     */
    public async getPublicKey(): Promise<string> {
        const fn = await this.checkFun('getPublicKey');
        return await fn();
    }

    /**
     * Gets current account balance
     * @returns Promise<Object> - Balance information
     */
    public async getBalance(): Promise<Object> {
        const fn = await this.checkFun('getBalance');
        return await fn();
    }

    /**
     * Retrieves the KRC20 token balance.
     * @returns {Promise<Array<any> | Object>} - KRC20 token balance.
     */
    public async getKRC20Balance(): Promise<Array<any> | Object> {
        const fn = await this.checkFun('getKRC20Balance');
        return await fn();
    }

    /**
     * Retrieves the UTXO entries from the wallet.
     * @returns {Promise<Array<any> | Object>} - UTXO entries.
     */
    public async getUtxoEntries(): Promise<Array<any> | Object> {
        const fn = await this.checkFun('getUtxoEntries');
        return await fn();
    }

    /**
     * Sends Kaspa transaction
     * @param toAddress - Recipient address
     * @param sompi - Amount in sompi
     * @param options - Additional transaction options
     * @returns Promise<string> - Transaction hash
     */
    public async sendKaspa(toAddress: string, sompi: number, options: object): Promise<string> {
        const fn = await this.checkFun('sendKaspa');
        return await fn(toAddress, sompi, options);
    }

    /**
     * Signs a PSKT transaction
     * @param txJsonString - Transaction data in JSON format
     * @param options - Signing options
     * @returns Promise<string> - Signed transaction
     */
    public async signPskt({ txJsonString, options }: { txJsonString: string, options: object }): Promise<string> {
        const fn = await this.checkFun('signPskt');
        return await fn({ txJsonString, options });
    }

    /**
     * Builds a script for a transaction.
     * @param {Object} params - Script parameters.
     * @param {string} params.type - Script type.
     * @param {string} params.data - Script data.
     * @returns {Promise<string>} - Built script.
     */
    public async buildScript({ type, data }: { type: string, data: string }): Promise<string> {
        const fn = await this.checkFun('buildScript');
        return await fn({ type, data });
    }

    /**
     * Submits a commit-reveal transaction.
     * @param {object} commit - Commit transaction.
     * @param {object} reveal - Reveal transaction.
     * @param {any} script - Script data.
     * @param {string} networkId - Network ID.
     * @returns {Promise<any>} - Transaction result.
     */
    public async submitCommitReveal(commit: object, reveal: object, script: any, networkId: string) {
        const fn = await this.checkFun('submitCommitReveal');
        return await fn(commit, reveal, script, networkId);
    }

    /**
     * Creates a KRC20 order.
     * @param {Object} params - Order parameters.
     * @param {string} params.krc20Tick - KRC20 ticker.
     * @param {number | string} params.krc20Amount - KRC20 amount.
     * @param {number} params.kasAmount - Kaspa amount.
     * @param {Array<{ address: string; amount: number }>} params.psktExtraOutput - Extra outputs.
     * @param {number} params.priorityFee - Priority fee.
     * @returns {Promise<any>} - Order result.
     */
    public async createKRC20Order({
        krc20Tick,
        krc20Amount,
        kasAmount,
        psktExtraOutput,
        priorityFee
    }: {
        krc20Tick: string,
        krc20Amount: number | string,
        kasAmount: number,
        psktExtraOutput: { address: string; amount: number }[],
        priorityFee: number
    }) {
        const fn = await this.checkFun('createKRC20Order');
        return await fn({ krc20Tick, krc20Amount, kasAmount, psktExtraOutput, priorityFee });
    }

    /**
     * Buys a KRC20 token.
     * @param {Object} params - Transaction parameters.
     * @param {string} params.txJsonString - Transaction JSON string.
     * @param {Array<{ address: string; amount: number }>} params.extraOutput - Extra outputs.
     * @param {number} params.priorityFee - Priority fee.
     * @returns {Promise<any>} - Transaction result.
     */
    public async buyKRC20Token({ txJsonString, extraOutput, priorityFee }: { txJsonString: string, extraOutput: { address: string; amount: number }[], priorityFee: number }) {
        const fn = await this.checkFun('buyKRC20Token');
        return await fn({ txJsonString, extraOutput, priorityFee });
    }

    /**
     * Cancels a KRC20 order.
     * @param {Object} params - Order parameters.
     * @param {string} params.krc20Tick - KRC20 ticker.
     * @param {string} params.txJsonString - Transaction JSON string.
     * @param {string} params.sendCommitTxId - Commit transaction ID.
     * @returns {Promise<string>} - Cancellation result.
     */
    public async cancelKRC20Order({ krc20Tick, txJsonString, sendCommitTxId }: { krc20Tick: string, txJsonString: string, sendCommitTxId: string }): Promise<string> {
        const fn = await this.checkFun('cancelKRC20Order');
        return await fn({ krc20Tick, txJsonString, sendCommitTxId });
    }

    /**
     * Signs a message.
     * @param {string} msg - Message to sign.
     * @param {string} type - Signature type.
     * @returns {Promise<string>} - Signed message.
     */
    public async signMessage(msg: string, type: string): Promise<string> {
        const fn = await this.checkFun('signMessage');
        return await fn(msg, type);
    }

    /**
     * Signs a KRC20 transaction.
     * @param {string} inscribeJsonString - Inscription JSON string.
     * @param {number} type - Transaction type.
     * @param {string} destAddr - Destination address.
     * @param {number} priorityFee - Priority fee.
     * @returns {Promise<any>} - Signed transaction.
     */
    public async signKRC20Transaction(inscribeJsonString: string, type: number, destAddr: string, priorityFee: number) {
        const fn = await this.checkFun('signKRC20Transaction');
        return await fn(inscribeJsonString, type, destAddr, priorityFee);
    }

    /**
     * Retrieves the current chain.
     * @returns {Promise<Object>} - Current chain.
     */
    public async getChain(): Promise<Object> {
        const fn = await this.checkFun('getChain');
        return await fn();
    }

    /**
     * Switches the wallet to the specified blockchain network
     * @param chain - Chain ID/number to switch to
     * @returns Promise<Object> - Result object containing network switch details
     * @throws Error if chain switching fails or unsupported chain
     */
    public async switchChain(chain: number): Promise<Object> {
        const fn = await this.checkFun('switchChain');
        return await fn(chain);
    }

    /**
     * Retrieves a paginated list of digital inscriptions (NFTs/BRC-20 tokens)
     * @param cursor - Starting index for pagination (default: 0)
     * @param size - Number of items per page (default: 10)
     * @returns Promise<Object> - Paginated inscription data { list, total, cursor }
     */
    public async getInscriptions(cursor: number = 0, size: number = 10): Promise<Object> {
        const fn = await this.checkFun('getInscriptions');
        return await fn(cursor, size);
    }

    /**
     * Sends Bitcoin transaction to specified address
     * @param toAddress - Recipient Bitcoin address
     * @param satoshis - Amount to send in satoshis
     * @param options - Additional transaction options { feeRate, memo, etc. }
     * @returns Promise<string> - Resulting transaction hash
     */
    public async sendBitcoin(toAddress: string, satoshis: number, options: object): Promise<string> {
        const fn = await this.checkFun('sendBitcoin');
        return await fn(toAddress, satoshis, options);
    }

    /**
     * Transfers Runes protocol tokens
     * @param address - Recipient address
     * @param runeid - Rune ID/identifier
     * @param amount - Amount to transfer
     * @param options - Additional transfer options
     * @returns Promise<Object> - Transfer result { txId, status }
     */
    public async sendRunes(address: string, runeid: string, amount: string, options: object): Promise<Object> {
        const fn = await this.checkFun('sendRunes');
        return await fn(address, runeid, amount, options);
    }

    /**
     * Transfers a single inscription (NFT/BRC-20)
     * @param address - Recipient address
     * @param inscriptionId - ID of the inscription to transfer
     * @param options - Transfer options { feeRate, etc. }
     * @returns Promise<Object> - Transfer confirmation data
     */
    public async sendInscription(address: string, inscriptionId: string, options: object): Promise<Object> {
        const fn = await this.checkFun('sendInscription');
        return await fn(address, inscriptionId, options);
    }

    /**
     * Creates a transfer inscription for specified token
     * @param ticker - Token ticker symbol (e.g., 'ordi')
     * @param amount - Amount to inscribe
     * @returns Promise<void> - Resolves when inscription is initiated
     */
    public async inscribeTransfer(ticker: string, amount: string): Promise<void> {
        const fn = await this.checkFun('inscribeTransfer');
        return await fn(ticker, amount);
    }

    /**
     * Broadcasts a raw transaction to the network
     * @param options - Transaction data { hex, network, etc. }
     * @returns Promise<string> - Broadcast transaction ID
     */
    public async pushTx(options: object): Promise<string> {
        const fn = await this.checkFun('pushTx');
        return await fn(options);
    }

    /**
     * Signs a Partially Signed Bitcoin Transaction (PSBT)
     * @param psbtHex - PSBT in hex format
     * @param options - Signing options { autoFinalize, etc. }
     * @returns Promise<string> - Signed PSBT hex
     */
    public async signPsbt(psbtHex: string, options: object): Promise<string> {
        const fn = await this.checkFun('signPsbt');
        return await fn(psbtHex, options);
    }

    /**
     * Batch signs multiple PSBTs
     * @param psbtHexs - Array of PSBT hex strings
     * @param options - Array of signing options per PSBT
     * @returns Promise<string[]> - Array of signed PSBT hex strings
     */
    public async signPsbts(psbtHexs: string[], options: object[]): Promise<string[]> {
        const fn = await this.checkFun('signPsbts');
        return await fn(psbtHexs, options);
    }

    /**
     * Pushes a signed PSBT to the network
     * @param psbtHex - Signed PSBT in hex format
     * @returns Promise<string> - Broadcast transaction ID
     */
    public async pushPsbt(psbtHex: string): Promise<string> {
        const fn = await this.checkFun('pushPsbt');
        return await fn(psbtHex);
    }

    /**
     * Establishes connection with wallet provider
     * @returns Promise<void> - Resolves when connection is established
     * @throws Error if connection fails
    */
    public async connect(): Promise<void> {
        const fn = await this.checkFun('connect');
        return await fn();
    }

    /**
     * Initializes wallet state and required parameters
     * @returns Promise<any> - Wallet initialization data
    */
    public async initialize() {
        const fn = await this.checkFun('initialize');
        return await fn();
    }

    /**
     * Opens wallet UI for KRC-20 token deployment
     * @returns Promise<any> - Deployment interface response
     */
    public async openDeployKrc20View() {
        const fn = await this.checkFun('openDeployKrc20View');
        return await fn();
    }

    /**
     * Opens wallet UI for KRC-20 token minting
     * @returns Promise<any> - Minting interface response
     */
    public async openMintKrc20View() {
        const fn = await this.checkFun('openMintKrc20View');
        return await fn();
    }

    /**
     * Verifies a signed message against current account
     * @returns Promise<any> - Verification result
     */
    public async verifyMessage() {
        const fn = await this.checkFun('verifyMessage');
        return await fn();
    }
}

export { WalletApi }