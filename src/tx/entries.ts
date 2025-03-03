import { Rpc } from "@/rpc/client"
import { Address, ScriptPublicKey, IUtxoEntry, UtxoEntryReference } from "../../wasm/kaspa";
import { U64_MAX_VALUE, BASE_KAS_TO_P2SH_ADDRESS } from "@/utils/constants";

class Entries {
    public static async entries(address: string): Promise<UtxoEntryReference[]> {
        const { entries } = await Rpc.getInstance().client.getUtxosByAddresses({ addresses: [address] });
        return entries
    }

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