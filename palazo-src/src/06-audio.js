  function Hg() {
    let s = { ctx: null, vol: 0.8, listener: { x: 0, y: 0, z: 0, yaw: 0 } },
      e = null,
      t = null,
      n = null;
    ((s.unlock = () => {
      if (s.ctx) {
        s.ctx.resume();
        return;
      }
      let y = window.AudioContext || window.webkitAudioContext;
      if (!y) return;
      ((s.ctx = new y()),
        (n = s.ctx.createDynamicsCompressor()),
        (n.threshold.value = -14),
        (n.ratio.value = 4),
        (t = s.ctx.createGain()),
        (t.gain.value = s.vol),
        t.connect(n),
        n.connect(s.ctx.destination));
      let m = s.ctx.sampleRate * 2;
      e = s.ctx.createBuffer(1, m, s.ctx.sampleRate);
      let f = e.getChannelData(0);
      for (let v = 0; v < m; v++) f[v] = Math.random() * 2 - 1;
    }),
      (s.setVol = (y) => {
        ((s.vol = y), t && (t.gain.value = y));
      }));
    function i(y, m = 1) {
      if (!y) return { g: m, pan: 0, lp: 2e4, delay: 0 };
      let f = s.listener,
        v = y.x - f.x,
        x = y.z - f.z,
        _ = Math.hypot(v, y.y - f.y, x),
        S = Math.atan2(v, -x) + f.yaw;
      return {
        g: m / (1 + _ * _ * 0.004),
        pan: Math.max(-1, Math.min(1, Math.sin(S) * 0.85)),
        lp: Math.max(700, 18e3 / (1 + _ * 0.07)),
        delay: (_ / 343) * 0.6,
        d: _,
      };
    }
    function r(y) {
      let m = s.ctx.createGain(),
        f = s.ctx.createBiquadFilter(),
        v = s.ctx.createStereoPanner ? s.ctx.createStereoPanner() : null;
      return ((f.type = "lowpass"), (f.frequency.value = y.lp), m.connect(f), v ? ((v.pan.value = y.pan), f.connect(v), v.connect(t)) : f.connect(t), m);
    }
    function o(y, m, { dur: f = 0.3, f0: v = 800, f1: x = 200, q: _ = 0.7, type: S = "lowpass", g: b = 1, att: M = 0.002 }) {
      let A = s.ctx.createBufferSource();
      ((A.buffer = e), (A.playbackRate.value = 0.8 + Math.random() * 0.4));
      let E = s.ctx.createBiquadFilter();
      ((E.type = S), (E.Q.value = _), E.frequency.setValueAtTime(v, m), E.frequency.exponentialRampToValueAtTime(Math.max(30, x), m + f));
      let w = s.ctx.createGain();
      (w.gain.setValueAtTime(0, m),
        w.gain.linearRampToValueAtTime(b, m + M),
        w.gain.exponentialRampToValueAtTime(5e-4, m + f),
        A.connect(E),
        E.connect(w),
        w.connect(y),
        A.start(m, Math.random()),
        A.stop(m + f + 0.05));
    }
    function a(y, m, { f0: f = 120, f1: v = 50, dur: x = 0.15, g: _ = 0.6, type: S = "sine" }) {
      let b = s.ctx.createOscillator();
      ((b.type = S), b.frequency.setValueAtTime(f, m), b.frequency.exponentialRampToValueAtTime(Math.max(20, v), m + x));
      let M = s.ctx.createGain();
      (M.gain.setValueAtTime(_, m), M.gain.exponentialRampToValueAtTime(5e-4, m + x), b.connect(M), M.connect(y), b.start(m), b.stop(m + x + 0.05));
    }
    ((s.shot = (y, m, f) => {
      if (!s.ctx) return;
      let v = i(f ? null : m, f ? 0.9 : 1.2);
      if (v.g < 0.004) return;
      let x = r(v);
      x.gain.value = v.g;
      let _ = s.ctx.currentTime + (f ? 0 : v.delay);
      if (y === "silent") {
        (a(x, _, { f0: 420, f1: 160, dur: 0.05, g: 0.35 }), o(x, _, { dur: 0.07, f0: 2200, f1: 600, g: 0.3 }));
        return;
      }
      let S = y === "sniper" || y === "carbine" || y === "shotgun" || y === "revolver",
        b = y === "pistol" || y === "smg";
      (o(x, _, { dur: 0.025, f0: 9e3, f1: 3e3, type: "highpass", g: 0.9 }),
        a(x, _, { f0: S ? 150 : b ? 260 : 190, f1: 45, dur: S ? 0.16 : 0.09, g: S ? 0.9 : 0.6 }),
        o(x, _, { dur: S ? 0.7 : 0.38, f0: S ? 2200 : 3e3, f1: 150, g: S ? 0.75 : 0.5, att: 0.004 }));
    }),
      (s.boom = (y, m = 1) => {
        if (!s.ctx) return;
        let f = i(y, 1.6 * m),
          v = r(f);
        v.gain.value = Math.min(1.6, f.g * 3);
        let x = s.ctx.currentTime + f.delay;
        (a(v, x, { f0: 70, f1: 28, dur: 1.4, g: 1.2 }),
          o(v, x, { dur: 1.8, f0: 1400, f1: 60, g: 1 }),
          o(v, x, { dur: 0.06, f0: 7e3, f1: 2e3, type: "highpass", g: 0.6 }));
        for (let _ = 0; _ < 10; _++) o(v, x + 0.3 + Math.random() * 1.6, { dur: 0.03, f0: 5e3, f1: 2500, type: "highpass", g: 0.12 * Math.random() });
      }),
      (s.hit = (y) => {
        if (!s.ctx) return;
        let m = r({ pan: 0, lp: 2e4 });
        m.gain.value = 0.35;
        let f = s.ctx.currentTime;
        a(m, f, { f0: y ? 1900 : 1300, f1: y ? 1700 : 1100, dur: 0.06, g: 0.5, type: "triangle" });
      }),
      (s.impact = (y) => {
        if (!s.ctx) return;
        let m = i(y, 0.5);
        if (m.g < 0.01) return;
        let f = r(m);
        ((f.gain.value = m.g), o(f, s.ctx.currentTime, { dur: 0.06, f0: 3500, f1: 800, type: "bandpass", q: 1.5, g: 0.6 }));
      }),
      (s.step = (y, m) => {
        if (!s.ctx) return;
        let f = i(m ? null : y, m ? 0.25 : 0.35);
        if (f.g < 0.01) return;
        let v = r(f);
        ((v.gain.value = f.g), o(v, s.ctx.currentTime, { dur: 0.08, f0: 900, f1: 200, type: "lowpass", g: 0.5 }));
      }),
      (s.ui = (y = 880) => {
        if (!s.ctx) return;
        let m = r({ pan: 0, lp: 2e4 });
        ((m.gain.value = 0.25), a(m, s.ctx.currentTime, { f0: y, f1: y, dur: 0.08, g: 0.4, type: "triangle" }));
      }),
      (s.pick = () => {
        if (!s.ctx) return;
        let y = r({ pan: 0, lp: 2e4 });
        y.gain.value = 0.25;
        let m = s.ctx.currentTime;
        (a(y, m, { f0: 700, f1: 700, dur: 0.07, g: 0.4, type: "triangle" }), a(y, m + 0.08, { f0: 1050, f1: 1050, dur: 0.1, g: 0.4, type: "triangle" }));
      }),
      (s.click = () => {
        if (!s.ctx) return;
        let y = r({ pan: 0, lp: 2e4 });
        ((y.gain.value = 0.3), o(y, s.ctx.currentTime, { dur: 0.04, f0: 4e3, f1: 1500, type: "bandpass", q: 3, g: 0.7 }));
      }),
      (s.hurt = () => {
        if (!s.ctx) return;
        let y = r({ pan: 0, lp: 3e3 });
        ((y.gain.value = 0.4), a(y, s.ctx.currentTime, { f0: 180, f1: 90, dur: 0.2, g: 0.6, type: "sawtooth" }));
      }));
    let c = null,
      h = () => {
        if (c) return c;
        c = new Float32Array(1024);
        for (let y = 0; y < 1024; y++) {
          let m = y / 511.5 - 1;
          c[y] = Math.tanh(3.2 * m);
        }
        return c;
      };
    function l(y, m, { f0: f, rise: v = 1, fall: x = 0.72, dur: _, form: S, fry: b = 32, fryD: M = 0.7, rough: A = !1, g: E = 1, breath: w = 0.12 }) {
      let P = s.ctx,
        N = m + _,
        z = P.createOscillator();
      ((z.type = "sawtooth"),
        z.frequency.setValueAtTime(f, m),
        z.frequency.linearRampToValueAtTime(f * v, m + _ * 0.3),
        z.frequency.exponentialRampToValueAtTime(f * x, N));
      let T = [];
      for (let [q, Z] of [
        [5.3 + Math.random() * 2, 0.035],
        [11.7 + Math.random() * 3, 0.025],
      ]) {
        let $ = P.createOscillator(),
          H = P.createGain();
        (($.frequency.value = q), (H.gain.value = f * Z), $.connect(H), H.connect(z.frequency), T.push($));
      }
      let R = P.createGain();
      R.gain.value = 1 - M / 2;
      let L = P.createOscillator();
      ((L.type = "square"), (L.frequency.value = b * (0.85 + Math.random() * 0.3)));
      let V = P.createGain();
      ((V.gain.value = M / 2), L.connect(V), V.connect(R.gain), T.push(L), z.connect(R));
      let G = P.createGain();
      (G.gain.setValueAtTime(0, m),
        G.gain.linearRampToValueAtTime(E, m + 0.07),
        G.gain.setValueAtTime(E, m + _ * 0.55),
        G.gain.exponentialRampToValueAtTime(0.001, N));
      let W = G;
      if (A) {
        let q = P.createWaveShaper();
        ((q.curve = h()), q.connect(G), (W = q));
      }
      for (let [q, Z, $] of S) {
        let H = P.createBiquadFilter();
        ((H.type = "bandpass"), H.frequency.setValueAtTime(q, m), H.frequency.linearRampToValueAtTime(q * (0.9 + Math.random() * 0.2), N), (H.Q.value = Z));
        let K = P.createGain();
        ((K.gain.value = $ * 2.2), R.connect(H), H.connect(K), K.connect(W));
      }
      (G.connect(y), z.start(m), z.stop(N + 0.05));
      for (let q of T) (q.start(m), q.stop(N + 0.05));
      w && o(y, m, { dur: _ * 0.9, f0: 1700, f1: 900, type: "bandpass", q: 0.8, g: w, att: 0.06 });
    }
    let u = [
        [380, 6, 1],
        [850, 8, 0.5],
        [2400, 10, 0.14],
      ],
      d = [
        [720, 5, 1],
        [1150, 6, 0.7],
        [2600, 8, 0.25],
      ],
      p = [
        [450, 6, 1],
        [700, 7, 0.6],
        [2300, 10, 0.12],
      ];
    ((s.groan = (y, m) => {
      if (!s.ctx) return;
      let f = i(y, m ? 1 : 0.75);
      if (f.g < 0.006) return;
      let v = r(f);
      v.gain.value = f.g;
      let x = s.ctx.currentTime + f.delay;
      if (m)
        l(v, x, {
          f0: 115 + Math.random() * 35,
          rise: 1.25,
          fall: 0.8,
          dur: 0.55 + Math.random() * 0.45,
          form: d,
          fry: 46,
          fryD: 0.55,
          rough: !0,
          g: 0.8,
          breath: 0.18,
        });
      else {
        let _ = 68 + Math.random() * 26;
        (l(v, x, { f0: _, rise: 1.06, fall: 0.7, dur: 1.2 + Math.random() * 1, form: Math.random() < 0.5 ? u : p, fry: 30, fryD: 0.75, g: 0.9, breath: 0.1 }),
          Math.random() < 0.35 &&
            l(v, x + 1.4 + Math.random() * 0.6, { f0: _ * 0.9, rise: 1, fall: 0.8, dur: 0.5, form: u, fry: 26, fryD: 0.8, g: 0.6, breath: 0.06 }));
      }
    }),
      (s.bite = () => {
        if (!s.ctx) return;
        let y = r({ pan: 0, lp: 6e3 });
        y.gain.value = 0.55;
        let m = s.ctx.currentTime;
        (l(y, m, { f0: 150, rise: 1.3, fall: 0.85, dur: 0.32, form: d, fry: 52, fryD: 0.5, rough: !0, g: 0.9, breath: 0.2 }),
          a(y, m + 0.05, { f0: 120, f1: 50, dur: 0.18, g: 0.7 }));
        for (let f = 0; f < 3; f++) o(y, m + 0.06 + f * 0.035, { dur: 0.04, f0: 3200, f1: 900, type: "bandpass", q: 1.6, g: 0.5 });
      }),
      (s.siren = () => {
        if (!s.ctx) return;
        let y = r({ pan: 0, lp: 6e3 });
        y.gain.value = 0.22;
        let m = s.ctx.createOscillator();
        m.type = "sawtooth";
        let f = s.ctx.currentTime;
        for (let v = 0; v < 6; v++)
          (m.frequency.setValueAtTime(420, f + v), m.frequency.linearRampToValueAtTime(820, f + v + 0.5), m.frequency.linearRampToValueAtTime(420, f + v + 1));
        (m.connect(y), m.start(f), m.stop(f + 6));
      }));
    let g = null;
    return (
      (s.ambient = (y, m) => {
        if (!s.ctx || (g && (g.stop(), (g = null)), !y)) return;
        let f = s.ctx.createBufferSource();
        ((f.buffer = e), (f.loop = !0));
        let v = s.ctx.createBiquadFilter();
        ((v.type = "lowpass"), (v.frequency.value = m ? 260 : 380));
        let x = s.ctx.createGain();
        ((x.gain.value = 0.18), f.connect(v), v.connect(x), x.connect(t), f.start(), (g = f));
      }),
      s
    );
  }
