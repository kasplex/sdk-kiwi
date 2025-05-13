
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
}

export interface addressList {
    address: string,
    amount: bigint
}