#!/usr/bin/env python3
# Copia dist/index.html a la carpeta palazo/ del repo como app instalable (manifiesto, ícono, service worker con versión nueva).
import sys,os,hashlib,re
D=os.path.dirname(os.path.abspath(__file__));repo=sys.argv[1]
s=open(os.path.join(D,'dist','index.html')).read()
meta='<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png">\n<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Palazo Real"><meta name="theme-color" content="#14171c">\n'
s=s.replace('<title>Palazo Real</title>\n','<title>Palazo Real</title>\n'+meta,1)
assert meta in s
s=s.replace('</body></html>','<script>if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>\n</body></html>',1)
open(os.path.join(repo,'palazo','index.html'),'w').write(s)
h=hashlib.sha1(s.encode()).hexdigest()[:10]
p=os.path.join(repo,'palazo','sw.js');w=open(p).read()
w=re.sub(r"pz-[0-9a-f]{10}","pz-"+h,w);w=re.sub(r"Palazo Real · [0-9a-f]{10}","Palazo Real · "+h,w)
open(p,'w').write(w);print('ok',h)
