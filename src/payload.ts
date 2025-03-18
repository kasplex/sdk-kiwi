
class Payload {
    private data: Uint8Array;

    constructor(data: Uint8Array) {
        this.data = data;
    }

    public length(): number {
        return this.data.length;
    }

    toHex(): string {
        return Array.from(this.data)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    static fromHex(hexString: string): Payload {
        if (hexString.length % 2 !== 0) {
            throw new Error('Invalid hex string');
        }
        const data = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
            data[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return new Payload(data);
    }

    getData(): Uint8Array {
        return this.data;
    }
}


export { Payload}