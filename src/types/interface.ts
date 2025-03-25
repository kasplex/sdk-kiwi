
import { Encoding, Resolver } from "wasm/kaspa";
import { OP } from '../utils/enum'
export interface RpcOptions {
    encoding: Encoding;
    networkId: string;
    url?: string;
    resolver?: Resolver;
}
export interface Params {
    [key: string]: string | number | boolean | Array<string>;
}

export interface Krc20Data {
    p: 'krc-20',
    op: OP,
    tick: string,
    max?: string,
    lim?: string,
    amt?: string,
    to?: string,
    dec?: "8",
    pre?: string,
}

export interface addressList {
    address: string,
    amount: bigint
}