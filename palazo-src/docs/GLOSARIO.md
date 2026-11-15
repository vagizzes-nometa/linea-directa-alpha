# Glosario de nombres abreviados

El código de `src/` se recuperó de un build: las propiedades conservan su nombre (`G.me`, `u.pos`, `E.camera`), pero las variables y funciones de nivel superior quedaron con nombres cortos. Esta tabla es el mapa. Al tocar una función, conviene renombrar sus variables locales a algo legible; los nombres de nivel superior se pueden renombrar de a uno con buscar y reemplazar de palabra completa (verificar con `pruebas/humo.py`).

## Estado y servicios (nivel superior)
| Nombre | Qué es | Dónde se crea |
|---|---|---|
| `Y` | **G**, el estado global del juego (`window.__G`): `me`, `units`, `mode`, `map`, `settings`, `mp`, `vr`, `net`… | 27-arranque |
| `Ye` | **E**, el motor: `renderer`, `scene`, `camera`, `q` (calidad), `systems`, `setQuality()` | 27-arranque (`Rg`) |
| `On` | **P**, la física: `move`, `ray`, `ground`, `los`, `blocked`, `bounds` | 29-principal (`Fg`) |
| `Bc` | **AU**, audio | 27-arranque (`Hg`) |
| `ei` | entrada de teclado/mouse/táctil | 29-principal (`kg`) |
| `jt` | menús (`show`, `loading`, `team`…) | 29-principal (`l0`) |
| `h0` | ambiente (cielo, sol, niebla) | 29-principal (`Vg`) |
| `lo` | guardado en `localStorage` con prefijo `pzreal.` (`get`, `set`) | 27-arranque |
| `yt`, `Pe`, `Ot`, `io` | `document.querySelector` | varios |
| `pa` | recursos cargados (`pa.soldier`, `pa.weapons`) | 03-recursos |
| `Jt` | espacio de nombres de three (`Jt.Group`, `Jt.Vector3`…); lo usa `28-vr.js` como `T3` | 00-three |

## Fábricas (cada una arma un sistema)
| Nombre | Sistema | Archivo |
|---|---|---|
| `Rg` | motor | 01-motor |
| `Fg` | física | 04-fisica |
| `kg` | entrada | 05-entrada |
| `Hg` | audio | 06-audio |
| `Vg` | ambiente | 07-ambiente |
| `mf` / `gf` | terreno / kit de piezas (`K`) | 08-terreno-kit |
| `Wg` / `xf` | pasto / efectos (`FX`) | 09-pasto-fx |
| `Xg` | combate (`G.combat`: `fire`, `damage`, `melee`, `throwNade`, `explode`) | 10-armas |
| `qg` | sigilo | 11-sigilo |
| `Zg` | escuadra | 12-escuadra |
| `Kg` | modo operación | 13-operacion |
| `gs` | personaje (soldado o zombi) | 15-personaje |
| `$g` | objetos para recoger (`G.pickups`) | 16-recoleccion |
| `Qg` | IA (`G.AI`: `passable`, `flow`, `flowTo`, `flowDir`, `randomCellNear`) | 17-ia |
| `e0` | jugador (`G.me`) | 18-jugador |
| `t0` | HUD (`G.hud`) | 19-hud |
| `n0` | modo campaña | 20-campana |
| `r0` | zombis | 22-zombis |
| `a0` | partida en línea (`G.mode` con `kind:"dm"`) | 23-enlinea |
| `l0` | menús | 24-menus |
| `c0` | red (`G.net`) | 25-red |
| `vrCreate` | VR (`G.vr`) | 28-vr |

## Datos
| Nombre | Qué es |
|---|---|
| `dt` | **WEAPONS**: tabla de armas (`dt.rifle.rate`, `.mag`, `.recoil`, `.slot` 0 larga · 1 pistola · 2 melé · 3 granada) |
| `fi` | arma el equipo inicial (`makeLoadout(prim, sec, granadas, melé)`) |
| `$n` / `vf` | modelo que usa un arma / radio de ruido de un arma |
| `ro` / `oo` / `bb` | geometría de un arma / malla de un arma / puntos de agarre |
| `Pc` | niveles de calidad (`low`, `medium`, `high`) |
| `ao` / `ps` | mapas **El Pueblo** / **La Base** · `Bi` = `[ao, ps]` |
| `er` | arenas en línea (5 recortes de los mapas) |
| `Sf`, `$s`, `Yg`, `Bg` | dificultad de los bots, dificultad de campaña, puestos de formación de la escuadra y teclas |
| `va`, `Pb` | duración de partida en línea (600 s) y espera de reaparición (4 s) |
| `Je`, `pi` | `num(v, defecto)`: número válido o el valor por defecto (datos que llegan por red) |

## Clases de three más usadas en el juego
`C`=Vector3 · `ae`=Vector2 · `Dt`=Quaternion · `ts`=Euler · `pe`=Color · `st`=Object3D · `ut`=Group · `we`=Mesh · `Dn`=InstancedMesh · `ns`=Scene · `St`=PerspectiveCamera · `Or`=WebGLRenderer
Materiales: `Xe`=MeshStandardMaterial · `ot`=MeshBasicMaterial · `Lt`=ShaderMaterial · `dn`=SpriteMaterial · `Ut`=LineBasicMaterial · `qr`=LineDashedMaterial · `Di`=PointsMaterial
Geometrías: `at`=Box · `Gt`=Cylinder · `yn`=Sphere · `wn`=Plane · `li`=Ring · `ss`=Circle · `Gr`=Cone · `ai`=Icosahedron · `os`=Dodecahedron · `Wr`=Capsule · `Ue`=BufferGeometry · `Ge`=BufferAttribute
Otros: `rn`=CanvasTexture · `gn`=Sprite · `sn`=Line · `is`=Points · `di`=PointLight · `as`=DirectionalLight · `Js`=HemisphereLight · `zr`=FogExp2 · `oa`=AnimationMixer · `Ks`=TextureLoader · `Gs`=PMREMGenerator

Para cualquier otro nombre de three: buscar `=> nombre,` en las primeras 500 líneas de `src/00-three.lib.js`.
