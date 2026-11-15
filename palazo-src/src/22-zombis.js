  var pi = (s, e = 0) => (typeof s == "number" && isFinite(s) ? s : e),
    s0 = ["#8d9678", "#7f8a6e", "#98957c", "#86917f", "#7b8270"],
    Cb = 20;
  function r0(s, e) {
    let { E: t, P: n, AU: i } = s,
      r = s.map,
      o = { list: new Map(), sim: !0, nextId: 1, W: { n: 0, left: 0, brk: 10, spawnT: 0 }, onWave: null, onWaveEnd: null },
      a = e.night ? 15 : 24,
      c = new C(),
      h = new C(),
      l = (f, v) => n.ground(f, v, r.H(f, v) + 2.6);
    function u(f, v, x, _) {
      let S = gs(t, { team: 1, zombie: !0, tint: s0[f % s0.length] }),
        b = {
          id: "z" + f,
          zid: f,
          zombie: !0,
          team: 1,
          name: "Zombi",
          pos: new C(v, _ !== void 0 ? _ : l(v, x), x),
          vel: new C(),
          yaw: Math.random() * 6.283,
          pitch: 0,
          hp: 100,
          helm: 0,
          vest: 0,
          alive: !0,
          char: S,
          tgt: null,
          last: null,
          mem: 0,
          invest: null,
          wander: null,
          waitT: Math.random() * 2,
          atkT: 0.6,
          senseT: Math.random() * 0.25,
          st: 0,
          spd: 0,
          stuck: 0,
          stuckN: 0,
          sideT: 0,
          side: [0, 0],
          deadT: 0,
          groanT: 1 + Math.random() * 6,
          remote: !1,
          peer: "z:" + f,
          net: new C(),
          netYaw: 0,
          seenT: 0,
        };
      return (
        (b.onHurt = (M, A) => {
          A && A.pos && !(b.mem > 0) && ((b.invest = [A.pos.x, A.pos.z]), (b.wander = null), (b.waitT = 0));
        }),
        S.root.position.copy(b.pos),
        (S.root.rotation.y = b.yaw),
        s.units.push(b),
        o.list.set(f, b),
        b
      );
    }
    function d(f) {
      f.char.dispose();
      let v = s.units.indexOf(f);
      (v >= 0 && s.units.splice(v, 1), o.list.delete(f.zid));
    }
    ((o.clear = () => {
      for (let f of [...o.list.values()]) d(f);
      ((o.W = { n: 0, left: 0, brk: 10, spawnT: 0 }), (o.nextId = 1));
    }),
      (o.alive = () => {
        let f = 0;
        for (let v of o.list.values()) v.alive && f++;
        return f;
      }),
      (o.noise = (f, v, x) => {
        if (!(!o.sim || x <= 0))
          for (let _ of o.list.values()) {
            if (!_.alive) continue;
            let S = Math.hypot(_.pos.x - f, _.pos.z - v);
            S > x ||
              (_.mem > 0 && _.tgt && Math.hypot(_.tgt.pos.x - _.pos.x, _.tgt.pos.z - _.pos.z) < S) ||
              ((_.invest = [f + (Math.random() - 0.5) * 3, v + (Math.random() - 0.5) * 3]), (_.wander = null), (_.waitT = 0));
          }
      }));
    function p(f) {
      let v = e.spawns;
      if (!v.length) return;
      let x = null,
        _ = -1;
      for (let b = 0; b < 14; b++) {
        let M = v[Math.floor(Math.random() * v.length)],
          A = 1e9;
        for (let E of f) A = Math.min(A, Math.hypot(E.pos.x - M[0], E.pos.z - M[1]));
        if (A > 22 && A < 60) {
          x = M;
          break;
        }
        A > _ && ((_ = A), (x = M));
      }
      let S = u(o.nextId++, x[0], x[1]);
      if (((S.hp = 90 + o.W.n * 12), f.length && Math.random() < Math.min(0.8, 0.25 + o.W.n * 0.08))) {
        let b = f[Math.floor(Math.random() * f.length)];
        S.invest = [b.pos.x + (Math.random() - 0.5) * 10, b.pos.z + (Math.random() - 0.5) * 10];
      }
    }
    o.simulate = (f, v) => {
      let x = o.W,
        _ = v.filter((M) => M.alive),
        S = o.alive();
      x.brk > 0
        ? ((x.brk -= f),
          x.brk <= 0 && (x.n++, (x.left = Math.round((4 + 4 * x.n) * (1 + 0.5 * (Math.max(1, v.length) - 1)))), (x.spawnT = 0), o.onWave && o.onWave(x.n)))
        : x.left > 0
          ? ((x.spawnT -= f), x.spawnT <= 0 && S < Cb && ((x.spawnT = Math.max(0.4, 1.6 - x.n * 0.1)), p(v), x.left--))
          : S === 0 && x.n > 0 && ((x.brk = 15), o.onWaveEnd && o.onWaveEnd(x.n));
      let b = Math.min(3.2, 2.05 + x.n * 0.08);
      for (let M of o.list.values()) {
        if (!M.alive) {
          ((M.deadT += f), M.char.update(f, {}), M.deadT > 7 && d(M));
          continue;
        }
        if (((M.senseT -= f), M.senseT <= 0)) {
          M.senseT = 0.25;
          let W = null,
            q = 1e9,
            Z = !1,
            $ = -Math.sin(M.yaw),
            H = -Math.cos(M.yaw);
          c.set(M.pos.x, M.pos.y + 1.45, M.pos.z);
          for (let K of _) {
            let ce = K.pos.x - M.pos.x,
              fe = K.pos.z - M.pos.z,
              de = Math.hypot(ce, fe),
              be = K.spd > 5 ? 13 : K.spd > 2.4 && !K.crouch ? 5 : K.spd > 0.6 && !K.crouch ? 2.5 : 0,
              Ee = !1;
            (de < a && (de < 3 || (ce * $ + fe * H) / Math.max(de, 0.01) > 0.3) && (Ee = n.los(c, h.set(K.pos.x, K.pos.y + (K.crouch ? 0.9 : 1.3), K.pos.z))),
              (Ee || de < be) && de < q && ((q = de), (W = K), (Z = Ee)));
          }
          W && ((M.tgt = W), (M.last = [W.pos.x, W.pos.z]), (M.mem = Math.max(M.mem, Z ? 7 : 3)), (M.invest = null));
        }
        let A = null,
          E = null,
          w = 0,
          P = M.tgt;
        M.mem > 0 && P && P.alive
          ? ((M.mem -= f),
            (A = M.last[0]),
            (E = M.last[1]),
            Math.hypot(P.pos.x - M.pos.x, P.pos.z - M.pos.z) < 6 && ((A = P.pos.x), (E = P.pos.z)),
            (w = b),
            (M.st = 1))
          : ((M.tgt = null),
            (M.mem = 0),
            M.invest
              ? ((A = M.invest[0]),
                (E = M.invest[1]),
                (w = 1.4),
                (M.st = 0),
                Math.hypot(A - M.pos.x, E - M.pos.z) < 1.6 && ((M.invest = null), (M.waitT = 2 + Math.random() * 3)))
              : M.waitT > 0
                ? ((M.waitT -= f), (M.st = 0))
                : (M.wander || (M.wander = s.AI.randomCellNear(M.pos.x, M.pos.z, 3, 9)),
                  (A = M.wander[0]),
                  (E = M.wander[1]),
                  (w = 0.6),
                  (M.st = 0),
                  Math.hypot(A - M.pos.x, E - M.pos.z) < 1 && ((M.wander = null), (M.waitT = 1.5 + Math.random() * 4))));
        let N = !1;
        if (
          (P &&
            P.alive &&
            M.mem > 0 &&
            (Math.hypot(P.pos.x - M.pos.x, P.pos.z - M.pos.z) < 1.35 && Math.abs(P.pos.y - M.pos.y) < 1.6
              ? ((N = !0),
                (w = 0),
                (M.st = 2),
                (M.yaw = Math.atan2(-(P.pos.x - M.pos.x), -(P.pos.z - M.pos.z))),
                (M.atkT -= f),
                M.atkT <= 0 && ((M.atkT = 1.2), M.char.attack(), (M.biteT = 0.23), (M.biteOn = P)))
              : (M.atkT = Math.min(M.atkT, 0.5))),
          M.biteT > 0 && ((M.biteT -= f), M.biteT <= 0))
        ) {
          let W = M.biteOn;
          W && W.alive && Math.hypot(W.pos.x - M.pos.x, W.pos.z - M.pos.z) < 1.8 && Math.abs(W.pos.y - M.pos.y) < 1.7 && e.bite(W, 15 + x.n * 1.5, M);
        }
        let z = 0,
          T = 0;
        if (A !== null && w > 0) {
          let W = A - M.pos.x,
            q = E - M.pos.z,
            Z = Math.hypot(W, q),
            $ = Z > 2.2 && s.AI.flowDir(M.pos.x, M.pos.z, s.AI.flowTo(A, E));
          $ ? ((z = $[0]), (T = $[1])) : Z > 0.05 && ((z = W / Z), (T = q / Z));
        }
        M.sideT > 0 && ((M.sideT -= f), (z = M.side[0]), (T = M.side[1]), (w = Math.max(w, 0.8)));
        for (let W of o.list.values()) {
          if (W === M || !W.alive) continue;
          let q = M.pos.x - W.pos.x,
            Z = M.pos.z - W.pos.z,
            $ = q * q + Z * Z;
          if ($ < 0.64 && $ > 1e-4) {
            let H = (0.8 - Math.sqrt($)) * 2;
            ((z += q * H), (T += Z * H));
          }
        }
        ((M.vel.x += (z * w - M.vel.x) * Math.min(1, f * 5)), (M.vel.z += (T * w - M.vel.z) * Math.min(1, f * 5)));
        let R = M.pos.x,
          L = M.pos.z,
          V = n.move(M.pos, M.vel, f, 0.3, 1.7),
          G = Math.hypot(M.pos.x - R, M.pos.z - L) / Math.max(f, 0.001);
        if (((M.spd = G), !N && G > 0.15)) {
          let q = Math.atan2(-(M.pos.x - R), -(M.pos.z - L)) - M.yaw;
          ((q = Math.atan2(Math.sin(q), Math.cos(q))), (M.yaw += q * Math.min(1, f * 4)));
        }
        if (w > 0.3 && G < w * 0.25 && !N) {
          if (((M.stuck += f), M.stuck > 0.8)) {
            ((M.stuck = 0), M.stuckN++);
            let W = Math.random() < 0.5 ? -1 : 1;
            ((M.side = [-T * W || W, z * W]),
              (M.sideT = 0.7),
              M.stuckN === 3 && V && (M.vel.y = 5.5),
              M.stuckN >= 4 && ((M.stuckN = 0), (M.wander = null), (M.invest = null)));
          }
        } else ((M.stuck = 0), G > 0.8 && !(M.sideT > 0) && (M.stuckN = 0));
        (M.pos.y < -20 && (M.pos.y = l(M.pos.x, M.pos.z)), g(M, f), y(M, f, G));
      }
    };
    function g(f, v) {
      ((f.groanT -= v), f.groanT <= 0 && ((f.groanT = f.st === 1 ? 2.5 + Math.random() * 3 : 5 + Math.random() * 7), i.groan(f.pos, f.st === 1)));
    }
    function y(f, v, x) {
      let _ = f.char;
      (_.root.position.copy(f.pos), (_.root.rotation.y = f.yaw), _.update(v, { speed: x, fw: 1, sd: 0, pitch: 0, crouch: 0 }));
    }
    let m = (f) => Math.round(f * 10);
    return (
      (o.pack = () => {
        let f = [];
        for (let v of o.list.values())
          (!v.alive && v.deadT > 2.5) || f.push([v.zid, m(v.pos.x), m(v.pos.y), m(v.pos.z), Math.round(v.yaw * 100), v.alive ? v.st : 3]);
        return f;
      }),
      (o.wave = () => [o.W.n, o.W.left + o.alive(), Math.max(0, Math.ceil(o.W.brk))]),
      (o.apply = (f) => {
        if (o.sim || !Array.isArray(f)) return;
        let v = t.time;
        for (let x of f) {
          if (!Array.isArray(x) || x.length < 6) continue;
          let _ = pi(x[0]) | 0;
          if (_ < 1) continue;
          let S = pi(x[1]) / 10,
            b = pi(x[2]) / 10,
            M = pi(x[3]) / 10,
            A = o.list.get(_);
          if (!A) {
            if (x[5] === 3) continue;
            ((A = u(_, S, M, b)), (A.remote = !0), (o.nextId = Math.max(o.nextId, _ + 1)));
          }
          (A.net.set(S, b, M), (A.netYaw = pi(x[4]) / 100), (A.seenT = v));
          let E = pi(x[5]) | 0;
          E === 3
            ? A.alive && ((A.alive = !1), A.char.die(Math.random() < 0.5 ? -1 : 1), e.onProxyDeath && e.onProxyDeath(A))
            : (E === 2 && A.st !== 2 && A.char.attack(), (A.st = E));
        }
      }),
      (o.follow = (f) => {
        if (o.sim) return;
        let v = 1 - Math.exp(-f * 10);
        for (let x of [...o.list.values()]) {
          if (!x.alive) {
            ((x.deadT += f), x.char.update(f, {}), x.deadT > 6 && d(x));
            continue;
          }
          if (t.time - x.seenT > 1.5) {
            ((x.alive = !1), x.char.die(1));
            continue;
          }
          x.st === 2 && t.time % 1.2 < f && x.char.attack();
          let _ = x.pos.x,
            S = x.pos.z;
          x.pos.distanceTo(x.net) > 5 ? x.pos.copy(x.net) : x.pos.lerp(x.net, v);
          let b = x.netYaw - x.yaw;
          ((b = Math.atan2(Math.sin(b), Math.cos(b))), (x.yaw += b * Math.min(1, f * 8)));
          let M = Math.hypot(x.pos.x - _, x.pos.z - S) / Math.max(f, 0.001);
          ((x.spd += (M - x.spd) * Math.min(1, f * 6)), g(x, f), y(x, f, x.spd));
        }
      }),
      (o.takeOver = (f) => {
        if (!o.sim) {
          o.sim = !0;
          for (let v of [...o.list.values()]) v.alive && ((v.remote = !1), (v.hp = 90 + pi(f && f[0]) * 12), v.pos.copy(v.net));
          if (Array.isArray(f)) {
            o.W.n = pi(f[0]) | 0;
            let v = Math.max(0, (pi(f[1]) | 0) - o.alive());
            ((o.W.left = v), (o.W.brk = pi(f[2])));
          }
        }
      }),
      (o.hitById = (f, v, x, _, S) => {
        let b = o.list.get(f);
        b && b.alive && !b.remote && s.combat.damage(b, v, x, _, S);
      }),
      o
    );
  }
