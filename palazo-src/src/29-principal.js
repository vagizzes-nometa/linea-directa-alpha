  var ei = kg(Ye.renderer.domElement, yt("#touch"));
  Y.input = ei;
  zd() && ei.setupTouch();
  var Bc = Hg();
  Bc.setVol(Y.settings.vol);
  Y.AU = Bc;
  Y.vr = vrCreate(Y);
  Y.vrWant = !!lo.get("vr", !1);
  var On = Fg();
  Y.P = On;
  var h0 = Vg(Ye);
  Y.hud = t0(Y);
  Y.toast = (s) => Y.hud.toast(s);
  Y.net = c0();
  Y.ARENAS = er;
  Y.mp = Object.assign({ nick: "", col: 0, prim: "rifle", map: 0, md: "ffa" }, lo.get("mp", {}));
  Y.mp.map >= er.length && (Y.mp.map = 0);
  Y.saveMP = () => lo.set("mp", Y.mp);
  var jt = l0(Y);
  Y.net.onPeers = (s) => {
    Y.playing && Y.mode && Y.mode.kind === "dm" && Y.mode.onPeers(s);
  };
  Y.net.connect();
  var u0 = { value: 0 },
    Ma = null,
    Fc = null,
    _t = null,
    on = null,
    ys = null;
  function d0() {
    let s = [Ye.camera, Y.vr.rig];
    for (let e of Ye.scene.children.slice()) s.includes(e) || Ye.scene.remove(e);
    (Ye.camera.clear(), (Y.units.length = 0), On.clear());
  }
  async function Af(s) {
    ((Y.playing = !1),
      jt.show("#loading"),
      jt.loading(0.1, "Armando " + s.name + "\u2026"),
      await new Promise((t) => setTimeout(t, 30)),
      Y.mode && Y.mode.clear && Y.mode.clear(),
      d0(),
      (tr.F = null),
      (Y.map = s),
      (Y.stealth = null),
      (Y.squad = null));
    for (let t of s.sectors) t.statics = [];
    ((On.H = s.H), (On.bounds = s.bounds));
    let e = h0.apply(s.env);
    return (
      (Ye.night = e.night),
      mf(Ye, s),
      jt.loading(0.3, "Construyendo el mapa\u2026"),
      await new Promise((t) => setTimeout(t, 20)),
      (Fc = xf(Ye, On)),
      (Y.FX = Fc),
      (Ma = gf(Ye, On, s.H, s.id.length * 31 + 7)),
      s.build(Ma, Fc),
      Ma.flush(),
      (Y.K = Ma),
      jt.loading(0.55, "Plantando el pasto\u2026"),
      await new Promise((t) => setTimeout(t, 20)),
      Wg(
        Ye,
        Object.assign({}, s, { noGrass: (t, n) => (s.isRoad && s.isRoad(t, n)) || !!On.blocked(t, n, s.H(t, n) + 0.05, s.H(t, n) + 1, 0.25) }),
        Ye.q.grass,
        u0,
      ),
      jt.loading(0.7, "Calculando caminos\u2026"),
      await new Promise((t) => setTimeout(t, 20)),
      (ys = Qg(Y)),
      (Y.AI = ys),
      ys.buildNav(s.bounds),
      (Y.combat = Xg(Y)),
      (Y.pickups = $g(Y)),
      (_t = e0(Y)),
      (Y.me = _t),
      Y.units.push(_t),
      Bc.ambient(!0, e.night),
      e
    );
  }
  function Rf() {
    (jt.loading(1, ""),
      Ye.setQuality(Ye.qName),
      (Y.playing = !0),
      (Y.lastWin = !1),
      jt.show(null),
      Y.hud.show(!0),
      document.body.classList.toggle("opmode", Y.mode.kind === "op"),
      document.body.classList.toggle("dmmode", Y.mode.kind === "dm"),
      ei.touch && (yt("#touch").hidden = !1),
      (Ye.paused = !1),
      ei.touch || (Ye.renderer.domElement.requestPointerLock && Ye.renderer.domElement.requestPointerLock()));
  }
  Y.startMission = async (s, e, t) => {
    ((Y.mi = s), (Y.opi = null), (Y.fpOnly = !1));
    let n = Bi[s];
    (await Af(n),
      (_t.load = fi(e, t, 2)),
      (on = n0(Y)),
      (on.kind = "camp"),
      (Y.mission = on),
      (Y.mode = on),
      on.start(),
      _t.spawn(n.start[0], n.start[1], n.start[2]),
      Rf(),
      Y.hud.big(
        n.name.toUpperCase(),
        "Sector 1 de " +
          n.sectors.length +
          " \xB7 Tom\xE1 " +
          on.pts
            .filter((i) => i.sec === 0)
            .map((i) => i.L)
            .join(" y "),
      ));
  };
  Y.startOp = async (s) => {
    ((Y.opi = s), (Y.fpOnly = !1));
    let e = Mf[s];
    await Af(e.map);
    let t = Kg(Y, e);
    ((Y.mode = t), t.start(), Rf(), Y.hud.big(e.name.toUpperCase(), "Entr\xE1 sin que te vean \xB7 Pausa para cambiar de integrante"));
  };
  Y.roomGM = () => {
    let s = null,
      e = 1 / 0;
    for (let t of Y.net.players()) {
      let n = Tf(t.presence.gm, er.length);
      if (!n) continue;
      let i = typeof t.presence.jt == "number" ? t.presence.jt : 1 / 0;
      (!s || n.id > s.id || (n.id === s.id && i < e)) && ((s = n), (e = i));
    }
    return s;
  };
  Y.startDM = async (s) => {
    ((Y.opi = null),
      (Y.fpOnly = !0),
      (Y.mpJT = Y.mpJT || Date.now()),
      (Y.menuOpen = !1),
      s || (s = Y.roomGM() || { id: 1, ph: "play", map: Y.mp.map, md: Y.mp.md || "ffa", rem: va }));
    let e = er[s.map];
    await Af(e);
    let t = a0(Y, {
      gm: s,
      prim: Y.mp.prim,
      nick: Y.mp.nick || "Jugador",
      col: Y.mp.col,
      arenas: er.length,
      names: er.map((n) => n.name),
      arenaName: e.name,
      reload: (n) => Y.startDM(n),
    });
    ((Y.mode = t), t.start(), Rf(), Y.hud.big(ki[t.md].short, e.name + " \xB7 " + ki[t.md].desc.split(";")[0].split(".")[0]));
  };
  Y.finish = (s) => {
    ((Y.playing = !1), (Y.lastWin = s), Y.vr.on && setTimeout(() => Y.vr.exit(), s ? 1400 : 150));
    let e = Y.mode,
      t = Math.round(Y.time - e.t0),
      n = e.kind === "op",
      i = n ? e.def.name : Y.map.name,
      r = n ? "op:" + e.def.id : Y.map.id;
    if (s) {
      let a = Y.progress();
      ((a[r] = 1), lo.set("progress", a));
    }
    let o = n
      ? " \xB7 " + (Y.stealth.alarm ? "con alarma" : "sin alarma") + " \xB7 equipo " + Y.squad.members().filter((a) => a.alive).length + "/" + e.def.team.length
      : "";
    setTimeout(
      () => {
        (document.exitPointerLock && document.exitPointerLock(),
          Y.hud.show(!1),
          (yt("#touch").hidden = !0),
          jt.end(
            s,
            i +
              " \xB7 " +
              Oc[Y.diff] +
              " \xB7 " +
              Math.floor(t / 60) +
              ":" +
              String(t % 60).padStart(2, "0") +
              " \xB7 " +
              e.kills +
              " bajas \xB7 " +
              e.deaths +
              " ca\xEDdas" +
              o,
          ));
      },
      s ? 1500 : 200,
    );
  };
  Y.pause = () => {
    if ((Y.vr.on && Y.vr.exit(), Y.playing)) {
      if (Y.mode.kind === "dm") {
        if (Y.mode.ended) return;
        ((Y.menuOpen = !0), Y.hud.show(!1), (yt("#touch").hidden = !0), jt.show("#pause"), jt.team());
        return;
      }
      ((Ye.paused = !0), Y.hud.show(!1), (yt("#touch").hidden = !0), jt.show("#pause"), jt.team());
    }
  };
  Y.resume = () => {
    ((Ye.paused = !1),
      (Y.menuOpen = !1),
      jt.show(null),
      Y.hud.show(!0),
      ei.touch && (yt("#touch").hidden = !1),
      ei.touch || (Ye.renderer.domElement.requestPointerLock && Ye.renderer.domElement.requestPointerLock()));
  };
  Y.quit = () => {
    (Y.mode && Y.mode.kind === "dm" && (Y.mode.clear(), Y.net.leave()),
      (Y.fpOnly = !1),
      (Y.menuOpen = !1),
      (Y.playing = !1),
      (Ye.paused = !1),
      Y.hud.show(!1),
      (yt("#touch").hidden = !0),
      Bc.ambient(!1),
      d0(),
      f0(),
      jt.show("#home"));
  };
  ei.onUnlock = () => {
    Y.playing && !Ye.paused && Y.pause();
  };
  Y.onKill = (s, e, t, n) => {
    if (Y.mode.kind === "dm") {
      Y.mode.onKill(s, e, t, n);
      return;
    }
    let i = _t,
      r = (o) => (o === i ? "Vos" : o.name || (o.team === 0 ? "Aliado" : "Enemigo"));
    if ((Y.hud.feed(e ? r(e) : "\u2014", r(s), t, { k: e && e.team === 0 ? "ally" : "foe", v: s.team === 0 ? "ally" : "foe" }), Y.mode.kind === "op")) {
      Y.mode.onKill(s, e, t);
      return;
    }
    if (
      (e === i && s.team !== i.team && (on.kills++, Y.hud.points(t ? "CABEZA  +125" : "BAJA  +100", t ? "head" : "")),
      s === i && (on.onPlayerDeath(), (Y.deathT = 0)),
      s.isBot && s.team !== 0)
    ) {
      let o = Math.random();
      o < 0.32
        ? (Y.pickups.add("ammo", s.pos.x, s.pos.z).ttl = 40)
        : o < 0.44
          ? (Y.pickups.add("med", s.pos.x, s.pos.z).ttl = 40)
          : o < 0.52 && (Y.pickups.add("w:" + s.load.prim, s.pos.x, s.pos.z).ttl = 40);
    }
  };
  Y.onNoise = (s, e, t, n) => {
    if (Y.mode && Y.mode.noise) {
      s === _t && Y.mode.noise(e.x, e.z, t);
      return;
    }
    if (Y.stealth) {
      s.team === Y.myTeam && t > 0 && Y.stealth.noise(e.x, e.z, t, "shot");
      return;
    }
    ys && ys.alert(e.x, e.z, s.isPlayer ? 28 : 18);
  };
  Y.onExplosion = (s, e) => {
    let t = _t ? Ye.camera.position.distanceTo(s) : 99;
    if (((Y.shake = Math.max(Y.shake, (e * 0.6) / Math.max(1, t / 12))), Y.mode && Y.mode.noise)) {
      Y.mode.noise(s.x, s.z, 60);
      return;
    }
    if (Y.stealth) {
      Y.stealth.noise(s.x, s.z, 80, "boom");
      return;
    }
    ys && ys.alert(s.x, s.z, 40);
  };
  var wf = 0;
  Ye.add({
    update(s, e) {
      if (!Y.playing) return;
      if (((Y.time = e), (u0.value = e), ei.pressed("menu") || (Y.vr.on && Y.vr.edge.menu))) {
        Y.pause();
        return;
      }
      ((Y.mode.kind === "dm" && (Y.menuOpen || Y.mode.ended)) || _t.update(s, e), ys.update(s, e), Y.combat.update(s), Fc.update(s, e), Y.mode.update(s, e));
      let t = Y.pickups.update(s, _t);
      if (((yt("#prompt").hidden = !t), t && (yt("#prompt").textContent = t), Y.mode.deathTick)) Y.mode.deathTick(s);
      else if (!_t.alive && Y.playing) {
        Y.deathT = (Y.deathT || 0) + s;
        let o = Math.max(0, 4 - Y.deathT);
        if (
          ((yt("#dead").hidden = !1),
          (yt("#dead b").textContent = on.lost > 0 ? "Sin refuerzos" : "Reaparec\xE9s en " + Math.ceil(o)),
          (yt("#dead span").textContent = "Refuerzos: " + Math.max(0, on.tk)),
          o <= 0 && on.lost <= 0)
        ) {
          let a = on.spawn;
          (_t.spawn(a[0], a[1], a[2] ?? 0), (yt("#dead").hidden = !0));
        }
      } else Y.mode.deathTick || (yt("#dead").hidden = !0);
      (Y.shake > 0 &&
        ((Ye.camera.position.x += (Math.random() - 0.5) * Y.shake * 0.3),
        (Ye.camera.position.y += (Math.random() - 0.5) * Y.shake * 0.3),
        (Y.shake = Math.max(0, Y.shake - s * 1.5))),
        (wf -= s),
        wf <= 0 && ((wf = 1), Ma.updateLights(_t.pos.x, _t.pos.z, Ye.night ? Ye.q.lights : 0)),
        Ye.shadowFocus.copy(_t.pos),
        Y.hud.update(s, _t));
      let n = Y.mode.hud();
      if (
        (yt("#hud").classList.toggle("alarm", !!n.alarm),
        (yt("#objstep").textContent = n.step),
        (yt("#objtitle").textContent = n.title),
        (yt("#objprog").textContent = n.prog),
        (yt("#objbar").hidden = n.bar === null),
        n.bar !== null && ((yt("#objbar b").style.width = Math.round(n.bar * 100) + "%"), yt("#objbar").classList.toggle("out", !!n.contested)),
        Y.mode.marks)
      ) {
        let o = Y.mode.marks(_t);
        (Y.hud.drawRadar(_t, o.R), Y.hud.drawCompass(_t.yaw, o.C), Y.squad && Y.hud.team(Y.squad.hud()), ei.endFrame());
        return;
      }
      let i = [];
      for (let o of Y.units)
        !o.alive ||
          o === _t ||
          (o.team === 0
            ? i.push({ x: o.pos.x, z: o.pos.z, c: "#4da3ff" })
            : o.target && o.fireCd > -0.5 && o.seeT > 0 && Y.diff !== "hard" && i.push({ x: o.pos.x, z: o.pos.z, c: "#e0503f" }));
      let r = [];
      for (let o of on.pts)
        if (o.sec <= on.sec) {
          let a = o.own ? "#4da3ff" : "#e0503f";
          (i.push({ x: o.x, z: o.z, t: o.L, c: a, ring: o.sec === on.sec && !o.own ? o.r : 0 }),
            o.sec === on.sec && !o.own && r.push({ a: -Math.atan2(-(o.x - _t.pos.x), -(o.z - _t.pos.z)), t: o.L, c: a }));
        }
      (Y.hud.drawRadar(_t, i), Y.hud.drawCompass(_t.yaw, r), ei.endFrame());
    },
    always(s) {
      !Y.playing && Ye.paused;
    },
  });
  jt.show("#loading");
  jt.loading(0, "Cargando soldados, armas y texturas\u2026");
  document.body.classList.toggle("touch", ei.touch);
  yt("#touch").hidden = !0;
  var Lb = setInterval(() => {
    ma.size && (yt("#lmsg").textContent += " \xB7 esperando: " + [...ma].join(", "));
  }, 6e3);
  zg((s, e) => jt.loading(s * 0.95, "Cargando\u2026 " + Math.round(s * 100) + "%"))
    .finally(() => clearInterval(Lb))
    .then(() => {
      (jt.show("#home"), Ye.start(), f0());
    })
    .catch((s) => {
      yt("#lmsg").textContent = "No se pudo cargar: " + s.message;
    });
  var tr = { F: null, a: 0 };
  function f0() {
    let s = Bi[0];
    (On.clear(), (On.H = s.H), (On.bounds = s.bounds));
    let e = h0.apply(s.env);
    ((Ye.night = e.night), mf(Ye, s));
    let t = gf(Ye, On, s.H, 3);
    for (let n of s.sectors) n.statics = [];
    ((tr.F = xf(Ye, On)), s.build(t, tr.F), t.flush(), (Ye.camera.fov = 55), Ye.camera.updateProjectionMatrix());
  }
  Ye.add({
    always(s, e) {
      if (Y.playing || Ye.paused || !tr.F) return;
      tr.a += s * 0.04;
      let t = tr.a;
      (Ye.camera.position.set(Math.sin(t) * 30, 9 + Math.sin(t * 0.7) * 2, -20 + Math.cos(t) * 45),
        Ye.camera.lookAt(0, 2, -35),
        tr.F.update(s, e),
        Ye.shadowFocus.set(0, 0, -30));
    },
  });
  for (let k of ["startMission", "startOp", "startDM"]) {
    let f = Y[k];
    Y[k] = (...a) => {
      if (Y.vrWant && Y.vr.supported && !Y.vr.on)
        return Y.vr
          .enter()
          .catch((e) => Y.toast("No se pudo abrir el visor: " + ((e && e.message) || e)))
          .then(() => f(...a));
      return f(...a);
    };
  }
  Y.onVRExit = () => {
    Y.playing && Y.pause();
  };
  {
    let b = yt("#go-vr");
    b &&
      (b.onclick = () => {
        ((Y.vrWant = !Y.vrWant), lo.set("vr", Y.vrWant), Y.vr.paint(), Y.toast(Y.vrWant ? "Al empezar cualquier modo se abre en el visor" : "Jug\xE1s en pantalla"));
      });
    Y.vr.paint();
  }
  {
    let b = yt("#go-ss");
    b &&
      (b.onclick = () => {
        if (!window.SS) return Y.toast("Superslow no carg\xF3");
        ((Ye.sleep = !0), Y.vr.on && Y.vr.exit(), window.SS.enter());
      });
    window.__ssExit = () => {
      ((Ye.sleep = !1), jt.show("#home"));
    };
  }
  window.__G = Y;
})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
