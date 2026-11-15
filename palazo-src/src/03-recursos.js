  var Nc = (s) => (window.__ASSETS && window.__ASSETS[s]) || "assets/" + s,
    Og = new Ks(),
    pf = {};
  function Pn(s, { rep: e = 0, srgb: t = !1 } = {}) {
    let n = s + "|" + e + "|" + t;
    if (pf[n]) return pf[n];
    let i = Og.load(Nc(s));
    return ((i.wrapS = i.wrapT = Xn), e && i.repeat.set(e, e), t && (i.colorSpace = ht), (i.anisotropy = 8), (pf[n] = i));
  }
  var pa = {},
    ma = new Set();
  async function Ug(s) {
    if (s.startsWith("data:")) {
      let t = atob(s.slice(s.indexOf(",") + 1)),
        n = new Uint8Array(t.length);
      for (let i = 0; i < t.length; i++) n[i] = t.charCodeAt(i);
      return n.buffer;
    }
    let e = await fetch(s);
    if (!e.ok) throw new Error(s + " " + e.status);
    return e.arrayBuffer();
  }
  var xb = (s, e, t, n) => Promise.race([s, new Promise((i, r) => setTimeout(() => (n ? i() : r(new Error("se colg\xF3 " + t))), e))]);
  async function zg(s) {
    let e = [
        [
          "soldado",
          async () => {
            let n = await Ug(Nc("Soldier.glb")),
              i = window.createImageBitmap;
            try {
              window.createImageBitmap = void 0;
              let r = new Lc();
              pa.soldier = await r.parseAsync(n, "");
            } finally {
              window.createImageBitmap = i;
            }
          },
          !1,
        ],
        [
          "armas",
          async () => {
            let n = window.__ASSETS && window.__ASSETS["weapons.json"];
            pa.weapons = typeof n == "object" ? n : JSON.parse(new TextDecoder().decode(await Ug(Nc("weapons.json"))));
          },
          !1,
        ],
        ...[
          "grasslight-big.jpg",
          "grasslight-big-nm.jpg",
          "brick_diffuse.jpg",
          "brick_bump.jpg",
          "brick_roughness.jpg",
          "hardwood2_diffuse.jpg",
          "disturb.jpg",
        ].map((n) => [n, () => new Promise((i) => Og.load(Nc(n), i, void 0, i)), !0]),
      ],
      t = 0;
    await Promise.all(
      e.map(async ([n, i, r]) => {
        ma.add(n);
        try {
          await xb(i(), r ? 15e3 : 45e3, n, r);
        } finally {
          ma.delete(n);
        }
        (t++, s && s(t / e.length, n));
      }),
    );
  }
