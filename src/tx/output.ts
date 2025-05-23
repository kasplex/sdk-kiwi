import { Wasm } from "../index";

class Output {
    /**
     * Creates an array of payment outputs for a given address and amount.
     * 
     * @param address - The destination address for the payment.
     * @param amount - The amount to be sent to the address.
     * @returns An array of `IPaymentOutput` objects containing the address and amount.
     */
    public static createOutputs(address: string, amount: bigint): Wasm.IPaymentOutput[] {
        return [{ address, amount }]
    }

    /**
     * Creates a payment outputs for a given address and amount.
     *
     * @param address - The destination address for the payment.
     * @param amount - The amount to be sent to the address.
     * @returns A `IPaymentOutput` objects containing the address and amount.
     */
    public static new(address: string, amount: bigint): Wasm.IPaymentOutput {
        return { address, amount }
    }
}

export { Output }