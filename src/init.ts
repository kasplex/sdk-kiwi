import init from "../wasm/kaspa/kaspa";
const kaspaModule = require('../wasm/kaspa/kaspa_bg.wasm');
async function loadKaspaWasm() {
    await init({ kaspaModule: kaspaModule });
}
export { loadKaspaWasm }