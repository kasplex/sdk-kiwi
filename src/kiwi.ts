import { NetworkType } from "@/wasm/kaspa";

class Kiwi {

    public static network: NetworkType = NetworkType.Testnet;

    public static setNetwork(network: NetworkType) {
        Kiwi.network = network
    }
}

export { Kiwi, NetworkType };