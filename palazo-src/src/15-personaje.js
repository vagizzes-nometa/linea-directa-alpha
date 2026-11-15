  function Jg(s) {
    let e = new Map(),
      t = new Map(),
      n = s.clone();
    return (
      jg(s, n, function (i, r) {
        (e.set(r, i), t.set(i, r));
      }),
      n.traverse(function (i) {
        if (!i.isSkinnedMesh) return;
        let r = i,
          o = e.get(i),
          a = o.skeleton.bones;
        ((r.skeleton = o.skeleton.clone()),
          r.bindMatrix.copy(o.bindMatrix),
          (r.skeleton.bones = a.map(function (c) {
            return t.get(c);
          })),
          r.bind(r.skeleton, r.bindMatrix));
      }),
      n
    );
  }
  function jg(s, e, t) {
    t(s, e);
    for (let n = 0; n < s.children.length; n++) jg(s.children[n], e.children[n], t);
  }
  var ms = Math.PI / 180,
    bf = {};
  function ro(s) {
    if (bf[s]) return bf[s];
    let e = pa.weapons[s];
    if (!e) return null;
    let t = Uint8Array.from(atob(e.p), (l) => l.charCodeAt(0)),
      n = new Int16Array(t.buffer),
      i = Uint8Array.from(atob(e.c), (l) => l.charCodeAt(0)),
      r = new Float32Array(n.length);
    for (let l = 0; l < n.length; l++) r[l] = n[l] / 4e3;
    let o = r.length / 3,
      a = new Float32Array(o * 3),
      c = new pe();
    for (let l = 0; l < o / 3; l++) {
      c.setRGB(i[l * 3] / 255, i[l * 3 + 1] / 255, i[l * 3 + 2] / 255, ht);
      for (let u = 0; u < 3; u++) ((a[(l * 3 + u) * 3] = c.r), (a[(l * 3 + u) * 3 + 1] = c.g), (a[(l * 3 + u) * 3 + 2] = c.b));
    }
    let h = new Ue();
    return (h.setAttribute("position", new Ge(r, 3)), h.setAttribute("color", new Ge(a, 3)), h.computeVertexNormals(), h.computeBoundingBox(), (bf[s] = h));
  }
  var Mb = new Xe({ vertexColors: !0, roughness: 0.55, metalness: 0.35 });
  function oo(s) {
    if (s === "grenade") {
      let n = new ut(),
        i = new we(new ai(0.052, 1), new Xe({ color: "#4f6b34", roughness: 0.6 }));
      return (i.scale.set(1, 1.22, 1), n.add(i), n);
    }
    let e = ro(s),
      t = new we(e || new at(0.05, 0.1, 0.6), Mb);
    return ((t.castShadow = !0), t);
  }
  function bb(s) {
    let e = ro(s),
      t = e ? e.boundingBox : { min: { z: -0.5, y: -0.1 }, max: { z: 0.25, y: 0.1 } },
      n = t.max.z - t.min.z;
    return s === "pistol" || s === "revolver"
      ? { two: !0, pos: [0.06, 0.08, -0.36], gripR: [0, -0.06, t.max.z - 0.07], gripL: [-0.035, -0.075, t.max.z - 0.05] }
      : s === "grenade"
        ? { two: !1, pos: [0.16, -0.05, -0.28], gripR: [0, 0, 0.03], gripL: null }
        : s === "knife" || s === "axe" || s === "katana"
          ? { two: !1, pos: [0.18, -0.1, -0.3], gripR: [0, 0, t.max.z - 0.06], gripL: null }
          : { two: !0, pos: [0.1, 0.1, 0.1 - t.max.z], gripR: [0, -0.035, t.max.z - 0.26 * n], gripL: [-0.02, -0.03, t.max.z - 0.53 * n] };
  }
  var Sb = [-28, 22, 8],
    Eb = [-0.02, -0.14, 0];
  function Tb(s, e) {
    ((s.onBeforeCompile = (t) => {
      ((t.uniforms.zS = { value: e }),
        (t.vertexShader = t.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vZP;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vZP=position;`,
          )),
        (t.fragmentShader = t.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vZP;uniform float zS;
float zh(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float zn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(mix(zh(i),zh(i+vec3(1,0,0)),f.x),mix(zh(i+vec3(0,1,0)),zh(i+vec3(1,1,0)),f.x),f.y),mix(mix(zh(i+vec3(0,0,1)),zh(i+vec3(1,0,1)),f.x),mix(zh(i+vec3(0,1,1)),zh(i+vec3(1,1,1)),f.x),f.y),f.z);}`,
          )
          .replace(
            "#include <color_fragment>",
            `#include <color_fragment>
  vec3 q=vZP*zS;float a=zn(q*2.)*.65+zn(q*5.)*.35,b=zn(q*3.5+7.3),c=zn(q*7.+2.1);
  float lum=dot(diffuseColor.rgb,vec3(.3,.55,.15));diffuseColor.rgb=mix(diffuseColor.rgb,lum*vec3(.92,1.02,.8)*1.25,.7);
  diffuseColor.rgb*=mix(vec3(1.),vec3(.5,.5,.42),smoothstep(.55,.75,a));
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.5,.58),smoothstep(.72,.86,c)*.45);
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.3,.06,.05),smoothstep(.8,.9,b)*.7);`,
          )));
    }),
      (s.customProgramCacheKey = () => "zskin"));
  }
  function gs(s, { team: e = 0, tint: t, zombie: n = !1 } = {}) {
    let i = pa.soldier,
      r = Jg(i.scene),
      o = [];
    r.traverse((T) => {
      if (T.isMesh) {
        if (
          ((T.castShadow = !0),
          (T.receiveShadow = !0),
          (T.frustumCulled = !1),
          (T.material = T.material.clone()),
          T.material.color.set(t || (e === 0 ? "#a2a47c" : "#6f7682")),
          n)
        ) {
          T.geometry.computeBoundingBox();
          let R = T.geometry.boundingBox;
          (Tb(T.material, 1.8 / Math.max(0.01, R.max.y - R.min.y)), (T.material.roughness = 0.95));
        }
        ((T.material.envMapIntensity = 0.6), o.push(T.material));
      }
    });
    let a = new ut(),
      c = new ut();
    (c.add(r), a.add(c), s.scene.add(a));
    let h = new oa(r),
      l = (T) => i.animations.find((R) => R.name.toLowerCase() === T.toLowerCase()),
      u = { idle: h.clipAction(l("Idle")), walk: h.clipAction(l("Walk")), run: h.clipAction(l("Run")) };
    for (let T in u) (u[T].play(), (u[T].weight = T === "idle" ? 1 : 0));
    let d = {};
    r.traverse((T) => {
      T.isBone && (d[T.name] = T);
    });
    let p = new ut();
    s.scene.add(p);
    let g = null,
      y = "",
      m = {
        root: a,
        body: c,
        model: r,
        mixer: h,
        bm: d,
        gun: p,
        team: e,
        zombie: n,
        atk: 0,
        phase: Math.random() * 6,
        alive: !0,
        deadT: 0,
        flash: 0,
        weapon: "",
        grip: null,
        w: { idle: 1, walk: 0, run: 0 },
      };
    m.setWeapon = (T) => {
      T !== y && ((y = T), g && p.remove(g), (g = T ? oo(T) : null), g && p.add(g), (m.grip = T ? bb(T) : null), (m.weapon = T));
    };
    let f = () => new C(),
      v = () => new Dt(),
      x = v(),
      _ = f(),
      S = (T) => T.getWorldPosition(f());
    function b(T, R, L) {
      let G = v().setFromUnitVectors(R.normalize(), L.normalize()).multiply(T.getWorldQuaternion(v()));
      (T.quaternion.copy(T.parent.getWorldQuaternion(v()).invert().multiply(G)), T.updateMatrixWorld(!0));
    }
    function M(T, R) {
      (T.quaternion.copy(T.parent.getWorldQuaternion(v()).invert().multiply(R)), T.updateMatrixWorld(!0));
    }
    function A(T, R, L, V, G) {
      let W = S(T),
        q = S(R),
        Z = S(L),
        $ = W.distanceTo(q),
        H = q.distanceTo(Z),
        K = V.clone().sub(W),
        ce = Math.min(Math.max(K.length(), 0.05), $ + H - 0.002),
        fe = K.normalize(),
        de = ($ * $ - H * H + ce * ce) / (2 * ce),
        be = Math.sqrt(Math.max(0, $ * $ - de * de)),
        Ee = G.clone()
          .sub(fe.clone().multiplyScalar(G.dot(fe)))
          .normalize();
      b(T, q.clone().sub(W), W.clone().addScaledVector(fe, de).addScaledVector(Ee, be).sub(W));
      let ye = S(R),
        ge = S(L);
      b(R, ge.clone().sub(ye), W.clone().addScaledVector(fe, ce).sub(ye));
    }
    let E = ["Left", "Right"];
    m.update = (T, R) => {
      if (m.flash > 0) {
        m.flash -= T;
        let H = Math.max(0, m.flash / 0.12);
        for (let K of o) K.emissive.setRGB(H * 0.6, H * 0.05, H * 0.03);
      }
      if (!m.alive) {
        m.deadT += T;
        let H = Math.min(1, m.deadT / 0.55),
          K = H * H;
        ((c.rotation.x = m.fallDir * K * 1.45),
          (c.position.y = -0.1 * K),
          m.deadT < 0.6 && h.update(T * 0.3),
          (p.position.y += (m.gunFloor - p.position.y) * Math.min(1, T * 6)),
          (p.rotation.z += (1.5 - p.rotation.z) * Math.min(1, T * 5)));
        return;
      }
      let L = R.speed || 0,
        V = R.fw ?? 1,
        G = R.sd || 0,
        W = R.crouch || 0,
        q = n ? { idle: L < 0.2 ? 1 : 0, walk: L >= 0.2 ? 1 : 0, run: 0 } : { idle: L < 0.4 ? 1 : 0, walk: L >= 0.4 && L < 3.4 ? 1 : 0, run: L >= 3.4 ? 1 : 0 };
      for (let H in u) ((m.w[H] += (q[H] - m.w[H]) * Math.min(1, T * 8)), (u[H].weight = m.w[H]));
      let Z = V < -0.3 ? -1 : 1;
      ((u.walk.timeScale = n ? Math.max(0.35, L / 1.9) : Z * Math.max(0.6, L / 1.6)),
        (u.run.timeScale = Z * Math.max(0.8, L / 4.3)),
        (u.idle.timeScale = 1),
        h.update(T));
      let $ = 0;
      (L > 0.4 && ($ = Math.max(-1.05, Math.min(1.05, Math.atan2(-G, Math.abs(V)) * 0.85)) * (Z < 0 ? -1 : 1)),
        (c.rotation.y += ($ - c.rotation.y) * Math.min(1, T * 10)));
      for (let H of ["mixamorigSpine", "mixamorigSpine1", "mixamorigSpine2"]) d[H].quaternion.multiply(x.setFromAxisAngle(_.set(0, 1, 0), -c.rotation.y / 3));
      if (((c.position.y = -0.4 * W), W > 0))
        for (let H of E)
          (d["mixamorig" + H + "UpLeg"].quaternion.multiply(x.setFromAxisAngle(_.set(1, 0, 0), -62 * ms * W)),
            d["mixamorig" + H + "Leg"].quaternion.multiply(x.setFromAxisAngle(_.set(1, 0, 0), 100 * ms * W)));
      if ((a.updateMatrixWorld(!0), n)) {
        z(T, L);
        return;
      }
      if (m.grip) {
        let H = m.grip,
          K = a.quaternion,
          ce = !R.aim && L > 3.4 && H.two,
          fe = R.reload || 0,
          de = new C(...H.pos);
        (ce && de.add(new C(...Eb)), fe && (de.y -= 0.12 * Math.sin(fe * Math.PI)), p.position.copy(S(d.mixamorigSpine2)).add(de.applyQuaternion(K)));
        let be = (R.pitch || 0) / ms,
          Ee = ce ? Sb : [be - (fe ? 25 * Math.sin(fe * Math.PI) : 0), 0, fe ? 20 * Math.sin(fe * Math.PI) : 0];
        (p.quaternion.copy(K).multiply(v().setFromEuler(new ts(Ee[0] * ms, Ee[1] * ms, Ee[2] * ms, "YXZ"))), p.updateMatrixWorld(!0));
        let ye = { a: d.mixamorigRightArm, f: d.mixamorigRightForeArm, h: d.mixamorigRightHand },
          ge = { a: d.mixamorigLeftArm, f: d.mixamorigLeftForeArm, h: d.mixamorigLeftHand },
          k = p.quaternion.clone().multiply(v().setFromEuler(new ts(-90 * ms, 0, 0)));
        if ((A(ye.a, ye.f, ye.h, p.localToWorld(new C(...H.gripR)), new C(1, -1.2, 0.3).applyQuaternion(K)), M(ye.h, k), H.gripL)) {
          let ue = p.localToWorld(new C(...H.gripL));
          (fe > 0 && fe < 1 && ue.add(new C(0, -0.18 * Math.sin(fe * Math.PI), 0.1).applyQuaternion(K)),
            A(ge.a, ge.f, ge.h, ue, new C(-0.6, -1, 0.1).applyQuaternion(K)),
            M(ge.h, k));
        }
        for (let ue of ["Left", "Right"])
          for (let re of ["Index", "Middle", "Ring", "Pinky"])
            for (let le of [1, 2, 3]) {
              let te = d["mixamorig" + ue + "Hand" + re + le];
              te && te.quaternion.multiply(x.setFromAxisAngle(_.set(0, 0, 1), 70 * ms));
            }
      }
    };
    let w = f(),
      P = f(),
      N = f();
    function z(T, R) {
      ((m.phase += T * (1.2 + R * 1.6)), (m.atk = Math.max(0, m.atk - T)));
      let L = a.quaternion;
      (w.set(0, 0, -1).applyQuaternion(L), N.set(1, 0, 0).applyQuaternion(L), P.set(0, 1, 0));
      let V = Math.sin(m.phase);
      ((c.rotation.z = V * 0.07), (c.rotation.y = Math.sin(m.phase * 0.5) * 0.12), a.updateMatrixWorld(!0));
      let G = 0.62 + 0.05 * V;
      (b(d.mixamorigSpine1, S(d.mixamorigNeck).sub(S(d.mixamorigSpine1)), P.clone().multiplyScalar(Math.cos(G)).addScaledVector(w, Math.sin(G))),
        b(
          d.mixamorigNeck,
          S(d.mixamorigHead).sub(S(d.mixamorigNeck)),
          P.clone()
            .multiplyScalar(0.55)
            .addScaledVector(w, 0.75)
            .addScaledVector(N, 0.28 + 0.06 * Math.sin(m.phase * 0.7)),
        ));
      let W = m.atk > 0 ? Math.sin((1 - m.atk / 0.45) * Math.PI) : 0;
      for (let [q, Z] of [
        ["Right", 1],
        ["Left", -1],
      ]) {
        let $ = d["mixamorig" + q + "Arm"],
          H = d["mixamorig" + q + "ForeArm"],
          K = d["mixamorig" + q + "Hand"],
          ce = Z > 0 ? V : -V,
          fe = -0.28 + 0.9 * W + 0.08 * ce;
        (b(
          $,
          S(H).sub(S($)),
          w
            .clone()
            .multiplyScalar(0.95)
            .addScaledVector(P, fe)
            .addScaledVector(N, Z * 0.18),
        ),
          b(
            H,
            S(K).sub(S(H)),
            w
              .clone()
              .addScaledVector(P, fe - 0.05 + 0.25 * W)
              .addScaledVector(N, -Z * 0.08),
          ));
      }
    }
    return (
      (m.attack = () => {
        m.atk = 0.45;
      }),
      (m.hitFlash = () => {
        m.flash = 0.12;
      }),
      (m.die = (T) => {
        ((m.alive = !1), (m.deadT = 0), (m.fallDir = T || (Math.random() < 0.5 ? -1 : 1)), (m.gunFloor = a.position.y + 0.08));
      }),
      (m.revive = () => {
        ((m.alive = !0), c.rotation.set(0, 0, 0), (c.position.y = 0), p.rotation.set(0, 0, 0));
        for (let T of o) T.emissive.setRGB(0, 0, 0);
      }),
      (m.setVisible = (T) => {
        ((a.visible = T), (p.visible = T));
      }),
      (m.dispose = () => {
        (s.scene.remove(a), s.scene.remove(p));
      }),
      (m.hitRay = (T, R, L) => {
        if (!m.alive) return null;
        let V = S(d.mixamorigHead).add(_.set(0, 0.09, 0)),
          G = S(d.mixamorigHips),
          W = a.position,
          q = null,
          Z = (K, ce) => {
            let fe = T.x - K.x,
              de = T.y - K.y,
              be = T.z - K.z,
              Ee = fe * R.x + de * R.y + be * R.z,
              ye = fe * fe + de * de + be * be - ce * ce,
              ge = Ee * Ee - ye;
            if (ge < 0) return null;
            let k = -Ee - Math.sqrt(ge);
            return k > 0 && k < L ? k : null;
          },
          $ = Z(V, 0.17);
        $ !== null && (q = { t: $, head: !0 });
        let H = S(d.mixamorigNeck);
        for (let K = 0; K <= 5; K++) {
          let ce = K / 5,
            fe = new C().lerpVectors(new C(W.x * 0.5 + G.x * 0.5, W.y + 0.35, W.z * 0.5 + G.z * 0.5), H, ce),
            de = K < 2 ? 0.2 : 0.27,
            be = Z(fe, de);
          be !== null && (!q || be < q.t) && (q = { t: be, head: !1 });
        }
        return q;
      }),
      (m.headPos = () => S(d.mixamorigHead)),
      (m.muzzle = () => {
        let T = ro(y),
          R = T ? T.boundingBox.min.z : -0.5;
        return p.localToWorld(new C(0, 0.03, R));
      }),
      m
    );
  }
