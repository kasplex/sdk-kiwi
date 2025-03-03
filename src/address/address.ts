// import { Rpc } from "../rpc/client"
// import { Address as AddressUtil } from "../utils/address"
// import { KasplexApi } from "../api/kasplexApi";
// import {
//     IGetBalanceByAddressRequest, IGetBalanceByAddressResponse,
//     IGetUtxosByAddressesRequest, IGetUtxosByAddressesResponse
// } from "../../wasm/kaspa";
//
// /**
//  * The Account class represents a blockchain account, containing information such as private key and address.
//  * It provides functionalities to get account balance, transactions, UTXOs, etc.
//  */
// class Address {
//     /**
//      * Blockchain address associated with the private key.
//      * @private The address is derived from the private key and should be kept private if necessary.
//      */
//     private address: string;
//
//     /**
//      * Constructor initializes an Account instance with a given private key.
//      * It also derives the corresponding blockchain address.
//      * @param privateKey The private key of the account.
//      */
//     public constructor(address: string) {
//         this.address = address;
//     }
//
//     /**
//      * Retrieves the balance of the account.
//      * This method would typically involve querying a blockchain node or API.
//      */
//     public async getBalance(): Promise<IGetBalanceByAddressResponse> {
//         const balanceRequest: IGetBalanceByAddressRequest = {
//             address: this.address,
//         };
//         return Rpc.getInstance().client.getBalanceByAddress(balanceRequest);
//     }
//
//     /**
//      * Retrieves a specific tick (transaction or event) by its identifier.
//      * @param tick The identifier of the tick to retrieve.
//      */
//     public getTick(tick: string) {
//         return KasplexApi.getToken(tick);
//     }
//
//     /**
//      * Retrieves a list of ticks (transactions or events) associated with the account.
//      * This could return all ticks or a subset based on certain criteria.
//      */
//     public getTickList() {
//         return KasplexApi.getTokenList();
//     }
//
//     public getAddressTokenList(address: string) {
//         return KasplexApi.getAddressTokenList(address);
//     }
//
//     public getKrc20Balance(address: string, tick: string) {
//         return KasplexApi.getBalance(address, tick);
//     }
//
//     /**
//      * Retrieves the unspent transaction outputs (UTXOs) associated with the account.
//      * This method would typically involve querying a blockchain node or API.
//      */
//     public async getUtxos() : Promise<IGetUtxosByAddressesResponse>  {
//         const utxoRequest: IGetUtxosByAddressesRequest = {
//             addresses: [this.address],
//         };
//         return Rpc.getInstance().client.getUtxosByAddresses(utxoRequest);
//     }
//
//     /**
//      * Returns the blockchain address associated with the account.
//      * @returns The blockchain address.
//      */
//     public getAddress(): string {
//         return this.address;
//     }
//
//     /**
//      * Subscribes to UTXO change events for a given address and invokes a callback function when changes occur.
//      * This method runs indefinitely, checking for updates every 500 milliseconds.
//      */
//     public async subscribeUtxoChange() {
//         await Rpc.getInstance().client.subscribeUtxosChanged([this.address]);
//         while (true) {
//             Rpc.getInstance().client.addEventListener('utxos-changed', async (event: any) => {
//                 console.log("utxos-changed event", event)
//                 return;
//             });
//             await new Promise(resolve => setTimeout(resolve, 500));
//         }
//     }
//
//     public static validate(address: string) : boolean {
//         return AddressUtil.validate(address)
//     }
// }
//
// export default Address;