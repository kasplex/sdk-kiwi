import { Mnemonic } from "./address/mnemonic";
import { Wallet } from "./address/wallet";
import { Rpc } from "./rpc/client";
import { KasplexApi } from "./api/kasplexApi";
import { KaspaApi } from "./api/kaspaApi";
import { Kaspa } from "./kaspa";
import { Script } from "./script/script";
import { Transaction } from "./tx/transaction";
import { KRC20 } from "./krc20";
import { NetworkType, PrivateKey } from "@/wasm/kaspa";
import * as KiwiInterface from './types/interface';
import * as KiwiEnum from "./utils/enum";
import * as Utils from "./utils/utils";
class Kiwi {
    static Kaspa: typeof Kaspa = Kaspa;
    static KasplexApi: typeof KasplexApi = KasplexApi;
    static KaspaApi: typeof KaspaApi = KaspaApi;
    static Transaction: typeof Transaction = Transaction;
    static KRC20: typeof KRC20 = KRC20;
    static Script: typeof Script = Script;
    static Mnemonic: typeof Mnemonic = Mnemonic;
    static Wallet: typeof Wallet = Wallet;
    static PrivateKey: typeof PrivateKey = PrivateKey;
    static Utils: typeof Utils = Utils;
    static KiwiInterface: typeof KiwiInterface = KiwiInterface;
    static KiwiEnum: typeof KiwiEnum = KiwiEnum;
    static NetworkType: typeof NetworkType = NetworkType;
    static network: NetworkType = NetworkType.Testnet;
    static networkStr: string;
    static rpcClient: Rpc;

    private static initialized: boolean = false;

    static async init(network: NetworkType, url: string = '') {
        if (this.initialized && this.network === network) {
            console.warn("Kiwi has already been initialized with the same network.");
            return;
        }
        this.setNetwork(network);
        if (this.rpcClient) {
            this.rpcClient.disconnect();
        }
        this.rpcClient = await Rpc.setInstance(network, url);
        await this.rpcClient.connect();

        this.initialized = true;
    }

    public static async setNetwork(network: NetworkType, url: string = '') {
        if (this.network === network) {
            return;
        }
        this.network = network;
        this.networkStr = Utils.networkToString(network);

        if (this.initialized) {
            if (this.rpcClient) {
                this.rpcClient.disconnect();
            }
            this.rpcClient = await Rpc.setInstance(network, url);
            await this.rpcClient.connect();
        }
    }

}

export { Kiwi };