import { NetworkType } from "../wasm/kaspa/kaspa";

class Kiwi {

    public static network: NetworkType = NetworkType.Testnet;
    
    /**
     * Sets the network type for the Kiwi class.
     * 
     * @param {NetworkType} network - The network type to set (e.g., Mainnet, Testnet).
     */
    public static setNetwork(network: NetworkType) {
        Kiwi.network = network
    }
}
export { Kiwi };