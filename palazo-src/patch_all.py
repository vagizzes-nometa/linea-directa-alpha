#!/usr/bin/env python3
# Aplica sobre game.orig.js (el build recuperado) los cambios de VR y Superslow -> game.js
import os
D=os.path.dirname(os.path.abspath(__file__))
s=open(os.path.join(D,'game.orig.js')).read()
def R(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a));s=s.replace(a,b)
R("""    function c(h) {
      requestAnimationFrame(c);
      let l = Math.min(0.05, (h - a) / 1e3);""","""    function c(h) {
      if (i.sleep) return;
      let l = Math.min(0.05, (h - a) / 1e3);""")
R("(i.updateShadow(), i.composer ? ((i.grade.uniforms.uT.value","(i.updateShadow(), i.composer && !e.xr.isPresenting ? ((i.grade.uniforms.uT.value")
R("return ((i.start = () => requestAnimationFrame(c)), i.setQuality(\"medium\"), i);","return ((i.start = () => e.setAnimationLoop(c)), i.setQuality(\"medium\"), i);")
R("""    let { E: e, P: t, input: n, AU: i } = s,
      r = e.camera,
      o = {
        id: "me",""","""    let { E: e, P: t, input: n0, AU: i } = s,
      r = e.camera,
      o = {
        id: "me",""")
R("    (r.add(a), e.scene.add(r));","    (r.add(a), s.vr ? (s.vr.rig.parent !== e.scene && e.scene.add(s.vr.rig), r.parent !== s.vr.rig && s.vr.rig.add(r)) : e.scene.add(r));")
R("""    o.update = (N, z) => {
      let T = o.load;
      if (!o.alive) {
        ((o.deadT += N), o.char.update(N, {}));""","""    o.update = (N, z) => {
      let VR = s.vr && s.vr.on ? s.vr : null,
        n = VR ? VR.inp : n0;
      let T = o.load;
      if (!o.alive) {
        ((o.deadT += N), o.char.update(N, {}), VR && VR.dead(o));""")
R("""      if (
        ((o.yaw -= R.x * V),
        (o.pitch = Math.max(-1.45, Math.min(1.45, o.pitch - R.y * V * (s.settings.invert ? -1 : 1)))),""","""      if (
        ((o.yaw -= R.x * V),
        (o.pitch = Math.max(-1.45, Math.min(1.45, o.pitch - R.y * V * (s.settings.invert ? -1 : 1)))),
        VR && ((o.yaw = VR.headYaw()), (o.pitch = VR.headPitch())),""")
R("        (o.tp = s.settings.tp && !s.fpOnly),","        (o.tp = s.settings.tp && !s.fpOnly && !VR),")
R("(r.getWorldDirection(U),\n            s.FX.arc(","(VR ? VR.aimDir(U) : r.getWorldDirection(U),\n            s.FX.arc(")
R("(r.getWorldDirection(U),\n            T.gren--,","(VR ? VR.aimDir(U) : r.getWorldDirection(U),\n            T.gren--,")
R("let U = s.combat.melee(o, o.yaw, S());","let U = s.combat.melee(o, VR ? VR.aimYaw() : o.yaw, S());")
R("""        (i.listener.yaw = o.yaw));
    };""","""        (i.listener.yaw = o.yaw),
        VR && VR.after(o, a, N));
    };""")
R("""    function w() {
      let N = new C();""","""    function w() {
      if (s.vr && s.vr.on) return s.vr.aim();
      let N = new C();""")
R("    o.vm = a;\n","    o.vm = a;\n    s.vrKit = { gun: oo, geo: ro, grips: bb, handR: y, handL: m };\n")
R("      (r.rotation.set(0, 0, 0), (r.rotation.order = \"YXZ\"), (r.rotation.y = o.yaw), (r.rotation.x = o.pitch + o.kick * 0.008));","      VR || (r.rotation.set(0, 0, 0), (r.rotation.order = \"YXZ\"), (r.rotation.y = o.yaw), (r.rotation.x = o.pitch + o.kick * 0.008));")
R("      } else r.position.copy(le);","      } else VR || r.position.copy(le);")
R("            if (!f || s.input.pressed(\"use\")) {","            if ((!f && !(s.vr && s.vr.on)) || (!(s.vr && s.vr.on) && s.input.pressed(\"use\"))) {")
vr=open(os.path.join(D,'vr_module.js')).read()
R("  var ei = kg(Ye.renderer.domElement, yt(\"#touch\"));\n  Y.input = ei;", vr+"\n  var ei = kg(Ye.renderer.domElement, yt(\"#touch\"));\n  Y.input = ei;")
R("  var Bc = Hg();\n  Bc.setVol(Y.settings.vol);\n  Y.AU = Bc;","  var Bc = Hg();\n  Bc.setVol(Y.settings.vol);\n  Y.AU = Bc;\n  Y.vr = vrCreate(Y);\n  Y.vrWant = !!lo.get(\"vr\", !1);")
R("    let s = [Ye.camera];\n    for (let e of Ye.scene.children.slice()) s.includes(e) || Ye.scene.remove(e);","    let s = [Ye.camera, Y.vr.rig];\n    for (let e of Ye.scene.children.slice()) s.includes(e) || Ye.scene.remove(e);")
R("""  Y.pause = () => {
    if (Y.playing) {""","""  Y.pause = () => {
    if ((Y.vr.on && Y.vr.exit(), Y.playing)) {""")
R("""  Y.finish = (s) => {
    ((Y.playing = !1), (Y.lastWin = s));""","""  Y.finish = (s) => {
    ((Y.playing = !1), (Y.lastWin = s), Y.vr.on && setTimeout(() => Y.vr.exit(), s ? 1400 : 150));""")
R("""      if (((Y.time = e), (u0.value = e), ei.pressed("menu"))) {""","""      if (((Y.time = e), (u0.value = e), ei.pressed("menu") || (Y.vr.on && Y.vr.edge.menu))) {""")
R("  window.__G = Y;","""  for (let k of ["startMission", "startOp", "startDM"]) {
    let f = Y[k];
    Y[k] = (...a) => {
      if (Y.vrWant && Y.vr.supported && !Y.vr.on)
        return Y.vr
          .enter()
          .catch((e) => Y.toast("No se pudo abrir el visor: " + ((e && e.message) || e)))
          .then(() => f(...a));
      return f(...a);
    };
  }
  Y.onVRExit = () => {
    Y.playing && Y.pause();
  };
  {
    let b = yt("#go-vr");
    b &&
      (b.onclick = () => {
        ((Y.vrWant = !Y.vrWant), lo.set("vr", Y.vrWant), Y.vr.paint(), Y.toast(Y.vrWant ? "Al empezar cualquier modo se abre en el visor" : "Jug\\xE1s en pantalla"));
      });
    Y.vr.paint();
  }
  {
    let b = yt("#go-ss");
    b &&
      (b.onclick = () => {
        if (!window.SS) return Y.toast("Superslow no carg\\xF3");
        ((Ye.sleep = !0), Y.vr.on && Y.vr.exit(), window.SS.enter());
      });
    window.__ssExit = () => {
      ((Ye.sleep = !1), jt.show("#home"));
    };
  }
  window.__G = Y;""")
open(os.path.join(D,'game.js'),'w').write(s)
print('ok')
