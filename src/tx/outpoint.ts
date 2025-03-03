class Outpoint {
    public static outpoint(hash: string, index?: number) {
        return {
            transactionId: hash,
            index: index || 0,
        }
    }
}

export { Outpoint }