  var ga = (s) => 4 * Math.sin(s * 0.03),
    i0 = [
      [-6, 6, 2.6, 0.9],
      [9, -4, 2.2, 0.7],
      [-12, -6, 3, 1],
      [3, -17, 2.4, 0.8],
      [18, -8, 2.8, 0.9],
      [-4, -30, 2.2, 0.6],
      [22, 6, 3, 1],
      [-20, 4, 2.4, 0.8],
      [14, -30, 2, 0.6],
      [-8, 32, 2.8, 0.9],
      [12, 38, 2.4, 0.8],
      [-22, 26, 2.2, 0.7],
      [6, -58, 2.4, 0.7],
    ];
  function Qs(s, e) {
    let t = 0.28 * Math.sin(s * 0.11) * Math.cos(e * 0.09) + 0.16 * Math.sin(s * 0.31 + e * 0.17) + 0.08 * Math.sin(s * 0.9 - e * 0.7),
      n = Math.max(0, Math.abs(s) - 44),
      i = Math.max(0, -e - 96) + Math.max(0, e - 64);
    t += 16 * fs(0, 110, n + i) * (0.55 + 0.45 * Math.sin(s * 0.045 + e * 0.031)) + 4 * fs(60, 200, n + i) * Math.sin(s * 0.11 - e * 0.07);
    let r = Math.abs(s - ga(e));
    t -= 0.12 * (1 - fs(2.5, 4, r));
    for (let [o, a, c, h] of i0) {
      let l = Math.hypot(s - o, e - a) / c;
      l < 1 ? (t -= h * (1 - l * l)) : l < 1.5 && (t += h * 0.35 * Math.sin(((l - 1) / 0.5) * Math.PI));
    }
    return t;
  }
  var ao = {
    id: "pueblo",
    name: "El Pueblo",
    card: "Atardecer \xB7 pueblo en ruinas",
    env: "sunset",
    center: [0, -20],
    terrainSize: 700,
    bounds: { x0: -46, x1: 46, z0: -100, z1: 68 },
    grassArea: [-44, 44, -98, 66],
    H: Qs,
    desc: "Entr\xE1s al pueblo al atardecer con tu escuadra: las afueras con trincheras, la calle de entrada, el centro con la casa grande y la plaza de la torre.",
    tip: "En el sector 3 hay tiradores en las ventanas del primer piso: us\xE1 la mira y cubrite detr\xE1s de las bolsas.",
    ground(s, e) {
      let t = Math.abs(s - ga(e)),
        n = 1 - fs(2.2, 3.6, t),
        i = [1.05, 0.78, 0.55];
      for (let [r, o, a] of i0) {
        let c = Math.hypot(s - r, e - o) / a;
        if (c < 1.25) {
          let h = 1 - fs(0.5, 1.25, c);
          h > n && ((n = h), (i = [0.42, 0.36, 0.3]));
        }
      }
      return n > 0 ? { a: n * 0.92, c: i } : null;
    },
    isRoad: (s, e) => Math.abs(s - ga(e)) < 3.4,
    start: [0, 60, 0],
    sectors: [
      {
        pts: [
          [-15, 20],
          [17, 24],
        ],
        spawn: [2, 30],
      },
      {
        pts: [
          [-7, -14],
          [19, -10],
        ],
        spawn: [4, -2],
      },
      {
        pts: [
          [-9, -37],
          [12, -31.5],
        ],
        spawn: [2, -24],
      },
      { pts: [[1, -76]], spawn: [2, -60] },
    ],
    items: [
      ["w:smg", 6, 44],
      ["med", -12, 40],
      ["ammo", 14, 42],
      ["gren", ga(30) + 2, 30],
      ["w:shotgun", -20, 8],
      ["vest", 22, 4],
      ["med", 0, -22],
      ["ammo", -14, -20],
      ["w:sniper", 26, -22],
      ["helm", -24, -30],
      ["med", 4, -50],
      ["ammo", -6, -52],
      ["w:carbine", 18, -60],
      ["gren", -14, -58],
    ],
    build(s, e) {
      let t = [],
        n = (l, u) => (this.sectors[l].statics = this.sectors[l].statics || []).push(u),
        i = s.house(-26, 16, 9, 7, { fl: 1, dmg: 0.5, mat: "plaster" }),
        r = s.house(28, 30, 8, 7, { fl: 1, dmg: 0.7, mat: "brick" }),
        o = s.house(-30, 40, 7, 6, { fl: 1, dmg: 0.8, mat: "brick" });
      (s.bags(-15, 15, 5, 3, "x"),
        s.bags(17, 19, 5, 3, "x"),
        s.bags(-4, 27, 4, 2, "x"),
        s.bags(8, 13, 4, 3, "x"),
        s.bags(-24, 24, 4, 2, "z"),
        s.bags(26, 14, 4, 3, "x"));
      for (let [l, u] of [
        [-9, 36],
        [6, 40],
        [-16, 46],
        [18, 48],
        [-2, 46],
        [24, 40],
        [-30, 30],
      ])
        s.hog(l, u);
      (s.wall(-40, 8, -18, 8, 1.1, "conc", [[-30, -27]]),
        s.wall(22, 10, 42, 10, 1.1, "conc", [[30, 33]]),
        s.house(-15, -26, 8, 7, { fl: 2, dmg: 0.38 }),
        s.house(14, -22, 9, 7, { fl: 1, dmg: 0.55, mat: "plaster" }),
        s.house(-21, -12, 6, 6, { fl: 1, dmg: 0.82 }),
        s.house(30, -30, 7, 6, { fl: 1, dmg: 0.7 }),
        s.house(-30, -30, 8, 7, { fl: 1, dmg: 0.5, mat: "plaster" }),
        s.bags(1.2, -9.6, 4.4, 4, "x"),
        s.bags(-7, -6, 3.6, 3, "x"),
        s.bags(10, -11, 3.6, 3, "x"),
        s.bags(-1, 4, 3, 2, "x"),
        s.bags(19, -5, 4, 3, "x"));
      for (let [l, u] of [
        [-9, 2],
        [6, 7],
        [-3, -14],
        [17, 1],
        [-15, 10],
        [12, 16],
        [-24, -4],
      ])
        s.hog(l, u);
      (s.car(5, -13), s.truck(-8, -31, 1), s.car(-24, 6, 1));
      let a = s.house(10, -40, 11, 8, { fl: 2, dmg: 0.25 }),
        c = s.house(-16, -45, 9, 8, { fl: 1, dmg: 0.42 });
      (s.house(24, -52, 7, 7, { fl: 2, dmg: 0.6, mat: "plaster" }), s.bags(8, -34.2, 4, 3, "x"), s.bags(-9, -34, 3, 3, "x"), s.bags(-2, -44, 3, 2, "z"));
      for (let l of [6.33, 13.67]) n(2, [l, a.y0 + 3.25, -36.9, Math.PI]);
      (s.tower(4, -82),
        s.house(-14, -64, 10, 8, { fl: 2, dmg: 0.3, mat: "plaster" }),
        s.house(18, -70, 9, 8, { fl: 2, dmg: 0.35 }),
        s.house(-18, -82, 8, 7, { fl: 1, dmg: 0.5 }),
        s.house(22, -86, 8, 7, { fl: 1, dmg: 0.45, mat: "plaster" }),
        s.bags(1, -70, 5, 3, "x"),
        s.bags(-6, -80, 3, 3, "z"),
        s.bags(9, -78, 3, 3, "z"),
        s.truck(-4, -90, 1),
        n(3, [-14 + 2.5, 0, -64 + 3.2, Math.PI]));
      for (let [l, u, d, p] of [
        [-26, 54, 0, 1],
        [-32, -2, 0, 1.2],
        [28, 20, 1, 1],
        [33, -6, 0, 1.1],
        [-36, -58, 0, 1.3],
        [38, -44, 0, 1.2],
        [-8, 22, 1, 0.9],
        [22, -74, 0, 1.3],
        [-28, -78, 0, 1.2],
        [40, 8, 0, 1.3],
        [-40, 22, 0, 1.2],
        [18, 52, 0, 1.1],
        [-38, -20, 1, 1],
        [34, 58, 0, 1.2],
        [-20, 62, 0, 1.1],
      ])
        s.tree(l, u, d, p);
      let h = [];
      for (let l = 64; l > -98; l -= 13) h.push([ga(l) + 4.6, l]);
      return (
        s.poles(h),
        e.column(16, Qs(16, -47), -47, { n: 34, H: 42, s: 1.2, fire: 1 }),
        e.column(-18, Qs(-18, -49), -49, { n: 28, H: 34, s: 1, fire: 1 }),
        e.column(32, Qs(32, -92), -92, { n: 44, H: 60, s: 1.5 }),
        e.column(-6, Qs(-6, -98), -98, { n: 30, H: 46, s: 1.3 }),
        e.column(-21, Qs(-21, -13), -13, { n: 16, H: 16, s: 0.6, fire: 1 }),
        e.column(28, Qs(28, 30), 30, { n: 16, H: 18, s: 0.7, fire: 1 }),
        t
      );
    },
  };
  var Bi = [ao, ps],
    Oc = { easy: "F\xE1cil", medium: "Medio", hard: "Dif\xEDcil" };
