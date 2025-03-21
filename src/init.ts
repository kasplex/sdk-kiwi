import wasm from "../wasm/kaspa-web/kaspa_bg.wasm";
import __wbg_init from '../wasm/kaspa-web/kaspa'

async function initialize(wasmUrl: string) {
    await __wbg_init(wasmUrl || wasm);
}
export { initialize }