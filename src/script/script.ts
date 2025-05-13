import { Wasm } from "../index";
import { Krc20Data } from '../types/interface';
import { KASPLEX } from '../utils/constants';

class Script {
    /**
     * Generates a KRC-20 script.
     * @param publicKey - The public key as a string.
     * @param data - The KRC-20 data to be included in the script.
     * @returns The generated ScriptBuilder instance.
     */
    public static krc20Script(publicKey: string, data: Krc20Data): Wasm.ScriptBuilder {
        return new Wasm.ScriptBuilder().addData(publicKey)
            .addOp(Wasm.Opcodes.OpCheckSig)
            .addOp(Wasm.Opcodes.OpFalse)
            .addOp(Wasm.Opcodes.OpIf)
            .addData(Buffer.from(KASPLEX))
            .addI64(0n)
            .addData(Buffer.from(JSON.stringify(data, null, 0)))
            .addOp(Wasm.Opcodes.OpEndIf);
    }

    /**
     * Generates a script with a lock time.
     * @param publicKey - The public key as a string.
     * @param data - The KRC-20 data to be included in the script.
     * @param lockTime - The lock time in seconds.
     * @returns The generated ScriptBuilder instance.
     * @throws If the lock time is in the past.
     */
    public static lockTimeScript(publicKey: string, data: Krc20Data, lockTime: bigint): Wasm.ScriptBuilder {
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
        if (lockTime <= currentTime) {
            throw new Error(`Lock time is in the past: ${lockTime}`);
        }
        return new Wasm.ScriptBuilder()
            .addData(publicKey)
            .addOp(Wasm.Opcodes.OpCheckSig)
            .addLockTime(lockTime)
            .addOp(Wasm.Opcodes.OpCheckLockTimeVerify)
            .addOp(Wasm.Opcodes.OpFalse)
            .addOp(Wasm.Opcodes.OpIf)
            .addData(Buffer.from(KASPLEX))
            .addI64(0n)
            .addData(Buffer.from(JSON.stringify(data, null, 0)))
            .addOp(Wasm.Opcodes.OpEndIf);
    }

    /**
     * Generates a multi-signature transaction script.
     * @param publicKeys - An array of public keys.
     * @param require - The number of required signatures.
     * @param ecdsa - Whether to use ECDSA (optional).
     * @returns The generated ScriptBuilder instance.
     */
    public static multiSignTx(publicKeys: string[], require: number, ecdsa?: boolean): Wasm.ScriptBuilder {
        const script = new Wasm.ScriptBuilder().addOp(Wasm.Opcodes.OpReserved + require);
        publicKeys.forEach(pk => {
            script.addData(ecdsa ? pk : new Wasm.PublicKey(pk).toXOnlyPublicKey().toString());
        });
        return script.addOp(Wasm.Opcodes.OpReserved + publicKeys.length)
            .addOp(ecdsa ? Wasm.Opcodes.OpCheckMultiSigECDSA : Wasm.Opcodes.OpCheckMultiSig);
    }

    /**
     * Generates a multi-signature transaction script with KRC-20 data.
     * @param publicKeys - An array of public keys.
     * @param data - The KRC-20 data to be included in the script.
     * @param require - The number of required signatures.
     * @param ecdsa - Whether to use ECDSA (optional).
     * @returns The generated ScriptBuilder instance.
     */
    public static multiSignTxKrc20Script(publicKeys: string[], data: Krc20Data, require: number, ecdsa?: boolean): Wasm.ScriptBuilder {
        const script = new Wasm.ScriptBuilder().addOp(Wasm.Opcodes.OpReserved + require);
        publicKeys.forEach(pk => {
            script.addData(ecdsa ? pk : new Wasm.PublicKey(pk).toXOnlyPublicKey().toString());
        });
        return script.addOp(Wasm.Opcodes.OpReserved + publicKeys.length)
            .addOp(Wasm.Opcodes.OpCheckMultiSig)
            .addOp(Wasm.Opcodes.OpFalse)
            .addOp(Wasm.Opcodes.OpIf)
            .addData(Buffer.from(KASPLEX))
            .addI64(0n)
            .addData(Buffer.from(JSON.stringify(data, null, 0)))
            .addOp(Wasm.Opcodes.OpEndIf);
    }

    /**
     * Creates a multi-signature address.
     * @param publicKeys - An array of public keys.
     * @param require - The number of required signatures.
     * @param networkType - The network type.
     * @param ecdsa - Whether to use ECDSA (optional).
     * @returns The multi-signature address.
     */
    public static multiSignAddress(require: number, publicKeys: string[], networkType: Wasm.NetworkType, ecdsa?: boolean) {
        return Wasm.createMultisigAddress(require, publicKeys.map(pk => new Wasm.PublicKey(pk)), networkType, ecdsa);
    }

    /**
     * Generates a redeem multi-signature address.
     * @param publicKeys - An array of public keys.
     * @param require - The number of required signatures.
     * @param networkType - The networkType type.
     * @param ecdsa - Whether to use ECDSA (optional).
     * @returns The generated address.
     */
    public static redeemScript(require: number, publicKeys: string[], ecdsa?: boolean) {
        const script = new Wasm.ScriptBuilder().addOp(Wasm.Opcodes.OpReserved + require);
        publicKeys.forEach(pk => {
            script.addData(ecdsa ? pk : new Wasm.PublicKey(pk).toXOnlyPublicKey().toString());
        });
        script.addOp(Wasm.Opcodes.OpReserved + publicKeys.length).addOp(ecdsa ? Wasm.Opcodes.OpCheckMultiSigECDSA : Wasm.Opcodes.OpCheckMultiSig)
        return new Wasm.ScriptBuilder().addData(script.toString());
    }

    /**
     * Redeems a multi-signature address by constructing the appropriate script.
     * 
     * @param require - The number of required signatures to unlock the funds.
     * @param publicKeys - An array of public keys involved in the multi-signature address.
     * @param networkType - The network type (e.g., mainnet, testnet) for address generation.
     * @param ecdsa - Optional flag to indicate whether to use ECDSA signatures (default is Schnorr signatures).
     * @returns A `ScriptBuilder` instance containing the constructed multi-signature script.
     */
    public static redeemMultiSignAddress(require: number, publicKeys: string[], ecdsa?: boolean) {
        const script = new Wasm.ScriptBuilder().addOp(Wasm.Opcodes.OpReserved + require);
        publicKeys.forEach(pk => {
            script.addData(ecdsa ? pk : new Wasm.PublicKey(pk).toXOnlyPublicKey().toString());
        });
        script.addOp(Wasm.Opcodes.OpReserved + publicKeys.length)
            .addOp(ecdsa ? Wasm.Opcodes.OpCheckMultiSigECDSA : Wasm.Opcodes.OpCheckMultiSig)
        return new Wasm.ScriptBuilder().addData(script.toString())
    }
}

export { Script };