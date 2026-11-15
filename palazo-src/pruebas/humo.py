#!/usr/bin/env python3
# Prueba de humo: carga dist/index.html sin pantalla, entra a cada modo y avisa si algo rompe.
# Uso: python3 pruebas/humo.py   (necesita: pip install playwright; el Chromium ya instalado)
# Trucos que usan todas las pruebas:
#  - window.__G es el estado global (G.me, G.mode, G.units, G.E motor, G.vr, G.net…).
#  - Para simular sin esperar: G.E.paused=true y llamar a mano s.update(.033,t) de G.E.systems (ver paso()).
#  - Calidad baja: localStorage 'pzreal.settings' = {quality:'low'} (el render por software es lento).
import asyncio,os,json,sys
from playwright.async_api import async_playwright
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','dist','index.html')
PASO="const E=__G.E,sys=E.systems.filter(s=>s.update);E.paused=true;let t=E.time;const paso=n=>{for(let i=0;i<n;i++){t+=.033;E.time=t;__G.time=t;for(const s of sys)s.update(.033,t)}};"
async def main():
  fallas=[]
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':900,'height':500});errs=[]
    await pg.add_init_script("localStorage.setItem('pzreal.settings',JSON.stringify({quality:'low'}))")
    pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('file://'+os.path.abspath(D));await pg.wait_for_function("!document.querySelector('#home').hidden",timeout=180000)
    async def modo(nombre,llamada,chequeo):
        await pg.evaluate(llamada);await pg.wait_for_function("__G.playing",timeout=240000)
        r=await pg.evaluate("(()=>{"+PASO+chequeo+"})()");print(nombre,r)
        if not r.get('ok'):fallas.append(nombre)
        await pg.evaluate("__G.E.paused=false;__G.quit()");await pg.wait_for_timeout(300)
    await modo('campaña pueblo',"__G.startMission(0,'rifle','pistol')","const p0=__G.units.filter(u=>u.isBot).map(u=>u.pos.clone());paso(300);const mv=__G.units.filter(u=>u.isBot).filter((u,i)=>p0[i]&&u.pos.distanceTo(p0[i])>1).length;return{ok:__G.me.alive!==undefined&&mv>0,bots:__G.units.length,seMovieron:mv}")
    await modo('campaña base',"__G.startMission(1,'rifle','pistol')","paso(150);return{ok:__G.units.length>4,unidades:__G.units.length}")
    await modo('operación',"__G.startOp(0)","paso(150);return{ok:__G.mode.kind==='op'&&!!__G.squad,equipo:__G.squad.members().length,alarma:!!(__G.stealth&&__G.stealth.alarm)}")
    for i in range(5):
        await modo(f'arena {i}',"__G.startDM({id:1,ph:'play',map:%d,md:'ffa',rem:600})"%i,"paso(30);return{ok:__G.me.alive&&__G.AI.passable(__G.me.pos.x,__G.me.pos.z),mapa:__G.map.name,objetos:__G.pickups.items.length}")
    await modo('zombis',"__G.startDM({id:1,ph:'play',map:0,md:'zm',rem:600})","__G.me.god=true;paso(700);const Z=__G.mode.Z;return{ok:Z.W.n>=1&&Z.alive()>0,oleada:Z.W.n,vivos:Z.alive()}")
    # Superslow
    await pg.evaluate("document.querySelector('#go-ss').click()");await pg.wait_for_timeout(1200)
    await pg.evaluate("document.querySelector('#ssgrid button').click()");await pg.wait_for_timeout(2000)
    ss=await pg.evaluate("({ok:document.querySelector('#ssmenu').hidden&&SS._dbg.enemies.length>0,rojos:SS._dbg.enemies.length})");print('superslow',ss)
    if not ss['ok']:fallas.append('superslow')
    await pg.evaluate("SS.exit()");await pg.wait_for_timeout(500)
    if not await pg.evaluate("!document.querySelector('#home').hidden&&!__G.E.sleep"):fallas.append('volver de superslow')
    errs=[e for e in errs if 'Pointer Lock' not in e]
    print('errores de página:',errs[:8]);await b.close()
  if fallas or errs:print('FALLÓ:',fallas);sys.exit(1)
  print('TODO OK')
asyncio.run(main())
