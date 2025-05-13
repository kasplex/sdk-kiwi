import { Wasm } from "./index";
import { networkToString } from './utils/utils';

class Kiwi {

    public static network: Wasm.NetworkType = Wasm.NetworkType.Testnet;
    private static isWasmLoaded: boolean = false;
    
    /**
     * Sets the network type for the Kiwi class.
     * 
     * @param {NetworkType} network - The network type to set (e.g., Mainnet, Testnet).
     */
    public static setNetwork(network: Wasm.NetworkType) {
        if(!Kiwi.isWasmLoaded) {
            Kiwi.isWasmLoaded = true
        }
        Kiwi.network = network
    }

    public static getNetworkID() {
        return networkToString(Kiwi.network)
    }
}
export { Kiwi };