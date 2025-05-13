import { Wasm } from "../index";

class Mnemonic {
    /**
     * Generates a random mnemonic phrase of the specified length.
     * @param {number} length - The length of the mnemonic phrase (must be 12 or 24).
     * @returns {string} - The generated mnemonic phrase.
     * @throws {Error} - Throws an error if the length is not 12 or 24.
     */
    public static random(length: number): string {
        if (length !== 12 && length !== 24) {
            throw new Error("Invalid length for mnemonic");
        }
        let mnemonic =Wasm.Mnemonic.random(length);
        return mnemonic.phrase;
    }

    /**
     * Validates whether the given mnemonic phrase is valid.
     * @param {string} mnemonic - The mnemonic phrase to validate.
     * @returns {boolean} - Returns true if the mnemonic is valid, otherwise false.
     */
    public static validate(mnemonic: string): boolean {
        return Wasm.Mnemonic.validate(mnemonic);
    }

    /**
     * Converts a mnemonic phrase into a seed.
     * @param {string} mnemonic - The mnemonic phrase.
     * @param {string} [password=""] - An optional password used for seed generation.
     * @returns {string} - The generated seed from the mnemonic.
     */
    public static toSeed(mnemonic: string, password: string = ""): string {
        return new Wasm.Mnemonic(mnemonic).toSeed(password);
    }
}

export { Mnemonic };
