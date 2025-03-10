import { NetworkType } from "../wasm/kaspa/kaspa";
import { loadKaspaWasm } from "./init";

class Kiwi {

    public static network: NetworkType = NetworkType.Testnet;
    private static isWasmLoaded: boolean = false;
    
    /**
     * Sets the network type for the Kiwi class.
     * 
     * @param {NetworkType} network - The network type to set (e.g., Mainnet, Testnet).
     */
    public static async setNetwork(network: NetworkType) {
        if(!Kiwi.isWasmLoaded) {
            await loadKaspaWasm()
            Kiwi.isWasmLoaded = true
        }
        Kiwi.network = network
    }
}
export { Kiwi };