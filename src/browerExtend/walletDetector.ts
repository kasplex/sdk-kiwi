import { WALLET_ID_LIST } from '../utils/constants'

class BrowerWallet {
    static walletList: string[] = [];

    /**
     * Retrieves a list of installed browser wallets by checking their global variables.
     * This method iterates through the `WALLET_ID_LIST` and checks if each wallet's global variable
     * exists on the `window` object.
     *
     * @returns {Promise<string[]>} A promise that resolves to an array of wallet keys for installed wallets.
     */
    public static async getBrowerWalletList(): Promise<string[]> {
        if(this.walletList.length) return this.walletList
        for (const key in WALLET_ID_LIST) {
            const isInstalled = await this.isExtInstalled(key)
            if (isInstalled) {
                this.walletList.push(key)
            }
        }
        return this.walletList
    }

    /**
     * Detects whether specified browser extensions are installed by checking their global variables.
     * This method takes an array of extension names and checks if each extension's global variable
     *
     * @param {string[]} extensionNames - An array of extension names to check.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves to an object mapping extension names to their installation status.
     */
    public static async detectBrowserExtensions(extensionNames: string[]): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};
        if (!extensionNames || extensionNames.length === 0) return results
        await Promise.all(
            extensionNames.map(async (extensionNames) => {
                results[extensionNames] = await this.isExtInstalled(extensionNames);
            })
        );
        return results
    }

    /**
     * Checks if a specific browser extension is installed by verifying its global variable.
     * This method attempts to detect the extension by checking if the corresponding global variable
     * might be loaded asynchronously.
     *
     * @param {string} extensionName - The name of the extension to check.
     * @param {number} retries - The number of retry attempts (default: 1).
     * @param {number} delay - The delay (in milliseconds) between retries (default: 300).
     * @returns {Promise<boolean>} A promise that resolves to `true` if the extension is installed, otherwise `false`.
     */
    public static async isExtInstalled(extensionName: string, retries: number = 2, delay: number = 300): Promise<boolean> {
        try {
            if (!extensionName) return false;
            for (let i = 0; i < retries; i++) {
                const wallet = (window as any)[extensionName];
                if (wallet && typeof wallet === 'object') {
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Retrieves the wallet instance for the specified wallet name.
     * This method checks if the wallet extension is installed by verifying its global variable on the `window` object.
     * If the wallet is installed, it returns the wallet instance; otherwise, it returns `null`.
     *
     * @param {string} walletName - The name of the wallet to retrieve.
     * @returns {Promise<Window[keyof Window] | null>} A promise that resolves to the wallet instance if installed, otherwise `null`.
     */
    public static async getWallet(walletName: string): Promise<Window[keyof Window] | null> {
        if (!walletName) return null;
        const extensionName = Object.keys(WALLET_ID_LIST).find(key => key.toLowerCase() === walletName.toLowerCase()) || walletName;
        const isInstalled = await this.isExtInstalled(extensionName);
        return isInstalled ? window[extensionName as keyof Window] : null;
    }
}

export { BrowerWallet}