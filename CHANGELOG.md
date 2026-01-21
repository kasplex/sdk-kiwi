# 📦 Kasplex Kiwi SDK - Release History

This document records the release history of the `@kasplex/kiwi` SDK series, including both **Node** and **Web** versions.

---

## 🧭 Version Index

| Release Date | Node Version | Web Version | Main Updates |
|---------------|--------------|--------------|---------------|
| 2025-11-04 | v1.0.23 | v1.0.16 | Updated wasm module to version 1.0.1 |

---

## 🧩 Detailed Changelog

### Node Version

#### v1.0.23 (2025-11-04)
- Updated wasm module to version `1.0.1`.

---

#### v1.0.26 (2026-01-21)
- Updated wasm module to version `1.0.26`.

---

### Web Version

#### v1.0.16 (2025-11-04)
- Updated wasm module to version `1.0.16`.
- Fixed slow local wallet detection issue.

#### v1.0.17 (2026-01-21)
- Updated WASM module to version `1.0.17`.
- **Breaking Change: Updated WASM initialization method**
  - The Web SDK now uses a modern, wasm-bindgen–compatible initialization API.
  - The `initialize` function no longer accepts only a plain string.
  - Multiple WASM input types are now supported to improve compatibility with modern bundlers and browsers.

---


## 🚀 Release Automation

- Build commands:
  ```bash
  bash build-node.sh  #  Build node version
  bash build-web.sh   #  Build web version
  ```
