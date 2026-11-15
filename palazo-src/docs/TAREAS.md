# Palazo Real · tareas

Lista de trabajo que sale de `AUDITORIA.md`. Cada tarea está pensada para **una conversación nueva**: decir "hacé la tarea X de TAREAS.md". Antes de empezar cualquiera, leer `CONTINUAR.md` y `GLOSARIO.md`.

Tamaño: **chica** (una entrega corta) · **media** (una conversación) · **grande** (varias; partirla antes de empezar).
Al terminar una tarea: marcarla `[x]`, publicar (artefacto, app, repo) y anotar abajo qué quedó para probar en dispositivo.

## Primero: lo que solo puede probar Vago

### [ ] P1 · Probar la VR de Palazo Real en el Quest (20 min)
Abrir la app en el navegador del Quest, encender "Visor VR", entrar a **En línea → Zombis → Practicar solo** (es el modo más simple). Anotar sí/no y qué pasa:
1. ¿Entra al visor y ves el mapa a la altura correcta (ni enano ni gigante)?
2. ¿El fusil aparece en la mano derecha, derecho, apuntando hacia donde apunta el control?
3. Gatillo: ¿dispara? ¿El punto rojo coincide con donde pega?
4. Mano izquierda al guardamanos + grip: ¿se pone firme? ¿Apunta natural entre las dos manos?
5. Funda de la espalda: ¿llegás con la mano? ¿Aparece el aro dorado? ¿Guarda y saca?
6. Cintura derecha (pistola), cintura izquierda (pala), pecho (granada): ¿están donde las buscás?
7. Tirar la granada con el brazo: ¿sale hacia donde tirás, con fuerza razonable?
8. Caminar, girar, agacharse (stick derecho abajo), saltar (B): ¿marea? ¿va fluido o a los saltos?
9. Panel de la muñeca izquierda: ¿se lee?
10. Y para salir: ¿vuelve a la pausa en pantalla?

Con las respuestas se hace la tarea **R2**.

### [ ] P2 · Probar en línea con 2 a 6 personas (30 min)
Compartir el artefacto de Palazo Real desde el menú Compartir (cada uno entra con su cuenta de Claude). Jugar una partida de cada modo y anotar:
1. ¿Todos ven a todos? ¿Los nombres y colores son los correctos?
2. ¿Los rivales se mueven fluido o a los saltos? ¿Cuánto tarda en morir alguien desde que le pegás?
3. ¿Las bajas y la tabla coinciden en todas las pantallas?
4. Al terminar el reloj: ¿aparece la votación a todos y cambian todos al mismo mapa?
5. Zombis: ¿todos ven los mismos zombis en el mismo lugar? ¿Se traba con 20 zombis?
6. Que el anfitrión (el primero que entró) cierre la pestaña en medio de zombis: ¿la partida sigue?
7. ¿Molesta que las armas del piso no se compartan?
8. Después de 3 o 4 cambios de mapa en iPhone: ¿se recarga sola la página o se pone lento? (esto es R1)

Con las respuestas se hace la tarea **R3**.

## Reparaciones

### [ ] R1 · Liberar la memoria gráfica al cambiar de mapa — chica/media
- **Problema:** `d0()` en `29-principal.js` saca los objetos de la escena sin liberar geometrías, materiales ni texturas. +237 geometrías y +28 texturas por carga.
- **Hacer:** antes de sacar cada objeto, recorrerlo y llamar `dispose()` a geometrías, materiales y sus texturas. **No liberar lo compartido:** recursos de `pa` (soldado), geometrías de armas en caché (`bf`, vía `ro`), texturas que devuelve `Pn` si están en caché, materiales de módulo como `Mb`. Marcar lo compartido con `userData.keep = true` al crearlo es lo más seguro.
- **Cuidado:** los personajes clonan el esqueleto pero comparten geometría con `pa.soldier`; `gs(...).dispose` ya existe en `15-personaje.js`, revisar qué libera.
- **Verificar:** en el navegador sin pantalla, cargar El Pueblo 4 veces seguidas y leer `G.E.renderer.info.memory`: geometrías y texturas tienen que quedar iguales después de la 2.ª carga. Luego `humo.py`. Mirar que no aparezcan mallas negras o invisibles al volver a entrar (señal de haber liberado algo compartido).

### [ ] R2 · Ajustar la VR con lo que salga de P1 — media
- **Dónde:** `28-vr.js`. Posiciones de fundas: función `holsters()` (`HP.back`, `HP.hipR`, `HP.hipL`, `HP.chest`) y radios `HR`. Arma en la mano: `setW()` (offset por `gripR`) y el bloque "apuntar" al final de `V.after`. Retroceso a una y dos manos: `fire()` (`mul`) y el mismo bloque.
- **Probable que haga falta:** inclinar el arma unos grados (los controles del Quest apuntan más arriba que un mango de pistola), bajar o subir las fundas según altura real de la cabeza, y una opción "sentado".
- **Verificar:** `vr_simulada.py` y de nuevo P1.

### [ ] R3 · Ajustar el juego en línea con lo que salga de P2 — media
- **Dónde:** `23-enlinea.js` (envío `send()`, recepción `upsert()`), `22-zombis.js` (`pack`, `apply`, `follow`), `25-red.js`.
- **Si hay saltos:** subir el suavizado o guardar dos estados y dibujar 100 ms atrás. **Si los zombis saturan:** mandar la horda cada 2 envíos o solo los que cambiaron.
- **Sumar un medidor oculto** (tocar 3 veces el reloj): envíos por segundo, tamaño del estado en bytes, edad del último estado de cada jugador.
- **Decidir con Vago:** si los objetos del piso se comparten (el que lo toma avisa; los demás lo ocultan 20 s).
- **Verificar:** `pruebas/sala_falsa.js` con dos pestañas servidas por http (ver cabecera del archivo) y de nuevo P2.

### [ ] R4 · Cerrar el motor de Superslow al salir — chica
- **Dónde:** `superslow/superslow.js`, funciones `init()`, `enter()`, `exit()`. Hoy el render se crea la primera vez y no se libera.
- **Hacer:** en `exit()`, liberar el render (`R.dispose()`, `R.forceContextLoss()`), anular `R` para que `enter()` lo vuelva a crear. Revisar que la VR de Superslow siga entrando después de salir y volver.
- **Verificar:** `humo.py` entra, juega y sale; agregarle una segunda entrada.

### [ ] R5 · Detalles — chica
- `Y.startMission` (`29-principal.js`): si el índice no existe, avisar con `Y.toast` y volver al inicio.
- Bloqueo del mouse: atrapar la promesa rechazada de `requestPointerLock()` (`05-entrada.js`, `23-enlinea.js` en `lockAgain`, y dos llamadas en `29-principal.js`).
- Tipografía Silkscreen: embeberla en base64 como Chakra Petch o reemplazarla por Chakra Petch en `superslow/estilos.css`, y quitar el `<link>` a Google de `armar.py`.
- Celular vertical: cartel "Girá el teléfono" que tape el juego cuando `orientation: portrait` y hay táctil (`pagina/pagina.html`).

## Motor gráfico

### [ ] G1 · Unir las piezas chicas por material — media
- **Dónde:** `08-terreno-kit.js` (`gf`, el kit `K`). Ya existe la función de unir geometrías (`da` = mergeGeometries, en `02-cargadores.lib.js`) y el kit ya une algunas piezas (buscar `l.group.add`).
- **Hacer:** que cada pieza estática registre su geometría ya transformada en una lista por material, y al final de armar el mapa (`K.finish()`, llamado desde la carga en `29-principal.js`) crear una malla por material y sector. La colisión no cambia: las cajas ya van aparte en la física.
- **No unir:** lo que se mueve o se prende y apaga (faroles con luz, banderas, puertas, objetivos, cuerpos).
- **Verificar:** órdenes de dibujo de El Pueblo en calidad baja (hoy 317) por debajo de 100; capturas antes y después idénticas a la vista; `humo.py`.

### [ ] G2 · Escombros más livianos — chica
- **Dónde:** `08-terreno-kit.js`, la malla instanciada de dodecaedros (`new Dn(new os(1, 0), …)`).
- **Hacer:** icosaedro de 20 caras; en calidad baja, la mitad de piezas (elegidas con el mismo generador para que el mapa no cambie entre jugadores: no afecta colisión).
- **Verificar:** triángulos totales en baja de 538.000 a menos de 450.000; captura de una ruina de cerca.

### [ ] G3 · Terreno con menos malla lejos — media
- **Dónde:** `mf` en `08-terreno-kit.js`. Hoy 220×220 (baja) o 320×320 uniforme sobre 700 m.
- **Hacer:** malla densa solo en el área de juego (`map.bounds` + margen) y un anillo exterior grueso. Cuidar que las alturas coincidan en la unión.

### [ ] G4 · Soldados lejanos más baratos — chica
- **Dónde:** `17-ia.js` (llamada a `char.update`) y `15-personaje.js`.
- **Hacer:** a más de 60 m, actualizar la animación un cuadro sí y uno no; a más de 120 m, uno de cada cuatro. Sin sombra propia a más de 80 m.

### [ ] G5 · Nivel gráfico intermedio para celular y VR — media/grande
- **Dónde:** `Pc` y `Rg` en `01-motor.js`; `Y.applyQuality` en `27-arranque.js`.
- **Hacer, en este orden:** (1) sombra redonda bajo cada personaje y vehículo en calidad baja; (2) contraste y tinte del posfiltro pasados al mapeo de tonos para que la calidad baja no se vea lavada; (3) resolución que baja sola si los cuadros caen de 45 y sube si sobran (promedio de 2 s, pasos de 10 %).
- **Verificar:** capturas baja vs. media lado a lado; prueba en iPhone (Vago).

### [ ] G6 · Noche legible — media
- **Dónde:** preajuste `night` en `07-ambiente.js`; faroles en `08-terreno-kit.js` (`K.lamps`).
- **Hacer:** charco de luz en el piso bajo cada farol (disco aditivo, sin luz real), halo en la lámpara, luna un poco más fuerte y fría, niebla baja más clara cerca del horizonte para recortar siluetas.
- **Cuidado:** el sigilo usa la luz de los faroles para calcular si te ven (`11-sigilo.js`); lo visual tiene que coincidir con ese radio.

### [ ] G7 · Atardecer sin encandilar — chica
- **Dónde:** preajuste `sunset` en `07-ambiente.js` y el brillo (`eo`, parámetros `0.32, 0.5, 1.6`) en `01-motor.js`.
- **Hacer:** subir el umbral del brillo o bajar su fuerza mirando al sol; revisar exposición (`toneMappingExposure` 0,85).

### [ ] G8 · Armas en mano con mejor material — media
- **Dónde:** `ro`, `oo` y el material `Mb` en `15-personaje.js`; manos en `18-jugador.js` (`y`, `m`).
- **Hacer (barato):** separar por color en metal (oscuro, brillante) y madera o polímero (mate), con algo de variación; biselar el sombreado. **Hacer (caro):** modelos nuevos libres de derechos; necesita que Vago los baje y los pase.

### [ ] G9 · Árboles — media
- **Dónde:** `08-terreno-kit.js` (pinos y árboles).
- **Hacer:** copas con varias capas irregulares y variación de tamaño, tinte y giro; o planos cruzados con textura dibujada en canvas. Instanciados.

### [ ] G10 · Animaciones y zombi de verdad — grande, depende de Vago
- Bajar de mixamo.com (cuenta gratis de Adobe) un zombi y las animaciones agacharse, morir, recargar y caminar de zombi, en formato FBX o GLB, y pasarlas. Los nombres de huesos son los que ya usa el juego (`mixamorig…`).
- **Dónde:** `15-personaje.js` (`gs`), `03-recursos.js`.

### [ ] G11 · Bajar el peso del archivo — chica
- Recomprimir `grasslight-big.jpg` y su mapa de normales (1,7 MB) a 1024 px y calidad 70. Está en `pagina/recursos.js.txt` (una línea JSON con datos en base64: editar con un script, no a mano).

### [ ] G12 · Rendimiento en el Quest — media, después de P1
- Medir cuadros por segundo en el visor (contador en el panel de la muñeca). Si no llega a 72: G1, G2, bajar `framebufferScaleFactor`, pasto a la mitad.

## Interfaz

### [ ] I1 · Inicio en tarjetas — media
- **Dónde:** `#home` en `pagina/pagina.html`; `24-menus.js`.
- **Hacer:** grilla de 2 o 3 columnas con una imagen por modo (captura real reducida, embebida), que entre sin scroll en 844×390. Controles de teclado a una pantalla "Controles". Ajustes y Visor VR como botones chicos arriba a la derecha.
- **Verificar:** capturas en 1280×720, 844×390 y 390×844 sin scroll en inicio.

### [ ] I2 · Botones táctiles según el momento — media
- **Dónde:** `#touch` en `pagina/pagina.html`, `05-entrada.js`, `19-hud.js`.
- **Hacer:** USAR solo cerca de algo usable; PIEDRA solo en operaciones; GRAN solo con granadas; órdenes plegadas en un botón que despliega las 4. Corregir el solape radar × ARMA y GRAN sobre el cartel central. Mínimo 44 px en todo lo tocable (hoy 11 a 19 controles por pantalla están por debajo).
- **Después (aparte):** editor para mover y agrandar botones, y modo zurdo.

### [ ] I3 · HUD de armas con íconos — chica
- **Dónde:** `#slots`, `#wname`, `#ammo` en `pagina/pagina.html`; `19-hud.js`.
- **Hacer:** silueta de cada arma dibujada desde su geometría (vista lateral en un canvas chico), la activa resaltada; quitar el solape con el nombre.

### [ ] I4 · Pantalla En línea más clara — chica
- **Dónde:** `#mp` en `pagina/pagina.html`; `buildMP` en `24-menus.js`.
- **Hacer:** "sin sala" en tono neutro con una línea de cómo jugar con amigos (abrir desde Claude y compartir); mostrar quién es el anfitrión; lista de jugadores con color.

### [ ] I5 · Ajustes completos — media
- Sensibilidad táctil y con mira; tamaño de botones; opciones gráficas sueltas (sombras, pasto, posfiltros, resolución) además de los 4 niveles; sección VR: mano hábil, giro por pasos o suave, parado o sentado, viñeta al moverse.

### [ ] I6 · Menú dentro del visor — grande
- Panel flotante con láser para pausa, reintentar, cambiar de modo y ver la tabla sin sacarse el visor. Reusar los paneles de `28-vr.js` (`panel()`).

### [ ] I7 · Superslow con la misma cara — chica/media
- Pasar el menú de Superslow a los colores y la tipografía de Palazo Real (`superslow/estilos.css`, `superslow/pantalla.html`). El juego por dentro (blanco y rojo) no se toca: es su identidad.

### [ ] I8 · Fin de partida y progreso — chica
- Pantalla final con bajas, precisión, tiempo y mejor marca guardada; misiones completadas marcadas en Campaña y Operaciones (`lo.get("progress")` ya existe).

### [ ] I9 · Miniaturas reales de mapas — chica
- Reemplazar los degradados `.thumb` por capturas reducidas (320 px, JPEG calidad 60, embebidas).

## Contenido (después de R1–R3)
- [ ] C1 · Segunda y tercera operación (reusar La Base de día y El Pueblo de noche). Datos en `14-mapa-base-ops.js`.
- [ ] C2 · Tercer mapa de campaña.
- [ ] C3 · Zombis: tipos (rápido, grande), mejoras entre oleadas.
- [ ] C4 · Objetos compartidos en línea (si P2 dice que molesta).

## Mantenimiento
- [ ] M1 · Renombrar los nombres de nivel superior según `GLOSARIO.md`, de a un archivo por vez, con buscar y reemplazar de palabra completa y `humo.py` después de cada uno. Empezar por `Y`→`G`, `Ye`→`E`, `On`→`P`, `dt`→`WEAPONS`.
- [ ] M2 · Portar Superslow al motor de Palazo Real (grande; ahorra 1,2 MB y un contexto gráfico; riesgo de cambiarle la sensación). Decidir con Vago si vale la pena.
- [ ] M3 · Sumar a `humo.py`: prueba de dos pestañas con `sala_falsa.js` y conteo de memoria tras 4 cargas (cubre R1 para siempre).

## Pendiente de probar en dispositivo
(anotar acá, con fecha, lo que cada entrega deja para que Vago pruebe)
