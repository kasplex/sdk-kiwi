import { NetworkType } from "@/wasm/kaspa";

class Base {

    public static network: NetworkType = NetworkType.Testnet;

    constructor() {}

    public static setNetwork(network: NetworkType) {
        Base.network = network
    }
}

export { Base, NetworkType };