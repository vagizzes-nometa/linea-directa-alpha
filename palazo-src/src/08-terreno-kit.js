  var fs = (s, e, t) => {
      let n = Math.min(1, Math.max(0, (t - s) / (e - s)));
      return n * n * (3 - 2 * n);
    },
    Dc = (s, e, t) => s + (e - s) * t;
  function mf(s, e) {
    let t = e.terrainSize || 700,
      n = s.qName === "low" ? 220 : 320,
      i = new wn(t, t, n, n);
    (i.rotateX(-Math.PI / 2), i.translate(e.center[0], 0, e.center[1]));
    let r = i.attributes.position,
      o = r.count,
      a = new Float32Array(o * 3);
    for (let l = 0; l < o; l++) {
      let u = r.getX(l),
        d = r.getZ(l);
      r.setY(l, e.H(u, d));
      let p = 0.5 + 0.5 * Math.sin(u * 0.07 + Math.cos(d * 0.05) * 2),
        g = [Dc(0.95, 1.15, p), Dc(0.95, 1.02, p), Dc(0.9, 0.72, p)],
        y = e.ground ? e.ground(u, d) : null;
      (y && (g = g.map((m, f) => Dc(m, y.c[f], y.a))), (a[l * 3] = g[0]), (a[l * 3 + 1] = g[1]), (a[l * 3 + 2] = g[2]));
    }
    (i.setAttribute("color", new Ge(a, 3)), i.computeVertexNormals());
    let c = new Xe({
        map: Pn("grasslight-big.jpg", { rep: t / 6, srgb: !0 }),
        normalMap: Pn("grasslight-big-nm.jpg", { rep: t / 6 }),
        normalScale: new ae(0.9, 0.9),
        roughness: 1,
        vertexColors: !0,
        color: e.grassTint || "#d8d2b8",
      }),
      h = new we(i, c);
    return ((h.receiveShadow = !0), s.scene.add(h), h);
  }
  function gf(s, e, t, n = 1) {
    let i = (n * 16807) % 2147483647 || 7,
      r = () => ((i = (i * 16807) % 2147483647), (i - 1) / 2147483646),
      o = (f, v) => f + (v - f) * r(),
      a = {
        brick: new Xe({
          map: Pn("brick_diffuse.jpg", { srgb: !0 }),
          bumpMap: Pn("brick_bump.jpg"),
          bumpScale: 3,
          roughnessMap: Pn("brick_roughness.jpg"),
          color: "#c4b4a2",
        }),
        plaster: new Xe({ color: "#7d7264", roughness: 0.97, bumpMap: Pn("disturb.jpg"), bumpScale: 2 }),
        conc: new Xe({ color: "#8d887e", roughness: 0.95, bumpMap: Pn("disturb.jpg"), bumpScale: 1.5 }),
        concD: new Xe({ color: "#5e5b55", roughness: 0.95, bumpMap: Pn("disturb.jpg"), bumpScale: 1.5 }),
        wood: new Xe({ map: Pn("hardwood2_diffuse.jpg", { srgb: !0 }), color: "#4a3c30", roughness: 0.9 }),
        tile: new Xe({ color: "#7c3c2b", roughness: 0.85 }),
        rust: new Xe({ color: "#3a2e27", roughness: 0.75, metalness: 0.55 }),
        metal: new Xe({ color: "#4a5056", roughness: 0.55, metalness: 0.6 }),
        olive: new Xe({ color: "#4b5236", roughness: 0.7, metalness: 0.3 }),
        burnt: new Xe({ color: "#1c1a19", roughness: 0.8, metalness: 0.4 }),
        bag: new Xe({ color: "#5e533c", roughness: 1, bumpMap: Pn("disturb.jpg"), bumpScale: 6, envMapIntensity: 0.4 }),
        bark: new Xe({ color: "#3b3027", roughness: 1 }),
        leaf: new Xe({ color: "#4b5630", roughness: 0.95 }),
        dark: new Xe({ color: "#090807", roughness: 1 }),
        crate: new Xe({ map: Pn("hardwood2_diffuse.jpg", { srgb: !0 }), color: "#8a6d48", roughness: 0.85 }),
      },
      c = {},
      h = (f, v) => {
        (c[f] = c[f] || []).push(v);
      },
      l = { M: a, rnd: r, rr: o, group: new ut(), lights: [], lamps: [] };
    s.scene.add(l.group);
    function u(f, v) {
      let x = f.attributes.position,
        _ = f.attributes.normal,
        S = f.attributes.uv;
      for (let b = 0; b < x.count; b++) {
        let M = Math.abs(_.getX(b)),
          A = Math.abs(_.getY(b)),
          E,
          w;
        (M > 0.5 ? ((E = x.getZ(b)), (w = x.getY(b))) : A > 0.5 ? ((E = x.getX(b)), (w = x.getZ(b))) : ((E = x.getX(b)), (w = x.getY(b))),
          S.setXY(b, E / v, w / v));
      }
    }
    let d = (f, v, x, _, S, b, M, A = !0, E) => {
      let w = new at(S, b, M);
      (w.translate(v, x, _), h(f, w), A && e.addBoxC(v, x, _, S, b, M, E));
    };
    ((l.box = d),
      (l.house = (f, v, x, _, S = {}) => {
        let b = S.fl || 1,
          M = S.dmg || 0,
          A = S.mat || "brick",
          E = 3.1,
          w = 0.38,
          P = b * E + 0.5,
          N = Math.min(t(f - x / 2, v - _ / 2), t(f + x / 2, v + _ / 2), t(f, v)) - 0.15,
          z = S.doors || ["n", "s", "e", "w"],
          T = o(0, 10);
        [
          ["n", f, v - _ / 2, x, "x"],
          ["s", f, v + _ / 2, x, "x"],
          ["w", f - x / 2, v, _, "z"],
          ["e", f + x / 2, v, _, "z"],
        ].forEach(([q, Z, $, H, K], ce) => {
          let fe = Math.round(H / 0.5),
            de = H / fe,
            be = M > 0.3 && r() < M ? [o(0.2, 0.75) * H - H / 2, o(1.6, 3.2)] : null;
          for (let Ee = 0; Ee < fe; Ee++) {
            let ye = -H / 2 + (Ee + 0.5) * de,
              ge = P;
            if (M > 0) {
              let le = 0.5 + 0.5 * Math.sin(Ee * 0.9 + T + ce * 2) * Math.cos(Ee * 0.37 + ce);
              ge = P * (1 - M * (0.15 + 0.8 * le * le));
            }
            be && Math.abs(ye - be[0]) < be[1] / 2 && (ge = Math.min(ge, o(0, 1.1)));
            let k = [];
            for (let le = 0; le < b; le++) {
              let te = le * E,
                Ce = Math.max(1, Math.floor((H - 1.5) / 2.4));
              for (let ve = 0; ve < Ce; ve++) {
                let D = -H / 2 + (ve + 0.5) * (H / Ce);
                Math.abs(ye - D) < 0.55 && !(le === 0 && z.includes(q) && Math.abs(ye) < 0.7) && k.push([te + 1.05, te + 2.35]);
              }
              le === 0 && z.includes(q) && Math.abs(ye) < 0.65 && k.push([0, 2.25]);
            }
            k.sort((le, te) => le[0] - te[0]);
            let ue = 0,
              re = [];
            for (let [le, te] of k) (le > ue && re.push([ue, le]), (ue = Math.max(ue, te)));
            re.push([ue, ge]);
            for (let [le, te] of re) {
              if (te - le < 0.06) continue;
              let Ce = K === "x" ? Z + ye : Z,
                ve = K === "x" ? $ : $ + ye,
                D = K === "x" ? de + 0.002 : w,
                I = K === "x" ? w : de + 0.002,
                J = new at(D, te - le, I);
              (J.translate(Ce, N + (le + te) / 2, ve), h(A, J), e.addBoxC(Ce, N + (le + te) / 2, ve, D, te - le, I));
            }
          }
        });
        let L = b > 1,
          V = f - x / 2 + 0.5,
          G = v - _ / 2 + 0.75;
        for (let q = 1; q <= b; q++) {
          let Z = N + q * E;
          if (q * E > P * (1 - M * 0.6)) break;
          let $ = Math.ceil(x),
            H = Math.ceil(_);
          for (let K = 0; K < $; K++)
            for (let ce = 0; ce < H; ce++) {
              let fe = f - x / 2 + ((K + 0.5) * x) / $,
                de = v - _ / 2 + ((ce + 0.5) * _) / H;
              if ((L && q === 1 && fe < V + 4.4 && de < G + 1.2) || (q > 1 && r() < M * 0.75) || (q === 1 && r() < M * 0.35 && !(fe < V + 6 && de < G + 3)))
                continue;
              let be = new at(x / $ + 0.01, 0.22, _ / H + 0.01);
              (be.translate(fe, Z, de), h("conc", be), e.addBoxC(fe, Z, de, x / $ + 0.01, 0.22, _ / H + 0.01));
            }
        }
        if (L)
          for (let q = 0; q < 15; q++) {
            let Z = (q + 1) * 0.2 + 0.04,
              $ = V + q * 0.28 + 0.14;
            d("wood", $, N + Z / 2, G, 0.28, Z, 1.3);
          }
        let W = new at(x - 0.6, 0.08, _ - 0.6);
        if ((W.translate(f, N + 0.04, v), h("conc", W), M < 0.62)) {
          let q = N + P - 0.1,
            Z = 1.9;
          for (let $ = -x / 2 + 0.3; $ <= x / 2 - 0.2; $ += 0.75)
            if (!(r() < M * 0.5))
              for (let H of [-1, 1]) {
                let K = new at(0.13, 0.16, _ / 2 + 0.5);
                (K.rotateX(H * Math.atan2(Z, _ / 2)), K.translate(f + $, q + Z / 2, v - (H * _) / 4), h("wood", K));
              }
          for (let $ = -x / 2; $ < x / 2; $ += 1.2)
            for (let H of [-1, 1]) {
              if (r() < 0.35 + M * 0.6) continue;
              let K = new at(1.22, 0.07, _ / 2 + 0.55);
              (K.rotateX(H * Math.atan2(Z, _ / 2)), K.translate(f + $ + 0.6, q + Z / 2 + 0.12, v - (H * _) / 4), h("tile", K));
            }
        }
        return (l.rubble(f, v, x, _, M), { y0: N, FH: E, fl: b, cx: f, cz: v, w: x, d: _ });
      }));
    let p = [];
    ((l.rubble = (f, v, x, _, S) => {
      for (let b = 0; b < 4; b++) p.push([f + o(-x / 2 - 1, x / 2 + 1), v + o(-_ / 2 - 1.5, _ / 2 + 1.5), o(1.4, 3), Math.round(30 + S * 90)]);
    }),
      (l.pile = (f, v, x, _) => p.push([f, v, x, _])),
      (l.tower = (f, v, x = 4.2, _ = 15) => {
        let S = t(f, v) - 0.2;
        for (let [b, M] of [
          [0, -1],
          [0, 1],
          [-1, 0],
          [1, 0],
        ])
          for (let A = 0; A < 8; A++) {
            let E = -x / 2 + ((A + 0.5) * x) / 8,
              w = _ - (b === 1 ? 6 : 0) - (M === -1 && E > 0 ? 3.5 : 0) - ((A * 7) % 5) * 0.3;
            for (let [P, N] of [
              [0, 1.2],
              [2.3, 9],
              [11.5, w],
            ]) {
              if (N <= P) continue;
              let z = b ? f + (b * x) / 2 : f + E,
                T = b ? v + E : v + (M * x) / 2,
                R = b ? 0.45 : x / 8 + 0.01,
                L = b ? x / 8 + 0.01 : 0.45;
              d("brick", z, S + (P + N) / 2, T, R, N - P, L);
            }
          }
      }));
    let g = [];
    l.bags = (f, v, x, _, S = "x") => {
      let b = Math.round(x / 0.62);
      for (let E = 0; E < _; E++)
        for (let w = 0; w < b - (E % 2); w++) {
          let P = (w + (E % 2) * 0.5 - b / 2 + 0.5) * 0.62;
          g.push([S === "x" ? f + P : f, S === "x" ? v : v + P, E, S === "x" ? 0 : Math.PI / 2]);
        }
      let M = _ * 0.22 + 0.1,
        A = t(f, v);
      e.addBoxC(f, A + M / 2, v, S === "x" ? x : 0.5, M, S === "x" ? 0.5 : x, "bag");
    };
    let y = [];
    ((l.hog = (f, v) => {
      (y.push([f, v, o(0, 3)]), e.addBoxC(f, t(f, v) + 0.55, v, 0.9, 1.1, 0.9, "hog"));
    }),
      (l.car = (f, v, x = 0) => {
        let _ = t(f, v),
          S = 4.3,
          b = 1.85,
          M = x ? S : b,
          A = x ? b : S;
        (d("burnt", f, _ + 0.62, v, M, 0.75, A), d("burnt", f, _ + 1.2, v + (x ? 0 : 0.25), x ? 2 : 1.6, 0.6, x ? 1.6 : 2));
        for (let [E, w] of [
          [-0.9, -1.4],
          [0.9, -1.4],
          [-0.9, 1.4],
          [0.9, 1.35],
        ]) {
          let P = new Gt(0.36, 0.36, 0.25, 14);
          (P.rotateZ(Math.PI / 2), x && P.rotateY(Math.PI / 2), P.translate(f + (x ? w : E), _ + 0.33, v + (x ? E : w)), h("dark", P));
        }
      }),
      (l.truck = (f, v, x = 0) => {
        let _ = t(f, v),
          S = 6,
          b = 2.4;
        (d("olive", f, _ + 1.25, v + (x ? 0 : -1), x ? S : b, 1.5, x ? b : S),
          d("burnt", f + (x ? 3.9 : 0), _ + 1.3, v + (x ? 0 : 2.9), x ? 1.8 : 2.3, 1.6, x ? 2.3 : 1.8));
        for (let M of [-2, 0, 2, 3.9])
          for (let A of [-1.15, 1.15]) {
            let E = new Gt(0.5, 0.5, 0.3, 14);
            (E.rotateZ(Math.PI / 2), x && E.rotateY(Math.PI / 2), E.translate(f + (x ? M : A), _ + 0.5, v + (x ? A : M - 1)), h("dark", E));
          }
      }),
      (l.crate = (f, v, x = 1, _ = 1) => {
        let S = t(f, v);
        for (let b = 0; b < _; b++) d("crate", f, S + x * (b + 0.5), v, x, x, x);
      }),
      (l.container = (f, v, x, _, S) => {
        let b = t(f, v),
          M = new Xe({ color: S, roughness: 0.6, metalness: 0.5 }),
          A = "c" + S;
        ((a[A] = M), d(A, f, b + 1.3, v, _ === "x" ? x : 2.4, 2.6, _ === "x" ? 2.4 : x));
      }),
      (l.wall = (f, v, x, _, S, b = "conc", M = []) => {
        let A = Math.abs(x - f) > Math.abs(_ - v) ? "x" : "z",
          E = A === "x" ? f : v,
          w = A === "x" ? x : _,
          P = E,
          N = [...M.map((z) => [z[0], z[1]]), [w, w]].sort((z, T) => z[0] - T[0]);
        for (let [z, T] of N) {
          if (z > P) {
            let R = (P + z) / 2,
              L = z - P,
              V = A === "x" ? R : f,
              G = A === "x" ? v : R;
            d(b, V, t(V, G) + S / 2 - 0.1, G, A === "x" ? L : 0.3, S, A === "x" ? 0.3 : L);
          }
          P = Math.max(P, T);
        }
      }),
      (l.bunker = (f, v, x, _, S = "s") => {
        let b = Math.min(t(f, v), t(x, _)) - 0.1,
          M = 3,
          A = (f + x) / 2,
          E = (v + _) / 2,
          w = x - f,
          P = _ - v;
        d("concD", A, b + M + 0.3, E, w + 0.4, 0.6, P + 0.4);
        let N = (z) => {
          let T = z === "n" || z === "s",
            R = T ? w : P,
            L = z === "w" ? f : z === "e" ? x : A,
            V = z === "n" ? v : z === "s" ? _ : E,
            G = z === S,
            W = z === { n: "s", s: "n", e: "w", w: "e" }[S];
          if (G)
            (d("concD", T ? A : L, b + 0.6, T ? V : E, T ? R : 0.5, 1.2, T ? 0.5 : R),
              d("concD", T ? A : L, b + 2.4, T ? V : E, T ? R : 0.5, 1.2, T ? 0.5 : R));
          else if (W) {
            let q = (R - 2) / 2;
            for (let Z of [-1, 1]) {
              let $ = Z * (1 + q / 2);
              d("concD", T ? A + $ : L, b + M / 2, T ? V : E + $, T ? q : 0.5, M, T ? 0.5 : q);
            }
            d("concD", T ? A : L, b + 2.6, T ? V : E, T ? 2 : 0.5, 0.8, T ? 0.5 : 2);
          } else d("concD", T ? A : L, b + M / 2, T ? V : E, T ? R : 0.5, M, T ? 0.5 : R);
        };
        ["n", "s", "e", "w"].forEach(N);
      }),
      (l.hangar = (f, v, x, _, S = "s") => {
        let b = Math.min(t(f, v), t(x, _)) - 0.1,
          M = 6,
          A = (f + x) / 2,
          E = (v + _) / 2,
          w = x - f,
          P = _ - v;
        d("metal", A, b + M + 0.15, E, w, 0.3, P, !0);
        for (let N of ["n", "s", "e", "w"]) {
          if (N === S) continue;
          let z = N === "n" || N === "s";
          d("metal", z ? A : N === "w" ? f : x, b + M / 2, z ? (N === "n" ? v : _) : E, z ? w : 0.3, M, z ? 0.3 : P);
        }
      }),
      (l.watchtower = (f, v) => {
        let x = t(f, v);
        for (let [_, S] of [
          [0, 0],
          [3, 0],
          [0, 3],
          [3, 3],
        ])
          d("wood", f + _, x + 3.6, v + S, 0.25, 7.2, 0.25);
        d("wood", f + 1.5, x + 4.5, v + 1.5, 3.4, 0.2, 3.4);
        for (let [_, S, b, M] of [
          [1.5, 0, 3.4, 0.1],
          [1.5, 3, 3.4, 0.1],
          [0, 1.5, 0.1, 3.4],
          [3, 1.5, 0.1, 3.4],
        ])
          d("wood", f + _, x + 5.1, v + S, b, 1, M);
        d("tile", f + 1.5, x + 7.4, v + 1.5, 3.8, 0.15, 3.8, !1);
      }),
      (l.tank = (f, v, x, _) => {
        let S = new Gt(x, x, _, 24);
        (S.translate(f, t(f, v) + _ / 2, v), h("metal", S), e.addBoxC(f, t(f, v) + _ / 2, v, x * 1.6, _, x * 1.6));
      }));
    let m = [];
    return (
      (l.tree = (f, v, x, _ = 1) => {
        (m.push([f, v, x, _]), e.addBoxC(f, t(f, v) + 2, v, 0.45 * _, 4, 0.45 * _, "tree"));
      }),
      (l.pine = (f, v, x = 1) => {
        (m.push([f, v, 2, x]), e.addBoxC(f, t(f, v) + 2, v, 0.4 * x, 4, 0.4 * x, "tree"));
      }),
      (l.poles = (f) => {
        let v = [];
        for (let [_, S] of f) {
          let b = t(_, S),
            M = Math.sin(_ * S) * 0.06,
            A = new Gt(0.09, 0.13, 7.5, 8);
          (A.rotateZ(M), A.translate(_, b + 3.7, S), h("wood", A), e.addBoxC(_, b + 3.7, S, 0.25, 7.5, 0.25));
          let E = new at(1.4, 0.1, 0.1);
          (E.translate(_ - Math.sin(M) * 3.4, b + 7, S), h("wood", E), v.push([_ - Math.sin(M) * 3.4, b + 7, S]));
        }
        let x = new Ut({ color: "#15130f" });
        for (let _ = 0; _ < v.length - 1; _++)
          for (let S of [-0.6, 0.6]) {
            let b = v[_],
              M = v[_ + 1],
              A = [];
            for (let E = 0; E <= 10; E++) {
              let w = E / 10;
              A.push(new C(b[0] + (M[0] - b[0]) * w + S, b[1] + (M[1] - b[1]) * w - Math.sin(w * Math.PI) * 0.7, b[2] + (M[2] - b[2]) * w));
            }
            l.group.add(new sn(new Ue().setFromPoints(A), x));
          }
      }),
      (l.lamp = (f, v, x = "#ffcf8a") => {
        let _ = t(f, v),
          S = new Gt(0.06, 0.09, 4.6, 8);
        (S.translate(f, _ + 2.3, v), h("metal", S), e.addBoxC(f, _ + 2.3, v, 0.2, 4.6, 0.2));
        let b = new at(0.9, 0.08, 0.08);
        (b.translate(f + 0.4, _ + 4.5, v), h("metal", b), l.lamps.push([f + 0.8, _ + 4.35, v, x]));
      }),
      (l.flush = () => {
        for (let _ in c) {
          let S = da(c[_]);
          ["brick", "plaster", "conc", "concD", "crate"].includes(_) && u(S, _ === "brick" ? 2.2 : _ === "crate" ? 1 : 3);
          let b = new we(S, a[_]);
          ((b.castShadow = b.receiveShadow = !0), l.group.add(b));
        }
        let f = new st(),
          v = new pe();
        if (g.length) {
          let _ = new Dn(new yn(1, 12, 8), a.bag, g.length);
          (g.forEach(([S, b, M, A], E) => {
            (f.position.set(S, t(S, b) + 0.1 + M * 0.22, b),
              f.rotation.set(o(-0.08, 0.08), A + o(-0.1, 0.1), o(-0.06, 0.06)),
              f.scale.set(0.33, 0.13, 0.19),
              f.updateMatrix(),
              _.setMatrixAt(E, f.matrix));
          }),
            (_.castShadow = _.receiveShadow = !0),
            l.group.add(_));
        }
        if (y.length) {
          let _ = [];
          for (let M of [
            [0, 0, 0.95],
            [0, 0.95, 0],
            [0.95, 0, 0],
          ]) {
            let A = new at(0.12, 0.12, 1.7);
            (A.rotateX(M[0]), A.rotateY(M[1]), A.rotateZ(M[2]), _.push(A));
          }
          let S = da(_),
            b = new Dn(S, a.rust, y.length);
          (y.forEach(([M, A, E], w) => {
            (f.position.set(M, t(M, A) + 0.5, A), f.rotation.set(0, E, 0), f.scale.set(1, 1, 1), f.updateMatrix(), b.setMatrixAt(w, f.matrix));
          }),
            (b.castShadow = !0),
            l.group.add(b));
        }
        let x = 0;
        for (let _ of p) x += _[3];
        if (x) {
          let _ = new Dn(new os(1, 0), new Xe({ roughness: 0.95 }), x),
            S = 0;
          for (let [b, M, A, E] of p)
            for (let w = 0; w < E; w++) {
              let P = o(0, 6.283),
                N = Math.pow(r(), 1.6) * A,
                z = b + Math.cos(P) * N,
                T = M + Math.sin(P) * N,
                R = o(0.06, 0.3) * (1 - (N / A) * 0.5);
              (f.position.set(z, t(z, T) + R * 0.35 + (1 - N / A) * A * 0.1 * r(), T),
                f.rotation.set(o(0, 6), o(0, 6), o(0, 6)),
                f.scale.set(R * o(0.7, 1.6), R * o(0.5, 1), R * o(0.7, 1.4)),
                f.updateMatrix(),
                _.setMatrixAt(S, f.matrix),
                v.setHSL(o(0.03, 0.08), o(0.15, 0.35), o(0.2, 0.45)),
                _.setColorAt(S++, v));
            }
          ((_.castShadow = _.receiveShadow = !0), l.group.add(_));
        }
        for (let [_, S, b, M] of m) {
          let A = new ut(),
            E = b === 1 ? o(4, 6) : o(5, 7.5),
            w = new we(new Gt(0.12 * M, 0.26 * M, E, 8), a.bark);
          if (((w.position.y = E / 2), A.add(w), b === 1))
            for (let P = 0; P < 5; P++) {
              let N = new we(new Gt(0.03, 0.08, o(1.2, 2.4), 6), a.bark);
              ((N.position.y = E * o(0.5, 0.95)), N.rotation.set(o(-0.9, 0.9), o(0, 6), o(0.5, 1.1)), N.translateY(0.8), A.add(N));
            }
          else if (b === 2)
            for (let P = 0; P < 4; P++) {
              let N = new we(new Gr((2.2 - P * 0.45) * M, 2.2 * M, 9), a.leaf);
              ((N.position.y = E * 0.45 + P * 1.3 * M), A.add(N));
            }
          else
            for (let P = 0; P < 6; P++) {
              let N = new we(new ai(o(1.2, 2) * M, 1), a.leaf);
              (N.position.set(o(-1.2, 1.2) * M, E * o(0.75, 1.05), o(-1.2, 1.2) * M), (N.scale.y = 0.8), A.add(N));
            }
          (A.traverse((P) => {
            P.isMesh && ((P.castShadow = !0), (P.receiveShadow = !0));
          }),
            A.position.set(_, t(_, S) - 0.1, S),
            (A.rotation.y = o(0, 6)),
            l.group.add(A));
        }
        if (l.lamps.length) {
          let _ = document.createElement("canvas");
          _.width = _.height = 64;
          let S = _.getContext("2d"),
            b = S.createRadialGradient(32, 32, 0, 32, 32, 32);
          (b.addColorStop(0, "rgba(255,255,255,1)"),
            b.addColorStop(0.2, "rgba(255,230,180,.7)"),
            b.addColorStop(1, "rgba(255,180,90,0)"),
            (S.fillStyle = b),
            S.fillRect(0, 0, 64, 64));
          let M = new rn(_);
          for (let [A, E, w, P] of l.lamps) {
            let N = new gn(new dn({ map: M, color: P, transparent: !0, depthWrite: !1, blending: un, fog: !1 }));
            (N.scale.set(2.4, 2.4, 1), N.position.set(A, E, w), l.group.add(N));
            let z = new we(new yn(0.12, 8, 6), new ot({ color: new pe(P).multiplyScalar(3) }));
            (z.position.set(A, E + 0.05, w), l.group.add(z));
            let T = new we(new ss(4.5, 24), new ot({ map: M, color: new pe(P).multiplyScalar(0.5), transparent: !0, depthWrite: !1, blending: un }));
            ((T.rotation.x = -Math.PI / 2), T.position.set(A, t(A, w) + 0.06, w), l.group.add(T));
          }
        }
      }),
      (l.updateLights = (f, v, x) => {
        if (!l.lamps.length || !x) return;
        for (; l.lights.length < x;) {
          let S = new di("#ffcf8a", 0, 22, 1.8);
          (s.scene.add(S), l.lights.push(S));
        }
        let _ = l.lamps.slice().sort((S, b) => Math.hypot(S[0] - f, S[2] - v) - Math.hypot(b[0] - f, b[2] - v));
        l.lights.forEach((S, b) => {
          let M = _[b];
          M ? (S.position.set(M[0], M[1] - 0.3, M[2]), S.color.set(M[3]), (S.intensity = 35)) : (S.intensity = 0);
        });
      }),
      l
    );
  }
