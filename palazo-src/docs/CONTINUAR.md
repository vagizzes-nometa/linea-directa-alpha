# Palazo · cómo seguir (leer primero)

Guía para abrir una conversación nueva y trabajar en el shooter sin el historial anterior. Escrita el 15-nov-2026, al cierre de la conversación larga donde se construyó todo.

## Qué es
- **Palazo Real:** shooter realista en el navegador (three.js 0.160). Campaña (2 misiones), Operaciones de sigilo con escuadra (1), en línea hasta 6 (todos contra todos, equipos, zombis cooperativo, 5 arenas), y VR en el Quest.
- **Superslow:** 10 misiones estilo "el tiempo avanza cuando te movés", en pantalla o VR. Tiene motor propio (three r128) y vive en el mismo archivo.
- **Palazo de bloques:** el juego original, en su propio artefacto. No se toca; hay una copia en `original/`.

## Dónde está cada cosa
| Cosa | Lugar |
|---|---|
| Juego publicado (con sala en línea) | artefacto de Claude "Palazo Real": https://claude.ai/artifact/KU9LW8PsUH4uTHmZqZxnCt |
| App instalable (iPhone, Quest, offline) | https://vagizzes-nometa.github.io/linea-directa-alpha/palazo/ |
| Fuente | repo `vagizzes-nometa/linea-directa-alpha`, carpeta `palazo-src/` |
| App ya armada | mismo repo, carpeta `palazo/` (`index.html`, `sw.js`, manifiesto, íconos) |
| Palazo de bloques | https://claude.ai/artifact/3QiQZTDrd8DDsfrgAEP3iw · copia en `palazo-src/original/` |

## La fuente (`palazo-src/`)
- `src/` — Palazo Real en 30 archivos numerados. **Se pegan en orden y comparten un mismo ámbito**: no hay `import`; lo que define un archivo lo ven los siguientes. Los dos `.lib.js` son librerías (three y cargadores): no se editan.
- `pagina/pagina.html` — estilos y todas las pantallas (menús, HUD, botones táctiles). `pagina/recursos.js.txt` — soldado, armas y texturas embebidos (6 MB, no abrir entero).
- `superslow/` — código, estilos, pantalla y modelos de armas de Superslow.
- `armar.py` — arma `dist/index.html`. `publicar_app.py` — lo copia a `palazo/` con manifiesto y service worker.
- `pruebas/` — `humo.py` (entra a todos los modos), `vr_simulada.py` (VR con controles falsos), `sala_falsa.js` (sala en línea de mentira).
- `docs/` — esta guía, `AUDITORIA.md`, `TAREAS.md`, `GLOSARIO.md`, `ARQUITECTURA.md`.

El código se recuperó de un build (la fuente modular original se perdió): las propiedades tienen nombre real (`G.me.pos`, `E.camera`) pero las variables de nivel superior son cortas (`Y` = G, `Ye` = motor, `dt` = armas). **`GLOSARIO.md` es el mapa; consultarlo antes de leer código.**

## Ciclo de trabajo
```bash
cd palazo-src && npm i          # una vez: esbuild y three r128
python3 armar.py                # → dist/index.html (8,2 MB)
python3 pruebas/humo.py         # tiene que terminar en TODO OK
python3 pruebas/vr_simulada.py  # si se tocó 28-vr.js o 18-jugador.js
```
Publicar (siempre los tres, en este orden):
1. **Artefacto:** publicar `dist/index.html` en la URL del artefacto de Palazo Real. La capacidad `room` ya está declarada y se conserva sola; no pasar `capabilities`.
2. **App:** `python3 publicar_app.py <raíz del repo>`; después `git add palazo palazo-src`, commit y push a `main`. GitHub Pages tarda 1–2 minutos.
3. **Archivo offline** (si Vago lo pide): mandarle `dist/index.html` como `Palazo-Real-offline.html`.

## Reglas que ya costaron caro
- **Guardar la fuente en el repo en cada sesión.** El espacio de trabajo de Claude se borra; así se perdió la fuente modular.
- **No abrir archivos enteros de más de ~1.500 líneas.** Buscar con grep y leer el tramo. `00-three.lib.js` tiene 27.000 líneas.
- **El artefacto solo carga scripts embebidos.** Todo va dentro del HTML (por eso los recursos en base64).
- **La sala en línea solo existe abriendo el juego desde Claude.** En la app y el offline, `G.net.state` queda en `off` y todo tiene que funcionar igual en solitario.
- **Lo que llega por la sala es dato, nunca orden:** pasar todo número por `Je(v, defecto)` y acotar (daño ≤ 250, velocidades, índices).
- **VR:** la sesión se pide en el mismo clic que inicia el modo. Adentro del visor: calidad baja, sin posfiltros, y la cámara es hija de `G.vr.rig` (no moverla a mano).
- **Probar sin pantalla:** el render por software es lento. Pausar el motor (`G.E.paused = true`) y avanzar la lógica a mano, como hace `humo.py`.
- **Pruebas con dispositivo real** (iPhone, Quest, partida con amigos) solo las puede hacer Vago. Dejarlas listadas al final de cada entrega.

## Cómo trabaja Vago
- Español rioplatense. Quiere un asesor crítico: cuestionar supuestos, marcar lo que falta.
- Etiquetar afirmaciones: **seguro** / **probable** / **suposición**.
- Ideas grandes: proponer y esperar el "dale" antes de construir. Arreglos pedidos: hacerlos directamente.
- Respuestas cortas, sin jerga de programación. Juega en iPhone (app instalada), PC y Quest 3S.

## Para arrancar una tarea
Abrir una conversación nueva en este proyecto y escribir, por ejemplo: **"Hacé la tarea R1 de TAREAS.md"**. Cada tarea dice qué archivos tocar y cómo verificar. Al terminar: tachar la tarea en `TAREAS.md`, anotar lo aprendido en `ARQUITECTURA.md` si cambió algo estructural, y publicar.
