# Palazo Real · auditoría del 15-nov-2026

Revisión completa del juego publicado (versión 12 del artefacto) antes de pasar el trabajo a conversaciones nuevas. Cada punto remite a una tarea de `TAREAS.md`.

## Resumen
- **El juego está sano para jugar hoy:** los 11 modos y mapas arrancan y no hay errores de página (prueba automática, seguro).
- **Hay un defecto serio que no se ve al principio:** cada cambio de mapa deja memoria gráfica sin liberar. En partidas largas en iPhone o Quest puede terminar en cierre o recarga (seguro que pierde memoria; probable que llegue a cerrar).
- **Dos cosas grandes nunca se probaron de verdad:** la VR de Palazo Real en un visor y el juego en línea con personas. Todo lo verificado ahí fue con controles y salas simulados.
- **El motor dibuja de más para lo que muestra:** 8 de cada 10 mallas de la escena son piezas chicas que suman el 2 % de los triángulos, y cada una cuesta una orden de dibujo. Es la mejora de rendimiento más barata.
- **La interfaz funciona en PC y es floja en celular:** 15 botones en pantalla, todos los menús con scroll, y en vertical se rompe.
- **El riesgo de mantenimiento bajó hoy:** la fuente quedó ordenada en 30 archivos, con glosario y pruebas, y arma un archivo idéntico al publicado.

## Cómo se midió
Chromium sin pantalla con render por software, sobre el archivo publicado. Sirve para contar (dibujos, triángulos, memoria, solapes); **no sirve para medir cuadros por segundo reales**: eso hay que mirarlo en el iPhone y el Quest.

## 1. Estado del contenido
| Parte | Hay | Observación |
|---|---|---|
| Campaña | 2 misiones (El Pueblo, La Base) | El plan original eran 5 o 6 mapas |
| Operaciones | 1 (Apagón) | El modo que más te gustó es el que menos contenido tiene |
| En línea | 3 modos, 5 arenas | Sin probar con gente |
| Zombis | oleadas, solo o cooperativo | El zombi es el soldado con otra piel |
| Superslow | 10 misiones, pantalla y VR | Motor aparte, estética distinta |
| VR Palazo Real | manos, fundas, dos manos | Sin probar en visor |

## 2. Reparaciones

### R1 · Pierde memoria gráfica en cada cambio de mapa (alta)
- Al salir de un mapa se sacan los objetos de la escena pero no se liberan sus geometrías ni texturas.
- Medido: cada carga de El Pueblo deja **+237 geometrías y +28 texturas** que no se van nunca. Cuatro cargas seguidas: de 1.775 a 2.723 geometrías.
- Dónde pega: en línea se cambia de mapa cada 10 minutos; en zombis, cada partida.
- (seguro) la fuga existe. (probable) en iPhone termina recargando la página tras varias partidas; no lo pude reproducir sin el dispositivo.

### R2 · La VR de Palazo Real no se probó en un visor (alta)
- Funciona con controles simulados: disparar, dos manos, guardar, sacar, tirar granada, soltar y levantar.
- Lo que solo se ve con el visor puesto: posición de las fundas (calculadas para 1,80 m parado), ángulo del arma en la mano, altura de la cámara, si la funda de la espalda se alcanza, rendimiento.
- No hay menú dentro del visor: se elige el modo en la pantalla y recién ahí entra.

### R3 · El juego en línea no se probó con personas (alta)
- Con sala simulada anduvo todo el ciclo: entrar, pegar, morir, reaparecer, votar, cambiar de mapa, zombis con anfitrión, traspaso del anfitrión.
- Sin medir: cuántos datos por segundo aguanta la sala con 6 jugadores y 20 zombis, y cómo se siente el retraso.
- Los objetos del piso no se comparten: cada pantalla tiene los suyos.

### R4 · Dos motores vivos al mismo tiempo (media)
- Después de entrar una vez a Superslow quedan dos contextos gráficos abiertos (el de Palazo Real dormido y el de Superslow), y no se cierra ninguno.
- (probable) en el Quest y en iPhone suma presión de memoria junto con R1.

### R5 · Detalles (baja)
- Pedir una misión que no existe rompe en vez de avisar.
- Al volver de pausa sin clic, el navegador rechaza el bloqueo del mouse y queda un error sin atrapar. No afecta el juego.
- Superslow pide la tipografía Silkscreen a Google: sin conexión cae a otra letra. Es el único pedido externo del archivo.
- En celular vertical no hay aviso de "girá el teléfono" y la pantalla queda ilegible (10 solapes).

## 3. Motor gráfico

### Lo que se dibuja (El Pueblo, campaña, 10 soldados)
| Calidad | Órdenes de dibujo | Triángulos | Nota |
|---|---|---|---|
| Baja (celulares, VR) | 317 | 520.000 | sin sombras ni posfiltros |
| Media | 520 | 1.060.000 | incluye la pasada de sombras |
| Alta | 554 | 1.150.000 | |

La Base en baja: 262 órdenes y 400.000 triángulos.

### De dónde salen los triángulos (calidad baja, 538.000)
| Qué | Triángulos | Parte |
|---|---|---|
| Escombros: 4.624 piedras de 36 caras | 166.000 | 31 % |
| Soldados: 20 mallas de 11.000 (dos por soldado) | 114.000 | 21 % |
| Terreno: malla uniforme de 220 × 220 | 97.000 | 18 % |
| Bolsas de arena: 279 esferas | 47.000 | 9 % |
| Pasto: 5.000 matas | 30.000 | 6 % |
| **278 piezas chicas sueltas** | **10.000** | **2 %** |

- **G1 · Piezas chicas sueltas.** De las 339 mallas de la escena, 278 son piezas de menos de 200 triángulos (postes, tablas, marcos), cada una con su orden de dibujo. Unidas por material, las 317 órdenes por cuadro bajarían a unas 40–80 (probable). En celulares y en VR (que dibuja todo dos veces) es lo que más rinde por el esfuerzo.
- **G2 · Escombros.** Un tercio de los triángulos son piedritas. Con 20 caras en vez de 36 y menos cantidad en calidad baja se recuperan unos 90.000 triángulos sin que se note.
- **G3 · Terreno.** La malla tiene la misma densidad a 5 m que a 300 m.
- **G4 · Soldados lejanos.** Se animan igual a 100 m que a 5 m. Se puede animar a la mitad de frecuencia de lejos.

### Cómo se ve
- **G5 · En celular se ve plano.** La calidad baja apaga sombras y todo el tratamiento de color; el celular recibe la peor versión aunque un iPhone moderno puede más. Falta un nivel intermedio: sombra redonda barata bajo cada personaje, color tratado sin posfiltro y resolución que se ajuste sola a los cuadros por segundo.
- **G6 · La noche es plana.** Los faroles no dejan charco de luz visible, los pinos son siluetas negras y cuesta leer la escena.
- **G7 · El atardecer encandila.** El brillo del sol tapa media pantalla cuando mirás al oeste.
- **G8 · Las armas en mano no pegan con el resto.** Son de colores planos estilo bloque (vienen del Palazo original) al lado de un soldado realista. Lo mismo las manos.
- **G9 · Árboles de conos.** Es lo que más delata el origen de bloques en los mapas.
- **G10 · Animaciones.** Agacharse, morir y recargar son poses calculadas, no animaciones. El zombi es un soldado.
- **G11 · Peso.** 8,2 MB. Las dos texturas de pasto pesan 1,7 MB; three está dos veces (0,6 MB) y los modelos de armas también (0,57 MB), por convivir dos motores.

## 4. Interfaz

### Medido
| Pantalla | PC 1280×720 | Celular acostado 844×390 | Celular vertical |
|---|---|---|---|
| Inicio | scroll (corta los controles) | scroll: se ven 2 de 6 opciones | entra |
| Campaña | entra | scroll | scroll |
| Operaciones | scroll | scroll (783 de alto en 356) | scroll |
| En línea | entra | scroll | scroll |
| Ajustes | entra | scroll | entra |
| Botones de menos de 40 px | 11 en campaña, 19 en línea, 14 en ajustes | igual | igual |
| HUD | sin solapes | radar pisa el botón ARMA | 10 solapes |

### Observado
- **I1 · Inicio.** Lista vertical de 6 botones iguales, sin jerarquía ni imagen. En celular hay que deslizar para llegar a Superslow, VR y Ajustes.
- **I2 · Botones táctiles.** 15 en pantalla a la vez (11 de acción, 4 de órdenes). USAR, PIEDRA y GRAN están siempre aunque no apliquen; GRAN cae encima del cartel central.
- **I3 · HUD en PC.** La fila de armas abajo a la derecha está en letra de 11 px y se pisa con el nombre del arma. No hay íconos.
- **I4 · En línea.** El aviso "sin sala" sale en rojo como si fuera un error, cuando es el estado normal fuera de Claude. No se ve quién es el anfitrión ni cómo invitar.
- **I5 · Ajustes.** Solo calidad en 4 niveles, sensibilidad, campo de visión y volumen. Faltan: sensibilidad táctil y con mira, opciones de VR (mano hábil, giro, sentado o parado), tamaño de botones.
- **I6 · Dos estéticas.** Superslow abre un panel blanco con otra tipografía; parece otra aplicación.
- **I7 · Miniaturas.** Las tarjetas de mapa son degradados de color, no imágenes del mapa.
- **I8 · VR.** Vida y munición en la muñeca, bien; pero pausa, cambio de modo y fin de partida obligan a sacarse el visor.
- **I9 · Cierre de partida.** La pantalla final es mínima: sin estadísticas ni progreso de campaña a la vista.

## 5. Mantenimiento
- **Hecho hoy (seguro):**
  - La fuente quedó en `palazo-src/src/`, 30 archivos por capa. Armada, da un archivo **idéntico byte a byte** al publicado.
  - Glosario de nombres abreviados, prueba de humo de todos los modos, prueba de VR simulada y sala falsa para el juego en línea.
  - Copia del Palazo de bloques en el repo (antes solo existía en el artefacto).
- **Sigue pendiente:**
  - Los nombres de variables son cortos e ilegibles; se arreglan de a poco, al tocar cada parte.
  - Superslow usa otro motor. Portarlo al de Palazo Real ahorraría 1,2 MB y un contexto gráfico, pero es trabajo grande y con riesgo de cambiarle la sensación.
  - El repo es público: la fuente y el juego los puede ver cualquiera con el enlace.

## 6. Orden recomendado
1. **R1** (fuga de memoria): chico y evita el peor problema.
2. **Probar VR y en línea** (R2, R3) con las listas de `TAREAS.md`: son las dos incógnitas más grandes y solo las podés despejar vos.
3. **G1 + G2** (dibujar menos): mejora directa en iPhone y Quest.
4. **I1 + I2** (inicio y botones del celular): lo que más se toca.
5. **G5 a G9** (cómo se ve), de a una y mirando capturas antes y después.
6. Contenido nuevo (operaciones, misiones) recién después: hoy cada mapa nuevo hereda los problemas de arriba.

Mi recomendación de fondo: antes de sumar modos, cerrar R1–R3. El juego creció en ancho (campaña, operaciones, en línea, zombis, Superslow, VR) más rápido de lo que se pudo probar.
