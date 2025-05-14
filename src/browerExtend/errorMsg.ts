export const errorMsg = {
    WALLET_NOT_FOUND: (walletName: string) => `Wallet "${walletName}" not found or invalid`,
    WALLET_NOT_INITIALIZED: 'Please use WalletApi.create() to create an instance.',
    WALLET_OBJECT_NOT_INITIALIZED: 'Wallet object not initialized',
    FUNCTION_NAME_REQUIRED: 'Function name is required',
    METHOD_NOT_FUNCTION: (functionName: string) => `Method "${functionName}" is not a function`,
    WALLET_PROVIDER_NOT_INITIALIZED: 'Wallet provider not initialized. Call authorize() first.',
}