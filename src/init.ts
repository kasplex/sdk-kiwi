import __wbg_init from './wasm/kaspa'

async function initialize(wasmUrl?: string) {
    if (typeof __wbg_init === 'function') {
        try {
            // @ts-ignore
            await __wbg_init(wasmUrl || "")
        } catch (err) {
            console.error("WASM init fail:", err)
        }
    }
}

export { initialize }
