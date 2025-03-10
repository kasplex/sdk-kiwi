import init from "../wasm/kaspa/kaspa";
import kaspaModule from '../wasm/kaspa/kaspa_bg.wasm';
async function loadKaspaWasm() {
    await init({ kaspaModule: kaspaModule });
}
export { loadKaspaWasm }