
import { Wasm } from "../index";
import { OP } from '../utils/enum'
export interface RpcOptions {
    encoding: Wasm.Encoding;
    networkId: string;
    url?: string;
    resolver?: Wasm.Resolver;
}
export interface Params {
    [key: string]: string | number | boolean | Array<string>;
}

export interface Krc20Data {
    p: 'krc-20',
    op: OP,
    tick?: string,
    mod?: string,
    name?: string,
    max?: string,
    lim?: string,
    amt?: string,
    to?: string,
    dec?: string,
    pre?: string,
    ca?: string,
    memo?: string,
}

export interface addressList {
    address: string,
    amount: bigint
}

export interface TransferList {
    toAddress: string,
    amount: bigint
}

export interface Krc20DataV2 extends Krc20Data { 
    payload: string
}

export type EncodablePayload =
    | string
    | Wasm.HexString
    | Uint8Array
    | Record<string, unknown>
    | Array<unknown>
    | number
    | boolean
    | null
    | undefined;