# Prueba de las órdenes a la escuadra en VR (botones sobre la muñeca izquierda, tocados con la derecha).
# Uso: python3 pruebas/vr_ordenes.py
import asyncio,os,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':900,'height':500});errs=[];await pg.add_init_script("localStorage.setItem('pzreal.settings',JSON.stringify({quality:'low'}))");pg.on('pageerror',lambda e:errs.append('PE '+str(e)))
    await pg.goto('file://'+os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','dist','index.html'));await pg.wait_for_function("!document.querySelector('#home').hidden",timeout=120000)
    await pg.evaluate("__G.startOp(0)");await pg.wait_for_function("__G.playing&&__G.squad",timeout=180000)
    r=await pg.evaluate("""(()=>{const G=__G,E=G.E,V=G.vr,Grp=V.rig.constructor,Vec=E.camera.position.constructor;E.paused=true;const sys=E.systems.filter(s=>s.update);let t=E.time;
      const Gp=()=>({axes:[0,0,0,0],buttons:Array.from({length:6},()=>({pressed:false})),hapticActuators:[]});
      const hr={ray:new Grp(),grip:new Grp(),src:{handedness:'right',gamepad:Gp()}},hl={ray:new Grp(),grip:new Grp(),src:{handedness:'left',gamepad:Gp()}};
      V.rig.add(hr.ray,hr.grip,hl.ray,hl.grip);V.hands={right:hr,left:hl};V.on=true;
      const step=n=>{for(let i=0;i<n;i++){E.camera.position.set(0,1.6,0);E.camera.rotation.set(0,0,0);t+=.033;E.time=t;G.time=t;for(const s of sys)s.update(.033,t)}};
      const log=[];hl.ray.position.set(-.15,1.2,-.3);hl.grip.position.copy(hl.ray.position);hr.ray.position.set(.25,1.2,-.3);step(3);
      // la mano derecha sobre cada celda: centro de la celda en el panel de órdenes
      const ord=V._ord;const cell=(cx,cy)=>{ord.updateWorldMatrix(true,false);const w=ord.localToWorld(new Vec(cx*.042,cy*.027,.01));V.rig.worldToLocal(w);return w};
      log.push(['panel visible',ord.visible,'orden',G.squad.order]);
      for(const [n,cx,cy] of [['QUIETOS',1,1],['SEGUIME',-1,1],['FUEGO',1,-1]]){const fr=G.stealth.weaponsFree;const w=cell(cx,cy);hr.ray.position.copy(w);step(3);const a=G.squad.order;step(10);log.push([n,'toque corto',a,'sostenido',G.squad.order,'fuego libre',fr,'→',G.stealth.weaponsFree]);hr.ray.position.set(.25,1.2,-.3);step(2)}
      return JSON.stringify(log)})()""")
    for l in json.loads(r):print(l)
    print([e for e in errs if 'Pointer Lock' not in e][:6]);await b.close()
asyncio.run(main())
