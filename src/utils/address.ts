import {AddressVersion, AddressPrefix} from './enum';
import { NetworkType } from "wasm/kaspa";
import {networkToAddressPrefix, addressPrefixToNetwork, stringToAddressPrefix} from './utils';

export class Address {
    /**
     * Convert the address to a string.
     * @returns {string} The address string.
     */
    public static toAddress(network: NetworkType, version: AddressVersion, payload: Uint8Array): string {
        let prefix = networkToAddressPrefix(network)
        return `${prefix}:${Address.encodePayload(prefix, version, payload)}`;
    }

    /**
     * Convert the address to a string.
     * @returns {string} The address string.
     */
    public static validate(address: string): boolean {
        try {
            const parts = address.split(':');
            if (parts.length !== 2) {
                throw new Error('Invalid address format');
            }
            let prefix = stringToAddressPrefix(parts[0]);
            if (prefix == undefined) {
                throw new Error('Invalid address format');
            }
            return this.decodePayload(prefix, parts[1]);
        } catch (e) {
            return false;
        }
    }

    /**
     * Encode the payload to a string.
     * @returns {string} The encoded payload string.
     */
    private static encodePayload(prefix: AddressPrefix, version: AddressVersion, payload: Uint8Array): string {
        const fiveBitPayload = Address.conv8to5(new Uint8Array([version, ...payload]));
        const fiveBitPrefix = Array.from(prefix).map((c) => c.charCodeAt(0) & 0x1f);
        const checksum = Address.checksum(fiveBitPayload, fiveBitPrefix);
        const checksumBytes = new Uint8Array(new BigUint64Array([checksum]).buffer).reverse();
        const combined = new Uint8Array([...fiveBitPayload, ...Address.conv8to5(new Uint8Array(checksumBytes.slice(3)))]);
        const bytes = Array.from(combined).map((c) => Charset[c]);
        return String.fromCharCode(...bytes);
    }

    private static decodePayload(prefix: AddressPrefix, address: string): boolean {
        const addressU5 = Array.from(address).map((c) => {
            const index = c.charCodeAt(0);
            if (index >= RevCharset.length) {
                throw new Error(`Character code ${index} is out of bounds`);
            }
            return RevCharset[index];
        });
        if (address.length < 8) {
            throw new Error('Bad payload');
        }

        const payloadU5 = new Uint8Array(addressU5.slice(0, address.length - 8));
        const checksumU5 = new Uint8Array(addressU5.slice(address.length - 8));
        const fiveBitPrefix = Array.from(prefix).map((c) => c.charCodeAt(0) & 0x1f);
        const checksumBytes = new Uint8Array([0, 0, 0, ...this.conv5to8(new Uint8Array(checksumU5))]);
        const checksum = new DataView(checksumBytes.buffer).getBigUint64(0, false);

        if (this.checksum(payloadU5, fiveBitPrefix) !== checksum) {
            throw new Error('Bad checksum');
        }

        const payloadU8 = this.conv5to8(payloadU5);
        let network = addressPrefixToNetwork(prefix)
        Address.toAddress(network, payloadU8[0] as AddressVersion, payloadU8.slice(1));
        return true
    }

    private static polymod(values: Uint8Array): bigint {
        let c = 1n;
        for (const d of values) {
            const c0 = c >> 35n;
            c = ((c & 0x07ffffffffn) << 5n) ^ BigInt(d);
            if ((c0 & 0x01n) !== 0n) c ^= 0x98f2bc8e61n;
            if ((c0 & 0x02n) !== 0n) c ^= 0x79b76d99e2n;
            if ((c0 & 0x04n) !== 0n) c ^= 0xf33e5fb3c4n;
            if ((c0 & 0x08n) !== 0n) c ^= 0xae2eabe2a8n;
            if ((c0 & 0x10n) !== 0n) c ^= 0x1e4f43e470n;
        }

        return c ^ 1n;
    }

    private static checksum(payload: Uint8Array, prefix: number[]): bigint {
        return this.polymod(new Uint8Array([...prefix, 0, ...payload, ...new Uint8Array(8)]));
    }

    private static conv8to5(payload: Uint8Array): Uint8Array {
        const fiveBit = [];
        let buff = 0,
            bits = 0;
        for (const c of payload) {
            buff = (buff << 8) | c;
            bits += 8;
            while (bits >= 5) {
                bits -= 5;
                fiveBit.push((buff >> bits) & 0x1f);
                buff &= (1 << bits) - 1;
            }
        }

        if (bits > 0) {
            fiveBit.push((buff << (5 - bits)) & 0x1f);
        }
        return new Uint8Array(fiveBit);
    }

    private static conv5to8(payload: Uint8Array): Uint8Array {
        const eightBit = [];
        let buff = 0,
            bits = 0;
        for (const c of payload) {
            buff = (buff << 5) | c;
            bits += 5;
            while (bits >= 8) {
                bits -= 8;
                eightBit.push((buff >> bits) & 0xff);
                buff &= (1 << bits) - 1;
            }
        }

        return new Uint8Array(eightBit);
    }
}

const Charset = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'.split('').map((c) => c.charCodeAt(0));

const RevCharset = [
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 15, 100, 10, 17, 21, 20, 26, 30, 7, 5, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 29, 100, 24, 13, 25, 9, 8, 23, 100, 18, 22, 31, 27, 19, 100, 1, 0, 3, 16, 11, 28, 12, 14, 6, 4, 2
];