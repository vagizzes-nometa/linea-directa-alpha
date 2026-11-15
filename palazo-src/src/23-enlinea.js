  var va = 600,
    o0 = 15;
  var Pb = 4,
    zc = ["#c9a227", "#3f8fd1", "#c4473a", "#5aa36a", "#9a62c4", "#d07a35"],
    ki = {
      ffa: { name: "Todos contra todos", short: "TODOS CONTRA TODOS", desc: "Cada uno por su cuenta; gana el que m\xE1s baja en 10 minutos." },
      tdm: { name: "Por equipos", short: "AZUL CONTRA ROJO", desc: "Dos equipos que se arman solos al entrar; gana el equipo con m\xE1s bajas en 10 minutos." },
      zm: {
        name: "Zombis",
        short: "ZOMBIS",
        desc: "Todos juntos contra oleadas de zombis cada vez m\xE1s grandes. Oyen los disparos y los pasos, y te ven si est\xE1s adelante.",
      },
    },
    xa = [
      { name: "AZUL", col: "#3f7fd6", tint: "#4f6f9a" },
      { name: "ROJO", col: "#d8503e", tint: "#9a4f45" },
    ],
    Je = (s, e = 0) => (typeof s == "number" && isFinite(s) ? s : e),
    xs = (s) => (Array.isArray(s) ? s : []),
    Ef = (s, e) => s.reduce((t, n) => (Array.isArray(n) ? Math.max(t, Je(n[e])) : t), 0),
    ya = (s) => ((s = Math.max(0, Math.ceil(s))), Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"));
  function Tf(s, e) {
    if (!s || typeof s != "object") return null;
    let t = Je(s.id, -1) | 0,
      n = Je(s.map, -1) | 0;
    return t < 1 || n < 0 || n >= e || (s.ph !== "play" && s.ph !== "end")
      ? null
      : { id: t, ph: s.ph, map: n, md: ki[s.md] ? s.md : "ffa", rem: Math.max(0, Math.min(va + 5, Je(s.rem))) };
  }
  function a0(s, e) {
    let { E: t, P: n, net: i, AU: r } = s,
      o = s.me,
      a = (B) => document.querySelector(B),
      c = e.gm.md || "ffa",
      h = c === "zm",
      l = c === "tdm",
      u = { kind: "dm", md: c, kills: 0, deaths: 0, t0: t.time, remotes: new Map(), ended: !1, dead: !1, vote: null, tm: 0, result: "" },
      d = { id: e.gm.id, ph: e.gm.ph, map: e.gm.map, md: c, end: t.time + e.gm.rem };
    u.gm = d;
    let p = (s.netSeq = s.netSeq || { n: 1, sh: 0 }),
      g = { hits: [], dl: [], se: null, gr: null, zk: [] },
      y = (B, U, O) => {
        for (B.push(U); B.length > O;) B.shift();
      },
      m = s.map,
      f = m.bounds,
      v = [];
    for (let B = f.x0 + 3; B < f.x1 - 3; B += 4.5)
      for (let U = f.z0 + 3; U < f.z1 - 3; U += 4.5) {
        let O = B + Math.random() * 1.6 - 0.8,
          ie = U + Math.random() * 1.6 - 0.8;
        [
          [0, 0],
          [0.7, 0],
          [-0.7, 0],
          [0, 0.7],
          [0, -0.7],
        ].every(([oe, me]) => s.AI.passable(O + oe, ie + me)) &&
          (Math.abs(n.ground(O, ie, 80) - m.H(O, ie)) > 0.4 || v.push([O, ie]));
      }
    let x = (f.x0 + f.x1) / 2,
      _ = (f.z0 + f.z1) / 2,
      S = (B) => B.team !== s.myTeam;
    function b() {
      if (!v.length) return [x, _];
      let B = [],
        U = [];
      for (let ie of u.remotes.values()) ie.alive && (S(ie) ? B : U).push(ie);
      if (h) for (let ie of w.list.values()) ie.alive && B.push(ie);
      let O = v
        .map((ie) => {
          let oe = 1e9,
            me = 1e9;
          for (let Q of B) oe = Math.min(oe, Math.hypot(Q.pos.x - ie[0], Q.pos.z - ie[1]));
          for (let Q of U) me = Math.min(me, Math.hypot(Q.pos.x - ie[0], Q.pos.z - ie[1]));
          let Le = Math.min(oe, 70) + Math.random() * 6;
          return ((l || h) && U.length && (Le -= Math.min(me, 60) * (h ? 1.2 : 0.35)), [Le, ie]);
        })
        .sort((ie, oe) => oe[0] - ie[0]);
      return O[Math.floor(Math.random() * Math.min(4, O.length))][1];
    }
    function M() {
      if (((o.load = fi(e.prim, "pistol", h ? 2 : 1, "shovel")), h))
        for (let U of [o.load.prim, o.load.sec]) {
          let O = o.load.ammo[U];
          O.res = Math.round(O.res * 1.5);
        }
      ((o.helm = 0), (o.vest = 0));
      let B = b();
      (o.spawn(B[0], B[1], Math.atan2(-(x - B[0]), -(_ - B[1]))), (o.prot = h ? 1 : 2.5), (a("#dead").hidden = !0));
    }
    let A = (m.items || []).map(([B, U, O]) => {
        if (!s.AI.passable(U, O)) {
          let ie = s.AI.randomCellNear(U, O, 0, 5);
          ((U = ie[0]), (O = ie[1]));
        }
        return { t: B, x: U, z: O, it: s.pickups.add(B, U, O), w: 0 };
      }),
      E = (B) => {
        let U = Math.random();
        U < 0.16
          ? (s.pickups.add("ammo", B.pos.x, B.pos.z).ttl = 30)
          : U < 0.22
            ? (s.pickups.add("med", B.pos.x, B.pos.z).ttl = 30)
            : U < 0.24 && (s.pickups.add("gren", B.pos.x, B.pos.z).ttl = 30);
      };
    if (l) {
      let B = [0, 0];
      for (let U of i.players()) {
        let O = U.presence.gm;
        O && O.id === d.id && (U.presence.tm === 0 || U.presence.tm === 1) && B[U.presence.tm]++;
      }
      u.tm = B[0] < B[1] ? 0 : B[1] < B[0] ? 1 : Math.random() < 0.5 ? 0 : 1;
    }
    let w = null,
      P = 0,
      N = [0, 0, 10],
      z = null;
    h &&
      ((w = r0(s, { night: !!t.night, spawns: v, bite: (B, U, O) => R(B, U, O), onProxyDeath: (B) => E(B) })),
      (u.Z = w),
      (w.onWave = (B) => {
        (s.hud.big("OLEADA " + B, "Vienen " + w.W.left), r.siren());
      }),
      (w.onWaveEnd = (B) => {
        s.hud.big("OLEADA " + B + " SUPERADA", "La pr\xF3xima en 15 s \xB7 los ca\xEDdos vuelven");
      }));
    let T = () => {
      let B = [{ u: o, pos: o.pos, alive: o.alive && d.ph === "play", spd: o.spd || 0, crouch: o.crouchK > 0.5 }];
      for (let U of u.remotes.values()) Je(U.pr.mid) === d.id && B.push({ u: U, pos: U.pos, alive: U.alive, spd: U.spd, crouch: U.crouchK > 0.5 });
      return B.map((U) => Object.assign(U.u.__zp || (U.u.__zp = {}), U));
    };
    function R(B, U, O) {
      d.ph === "play" &&
        (B.u === o
          ? (o.alive && s.combat.damage(o, U, !1, O, "zombie"), r.bite())
          : B.u.remote && B.u.alive && y(g.hits, [B.u.peer, Math.round(U), ++p.n, 0, "zombie"], 8));
    }
    let L = 0;
    function V(B, U) {
      let O = u.remotes.get(B);
      if (O) return O;
      let ie = l ? xa[U.tm === 1 ? 1 : 0].tint : zc[Je(U.c) | 0] || "#6f7682",
        oe = gs(t, { team: 1, tint: ie });
      return (
        oe.setVisible(!1),
        (O = {
          id: B,
          peer: B,
          remote: !0,
          team: 100 + ++L,
          name: "Jugador",
          pos: new C(),
          vel: new C(),
          yaw: 0,
          pitch: 0,
          hp: 100,
          helm: 0,
          vest: 0,
          alive: !1,
          char: oe,
          w: "rifle",
          tgt: new C(),
          tv: new C(),
          rt: 0,
          tyaw: 0,
          tpitch: 0,
          first: !0,
          lastHit: 0,
          lastDl: 0,
          lastSh: 0,
          lastGr: 0,
          lastZk: 0,
          crouchK: 0,
          spd: 0,
          shotT: -9,
          loud: !1,
          pr: {},
          seen: !1,
          stepT: 0,
        }),
        (O.load = { cur: () => O.w }),
        (O.uteam = O.team),
        s.units.push(O),
        u.remotes.set(B, O),
        O
      );
    }
    function G(B) {
      let U = u.remotes.get(B);
      if (!U) return;
      U.char.dispose();
      let O = s.units.indexOf(U);
      (O >= 0 && s.units.splice(O, 1), u.remotes.delete(B), U.tag && U.tag.remove());
    }
    let W = (B) => (B === i.myPeer ? "Vos" : B === "zombie" ? "Zombi" : (u.remotes.get(B) || {}).name || "\xBF?");
    function q() {
      let B = i.myPeer,
        U = s.mpJT;
      for (let [O, ie] of u.remotes) {
        if (Je(ie.pr.mid) !== d.id && d.ph === "play" && !ie.pr.gm) continue;
        let oe = Je(ie.pr.jt, 1 / 0);
        (oe < U || (oe === U && O < B)) && ((B = O), (U = oe));
      }
      return B;
    }
    u.iAmHost = () => !i.room || !i.myPeer || q() === i.myPeer;
    function Z(B, U) {
      let O = Tf(B, e.arenas);
      if (!O) return;
      let ie = U === q();
      if (O.id > d.id) $(O);
      else if (O.id === d.id && ie) {
        if (O.ph !== d.ph || O.map !== d.map || O.md !== d.md) $(O);
        else if (!h || O.ph === "end") {
          let oe = t.time + O.rem;
          Math.abs(oe - d.end) > 1.5 && (d.end = oe);
        }
      }
    }
    function $(B) {
      if (u.dead) return;
      if (B.map !== d.map || B.md !== d.md) {
        ((u.dead = !0), e.reload(B));
        return;
      }
      let U = B.id !== d.id;
      ((d.id = B.id), (d.ph = B.ph), (d.end = t.time + B.rem), B.ph === "play" && (U || u.ended) ? H() : B.ph === "end" && te());
    }
    function H() {
      ((u.kills = 0),
        (u.deaths = 0),
        (u.vote = null),
        (u.ended = !1),
        (u.result = ""),
        (a("#mpend").hidden = !0),
        w && (w.clear(), (w.sim = u.iAmHost()), (N = [0, 0, 10])),
        M(),
        s.hud.big("NUEVA PARTIDA", e.arenaName + (h ? " \xB7 primera oleada en 10 s" : " \xB7 " + ya(d.end - t.time))),
        K());
    }
    function K() {
      if (!s.input.touch) {
        let B = t.renderer.domElement;
        B.requestPointerLock && B.requestPointerLock();
      }
    }
    u.onPeers = (B) => {
      if (!u.dead) {
        for (let U of B.left) G(U.peer);
        for (let U of [...B.joined, ...B.updated]) !U.sameTab && U.kind === "viewer" && ce(U);
      }
    };
    function ce(B) {
      let U = B.presence;
      if (!U || U.pz !== 1) {
        G(B.peer);
        return;
      }
      if ((U.gm && Z(U.gm, B.peer), u.dead)) return;
      let O = V(B.peer, U);
      ((O.pr = U), (O.name = String(U.n || "Jugador").slice(0, 14)), (O.mate = h || (l && U.tm === u.tm)), (O.team = O.mate ? s.myTeam : l ? 1 : O.uteam));
      let ie = xs(U.hits),
        oe = xs(U.dl),
        me = Ef(ie, 2),
        Le = Ef(oe, 1),
        Q = xs(U.gr),
        he = xs(U.zk),
        Ze = Ef(he, 2),
        Fe = xs(U.p),
        Oe = performance.now() / 1e3;
      if (Fe.length === 3) {
        let Ke = Je(Fe[0]),
          Be = Je(Fe[1]),
          Ne = Je(Fe[2]);
        if (O.rt && !O.first) {
          let xe = Math.max(0.033, Oe - O.rt);
          (O.tv.set((Ke - O.tgt.x) / xe, 0, (Ne - O.tgt.z) / xe), O.tv.length() > 12 && O.tv.set(0, 0, 0));
        }
        (O.tgt.set(Ke, Be, Ne), (O.rt = Oe));
      }
      let Ie = xs(U.r);
      ((O.tyaw = Je(Ie[0])),
        (O.tpitch = Je(Ie[1])),
        (O.w = dt[U.w] ? U.w : "rifle"),
        (O.hp = Je(U.hp, 100)),
        (O.cr = !!U.cr),
        (O.ads = !!U.ad),
        (O.rl = !!U.rl));
      let Te = B.peer === q();
      if (O.first)
        ((O.first = !1), (O.lastHit = me), (O.lastDl = Le), (O.lastSh = Je(U.sh)), (O.lastGr = Je(Q[0])), (O.lastZk = Ze), O.pos.copy(O.tgt), (O.yaw = O.tyaw));
      else {
        let Ke = Je(U.mid) === d.id && d.ph === "play";
        for (let Be of ie) {
          if (!Array.isArray(Be) || Je(Be[2]) <= O.lastHit) continue;
          let Ne = Be[0],
            xe = Math.min(250, Math.max(0, Je(Be[1]))),
            X = String(Be[4] || "");
          if (Ke) {
            if (h && typeof Ne == "string" && Ne.startsWith("z:")) {
              w.sim && w.hitById(Je(+Ne.slice(2)) | 0, xe, !!Be[3], O, X);
              continue;
            }
            Ne !== i.myPeer ||
              !o.alive ||
              o.prot > 0 ||
              ((h ? X === "zombie" && Te : !O.mate) && s.combat.damage(o, xe, !!Be[3], h ? { name: "Zombi", zombie: !0, pos: O.pos } : O, X));
          }
        }
        O.lastHit = Math.max(O.lastHit, me);
        for (let Be of oe) {
          if (!Array.isArray(Be) || Je(Be[1]) <= O.lastDl) continue;
          let Ne = Be[0],
            xe = !!Be[3],
            X = Ne === i.myPeer;
          (s.hud.feed(Ne === "self" ? O.name : W(Ne), O.name, xe, { k: X || (u.remotes.get(Ne) || {}).mate ? "ally" : "foe", v: O.mate ? "ally" : "foe" }),
            X && Ke && !O.mate && (u.kills++, s.hud.hitmarker(xe, !0), s.hud.points(xe ? "BAJA A LA CABEZA  +1" : "BAJA  +1", xe ? "head" : "")));
        }
        if (((O.lastDl = Math.max(O.lastDl, Le)), h && Te)) {
          for (let Be of he)
            !Array.isArray(Be) ||
              Je(Be[2]) <= O.lastZk ||
              (Be[1] === i.myPeer &&
                Ke &&
                (u.kills++, s.hud.hitmarker(!!Be[3], !0), s.hud.points(Be[3] ? "ZOMBI A LA CABEZA  +1" : "ZOMBI  +1", Be[3] ? "head" : "")));
          O.lastZk = Math.max(O.lastZk, Ze);
        }
        if ((Je(U.sh) > O.lastSh && ((O.lastSh = Je(U.sh)), fe(O, xs(U.se))), Q.length === 7 && Je(Q[0]) > O.lastGr)) {
          O.lastGr = Je(Q[0]);
          let Be = new C(Je(Q[4]), Je(Q[5]), Je(Q[6]));
          Be.length() < 40 && s.combat.throwNade(O, new C(Je(Q[1]), Je(Q[2]), Je(Q[3])), null, 0, { v: Be, visual: !0 });
        }
      }
      h && Te && !u.iAmHost() && ((w.sim = !1), (z = B.peer), w.apply(U.zb), Array.isArray(U.zw) && (N = U.zw.map((Ke) => Je(Ke))));
      let Ve = !!U.al;
      (Ve && !O.alive
        ? ((O.alive = !0), O.char.revive(), O.pos.copy(O.tgt), (O.yaw = O.tyaw), O.char.setVisible(!0))
        : !Ve && O.alive && ((O.alive = !1), O.char.die(Math.random() < 0.5 ? -1 : 1)),
        !O.char.root.visible && (O.alive || O.char.deadT < 5) && O.char.setVisible(O.alive));
    }
    function fe(B, U) {
      let O = dt[B.w];
      if (!O) return;
      ((B.shotT = t.time), (B.loud = !O.silent));
      let ie = B.alive ? B.char.muzzle() : B.pos.clone().setY(B.pos.y + 1.4);
      if ((w && w.sim && w.noise(B.pos.x, B.pos.z, vf(B.w) || (O.melee ? 0 : 6)), O.melee)) {
        r.shot(O.silent ? "silent" : "shovel", ie, !1);
        return;
      }
      if (U.length === 3) {
        let oe = new C(Je(U[0]), Je(U[1]), Je(U[2]));
        (oe.distanceTo(ie) < 320 && (s.FX.tracer(ie, oe, B.mate ? 0 : 1), s.FX.puff(oe, [0, 1, 0], "dust")),
          O.silent || s.FX.muzzle(ie, oe.clone().sub(ie).normalize(), B.w === "shotgun" || B.w === "sniper"));
      }
      r.shot(O.silent ? "silent" : B.w, ie, !1);
    }
    ((s.netHit = (B, U, O, ie) => {
      d.ph !== "play" ||
        !B.alive ||
        (!B.zombie && B.mate) ||
        (y(g.hits, [B.peer, Math.round(U), ++p.n, O ? 1 : 0, String(ie || "")], 10), s.hud.hitmarker(O, !1));
    }),
      (u.noise = (B, U, O) => {
        w && w.sim && w.noise(B, U, O);
      }));
    let de = o.shotT || 0,
      be = o.swingT || 0,
      Ee = o.nadeT || 0,
      ye = 0,
      ge = (B) => Math.round(B * 100) / 100;
    function k(B) {
      if (!i.room) return;
      let U = performance.now();
      if (!B && U - ye < 66) return;
      ye = U;
      let O = h && w.sim;
      i.send({
        pz: 1,
        jt: s.mpJT,
        n: e.nick,
        c: e.col,
        tm: l ? u.tm : null,
        p: [ge(o.pos.x), ge(o.pos.y), ge(o.pos.z)],
        r: [ge(o.yaw), ge(o.pitch)],
        w: o.load.cur(),
        hp: Math.round(o.hp),
        al: o.alive ? 1 : 0,
        cr: o.crouchK > 0.5 ? 1 : 0,
        ad: o.ads ? 1 : 0,
        rl: o.load.reload > 0 ? 1 : 0,
        k: u.kills,
        d: u.deaths,
        mid: d.id,
        sh: p.sh,
        se: g.se,
        hits: g.hits,
        dl: g.dl,
        gr: g.gr,
        zb: O ? w.pack() : null,
        zw: O ? w.wave() : null,
        zk: O ? g.zk : null,
        gm: { id: d.id, ph: d.ph, map: d.map, md: c, rem: Math.max(0, Math.round(d.end - t.time)) },
        vt: u.vote !== null ? [d.id, u.vote] : null,
      });
    }
    let ue = 0,
      re = "";
    u.onKill = (B, U, O, ie) => {
      if (B.zombie) {
        E(B);
        let me = U === o ? i.myPeer || "me" : U && U.peer;
        (y(g.zk, [B.zid, me || "", ++p.n, O ? 1 : 0], 12), U === o && (u.kills++, s.hud.points(O ? "ZOMBI A LA CABEZA  +1" : "ZOMBI  +1", O ? "head" : "")));
        return;
      }
      if (B !== o) return;
      (u.deaths++, (ue = 0));
      let oe = !U || U === o;
      ((re = oe ? "" : U.name || "Zombi"),
        y(g.dl, [oe ? "self" : U.zombie ? "zombie" : U.peer, ++p.n, String(ie || ""), O ? 1 : 0], 6),
        s.hud.feed(oe ? "Vos" : re, "Vos", O, { k: "foe", v: "ally" }),
        k(!0));
    };
    let le = () => h && (w.sim ? w.W.brk > 0 : N[2] > 0);
    ((u.deathTick = (B) => {
      if (o.alive || u.ended) {
        o.alive && (a("#dead").hidden = !0);
        return;
      }
      if (
        ((ue += B),
        (a("#dead").hidden = !1),
        (a("#dead b").textContent = re ? (re === "Zombi" ? "Te agarr\xF3 un zombi" : "Te baj\xF3 " + re) : "Ca\xEDste"),
        h)
      ) {
        ((a("#dead span").textContent = le() ? "Volv\xE9s ya" : "Volv\xE9s cuando termine la oleada \xB7 mir\xE1 a tus compa\xF1eros"),
          le() && ue > 1.5 && d.ph === "play" && M());
        return;
      }
      let U = Pb - ue;
      ((a("#dead span").textContent = "Reaparec\xE9s en " + Math.max(1, Math.ceil(U))), U <= 0 && d.ph === "play" && M());
    }),
      (u.rows = () => {
        let B = [{ n: e.nick + " (vos)", k: u.kills, d: u.deaths, c: e.col, tm: u.tm, me: !0 }];
        for (let U of u.remotes.values())
          Je(U.pr.mid) === d.id && B.push({ n: U.name, k: Je(U.pr.k), d: Je(U.pr.d), c: Je(U.pr.c) | 0, tm: U.pr.tm === 1 ? 1 : 0 });
        return B.sort((U, O) => O.k - U.k || U.d - O.d);
      }),
      (u.teamScore = () => {
        let B = [0, 0];
        for (let U of u.rows()) B[U.tm] += U.k;
        return B;
      }),
      (u.table = (B) => {
        if (((B.textContent = ""), l)) {
          let O = u.teamScore(),
            ie = document.createElement("p");
          ((ie.className = "tscore"),
            (ie.innerHTML = '<b style="color:' + xa[0].col + '">AZUL ' + O[0] + '</b> \xB7 <b style="color:' + xa[1].col + '">ROJO ' + O[1] + "</b>"),
            B.appendChild(ie));
        }
        if (h) {
          let O = document.createElement("p");
          ((O.className = "tscore"),
            (O.textContent = d.ph === "end" && u.result ? u.result : "Oleada " + Math.max(1, h ? (w.sim ? w.W.n : N[0]) : 0)),
            B.appendChild(O));
        }
        let U = document.createElement("table");
        ((U.className = "score"),
          (U.innerHTML = "<tr><th></th><th>Jugador</th><th>" + (h ? "Zombis" : "Bajas") + "</th><th>Ca\xEDdas</th></tr>"),
          u.rows().forEach((O, ie) => {
            let oe = document.createElement("tr");
            O.me && (oe.className = "me");
            let me = document.createElement("td");
            me.textContent = ie + 1;
            let Le = document.createElement("i");
            ((Le.style.background = l ? xa[O.tm].col : zc[O.c] || "#888"), me.prepend(Le));
            let Q = document.createElement("td");
            Q.textContent = O.n;
            let he = document.createElement("td");
            he.textContent = O.k;
            let Ze = document.createElement("td");
            ((Ze.textContent = O.d), oe.append(me, Q, he, Ze), U.appendChild(oe));
          }),
          B.appendChild(U));
      }));
    function te() {
      if (u.ended) return;
      ((u.ended = !0), (a("#dead").hidden = !0), (o.ads = !1), document.exitPointerLock && document.exitPointerLock());
      let B = u.rows(),
        U;
      if (h) {
        let ie = Math.max(1, w.sim ? w.W.n : N[0]);
        ((U = "CAYERON EN LA OLEADA " + ie), (u.result = "Aguantaron hasta la oleada " + ie));
      } else if (l) {
        let ie = u.teamScore();
        U = ie[0] === ie[1] ? "EMPATE" : (ie[0] > ie[1] ? "GAN\xD3 AZUL" : "GAN\xD3 ROJO") + (ie[0] > ie[1] == (u.tm === 0) ? " \xB7 \xA1TU EQUIPO!" : "");
      } else U = B[0] && B[0].k > 0 ? (B[0].me ? "\xA1GANASTE!" : "GAN\xD3 " + B[0].n.toUpperCase()) : "FIN DE LA PARTIDA";
      ((a("#mpend h2").textContent = U), u.table(a("#mpendt")));
      let O = a("#mpvote");
      ((O.textContent = ""),
        e.names.forEach((ie, oe) => {
          let me = document.createElement("button");
          ((me.type = "button"),
            (me.className = "chip"),
            (me.dataset.i = oe),
            (me.textContent = ie),
            (me.onclick = () => {
              ((u.vote = oe), k(!0), ve());
            }),
            O.appendChild(me));
        }),
        (a("#mpend").hidden = !1),
        ve());
    }
    function Ce() {
      let B = e.names.map(() => 0);
      u.vote !== null && B[u.vote]++;
      for (let U of u.remotes.values()) {
        let O = xs(U.pr.vt);
        Je(O[0]) === d.id && B[Je(O[1], -1)] !== void 0 && B[Je(O[1])]++;
      }
      return B;
    }
    function ve() {
      let B = Ce();
      document.querySelectorAll("#mpvote button").forEach((U) => {
        let O = +U.dataset.i;
        (U.classList.toggle("on", u.vote === O), (U.textContent = e.names[O] + (B[O] ? " \xB7 " + B[O] : "")));
      });
    }
    let D = 0,
      I = 0,
      J = new C();
    return (
      (u.update = (B, U) => {
        if (u.dead) return;
        let O = d.end - t.time,
          ie = u.iAmHost();
        if (ie) {
          if (d.ph === "play" && !h && O <= 0) ((d.ph = "end"), (d.end = t.time + o0), te());
          else if (d.ph === "play" && h && w.W.n > 0 && T().every((Q) => !Q.alive)) ((d.ph = "end"), (d.end = t.time + o0), te(), k(!0));
          else if (d.ph === "end" && O <= 0) {
            let Q = Ce(),
              he = h ? d.map : (d.map + 1) % e.arenas,
              Ze = 0;
            if (
              (Q.forEach((Fe, Oe) => {
                Fe > Ze && ((Ze = Fe), (he = Oe));
              }),
              $({ id: d.id + 1, ph: "play", map: he, md: c, rem: va }),
              u.dead)
            )
              return;
          }
          h && (d.end = Math.max(d.end, d.ph === "play" ? t.time + va : d.end));
        } else d.ph === "play" && !h && O <= 0 && te();
        if (
          (u.ended && (ve(), (a("#mpendc").textContent = d.ph === "end" ? "Pr\xF3xima partida en " + ya(d.end - t.time) : "Esperando al anfitri\xF3n\u2026")),
          h)
        )
          if ((ie && !w.sim && w.takeOver(N), w.sim))
            if (d.ph === "play") w.simulate(B, T());
            else for (let Q of w.list.values()) Q.char.update(B, {});
          else w.follow(B);
        for (let Q of A) s.pickups.items.includes(Q.it) || ((Q.w += B), Q.w > 20 && ((Q.it = s.pickups.add(Q.t, Q.x, Q.z)), (Q.w = 0)));
        if (
          (o.shotT !== de && ((de = o.shotT), p.sh++, (g.se = o.lastEnd ? [ge(o.lastEnd.x), ge(o.lastEnd.y), ge(o.lastEnd.z)] : null)),
          o.swingT !== be && ((be = o.swingT), p.sh++, (g.se = null)),
          o.nadeT !== Ee && o.lastNade)
        ) {
          Ee = o.nadeT;
          let Q = o.lastNade;
          g.gr = [++p.n, ge(Q.o.x), ge(Q.o.y), ge(Q.o.z), ge(Q.v.x), ge(Q.v.y), ge(Q.v.z)];
        }
        let oe = performance.now() / 1e3,
          me = 1 - Math.exp(-B * 14);
        D -= B;
        let Le = D <= 0;
        Le && (D = 0.2);
        for (let Q of u.remotes.values()) {
          let he = Math.min(0.12, oe - Q.rt),
            Ze = Q.tgt.x + Q.tv.x * he,
            Fe = Q.tgt.z + Q.tv.z * he,
            Oe = Q.pos.x,
            Ie = Q.pos.z;
          Math.hypot(Ze - Oe, Fe - Ie) > 6
            ? Q.pos.set(Ze, Q.tgt.y, Fe)
            : ((Q.pos.x += (Ze - Oe) * me), (Q.pos.z += (Fe - Ie) * me), (Q.pos.y += (Q.tgt.y - Q.pos.y) * me));
          let Te = Q.tyaw - Q.yaw;
          ((Te = Math.atan2(Math.sin(Te), Math.cos(Te))), (Q.yaw += Te * Math.min(1, B * 16)), (Q.pitch += (Q.tpitch - Q.pitch) * Math.min(1, B * 16)));
          let Ve = Q.pos.x - Oe,
            Ke = Q.pos.z - Ie,
            Be = Math.hypot(Ve, Ke) / Math.max(B, 0.001);
          ((Q.spd += (Be - Q.spd) * Math.min(1, B * 8)),
            (Q.crouchK += ((Q.cr ? 1 : 0) - Q.crouchK) * Math.min(1, B * 10)),
            Q.alive && Q.spd > 1.2 && ((Q.stepT -= (B * Q.spd) / 2.2), Q.stepT <= 0 && ((Q.stepT = 1), r.step(Q.pos, !1))));
          let Ne = Q.char;
          (Ne.root.position.copy(Q.pos), (Ne.root.rotation.y = Q.yaw), Ne.setWeapon($n(Q.w)));
          let xe = Math.sin(Q.yaw),
            X = Math.cos(Q.yaw),
            Se = Math.hypot(Ve, Ke) || 1;
          if (
            (Ne.update(
              B,
              Q.alive
                ? {
                    speed: Q.spd,
                    fw: (-Ve * xe - Ke * X) / Se,
                    sd: (Ve * X - Ke * xe) / Se,
                    pitch: Q.pitch,
                    aim: Q.ads,
                    crouch: Q.crouchK,
                    reload: Q.rl ? 0.5 : 0,
                  }
                : {},
            ),
            Q.tag || ((Q.tag = document.createElement("i")), a("#ntags").appendChild(Q.tag)),
            Le)
          ) {
            let ke = Q.pos.distanceTo(o.pos);
            Q.seen = Q.alive && (Q.mate ? ke < 120 : ke < 55 && n.los(t.camera.position, J.set(Q.pos.x, Q.pos.y + 1.5, Q.pos.z)));
          }
          let Me = !1;
          (Q.seen &&
            (J.set(Q.pos.x, Q.pos.y + 2.05 - 0.45 * Q.crouchK, Q.pos.z).project(t.camera),
            J.z < 1 &&
              Math.abs(J.x) < 1.05 &&
              Math.abs(J.y) < 1.05 &&
              ((Me = !0), (Q.tag.style.left = ((J.x + 1) / 2) * innerWidth + "px"), (Q.tag.style.top = ((1 - J.y) / 2) * innerHeight + "px"))),
            (Q.tag.hidden = !Me),
            (Q.tag.className = Q.mate ? "ally" : ""),
            Me && Q.tag.textContent !== Q.name && (Q.tag.textContent = Q.name));
        }
        (k(!1), (a("#mpscore").hidden = !(s.input.down("score") && !u.ended)), a("#mpscore").hidden || u.table(a("#mpscore")));
      }),
      (u.hud = () => {
        let B = u.rows(),
          U = B[0],
          O = B.length,
          ie = s.input.touch ? "" : " \xB7 Tab: tabla";
        if (h) {
          let oe = w.sim ? w.wave() : N,
            me = T(),
            Le = me.filter((Q) => Q.alive).length;
          return {
            step: "ZOMBIS \xB7 " + e.arenaName.toUpperCase(),
            title:
              d.ph !== "play"
                ? "FIN"
                : oe[0] < 1 || oe[2] > 0
                  ? (oe[0] < 1 ? "Primera oleada" : "Oleada " + (oe[0] + 1)) + " en " + ya(oe[2])
                  : "OLEADA " + oe[0] + " \xB7 quedan " + oe[1],
            prog: "Vos " + u.kills + " zombis \xB7 " + (me.length > 1 ? "en pie " + Le + " de " + me.length : "solo") + ie,
            bar: null,
          };
        }
        if (l) {
          let oe = u.teamScore();
          return {
            step: "POR EQUIPOS \xB7 " + e.arenaName.toUpperCase() + " \xB7 SOS " + xa[u.tm].name,
            title: d.ph === "play" ? ya(d.end - t.time) : "FIN",
            prog: "AZUL " + oe[0] + " \xB7 ROJO " + oe[1] + " \xB7 vos " + u.kills + ie,
            bar: null,
          };
        }
        return {
          step: "TODOS CONTRA TODOS \xB7 " + e.arenaName.toUpperCase(),
          title: d.ph === "play" ? ya(d.end - t.time) : "FIN",
          prog: "Vos " + u.kills + " bajas" + (O > 1 ? " \xB7 " + (U.me ? "vas primero" : "l\xEDder " + U.n + " " + U.k) : " \xB7 solo en la sala") + ie,
          bar: null,
        };
      }),
      (u.marks = () => {
        let B = [];
        for (let U of u.remotes.values())
          U.alive &&
            (U.mate ? B.push({ x: U.pos.x, z: U.pos.z, c: "#4da3ff" }) : U.loud && t.time - U.shotT < 2 && B.push({ x: U.pos.x, z: U.pos.z, c: "#e0503f" }));
        if (w) for (let U of w.list.values()) U.alive && U.st >= 1 && U.pos.distanceTo(o.pos) < 30 && B.push({ x: U.pos.x, z: U.pos.z, c: "#9fd65a" });
        return { R: B, C: [] };
      }),
      (u.start = () => {
        s.fpOnly = !0;
        for (let B of i.peers.values()) ce(B);
        u.dead || (w && (w.sim = u.iAmHost()), M(), k(!0), d.ph === "end" && te());
      }),
      (u.clear = () => {
        ((u.dead = !0), (s.netHit = null), w && w.clear());
        for (let B of [...u.remotes.keys()]) G(B);
        ((a("#ntags").textContent = ""), (a("#mpend").hidden = !0), (a("#mpscore").hidden = !0), (a("#dead").hidden = !0));
      }),
      u
    );
  }
