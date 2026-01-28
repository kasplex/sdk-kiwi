type WasmInitFn = (input: string | URL) => Promise<void>

let initialized = false

export async function initialize(wasmUrl?: string | URL) {
    if (initialized) return

    const mod = await import('./wasm/kaspa.js')

    // Node / Bun
    if (typeof window === 'undefined') {
        initialized = true
        return
    }
    
    // Browser
    if (!wasmUrl) {
        throw new Error('[kiwi] Browser environment requires wasmUrl')
    }
    const init = mod.default as unknown as WasmInitFn
    await init(wasmUrl)
    initialized = true
}