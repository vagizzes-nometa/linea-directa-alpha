  var $s = {
      easy: { tk: 20, g: 0.7, rs: 0.6, gap: 10, cap: 9, bonus: 4 },
      medium: { tk: 12, g: 1, rs: 1, gap: 7, cap: 12, bonus: 3 },
      hard: { tk: 7, g: 1.3, rs: 1.4, gap: 5, cap: 15, bonus: 2 },
    },
    Ab = ["Cabo R\xEDos", "Sosa", "Medina", "Ferreyra"],
    Rb = "ABCDEFGHIJ";
  function n0(s) {
    let { E: e, P: t, AI: n, FX: i } = s,
      r = { pts: [], sec: 0, tk: 0, rq: 0, rT: 0, allies: [], done: !1, lost: 0 },
      o = 5;
    function a(l) {
      let u = new ut();
      u.position.set(l.x, t.H(l.x, l.z), l.z);
      let d = new we(new Gt(0.05, 0.06, 5, 8), new Xe({ color: "#2b2f36", roughness: 0.5, metalness: 0.6 }));
      ((d.position.y = 2.5), (d.castShadow = !0), u.add(d));
      let p = new Xe({ color: "#e8e8e8", side: Rt, roughness: 0.8 }),
        g = new we(new wn(1.2, 0.75, 6, 1), p);
      (g.position.set(0.62, 4.4, 0), (g.castShadow = !0), u.add(g));
      let y = new ot({ color: "#e8e8e8", transparent: !0, opacity: 0.55, depthWrite: !1, side: Rt }),
        m = new we(new li(o - 0.15, o, 64), y);
      ((m.rotation.x = -Math.PI / 2), (m.position.y = 0.12), u.add(m));
      let f = new ot({ color: "#e8e8e8", transparent: !0, opacity: 0.15, depthWrite: !1, side: Rt }),
        v = new we(new ss(o - 0.2, 48), f);
      ((v.rotation.x = -Math.PI / 2), (v.position.y = 0.1), u.add(v));
      let x = document.createElement("canvas");
      x.width = x.height = 64;
      let _ = x.getContext("2d");
      ((_.font = "700 46px sans-serif"),
        (_.textAlign = "center"),
        (_.textBaseline = "middle"),
        (_.lineWidth = 7),
        (_.strokeStyle = "#0d1117"),
        _.strokeText(l.L, 32, 35),
        (_.fillStyle = "#fff"),
        _.fillText(l.L, 32, 35));
      let S = new gn(new dn({ map: new rn(x), depthTest: !1, transparent: !0 }));
      return (S.scale.set(1.2, 1.2, 1), (S.position.y = 5.6), (S.renderOrder = 9), u.add(S), e.scene.add(u), { g: u, flag: g, fm: p, rm: y, dm: f, disc: v });
    }
    r.clear = () => {
      for (let l of r.pts) e.scene.remove(l.v.g);
      ((r.pts = []), (r.allies = []));
    };
    let c = () => (s.myTeam === 0 ? 1 : 0);
    ((r.start = () => {
      r.clear();
      let l = s.map,
        u = $s[s.diff];
      ((r.sec = 0), (r.tk = u.tk), (r.done = !1), (r.lost = 0), (r.t0 = s.time), (r.kills = 0), (r.deaths = 0));
      let d = 0;
      (l.sectors.forEach((p, g) =>
        p.pts.forEach((y) => {
          let m = { x: y[0], z: y[1], sec: g, prog: 0, own: !1, a: 0, d: 0, L: Rb[d++], r: o };
          ((m.flow = n.flow([[y[0], y[1]]])), (m.v = a(m)), r.pts.push(m));
        }),
      ),
        (r.spawn = l.start.slice()));
      for (let p = 0; p < 4; p++) {
        let g = n.randomCellNear(l.start[0], l.start[1] - 3, 1.5, 4),
          y = n.spawnBot(s.myTeam, g[0], g[1], { name: Ab[p], prim: p === 2 ? "smg" : p === 3 ? "carbine" : "rifle", hp: 150, yaw: l.start[2] });
        ((y.ally = !0), (y.mode = "go"), r.allies.push(y));
      }
      for (let [p, g, y, m] of l.items || []) s.pickups.add(p, g, y, m);
      r.startSector(0);
    }),
      (r.startSector = (l) => {
        let u = $s[s.diff],
          d = s.map,
          p = d.sectors[l],
          g = r.pts.filter((f) => f.sec === l),
          y = l === d.sectors.length - 1;
        r.sec = l;
        for (let f of s.units)
          if (f.isBot && f.alive && f.team !== s.myTeam && !f.static) {
            let v = g[(Math.random() * g.length) | 0];
            ((f.mode = "go"), (f.goal = v), (f.flow = v.flow), (f.holdAtGoal = !0));
          }
        let m = Math.max(3, Math.round((5 + s.mi * 0.8) * u.g) + (y ? 2 : 0) + (l > 0 ? 1 : 0));
        for (let f = 0; f < m; f++) {
          let v = g[f % g.length],
            x = n.randomCellNear(v.x, v.z, 2.5, 9),
            _ = Math.random() < 0.15 ? "smg" : Math.random() < 0.1 ? "shotgun" : "rifle",
            S = n.spawnBot(c(), x[0], x[1], { prim: _, yaw: Math.PI, post: { x: v.x, z: v.z, r: 8 }, helm: Math.random() < 0.4 ? 100 : 0 });
        }
        for (let f of p.statics || []) {
          let v = n.spawnBot(c(), f[0], f[2], { y: f[1], static: !0, yaw: f[3] ?? Math.PI, prim: Math.random() < 0.3 ? "carbine" : "rifle", dmgMul: 0.8 });
        }
        ((r.rq = Math.round((3 + s.mi * 0.7 + l) * u.rs)),
          (r.rT = u.gap),
          l > 0 && s.hud.big("SECTOR " + (l + 1) + " DE " + d.sectors.length, "Tom\xE1 " + g.map((f) => f.L).join(" y ")));
      }));
    function h() {
      let l = r.pts.filter((p) => p.sec === r.sec),
        u = Math.min(...l.map((p) => p.z)),
        d = s.map.bounds;
      for (let p = 0; p < 60; p++) {
        let g = Math.max(d.z0 + 4, u - 18 - Math.random() * 30),
          y = d.x0 + 6 + Math.random() * (d.x1 - d.x0 - 12);
        if (n.passable(y, g) && !(Math.hypot(y - s.me.pos.x, g - s.me.pos.z) < 25)) return [y, g];
      }
      return null;
    }
    return (
      (r.onPlayerDeath = () => {
        if ((r.deaths++, r.tk <= 0)) {
          r.lost = 2.5;
          return;
        }
        r.tk--;
      }),
      (r.sectorDone = () => {
        let l = $s[s.diff],
          u = s.map;
        if (r.sec >= u.sectors.length - 1) {
          r.win();
          return;
        }
        let d = u.sectors[r.sec].spawn;
        ((r.spawn = [d[0], d[1], d[2] ?? Math.PI]),
          (r.tk += l.bonus),
          s.pickups.add("ammo", d[0] + 1.5, d[1]),
          s.pickups.add("med", d[0] - 1.5, d[1]),
          s.pickups.add("gren", d[0], d[1] + 1.5),
          s.AU.pick(),
          s.hud.toast("Sector asegurado \xB7 +" + l.bonus + " refuerzos \xB7 nueva reaparici\xF3n"),
          r.startSector(r.sec + 1));
      }),
      (r.win = () => {
        ((r.done = !0), s.finish(!0));
      }),
      (r.update = (l, u) => {
        if (r.done) return;
        let d = $s[s.diff],
          p = c(),
          g = s.me;
        if (r.lost > 0) {
          ((r.lost -= l), r.lost <= 0 && ((r.done = !0), s.finish(!1)));
          return;
        }
        for (let f of r.allies) {
          if (f.alive) {
            f.dead = !1;
            continue;
          }
          if (!f.dead) ((f.dead = !0), (f.rsT = 12));
          else if (((f.rsT -= l), f.rsT <= 0)) {
            let v = n.randomCellNear(r.spawn[0], r.spawn[1], 1, 4);
            (f.pos.set(v[0], t.ground(v[0], v[1], 80), v[1]),
              f.vel.set(0, 0, 0),
              (f.hp = 150),
              (f.alive = !0),
              (f.dead = !1),
              (f.target = null),
              f.char.revive(),
              (f.load.reload = 0),
              (f.load.ammo[f.load.prim].mag = dt[f.load.prim].mag));
          }
        }
        for (let f of s.units.slice()) f.isBot && !f.alive && f.team === p && f.char.deadT > 12 && n.removeUnit(f);
        let y = r.pts.filter((f) => f.sec === r.sec && !f.own);
        if (
          ((r.aT = (r.aT || 0) - l),
          r.aT <= 0 &&
            y.length &&
            ((r.aT = 1),
            r.allies.forEach((f, v) => {
              let x = y[v % y.length];
              f.goal !== x && ((f.goal = x), (f.flow = x.flow), (f.mode = "go"));
            })),
          (r.rT -= l),
          r.rq > 0 && r.rT <= 0 && y.length && ((r.rT = d.gap), s.units.filter((v) => v.alive && v.team === p).length < d.cap))
        ) {
          let v = h();
          if (v) {
            let x = y[(Math.random() * y.length) | 0],
              _ = n.spawnBot(p, v[0], v[1], { yaw: 0 });
            ((_.mode = "go"), (_.goal = x), (_.flow = x.flow), (_.holdAtGoal = !0), r.rq--);
          }
        }
        let m = null;
        for (let f of y) {
          let v = 0,
            x = 0,
            _ = t.H(f.x, f.z);
          for (let S of s.units) S.alive && Math.hypot(S.pos.x - f.x, S.pos.z - f.z) < o && S.pos.y - _ < 3 && (S.team === s.myTeam ? v++ : x++);
          ((f.a = v),
            (f.d = x),
            v && !x ? (f.prog = Math.min(1, f.prog + 0.1 * Math.min(3, v) * l)) : !v && x && (f.prog = Math.max(0, f.prog - 0.05 * l)),
            g.alive && Math.hypot(g.pos.x - f.x, g.pos.z - f.z) < o && (m = f),
            f.prog >= 1 && ((f.own = !0), s.AU.pick(), s.hud.toast("Punto " + f.L + " tomado"), m === f && (m = null)));
        }
        if (!(r.pts.filter((f) => f.sec === r.sec).every((f) => f.own) && (r.sectorDone(), r.done))) {
          for (let f of r.pts) {
            let v = f.v;
            if (((v.g.visible = f.sec <= r.sec), !v.g.visible)) continue;
            let x = f.own ? s.TEAMCOL[s.myTeam] : s.TEAMCOL[p];
            (v.fm.color.set(x),
              v.rm.color.set(x),
              v.dm.color.set(s.TEAMCOL[s.myTeam]),
              v.disc.scale.setScalar(Math.max(0.02, f.own ? 1 : f.prog)),
              (v.dm.opacity = f.own ? 0.08 : 0.1 + 0.2 * f.prog),
              (v.flag.position.y = 1.6 + 2.8 * (f.own ? 1 : 1 - f.prog * 0.9)),
              (v.flag.rotation.y = Math.sin(u * 2 + f.x) * 0.25),
              s.map.env === "night" && v.fm.emissive.set(x).multiplyScalar(0.4));
          }
          ((r.inP = m), (r.cur = y));
        }
      }),
      (r.hud = () => {
        let l = s.me,
          u = c(),
          d = r.cur || [],
          p = r.inP,
          g = s.map.sectors.length,
          y = d.slice().sort((v, x) => Math.hypot(v.x - l.pos.x, v.z - l.pos.z) - Math.hypot(x.x - l.pos.x, x.z - l.pos.z))[0],
          m = s.units.filter((v) => v.alive && v.team === u).length,
          f = y ? Math.round(Math.hypot(y.x - l.pos.x, y.z - l.pos.z)) : 0;
        return {
          step: "MISI\xD3N " + (s.mi + 1) + " \xB7 SECTOR " + (r.sec + 1) + " DE " + g,
          title: p
            ? p.d
              ? "Disputando " + p.L + ": sac\xE1 a los enemigos del anillo"
              : "Capturando " + p.L + "\u2026"
            : "Tom\xE1 " + d.map((v) => v.L).join(" y "),
          prog:
            "Refuerzos " +
            Math.max(0, r.tk) +
            " \xB7 Enemigos " +
            m +
            (r.rq ? " (+" + r.rq + ")" : "") +
            " \xB7 Escuadra " +
            r.allies.filter((v) => v.alive).length +
            "/4" +
            (y && y !== p ? " \xB7 a " + f + " m" : ""),
          bar: p ? p.prog : null,
          contested: p && p.d > 0,
          target: y,
        };
      }),
      r
    );
  }
