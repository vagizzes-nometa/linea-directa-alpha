  function e0(s) {
    let { E: e, P: t, input: n0, AU: i } = s,
      r = e.camera,
      o = {
        id: "me",
        isPlayer: !0,
        team: s.myTeam,
        name: "Vos",
        pos: new C(),
        vel: new C(),
        yaw: 0,
        pitch: 0,
        hp: 100,
        helm: 0,
        vest: 0,
        alive: !0,
        load: fi(),
        onGround: !0,
        crouch: !1,
        crouchK: 0,
        ads: !1,
        adsK: 0,
        tp: s.settings.tp && !s.fpOnly,
        tpK: s.settings.tp && !s.fpOnly ? 1 : 0,
        kick: 0,
        spreadK: 0,
        bob: 0,
        stepT: 0,
        lastHit: -99,
        deadT: 0,
      };
    o.char = gs(e, { team: s.myTeam, tint: "#8f9a6c" });
    let a = new ut();
    (r.add(a), s.vr ? (s.vr.rig.parent !== e.scene && e.scene.add(s.vr.rig), r.parent !== s.vr.rig && s.vr.rig.add(r)) : e.scene.add(r));
    let c = null,
      h = "",
      l = new Xe({ color: "#6d5d47", roughness: 0.85 }),
      u = new Xe({ color: "#5b5f45", roughness: 0.9 }),
      d = (N, z) => new Wr(N, z, 4, 8),
      p = (N, z, T, R) => {
        let L = new we(N, z);
        return (L.position.set(...T), R && L.rotation.set(...R), L);
      },
      g = (N, z, T) => {
        let R = new C(...T).normalize(),
          L = 0.42,
          V = new we(new Gt(0.036, 0.046, L, 12), u);
        (V.position.copy(new C(...z).addScaledVector(R, L / 2)), V.quaternion.setFromUnitVectors(new C(0, 1, 0), R), N.add(V));
        let G = new we(new Gt(0.033, 0.036, 0.03, 12), l);
        (G.position.copy(new C(...z).addScaledVector(R, 0.005)), G.quaternion.copy(V.quaternion), N.add(G));
      },
      y = (N, z, T) => {
        let R = new ut();
        (R.position.set(N, z, T), (R.rotation.x = -0.32), R.scale.setScalar(1.3), R.add(p(new at(0.026, 0.085, 0.07), l, [0.03, 0, 0.008])));
        for (let L = 0; L < 4; L++) {
          let V = 0.028 - L * 0.02;
          (R.add(p(d(0.0105, 0.034), l, [0.002, V, -0.03], [0, 0, Math.PI / 2])), R.add(p(d(0.0095, 0.012), l, [-0.024, V, -0.018], [Math.PI / 2, 0, 0])));
        }
        return (R.add(p(d(0.011, 0.036), l, [-0.022, 0.045, 0.012], [Math.PI / 2.4, 0, 0])), g(R, [0.035, -0.03, 0.04], [0.35, -0.55, 1]), R);
      },
      m = (N, z, T) => {
        let R = new ut();
        (R.position.set(N, z, T), R.scale.setScalar(1.3), R.add(p(new at(0.07, 0.024, 0.085), l, [0, -0.028, 0])));
        for (let L = 0; L < 4; L++) {
          let V = -0.03 + L * 0.02;
          R.add(p(d(0.0105, 0.03), l, [-0.034, -0.005, V]));
        }
        return (R.add(p(d(0.011, 0.04), l, [0.032, -0.008, 0.005], [Math.PI / 2, 0, 0])), g(R, [-0.012, -0.04, 0.035], [-0.45, -0.6, 1]), R);
      },
      f = (N, z, T) => y(N, z, T),
      v = new C(0.17, -0.19, -0.38),
      x = new C(0, -0.118, -0.3);
    function _(N) {
      if (N === h || ((h = N), a.clear(), !N)) return;
      let z = oo(N);
      (a.add(z), (c = z));
      let T = ro(N),
        R = T ? T.boundingBox : null;
      if (N === "grenade") (z.position.set(0, 0, -0.05), a.add(y(0, -0.03, -0.02)));
      else if (N === "shovel") ((z.rotation.x = -0.5), a.add(y(0, -0.05, 0.05)));
      else {
        let L = R ? R.max.z - R.min.z : 0.6,
          V = N === "pistol" || N === "revolver",
          G = R ? R.max.z - (V ? 0.06 : 0.26 * L) : 0.06;
        if ((a.add(y(0, V ? -0.055 : -0.075, G)), V)) {
          let W = y(-0.012, -0.06, G + 0.012);
          ((W.scale.x = -1), (W.rotation.y = 0.25), a.add(W));
        } else a.add(m(0, -0.035, R ? R.max.z - 0.55 * L : -0.2));
      }
      a.traverse((L) => {
        L.isMesh && ((L.castShadow = !1), (L.renderOrder = 5));
      });
    }
    o.vm = a;
    s.vrKit = { gun: oo, geo: ro, grips: bb, handR: y, handL: m };
    let S = () => o.load.cur();
    ((o.spawn = (N, z, T) => {
      (o.pos.set(N, t.ground(N, z, 80), z),
        o.vel.set(0, 0, 0),
        (o.yaw = T),
        (o.pitch = 0),
        (o.hp = 100),
        (o.alive = !0),
        (o.deadT = 0),
        o.char.revive(),
        (o.load.reload = 0),
        (o.prot = 1.5));
      for (let R of [o.load.prim, o.load.sec])
        if (R) {
          let L = dt[R],
            V = o.load.ammo[R] || (o.load.ammo[R] = { mag: L.mag, res: L.res });
          ((V.mag = L.mag), (V.res = Math.max(V.res, L.res)));
        }
      ((o.load.gren = Math.max(o.load.gren, 2)), (o.load.slot = o.load.prim ? 0 : 1));
    }),
      (o.onHurt = (N, z) => {
        (i.hurt(), (e.hurt = Math.min(0.8, e.hurt + N / 60)), s.hud.damageFrom(z, o));
      }));
    let b = (N) => {
        let z = o.load;
        N !== z.slot &&
          ((N === 0 && !z.prim) ||
            (N === 1 && !z.sec) ||
            (N === 3 && z.gren <= 0) ||
            ((z.last = z.slot), (z.slot = N), (z.reload = 0), (z.cd = 0.35), i.click()));
      },
      M = new C(),
      A = new C();
    o.update = (N, z) => {
      let VR = s.vr && s.vr.on ? s.vr : null,
        n = VR ? VR.inp : n0;
      let T = o.load;
      if (!o.alive) {
        ((o.deadT += N), o.char.update(N, {}), VR && VR.dead(o));
        let U = o.char.root.position,
          O = o.yaw + o.deadT * 0.25;
        (r.position.set(U.x + Math.sin(O) * 4.5, U.y + 2.6 + o.deadT * 0.2, U.z + Math.cos(O) * 4.5),
          r.lookAt(U.x, U.y + 0.4, U.z),
          (a.visible = !1),
          o.char.setVisible(!0));
        return;
      }
      o.prot = Math.max(0, (o.prot || 0) - N);
      let R = n.look(),
        L = dt[S()],
        V = 0.0022 * s.settings.sens * (o.ads ? (r.fov / s.settings.fov) * 0.9 : 1);
      if (
        ((o.yaw -= R.x * V),
        (o.pitch = Math.max(-1.45, Math.min(1.45, o.pitch - R.y * V * (s.settings.invert ? -1 : 1)))),
        VR && ((o.yaw = VR.headYaw()), (o.pitch = VR.headPitch())),
        n.pressed("s1") && b(0),
        n.pressed("s2") && b(1),
        n.pressed("s3") && b(2),
        n.pressed("s4") && b(3),
        n.pressed("last") && b(T.last),
        n.pressed("next") || n.pressed("swap"))
      ) {
        let U = [0, 1, 2, 3].filter((O) => (O === 0 ? T.prim : O === 1 ? T.sec : O === 3 ? T.gren > 0 : !0));
        b(U[(U.indexOf(T.slot) + 1) % U.length]);
      }
      if (n.pressed("prev")) {
        let U = [0, 1, 2, 3].filter((O) => (O === 0 ? T.prim : O === 1 ? T.sec : O === 3 ? T.gren > 0 : !0));
        b(U[(U.indexOf(T.slot) + U.length - 1) % U.length]);
      }
      (n.pressed("cam") &&
        !s.fpOnly &&
        ((s.settings.tp = !s.settings.tp), s.saveSettings(), s.toast(s.settings.tp ? "C\xE1mara: tercera persona" : "C\xE1mara: primera persona")),
        (o.tp = s.settings.tp && !s.fpOnly && !VR),
        (o.crouch = n.down("crouch") || !!n.keys.crouchT));
      let G = (n.ads || n.adsToggle) && !L.melee && !L.throw && T.reload <= 0;
      ((o.ads = G), (o.adsK += ((o.ads ? 1 : 0) - o.adsK) * Math.min(1, N * 12)), (o.crouchK += ((o.crouch ? 1 : 0) - o.crouchK) * Math.min(1, N * 10)));
      let W = n.axis(),
        q = n.down("sprint") && W.y > 0.5 && !o.ads && !o.crouch,
        Z = (q && !o.dragging ? 6.6 : 4.6) * (L.speed || 1) * (o.ads ? 0.62 : 1) * (o.crouch ? 0.52 : 1) * (o.dragging ? 0.55 : 1),
        $ = Math.sin(o.yaw),
        H = Math.cos(o.yaw),
        K = W.x * H - W.y * $,
        ce = -W.x * $ - W.y * H,
        fe = Math.hypot(K, ce);
      fe > 1 && ((K /= fe), (ce /= fe));
      let de = o.onGround ? 12 : 3;
      ((o.vel.x += (K * Z - o.vel.x) * Math.min(1, N * de)),
        (o.vel.z += (ce * Z - o.vel.z) * Math.min(1, N * de)),
        n.pressed("jump") && o.onGround && !o.crouch && ((o.vel.y = 7.2), (o.onGround = !1)));
      let be = o.pos.x,
        Ee = o.pos.z;
      o.onGround = t.move(o.pos, o.vel, N, 0.35, o.crouch ? 1.25 : 1.75);
      let ye = Math.hypot(o.pos.x - be, o.pos.z - Ee) / Math.max(N, 0.001);
      ((o.moving = ye > 0.5),
        (o.spd = ye),
        (o.sprinting = q),
        o.pos.y < -30 && (o.pos.y = t.ground(o.pos.x, o.pos.z, 80)),
        o.onGround && ye > 0.8 && ((o.stepT -= (N * ye) / (q ? 2.6 : 2.1)), o.stepT <= 0 && ((o.stepT = 1), i.step(null, !0))));
      let ge = T.ammo[S()];
      if (
        (n.pressed("reload") && ge && ge.mag < L.mag && ge.res > 0 && T.reload <= 0 && !L.melee && !L.throw && ((T.reload = L.reload), i.click()),
        T.reload > 0 && ((T.reload -= N), T.reload <= 0 && ge))
      ) {
        let U = Math.min(L.mag - ge.mag, ge.res);
        ((ge.mag += U), (ge.res -= U), i.click());
      }
      if (((T.cd -= N), (o.spreadK = Math.max(0, o.spreadK - N * 3)), L.throw)) {
        if (n.fire && T.gren > 0 && T.cd <= 0) {
          o.charge = Math.min(1, (o.charge || 0) + N / 1.1);
          let U = new C();
          (VR ? VR.aimDir(U) : r.getWorldDirection(U),
            s.FX.arc(
              E().addScaledVector(U, 0.5),
              U.clone()
                .multiplyScalar(6 + 20 * o.charge)
                .add(new C(0, 3.2, 0)),
              18,
            ),
            s.hud.charge(o.charge));
        } else if (o.charge > 0) {
          let U = new C();
          (VR ? VR.aimDir(U) : r.getWorldDirection(U),
            T.gren--,
            (T.cd = L.rate),
            s.combat.throwNade(o, E().addScaledVector(U, 0.5), U, 6 + 20 * o.charge),
            (o.charge = 0),
            s.FX.arcHide(),
            s.hud.charge(0),
            T.gren <= 0 && b(T.last === 3 ? 0 : T.last));
        }
      } else o.charge && ((o.charge = 0), s.FX.arcHide(), s.hud.charge(0));
      let k = L.auto ? n.fire : n.fire && !o._held;
      if (((o._held = n.fire), k && T.cd <= 0 && T.reload <= 0)) {
        if (L.melee) {
          ((T.cd = L.rate), (o.swing = 0.35));
          let U = s.combat.melee(o, VR ? VR.aimYaw() : o.yaw, S());
          (L.silent ? i.click() : i.shot("shovel", null, !0), U && (s.hud.hitmarker(U.head, U.kill), U.takedown && s.toast("Derribo silencioso")));
        } else if (!L.throw) {
          if (ge && ge.mag <= 0) ge.res > 0 ? ((T.reload = L.reload), i.click()) : (i.click(), (T.cd = 0.3));
          else if (ge) {
            (ge.mag--, (T.cd = L.rate));
            let U = (o.ads ? L.ads : L.hip + (o.moving ? L.move : 0) + (o.onGround ? 0 : L.move * 1.5)) * (o.crouch ? 0.65 : 1) + o.spreadK * 0.02;
            o.spreadK = Math.min(1, o.spreadK + 0.35);
            let { o: O, d: ie } = w(),
              oe = o.tpK > 0.5 || o.char.root.visible ? o.char.muzzle() : P(),
              me = s.combat.fire(o, O, ie, S(), U, oe);
            (me && s.hud.hitmarker(me.head, me.kill),
              (o.pitch = Math.min(1.45, o.pitch + L.recoil * (o.ads ? 0.55 : 1) * (o.crouch ? 0.7 : 1))),
              (o.yaw += (Math.random() - 0.5) * L.recoil * 0.4),
              (o.kick = 1),
              (L.manual || L.scope) && (T.cd = L.rate),
              ge.mag <= 0 &&
                ge.res > 0 &&
                setTimeout(() => {
                  T.reload <= 0 && ge.mag <= 0 && (T.reload = L.reload);
                }, 250));
          }
        }
      }
      ((o.kick = Math.max(0, o.kick - N * 8)),
        z - o.lastHit > 6 && o.hp < 100 && (o.hp = Math.min(100, o.hp + N * 9)),
        (e.hurt = Math.max(0, e.hurt - N * 0.5) + (o.hp < 35 ? 0.25 * (1 - o.hp / 35) : 0) * 0),
        (o.tpK += ((o.tp && !(o.ads && L.scope) ? 1 : 0) - o.tpK) * Math.min(1, N * 8)));
      let ue = 1.62 - 0.5 * o.crouchK;
      o.bob += ye * N * (q ? 1.9 : 1.6);
      let re = o.onGround ? Math.sin(o.bob * 2) * 0.035 * Math.min(1, ye / 4) * (1 - o.adsK * 0.8) : 0;
      VR || (r.rotation.set(0, 0, 0), (r.rotation.order = "YXZ"), (r.rotation.y = o.yaw), (r.rotation.x = o.pitch + o.kick * 0.008));
      let le = new C(o.pos.x, o.pos.y + ue + re, o.pos.z);
      if (o.tpK > 0.01) {
        let U = new C(0.62 + 0.2 * o.adsK, 0.22 - 0.1 * o.adsK, 2.6 - 1.35 * o.adsK).applyEuler(r.rotation).multiplyScalar(o.tpK),
          O = U.length(),
          ie = U.clone().normalize(),
          oe = t.ray(le.x, le.y, le.z, ie.x, ie.y, ie.z, O + 0.3);
        r.position.copy(le).addScaledVector(ie, oe ? Math.max(0.15, oe.t - 0.3) : O);
      } else VR || r.position.copy(le);
      let te = o.ads ? (L.scope ? L.zoom : o.tpK > 0.5 ? 52 : L.zoom) / 75 : 1,
        Ce = s.settings.fov * (o.ads ? te : 1) + (q ? 6 : 0);
      ((r.fov += (Ce - r.fov) * Math.min(1, N * 12)), r.updateProjectionMatrix());
      let ve = o.tpK > 0.4;
      (o.char.setVisible(ve), o.char.root.position.copy(o.pos), (o.char.root.rotation.y = o.yaw), o.char.setWeapon($n(S())));
      let D = new C(o.pos.x - be, 0, o.pos.z - Ee),
        I = D.length() || 1;
      (ve &&
        o.char.update(N, {
          speed: ye,
          fw: (-D.x * $ - D.z * H) / I,
          sd: (D.x * H - D.z * $) / I,
          pitch: o.pitch,
          aim: o.ads || n.fire,
          crouch: o.crouchK,
          reload: T.reload > 0 ? 1 - T.reload / L.reload : 0,
        }),
        _($n(S())),
        (a.visible = o.tpK < 0.5 && !(o.ads && L.scope && r.fov < 40)));
      let J = v.clone().lerp(x, o.adsK),
        B = Math.sin(o.bob) * 0.012 * Math.min(1, ye / 4) * (1 - o.adsK);
      (a.position.set(
        J.x + B,
        J.y +
          Math.abs(Math.cos(o.bob)) * 0.012 * Math.min(1, ye / 4) * (1 - o.adsK) -
          (T.reload > 0 ? 0.12 * Math.sin(Math.PI * (1 - T.reload / L.reload)) : 0),
        J.z + o.kick * 0.05,
      ),
        a.rotation.set(
          o.kick * 0.06 +
            (T.reload > 0 ? -0.4 * Math.sin(Math.PI * (1 - T.reload / L.reload)) : 0) +
            (o.swing > 0 ? -1.2 * Math.sin((Math.PI * o.swing) / 0.35) : 0),
          0,
          q ? 0.25 : 0,
        ),
        (o.swing = Math.max(0, (o.swing || 0) - N)),
        q && (a.position.y -= 0.05),
        (i.listener.x = r.position.x),
        (i.listener.y = r.position.y),
        (i.listener.z = r.position.z),
        (i.listener.yaw = o.yaw),
        VR && VR.after(o, a, N));
    };
    function E() {
      return new C(o.pos.x, o.pos.y + 1.62 - 0.5 * o.crouchK, o.pos.z);
    }
    o.eye = E;
    function w() {
      if (s.vr && s.vr.on) return s.vr.aim();
      let N = new C();
      if ((r.getWorldDirection(N), o.tpK < 0.5)) return { o: r.position.clone(), d: N };
      let z = r.position,
        T = t.ray(z.x, z.y, z.z, N.x, N.y, N.z, 250),
        R = z.clone().addScaledVector(N, T ? T.t : 250);
      for (let V of s.units) {
        if (V.team === o.team || !V.alive) continue;
        let G = V.char.hitRay(z, N, T ? T.t : 250);
        if (G) {
          R = z.clone().addScaledVector(N, G.t);
          break;
        }
      }
      let L = E();
      return { o: L, d: R.sub(L).normalize() };
    }
    function P() {
      let N = ro(S());
      return !c || !N ? r.position.clone() : (a.updateMatrixWorld(!0), c.localToWorld(new C(0, 0.03, N.boundingBox.min.z)));
    }
    return o;
  }
