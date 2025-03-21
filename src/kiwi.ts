import { NetworkId, NetworkType } from 'kasp-platform';
import { networkToString } from '../src/utils/utils';

class Kiwi {

    public static network: NetworkType = NetworkType.Testnet;
    private static isWasmLoaded: boolean = false;
    
    /**
     * Sets the network type for the Kiwi class.
     * 
     * @param {NetworkType} network - The network type to set (e.g., Mainnet, Testnet).
     */
    public static setNetwork(network: NetworkType) {
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