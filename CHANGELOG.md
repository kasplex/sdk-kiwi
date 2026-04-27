# 📦 Kasplex Kiwi SDK - Release History

This document records the release history of the `@kasplex/kiwi` SDK series, including both **Node** and **Web** versions.

---

## 🧭 Version Index

| Release Date | Node Version | Web Version | Main Updates |
|--------------|--------------|-------------|--------------|
| 2025-11-04 | v1.0.23 | v1.0.16 | Initial stable release, wasm v1.0.x |
| 2026-01-21 | v1.0.26 | v1.0.17 | WASM upgrade, Web init breaking change |
| 2026-01-28 | v1.0.28 | v1.0.20 | Upgrade wasm to v1.1.0 (Node & Web) |
| 2026-04-27 | v1.0.29 | v1.0.21 | Added KRC20 direct payload methods |

---

## 🧩 Detailed Changelog

## 🖥 Node Version (`@kasplex/kiwi`)

### v1.0.23 (2025-11-04)
- Initial stable Node release.
- Integrated `kaspa-wasm` version `1.0.1`.

---

### v1.0.26 (2026-01-21)
- Updated `kaspa-wasm` dependency to version `1.0.26`.
- Internal refactor for improved RPC stability.
- No breaking API changes.

---

### v1.0.28 (2026-01-28)
- Updated `kaspa-wasm` dependency to version `1.1.0`.
- Unified WASM version with Web SDK.
- Improved transaction signing and script compatibility.
- No API changes required for existing Node users.

---

### v1.0.29 (2026-04-27)
- Added new KRC20 direct payload methods:
  - `KRC20.mintByPayload(...)`
  - `KRC20.transferByPayload(...)`
  - `KRC20.deployByPayload(...)`
- These methods create a normal Kaspa transaction with KRC20 JSON data written directly into the transaction payload.
- Existing KRC20 methods remain unchanged:
  - `KRC20.mint(...)`
  - `KRC20.transfer(...)`
  - `KRC20.deploy(...)`
- The existing methods continue to use the P2SH commit-reveal flow.
- The new `ByPayload` methods are added as an optional direct-payload flow and do not affect existing integrations.
- If no custom payload is provided, the SDK uses the KRC20 data object itself as the transaction payload by default.

---

## 🌐 Web Version (`@kasplex/kiwi-web`)

### v1.0.16 (2025-11-04)
- Initial Web SDK release.
- Integrated `kaspa-wasm` version `1.0.16`.
- Fixed slow local wallet detection issue.

---

### v1.0.17 (2026-01-21)
- Updated `kaspa-wasm` dependency to version `1.0.17`.
- **Breaking Change: WASM initialization updated**
  - Migrated to a modern `wasm-bindgen` compatible initialization flow.
  - The `initialize` function no longer accepts only a plain string.
  - Supported input types:
    - URL string
    - Request
    - Response
    - WebAssembly.Module
  - Improved compatibility with modern bundlers (Vite / Webpack / Next.js).

---

### v1.0.20 (2026-01-28)
- Updated `kaspa-wasm` dependency to version `1.1.0`.
- Unified WASM version with Node SDK (`v1.1.0`).
- Requires `kaspa_bg.wasm` built from wasm version `1.1.0`.
- Older `0.x` and early `1.0.x` wasm builds are not supported.
- Recommended initialization:
  ```ts
  import { initialize } from '@kasplex/kiwi-web'

  await initialize('/wasm/kaspa_bg.wasm')
  ```
---

### v1.0.21 (2026-04-27)
- Added new KRC20 direct payload methods:
  - `KRC20.mintByPayload(...)`
  - `KRC20.transferByPayload(...)`
  - `KRC20.deployByPayload(...)`
- These methods create a normal Kaspa transaction with KRC20 JSON data written directly into the transaction payload.
- Existing KRC20 methods remain unchanged:
  - `KRC20.mint(...)`
  - `KRC20.transfer(...)`
  - `KRC20.deploy(...)`
- The existing methods continue to use the P2SH commit-reveal flow.
- The new `ByPayload` methods are added as an optional direct-payload flow and do not affect existing integrations.
- If no custom payload is provided, the SDK uses the KRC20 data object itself as the transaction payload by default.
- No WASM initialization changes are required for this update.


## 🚀 Release Automation

- Build commands:
  ```bash
  bash build-node.sh  #  Build node version
  bash build-web.sh   #  Build web version
  ```
