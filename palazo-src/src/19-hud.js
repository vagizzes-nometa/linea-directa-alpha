  var Ot = (s) => document.querySelector(s);
  function t0(s) {
    let e = {},
      t = Ot("#radar"),
      n = t.getContext("2d"),
      i = Ot("#compass"),
      r = i.getContext("2d"),
      o = null,
      a = "",
      c = (y, m) => {
        let f = Ot(y);
        f && f.textContent !== m && (f.textContent = m);
      };
    e.show = (y) => {
      Ot("#hud").hidden = !y;
    };
    let h = 0;
    e.toast = (y) => {
      let m = Ot("#toast");
      ((m.textContent = y), m.classList.add("on"), (h = 2.2));
    };
    let l = 0;
    e.big = (y, m) => {
      (c("#bigmsg b", y), c("#bigmsg span", m || ""), Ot("#bigmsg").classList.add("on"), (l = 3));
    };
    let u = 0;
    ((e.hitmarker = (y, m) => {
      let f = Ot("#hitm");
      ((f.className = "on" + (y ? " head" : "") + (m ? " kill" : "")), (u = 0.18), s.AU.hit(y));
    }),
      (e.feed = (y, m, f, v) => {
        let x = Ot("#feed"),
          _ = document.createElement("div");
        _.innerHTML = "";
        let S = document.createElement("span");
        ((S.textContent = y), (S.className = v.k));
        let b = document.createElement("i");
        b.textContent = f ? " \u2715 cabeza " : " \u2715 ";
        let M = document.createElement("span");
        for (M.textContent = m, M.className = v.v, _.append(S, b, M), x.prepend(_), setTimeout(() => _.remove(), 5e3); x.children.length > 5;)
          x.lastChild.remove();
      }));
    let d = [];
    ((e.damageFrom = (y, m) => {
      y && d.push({ x: y.pos.x, z: y.pos.z, t: 1.2 });
    }),
      (e.points = (y, m) => {
        let f = Ot("#pts");
        ((f.textContent = y), (f.className = "on " + (m || "")), clearTimeout(f._t), (f._t = setTimeout(() => (f.className = ""), 1100)));
      }));
    function p() {
      let y = s.map,
        m = y.bounds,
        f = 512,
        v = document.createElement("canvas");
      v.width = v.height = f;
      let x = v.getContext("2d"),
        _ = f / (m.x1 - m.x0),
        S = f / (m.z1 - m.z0);
      ((x.fillStyle = y.env === "night" ? "#1c2430" : "#4a5440"), x.fillRect(0, 0, f, f), (x.fillStyle = y.env === "night" ? "#7d8da3" : "#c9c3a8"));
      for (let b of s.P.boxes)
        (b.y1 - b.y0 < 0.6 && b.tag !== "bag") ||
          x.fillRect((b.x0 - m.x0) * _, (b.z0 - m.z0) * S, Math.max(1, (b.x1 - b.x0) * _), Math.max(1, (b.z1 - b.z0) * S));
      return { c: v, sx: _, sz: S };
    }
    ((e.drawRadar = (y, m) => {
      a !== s.map.id && ((o = p()), (a = s.map.id));
      let f = t.width / 2,
        v = s.map.bounds,
        x = 2.6;
      (n.save(),
        n.clearRect(0, 0, t.width, t.height),
        n.beginPath(),
        n.arc(f, f, f - 2, 0, 6.283),
        n.clip(),
        (n.fillStyle = "#10141a"),
        n.fillRect(0, 0, 2 * f, 2 * f),
        n.translate(f, f),
        n.rotate(y.yaw),
        n.scale(x, x),
        n.translate(-y.pos.x, -y.pos.z),
        (n.globalAlpha = 0.85),
        n.drawImage(o.c, v.x0, v.z0, v.x1 - v.x0, v.z1 - v.z0),
        (n.globalAlpha = 1));
      for (let _ of m)
        if (_.cone) {
          (n.save(), n.translate(_.x, _.z), (n.fillStyle = _.cc), n.beginPath(), n.moveTo(0, 0));
          let S = Math.atan2(-Math.cos(_.yaw), -Math.sin(_.yaw));
          (n.arc(0, 0, _.cone, S - _.fov, S + _.fov), n.closePath(), n.fill(), n.restore());
        }
      for (let _ of m)
        (n.save(),
          n.translate(_.x, _.z),
          n.rotate(-y.yaw),
          _.ring && ((n.strokeStyle = _.c), (n.lineWidth = (1.2 / x) * 1.4), n.beginPath(), n.arc(0, 0, _.ring, 0, 6.283), n.stroke()),
          _.t
            ? ((n.fillStyle = _.c),
              n.beginPath(),
              n.arc(0, 0, (4.2 / x) * 2, 0, 6.283),
              n.fill(),
              (n.fillStyle = "#fff"),
              (n.font = `700 ${10 / x}px sans-serif`),
              (n.textAlign = "center"),
              (n.textBaseline = "middle"),
              n.fillText(_.t, 0, 0.4))
            : ((n.fillStyle = _.c), n.beginPath(), n.arc(0, 0, (2.6 / x) * (_.big ? 1.5 : 1), 0, 6.283), n.fill()),
          n.restore());
      (n.restore(),
        (n.fillStyle = "#ffd27a"),
        n.beginPath(),
        n.moveTo(f, f - 7),
        n.lineTo(f + 5, f + 5),
        n.lineTo(f, f + 2),
        n.lineTo(f - 5, f + 5),
        n.fill(),
        (n.strokeStyle = "rgba(255,255,255,.35)"),
        (n.lineWidth = 2),
        n.beginPath(),
        n.arc(f, f, f - 2, 0, 6.283),
        n.stroke());
    }),
      (e.drawCompass = (y, m) => {
        let f = i.width,
          v = i.height;
        r.clearRect(0, 0, f, v);
        let x = f / (Math.PI * 0.9),
          _ = -y;
        ((r.font = "600 11px sans-serif"), (r.textAlign = "center"), (r.fillStyle = "rgba(255,255,255,.8)"));
        let S = [
          ["N", 0],
          ["NE", Math.PI / 4],
          ["E", Math.PI / 2],
          ["SE", Math.PI * 0.75],
          ["S", Math.PI],
          ["SO", -Math.PI * 0.75],
          ["O", -Math.PI / 2],
          ["NO", -Math.PI / 4],
        ];
        for (let b = -Math.PI; b < Math.PI; b += Math.PI / 12) {
          let M = ((b - _ + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
            A = f / 2 + M * x;
          A < 0 || A > f || r.fillRect(A, v - 6, 1, 4);
        }
        for (let [b, M] of S) {
          let A = ((M - _ + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
            E = f / 2 + A * x;
          E < 8 || E > f - 8 || ((r.fillStyle = b === "N" ? "#ffd27a" : "rgba(255,255,255,.85)"), r.fillText(b, E, 13));
        }
        for (let b of m) {
          let M = ((b.a - _ + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
            A = Math.max(8, Math.min(f - 8, f / 2 + M * x));
          ((r.fillStyle = b.c),
            r.beginPath(),
            r.arc(A, 24, 6, 0, 6.283),
            r.fill(),
            (r.fillStyle = "#fff"),
            (r.font = "700 9px sans-serif"),
            r.fillText(b.t, A, 27));
        }
      }));
    let g = "";
    return (
      (e.team = (y) => {
        let m = Ot("#teamp"),
          f = y.map((v) => v.name + v.hp + v.alive + v.me + v.ch).join("|");
        if (f !== g) {
          ((g = f), (m.textContent = ""));
          for (let v of y) {
            let x = document.createElement("div");
            ((x.className = (v.me ? "me " : "") + (v.alive ? "" : "dead")),
              (x.innerHTML = "<b></b><span></span><i><s></s></i>"),
              (x.querySelector("b").textContent = v.name + (v.me ? " (vos)" : "")),
              (x.querySelector("span").textContent = v.role + (v.ch ? " \xB7 " + v.ch + " carga" + (v.ch > 1 ? "s" : "") : "")),
              (x.querySelector("s").style.width = v.hp + "%"),
              m.appendChild(x));
          }
        }
      }),
      (e.charge = (y) => {
        let m = Ot("#chargeb");
        ((m.hidden = !(y > 0)), y > 0 && (m.firstChild.style.width = Math.round(y * 100) + "%"));
      }),
      (e.update = (y, m) => {
        (h > 0 && ((h -= y), h <= 0 && Ot("#toast").classList.remove("on")),
          l > 0 && ((l -= y), l <= 0 && Ot("#bigmsg").classList.remove("on")),
          u > 0 && ((u -= y), u <= 0 && (Ot("#hitm").className = "")));
        let f = m.load,
          v = f.cur(),
          x = dt[v],
          _ = f.ammo[v];
        (c("#hp b", Math.ceil(m.hp)),
          (Ot("#hp i").style.width = m.hp + "%"),
          Ot("#hp").classList.toggle("low", m.hp < 35),
          (Ot("#armor").hidden = !(m.vest > 0 || m.helm > 0)),
          c("#armor", (m.vest > 0 ? "Chaleco " : "") + (m.helm > 0 ? "Casco" : "")),
          c("#ammo b", x.melee ? "\u2014" : x.throw ? String(f.gren) : String(_ ? _.mag : 0)),
          c("#ammo span", x.melee || x.throw ? "" : " / " + (_ ? _.res : 0)),
          c("#wname", x.name + (f.reload > 0 ? " \xB7 recargando" : "")));
        let S = [f.prim, f.sec, f.melee || "shovel", f.gren > 0 ? "grenade" : null];
        document.querySelectorAll("#slots i").forEach((w, P) => {
          ((w.textContent = P + 1 + " " + (S[P] ? dt[S[P]].name + (P === 3 ? " \xD7" + f.gren : "") : "\u2014")),
            (w.className = P === f.slot ? "on" : S[P] ? "" : "off"));
        });
        let b = m.ads && x.scope && s.E.camera.fov < 40;
        Ot("#scope").hidden = !b;
        let M = Ot("#cross");
        ((M.hidden = b || (m.ads && m.tpK < 0.5 && !x.melee)), (Ot("#adsdot").hidden = !(m.ads && m.tpK < 0.5 && !b && !x.melee && !x.throw)));
        let A = Math.round(10 + (x.hip || 0) * 400 * (m.ads ? 0.3 : 1) + (m.moving ? 8 : 0));
        M.style.setProperty("--g", A + "px");
        let E = Ot("#dmgdir");
        ((E.textContent = ""), (d = d.filter((w) => (w.t -= y) > 0)));
        for (let w of d) {
          let P = Math.atan2(w.x - m.pos.x, -(w.z - m.pos.z)) + m.yaw,
            N = document.createElement("i");
          ((N.style.transform = `rotate(${P}rad)`), (N.style.opacity = Math.min(1, w.t)), E.appendChild(N));
        }
      }),
      e
    );
  }
