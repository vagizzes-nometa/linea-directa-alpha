  var dt = {
      rifle: {
        name: "Fusil",
        slot: 0,
        dmg: 26,
        head: 2,
        rate: 0.1,
        auto: !0,
        mag: 30,
        res: 90,
        reload: 2.2,
        hip: 0.012,
        move: 0.035,
        ads: 0.002,
        recoil: 0.011,
        zoom: 55,
        pellets: 1,
        speed: 1,
      },
      smg: {
        name: "Subfusil",
        slot: 0,
        dmg: 19,
        head: 1.8,
        rate: 0.068,
        auto: !0,
        mag: 35,
        res: 140,
        reload: 1.8,
        hip: 0.02,
        move: 0.028,
        ads: 0.009,
        recoil: 0.007,
        zoom: 62,
        pellets: 1,
        speed: 1.06,
      },
      shotgun: {
        name: "Escopeta",
        slot: 0,
        dmg: 13,
        head: 1.5,
        rate: 0.85,
        auto: !1,
        mag: 6,
        res: 30,
        reload: 2.5,
        hip: 0.075,
        move: 0.02,
        ads: 0.055,
        recoil: 0.05,
        zoom: 62,
        pellets: 9,
        speed: 1,
      },
      carbine: {
        name: "Carabina",
        slot: 0,
        dmg: 55,
        head: 2,
        rate: 0.75,
        auto: !1,
        mag: 8,
        res: 24,
        reload: 2.4,
        hip: 0.03,
        move: 0.045,
        ads: 0.002,
        recoil: 0.035,
        zoom: 50,
        pellets: 1,
        speed: 1,
        manual: !0,
      },
      sniper: {
        name: "Francotirador",
        slot: 0,
        dmg: 95,
        head: 2,
        rate: 1.3,
        auto: !1,
        mag: 5,
        res: 20,
        reload: 2.8,
        hip: 0.07,
        move: 0.06,
        ads: 0,
        recoil: 0.06,
        zoom: 20,
        pellets: 1,
        speed: 0.9,
        scope: !0,
      },
      pistol: {
        name: "Pistola",
        slot: 1,
        dmg: 24,
        head: 2,
        rate: 0.15,
        auto: !1,
        mag: 12,
        res: 48,
        reload: 1.4,
        hip: 0.01,
        move: 0.02,
        ads: 0.004,
        recoil: 0.012,
        zoom: 62,
        pellets: 1,
        speed: 1.08,
      },
      revolver: {
        name: "Rev\xF3lver",
        slot: 1,
        dmg: 48,
        head: 2,
        rate: 0.45,
        auto: !1,
        mag: 6,
        res: 30,
        reload: 2.2,
        hip: 0.008,
        move: 0.025,
        ads: 0.002,
        recoil: 0.035,
        zoom: 58,
        pellets: 1,
        speed: 1.08,
      },
      spistol: {
        name: "Pistola con silenciador",
        model: "pistol",
        slot: 1,
        dmg: 34,
        head: 3,
        rate: 0.28,
        auto: !1,
        mag: 10,
        res: 40,
        reload: 1.6,
        hip: 0.012,
        move: 0.02,
        ads: 0.003,
        recoil: 0.01,
        zoom: 60,
        pellets: 1,
        speed: 1.08,
        silent: !0,
      },
      shovel: { name: "Pala", slot: 2, dmg: 55, rate: 0.55, melee: !0, range: 2.6, speed: 1.15 },
      knife: { name: "Cuchillo", slot: 2, dmg: 60, rate: 0.45, melee: !0, range: 2.2, speed: 1.2, silent: !0 },
      grenade: { name: "Granada", slot: 3, rate: 0.9, throw: !0, speed: 1.05 },
    },
    yf = ["rifle", "smg", "shotgun", "carbine", "sniper"],
    Gg = ["pistol", "revolver", "spistol"],
    $n = (s) => (s && dt[s] && dt[s].model) || s,
    vf = (s) => {
      let e = dt[s];
      return e ? (e.silent ? (e.melee ? 0 : 6) : s === "sniper" || s === "carbine" || s === "shotgun" ? 75 : 55) : 0;
    };
  function fi(s = "rifle", e = "pistol", t = 2, n = "shovel") {
    let i = { prim: s, sec: e, gren: t, melee: n, charges: 0, slot: 0, last: 1, ammo: {}, cd: 0, reload: 0, bolt: 0 };
    for (let r of [s, e]) r && (i.ammo[r] = { mag: dt[r].mag, res: dt[r].res });
    return ((i.cur = () => (i.slot === 0 ? i.prim : i.slot === 1 ? i.sec : i.slot === 2 ? i.melee || "shovel" : "grenade")), i);
  }
  function Xg(s) {
    let { P: e, FX: t, AU: n } = s,
      i = () => new C(),
      r = {};
    ((r.damage = (h, l, u, d, p) => {
      if (!h.alive || h.god) return !1;
      if (h.remote) return (s.netHit && s.netHit(h, l, u, p), h.char && h.char.hitFlash(), !1);
      if (u && h.helm > 0) {
        let g = l * 0.5;
        ((h.helm = Math.max(0, h.helm - g)), (l -= g));
      } else if (!u && h.vest > 0) {
        let g = l * 0.35;
        ((h.vest = Math.max(0, h.vest - g)), (l -= g));
      }
      return (
        (h.hp -= l),
        (h.lastHit = s.time),
        h.char && h.char.hitFlash(),
        h.onHurt && h.onHurt(l, d),
        h.hp <= 0
          ? ((h.hp = 0),
            (h.alive = !1),
            h.char && h.char.die(d ? Math.sign(h.pos.z - d.pos.z || 1) * (Math.random() < 0.5 ? 1 : -1) : 1),
            s.onKill && s.onKill(h, d, u, p),
            !0)
          : !1
      );
    }),
      (r.fire = (h, l, u, d, p, g) => {
        let y = dt[d],
          m = null,
          f = y.pellets || 1;
        for (let v = 0; v < f; v++) {
          let x = u.clone();
          p > 0 && ((x.x += (Math.random() - 0.5) * 2 * p), (x.y += (Math.random() - 0.5) * 2 * p), (x.z += (Math.random() - 0.5) * 2 * p), x.normalize());
          let _ = 300,
            S = e.ray(l.x, l.y, l.z, x.x, x.y, x.z, _),
            b = S ? S.t : _,
            M = null,
            A = !1;
          for (let w of s.units) {
            if (w === h || !w.alive || w.team === h.team) continue;
            let P = w.pos.x - l.x,
              N = w.pos.z - l.z;
            if (P * x.x + N * x.z < -1 || P * P + N * N > b * b + 9) continue;
            let z = w.char.hitRay(l, x, b);
            z && z.t < b && ((b = z.t), (M = w), (A = z.head));
          }
          let E = l.clone().addScaledVector(x, Math.min(b, _));
          if ((v === 0 && (h.lastEnd = E), (v === 0 || Math.random() < 0.3) && t.tracer(g || l, E, h.team === s.myTeam ? 0 : 1), M)) {
            let w = b > 45 ? 0.8 : 1,
              P = y.dmg * (A ? y.head : 1) * w * (h.dmgMul || 1);
            (r.damage(M, P, A, h, d), t.puff(E, [-x.x, -x.y, -x.z], "blood"), (m = m || { u: M, head: A, kill: !M.alive }));
          } else S && (t.puff(E, S.n, S.box && S.box.tag === "hog" ? "metal" : "dust"), v === 0 && Math.random() < 0.5 && n.impact(E));
        }
        return (
          n.shot(y.silent ? "silent" : d, l, h.isPlayer),
          y.silent || t.muzzle(g || l, u, d === "shotgun" || d === "sniper"),
          (h.shotT = s.time),
          s.onNoise && s.onNoise(h, l, vf(d), d),
          m
        );
      }),
      (r.melee = (h, l, u = "shovel") => {
        let d = dt[u],
          p = -Math.sin(l),
          g = -Math.cos(l),
          y = null,
          m = 9;
        for (let f of s.units) {
          if (f === h || !f.alive || f.team === h.team) continue;
          let v = f.pos.x - h.pos.x,
            x = f.pos.z - h.pos.z,
            _ = Math.hypot(v, x);
          _ > d.range || Math.abs(f.pos.y - h.pos.y) > 1.4 || (v * p + x * g) / Math.max(_, 0.01) < 0.45 || (_ < m && ((m = _), (y = f)));
        }
        if (y) {
          let f = -Math.sin(y.yaw),
            v = -Math.cos(y.yaw),
            x = p * f + g * v > 0.35 && y.sst !== "alert" && !y.remote && !y.zombie;
          h.swingT = s.time;
          let _ = x || Math.random() < 0.25;
          return (
            r.damage(y, x ? 999 : d.dmg * (_ ? 1.6 : 1), _, h, u),
            t.puff(y.pos.clone().setY(y.pos.y + 1.2), [0, 1, 0], "blood"),
            d.silent || n.impact(y.pos),
            d.silent || (s.onNoise && s.onNoise(h, y.pos, 8, u)),
            { u: y, head: _, kill: !y.alive, takedown: x }
          );
        }
        return null;
      }));
    let o = [],
      a = new ai(0.06, 1),
      c = new Xe({ color: "#4f6b34", roughness: 0.6 });
    return (
      (r.throwNade = (h, l, u, d = 17, p = {}) => {
        let g = new we(a, c);
        ((g.castShadow = !0), g.position.copy(l), s.E.scene.add(g));
        let y = p.v
          ? p.v.clone()
          : u
              .clone()
              .multiplyScalar(d)
              .add(i().set(0, 3.2, 0));
        (o.push({ sh: h, m: g, v: y, t: 2.6, visual: !!p.visual }), p.visual || ((h.nadeT = s.time), (h.lastNade = { o: l.clone(), v: y.clone() })));
      }),
      (r.update = (h) => {
        for (let l = o.length - 1; l >= 0; l--) {
          let u = o[l];
          ((u.t -= h), (u.v.y -= 18 * h));
          let d = u.m.position,
            p = u.v.clone().multiplyScalar(h),
            g = p.length();
          if (g > 0) {
            let y = p.clone().normalize(),
              m = e.ray(d.x, d.y, d.z, y.x, y.y, y.z, g + 0.06);
            if (m) {
              d.set(m.x - y.x * 0.06, m.y - y.y * 0.06, m.z - y.z * 0.06);
              let f = i().fromArray(m.n);
              (u.v.reflect(f).multiplyScalar(0.42), n.click());
            } else d.add(p);
          }
          ((u.m.rotation.x += h * 8), u.t <= 0 && (s.E.scene.remove(u.m), o.splice(l, 1), r.explode(d.clone(), u.sh, 1, u.visual)));
        }
      }),
      (r.explode = (h, l, u = 1, d) => {
        if ((t.explode(h.x, h.y, h.z, u), n.boom(h, u), s.onExplosion && s.onExplosion(h, u), d)) return;
        let p = 7 * u;
        for (let g of s.units) {
          if (!g.alive) continue;
          let y = g.pos.clone().setY(g.pos.y + 1),
            m = y.distanceTo(h);
          m > p || (e.los(h.clone().setY(h.y + 0.3), y) && ((l && g.team === l.team && g !== l) || r.damage(g, 130 * u * (1 - m / p) + 10, !1, l, "grenade")));
        }
      }),
      (r.clear = () => {
        for (let h of o) s.E.scene.remove(h.m);
        o.length = 0;
      }),
      r
    );
  }
