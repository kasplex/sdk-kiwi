class Outpoint {
    /**
     * Creates an outpoint object for a given transaction hash and optional index.
     * 
     * @param hash - The transaction hash of the UTXO.
     * @param index - The output index of the UTXO in the transaction (defaults to 0).
     * @returns An object representing the outpoint with `transactionId` and `index`.
     */
    public static outpoint(hash: string, index?: number) {
        return {
            transactionId: hash,
            index: index || 0,
        }
    }
}

export { Outpoint }