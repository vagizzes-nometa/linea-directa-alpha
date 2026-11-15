  var io = (s) => document.querySelector(s);
  function Kg(s, e) {
    let { E: t, P: n, AI: i } = s,
      r = { kind: "op", def: e, done: !1, lost: 0, kills: 0, deaths: 0, objs: [], near: null, winT: 0, stones: [], drag: null };
    function o(d) {
      let p = new ut();
      p.position.set(d.x, n.ground(d.x, d.z, 50), d.z);
      let g = new ot({ color: d.type === "extract" ? "#7fd69a" : "#f2c14e", transparent: !0, opacity: 0.55, depthWrite: !1, side: Rt }),
        y = d.r || 1.6,
        m = new we(new li(y - 0.1, y, 48), g);
      if (((m.rotation.x = -Math.PI / 2), (m.position.y = 0.08), p.add(m), d.type === "plant")) {
        let b = new we(new at(0.9, 0.9, 0.9), new Xe({ color: "#5a4a33", roughness: 0.8 }));
        ((b.position.y = 0.45), (b.castShadow = !0), p.add(b));
        let M = b.clone();
        (M.position.set(0.95, 0.45, 0.1), p.add(M));
      }
      let f = document.createElement("canvas");
      f.width = f.height = 64;
      let v = f.getContext("2d");
      ((v.font = "700 40px sans-serif"), (v.textAlign = "center"), (v.textBaseline = "middle"), (v.lineWidth = 6), (v.strokeStyle = "#0d1117"));
      let x = d.type === "extract" ? "\u21EA" : d.label[0];
      (v.strokeText(x, 32, 34), (v.fillStyle = d.type === "extract" ? "#7fd69a" : "#f2c14e"), v.fillText(x, 32, 34));
      let _ = new gn(new dn({ map: new rn(f), depthTest: !1, transparent: !0 }));
      (_.scale.set(0.9, 0.9, 1), (_.position.y = 2.6), (_.renderOrder = 9), p.add(_));
      let S = new we(new yn(0.06, 8, 6), new ot({ color: new pe(5, 0.2, 0.1) }));
      return (S.position.set(0, 1, 0), (S.visible = !1), p.add(S), t.scene.add(p), { g: p, ring: m, sp: _, led: S });
    }
    ((r.start = () => {
      let d = s.map,
        p = e.start,
        g = s.myTeam,
        y = g === 0 ? 1 : 0;
      ((r.t0 = s.time),
        (s.stealth = qg(s, { reinf: e.reinf })),
        (s.squad = Zg(s)),
        e.team.forEach((m, f) => {
          let v = fi(m.prim, m.sec, m.gren, "knife");
          if (((v.charges = m.charges || 0), f === 0)) {
            let x = s.me;
            ((x.load = v),
              (x.name = m.name),
              (x.role = m.role),
              (x.squad = !0),
              (x.stealthMul = m.stealth || 1),
              x.spawn(p[0], p[1], p[2]),
              (x.load.gren = m.gren));
          } else {
            let x = i.randomCellNear(p[0] + (f - 2) * 1.5, p[1] + 2.5, 0, 2),
              _ = i.spawnBot(g, x[0], x[1], { name: m.name, load: v, yaw: p[2], hp: 100 });
            ((_.role = m.role), (_.squad = !0), (_.stealthMul = m.stealth || 1), (_.ally = !0));
          }
        }));
      for (let m of e.enemies) {
        let f = m.y,
          v = i.spawnBot(y, m.x, m.z, {
            y: f,
            static: !!m.static,
            yaw: m.yaw ?? Math.PI,
            prim: m.prim || "rifle",
            post: { x: m.x, z: m.z, r: m.r || 3 },
            helm: m.helm ? 100 : 0,
          });
        (m.path && ((v.mode = "patrol"), (v.path = m.path), (v.pi = 0)),
          (v.baseMode = v.mode),
          (v.sst = "calm"),
          (v.det = 0),
          (v.name = m.name || "Guardia"),
          m.officer && (v.officer = !0));
      }
      r.objs = e.objectives.map((m) => Object.assign({ prog: 0, done: !1 }, m));
      for (let m of r.objs) m.v = o(m);
      for (let [m, f, v] of e.items || []) s.pickups.add(m, f, v);
      s.squad.give("follow");
    }),
      (r.clear = () => {
        for (let d of r.objs) t.scene.remove(d.v.g);
        for (let d of r.stones) t.scene.remove(d.m);
      }));
    let a = () => r.objs.filter((d) => d.type === "plant");
    ((r.update = (d, p) => {
      if (r.done) return;
      let g = s.me,
        y = s.input,
        m = s.stealth;
      if ((m.update(d), r.winT > 0)) {
        ((r.winT -= d), r.winT <= 0 && ((r.done = !0), s.finish(!0)));
        return;
      }
      if (r.lost > 0) {
        ((r.lost -= d), r.lost <= 0 && ((r.done = !0), s.finish(!1)));
        return;
      }
      if ((y.pressed("ofollow") && s.squad.give("follow"), y.pressed("ohold") && s.squad.give("hold"), y.pressed("omove"))) {
        let x = s.squad.aimPoint();
        x ? s.squad.give("move", x) : s.toast("Apunt\xE1 a un lugar del suelo");
      }
      if ((y.pressed("ofire") && s.squad.toggleFire(), r.drag)) {
        let x = r.drag;
        if (!g.alive || y.pressed("use")) ((x.dragged = !1), (r.drag = null), (g.dragging = !1), s.toast("Soltaste el cuerpo"));
        else {
          let _ = g.pos.x + Math.sin(g.yaw) * 1.1,
            S = g.pos.z + Math.cos(g.yaw) * 1.1;
          (x.pos.set(_, n.ground(_, S, g.pos.y + 1), S),
            x.char.root.position.copy(x.pos),
            (x.char.root.rotation.y = g.yaw + Math.PI),
            x.char.gun.position.set(_ + 0.4, x.pos.y + 0.08, S));
        }
      } else if (g.alive && !r.near) {
        let x = null,
          _ = 1.8;
        for (let S of s.units) {
          if (S.team === s.myTeam || S.alive) continue;
          let b = Math.hypot(S.pos.x - g.pos.x, S.pos.z - g.pos.z);
          b < _ && ((_ = b), (x = S));
        }
        ((r.nearBody = x),
          x &&
            y.pressed("use") &&
            ((r.drag = x),
            (x.dragged = !0),
            (x.seenBy = null),
            (g.dragging = !0),
            s.toast("Arrastrando: busc\xE1 un lugar oscuro y soltalo con " + (y.touch ? "USAR" : "E"))));
      }
      let f = (x) => 6 + 18 * x;
      if (y.down("stone") && g.alive)
        if ((g.load.stones ?? (g.load.stones = 4)) > 0) {
          r.sc = Math.min(1, (r.sc || 0) + d / 1.1);
          let x = new C();
          (t.camera.getWorldDirection(x),
            s.FX.arc(
              g.eye().addScaledVector(x, 0.5),
              x
                .clone()
                .multiplyScalar(f(r.sc))
                .add(new C(0, 3, 0)),
              18,
            ),
            s.hud.charge(r.sc));
        } else y.pressed("stone") && s.toast("No te quedan piedras");
      else if (r.sc > 0) {
        if (g.alive && g.load.stones > 0) {
          g.load.stones--;
          let x = new C();
          t.camera.getWorldDirection(x);
          let _ = g.eye().addScaledVector(x, 0.5),
            S = new we(new os(0.06, 0), new Xe({ color: "#6b6660" }));
          (S.position.copy(_), t.scene.add(S), r.stones.push({ m: S, v: x.multiplyScalar(f(r.sc)).add(new C(0, 3, 0)), t: 0, hit: !1 }), s.AU.click());
        }
        ((r.sc = 0), s.FX.arcHide(), s.hud.charge(0));
      }
      for (let x = r.stones.length - 1; x >= 0; x--) {
        let _ = r.stones[x];
        if (((_.t += d), !_.hit)) {
          _.v.y -= 18 * d;
          let S = _.v.clone().multiplyScalar(d),
            b = S.length(),
            M = S.clone().normalize(),
            A = n.ray(_.m.position.x, _.m.position.y, _.m.position.z, M.x, M.y, M.z, b + 0.05);
          A ? ((_.hit = !0), _.m.position.set(A.x, A.y + 0.05, A.z), s.AU.impact(_.m.position), m.noise(A.x, A.z, 13, "distract")) : _.m.position.add(S);
        }
        _.t > 6 && (t.scene.remove(_.m), r.stones.splice(x, 1));
      }
      (g.alive &&
        g.sprinting &&
        ((r.stepT = (r.stepT || 0) - d), r.stepT <= 0 && ((r.stepT = 0.45), m.noise(g.pos.x, g.pos.z, 9 * (g.stealthMul || 1), "step"))),
        (r.near = null));
      let v = a().every((x) => x.done);
      for (let x of r.objs) {
        if (((x.v.g.visible = x.type !== "extract" || v), (x.v.ring.material.opacity = 0.4 + 0.25 * Math.sin(p * 4)), x.done)) {
          x.v.led.visible = Math.sin(p * 10) > 0;
          continue;
        }
        if (!g.alive) continue;
        let _ = Math.hypot(g.pos.x - x.x, g.pos.z - x.z);
        (x.type === "plant" &&
          _ < (x.r || 1.6) + 0.6 &&
          ((r.near = x),
          g.load.charges > 0 && y.down("use")
            ? ((x.prog = Math.min(1, x.prog + d / 3)),
              x.prog >= 1 &&
                ((x.done = !0),
                g.load.charges--,
                s.AU.pick(),
                s.toast("Carga colocada en " + x.label),
                a().every((S) => S.done) && s.hud.big("CARGAS LISTAS", "Volv\xE9 a la extracci\xF3n para detonar")))
            : (x.prog = Math.max(0, x.prog - d * 0.5))),
          x.type === "extract" && v && _ < x.r && r.extract());
      }
      (u(), !s.squad.members().some((x) => x.alive) && r.lost <= 0 && (r.lost = 2));
    }),
      (r.extract = () => {
        ((r.winT = 4), s.hud.big("\xA1DETONACI\xD3N!", "Misi\xF3n cumplida"));
        let d = 0;
        for (let p of a()) (setTimeout(() => s.combat.explode(new C(p.x, n.H(p.x, p.z) + 0.5, p.z), null, 1.8), 300 + d * 700), d++);
      }),
      (r.deathTick = (d) => {
        if (s.me.alive) {
          io("#dead").hidden = !0;
          return;
        }
        ((r.dT = (r.dT || 0) + d), (io("#dead").hidden = !1));
        let g = s.squad.bots().filter((y) => y.alive).length;
        ((io("#dead b").textContent = g ? "Ca\xEDste" : "Cay\xF3 todo el equipo"),
          (io("#dead span").textContent = g ? "Pas\xE1s a otro integrante\u2026" : ""),
          r.dT > 2 && g && ((r.dT = 0), s.squad.next(), (io("#dead").hidden = !0)));
      }),
      (r.onKill = (d, p, g) => {
        (p === s.me && d.team !== s.myTeam && (r.kills++, s.hud.points(g ? "CABEZA" : "BAJA", g ? "head" : "")), d === s.me && (r.deaths++, (r.dT = 0)));
      }),
      (r.hud = () => {
        let d = s.me,
          p = s.stealth,
          g = a(),
          y = g.filter((_) => _.done).length,
          m = s.squad.members().filter((_) => _.alive).length,
          f,
          v = null;
        r.near && !r.near.done
          ? d.load.charges > 0
            ? ((f = (s.input.touch ? "Manten\xE9 USAR" : "Manten\xE9 E") + " para poner la carga"), (v = r.near.prog))
            : (f = "No ten\xE9s cargas: pausa y pas\xE1 al Zapador o al Asalto")
          : r.drag
            ? (f = "Arrastrando un cuerpo \xB7 " + (s.input.touch ? "USAR" : "E") + " para soltarlo")
            : r.nearBody
              ? (f = (s.input.touch ? "USAR" : "E") + " para arrastrar el cuerpo")
              : (f = y < g.length ? "Pon\xE9 cargas en los hangares (" + y + "/" + g.length + ")" : "Volv\xE9 a la extracci\xF3n");
        let x = s.units.some((_) => _.team !== s.myTeam && _.alive && _.sst === "sus");
        return {
          step: "OPERACI\xD3N \xB7 " + e.name.toUpperCase(),
          title: f,
          prog:
            (p.alarm ? "\u26A0 ALARMA" : x ? "Sospechan" : "Sin detectar") +
            " \xB7 Equipo " +
            m +
            "/" +
            e.team.length +
            " \xB7 " +
            _f[s.squad.order] +
            " \xB7 " +
            (p.weaponsFree ? "Fuego libre" : "No disparen") +
            " \xB7 Cargas " +
            d.load.charges +
            " \xB7 Piedras " +
            (d.load.stones ?? 4),
          bar: v,
          contested: !1,
          alarm: p.alarm,
        };
      }));
    let c = 0,
      h = new Set();
    r.marks = (d) => {
      if (((c -= 1 / 30), c <= 0)) {
        ((c = 0.3), h.clear());
        let m = s.squad.members().filter((f) => f.alive);
        for (let f of s.units)
          if (!(f.team === s.myTeam || !f.alive)) {
            for (let v of m)
              if (Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 55 && n.los(i.eye(v), i.eye(f))) {
                h.add(f);
                break;
              }
          }
      }
      let p = [],
        g = [];
      for (let m of s.units)
        !m.alive ||
          m === d ||
          (m.team === s.myTeam
            ? p.push({ x: m.pos.x, z: m.pos.z, c: "#4da3ff" })
            : (h.has(m) || (s.stealth.alarm && m.target)) &&
              p.push({
                x: m.pos.x,
                z: m.pos.z,
                c: m.sst === "alert" ? "#ff4636" : m.sst === "sus" ? "#f2c14e" : "#e0e0e0",
                cone: m.sst === "alert" ? 18 : 12,
                fov: ((m.sst === "alert" ? 85 : 55) * Math.PI) / 180,
                yaw: m.yaw,
                cc: m.sst === "alert" ? "rgba(255,70,54,.22)" : m.sst === "sus" ? "rgba(242,193,78,.22)" : "rgba(255,255,255,.12)",
              }));
      let y = a().every((m) => m.done);
      for (let m of r.objs) {
        if ((m.done && m.type === "plant") || (m.type === "extract" && !y)) continue;
        let f = m.type === "extract" ? "#7fd69a" : "#f2c14e",
          v = m.type === "extract" ? "X" : m.label[0];
        (p.push({ x: m.x, z: m.z, t: v, c: f }), g.push({ a: -Math.atan2(-(m.x - d.pos.x), -(m.z - d.pos.z)), t: v, c: f }));
      }
      return { R: p, C: g };
    };
    let l = [];
    function u() {
      let d = io("#emarks");
      if (!d) return;
      let p = t.camera,
        g = innerWidth,
        y = innerHeight,
        m = 0;
      for (let f of s.units) {
        if (f.team === s.myTeam || !f.alive || !(f.det > 0.05 || f.sst === "alert")) continue;
        let v = f.pos.clone().setY(f.pos.y + 2.2);
        if (v.distanceTo(p.position) > 70 || (v.project(p), v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05)) continue;
        let x = l[m];
        (x || ((x = document.createElement("i")), d.appendChild(x), l.push(x)),
          m++,
          (x.style.display = "block"),
          (x.style.left = ((v.x + 1) / 2) * g + "px"),
          (x.style.top = ((1 - v.y) / 2) * y + "px"));
        let _ = f.sst === "alert";
        ((x.textContent = _ ? "!" : "?"), (x.className = _ ? "a" : "s"), x.style.setProperty("--f", Math.min(1, f.det).toFixed(2)));
      }
      for (; m < l.length; m++) l[m].style.display = "none";
    }
    return r;
  }
