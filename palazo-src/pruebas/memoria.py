#!/usr/bin/env python3
# Memoria gráfica: carga El Pueblo 4 veces y otros mapas; geometrías (g) y texturas (t) tienen que quedar parejas (R1).
# Uso: python3 pruebas/memoria.py
import asyncio,os,sys,json
from playwright.async_api import async_playwright
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","dist","index.html")
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':900,'height':500});errs=[]
    await pg.add_init_script("localStorage.setItem('pzreal.settings',JSON.stringify({quality:'low'}))")
    pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('file://'+os.path.abspath(D));await pg.wait_for_function("!document.querySelector('#home').hidden",timeout=180000)
    seq=[('pueblo',"__G.startMission(0,'rifle','pistol')")]*4+[('arena2',"__G.startDM({id:1,ph:'play',map:2,md:'ffa',rem:600})"),('zm',"__G.startDM({id:1,ph:'play',map:0,md:'zm',rem:600})"),('pueblo',"__G.startMission(0,'rifle','pistol')"),('base',"__G.startMission(1,'rifle','pistol')"),('pueblo',"__G.startMission(0,'rifle','pistol')")]
    for n,c in seq:
      await pg.evaluate(c);await pg.wait_for_function("__G.playing",timeout=240000)
      await pg.wait_for_timeout(1500)
      m=await pg.evaluate("(()=>{const i=__G.E.renderer.info;return {g:i.memory.geometries,t:i.memory.textures,prog:i.programs.length,calls:i.render.calls}})()")
      print(n,m,flush=True)
      await pg.evaluate("__G.quit()");await pg.wait_for_timeout(300)
    m=await pg.evaluate("(()=>{const i=__G.E.renderer.info;return {g:i.memory.geometries,t:i.memory.textures}})()")
    print('home tras salir',m)
    print('errores',[e for e in errs if 'Pointer Lock' not in e][:5]);await b.close()
asyncio.run(main())
