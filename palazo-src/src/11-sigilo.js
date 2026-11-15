  var vb = Math.PI / 180;
  function qg(s, e = {}) {
    let { P: t, AI: n } = s,
      i = { alarm: !1, alarmT: 0, weaponsFree: !1, reinf: 0, reinfT: 0, events: [], known: new Set() },
      r = { easy: 0.65, medium: 1, hard: 1.35 }[s.diff] || 1,
      o = () => (s.K && s.K.lamps) || [];
    ((i.light = (l, u) => {
      if (!s.E.night) return 1;
      let d = 0.38;
      for (let p of o()) {
        let g = Math.hypot(p[0] - l, p[2] - u);
        g < 8 && (d = Math.max(d, 1 - (g / 8) * 0.55));
      }
      return d;
    }),
      (i.visibility = (l) => {
        let u = l.spd || 0,
          p = (l.crouchK || 0) > 0.5 ? (u > 0.5 ? 0.6 : 0.42) : u > 4 ? 1.35 : u > 2.5 ? 1.12 : u > 0.5 ? 0.85 : 0.7;
        return ((p *= i.light(l.pos.x, l.pos.z) * (l.stealthMul || 1)), l.shotT && s.time - l.shotT < 0.4 && !a(l) && (p = Math.max(p, 1.2)), p);
      }));
    let a = (l) => l.load && l.load.cur && /spistol|knife/.test(l.load.cur()),
      c = n.eye;
    ((i.perceive = (l, u) => {
      l.sst === void 0 && ((l.sst = i.alarm ? "alert" : "calm"), (l.det = 0), (l.baseMode = l.mode));
      let d = ((l.sst === "alert" ? 170 : l.sst === "sus" ? 130 : 110) * vb) / 2,
        p = l.sst === "alert" ? 70 : 42,
        g = null,
        y = 0,
        m = -Math.sin(l.yaw),
        f = -Math.cos(l.yaw),
        v = c(l);
      for (let x of s.units) {
        if (x.team === l.team || !x.alive) continue;
        let _ = x.pos.x - l.pos.x,
          S = x.pos.z - l.pos.z,
          b = Math.hypot(_, S);
        if (b > p) continue;
        let M = Math.acos(Math.max(-1, Math.min(1, (_ * m + S * f) / Math.max(b, 0.01)))),
          A = b < 2.2;
        if (M > d && !A) continue;
        let E = x.pos.clone().setY(x.pos.y + (x.crouchK > 0.5 ? 0.85 : 1.35));
        if (!t.los(v, E)) continue;
        let w = i.visibility(x) * (1 - b / p) * (M > d * 0.6 ? 0.6 : 1);
        (A && (w = Math.max(w, 0.9)), w > y && ((y = w), (g = x)));
      }
      if (
        (g
          ? ((l.det = Math.min(1.2, l.det + Math.max(0, y - 0.06) * 3.2 * u * r * (l.sst === "sus" ? 1.4 : 1))),
            (l.lastSeen = [g.pos.x, g.pos.z]),
            (l.watch = g))
          : ((l.det = Math.max(0, l.det - (l.sst === "alert" ? 0.05 : 0.22) * u)), (l.watch = null)),
        l.sst === "calm" && l.det >= 0.35 && l.lastSeen && !l.static
          ? ((l.sst = "sus"), (l.mode = "inv"), (l.invest = l.lastSeen.slice()), (l.invT = 0), (l.lookAt = l.lastSeen.slice()))
          : l.sst === "calm" && l.det >= 0.35 && l.lastSeen && ((l.sst = "sus"), (l.lookAt = l.lastSeen.slice())),
        l.sst === "sus" && l.static && l.det < 0.15 && (l.sst = "calm"),
        l.sst !== "alert" && l.det >= 1 && i.spotted(l, g),
        l.sst === "alert")
      ) {
        if (g) return g;
        !l.target && l.lastSeen && l.mode !== "hunt" && !l.static && i.hunt(l, l.lastSeen);
      }
      return null;
    }),
      (i.spotted = (l, u) => {
        ((l.sst = "alert"), (l.det = 1.2), (l.alarmT = i.alarm ? 0 : 2.5), i.events.push({ t: "spot", u: l }));
        for (let d of s.units)
          d.team === l.team &&
            d.alive &&
            d !== l &&
            Math.hypot(d.pos.x - l.pos.x, d.pos.z - l.pos.z) < 22 &&
            ((d.sst = "alert"), (d.det = 1), u && (d.lastSeen = [u.pos.x, u.pos.z]));
      }),
      (i.hunt = (l, u) => {
        ((l.mode = "hunt"), (l.hunt = u.slice()), (l.huntT = 0));
        let d = Math.round(u[0] / 3) + "," + Math.round(u[1] / 3);
        ((i._fc = i._fc || {}), (l.huntF = i._fc[d] || (i._fc[d] = n.flow([u]))));
      }),
      (i.noise = (l, u, d, p) => {
        if (!(d <= 0)) {
          for (let g of s.units) {
            if (g.team === s.myTeam || !g.alive || (g.static && p !== "boom")) continue;
            let y = Math.hypot(g.pos.x - l, g.pos.z - u);
            y > d ||
              (g.sst === void 0 && ((g.sst = "calm"), (g.det = 0), (g.baseMode = g.mode)),
              p === "boom" || (p === "shot" && y < d * 0.45)
                ? (g.sst !== "alert" && ((g.sst = "alert"), (g.det = 1), (g.alarmT = i.alarm ? 0 : 3)),
                  (g.lastSeen = [l, u]),
                  !g.target && !g.static && i.hunt(g, [l, u]))
                : g.sst === "calm" &&
                  ((g.sst = "sus"), (g.det = Math.max(g.det, 0.4)), (g.mode = "inv"), (g.invest = [l, u]), (g.invT = 0), (g.lookAt = [l, u])));
          }
          p === "boom" && i.raise("explosi\xF3n");
        }
      }),
      (i.raise = (l) => {
        if (!i.alarm) {
          ((i.alarm = !0), (i.alarmT = 0), (i.why = l), s.AU.siren && s.AU.siren(), s.hud.big("\xA1ALARMA!", "Te descubrieron: el enemigo pide refuerzos"));
          for (let u of s.units)
            u.team !== s.myTeam && u.alive && ((u.sst = "alert"), (u.det = 1), !u.static && !u.target && u.lastSeen && i.hunt(u, u.lastSeen));
        }
      }),
      (i.canFire = (l) => i.weaponsFree || i.alarm || (l.lastHit && s.time - l.lastHit < 6) || (l.target && l.target.alive && l.target.sst === "alert")));
    let h = 0;
    return (
      (i.update = (l) => {
        h -= l;
        for (let u of s.units)
          u.team === s.myTeam ||
            !u.alive ||
            (u.alarmT > 0 && ((u.alarmT -= l), u.alarmT <= 0 && u.alive && i.raise("los vieron")),
            u.sst === "sus" &&
              u.invest &&
              u.foundBody &&
              Math.hypot(u.invest[0] - u.pos.x, u.invest[1] - u.pos.z) < 3 &&
              ((u.foundBody.found = !0), (u.foundBody = null), i.raise("encontraron un cuerpo")));
        if (h <= 0) {
          h = 0.6;
          for (let u of s.units) {
            if (u.team === s.myTeam || !u.alive || u.sst === "alert" || u.static) continue;
            let d = -Math.sin(u.yaw),
              p = -Math.cos(u.yaw);
            for (let g of s.units) {
              if (g.team !== u.team || g.alive || g.found || g.seenBy || g.dragged) continue;
              let y = g.pos.x - u.pos.x,
                m = g.pos.z - u.pos.z,
                f = Math.hypot(y, m);
              if (!(f > 5 + 13 * i.light(g.pos.x, g.pos.z) || (y * d + m * p) / Math.max(f, 0.01) < 0.3) && t.los(c(u), g.pos.clone().setY(g.pos.y + 0.4))) {
                ((g.seenBy = u),
                  (u.sst = "sus"),
                  (u.det = Math.max(u.det, 0.6)),
                  (u.mode = "inv"),
                  (u.invest = [g.pos.x, g.pos.z]),
                  (u.invT = 0),
                  (u.foundBody = g),
                  (u.lookAt = [g.pos.x, g.pos.z]));
                break;
              }
            }
          }
        }
        if (i.alarm && e.reinf && ((i.alarmT += l), (i.reinfT -= l), i.reinfT <= 0 && i.reinf < e.reinf.max)) {
          i.reinfT = e.reinf.gap;
          let [u, d] = e.reinf.at[i.reinf % e.reinf.at.length],
            p = s.me,
            g = n.spawnBot(s.myTeam === 0 ? 1 : 0, u, d, { prim: "rifle", yaw: 0 });
          ((g.sst = "alert"), (g.det = 1), i.hunt(g, [p.pos.x, p.pos.z]), i.reinf++);
        }
      }),
      i
    );
  }
