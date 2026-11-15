  var Yg = [
      [-1.6, 2.4],
      [1.6, 2.4],
      [0, 4.2],
    ],
    _f = { follow: "Seguime", hold: "Quietos", move: "Vayan ah\xED" };
  function Zg(s) {
    let e = { order: "follow" },
      t = () => s.units.filter((i) => i.team === s.myTeam && i.squad);
    ((e.members = () => t()),
      (e.bots = () => t().filter((i) => !i.isPlayer)),
      (e.give = (i, r) => {
        e.order = i;
        let o = e.bots().filter((a) => a.alive);
        (o.forEach((a, c) => {
          if (((a.target = null), i === "follow")) ((a.mode = "follow"), (a.leader = s.me), (a.slot = Yg[c % Yg.length]), (a.flow = null));
          else if (i === "hold") ((a.mode = "hold"), (a.holdCrouch = !0));
          else if (i === "move" && r) {
            let h = (c / Math.max(1, o.length)) * 6.283,
              l = r[0] + Math.cos(h) * 1.4 * (o.length > 1),
              u = r[1] + Math.sin(h) * 1.4 * (o.length > 1);
            ((a.mode = "move"), (a.goal = { x: l, z: u, r: 1 }), (a.flow = s.AI.flow([[l, u]])));
          }
        }),
          s.AU.ui(i === "hold" ? 520 : 760),
          s.toast("Orden: " + _f[i]));
      }),
      (e.toggleFire = () => {
        ((s.stealth.weaponsFree = !s.stealth.weaponsFree),
          s.toast(s.stealth.weaponsFree ? "Fuego libre: el equipo dispara a la vista" : "No disparen: el equipo solo responde si lo atacan"),
          s.AU.ui(600));
      }),
      (e.aimPoint = () => {
        let i = s.E.camera,
          r = new s.E.THREE.Vector3();
        i.getWorldDirection(r);
        let o = s.P.ray(i.position.x, i.position.y, i.position.z, r.x, r.y, r.z, 80);
        return o ? [o.x - r.x * 0.6, o.z - r.z * 0.6] : null;
      }));
    let n = ["vel", "yaw", "hp", "helm", "vest", "load", "name", "role", "char", "alive", "crouchK", "spd", "lastHit", "stealthMul"];
    return (
      (e.take = (i) => {
        let r = s.me;
        if (!i || i === r || !i.alive) return;
        let o = r.pos.clone();
        (r.pos.copy(i.pos), i.pos.copy(o));
        for (let a of n) {
          let c = r[a];
          ((r[a] = i[a]), (i[a] = c));
        }
        ((r.deadT = 0),
          (r.pitch = 0),
          (r.load.reload = 0),
          (r.load.slot = r.load.prim ? 0 : 1),
          (r.prot = 0.5),
          (i.mode = i.alive ? "hold" : "dead"),
          (i.holdCrouch = !0),
          (i.target = null),
          (i.flow = null),
          (i.goal = null),
          (i.load.reload = 0),
          i.alive && i.char.setWeapon(s.modelOf(i.load.prim)),
          i.char.setVisible(!0),
          e.order === "follow" && e.give("follow"),
          s.toast("Ahora sos " + r.name + " (" + r.role + ")"),
          s.onSwitch && s.onSwitch());
      }),
      (e.next = () => {
        let i = e.bots().find((r) => r.alive);
        return i ? (e.take(i), !0) : !1;
      }),
      (e.hud = () =>
        t().map((i) => ({
          name: i.name,
          role: i.role,
          hp: Math.max(0, Math.round(i.hp)),
          alive: i.alive,
          me: i.isPlayer,
          w: dt[i.load.prim] ? dt[i.load.prim].name : "",
          ch: i.load.charges || 0,
          u: i,
        }))),
      e
    );
  }
