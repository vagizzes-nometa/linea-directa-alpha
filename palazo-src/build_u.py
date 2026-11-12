#!/usr/bin/env python3
# Arma el archivo único: Palazo Real (motor three 0.160) + Superslow con VR (motor three r128 propio).
import re,sys,subprocess,os
D=os.path.dirname(os.path.abspath(__file__))
P=lambda *a:os.path.join(D,*a)
head=open(P('page_head.html')).read()
assets=open(P('assets.js.txt')).read()
# ---- Superslow: estilos, pantalla y código desde el Palazo original
ss_css=open(P('ss_css.txt')).read()
ss_dom=open(P('ss_dom.html')).read()
assert ss_dom.startswith('<div id="sswrap"'),ss_dom[:40]
ss_dom=ss_dom.replace('>← Palazo</button>','>← Volver</button>').replace('Volver a Palazo','Volver al menú')
helpers=open(P('ss_helpers.js')).read()
assert helpers.startswith('const WGEO=') and helpers.rstrip().endswith('return g}'),helpers[-80:]
ss=open(P('ss_src.js')).read()
assert ss.startswith('const SS=(()=>{')
gen_css='''
#sswrap{--display:"Silkscreen","Courier New",monospace;font-family:var(--body);-webkit-user-select:none;user-select:none}
#sswrap .overlay{touch-action:pan-y;position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:calc(16px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px));box-sizing:border-box}
#sswrap .panel{width:100%;max-width:900px;border:1px solid;border-radius:10px;padding:20px;box-sizing:border-box;display:flex;flex-direction:column;gap:14px;margin:auto 0}
#sswrap .shead{display:flex;justify-content:space-between;align-items:center;gap:12px}
#sswrap h2{font-family:var(--display);font-size:24px;margin:0;letter-spacing:0}
#sswrap .tag{margin:0;font-size:14px;line-height:1.45}#sswrap .note{font-size:12px;margin:0;line-height:1.5}
#sswrap .sect{font-size:11px;letter-spacing:.18em;text-transform:uppercase}
#sswrap .seg{display:grid;gap:6px}#sswrap .seg button{font:600 14px var(--body);padding:9px 6px;border-radius:6px;border:2px solid}
#sswrap .btnrow{display:flex;gap:8px;flex-wrap:wrap}
#sswrap .ghost{font:600 13px var(--body);padding:8px 14px;border-radius:6px;border:1px solid}
#sswrap .go{font-family:var(--display);font-size:22px;padding:14px;border:0;border-radius:6px}
#sswrap p{margin:0}
'''
home_add='''    <button class="big" id="go-ss" type="button"><b>Superslow</b><span>Diez misiones donde el tiempo solo avanza cuando te movés. En pantalla o en el visor VR.</span></button>
    <button class="big" id="go-vr" type="button" hidden><b>Visor VR: apagado</b><span>Encendelo y la campaña, las operaciones, el juego en línea y los zombis se abren en el visor. Stick izq. camina · stick der. gira · gatillo dispara · A recarga · B cambia arma · X salta · grip izq. agacha · Y sale.</span></button>
'''
anchor='    <button class="big" id="go-set" type="button">'
assert head.count(anchor)==1
head=head.replace(anchor,home_add+anchor)
head=head.replace('</style></head>',gen_css+ss_css+'\n.big.on{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold)}\n</style><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet"></head>',1)
# la pantalla de Superslow va después de la interfaz del juego
head=head.rstrip()+'\n'+ss_dom+'\n'
three128=open(P('node_modules/three/build/three.min.js')).read()
ss_js='''(function(){
// Superslow: código original de Palazo, con su motor (three r128) y su VR. Toma de Palazo Real la sensibilidad y el volumen.
const touchMode=!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches)&&!/OculusBrowser|Quest|Pico/i.test(navigator.userAgent);
const cfg=(()=>{let s={};try{s=JSON.parse(localStorage.getItem('pzreal.settings')||'{}')||{}}catch(e){}return{sens:typeof s.sens==='number'?s.sens:1,invert:!!s.invert,vol:typeof s.vol==='number'?s.vol:.8}})();
const store={get(){try{return JSON.parse(localStorage.getItem('palazo.v1')||'{}')||{}}catch(e){return{}}},set(v){try{localStorage.setItem('palazo.v1',JSON.stringify(v))}catch(e){}}};
function ssExitHook(){window.__ssExit&&window.__ssExit()}
'''+helpers+'\n'+ss+'''
window.SS=SS;
let last=0;function loop(t){requestAnimationFrame(loop);const dt=last?Math.min(.05,(t-last)/1000):.016;last=t;if(window.SSON&&!SS.X.on)SS.frame(dt)}requestAnimationFrame(loop);
})();'''
# Palazo Real minificado desde la fuente legible
subprocess.run(['npx','esbuild',P('game.js'),'--minify','--outfile='+P('game.min2.js'),'--log-level=warning'],check=True,cwd=D)
game=open(P('game.min2.js')).read()
html=head+assets+'\n<script>'+three128.replace('</script','<\\/script')+'</script>\n<script>'+ss_js+'</script>\n<script>'+game+'</script>\n</body></html>\n'
os.makedirs(P('dist'),exist_ok=True)
open(P('dist','index.html'),'w').write(html)
print('ok',round(len(html)/1e6,2),'MB')
