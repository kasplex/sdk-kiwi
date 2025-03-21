import { Rpc } from "../rpc/client"
import { Address, ScriptPublicKey, IUtxoEntry, UtxoEntryReference } from 'kasp-platform';
import { U64_MAX_VALUE, BASE_KAS_TO_P2SH_ADDRESS } from "../utils/constants";

class Entries {
    /**
     * Fetches UTXO entries for a given address from the RPC server.
     * 
     * @param address - The address to fetch UTXOs for.
     * @returns A promise that resolves to an array of UTXO entry references.
     */
    public static async entries(address: string): Promise<UtxoEntryReference[]> {
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [address] });
        return entries
    }

    /**
     * Creates a revealed UTXO entry for a given address and transaction hash.
     * 
     * @param address - The address associated with the UTXO.
     * @param hash - The transaction hash of the UTXO.
     * @param scriptPublicKey - The script public key of the UTXO.
     * @param amount - The amount of the UTXO (default is BASE_KAS_TO_P2SH_ADDRESS).
     * @param blockDaaScore - The block DAA score of the UTXO (default is U64_MAX_VALUE).
     * @returns An array containing the revealed UTXO entry.
     */
    public static revealEntries(
        address: Address, 
        hash: string, 
        scriptPublicKey: ScriptPublicKey, 
        amount:bigint = BASE_KAS_TO_P2SH_ADDRESS,
        blockDaaScore: bigint = U64_MAX_VALUE
    ): IUtxoEntry[] {
        return [{
            address,
            amount,
            outpoint: {
                transactionId: hash,
                index: 0
            },
            scriptPublicKey,
            blockDaaScore,
            isCoinbase: false,
        }];
    }
}

export { Entries }