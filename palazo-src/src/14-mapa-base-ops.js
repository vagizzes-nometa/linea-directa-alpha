  function Qn(s, e) {
    let t = 0.18 * Math.sin(s * 0.09) * Math.cos(e * 0.07) + 0.1 * Math.sin(s * 0.27 + e * 0.19),
      n = Math.max(0, Math.abs(s) - 50),
      i = Math.max(0, -e - 104) + Math.max(0, e - 64);
    return ((t += 14 * fs(0, 110, n + i) * (0.55 + 0.45 * Math.sin(s * 0.045 + e * 0.031))), e < 36 && (t *= 0.35), t);
  }
  var ps = {
    id: "base",
    name: "La Base",
    card: "Noche \xB7 base militar",
    env: "night",
    center: [0, -20],
    terrainSize: 700,
    bounds: { x0: -52, x1: 52, z0: -108, z1: 68 },
    grassArea: [-50, 50, 30, 66],
    H: Qn,
    grassTint: "#9aa08a",
    desc: "Asalto nocturno: sal\xEDs del bosque, romp\xE9s el port\xF3n con sus torres, limpi\xE1s los barracones, tom\xE1s los hangares y entr\xE1s al b\xFAnker de comando.",
    tip: "El \xFAltimo punto est\xE1 adentro del b\xFAnker: la puerta est\xE1 atr\xE1s. Las ranuras del frente tienen tiradores.",
    ground(s, e) {
      return e < 34 ? { a: 0.85, c: (Math.abs(s) < 4 ? 1 : 0) ? [0.42, 0.42, 0.44] : [0.62, 0.58, 0.5] } : null;
    },
    isRoad: (s, e) => Math.abs(s) < 4,
    start: [0, 60, 0],
    sectors: [
      {
        pts: [
          [-14, 22],
          [15, 18],
        ],
        spawn: [0, 40],
      },
      {
        pts: [
          [-10, -12],
          [13, -16],
        ],
        spawn: [0, 6],
      },
      {
        pts: [
          [-26, -50],
          [26, -50],
        ],
        spawn: [0, -28],
      },
      { pts: [[0, -90]], spawn: [0, -64] },
    ],
    items: [
      ["w:sniper", 6, 50],
      ["med", -10, 46],
      ["ammo", 12, 46],
      ["gren", 0, 34],
      ["w:smg", -22, 6],
      ["vest", 22, 4],
      ["med", 0, -26],
      ["ammo", -6, -28],
      ["w:shotgun", 26, -30],
      ["helm", -30, -30],
      ["med", 4, -66],
      ["ammo", -6, -68],
      ["gren", 10, -70],
    ],
    build(s, e) {
      let t = (n, i) => (this.sectors[n].statics = this.sectors[n].statics || []).push(i);
      for (let n = 0; n < 70; n++) {
        let i = -48 + s.rnd() * 96,
          r = 40 + s.rnd() * 26;
        Math.abs(i) < 7 || Math.hypot(i, r - 60) < 9 || s.pine(i, r, 0.9 + s.rnd() * 0.5);
      }
      (s.wall(-50, 32, 50, 32, 2.6, "conc", [
        [-4, 4],
        [-30, -27],
        [27, 30],
      ]),
        s.watchtower(-9, 27),
        s.watchtower(6, 27),
        s.house(-22, 26, 6, 6, { fl: 1, mat: "plaster", dmg: 0.1 }),
        s.house(24, 24, 6, 6, { fl: 1, mat: "plaster", dmg: 0.15 }),
        s.bags(-14, 17, 5, 3, "x"),
        s.bags(15, 13, 5, 3, "x"),
        s.bags(0, 24, 4, 2, "x"),
        s.truck(-34, 22, 1),
        s.crate(30, 18, 1.2, 2),
        s.crate(31.3, 18, 1.2, 1),
        t(0, [-7.5, Qn(-9, 27) + 4.62, 28.5, Math.PI]),
        t(0, [7.5, Qn(6, 27) + 4.62, 28.5, Math.PI]));
      for (let [n, i] of [
        [-28, -6],
        [-28, -22],
        [28, -4],
        [28, -22],
      ])
        s.house(n, i, 16, 8, { fl: 1, mat: "conc", dmg: 0.08, doors: ["n", "s"] });
      (s.bags(-10, -6, 4, 3, "x"),
        s.bags(13, -10, 4, 3, "x"),
        s.bags(0, -20, 4, 3, "x"),
        s.container(-4, 4, 7, "z", "#5a3f2c"),
        s.container(8, -2, 7, "x", "#2f4a5a"),
        s.crate(-16, -14, 1.2, 2),
        s.crate(18, -24, 1.2, 2),
        s.hangar(-40, -62, -12, -38, "s"),
        s.hangar(12, -62, 40, -38, "s"),
        s.truck(-4, -44, 0),
        s.truck(4, -56, 1),
        s.tank(-6, -34, 1.6, 3),
        s.tank(8, -34, 1.6, 3));
      for (let n of [-18, 18])
        (s.box("metal", n, Qn(n, -52) + 0.8, -52, 1.2, 1.4, 9),
          s.box("metal", n, Qn(n, -50) + 2.3, -50, 12, 0.25, 2.2),
          s.box("metal", n, Qn(n, -56) + 2.1, -56.2, 0.2, 1.6, 1));
      (s.bags(-26, -36, 4, 2, "x"),
        s.bags(26, -36, 4, 2, "x"),
        s.bunker(-12, -98, 12, -82, "s"),
        s.bags(-8, -76, 5, 3, "x"),
        s.bags(8, -76, 5, 3, "x"),
        s.watchtower(-28, -84),
        s.watchtower(24, -84),
        s.box("metal", -6, 6.5, -92, 0.15, 7, 0.15),
        s.box("metal", 7, 6.5, -88, 0.15, 7, 0.15),
        t(3, [-6, Qn(-6, -84), -83.2, Math.PI]),
        t(3, [6, Qn(6, -84), -83.2, Math.PI]));
      for (let [n, i] of [
        [-5, 30],
        [5, 30],
        [-18, 10],
        [18, 10],
        [-14, -14],
        [14, -14],
        [-5, -30],
        [5, -30],
        [-26, -36],
        [26, -36],
        [-5, -72],
        [5, -72],
        [-40, 0],
        [40, 0],
        [-40, -70],
        [40, -70],
        [-16, -96],
        [16, -96],
      ])
        s.lamp(n, i);
      (e.column(-36, Qn(-36, 22), 22, { n: 18, H: 22, s: 0.8, fire: 1 }),
        e.column(30, Qn(30, -60), -60, { n: 28, H: 40, s: 1.2, fire: 1 }),
        e.column(-20, Qn(-20, -100), -100, { n: 30, H: 50, s: 1.4 }));
    },
  };
  var Uc = ps.H,
    so = Math.PI,
    Mf = [
      {
        id: "apagon",
        name: "Operaci\xF3n Apag\xF3n",
        map: ps,
        card: "Noche \xB7 sigilo en la base",
        desc: "Cuatro especialistas entran de noche a la base. Hay que poner cargas en los dos hangares y volver al bosque para detonarlas. Si te descubren suena la alarma y llegan refuerzos.",
        tips: [
          "Agachado y lejos de los faroles te ven mucho menos. Correr hace ruido.",
          "Por la espalda, el cuchillo derriba sin ruido. La pistola con silenciador casi no se escucha; el resto de las armas, s\xED.",
          "Si un guardia ve un cuerpo, va a mirar y da la alarma.",
          "Pausa: eleg\xEDs a qu\xE9 integrante manej\xE1s. Solo el Zapador (2) y el Asalto (1) llevan cargas.",
          "\xD3rdenes: T seguime \xB7 H quietos \xB7 F vayan adonde apunto \xB7 Y fuego libre / no disparen. En el celular, desde MEN\xDA.",
          "E (USAR) junto a un ca\xEDdo lo arrastra: escondelo en la oscuridad. G (PIEDRA) tira una piedra: los guardias van a mirar d\xF3nde cay\xF3.",
        ],
        start: [-30, 62, 0],
        team: [
          { name: "R\xEDos", role: "Asalto", prim: "rifle", sec: "spistol", gren: 2, charges: 1 },
          { name: "Medina", role: "Zapador", prim: "shotgun", sec: "spistol", gren: 1, charges: 2 },
          { name: "Sosa", role: "Francotirador", prim: "sniper", sec: "spistol", gren: 0, charges: 0 },
          { name: "Ferreyra", role: "Infiltrador", prim: "smg", sec: "spistol", gren: 0, charges: 0, stealth: 0.75 },
        ],
        objectives: [
          { type: "plant", label: "Hangar oeste", x: -24, z: -45, r: 1.6 },
          { type: "plant", label: "Hangar este", x: 24, z: -45, r: 1.6 },
          { type: "extract", label: "Extracci\xF3n", x: -30, z: 62, r: 7 },
        ],
        enemies: [
          { x: -7.5, z: 28.5, y: Uc(-9, 27) + 4.62, static: !0, yaw: so, prim: "carbine" },
          { x: 7.5, z: 28.5, y: Uc(6, 27) + 4.62, static: !0, yaw: so, prim: "carbine" },
          { x: -2.5, z: 30.4, static: !0, yaw: so },
          { x: 2.5, z: 30.4, static: !0, yaw: so },
          {
            x: -40,
            z: 26,
            path: [
              [-44, 26],
              [44, 26],
            ],
          },
          { x: -22, z: 21, r: 2 },
          { x: 24, z: 19, r: 2 },
          {
            x: -14,
            z: -2,
            path: [
              [-14, -2],
              [14, -2],
              [14, -28],
              [-14, -28],
            ],
          },
          {
            x: 14,
            z: -28,
            path: [
              [14, -28],
              [-14, -28],
              [-14, -2],
              [14, -2],
            ],
          },
          { x: -28, z: -14, r: 3 },
          { x: 28, z: -14, r: 3 },
          { x: -28, z: -54, r: 4 },
          { x: 28, z: -54, r: 4 },
          {
            x: -34,
            z: -34,
            path: [
              [-34, -34],
              [34, -34],
            ],
          },
          { x: 0, z: -72, r: 3, officer: !0, helm: !0, name: "Oficial" },
          { x: -26.5, z: -82.5, y: Uc(-28, -84) + 4.62, static: !0, yaw: so },
          { x: 25.5, z: -82.5, y: Uc(24, -84) + 4.62, static: !0, yaw: so },
        ],
        reinf: {
          max: 8,
          gap: 10,
          at: [
            [-30, -100],
            [30, -100],
            [0, -104],
          ],
        },
        items: [
          ["ammo", -27, 60],
          ["med", -33, 60],
        ],
      },
    ];
