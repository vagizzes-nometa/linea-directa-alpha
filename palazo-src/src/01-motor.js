  var Pc = {
      low: { name: "Bajo", pr: 1, shadows: !1, shadowSize: 0, grass: 5e3, post: !1, bloom: !1, lights: 2, smoke: 0.5 },
      medium: { name: "Medio", pr: 1.25, shadows: !0, shadowSize: 1024, grass: 14e3, post: !0, bloom: !0, lights: 4, smoke: 0.8 },
      high: { name: "Alto", pr: 1.75, shadows: !0, shadowSize: 2048, grass: 3e4, post: !0, bloom: !0, lights: 6, smoke: 1 },
    },
    zd = () => matchMedia("(pointer:coarse)").matches || "ontouchstart" in window;
  function Ag() {
    return zd() ? "low" : "medium";
  }
  var ob = {
    uniforms: { tDiffuse: { value: null }, uT: { value: 0 }, uRes: { value: new ae(1, 1) }, uHurt: { value: 0 } },
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `uniform sampler2D tDiffuse;uniform float uT;uniform vec2 uRes;uniform float uHurt;varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uT*7.13)*43758.5453);}
  void main(){vec2 c=vUv-.5;float r=length(c);vec2 off=c*r*.005;
   vec3 col=vec3(texture2D(tDiffuse,vUv+off).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv-off).b);
   float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,.88);
   col=mix(col,col*vec3(.88,.98,1.05),1.-smoothstep(.0,.45,l));col=mix(col,col*vec3(1.05,1.,.92),smoothstep(.45,1.,l));
   col=col*col*(3.-2.*col)*.3+col*.7;
   col*=1.-smoothstep(.45,.95,r)*.5;
   col=mix(col,vec3(.55,.03,.02),uHurt*smoothstep(.25,.75,r));
   col+=(h(vUv*uRes)-.5)*.035;
   gl_FragColor=vec4(col,1.);}`,
  };
  function Rg(s) {
    let e = new Or({ antialias: !0, powerPreference: "high-performance", preserveDrawingBuffer: !1 });
    ((e.toneMapping = Kr), (e.toneMappingExposure = 0.85), (e.shadowMap.type = pc), s.appendChild(e.domElement));
    let t = new ns(),
      n = new St(70, 1, 0.05, 1200),
      i = {
        THREE: Jt,
        renderer: e,
        scene: t,
        camera: n,
        q: Pc.medium,
        qName: "medium",
        composer: null,
        grade: null,
        systems: [],
        time: 0,
        paused: !1,
        hurt: 0,
        sun: null,
        shadowFocus: new C(),
      };
    function r() {
      if (((i.composer = null), !i.q.post)) return;
      let h = new Ac(e);
      (h.addPass(new Rc(t, n)),
        i.q.bloom && h.addPass(new eo(new ae(256, 256), 0.32, 0.5, 1.6)),
        h.addPass(new Cc()),
        (i.grade = new Qr(ob)),
        h.addPass(i.grade),
        (i.composer = h),
        o());
    }
    function o() {
      let h = s.clientWidth || innerWidth,
        l = s.clientHeight || innerHeight,
        u = Math.min(devicePixelRatio || 1, i.q.pr);
      (e.setPixelRatio(u),
        e.setSize(h, l, !1),
        (e.domElement.style.width = h + "px"),
        (e.domElement.style.height = l + "px"),
        (n.aspect = h / l),
        n.updateProjectionMatrix(),
        i.composer && (i.composer.setPixelRatio(u), i.composer.setSize(h, l), i.grade && i.grade.uniforms.uRes.value.set(h * u, l * u)));
    }
    ((i.setQuality = (h) => {
      ((i.qName = h),
        (i.q = Pc[h]),
        (e.shadowMap.enabled = i.q.shadows),
        i.sun &&
          ((i.sun.castShadow = i.q.shadows),
          i.q.shadows &&
            (i.sun.shadow.mapSize.set(i.q.shadowSize, i.q.shadowSize), i.sun.shadow.map && (i.sun.shadow.map.dispose(), (i.sun.shadow.map = null)))),
        t.traverse((l) => {
          l.material && (Array.isArray(l.material) ? l.material : [l.material]).forEach((d) => (d.needsUpdate = !0));
        }),
        r(),
        o());
    }),
      (i.resize = o),
      addEventListener("resize", o),
      (i.updateShadow = () => {
        if (!i.sun || !i.q.shadows) return;
        let h = i.shadowFocus,
          l = 4,
          u = Math.round(h.x / l) * l,
          d = Math.round(h.z / l) * l;
        (i.sun.target.position.set(u, 0, d), i.sun.position.copy(i.sunDir).multiplyScalar(150).add(i.sun.target.position), i.sun.target.updateMatrixWorld());
      }),
      (i.add = (h) => (i.systems.push(h), h)));
    let a = performance.now();
    function c(h) {
      if (i.sleep) return;
      let l = Math.min(0.05, (h - a) / 1e3);
      if (((a = h), !i.paused)) {
        i.time += l;
        for (let u of i.systems) u.update && u.update(l, i.time);
      }
      for (let u of i.systems) u.always && u.always(l, i.time);
      (i.updateShadow(), i.composer && !e.xr.isPresenting ? ((i.grade.uniforms.uT.value = i.time), (i.grade.uniforms.uHurt.value = i.hurt), i.composer.render()) : e.render(t, n));
    }
    return ((i.start = () => e.setAnimationLoop(c)), i.setQuality("medium"), i);
  }
