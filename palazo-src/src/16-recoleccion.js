  var wb = { med: "Botiqu\xEDn", ammo: "Munici\xF3n", gren: "Granada", vest: "Chaleco", helm: "Casco" };
  function $g(s) {
    let { E: e, AU: t } = s,
      n = [],
      i = { items: n },
      r = (() => {
        let a = document.createElement("canvas");
        a.width = a.height = 64;
        let c = a.getContext("2d"),
          h = c.createRadialGradient(32, 32, 8, 32, 32, 32);
        return (
          h.addColorStop(0, "rgba(255,255,255,0)"),
          h.addColorStop(0.7, "rgba(255,255,255,.55)"),
          h.addColorStop(1, "rgba(255,255,255,0)"),
          (c.fillStyle = h),
          c.fillRect(0, 0, 64, 64),
          new rn(a)
        );
      })();
    function o(a) {
      let c = new ut(),
        h = (l) => new Xe({ color: l, roughness: 0.7 });
      if (a.startsWith("w:")) {
        let l = oo($n(a.slice(2)));
        ((l.rotation.y = Math.PI / 2), c.add(l));
      } else if (a === "med") {
        let l = new we(new at(0.42, 0.26, 0.3), h("#e9e4da"));
        c.add(l);
        for (let [u, d] of [
          [0.24, 0.07],
          [0.07, 0.24],
        ]) {
          let p = new we(new at(u, d, 0.01), h("#c0281f"));
          ((p.position.z = 0.156), c.add(p));
          let g = p.clone();
          ((g.position.z = -0.156), c.add(g));
        }
      } else if (a === "ammo") {
        let l = new we(new at(0.46, 0.24, 0.26), h("#4b5236"));
        c.add(l);
        let u = new we(new at(0.2, 0.06, 0.01), h("#d9b44a"));
        ((u.position.z = 0.131), c.add(u));
      } else if (a === "gren") {
        let l = oo("grenade");
        (l.scale.setScalar(2), c.add(l));
      } else if (a === "vest") {
        let l = new we(new at(0.5, 0.55, 0.18), h("#3d4630"));
        c.add(l);
      } else if (a === "helm") {
        let l = new we(new yn(0.2, 14, 8, 0, 6.29, 0, 1.5), h("#55613a"));
        c.add(l);
      }
      return (
        c.traverse((l) => {
          l.isMesh && (l.castShadow = !0);
        }),
        c
      );
    }
    return (
      (i.add = (a, c, h, l) => {
        let u = new ut(),
          d = o(a);
        ((d.position.y = 0.45), u.add(d));
        let p = new we(new wn(1.3, 1.3), new ot({ map: r, color: a.startsWith("w:") ? "#ffd27a" : "#9fe6b0", transparent: !0, depthWrite: !1, blending: un }));
        ((p.rotation.x = -Math.PI / 2), (p.position.y = 0.04), u.add(p));
        let g = l !== void 0 ? l : s.P.ground(c, h, 50);
        (u.position.set(c, g, h), e.scene.add(u));
        let y = { type: a, g: u, m: d, x: c, z: h, y: g, t: 0 };
        return (n.push(y), y);
      }),
      (i.remove = (a) => {
        e.scene.remove(a.g);
        let c = n.indexOf(a);
        c >= 0 && n.splice(c, 1);
      }),
      (i.clear = () => {
        for (let a of n) e.scene.remove(a.g);
        n.length = 0;
      }),
      (i.update = (a, c) => {
        let h = null;
        for (let l = n.length - 1; l >= 0; l--) {
          let u = n[l];
          if (((u.t += a), (u.m.rotation.y += a * 1.2), (u.m.position.y = 0.45 + Math.sin(u.t * 2.2) * 0.06), u.ttl && u.t > u.ttl)) {
            i.remove(u);
            continue;
          }
          if (!c || !c.alive || Math.hypot(c.pos.x - u.x, c.pos.z - u.z) > 1.5 || Math.abs(c.pos.y - u.y) > 1.6) continue;
          let p = c.load;
          if (u.type.startsWith("w:")) {
            let y = u.type.slice(2),
              m = dt[y],
              f = m.slot === 0 ? p.prim : p.sec;
            if (f === y) {
              let v = p.ammo[y];
              v.res < m.res * 2 && ((v.res = Math.min(m.res * 2, v.res + m.mag * 2)), t.pick(), s.toast("+ Munici\xF3n de " + m.name), i.remove(u));
              continue;
            }
            if ((!f && !(s.vr && s.vr.on)) || (!(s.vr && s.vr.on) && s.input.pressed("use"))) {
              (f && (i.add("w:" + f, c.pos.x + 0.6, c.pos.z + 0.6).ttl = 30),
                m.slot === 0 ? (p.prim = y) : (p.sec = y),
                (p.ammo[y] = p.ammo[y] || { mag: m.mag, res: m.res }),
                (p.slot = m.slot),
                (p.reload = 0),
                t.pick(),
                s.toast("Tomaste: " + m.name),
                i.remove(u),
                s.onWeaponChange && s.onWeaponChange());
              continue;
            }
            h = (s.input.touch ? "Toc\xE1 USAR" : "E") + " para cambiar por " + m.name;
            continue;
          }
          let g = !1;
          if (u.type === "med" && c.hp < 100) ((c.hp = Math.min(100, c.hp + 50)), (g = !0));
          else if (u.type === "ammo")
            for (let y of [p.prim, p.sec]) {
              if (!y) continue;
              let m = dt[y],
                f = p.ammo[y];
              f.res < m.res * 2 && ((f.res = Math.min(m.res * 2, f.res + m.mag * 2)), (g = !0));
            }
          else
            u.type === "gren" && p.gren < 4
              ? (p.gren++, (g = !0))
              : u.type === "vest" && c.vest < 100
                ? ((c.vest = 100), (g = !0))
                : u.type === "helm" && c.helm < 100 && ((c.helm = 100), (g = !0));
          g && (t.pick(), s.toast("+ " + wb[u.type]), i.remove(u));
        }
        return h;
      }),
      i
    );
  }
