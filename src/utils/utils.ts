import { NetworkType, Opcodes } from 'kasp-platform';
import { MIN_PUSHDATA } from './constants'
import { Krc20Data } from '../types/interface'
import { OP } from "./enum";
import { AddressPrefix } from './enum';

/**
 * Converts a NetworkType to its corresponding network ID string.
 * @param networkType The network type to convert.
 * @returns The corresponding network ID string.
 */
function networkToString(networkType: NetworkType): string {
    switch (networkType) {
        case NetworkType.Mainnet:
            return "mainnet";
        case NetworkType.Testnet:
            return "testnet-10";
        case NetworkType.Devnet:
            return "devnet";
        default:
            throw new Error(`Unknown network type: ${networkType}`);
    }
}

/**
 * Converts a hexadecimal string to a Uint8Array.
 * @param {string} hexString - The hexadecimal string to convert.
 * @returns {Uint8Array} - The resulting Uint8Array representation of the hexadecimal string.
 * @throws {Error} - Throws an error if the hex string is invalid, has an odd length, or contains invalid characters.
 */
function hexStringToUint8Array(hexString: string): Uint8Array {
    const hex = hexString.replace(/^0x/i, '');
    if (hex.length % 2 !== 0) {
        throw new Error("Hex string must have an even number of characters");
    }
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
        throw new Error("Hex string contains invalid characters");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}

/**
 * Determines the appropriate opcode for pushing data based on its size.
 * @param {number} size - The size of the data to be pushed.
 * @returns {string | void} - The corresponding opcode as a string, or calls `reportError` for invalid size.
 * @throws {Error} - If the provided size is invalid based on the defined size limits.
 */
function getPushData(size: number) {
    if (size <= 0) {
        return reportError("size must be positive");
    }
    if (size < MIN_PUSHDATA.MIN_PUSHDATA1) {
        return reportError("size invalid");
    }
    if (size >= MIN_PUSHDATA.MIN_PUSHDATA4) {
        return Opcodes.OpPushData4;
    }
    if (size > MIN_PUSHDATA.MIN_PUSHDATA2 && size <= MIN_PUSHDATA.MAX_PUSHDATA2) {
        return Opcodes.OpPushData2;
    }
    if (size >= 76 && size <= MIN_PUSHDATA.MAX_PUSHDATA1) {
        return Opcodes.OpPushData1;
    }
}

function createKrc20Data(data: Krc20Data) {
    const krc20Data = {
        p: 'krc-20',
    }
    return { ...krc20Data, ...data }
}

function getScriptLockTime(oneHourInSeconds: number = 0) {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    return BigInt((currentUnixTime - oneHourInSeconds) * 1000);
}

function getSizeByPrivateKeys(multiplier: number, addend: number, ecdsa?: boolean) {
    return multiplier * (ecdsa ? 34 : 33) + addend
}

function getFeeByOp(op: OP): bigint {
    switch (op) {
        case OP.Deploy:
            return 100000000000n;
        case OP.Mint:
            return 100000000n;
        case OP.Transfer:
            return 0n;
        case OP.Send:
            return 0n;
        case OP.List:
            return 0n;
        default:
            return 0n;
    }
}

function addressPrefixToNetwork(network: AddressPrefix): NetworkType {
    switch (network) {
        case AddressPrefix.Mainnet:
            return NetworkType.Mainnet;
        case AddressPrefix.Testnet:
            return NetworkType.Testnet;
        default:
            throw new Error(`Unknown network: ${network}`);
    }
}

/**
 * Converts a string to an AddressPrefix enum value.
 * @param {string} prefix - The string representation of the address prefix.
 * @returns {AddressPrefix | undefined} The corresponding enum value, or undefined if not found.
 */
function stringToAddressPrefix(prefix: string): AddressPrefix | undefined {
    return (Object.values(AddressPrefix) as string[]).includes(prefix)
        ? (prefix as AddressPrefix)
        : undefined;
}

function networkToAddressPrefix(network: NetworkType): AddressPrefix {
    switch (network) {
        case NetworkType.Mainnet:
            return AddressPrefix.Mainnet;
        case NetworkType.Testnet:
            return AddressPrefix.Testnet;
        default:
            throw new Error(`Unknown network: ${network}`);
    }
}

export {
    networkToString,
    hexStringToUint8Array,
    getPushData,
    createKrc20Data,
    getScriptLockTime,
    getSizeByPrivateKeys,
    getFeeByOp,
    addressPrefixToNetwork,
    stringToAddressPrefix,
    networkToAddressPrefix
};