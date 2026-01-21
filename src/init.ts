let initialized = false

/**
 * wasm-bindgen compatible init input
 */
export type WasmInitInput =
    | string
    | URL
    | RequestInfo
    | Response
    | BufferSource
    | {
        module_or_path:
        | string
        | URL
        | RequestInfo
        | Response
        | BufferSource
    }

type WasmInitFn = (input?: any) => Promise<void>

function resolveInit(mod: any): WasmInitFn {
    if (typeof mod.default === 'function') return mod.default
    if (typeof mod.__wbg_init === 'function') return mod.__wbg_init
    if (typeof mod.init === 'function') return mod.init

    throw new Error('[kiwi] wasm init function not found')
}

export async function initialize(input?: WasmInitInput) {
    if (initialized) return

    const mod = await import('./wasm/kaspa.js')

    // Node / Bun
    if (typeof window === 'undefined') {
        initialized = true
        return
    }

    // Browser
    const init = resolveInit(mod)

    if (input) {
        await init( typeof input === 'object' && 'module_or_path' in input ? input : { module_or_path: input })
    } else {
        await init({module_or_path: new URL('./kaspa_bg.wasm', import.meta.url), })
    }

    initialized = true
}
