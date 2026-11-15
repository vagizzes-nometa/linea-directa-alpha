  var Pe = (s) => document.querySelector(s);
  function l0(s) {
    let e = {},
      t = ["#loading", "#home", "#camp", "#settings", "#pause", "#end", "#brief", "#ops", "#mp"];
    e.show = (d) => {
      for (let p of t) Pe(p).hidden = p !== d;
      ((Pe("#ui").hidden = !d), s.AU.ui && d && s.AU.ui(660));
    };
    let n = () => s.progress(),
      i = 0,
      r = "rifle",
      o = "pistol";
    function a() {
      let d = Pe("#mislist");
      d.textContent = "";
      let p = n();
      (Bi.forEach((y, m) => {
        let f = document.createElement("button");
        ((f.className = "card" + (m === i ? " on" : "")),
          (f.type = "button"),
          (f.innerHTML = `<div class="thumb t${m}"></div><b></b><span></span>`),
          (f.querySelector("b").textContent = m + 1 + ". " + y.name + (p[y.id] ? "  \u2713" : "")),
          (f.querySelector("span").textContent = y.card),
          (f.onclick = () => {
            ((i = m), a());
          }),
          d.appendChild(f));
      }),
        (Pe("#misdesc").textContent = Bi[i].desc));
      let g = (y, m, f, v) => {
        let x = Pe(v);
        x.textContent = "";
        for (let _ of y) {
          let S = document.createElement("button");
          ((S.type = "button"),
            (S.className = "chip" + (_ === m ? " on" : "")),
            (S.textContent = dt[_].name),
            (S.onclick = () => {
              (f(_), a());
            }),
            x.appendChild(S));
        }
      };
      (g(yf, r, (y) => (r = y), "#wprim"),
        g(Gg, o, (y) => (o = y), "#wsec"),
        document.querySelectorAll("#diff button").forEach((y) => y.classList.toggle("on", y.dataset.d === s.diff)),
        (Pe("#diffhint").textContent =
          $s[s.diff].tk +
          " refuerzos. " +
          {
            easy: "Enemigos pocos y lentos para reaccionar.",
            medium: "Enemigos que te buscan y mandan refuerzos.",
            hard: "M\xE1s enemigos, m\xE1s r\xE1pidos y m\xE1s punteros.",
          }[s.diff]));
    }
    (document.querySelectorAll("#diff button").forEach(
      (d) =>
        (d.onclick = () => {
          ((s.diff = d.dataset.d), (s.settings.diff = s.diff), s.saveSettings(), a());
        }),
    ),
      (Pe("#go-camp").onclick = () => {
        (a(), e.show("#camp"));
      }));
    let c = 0;
    function h() {
      let d = Pe("#oplist");
      d.textContent = "";
      let p = n();
      s.OPS.forEach((f, v) => {
        let x = document.createElement("button");
        ((x.className = "card" + (v === c ? " on" : "")),
          (x.type = "button"),
          (x.innerHTML = '<div class="thumb t1"></div><b></b><span></span>'),
          (x.querySelector("b").textContent = f.name + (p["op:" + f.id] ? "  \u2713" : "")),
          (x.querySelector("span").textContent = f.card),
          (x.onclick = () => {
            ((c = v), h());
          }),
          d.appendChild(x));
      });
      let g = s.OPS[c];
      Pe("#opdesc").textContent = g.desc;
      let y = Pe("#opteam");
      y.textContent = "";
      for (let f of g.team) {
        let v = document.createElement("li");
        ((v.textContent =
          f.name +
          " \xB7 " +
          f.role +
          " \u2014 " +
          dt[f.prim].name +
          " + " +
          dt[f.sec].name +
          (f.charges ? " \xB7 " + f.charges + " carga" + (f.charges > 1 ? "s" : "") : "")),
          y.appendChild(v));
      }
      let m = Pe("#optips");
      m.textContent = "";
      for (let f of g.tips) {
        let v = document.createElement("li");
        ((v.textContent = f), m.appendChild(v));
      }
      document.querySelectorAll("#odiff button").forEach((f) => f.classList.toggle("on", f.dataset.d === s.diff));
    }
    (document.querySelectorAll("#odiff button").forEach(
      (d) =>
        (d.onclick = () => {
          ((s.diff = d.dataset.d), (s.settings.diff = s.diff), s.saveSettings(), h());
        }),
    ),
      (Pe("#go-ops").onclick = () => {
        (h(), e.show("#ops"));
      }),
      (Pe("#ops-back").onclick = () => e.show("#home")),
      (Pe("#ops-go").onclick = () => {
        (s.AU.unlock(), s.startOp(c));
      }),
      document.querySelectorAll("#porders [data-o]").forEach(
        (d) =>
          (d.onclick = () => {
            let p = d.dataset.o;
            if (s.squad) {
              if (p === "fire") s.squad.toggleFire();
              else if (p === "move") {
                let g = s.squad.aimPoint();
                g ? s.squad.give("move", g) : s.toast("Apunt\xE1 a un lugar del suelo antes de pausar");
              } else s.squad.give(p);
              s.resume();
            }
          }),
      ),
      (e.team = () => {
        let d = Pe("#pscore");
        ((d.textContent = ""), s.mode && s.mode.kind === "dm" && s.playing && s.mode.table(d));
        let p = Pe("#pteam");
        if (((p.textContent = ""), (p.hidden = !s.squad), !s.squad)) return;
        let g = document.createElement("h3");
        ((g.textContent = "Tu equipo \xB7 toc\xE1 para manejarlo"), p.appendChild(g));
        for (let y of s.squad.hud()) {
          let m = document.createElement("button");
          ((m.type = "button"),
            (m.className = "big" + (y.me ? " on" : "")),
            (m.disabled = !y.alive || y.me),
            (m.innerHTML = "<b></b><span></span>"),
            (m.querySelector("b").textContent = y.name + " \xB7 " + y.role + (y.me ? " (ahora)" : "")),
            (m.querySelector("span").textContent = y.alive
              ? y.w + " \xB7 vida " + y.hp + (y.ch ? " \xB7 " + y.ch + " carga" + (y.ch > 1 ? "s" : "") : "")
              : "Ca\xEDdo"),
            (m.onclick = () => {
              (s.squad.take(y.u), s.resume());
            }),
            p.appendChild(m));
        }
      }));
    function l() {
      if (Pe("#mp").hidden) return;
      let d = s.net,
        p = s.mp,
        g = s.ARENAS,
        y = d.players(),
        m = s.roomGM(),
        f = y.length >= 6,
        v = Pe("#mpstat");
      ((v.className = d.state === "on" ? "on" : d.state === "off" ? "off" : ""),
        (v.textContent =
          d.state === "off"
            ? "Sin sala: el juego en l\xEDnea anda abri\xE9ndolo desde Claude (no en el archivo offline ni en la app instalada). Ac\xE1 pod\xE9s jugar solo: zombis completo o practicar en los mapas."
            : d.state === "on"
              ? "Conectado \xB7 " +
                (y.length
                  ? y.length + (y.length === 1 ? " jugador en partida" : " jugadores en partida")
                  : "nadie jugando todav\xEDa: si entr\xE1s, sos el anfitri\xF3n") +
                (d.peers.size > y.length ? " \xB7 " + (d.peers.size - y.length) + " mirando el men\xFA" : "")
              : "Conectando a la sala\u2026"));
      let x = Pe("#mpcol");
      ((x.textContent = ""),
        zc.forEach((E, w) => {
          let P = document.createElement("button");
          ((P.type = "button"),
            (P.className = "sw" + (w === p.col ? " on" : "")),
            (P.style.background = E),
            (P.title = "Color " + (w + 1)),
            P.setAttribute("aria-label", "Color " + (w + 1)),
            (P.onclick = () => {
              ((p.col = w), s.saveMP(), l());
            }),
            x.appendChild(P));
        }));
      let _ = Pe("#mpprim");
      _.textContent = "";
      for (let E of yf) {
        let w = document.createElement("button");
        ((w.type = "button"),
          (w.className = "chip" + (E === p.prim ? " on" : "")),
          (w.textContent = dt[E].name),
          (w.onclick = () => {
            ((p.prim = E), s.saveMP(), l());
          }),
          _.appendChild(w));
      }
      let S = Pe("#mpmode");
      S.textContent = "";
      for (let E in ki) {
        let w = document.createElement("button");
        w.type = "button";
        let P = m ? m.md === E : (p.md || "ffa") === E;
        ((w.className = "chip" + (P ? " on" : "")),
          (w.textContent = ki[E].name),
          (w.disabled = !!m),
          (w.onclick = () => {
            ((p.md = E), s.saveMP(), l());
          }),
          S.appendChild(w));
      }
      let b = Pe("#mpmap");
      ((b.textContent = ""),
        g.forEach((E, w) => {
          let P = document.createElement("button");
          P.type = "button";
          let N = m ? m.map === w : p.map === w;
          ((P.className = "chip" + (N ? " on" : "")),
            (P.textContent = E.name),
            (P.disabled = !!m),
            (P.onclick = () => {
              ((p.map = w), s.saveMP(), l());
            }),
            b.appendChild(P));
        }),
        (Pe("#mpmaphint").textContent = m
          ? "Te sum\xE1s a la partida en curso: " +
            ki[m.md].name +
            " en " +
            g[m.map].name +
            (m.ph === "end"
              ? " (votando el mapa que sigue)"
              : m.md === "zm"
                ? ""
                : " \xB7 quedan " + Math.floor(m.rem / 60) + ":" + String(Math.round(m.rem) % 60).padStart(2, "0"))
          : ki[p.md || "ffa"].desc + " " + g[p.map].card + "."));
      let M = Pe("#mplist");
      M.textContent = "";
      for (let E of y) {
        let w = document.createElement("li");
        ((w.textContent = String(E.presence.n || "Jugador").slice(0, 14) + " \xB7 " + (typeof E.presence.k == "number" ? E.presence.k : 0) + " bajas"),
          M.appendChild(w));
      }
      if (!y.length) {
        let E = document.createElement("li");
        ((E.textContent = "Nadie todav\xEDa."), M.appendChild(E));
      }
      let A = Pe("#mp-go");
      ((A.disabled = f),
        (A.textContent = f ? "SALA LLENA (6)" : d.state === "off" ? ((m ? m.md : p.md) === "zm" ? "JUGAR SOLO" : "PRACTICAR SOLO") : "ENTRAR"));
    }
    ((s.net.onChange = l),
      setInterval(l, 1e3),
      (Pe("#go-mp").onclick = () => {
        ((Pe("#mpnick").value = s.mp.nick || ""), e.show("#mp"), l());
      }),
      (Pe("#mpnick").oninput = (d) => {
        ((s.mp.nick = d.target.value.replace(/[\u0000-\u001f]/g, "").slice(0, 14)), s.saveMP());
      }),
      (Pe("#mp-back").onclick = () => e.show("#home")),
      (Pe("#mp-go").onclick = () => {
        (s.mp.nick.trim() || ((s.mp.nick = "Jugador " + (1 + Math.floor(Math.random() * 90))), s.saveMP()), s.AU.unlock(), s.startDM());
      }),
      (Pe("#go-set").onclick = () => {
        ((e.from = "#home"), u(), e.show("#settings"));
      }),
      (Pe("#camp-back").onclick = () => e.show("#home")),
      (Pe("#camp-go").onclick = () => {
        let d = Bi[i];
        ((Pe("#brief h2").textContent = d.name), (Pe("#brief p").textContent = d.desc), (Pe("#brieftips").innerHTML = ""));
        for (let p of [
          "Avanz\xE1s con una escuadra de 4. Para tomar un punto quedate en el anillo sin enemigos adentro; con m\xE1s aliados, m\xE1s r\xE1pido.",
          "Cada vez que mor\xEDs gast\xE1s un refuerzo (" + $s[s.diff].tk + "). Al asegurar un sector gan\xE1s refuerzos y reaparec\xE9s ah\xED.",
          "Tu escuadra reaparece sola. El enemigo manda refuerzos desde atr\xE1s.",
          d.tip,
        ]) {
          let g = document.createElement("li");
          ((g.textContent = p), Pe("#brieftips").appendChild(g));
        }
        ((Pe("#brief-go").textContent = "EMPEZAR \xB7 " + Oc[s.diff].toUpperCase()), e.show("#brief"));
      }),
      (Pe("#brief-back").onclick = () => e.show("#camp")),
      (Pe("#brief-go").onclick = () => {
        (s.AU.unlock(), s.startMission(i, r, o));
      }));
    function u() {
      let d = s.settings,
        p = Pe("#sq");
      p.textContent = "";
      for (let g of ["auto", "low", "medium", "high"]) {
        let y = document.createElement("button");
        ((y.type = "button"),
          (y.className = "chip" + (d.quality === g ? " on" : "")),
          (y.textContent = g === "auto" ? "Autom\xE1tica" : Pc[g].name),
          (y.onclick = () => {
            ((d.quality = g), s.saveSettings(), s.applyQuality(), u());
          }),
          p.appendChild(y));
      }
      ((Pe("#ssens").value = d.sens),
        (Pe("#sfov").value = d.fov),
        (Pe("#svol").value = d.vol),
        (Pe("#sinv").checked = d.invert),
        (Pe("#stp").checked = d.tp),
        (Pe("#ssens-v").textContent = d.sens.toFixed(2)),
        (Pe("#sfov-v").textContent = d.fov + "\xB0"),
        (Pe("#svol-v").textContent = Math.round(d.vol * 100) + "%"));
    }
    for (let [d, p, g] of [
      ["#ssens", "sens", 1],
      ["#sfov", "fov", 1],
      ["#svol", "vol", 1],
    ])
      Pe(d).oninput = (y) => {
        ((s.settings[p] = +y.target.value), s.saveSettings(), p === "vol" && s.AU.setVol(s.settings.vol), u());
      };
    return (
      (Pe("#sinv").onchange = (d) => {
        ((s.settings.invert = d.target.checked), s.saveSettings());
      }),
      (Pe("#stp").onchange = (d) => {
        ((s.settings.tp = d.target.checked), s.saveSettings());
      }),
      (Pe("#set-back").onclick = () => e.show(e.from || "#home")),
      (Pe("#p-cont").onclick = () => s.resume()),
      (Pe("#p-set").onclick = () => {
        ((e.from = "#pause"), u(), e.show("#settings"));
      }),
      (Pe("#p-quit").onclick = () => s.quit()),
      (Pe("#e-next").onclick = () => {
        if (s.opi !== null && s.opi !== void 0) {
          s.startOp(s.opi);
          return;
        }
        s.lastWin && s.mi < Bi.length - 1 ? ((i = s.mi + 1), s.startMission(i, r, o)) : s.startMission(s.mi, r, o);
      }),
      (Pe("#e-menu").onclick = () => s.quit()),
      (e.end = (d, p) => {
        ((Pe("#end h2").textContent = d ? "MISI\xD3N CUMPLIDA" : "SIN REFUERZOS"),
          (Pe("#end h2").className = d ? "win" : "lose"),
          (Pe("#end p").textContent = p));
        let g = s.opi !== null && s.opi !== void 0;
        ((Pe("#e-next").textContent = g
          ? d
            ? "JUGAR DE NUEVO"
            : "REINTENTAR"
          : d && s.mi < Bi.length - 1
            ? "SIGUIENTE MISI\xD3N"
            : d
              ? "JUGAR DE NUEVO"
              : "REINTENTAR"),
          (Pe("#end h2").textContent = d ? (g ? "OPERACI\xD3N CUMPLIDA" : "MISI\xD3N CUMPLIDA") : g ? "OPERACI\xD3N FALLIDA" : "SIN REFUERZOS"),
          e.show("#end"));
      }),
      (e.loading = (d, p) => {
        ((Pe("#lbar i").style.width = Math.round(d * 100) + "%"), (Pe("#lmsg").textContent = p || ""));
      }),
      e
    );
  }
