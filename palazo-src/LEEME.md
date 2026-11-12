# Palazo Real · fuente

Archivo único con Palazo Real (three 0.160) y Superslow con VR (three r128 propio).

- `game.orig.js`: Palazo Real legible (recuperado del build). `vr_module.js`: modo VR. `patch_all.py` aplica VR y Superslow → `game.js`.
- `page_head.html`: estilos y pantallas; `assets.js.txt`: soldado, armas y texturas embebidos.
- `ss_*.js|txt|html`: Superslow tomado del Palazo original.
- Armar: `python3 patch_all.py`, después `npm i esbuild@0.20 three@0.128.0` y `python3 build_u.py` → `dist/index.html`.
- App instalable: `python3 pwa_u.py <repo>` copia a `palazo/`.
