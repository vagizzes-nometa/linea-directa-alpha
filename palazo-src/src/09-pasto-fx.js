  function Wg(s, e, t, n) {
    if (!t) return null;
    let i = document.createElement("canvas");
    i.width = i.height = 128;
    let r = i.getContext("2d");
    ((r.fillStyle = "#000"), r.fillRect(0, 0, 128, 128));
    for (let S = 0; S < 22; S++) {
      let b = 6 + Math.random() * 116,
        M = 2 + Math.random() * 2.5,
        A = 60 + Math.random() * 64,
        E = Math.random() * 36 - 18;
      ((r.fillStyle = "#fff"),
        r.beginPath(),
        r.moveTo(b - M, 128),
        r.quadraticCurveTo(b + E * 0.4, 128 - A * 0.6, b + E, 128 - A),
        r.quadraticCurveTo(b + E * 0.4 + 1, 128 - A * 0.6, b + M, 128),
        r.fill());
    }
    let o = new rn(i),
      a = [];
    for (let S = 0; S < 3; S++) {
      let b = new wn(0.7, 0.55);
      (b.translate(0, 0.275, 0), b.rotateY((S * Math.PI) / 3), a.push(b));
    }
    let c = da(a),
      h = c.attributes.position,
      l = new Float32Array(h.count * 3);
    for (let S = 0; S < h.count; S++) {
      let b = h.getY(S) / 0.55;
      ((l[S * 3] = 0.35 + 0.65 * b), (l[S * 3 + 1] = 0.38 + 0.62 * b), (l[S * 3 + 2] = 0.3 + 0.6 * b), c.attributes.normal.setXYZ(S, 0, 1, 0));
    }
    c.setAttribute("color", new Ge(l, 3));
    let u = e.env === "night",
      d = new Xe({ color: u ? "#5d6a52" : "#8c8f55", alphaMap: o, alphaTest: 0.45, side: Rt, roughness: 1, vertexColors: !0 });
    d.onBeforeCompile = (S) => {
      ((S.uniforms.uT = n),
        (S.vertexShader =
          `uniform float uT;
` +
          S.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vec3 ip=instanceMatrix[3].xyz;float sw=sin(uT*1.6+ip.x*.35+ip.z*.22)*.5+sin(uT*2.9+ip.x*.9)*.25;transformed.x+=sw*.13*position.y/.55;transformed.z+=sw*.06*position.y/.55;`,
          )));
    };
    let p = new Dn(c, d, t),
      g = new st(),
      y = new pe(),
      m = 0,
      [f, v, x, _] = e.grassArea;
    for (let S = 0; S < t * 4 && m < t; S++) {
      let b = f + Math.random() * (v - f),
        M = x + Math.random() * (_ - x);
      if ((e.noGrass && e.noGrass(b, M)) || Math.random() > 0.55 + 0.45 * Math.sin(b * 0.21 + M * 0.13)) continue;
      (g.position.set(b, e.H(b, M) - 0.03, M), g.rotation.set(0, Math.random() * 6.3, 0));
      let A = 0.75 + Math.random() * 0.85;
      (g.scale.set(A, A * (0.8 + Math.random() * 0.6), A),
        g.updateMatrix(),
        p.setMatrixAt(m, g.matrix),
        y.setHSL(0.14 + Math.random() * 0.06, 0.25 + Math.random() * 0.2, 0.42 + Math.random() * 0.18),
        p.setColorAt(m++, y));
    }
    return ((p.count = m), (p.receiveShadow = !0), s.scene.add(p), p);
  }
  function xf(s, e) {
    let t = {};
    function n() {
      let P = document.createElement("canvas");
      P.width = P.height = 128;
      let N = P.getContext("2d");
      for (let R = 0; R < 46; R++) {
        let L = 64 + Math.random() * 60 - 30,
          V = 64 + Math.random() * 60 - 30,
          G = 14 + Math.random() * 20,
          W = N.createRadialGradient(L, V, 0, L, V, G);
        (W.addColorStop(0, "rgba(255,255,255,.1)"), W.addColorStop(1, "rgba(255,255,255,0)"), (N.fillStyle = W), N.fillRect(0, 0, 128, 128));
      }
      let z = N.getImageData(0, 0, 128, 128);
      for (let R = 0; R < 128 * 128; R++) {
        let L = R % 128,
          V = (R / 128) | 0,
          G = Math.hypot(L - 64, V - 64) / 64;
        z.data[R * 4 + 3] *= Math.max(0, 1 - G * G);
      }
      N.putImageData(z, 0, 0);
      let T = new rn(P);
      return ((T.colorSpace = ht), T);
    }
    function i() {
      let P = document.createElement("canvas");
      P.width = P.height = 64;
      let N = P.getContext("2d"),
        z = N.createRadialGradient(32, 32, 0, 32, 32, 32);
      return (
        z.addColorStop(0, "rgba(255,255,255,1)"),
        z.addColorStop(0.25, "rgba(255,220,160,.8)"),
        z.addColorStop(1, "rgba(255,120,40,0)"),
        (N.fillStyle = z),
        N.fillRect(0, 0, 64, 64),
        new rn(P)
      );
    }
    let r = n(),
      o = i();
    t.GLW = o;
    function a(P, N) {
      let z = [];
      for (let R = 0; R < P; R++) {
        let L = new gn(new dn({ map: N ? o : r, transparent: !0, depthWrite: !1, blending: N ? un : Ai, fog: !N }));
        ((L.visible = !1), s.scene.add(L), z.push({ s: L, life: 0, age: 0 }));
      }
      let T = 0;
      return {
        a: z,
        get() {
          let R = z[T];
          return ((T = (T + 1) % z.length), R);
        },
      };
    }
    let c = a(160, !1),
      h = a(90, !0),
      l = [];
    function u(P, N) {
      let z = P.get();
      return (
        Object.assign(z, { age: 0, vx: 0, vy: 0, vz: 0, rot: Math.random() * 6, s0: 1, s1: 2, o0: 0.8, c0: [1, 1, 1], c1: null, grav: 0 }, N),
        (z.s.visible = !0),
        z.s.position.set(N.x, N.y, N.z),
        l.push(z),
        z
      );
    }
    let d = [];
    ((t.column = (P, N, z, T = {}) => {
      let R = Math.round((T.n || 30) * s.q.smoke),
        L = { x: P, y: N, z, H: T.H || 40, s: T.s || 1, sp: [], fire: T.fire };
      for (let V = 0; V < R; V++) {
        let G = new gn(new dn({ map: r, transparent: !0, depthWrite: !1 }));
        (s.scene.add(G), L.sp.push({ s: G, ph: V / R, rot: Math.random() * 6, dx: Math.random() * 2 - 1, dz: Math.random() * 2 - 1 }));
      }
      if (T.fire) {
        L.fl = [];
        for (let V = 0; V < 5; V++) {
          let G = new gn(new dn({ map: o, transparent: !0, depthWrite: !1, blending: un }));
          (s.scene.add(G), L.fl.push({ s: G, ph: Math.random(), dx: (Math.random() * 2 - 1) * L.s, dz: (Math.random() * 2 - 1) * L.s }));
        }
      }
      return (d.push(L), L);
    }),
      (t.fireLights = []));
    let p = [],
      g = new at(1, 1, 1),
      y = new Xe({ color: "#2a2522", roughness: 0.9 });
    for (let P = 0; P < 60; P++) {
      let N = new we(g, y);
      ((N.visible = !1), (N.castShadow = !0), s.scene.add(N), p.push({ m: N, age: 9 }));
    }
    let m = 0,
      f = new di("#ffad5c", 0, 60, 1.6);
    s.scene.add(f);
    let v = 9;
    t.explode = (P, N, z, T = 1) => {
      (f.position.set(P, N + 2, z), (v = 0), (f.userData.s = T));
      for (let R = 0; R < 10; R++) {
        let L = new C(Math.random() * 2 - 1, Math.random() + 0.2, Math.random() * 2 - 1).normalize();
        u(h, {
          x: P,
          y: N + 0.8,
          z,
          vx: L.x * 5 * T,
          vy: L.y * 4 * T,
          vz: L.z * 5 * T,
          life: 0.8,
          s0: 2 * T,
          s1: 6 * T,
          o0: 0.9,
          c0: [1, 0.85, 0.5],
          c1: [1, 0.3, 0.08],
          drag: 4,
        });
      }
      for (let R = 0; R < 22; R++) {
        let L = new C(Math.random() * 2 - 1, Math.random() * 1.3 + 0.1, Math.random() * 2 - 1).normalize();
        u(c, {
          x: P,
          y: N + 1,
          z,
          vx: L.x * 4 * T,
          vy: L.y * 3 * T + 1,
          vz: L.z * 4 * T,
          life: 6 + Math.random() * 4,
          s0: 2 * T,
          s1: 9 * T,
          o0: 0.85,
          c0: [0.55, 0.33, 0.2],
          c1: [0.2, 0.18, 0.16],
          drag: 1.6,
          up: 0.8,
        });
      }
      for (let R = 0; R < 12; R++) {
        let L = (R / 12) * 6.283;
        u(c, {
          x: P,
          y: N + 0.5,
          z,
          vx: Math.cos(L) * 9 * T,
          vy: 0.3,
          vz: Math.sin(L) * 9 * T,
          life: 4,
          s0: 1.5 * T,
          s1: 5 * T,
          o0: 0.6,
          c0: [0.62, 0.53, 0.43],
          drag: 2.2,
        });
      }
      for (let R = 0; R < 14; R++) {
        let L = p[m];
        ((m = (m + 1) % p.length), (L.age = 0), (L.m.visible = !0));
        let V = (0.08 + Math.random() * 0.22) * T;
        (L.m.scale.set(V, V * (0.5 + Math.random() * 0.5), V),
          (L.rest = !1),
          L.m.position.set(P, N + 0.5, z),
          (L.v = new C((Math.random() * 2 - 1) * 7, 7 + Math.random() * 10, (Math.random() * 2 - 1) * 7).multiplyScalar(T * 0.8)),
          (L.w = new C(Math.random() * 9, Math.random() * 9, Math.random() * 9)));
      }
    };
    let x = new at(0.035, 0.035, 1);
    x.translate(0, 0, -0.5);
    let _ = [
        new ot({ color: new pe(4, 2.6, 1.2), transparent: !0, blending: un, depthWrite: !1, fog: !1 }),
        new ot({ color: new pe(4, 1.3, 0.6), transparent: !0, blending: un, depthWrite: !1, fog: !1 }),
      ],
      S = [];
    for (let P = 0; P < 40; P++) {
      let N = new we(x, _[0]);
      ((N.visible = !1), (N.frustumCulled = !1), s.scene.add(N), S.push({ m: N, age: 9 }));
    }
    let b = 0;
    ((t.tracer = (P, N, z = 0) => {
      let T = S[b];
      ((b = (b + 1) % S.length),
        (T.a = P.clone()),
        (T.dir = N.clone().sub(P)),
        (T.L = T.dir.length()),
        T.dir.normalize(),
        (T.age = 0),
        (T.m.material = _[z]),
        (T.m.visible = !0));
    }),
      (t.muzzle = (P, N, z) => {
        u(h, { x: P.x + N.x * 0.08, y: P.y + N.y * 0.08, z: P.z + N.z * 0.08, life: 0.05, s0: z ? 1.1 : 0.55, s1: z ? 1.4 : 0.8, o0: 1, c0: [1, 0.78, 0.45] });
      }),
      (t.puff = (P, N, z) => {
        let T = z !== "blood",
          R = z === "metal";
        for (let L = 0; L < (T ? 3 : 2); L++)
          u(c, {
            x: P.x + N[0] * 0.05,
            y: P.y + N[1] * 0.05,
            z: P.z + N[2] * 0.05,
            vx: N[0] * 1.2 + (Math.random() - 0.5) * 0.6,
            vy: N[1] * 1.2 + 0.3,
            vz: N[2] * 1.2 + (Math.random() - 0.5) * 0.6,
            life: 0.7,
            s0: 0.2,
            s1: 1.1,
            o0: T ? 0.7 : 0.85,
            c0: T ? [0.55, 0.47, 0.38] : [0.45, 0.04, 0.03],
            drag: 2.5,
          });
        (R || (T && Math.random() < 0.4)) && u(h, { x: P.x, y: P.y, z: P.z, life: 0.06, s0: 0.25, s1: 0.35, o0: 1, c0: [1, 0.8, 0.5] });
      }),
      (t.update = (P, N) => {
        for (let z = l.length - 1; z >= 0; z--) {
          let T = l[z];
          T.age += P;
          let R = T.age / T.life;
          if (R >= 1) {
            ((T.s.visible = !1), l.splice(z, 1));
            continue;
          }
          let L = Math.exp(-(T.drag || 0) * P);
          ((T.vx *= L),
            (T.vz *= L),
            (T.vy = T.vy * L + (T.up || 0) * P - (T.grav || 0) * P),
            (T.s.position.x += T.vx * P),
            (T.s.position.y += T.vy * P),
            (T.s.position.z += T.vz * P));
          let V = T.s0 + (T.s1 - T.s0) * Math.sqrt(R);
          (T.s.scale.set(V, V, 1), (T.s.material.rotation = T.rot + T.age * 0.2));
          let G = T.c1 ? T.c0.map((W, q) => W + (T.c1[q] - W) * Math.min(1, R * 2)) : T.c0;
          (T.s.material.color.setRGB(G[0], G[1], G[2]), (T.s.material.opacity = T.o0 * Math.min(1, T.age * 12) * (1 - R)));
        }
        for (let z of d) {
          for (let T of z.sp) {
            let R = ((N * 0.045) / z.s + T.ph) % 1,
              L = T.s,
              V = z.y + 1 + R * z.H,
              G = R * R * z.H * 0.45;
            L.position.set(z.x + T.dx * (1 + R * 3) * z.s + G, V, z.z + T.dz * (1 + R * 3) * z.s - G * 0.2);
            let W = (2 + R * 8.5) * z.s;
            (L.scale.set(W, W, 1), (L.material.rotation = T.rot + N * 0.05 * T.dx));
            let q = Math.min(1, Math.max(0, (R - 0.05) / 0.65)),
              Z = s.night ? 0.35 : 1;
            (L.material.color.setRGB((0.09 + 0.21 * q) * Z, (0.085 + 0.175 * q) * Z, (0.08 + 0.15 * q) * Z),
              (L.material.opacity = Math.min(1, R * 10) * Math.pow(1 - R, 1.6) * 0.75));
          }
          if (z.fl)
            for (let T of z.fl) {
              let R = (N * 1.3 + T.ph) % 1;
              T.s.position.set(z.x + T.dx * 0.6, z.y + 0.3 + R * 1.8 * z.s, z.z + T.dz * 0.6);
              let L = (1.6 - R) * 1.4 * z.s;
              (T.s.scale.set(L, L * 1.3, 1), T.s.material.color.setRGB(1, 0.6 - 0.35 * R, 0.25 - 0.2 * R), (T.s.material.opacity = (1 - R) * 0.9));
            }
        }
        ((v += P), (f.intensity = v < 1 ? 3e3 * (f.userData.s || 1) * Math.exp(-v * 9) : 0));
        for (let z of p) {
          if (z.age > 8) continue;
          if (((z.age += P), z.age > 8)) {
            z.m.visible = !1;
            continue;
          }
          let T = z.m.position;
          if (!z.rest) {
            ((z.v.y -= 9.8 * P), T.addScaledVector(z.v, P), (z.m.rotation.x += z.w.x * P), (z.m.rotation.y += z.w.y * P));
            let R = e.H(T.x, T.z);
            T.y < R + 0.05 && ((T.y = R + 0.05), (z.rest = !0));
          }
          z.age < 0.05 && (z.rest = !1);
        }
        for (let z of S) {
          if (z.age > 2) continue;
          z.age += P;
          let T = z.age * 330;
          if (T > z.L + 5) {
            ((z.m.visible = !1), (z.age = 9));
            continue;
          }
          let R = Math.min(z.L, T),
            L = Math.max(0, R - 5);
          if (R - L < 0.05) {
            z.m.visible = !1;
            continue;
          }
          ((z.m.visible = !0), z.m.position.copy(z.a).addScaledVector(z.dir, R), z.m.lookAt(z.m.position.clone().add(z.dir)), z.m.scale.set(1, 1, R - L));
        }
      }));
    let M = 48,
      A = new Ue();
    A.setAttribute("position", new Ge(new Float32Array(M * 3), 3));
    let E = new sn(A, new qr({ color: "#f2c14e", dashSize: 0.25, gapSize: 0.18, transparent: !0, opacity: 0.85, depthTest: !1 }));
    ((E.renderOrder = 8), (E.frustumCulled = !1), (E.visible = !1), s.scene.add(E));
    let w = new we(new li(0.35, 0.5, 24), new ot({ color: "#f2c14e", transparent: !0, opacity: 0.8, depthTest: !1, side: Rt }));
    return (
      (w.rotation.x = -Math.PI / 2),
      (w.renderOrder = 8),
      (w.visible = !1),
      s.scene.add(w),
      (t.arc = (P, N, z) => {
        let T = A.attributes.position,
          R = P.clone(),
          L = N.clone(),
          V = 0.05,
          G = 0,
          W = null;
        for (; G < M; G++) {
          if ((T.setXYZ(G, R.x, R.y, R.z), W)) continue;
          let q = L.clone().multiplyScalar(V),
            Z = q.length(),
            $ = q.clone().normalize(),
            H = e.ray(R.x, R.y, R.z, $.x, $.y, $.z, Z);
          (H ? (R.set(H.x, H.y, H.z), (W = H)) : R.add(q), (L.y -= z * V));
        }
        ((T.needsUpdate = !0), A.setDrawRange(0, M), E.computeLineDistances(), (E.visible = !0), (w.visible = !!W), W && w.position.set(W.x, W.y + 0.05, W.z));
      }),
      (t.arcHide = () => {
        ((E.visible = !1), (w.visible = !1));
      }),
      (t.clear = () => {
        ((E.visible = !1), (w.visible = !1));
        for (let P of d) {
          for (let N of P.sp) s.scene.remove(N.s);
          if (P.fl) for (let N of P.fl) s.scene.remove(N.s);
        }
        d.length = 0;
        for (let P of l) P.s.visible = !1;
        l.length = 0;
        for (let P of p) ((P.m.visible = !1), (P.age = 9));
      }),
      t
    );
  }
