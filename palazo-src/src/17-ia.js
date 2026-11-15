  var Sf = {
    easy: { react: 0.75, err: 0.075, range: 48, dmg: 0.55, turn: 3 },
    medium: { react: 0.45, err: 0.045, range: 62, dmg: 0.8, turn: 5 },
    hard: { react: 0.28, err: 0.028, range: 78, dmg: 1, turn: 8 },
  };
  function Qg(s) {
    let { P: e } = s,
      t = {},
      n = null;
    ((t.buildNav = (a) => {
      let c = Math.floor(a.x0),
        h = Math.floor(a.z0),
        l = Math.ceil(a.x1 - a.x0),
        u = Math.ceil(a.z1 - a.z0),
        d = new Uint8Array(l * u);
      for (let p = 0; p < u; p++)
        for (let g = 0; g < l; g++) {
          let y = c + g + 0.5,
            m = h + p + 0.5,
            f = e.H(y, m),
            v = Math.abs(e.H(y + 0.5, m) - e.H(y - 0.5, m)) + Math.abs(e.H(y, m + 0.5) - e.H(y, m - 0.5));
          d[p * l + g] = v < 0.9 && !e.blocked(y, m, f + 0.35, f + 1.6, 0.32) ? 1 : 0;
        }
      n = { x0: c, z0: h, W: l, D: u, pass: d };
    }),
      (t.cell = (a, c) => {
        let h = Math.floor(a - n.x0),
          l = Math.floor(c - n.z0);
        return h < 0 || l < 0 || h >= n.W || l >= n.D ? -1 : l * n.W + h;
      }),
      (t.passable = (a, c) => {
        let h = t.cell(a, c);
        return h >= 0 && n.pass[h] === 1;
      }),
      (t.flow = (a) => {
        let { W: c, D: h, pass: l } = n,
          u = new Float32Array(c * h).fill(1e9),
          d = new Int32Array(c * h),
          p = 0,
          g = 0;
        for (let [m, f] of a) {
          let v = t.cell(m, f);
          v >= 0 && ((u[v] = 0), (d[g++] = v));
        }
        let y = [
          [1, 0, 1],
          [-1, 0, 1],
          [0, 1, 1],
          [0, -1, 1],
          [1, 1, 1.414],
          [1, -1, 1.414],
          [-1, 1, 1.414],
          [-1, -1, 1.414],
        ];
        for (; p < g;) {
          let m = d[p++],
            f = m % c,
            v = (m / c) | 0;
          for (let [x, _, S] of y) {
            let b = f + x,
              M = v + _;
            if (b < 0 || M < 0 || b >= c || M >= h) continue;
            let A = M * c + b;
            if (!l[A] || (x && _ && (!l[v * c + b] || !l[M * c + f]))) continue;
            let E = u[m] + S;
            E < u[A] - 1e-4 && ((u[A] = E), (d[g++] = A), g >= d.length && (g = d.length - 1));
          }
        }
        return u;
      }));
    let i = new Map();
    ((t.flowTo = (a, c) => {
      let h = Math.round(a / 2) + "," + Math.round(c / 2),
        l = i.get(h);
      return (l || (i.size > 220 && i.clear(), (l = t.flow([[a, c]])), i.set(h, l)), l);
    }),
      (t.flowDir = (a, c, h) => {
        let l = t.cell(a, c);
        if (l < 0) return null;
        let { W: u, D: d } = n,
          p = l % u,
          g = (l / u) | 0,
          y = h[l],
          m = 0,
          f = 0;
        for (let x = -1; x <= 1; x++)
          for (let _ = -1; _ <= 1; _++) {
            if (!_ && !x) continue;
            let S = p + _,
              b = g + x;
            if (S < 0 || b < 0 || S >= u || b >= d) continue;
            let M = h[b * u + S];
            M < y && ((y = M), (m = _), (f = x));
          }
        if (!m && !f) return null;
        let v = Math.hypot(m, f);
        return [m / v, f / v];
      }),
      (t.randomCellNear = (a, c, h, l) => {
        for (let u = 0; u < 80; u++) {
          let d = Math.random() * 6.283,
            p = h + Math.random() * (l - h),
            g = a + Math.cos(d) * p,
            y = c + Math.sin(d) * p;
          if (t.passable(g, y) && t.passable(g + 0.4, y) && t.passable(g, y + 0.4)) return [g, y];
        }
        return [a, c];
      }),
      (t.spawnBot = (a, c, h, l = {}) => {
        let u = gs(s.E, { team: a }),
          d = l.load || fi(l.prim || "rifle", null, 0),
          p = l.y !== void 0 ? l.y : e.ground(c, h, 60),
          g = {
            id: "b" + Math.random().toString(36).slice(2, 7),
            team: a,
            name: l.name || "",
            pos: new C(c, p, h),
            vel: new C(),
            yaw: l.yaw || 0,
            pitch: 0,
            hp: l.hp || 100,
            helm: l.helm || 0,
            vest: l.vest || 0,
            alive: !0,
            char: u,
            load: d,
            isBot: !0,
            mode: l.mode || "guard",
            post: l.post || { x: c, z: h, r: 7 },
            goal: null,
            flow: null,
            target: null,
            seeT: 0,
            lastSeen: null,
            reactT: 0,
            fireCd: 0.5,
            burst: 0,
            thinkT: Math.random() * 0.2,
            strafe: Math.random() * 6,
            wander: null,
            waitT: 0,
            stuck: 0,
            crouch: 0,
            static: !!l.static,
            dmgMul: Sf[s.diff].dmg * (l.dmgMul || 1),
            walk: 0,
          };
        return (u.setWeapon($n(d.prim)), u.root.position.copy(g.pos), s.units.push(g), g);
      }),
      (t.removeUnit = (a) => {
        a.char.dispose();
        let c = s.units.indexOf(a);
        c >= 0 && s.units.splice(c, 1);
      }));
    let r = (a) => a.pos.clone().setY(a.pos.y + (a.crouch > 0.5 ? 1.05 : 1.55));
    t.eye = r;
    function o(a, c) {
      let h = Sf[s.diff],
        l = null,
        u = h.range;
      for (let d of s.units) {
        if (d.team === a.team || !d.alive) continue;
        let p = d.pos.x - a.pos.x,
          g = d.pos.z - a.pos.z,
          y = Math.hypot(p, g);
        if (y > u) continue;
        let m = -Math.sin(a.yaw),
          f = -Math.cos(a.yaw);
        if ((p * m + g * f) / Math.max(y, 0.01) < -0.25 && y > 6 && !(a.alertT > 0)) continue;
        let v = r(a),
          x = d.pos.clone().setY(d.pos.y + (d.crouchK > 0.5 ? 0.9 : 1.3));
        e.los(v, x) && ((u = y), (l = d));
      }
      return l;
    }
    return (
      (t.alert = (a, c, h) => {
        for (let l of s.units) l.isBot && l.alive && Math.hypot(l.pos.x - a, l.pos.z - c) < h && ((l.alertT = 3), l.target || (l.lookAt = [a, c]));
      }),
      (t.update = (a, c) => {
        let h = Sf[s.diff];
        for (let l of s.units) {
          if (!l.isBot) continue;
          let u = l.char;
          if (!l.alive) {
            u.update(a, {});
            continue;
          }
          if (((l.alertT = (l.alertT || 0) - a), (l.thinkT -= a), l.thinkT <= 0)) {
            l.thinkT = 0.2;
            let R = s.stealth,
              L = R ? (l.team !== s.myTeam ? R.perceive(l, 0.2) : R.canFire(l) ? o(l, c) : null) : o(l, c);
            L
              ? (l.target !== L && ((l.target = L), (l.reactT = h.react * (0.7 + Math.random() * 0.6))),
                (l.seeT = Math.min(4, l.seeT + 0.2)),
                (l.lastSeen = [L.pos.x, L.pos.z]))
              : ((l.seeT = Math.max(0, l.seeT - 0.4)), l.seeT <= 0 && (l.target = null));
          }
          let d = 0,
            p = 0,
            g = 0,
            y = !1,
            m = l.load,
            f = dt[m.prim];
          if (l.target && l.target.alive) {
            let R = l.target,
              L = R.pos.x - l.pos.x,
              V = R.pos.z - l.pos.z,
              G = Math.hypot(L, V);
            y = !0;
            let q = ((Math.atan2(-L, -V) - l.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
            l.yaw += Math.max(-h.turn * a, Math.min(h.turn * a, q));
            let Z = r(l),
              $ = R.pos.clone().setY(R.pos.y + (R.crouchK > 0.5 ? 0.85 : 1.25));
            if (((l.pitch = Math.atan2($.y - Z.y, G)), !l.static)) {
              if (l.mode === "go" && l.flow && G > h.range * 0.45) {
                let H = t.flowDir(l.pos.x, l.pos.z, l.flow);
                H && ((d = H[0]), (p = H[1]), (g = 0.6));
              } else {
                let H = Math.sin(c * 1.3 + l.strafe);
                ((d = (V / G) * H), (p = (-L / G) * H), (g = 0.45), G > h.range * 0.55 && ((d += L / G), (p += V / G), (g = 0.7)));
              }
              l.crouch = Math.sin(c * 0.4 + l.strafe) > 0.55 && g < 0.6 ? 1 : 0;
            }
            if (((l.reactT -= a), (l.fireCd -= a), m.reload > 0)) {
              if (((m.reload -= a), m.reload <= 0)) {
                let H = m.ammo[m.prim],
                  K = Math.min(f.mag - H.mag, H.res);
                ((H.mag += K), (H.res -= K));
              }
            } else if (l.reactT <= 0 && l.fireCd <= 0 && Math.abs(q) < 0.25) {
              let H = m.ammo[m.prim];
              if (H.mag <= 0) ((m.reload = f.reload), (H.res = Math.max(H.res, f.mag)));
              else {
                (H.mag--, l.burst++, (l.fireCd = f.rate * (f.auto ? 1 : 1.4) + (f.auto && l.burst % 5 === 0 ? 0.5 + Math.random() * 0.6 : 0)));
                let K = h.err * (1 + G / 50) * (1.6 - Math.min(1, l.seeT / 2.5) * 0.8) * (l.crouch ? 0.8 : 1),
                  ce = $.clone().sub(Z).normalize();
                ((ce.x += (Math.random() - 0.5) * K * 2),
                  (ce.y += (Math.random() - 0.5) * K * 2),
                  (ce.z += (Math.random() - 0.5) * K * 2),
                  ce.normalize(),
                  s.combat.fire(l, Z, ce, m.prim, f.hip * 0.5, u.muzzle()));
              }
            }
          } else {
            if (((l.burst = 0), (l.crouch = 0), l.lookAt)) {
              let L = ((Math.atan2(-(l.lookAt[0] - l.pos.x), -(l.lookAt[1] - l.pos.z)) - l.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
              ((l.yaw += Math.max(-3 * a, Math.min(3 * a, L))), Math.abs(L) < 0.1 && (l.lookAt = null));
            }
            if (!l.static) {
              if (l.mode === "go" && l.goal) {
                let R = l.goal,
                  L = Math.hypot(R.x - l.pos.x, R.z - l.pos.z);
                if (L > (R.r || 4) * 0.6) {
                  let V = l.flow && t.flowDir(l.pos.x, l.pos.z, l.flow);
                  (V ? ((d = V[0]), (p = V[1])) : ((d = (R.x - l.pos.x) / L), (p = (R.z - l.pos.z) / L)), (g = 1));
                } else if (l.team !== s.myTeam && l.holdAtGoal) ((l.mode = "guard"), (l.post = { x: R.x, z: R.z, r: 7 }));
                else {
                  let V = c * 0.4 + l.strafe,
                    G = R.x + Math.cos(V) * (R.r || 4) * 0.5,
                    W = R.z + Math.sin(V) * (R.r || 4) * 0.5,
                    q = G - l.pos.x,
                    Z = W - l.pos.z,
                    $ = Math.hypot(q, Z) || 1;
                  ((d = q / $), (p = Z / $), (g = 0.3));
                }
              } else if (l.mode === "follow" && l.leader) {
                let R = l.leader,
                  L = l.slot || [0, 3],
                  V = Math.cos(R.yaw),
                  G = Math.sin(R.yaw),
                  W = R.pos.x + L[0] * V + L[1] * G,
                  q = R.pos.z - L[0] * G + L[1] * V,
                  Z = Math.hypot(W - l.pos.x, q - l.pos.z);
                if (((l.crouch = R.crouchK > 0.5 ? 1 : 0), Z > 1.2)) {
                  let $ = Z > 8 && l.flowT !== void 0 && l.flow ? t.flowDir(l.pos.x, l.pos.z, l.flow) : null;
                  ($ ? ((d = $[0]), (p = $[1])) : ((d = (W - l.pos.x) / Z), (p = (q - l.pos.z) / Z)),
                    (g = Z > 10 ? 1 : Z > 3 ? (l.crouch ? 0.42 : 0.6) : 0.32));
                } else l.yaw += (((R.yaw - l.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, a * 2);
              } else if (l.mode === "patrol" && l.path) {
                let R = l.path[l.pi % l.path.length],
                  L = R[0] - l.pos.x,
                  V = R[1] - l.pos.z,
                  G = Math.hypot(L, V),
                  W = G > 1.5 && t.flowDir(l.pos.x, l.pos.z, t.flowTo(R[0], R[1]));
                l.waitT > 0
                  ? ((l.waitT -= a), l.waitT < 1.2 && !l.lookAt && (l.yaw += Math.sin(c * 1.3 + l.strafe) * a * 0.8))
                  : G < 0.8
                    ? (l.pi++, (l.waitT = 1.5 + Math.random() * 2))
                    : (W ? ((d = W[0]), (p = W[1])) : ((d = L / G), (p = V / G)), (g = 0.32));
              } else if (l.mode === "inv" && l.invest) {
                let R = l.invest[0] - l.pos.x,
                  L = l.invest[1] - l.pos.z,
                  V = Math.hypot(R, L);
                if (V > 1.5 && l.invT < 12) {
                  l.invT += a;
                  let G = t.flowDir(l.pos.x, l.pos.z, t.flowTo(l.invest[0], l.invest[1]));
                  (G ? ((d = G[0]), (p = G[1])) : ((d = R / V), (p = L / V)), (g = 0.42));
                } else
                  ((l.invT = (l.invT || 0) + a),
                    (l.yaw += a * 1.2),
                    l.invT > 16 && ((l.mode = l.baseMode || "guard"), (l.invest = null), (l.invT = 0), (l.sst = "calm"), (l.det = 0), (l.lastSeen = null)));
              } else if (l.mode === "hunt" && l.hunt) {
                let R = l.huntF,
                  L = R && t.flowDir(l.pos.x, l.pos.z, R),
                  V = Math.hypot(l.hunt[0] - l.pos.x, l.hunt[1] - l.pos.z);
                V > 2.5
                  ? (L ? ((d = L[0]), (p = L[1])) : ((d = (l.hunt[0] - l.pos.x) / V), (p = (l.hunt[1] - l.pos.z) / V)), (g = 0.7))
                  : ((l.yaw += a * 1.5),
                    (l.huntT = (l.huntT || 0) + a),
                    l.huntT > 6 && ((l.mode = "guard"), (l.post = { x: l.pos.x, z: l.pos.z, r: 8 }), (l.huntT = 0)));
              } else if (l.mode === "hold") l.crouch = l.holdCrouch ? 1 : 0;
              else if (l.mode === "move" && l.goal) {
                let R = l.goal,
                  L = l.flow && t.flowDir(l.pos.x, l.pos.z, l.flow),
                  V = Math.hypot(R.x - l.pos.x, R.z - l.pos.z);
                V > 1.2
                  ? (L ? ((d = L[0]), (p = L[1])) : ((d = (R.x - l.pos.x) / V), (p = (R.z - l.pos.z) / V)),
                    (g = s.stealth && !s.stealth.alarm ? 0.45 : 0.9),
                    (l.crouch = s.stealth && !s.stealth.alarm && g < 0.5 ? 1 : 0))
                  : ((l.mode = "hold"), (l.holdCrouch = !0));
              } else if (((l.waitT -= a), !l.wander && l.waitT <= 0 && (l.wander = t.randomCellNear(l.post.x, l.post.z, 0, l.post.r)), l.wander)) {
                let R = l.wander[0] - l.pos.x,
                  L = l.wander[1] - l.pos.z,
                  V = Math.hypot(R, L);
                if (V < 0.6) ((l.wander = null), (l.waitT = 1.5 + Math.random() * 3));
                else {
                  let G = V > 2.5 && t.flowDir(l.pos.x, l.pos.z, t.flowTo(l.wander[0], l.wander[1]));
                  (G ? ((d = G[0]), (p = G[1])) : ((d = R / V), (p = L / V)), (g = 0.32));
                }
              }
            }
            if (g > 0 && !l.lookAt && !l.static) {
              let L = ((Math.atan2(-d, -p) - l.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
              l.yaw += Math.max(-5 * a, Math.min(5 * a, L));
            }
            ((l.pitch *= 0.9), m.reload > 0 && (m.reload -= a));
          }
          l.sideT > 0 && ((l.sideT -= a), (d = l.side[0]), (p = l.side[1]), (g = Math.max(g, 0.4)));
          let v = g > 0.8 ? 4.4 : g > 0.5 ? 3.4 : g > 0.4 ? 2.6 : 1.6,
            x = d * v * (g > 0 ? 1 : 0) * (l.crouch ? 0.6 : 1),
            _ = p * v * (g > 0 ? 1 : 0) * (l.crouch ? 0.6 : 1);
          ((l.vel.x += (x - l.vel.x) * Math.min(1, a * 8)), (l.vel.z += (_ - l.vel.z) * Math.min(1, a * 8)));
          let S = l.pos.x,
            b = l.pos.z,
            M = e.move(l.pos, l.vel, a, 0.35, l.crouch ? 1.25 : 1.75),
            A = Math.hypot(l.pos.x - S, l.pos.z - b) / Math.max(a, 0.001);
          if (((l.spd = A), g > 0.3 && A < 0.4)) {
            if (((l.stuck += a), l.stuck > 0.7)) {
              ((l.stuck = 0), (l.stuckN = (l.stuckN || 0) + 1));
              let R = Math.random() < 0.5 ? -1 : 1;
              ((l.side = [-p * R || R, d * R]),
                (l.sideT = 0.6),
                l.stuckN === 3 && M && (l.vel.y = 6),
                l.stuckN >= 4 &&
                  ((l.stuckN = 0),
                  (l.wander = null),
                  l.mode === "patrol" && (l.pi++, (l.waitT = 0.5)),
                  l.mode === "inv" && (l.invT = 99),
                  l.mode === "move" && ((l.mode = "hold"), (l.holdCrouch = !0))));
            }
          } else ((l.stuck = 0), A > 1.2 && !(l.sideT > 0) && (l.stuckN = 0));
          ((l.crouchK = (l.crouchK || 0) + ((l.crouch ? 1 : 0) - (l.crouchK || 0)) * Math.min(1, a * 8)),
            u.root.position.copy(l.pos),
            (u.root.rotation.y = l.yaw));
          let E = A,
            w = Math.cos(l.yaw),
            P = Math.sin(l.yaw),
            N = l.pos.x - S,
            z = l.pos.z - b,
            T = Math.hypot(N, z) || 1;
          u.update(a, {
            speed: E,
            fw: (-N * P - z * w) / T,
            sd: (N * w - z * P) / T,
            pitch: y ? l.pitch : 0,
            aim: y,
            crouch: l.crouchK,
            reload: m.reload > 0 ? 1 - m.reload / f.reload : 0,
          });
        }
      }),
      t
    );
  }
