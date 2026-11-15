  var Bg = {
    fwd: "KeyW",
    back: "KeyS",
    left: "KeyA",
    right: "KeyD",
    jump: "Space",
    crouch: "KeyC",
    sprint: "ShiftLeft",
    reload: "KeyR",
    use: "KeyE",
    s1: "Digit1",
    s2: "Digit2",
    s3: "Digit3",
    s4: "Digit4",
    last: "KeyQ",
    cam: "KeyV",
    menu: "Escape",
    map: "KeyM",
    ofollow: "KeyT",
    ohold: "KeyH",
    omove: "KeyF",
    ofire: "KeyY",
    stone: "KeyG",
    score: "Tab",
  };
  function kg(s, e) {
    let t = {
        keys: {},
        edge: {},
        mx: 0,
        my: 0,
        fire: !1,
        ads: !1,
        locked: !1,
        touch: !1,
        move: { x: 0, y: 0 },
        adsToggle: !1,
        sens: 1,
        invert: !1,
        enabled: !0,
      },
      n = (i) => {
        for (let r in Bg) if (Bg[r] === i) return r;
        return i === "ControlLeft" ? "crouch" : i === "ShiftRight" ? "sprint" : null;
      };
    return (
      addEventListener("keydown", (i) => {
        if (!t.enabled) return;
        let r = n(i.code);
        r && (r !== "menu" && i.preventDefault(), t.keys[r] || (t.edge[r] = !0), (t.keys[r] = !0));
      }),
      addEventListener("keyup", (i) => {
        let r = n(i.code);
        r && (t.keys[r] = !1);
      }),
      addEventListener("blur", () => {
        ((t.keys = {}), (t.fire = !1), (t.ads = !1));
      }),
      s.addEventListener("mousedown", (i) => {
        if (t.enabled) {
          if (!t.locked && !t.touch) {
            s.requestPointerLock && s.requestPointerLock();
            return;
          }
          (i.button === 0 && (t.fire = !0), i.button === 2 && (t.ads = !0));
        }
      }),
      addEventListener("mouseup", (i) => {
        (i.button === 0 && (t.fire = !1), i.button === 2 && (t.ads = !1));
      }),
      s.addEventListener("contextmenu", (i) => i.preventDefault()),
      document.addEventListener("pointerlockchange", () => {
        ((t.locked = document.pointerLockElement === s), t.locked || ((t.fire = !1), (t.ads = !1), t.onUnlock && t.onUnlock()));
      }),
      addEventListener("mousemove", (i) => {
        t.locked && ((t.mx += i.movementX), (t.my += i.movementY));
      }),
      addEventListener(
        "wheel",
        (i) => {
          t.locked && (t.edge[i.deltaY > 0 ? "next" : "prev"] = !0);
        },
        { passive: !0 },
      ),
      (t.pressed = (i) => {
        let r = !!t.edge[i];
        return ((t.edge[i] = !1), r);
      }),
      (t.down = (i) => !!t.keys[i]),
      (t.axis = () =>
        t.touch && (t.move.x || t.move.y)
          ? { x: t.move.x, y: t.move.y }
          : { x: (t.keys.right ? 1 : 0) - (t.keys.left ? 1 : 0), y: (t.keys.fwd ? 1 : 0) - (t.keys.back ? 1 : 0) }),
      (t.look = () => {
        let i = { x: t.mx, y: t.my };
        return ((t.mx = 0), (t.my = 0), i);
      }),
      (t.endFrame = () => {
        for (let i in t.edge) t.edge[i] = !1;
      }),
      (t.setupTouch = () => {
        ((t.touch = !0), (e.hidden = !1));
        let i = e.querySelector("#stick"),
          r = i.querySelector("b"),
          o = null,
          a = 0,
          c = 0,
          h = null,
          l = 0,
          u = 0;
        (e.addEventListener(
          "touchstart",
          (p) => {
            for (let g of p.changedTouches)
              g.target.closest("[data-a]") ||
                (g.clientX < innerWidth * 0.42 && o === null
                  ? ((o = g.identifier), (a = g.clientX), (c = g.clientY), (i.style.left = a - 60 + "px"), (i.style.top = c - 60 + "px"), i.classList.add("on"))
                  : h === null && ((h = g.identifier), (l = g.clientX), (u = g.clientY)));
          },
          { passive: !0 },
        ),
          e.addEventListener(
            "touchmove",
            (p) => {
              for (let g of p.changedTouches)
                if (g.identifier === o) {
                  let y = g.clientX - a,
                    m = g.clientY - c,
                    f = Math.hypot(y, m),
                    v = 55;
                  (f > v && ((y *= v / f), (m *= v / f)),
                    (r.style.transform = `translate(${y}px,${m}px)`),
                    (t.move.x = y / v),
                    (t.move.y = -m / v),
                    (t.keys.sprint = f > v * 0.95 && -m > Math.abs(y)));
                } else g.identifier === h && ((t.mx += (g.clientX - l) * 2.2), (t.my += (g.clientY - u) * 2.2), (l = g.clientX), (u = g.clientY));
            },
            { passive: !0 },
          ));
        let d = (p) => {
          for (let g of p.changedTouches)
            (g.identifier === o && ((o = null), (t.move.x = t.move.y = 0), (t.keys.sprint = !1), (r.style.transform = ""), i.classList.remove("on")),
              g.identifier === h && (h = null));
        };
        (e.addEventListener("touchend", d, { passive: !0 }),
          e.addEventListener("touchcancel", d, { passive: !0 }),
          e.querySelectorAll("[data-a]").forEach((p) => {
            let g = p.dataset.a;
            (p.addEventListener(
              "touchstart",
              (y) => {
                (y.preventDefault(),
                  y.stopPropagation(),
                  g === "fire"
                    ? ((t.fire = !0), (h = y.changedTouches[0].identifier), (l = y.changedTouches[0].clientX), (u = y.changedTouches[0].clientY))
                    : g === "ads"
                      ? ((t.adsToggle = !t.adsToggle), p.classList.toggle("on", t.adsToggle))
                      : g === "crouch"
                        ? ((t.keys.crouchT = !t.keys.crouchT), p.classList.toggle("on", t.keys.crouchT))
                        : ((t.edge[g] = !0), (t.keys[g] = !0)));
              },
              { passive: !1 },
            ),
              p.addEventListener(
                "touchend",
                (y) => {
                  (y.preventDefault(), g === "fire" ? ((t.fire = !1), (h = null)) : g !== "ads" && g !== "crouch" && (t.keys[g] = !1));
                },
                { passive: !1 },
              ));
          }));
      }),
      t
    );
  }
