// import * as kaspa from "../wasm/kaspa/kaspa";
// import kaspaModule from '../wasm/kaspa/kaspa_bg.wasm';
// async function loadKaspaWasm() {
//     await kaspa.default({ kaspaModule: kaspaModule });
// }
// export { loadKaspaWasm }

import init from '../wasm/kaspa-web/kaspa';

async function initialize() {
    const wasm = await fetch('../wasm/kaspa-web/kaspa_bg.wasm');
    await init(wasm);
}
export { initialize }