# Palazo Real · arquitectura

Un solo archivo HTML con dos juegos: **Palazo Real** (three.js 0.160) y **Superslow** con su VR (three r128, traído del Palazo de bloques). Mientras se juega uno, el motor del otro duerme.

## Pirámide por capas
Cada capa usa solo las de abajo. Los archivos de `src/` se pegan en orden numérico y comparten ámbito (sin `import`): el número es el orden de pegado, la capa está en la tabla.

| Capa | Archivo | Qué hace |
|---|---|---|
| lib | `00-three.lib.js` | three.js y posprocesado. No editar. |
| 0 | `01-motor.js` | Niveles de calidad (`Pc`), posfiltro de color, bucle (`setAnimationLoop`, sirve para pantalla y visor), sombra que sigue al jugador. Se duerme (`E.sleep`) durante Superslow. |
| lib | `02-cargadores.lib.js` | mergeGeometries y GLTFLoader. No editar. |
| 0 | `03-recursos.js` | Carga de texturas, soldado y armas embebidos (`window.__ASSETS`). |
| 0 | `04-fisica.js` | Terreno por función de altura, cajas en grilla espacial, cápsula con escalones, rayos, línea de vista. |
| 0 | `05-entrada.js` | Teclado, mouse con bloqueo, táctil (palanca y botones por `data-a`). |
| 0 | `06-audio.js` | Todo el sonido es sintetizado: disparos, explosiones, pasos, sirena, voces de zombi. |
| 1 | `07-ambiente.js` | Cielo, sol o luna, niebla, estrellas; preajustes `sunset` y `night`. |
| 1 | `08-terreno-kit.js` | Malla del terreno y kit de piezas `K` (casas, torres, bolsas, vehículos, búnker, hangar, faroles). Cada pieza registra su colisión. |
| 1 | `09-pasto-fx.js` | Pasto instanciado con viento; efectos `FX` (humo, fuego, explosión, trazadora, impacto, arco de tiro). |
| 2 | `10-armas.js` | Tabla de armas `dt`, equipo, combate: disparo por rayo, perdigones, granadas, melé, daño por zona, casco y chaleco, ruido. El daño a remotos se avisa por red. |
| 2 | `11-sigilo.js` | Conos de visión según luz, postura y movimiento; oído; tranquilo → sospecha → alerta; alarma y refuerzos. |
| 2 | `12-escuadra.js` | Órdenes (seguir, quietos, ir, fuego) y cambio de integrante. |
| 2 | `13-operacion.js` | Modo operación: cargas, extracción, arrastrar cuerpos, piedras, marcas "?" y "!". |
| 3 | `14-mapa-base-ops.js` | Mapa La Base (noche) y la lista de operaciones. |
| 1 | `15-personaje.js` | Soldado animado con manos al arma por IK, agacharse, muerte, zonas de impacto; variante zombi (piel por sombreador, encorvado). Geometrías de armas. |
| 2 | `16-recoleccion.js` | Armas, munición, botiquín, granada, chaleco, casco. |
| 2 | `17-ia.js` | Grilla de navegación, campos de flujo, modos de los bots, destrabe. |
| 2 | `18-jugador.js` | Movimiento, cámara 1.ª/3.ª, mira, retroceso, recarga, granada cargada. En VR delega en `G.vr`. |
| 2 | `19-hud.js` | Vida, munición, objetivo, radar, brújula, equipo, avisos. |
| 2 | `20-campana.js` | Sectores, puntos a tomar, escuadra de 4, refuerzos. |
| 3 | `21-mapa-pueblo.js` | Mapa El Pueblo (atardecer) y la lista de mapas. |
| 2 | `22-zombis.js` | Oleadas (máx. 20), oído y vista, mordisco; por red los simula el anfitrión. |
| 2 | `23-enlinea.js` | Todos contra todos, equipos y zombis: jugadores remotos, impactos, bajas, reloj, votación, anfitrión. |
| 3 | `24-menus.js` | Inicio, campaña, operaciones, en línea, ajustes, pausa, final. |
| 0 | `25-red.js` | Sala en vivo de Claude (`room`): cada pantalla publica su estado unas 15 veces por segundo. |
| 3 | `26-arenas-campana.js` | Las 5 arenas (recortes de los mapas) y las misiones de campaña. |
| 3 | `27-arranque.js` | Estado global `G` (en el código, `Y`), ajustes guardados, creación del motor. |
| 2 | `28-vr.js` | Sesión WebXR, manos, fundas, dos manos, paneles de muñeca y de avisos. |
| 3 | `29-principal.js` | Carga de mapa, inicio de cada modo, pausa, fin, bucle de juego, entrada a Superslow y al visor. |

## Cómo se arma un modo
`G.startMission(i, prim, sec)`, `G.startOp(i)` y `G.startDM(gm)` hacen lo mismo: limpian la escena, arman el mapa (ambiente, terreno, kit, física, navegación), crean jugador y sistemas, y dejan en `G.mode` un objeto con la misma forma: `kind`, `update(dt, t)`, `hud()`, `marks()`, `onKill()`, `deathTick()`, `clear()`. Un modo nuevo es otro objeto con esa forma.

## En línea
- Sin servidor. Cada pantalla publica su estado (`presence`) y decide sus propios disparos; si le pega a alguien, lo avisa, y la pantalla del otro se descuenta la vida y avisa su baja.
- El primero que entró es el anfitrión: lleva el reloj (10 min), cuenta los votos del mapa siguiente y simula la horda de zombis. Si se va, el siguiente toma la horda donde estaba.
- Contadores que nunca retroceden (`G.netSeq`) evitan aplicar dos veces un impacto o una baja.
- Fuera de Claude no hay sala: `G.net.state === "off"` y todo anda en solitario.

## VR de Palazo Real
- La cámara es hija de `G.vr.rig`, que sigue al jugador; la cabeza la mueve el visor.
- Manos como en Superslow: grip sostiene, gatillo dispara el arma de esa mano, juntar las manos la pasa. Soltar: se cae al piso (queda para levantar) o, sobre su funda, se guarda.
- Fundas calculadas desde la cabeza: espalda (largas), cintura derecha (pistola), cintura izquierda (melé), pecho (granadas).
- Arma larga a una mano: retroceso ×2,2 y temblor. Con la otra mano en el guardamanos: ×0,45 y el arma apunta en la línea entre las dos manos.
- Adentro del visor: calidad baja, sin posfiltros, foveación al máximo.

## Superslow
Código tal cual del Palazo de bloques (`superslow/`), envuelto por `armar.py` con lo mínimo que necesita (ajustes de sensibilidad y volumen tomados de Palazo Real, guardado propio en `palazo.v1`). Entra con `SS.enter()` y vuelve con `window.__ssExit()`.

## Memoria gráfica al cambiar de mapa
- Al limpiar la escena (`d0()` en `29-principal.js`) cada objeto se libera con `freeTree()` (`15-personaje.js`): geometrías, materiales, texturas, esqueletos, mallas instanciadas y sombras de luces.
- No se libera lo compartido entre cargas (`sharedSet()`): recursos del soldado (`pa`), geometrías de armas en caché (`bf`), material `Mb`, texturas en caché de `Pn` (`pf`) y texturas de render (posfiltros).
- Todo lo que se crea una sola vez y vive entre cargas lleva `userData.keep = true` (por ejemplo los paneles de la VR). **Regla para código nuevo:** si algo se reusa entre mapas, marcarlo así.
- Los personajes liberan lo suyo al morir o irse (`char.dispose()`); el reflejo del cielo se reemplaza borrando el anterior (`07-ambiente.js`).
- Prueba: `pruebas/memoria.py` (geometrías y texturas parejas carga tras carga).

## Guardado en el navegador
Prefijo `pzreal.`: `settings` (calidad, sensibilidad, campo de visión, volumen, cámara, dificultad), `progress`, `mp` (nombre, color, arma, modo, mapa), `vr` (visor encendido).
