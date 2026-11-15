  function Fg() {
    let e = new Map(),
      t = [],
      n = { H: () => 0, boxes: t, bounds: { x0: -1e9, x1: 1e9, z0: -1e9, z1: 1e9 } },
      i = (c, h) => (c * 73856093) ^ (h * 19349663);
    ((n.clear = () => {
      (e.clear(), (t.length = 0));
    }),
      (n.addBox = (c, h, l, u, d, p, g) => {
        let y = {
          x0: Math.min(c, u),
          y0: Math.min(h, d),
          z0: Math.min(l, p),
          x1: Math.max(c, u),
          y1: Math.max(h, d),
          z1: Math.max(l, p),
          tag: g || "w",
          id: t.length,
        };
        t.push(y);
        for (let m = Math.floor(y.x0 / 4); m <= Math.floor(y.x1 / 4); m++)
          for (let f = Math.floor(y.z0 / 4); f <= Math.floor(y.z1 / 4); f++) {
            let v = i(m, f),
              x = e.get(v);
            (x || e.set(v, (x = [])), x.push(y));
          }
        return y;
      }),
      (n.addBoxC = (c, h, l, u, d, p, g) => n.addBox(c - u / 2, h - d / 2, l - p / 2, c + u / 2, h + d / 2, l + p / 2, g)));
    let r = 1;
    function o(c, h, l, u, d) {
      (r++, (d.length = 0));
      for (let p = Math.floor(c / 4); p <= Math.floor(l / 4); p++)
        for (let g = Math.floor(h / 4); g <= Math.floor(u / 4); g++) {
          let y = e.get(i(p, g));
          if (y) for (let m of y) m._s !== r && ((m._s = r), d.push(m));
        }
      return d;
    }
    n.near = o;
    let a = [];
    return (
      (n.ground = (c, h, l, u = 0.3) => {
        let d = n.H(c, h);
        o(c - u, h - u, c + u, h + u, a);
        for (let p of a) c + u > p.x0 && c - u < p.x1 && h + u > p.z0 && h - u < p.z1 && p.y1 <= l + 0.05 && p.y1 > d && (d = p.y1);
        return d;
      }),
      (n.blocked = (c, h, l, u, d) => {
        o(c - d, h - d, c + d, h + d, a);
        for (let p of a) if (c + d > p.x0 && c - d < p.x1 && h + d > p.z0 && h - d < p.z1 && u > p.y0 && l < p.y1) return p;
        return null;
      }),
      (n.move = (c, h, l, u, d, p = 0.48) => {
        let g = (S, b) => {
            let M = c.x + S,
              A = c.z + b;
            if (M < n.bounds.x0 + u || M > n.bounds.x1 - u || A < n.bounds.z0 + u || A > n.bounds.z1 - u) return !1;
            let E = n.blocked(M, A, c.y + 0.02, c.y + d, u);
            return E
              ? E.y1 - c.y <= p && !n.blocked(M, A, E.y1 + 0.02, E.y1 + d, u)
                ? ((c.x = M), (c.z = A), (c.y = E.y1), !0)
                : !1
              : ((c.x = M), (c.z = A), !0);
          },
          y = h.x * l,
          m = h.z * l,
          f = Math.max(1, Math.ceil(Math.max(Math.abs(y), Math.abs(m)) / (u * 0.8)));
        for (let S = 0; S < f; S++) (g(y / f, 0) || (h.x = 0), g(0, m / f) || (h.z = 0));
        h.y -= 22 * l;
        let v = c.y + h.y * l,
          x = n.ground(c.x, c.z, Math.max(c.y, v) + 0.05, u * 0.7),
          _ = !1;
        if ((v <= x && ((v = x), (h.y = 0), (_ = !0)), h.y > 0)) {
          let S = n.blocked(c.x, c.z, c.y + d, v + d, u * 0.7);
          S && ((v = S.y0 - d - 0.01), (h.y = 0));
        }
        return ((c.y = v), _);
      }),
      (n.ray = (c, h, l, u, d, p, g, y) => {
        let m = g,
          f = null,
          v = null,
          x = Math.ceil(g / 4) * 2 + 2,
          _ = c,
          S = l,
          b = new Set(),
          M = Math.floor(c / 4),
          A = Math.floor(l / 4),
          E = u > 0 ? 1 : -1,
          w = p > 0 ? 1 : -1,
          P = Math.abs(4 / (u || 1e-9)),
          N = Math.abs(4 / (p || 1e-9)),
          z = (E > 0 ? (M + 1) * 4 - c : c - M * 4) / Math.abs(u || 1e-9),
          T = (w > 0 ? (A + 1) * 4 - l : l - A * 4) / Math.abs(p || 1e-9),
          R = 0;
        for (let W = 0; W < x && R <= m; W++) {
          let q = e.get(i(M, A));
          if (q)
            for (let Z of q) {
              if (b.has(Z.id) || Z.tag === y) continue;
              b.add(Z.id);
              let $ = 0,
                H = m,
                K = 0,
                ce = [c, h, l],
                fe = [u, d, p],
                de = [Z.x0, Z.y0, Z.z0],
                be = [Z.x1, Z.y1, Z.z1],
                Ee = !0,
                ye = -1,
                ge = 0;
              for (let k = 0; k < 3; k++) {
                if (Math.abs(fe[k]) < 1e-9) {
                  if (ce[k] < de[k] || ce[k] > be[k]) {
                    Ee = !1;
                    break;
                  }
                  continue;
                }
                let ue = (de[k] - ce[k]) / fe[k],
                  re = (be[k] - ce[k]) / fe[k],
                  le = -1;
                if (ue > re) {
                  let te = ue;
                  ((ue = re), (re = te), (le = 1));
                }
                if ((ue > $ && (($ = ue), (ye = k), (ge = le)), re < H && (H = re), $ > H)) {
                  Ee = !1;
                  break;
                }
              }
              Ee && $ < m && $ >= 0 && ((m = $), (v = Z), (f = [0, 0, 0]), ye >= 0 && (f[ye] = ge));
            }
          z < T ? ((R = z), (z += P), (M += E)) : ((R = T), (T += N), (A += w));
        }
        let L = null,
          V = 0.6,
          G = h - n.H(c, l);
        for (let W = V; W <= Math.min(m, g); W += V) {
          let q = h + d * W,
            Z = q - n.H(c + u * W, l + p * W);
          if (Z < 0) {
            let $ = W - V,
              H = W;
            for (let K = 0; K < 8; K++) {
              let ce = ($ + H) / 2;
              h + d * ce - n.H(c + u * ce, l + p * ce) < 0 ? (H = ce) : ($ = ce);
            }
            L = H;
            break;
          }
          G = Z;
        }
        return L !== null && L < m
          ? { t: L, x: c + u * L, y: h + d * L, z: l + p * L, n: [0, 1, 0], kind: "terrain" }
          : v
            ? { t: m, x: c + u * m, y: h + d * m, z: l + p * m, n: f, kind: "box", box: v }
            : null;
      }),
      (n.los = (c, h) => {
        let l = h.x - c.x,
          u = h.y - c.y,
          d = h.z - c.z,
          p = Math.hypot(l, u, d);
        return p < 0.01 ? !0 : !n.ray(c.x, c.y, c.z, l / p, u / p, d / p, p - 0.05);
      }),
      n
    );
  }
