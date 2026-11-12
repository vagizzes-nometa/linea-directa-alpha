
  // ===== VR (visor Quest), con las manos como en Superslow:
  // grip agarra y sostiene (si lo soltás, el arma se cae; con envión, sale volando), gatillo dispara el arma de esa mano,
  // juntar las manos pasa el arma de una a otra. Fundas: armas largas en la espalda, pistola en la cintura derecha,
  // pala/cuchillo en la cintura izquierda, granadas en el pecho. Soltar el arma sobre su funda la guarda.
  // Arma larga con una sola mano: mucho retroceso y tiembla; con la otra mano en el guardamanos: firme y apunta hacia donde la llevás.
  // Stick izq. camina (clic = correr) · stick der. gira de a 30°, abajo = agacharse · A / X recarga el arma de esa mano ·
  // B o clic del stick der. salta · Y sale del visor.
  function vrCreate(Y) {
    const T3 = Jt,
      E = Y.E,
      R = E.renderer,
      V = { on: !1, supported: !1, rig: new T3.Group(), turn: 0, hands: {}, edge: {}, hold: {}, move: { x: 0, y: 0 }, crouchT: !1, vm: null };
    R.xr.enabled = !0;
    R.xr.setReferenceSpaceType("local-floor");
    E.scene.add(V.rig);
    V.rig.add(E.camera);
    for (let i = 0; i < 2; i++) {
      const ray = R.xr.getController(i),
        grip = R.xr.getControllerGrip(i);
      V.rig.add(ray, grip);
      ray.addEventListener("connected", (e) => {
        V.hands[e.data.handedness] = { ray, grip, src: e.data };
      });
      ray.addEventListener("disconnected", () => {
        for (const k in V.hands) V.hands[k].ray === ray && delete V.hands[k];
      });
    }
    const q = new T3.Quaternion(),
      q2 = new T3.Quaternion(),
      eu = new T3.Euler(0, 0, 0, "YXZ"),
      tv = new T3.Vector3(),
      m4 = new T3.Matrix4();
    const dot = new T3.Mesh(new T3.SphereGeometry(0.02, 8, 6), new T3.MeshBasicMaterial({ color: "#ff3b2f", depthTest: !1, transparent: !0, opacity: 0.85 }));
    dot.renderOrder = 31;
    dot.visible = !1;
    // ---- paneles: muñeca izquierda y cartel al frente ----
    function panel(w, h, px) {
      const cv = document.createElement("canvas");
      cv.width = px;
      cv.height = Math.round((px * h) / w);
      const tx = new T3.CanvasTexture(cv);
      tx.colorSpace = T3.SRGBColorSpace;
      const m = new T3.Mesh(new T3.PlaneGeometry(w, h), new T3.MeshBasicMaterial({ map: tx, transparent: !0, depthTest: !1, depthWrite: !1 }));
      m.renderOrder = 30;
      return { cv, g: cv.getContext("2d"), tx, m };
    }
    const wrist = panel(0.17, 0.1, 512),
      msg = panel(1.2, 0.4, 1024);
    wrist.m.position.set(0, 0.035, 0.07);
    wrist.m.rotation.set(-1.25, 0, 0);
    msg.m.position.set(0, -0.05, -1.5);
    const $q = (s) => document.querySelector(s),
      tx = (s) => {
        const e = $q(s);
        return e ? e.textContent.replace(/\s+/g, " ").trim() : "";
      },
      shown = (s) => {
        const e = $q(s);
        return !!e && !e.hidden && getComputedStyle(e).display !== "none";
      };
    function rr(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }
    function fit(g, t, max) {
      while (g.measureText(t).width > max && t.length > 4) t = t.slice(0, -2);
      return t;
    }
    let wristKey = "",
      msgKey = "";
    const HS = { right: null, left: null };
    function handInfo(h) {
      if (!h || !h.w) return "—";
      const W = dt[h.w];
      if (W.melee) return W.name;
      if (W.throw) return "Granada";
      const a = Y.me.load.ammo[h.w];
      return (h.reload > 0 ? "RECARGANDO" : a ? a.mag + "/" + a.res : "") + " " + W.name;
    }
    function drawWrist() {
      const L = Y.me && Y.me.load,
        hp = tx("#hp b"),
        hr = handInfo(HS.right),
        hl = handInfo(HS.left),
        fund = L ? "Espalda: " + (L.prim ? dt[L.prim].name : "vacía") + " · Cintura: " + (L.sec ? dt[L.sec].name : "vacía") + " · Granadas: " + L.gren : "",
        ob = tx("#objtitle"),
        op = tx("#objprog"),
        k = [hp, hr, hl, fund, ob, op].join("|");
      if (k === wristKey) return;
      wristKey = k;
      const { g, cv } = wrist,
        W = cv.width,
        H = cv.height;
      g.clearRect(0, 0, W, H);
      g.fillStyle = "rgba(12,14,18,.84)";
      rr(g, 4, 4, W - 8, H - 8, 26);
      g.fill();
      g.fillStyle = +hp < 35 ? "#ff6a55" : "#7fd69a";
      g.font = "700 64px 'Chakra Petch',sans-serif";
      g.fillText(hp || "—", 24, 70);
      g.font = "600 26px 'Chakra Petch',sans-serif";
      g.fillStyle = "#efe8da";
      g.textAlign = "right";
      g.fillText(fit(g, "D: " + hr, 330), W - 22, 42);
      g.fillText(fit(g, "I: " + hl, 330), W - 22, 76);
      g.textAlign = "left";
      g.fillStyle = "#b9b0a0";
      g.font = "500 21px 'Chakra Petch',sans-serif";
      g.fillText(fit(g, fund, W - 44), 24, 116);
      g.fillStyle = "#f2c14e";
      g.font = "700 30px 'Chakra Petch',sans-serif";
      g.fillText(fit(g, ob, W - 48), 24, 178);
      g.fillStyle = "#b9b0a0";
      g.font = "500 24px 'Chakra Petch',sans-serif";
      g.fillText(fit(g, op, W - 48), 24, 220);
      g.fillText(fit(g, "Y: salir del visor", W - 48), 24, 262);
      wrist.tx.needsUpdate = !0;
    }
    function drawMsg() {
      let a = "",
        b = "";
      const bm = $q("#bigmsg");
      if (shown("#mpend")) ((a = tx("#mpend h2")), (b = tx("#mpendc")));
      else if (shown("#dead")) ((a = tx("#dead b")), (b = tx("#dead span")));
      else if (bm && bm.classList.contains("on")) ((a = tx("#bigmsg b")), (b = tx("#bigmsg span")));
      else if ($q("#toast") && $q("#toast").classList.contains("on")) b = tx("#toast");
      else if (shown("#prompt")) b = tx("#prompt");
      const k = a + "|" + b;
      if (k === msgKey) return;
      msgKey = k;
      msg.m.visible = !!(a || b);
      const { g, cv } = msg,
        W = cv.width,
        H = cv.height;
      g.clearRect(0, 0, W, H);
      if (!msg.m.visible) return;
      g.fillStyle = "rgba(12,14,18,.7)";
      rr(g, 6, 6, W - 12, H - 12, 30);
      g.fill();
      g.textAlign = "center";
      g.fillStyle = "#efe8da";
      g.font = "700 76px 'Chakra Petch',sans-serif";
      a && g.fillText(fit(g, a, W - 60), W / 2, b ? 150 : 210);
      g.fillStyle = "#f2c14e";
      g.font = "600 44px 'Chakra Petch',sans-serif";
      b && g.fillText(fit(g, b, W - 60), W / 2, a ? 240 : 205);
      msg.tx.needsUpdate = !0;
    }
    // ---- controles ----
    const prev = {},
      btn = (gp, i) => !!(gp && gp.buttons[i] && gp.buttons[i].pressed),
      ax = (gp, i) => (gp && gp.axes.length > i ? gp.axes[i] : 0),
      dz = (v) => (Math.abs(v) < 0.15 ? 0 : v),
      gpOf = (side) => V.hands[side] && V.hands[side].src.gamepad;
    V.poll = () => {
      const L = gpOf("left"),
        Rp = gpOf("right");
      V.move.x = dz(ax(L, 2));
      V.move.y = -dz(ax(L, 3));
      const now = {
        jump: btn(Rp, 5) || btn(Rp, 3),
        menu: btn(L, 5),
        sprint: btn(L, 3),
        turnL: ax(Rp, 2) < -0.6,
        turnR: ax(Rp, 2) > 0.6,
        down: ax(Rp, 3) > 0.7,
        gripR: btn(Rp, 1),
        gripL: btn(L, 1),
        trigR: btn(Rp, 0),
        trigL: btn(L, 0),
        relR: btn(Rp, 4),
        relL: btn(L, 4),
      };
      V.edge = {};
      for (const k in now) ((V.edge[k] = now[k] && !prev[k]), (prev[k] = now[k]));
      V.hold = now;
      V.edge.turnL && (V.turn += Math.PI / 6);
      V.edge.turnR && (V.turn -= Math.PI / 6);
      V.edge.down && (V.crouchT = !V.crouchT);
    };
    V.inp = {
      look: () => ({ x: 0, y: 0 }),
      pressed: (k) => !!V.edge[k],
      down: (k) => (k === "crouch" ? V.crouchT : !!V.hold[k]),
      axis: () => V.move,
      fire: !1,
      ads: !1,
      adsToggle: !1,
      keys: {},
      endFrame() {},
      touch: !1,
    };
    V.headYaw = () => (E.camera.getWorldQuaternion(q), eu.setFromQuaternion(q, "YXZ"), eu.y);
    V.headPitch = () => (E.camera.getWorldQuaternion(q), eu.setFromQuaternion(q, "YXZ"), eu.x);
    V.pulse = (side, k, ms) => {
      const gp = gpOf(side),
        a = gp && gp.hapticActuators && gp.hapticActuators[0];
      try {
        a && a.pulse && a.pulse(k, ms);
      } catch (e) {}
    };
    // ---- manos y armas ----
    const kit = () => Y.vrKit;
    function mkHand(side) {
      const g = new T3.Group(),
        fist = kit().handR(0, 0, 0.02);
      side === "left" && (fist.scale.x *= -1);
      g.add(fist);
      return { side, g, fist, w: null, gm: null, gun: null, sup: !1, supBy: null, cd: 0, reload: 0, kick: 0, hist: [], near: null, grace: !1, wob: Math.random() * 9 };
    }
    const other = (h) => (h.side === "right" ? HS.left : HS.right);
    function setW(h, w) {
      h.gm && h.gm.removeFromParent();
      ((h.gm = null), (h.gun = null), (h.w = w || null), (h.grace = !1), (h.reload = 0), (h.kick = 0), h.supBy && ((h.supBy.sup = !1), (h.supBy = null)));
      if (!w) return;
      const K = kit(),
        gm = new T3.Group(),
        gun = K.gun(w),
        bb = K.grips(w),
        gr = bb.gripR || [0, 0, 0];
      gun.position.set(-gr[0], -gr[1], -gr[2]);
      gm.add(gun);
      const hand = K.handR(0, 0, 0.0);
      h.side === "left" && (hand.scale.x *= -1);
      gm.add(hand);
      if (bb.gripL) {
        const sl = K.handL(bb.gripL[0] - gr[0], bb.gripL[1] - gr[1], bb.gripL[2] - gr[2]);
        h.side === "left" && (sl.scale.x *= -1);
        sl.visible = !1;
        gm.add(sl);
        gm.userData.supHand = sl;
        gm.userData.fore = new T3.Vector3(bb.gripL[0] - gr[0], bb.gripL[1] - gr[1], bb.gripL[2] - gr[2]);
      }
      gm.traverse((o) => o.isMesh && ((o.castShadow = !1), (o.renderOrder = 5)));
      const geo = K.geo(w);
      gm.userData.muzzle = new T3.Vector3(-gr[0], 0.03 - gr[1], (geo ? geo.boundingBox.min.z : -0.4) - gr[2]);
      ((h.gm = gm), (h.gun = gun), h.g.add(gm));
    }
    const inHands = (w) => (HS.right && HS.right.w === w) || (HS.left && HS.left.w === w);
    const cls = (w) => (w === "grenade" ? "chest" : dt[w].slot === 0 ? "back" : dt[w].slot === 1 ? "hipR" : "hipL");
    // fundas alrededor del cuerpo, calculadas desde la cabeza y hacia dónde mira
    const HP = { back: new T3.Vector3(), hipR: new T3.Vector3(), hipL: new T3.Vector3(), chest: new T3.Vector3() },
      HR = { back: 0.34, hipR: 0.24, hipL: 0.24, chest: 0.2 };
    function holsters() {
      const hd = E.camera.getWorldPosition(new T3.Vector3()),
        y = V.headYaw(),
        f = new T3.Vector3(-Math.sin(y), 0, -Math.cos(y)),
        r = new T3.Vector3(Math.cos(y), 0, -Math.sin(y));
      HP.back.copy(hd).add(tv.set(0, -0.14, 0)).addScaledVector(f, -0.2);
      HP.hipR.copy(hd).add(tv.set(0, -0.8, 0)).addScaledVector(r, 0.22).addScaledVector(f, 0.03);
      HP.hipL.copy(hd).add(tv.set(0, -0.8, 0)).addScaledVector(r, -0.22).addScaledVector(f, 0.03);
      HP.chest.copy(hd).add(tv.set(0, -0.4, 0)).addScaledVector(f, 0.16);
      return { y, f, r };
    }
    const nearH = (p) => {
      let best = null,
        bd = 1e9;
      for (const k in HP) {
        const d = p.distanceTo(HP[k]);
        d < HR[k] && d < bd && ((bd = d), (best = k));
      }
      return best;
    };
    // lo guardado en las fundas se ve en el cuerpo (cintura y pecho; la espalda no, para no taparte la vista)
    const shown3 = { hipR: { w: null, m: null }, hipL: { w: null, m: null }, chest: { w: null, m: null } },
      ringM = new T3.MeshBasicMaterial({ color: "#f2c14e", transparent: !0, opacity: 0.55, depthTest: !1 }),
      rings = {};
    for (const k of ["back", "hipR", "hipL", "chest"]) {
      const r = new T3.Mesh(new T3.TorusGeometry(0.07, 0.006, 6, 24), ringM);
      r.renderOrder = 31;
      r.visible = !1;
      rings[k] = r;
    }
    function showStored(L, B) {
      const want = { hipR: L.sec && !inHands(L.sec) ? L.sec : null, hipL: L.melee && !inHands(L.melee) ? L.melee : null, chest: L.gren > 0 ? "grenade" : null };
      for (const k in shown3) {
        const s = shown3[k];
        if (s.w !== want[k]) {
          s.m && s.m.removeFromParent();
          s.m = null;
          s.w = want[k];
          if (s.w) {
            const m = kit().gun(s.w);
            m.traverse((o) => o.isMesh && (o.castShadow = !1));
            s.m = new T3.Group();
            s.m.add(m);
            k === "chest" ? m.scale.setScalar(0.8) : (m.rotation.x = Math.PI / 2 - 0.25);
          }
        }
        if (s.m) {
          s.m.parent !== E.scene && E.scene.add(s.m);
          s.m.position.copy(HP[k]);
          s.m.rotation.set(0, B.y, 0);
          s.m.visible = Y.me.alive;
        }
      }
      for (const k in rings) {
        const r = rings[k];
        r.parent !== E.scene && E.scene.add(r);
        r.visible = HS.right.near === k || HS.left.near === k;
        r.position.copy(HP[k]);
        r.lookAt(E.camera.getWorldPosition(tv));
      }
    }
    function handVel(h) {
      const H = h.hist,
        L = H[H.length - 1];
      if (!L) return new T3.Vector3();
      let k = H.length - 1;
      while (k > 0 && L.t - H[k - 1].t < 0.1) k--;
      const A = H[k];
      return L.t - A.t > 0.01 ? L.p.clone().sub(A.p).divideScalar(L.t - A.t) : new T3.Vector3();
    }
    function aimOf(h) {
      h.gm.updateMatrixWorld(!0);
      const o = h.gm.localToWorld(h.gm.userData.muzzle.clone()),
        d = new T3.Vector3(0, 0, -1).applyQuaternion(h.gm.getWorldQuaternion(q));
      return { o, d };
    }
    function reload(h) {
      const W = h.w && dt[h.w],
        a = h.w && Y.me.load.ammo[h.w];
      if (!W || W.melee || W.throw || !a || a.mag >= W.mag || a.res <= 0 || h.reload > 0) return;
      ((h.reload = W.reload), Y.AU.click());
    }
    function fire(h) {
      const me = Y.me,
        W = dt[h.w],
        a = me.load.ammo[h.w];
      if (!a || h.cd > 0 || h.reload > 0) return;
      if (a.mag <= 0) {
        (Y.AU.click(), (h.cd = 0.3), a.res > 0 && reload(h));
        return;
      }
      a.mag--;
      h.cd = W.rate;
      const long = W.slot === 0,
        two = !!h.supBy,
        mul = long ? (two ? 0.45 : 2.2) : two ? 0.6 : 1;
      const { o, d } = aimOf(h);
      // una mano: el cañón tiembla y sube con cada tiro; dos manos: firme
      const t = Y.time + h.wob;
      d.x += Math.sin(t * 7.3) * 0.004 * mul;
      d.y += Math.cos(t * 6.1) * 0.004 * mul + h.kick * 0.03 * mul;
      d.normalize();
      const spread = (two ? W.ads * 1.6 : W.hip * (long ? 2.4 : 1.1)) + h.kick * 0.012 * mul + (me.moving ? W.move * 0.5 : 0);
      const r = Y.combat.fire(me, o, d, h.w, spread, o);
      (r && Y.hud.hitmarker(r.head, r.kill), (h.kick = Math.min(1.6, h.kick + 1)), (me.kick = 1), V.pulse(h.side, long && !two ? 1 : 0.55, long ? 55 : 35));
      h.supBy && V.pulse(h.supBy.side, 0.4, 35);
      a.mag <= 0 && a.res > 0 && setTimeout(() => h.w && reload(h), 250);
    }
    function pickFloor(h, p) {
      const L = Y.me.load;
      let best = null,
        bd = 1;
      for (const it of Y.pickups.items) {
        if (!it.type.startsWith("w:")) continue;
        const d = Math.hypot(it.x - p.x, it.z - p.z);
        d < bd && p.y - it.y < 1.5 && ((bd = d), (best = it));
      }
      if (!best) return !1;
      const w = best.type.slice(2),
        W = dt[w];
      if (!W || W.slot > 1) return !1;
      const old = W.slot === 0 ? L.prim : L.sec;
      if (old && old !== w) {
        for (const k of ["right", "left"]) HS[k].w === old && setW(HS[k], null);
        Y.pickups.add("w:" + old, best.x + 0.4, best.z + 0.4).ttl = 30;
      }
      (W.slot === 0 ? (L.prim = w) : (L.sec = w), (L.ammo[w] = L.ammo[w] || { mag: W.mag, res: W.res }));
      (Y.pickups.remove(best), setW(h, w), Y.AU.pick(), Y.toast("Tomaste: " + W.name));
      return !0;
    }
    function gripDown(h, p) {
      const o = other(h),
        L = Y.me.load;
      if (h.w) return void (h.grace = !1);
      // la otra mano en el guardamanos del arma
      if (o.w && o.gm && o.gm.userData.fore && !o.supBy && dt[o.w].slot === 0) {
        const fp = o.gm.localToWorld(o.gm.userData.fore.clone());
        if (fp.distanceTo(p) < 0.2) {
          ((h.sup = !0), (o.supBy = h), (o.gm.userData.supHand.visible = !0), V.pulse(h.side, 0.3, 30));
          return;
        }
      }
      // sacar de una funda
      const n = nearH(p);
      if (n === "back" && L.prim && !inHands(L.prim)) return (setW(h, L.prim), V.pulse(h.side, 0.5, 40), Y.AU.click());
      if (n === "hipR" && L.sec && !inHands(L.sec)) return (setW(h, L.sec), V.pulse(h.side, 0.5, 40), Y.AU.click());
      if (n === "hipL" && !inHands(L.melee || "shovel")) return (setW(h, L.melee || "shovel"), V.pulse(h.side, 0.5, 40), Y.AU.click());
      if (n === "chest" && L.gren > 0) return (L.gren--, setW(h, "grenade"), V.pulse(h.side, 0.5, 40), Y.AU.click());
      // pasar el arma de una mano a la otra
      if (o.w && o.g.getWorldPosition(tv).distanceTo(p) < 0.25) {
        const w = o.w;
        return (setW(o, null), setW(h, w), Y.AU.click());
      }
      pickFloor(h, p);
    }
    function gripUp(h, p) {
      const o = other(h),
        L = Y.me.load;
      if (h.sup) {
        ((h.sup = !1), o.supBy === h && ((o.supBy = null), o.gm && o.gm.userData.supHand && (o.gm.userData.supHand.visible = !1)));
        return;
      }
      if (!h.w || h.grace) return;
      const w = h.w,
        W = dt[w],
        c = cls(w),
        n = nearH(p),
        v = handVel(h);
      // guardar en su funda
      if (n === c) return (w === "grenade" && L.gren++, setW(h, null), V.pulse(h.side, 0.35, 30), Y.AU.click());
      if (w === "grenade") {
        // la granada se tira con el envión de la mano (si la soltás quieta, cae a tus pies)
        const vv = v.clone().multiplyScalar(1.45);
        vv.length() > 26 && vv.setLength(26);
        (Y.combat.throwNade(Y.me, p.clone(), null, 0, { v: vv }), setW(h, null));
        return;
      }
      if (W.melee) return setW(h, null);
      // se cae al piso (o sale volando) y queda para levantar
      const fast = v.length() > 1.8,
        x = p.x + (fast ? v.x * 0.45 : 0),
        z = p.z + (fast ? v.z * 0.45 : 0);
      (W.slot === 0 ? L.prim === w && (L.prim = null) : L.sec === w && (L.sec = null), Y.pickups.add("w:" + w, x, z), setW(h, null), Y.AU.click());
    }
    function melee(h, sp) {
      const W = dt[h.w];
      if (h.cd > 0 || sp < 2.3) return;
      h.cd = W.rate;
      const { d } = aimOf(h),
        r = Y.combat.melee(Y.me, Math.atan2(-d.x, -d.z), h.w);
      (W.silent ? Y.AU.click() : Y.AU.shot("shovel", null, !0), r && (Y.hud.hitmarker(r.head, r.kill), V.pulse(h.side, 0.8, 60)));
    }
    let hudT = 0,
      loadRef = null,
      wasAlive = !1;
    V.after = (o, a, dt0) => {
      V.rig.position.set(o.pos.x, o.pos.y - 0.5 * o.crouchK, o.pos.z);
      V.rig.rotation.set(0, V.turn, 0);
      V.vm = a;
      a.visible = !1;
      if (!HS.right) ((HS.right = mkHand("right")), (HS.left = mkHand("left")));
      const L = o.load;
      // reaparecer o cambiar de integrante: arma principal en la mano derecha
      if (L !== loadRef || (o.alive && !wasAlive)) {
        ((loadRef = L), setW(HS.left, null), setW(HS.right, L.prim || L.sec || null), (HS.right.grace = !0), (HS.right.sup = HS.left.sup = !1));
      }
      wasAlive = o.alive;
      const B = holsters(),
        now = Y.time;
      for (const side of ["right", "left"]) {
        const h = HS[side],
          c = V.hands[side];
        if (!c) {
          h.g.visible = !1;
          continue;
        }
        h.g.parent !== c.ray && c.ray.add(h.g);
        h.g.visible = o.alive;
        const p = c.ray.getWorldPosition(new T3.Vector3());
        h.hist.push({ p, t: now });
        h.hist.length > 12 && h.hist.shift();
        h.fist.visible = !h.w && !h.sup;
        h.cd -= dt0;
        if (h.reload > 0 && ((h.reload -= dt0), h.reload <= 0)) {
          const W = dt[h.w],
            am = L.ammo[h.w];
          if (W && am) {
            const n = Math.min(W.mag - am.mag, am.res);
            ((am.mag += n), (am.res -= n), Y.AU.click());
          }
        }
        const nh = nearH(p);
        nh !== h.near && ((h.near = nh), nh && V.pulse(side, 0.15, 20));
        if (!o.alive) continue;
        const S = side === "right" ? "R" : "L";
        V.edge["grip" + S] && gripDown(h, p);
        !V.hold["grip" + S] && (h.w || h.sup) && prev["_g" + S] && gripUp(h, p);
        prev["_g" + S] = V.hold["grip" + S];
        V.edge["rel" + S] && reload(h);
        if (h.w) {
          const W = dt[h.w];
          if (W.melee) melee(h, handVel(h).length());
          else if (!W.throw && (W.auto ? V.hold["trig" + S] : V.edge["trig" + S])) fire(h);
        }
        h.kick = Math.max(0, h.kick - dt0 * 6);
      }
      // apuntar: con la otra mano en el guardamanos, el arma va de una mano a la otra; sola, sigue al control
      for (const side of ["right", "left"]) {
        const h = HS[side],
          c = V.hands[side];
        if (!h.gm || !c) continue;
        const mul = dt[h.w] && dt[h.w].slot === 0 ? (h.supBy ? 0.35 : 1.8) : 0.8;
        if (h.supBy && V.hands[h.supBy.side]) {
          const A = c.ray.getWorldPosition(new T3.Vector3()),
            Bp = V.hands[h.supBy.side].ray.getWorldPosition(new T3.Vector3()),
            up = new T3.Vector3(0, 1, 0).applyQuaternion(c.ray.getWorldQuaternion(q2));
          m4.lookAt(A, Bp, up);
          q.setFromRotationMatrix(m4);
          h.gm.quaternion.copy(c.ray.getWorldQuaternion(q2).invert().multiply(q));
          h.gm.position.set(0, 0, 0.02 * h.kick * mul);
        } else {
          h.gm.quaternion.identity();
          const t = now + h.wob,
            sh = dt[h.w].slot === 0 ? 0.012 : 0.003;
          h.gm.rotation.set(0.28 * h.kick * mul + Math.cos(t * 6.1) * sh, Math.sin(t * 7.3) * sh, 0);
          h.gm.position.set(0, 0.01 * h.kick * mul, 0.04 * h.kick * mul);
        }
      }
      // punto rojo donde pega el arma de la mano derecha
      const ah = HS.right.gm && !dt[HS.right.w].melee && !dt[HS.right.w].throw ? HS.right : HS.left.gm && !dt[HS.left.w].melee && !dt[HS.left.w].throw ? HS.left : null;
      dot.parent !== E.scene && E.scene.add(dot);
      if (ah && o.alive) {
        const A = aimOf(ah),
          hit = Y.P.ray(A.o.x, A.o.y, A.o.z, A.d.x, A.d.y, A.d.z, 80);
        dot.visible = !!hit;
        hit && dot.position.copy(A.o).addScaledVector(A.d, hit.t - 0.03);
      } else dot.visible = !1;
      // la interfaz muestra el arma de la mano derecha (o la izquierda)
      const hw = HS.right.w || HS.left.w;
      hw && (L.slot = hw === "grenade" ? 3 : dt[hw].slot === 2 ? 2 : hw === L.prim ? 0 : 1);
      ((L.slot === 0 && !L.prim) || (L.slot === 1 && !L.sec) || (L.slot === 3 && L.gren <= 0 && hw !== "grenade")) && (L.slot = L.prim ? 0 : L.sec ? 1 : 2);
      showStored(L, B);
      const Lc = V.hands.left;
      Lc && wrist.m.parent !== Lc.grip && Lc.grip.add(wrist.m);
      msg.m.parent !== E.camera && E.camera.add(msg.m);
      E.camera.getWorldPosition(tv);
      const au = Y.AU.listener;
      ((au.x = tv.x), (au.y = tv.y), (au.z = tv.z), (au.yaw = V.headYaw()));
      hudT -= dt0;
      hudT <= 0 && ((hudT = 0.15), drawWrist(), drawMsg());
    };
    V.dead = (o) => {
      V.rig.position.set(o.pos.x, o.pos.y + 1.2, o.pos.z + 0.01);
      dot.visible = !1;
      wasAlive = !1;
      HS.right && (HS.right.g.visible = HS.left.g.visible = !1);
      hudT -= 0.033;
      hudT <= 0 && ((hudT = 0.15), drawWrist(), drawMsg());
    };
    V.aim = () => {
      const h = HS.right && HS.right.gm ? HS.right : HS.left && HS.left.gm ? HS.left : null;
      if (h) return aimOf(h);
      return { o: E.camera.getWorldPosition(new T3.Vector3()), d: E.camera.getWorldDirection(new T3.Vector3()) };
    };
    V.aimDir = (U) => U.copy(V.aim().d);
    V.aimYaw = () => {
      const d = V.aim().d;
      return Math.atan2(-d.x, -d.z);
    };
    V.exit = () => {
      const s = R.xr.getSession();
      s && s.end();
    };
    V.enter = () => {
      if (V.on || !navigator.xr) return Promise.resolve();
      return navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor"] }).then(async (s) => {
        V.prevQ = E.qName;
        E.setQuality("low");
        await R.xr.setSession(s);
        V.on = !0;
        loadRef = null;
        R.xr.setFoveation && R.xr.setFoveation(1);
        document.body.classList.add("vrmode");
        s.addEventListener("end", () => {
          V.on = !1;
          document.body.classList.remove("vrmode");
          V.rig.position.set(0, 0, 0);
          V.rig.rotation.set(0, 0, 0);
          V.turn = 0;
          V.crouchT = !1;
          dot.visible = !1;
          for (const k of ["right", "left"]) HS[k] && (HS[k].g.removeFromParent(), setW(HS[k], null));
          for (const k in shown3) shown3[k].m && shown3[k].m.removeFromParent();
          for (const k in rings) rings[k].removeFromParent();
          V.vm && (V.vm.parent !== E.camera && E.camera.add(V.vm), (V.vm.visible = !0));
          { const L = Y.me && Y.me.load; L && ((L.slot === 0 && !L.prim) || (L.slot === 1 && !L.sec) || L.slot === 3) && (L.slot = L.prim ? 0 : L.sec ? 1 : 2); }
          (msg.m.removeFromParent(), wrist.m.removeFromParent());
          E.setQuality(V.prevQ || "medium");
          Y.onVRExit && Y.onVRExit();
        });
      });
    };
    V.paint = () => {
      const b = $q("#go-vr");
      if (!b) return;
      b.hidden = !V.supported;
      b.querySelector("b").textContent = Y.vrWant ? "Visor VR: encendido" : "Visor VR: apagado";
      b.classList.toggle("on", !!Y.vrWant);
    };
    navigator.xr &&
      navigator.xr
        .isSessionSupported("immersive-vr")
        .then((ok) => {
          V.supported = !!ok;
          V.paint();
        })
        .catch(() => {});
    E.add({
      update() {
        V.on && V.poll();
      },
      always() {
        !Y.playing && V.on && (V.poll(), (hudT -= 0.016), hudT <= 0 && ((hudT = 0.2), drawMsg()));
      },
    });
    V._HS = HS;
    return V;
  }
