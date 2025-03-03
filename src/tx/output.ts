import { IPaymentOutput } from '../../wasm/kaspa'
class Output {
    public static createOutputs(address: string, amount: bigint): IPaymentOutput[] {
        return [{ address, amount }]
    }
}

export { Output }