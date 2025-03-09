import { Encoding, Resolver, RpcClient, NetworkType } from "../../wasm/kaspa/kaspa";
import { networkToString } from "../utils/utils";

class Rpc {
    private static instance: Rpc;
    public client: RpcClient;

    /**
     * Private constructor to initialize the RpcClient with the given network and URL.
     *
     * @param network - The network type (default: Mainnet).
     * @param url - The optional RPC server URL.
     */
    private constructor(network: NetworkType = NetworkType.Mainnet, url: string = "") {
        this.client = new RpcClient(Rpc.getConfig(network, url));
    }

    /**
     * Sets and returns a singleton instance of the Rpc class.
     *
     * @param network - The network type (default: Mainnet).
     * @param url - The optional RPC server URL.
     * @returns The singleton instance of Rpc.
     */
    public static setInstance(network: NetworkType = NetworkType.Mainnet, url: string = ""): Rpc {
        if (Rpc.instance) {
            console.log("Rpc instance already exists. Returning existing instance.");
            return Rpc.instance;
        }
        Rpc.instance = new Rpc(network, url);
        return Rpc.instance;
    }

    /**
     * Returns the existing singleton instance of the Rpc class.
     *
     * @returns The singleton instance of Rpc.
     */
    public static getInstance(): Rpc {
        if (!Rpc.instance) {
            throw new Error("Rpc instance is not set. Call setInstance() first.");
        }
        return Rpc.instance;
    }

    /**
     * Establishes a connection to the RPC server.
     */
    public async connect(): Promise<void> {
        if(this.client.isConnected) {
            console.log("Already connected to the RPC server.");
            return;
        }
        await this.client.connect();
    }

    /**
     * Disconnects from the RPC server.
     */
    public async disconnect(): Promise<void> {
        if (this.client.isConnected) {
            console.log("Already disconnected from the RPC server.");
            return;
        }
        await this.client.disconnect();
    }

    /**
     * Generates the RPC client configuration based on the provided network and URL.
     *
     * @param network - The network type.
     * @param url - The optional RPC server URL.
     * @returns The configuration object for the RpcClient.
     */
    private static getConfig(network: NetworkType, url: string) {
        const commonConfig = {
            encoding: Encoding.Borsh,
            networkId: networkToString(network)
        };
        return url ? { ...commonConfig, url } : { ...commonConfig, resolver: new Resolver() };
    }
}

export { Rpc };