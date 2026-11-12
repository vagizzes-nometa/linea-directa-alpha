# Palazo Real · fuente

Archivo único con Palazo Real (three 0.160) y Superslow con VR (three r128 propio).

- `game.js`: Palazo Real, legible (recuperado del build). Incluye el modo VR (`vrCreate`).
- `page_head.html`: estilos y pantallas; `assets.js.txt`: soldado, armas y texturas embebidos.
- `ss_*.js|txt|html`: Superslow tomado del Palazo original.
- Armar: `npm i esbuild@0.20 three@0.128.0` y `python3 build_u.py` → `dist/index.html`.
- App instalable: `python3 pwa_u.py <repo>` copia a `palazo/`.
