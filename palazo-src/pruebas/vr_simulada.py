# Prueba de la VR de Palazo Real con controles simulados: disparar a una mano, dos manos, fundas, granada, soltar y levantar.
# Uso: python3 pruebas/vr_simulada.py
import asyncio,os,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':900,'height':500});errs=[];await pg.add_init_script("localStorage.setItem('pzreal.settings',JSON.stringify({quality:'low'}));localStorage.setItem('pzreal.mp',JSON.stringify({nick:'Vago',md:'zm',map:0,prim:'rifle',col:0}))");pg.on('pageerror',lambda e:errs.append('PE '+str(e)))
    await pg.goto('file://'+os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','dist','index.html'));await pg.wait_for_function("!document.querySelector('#home').hidden",timeout=120000)
    await pg.evaluate("document.querySelector('#go-mp').click()");await pg.wait_for_timeout(400)
    await pg.evaluate("document.querySelector('#mp-go').click()");await pg.wait_for_function("__G.playing",timeout=180000)
    r=await pg.evaluate("""(()=>{const G=__G,E=G.E,V=G.vr,Grp=V.rig.constructor,Vec=E.camera.position.constructor;E.paused=true;const sys=E.systems.filter(s=>s.update);let t=E.time;
      const Gp=()=>({axes:[0,0,0,0],buttons:Array.from({length:6},()=>({pressed:false})),hapticActuators:[]});
      const hr={ray:new Grp(),grip:new Grp(),src:{handedness:'right',gamepad:Gp()}},hl={ray:new Grp(),grip:new Grp(),src:{handedness:'left',gamepad:Gp()}};
      V.rig.add(hr.ray,hr.grip,hl.ray,hl.grip);V.hands={right:hr,left:hl};V.on=true;
      const me=G.me,L=()=>me.load,log=[];
      const step=n=>{for(let i=0;i<n;i++){E.camera.position.set(0,1.6,0);E.camera.rotation.set(0,0,0);t+=.033;E.time=t;G.time=t;for(const s of sys)s.update(.033,t)}};
      const setL=(side,x,y,z)=>{(side==='r'?hr:hl).ray.position.set(x,y,z)};
      const B=(side,i,v)=>{(side==='r'?hr:hl).src.gamepad.buttons[i].pressed=v};
      // rig local: cabeza en (0,1.6,0), mirando -z. Manos al frente
      setL('r',.18,1.25,-.35);setL('l',-.18,1.25,-.35);step(3);const HS=V._HS;
      log.push(['inicio mano der',HS.right.w,'izq',HS.left.w]);
      const a0=L().ammo.rifle.mag;B('r',0,true);step(6);B('r',0,false);step(1);log.push(['tiros una mano',a0-L().ammo.rifle.mag,'kick',+HS.right.kick.toFixed(2)]);
      step(20);
      // mano izq al guardamanos
      const fp=HS.right.gm.localToWorld(HS.right.gm.userData.fore.clone());V.rig.worldToLocal(fp);setL('l',fp.x,fp.y,fp.z);B('l',1,true);step(2);log.push(['dos manos',!!HS.right.supBy,HS.left.sup]);
      B('l',1,false);step(2);log.push(['suelta guardamanos',!!HS.right.supBy]);
      // guardar el fusil en la espalda: agarrar (saca la gracia) y soltar detrás de la cabeza
      B('r',1,true);step(1);setL('r',.05,1.48,.2);step(2);B('r',1,false);step(2);log.push(['guardado en espalda',HS.right.w,L().prim]);
      // pistola de la cintura derecha con la mano derecha
      setL('r',.22,.8,-.03);B('r',1,true);step(2);log.push(['saca pistola',HS.right.w]);
      // granada del pecho con la izquierda y tirarla con envión
      setL('l',0,1.2,-.16);B('l',1,true);step(2);const g0=L().gren;log.push(['granada en mano',HS.left.w,'quedan',g0]);
      for(let i=0;i<5;i++){setL('l',0,1.2+i*.05,-.16-i*.12);step(1)}B('l',1,false);step(1);log.push(['granada tirada',HS.left.w]);
      // soltar la pistola al frente (cae al piso)
      setL('r',.2,1.1,-.4);step(3);B('r',1,false);step(2);const pk=G.pickups.items.filter(i=>i.type==='w:'+'pistol').length;log.push(['pistola al piso',HS.right.w,'sec',L().sec,'en el piso',pk]);
      // levantarla del piso con la derecha (agachado)
      const it=G.pickups.items.find(i=>i.type==='w:pistol');if(!it)return JSON.stringify(log.concat([['items',G.pickups.items.map(i=>i.type).join(',')]]));const lp=new Vec(it.x,it.y+.5,it.z);V.rig.worldToLocal(lp);setL('r',lp.x,lp.y,lp.z);B('r',1,true);step(2);log.push(['levanta del piso',HS.right.w,'sec',L().sec]);
      // pasar a la otra mano
      setL('l',lp.x+.1,lp.y,lp.z);B('l',1,true);step(2);log.push(['pasa a la izq',HS.left.w,HS.right.w]);
      return JSON.stringify(log)})()""")
    for l in json.loads(r):print(l)
    await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/vr_simulada.jpg',quality=70,timeout=120000)
    print(errs[:6]);await b.close()
asyncio.run(main())
