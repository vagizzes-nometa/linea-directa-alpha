// Palazo Real · 9fe43f694e: con internet abre la última versión; sin conexión, la guardada
const C='pz-9fe43f694e',FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pz-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const p=new URL(e.request.url).pathname;const doc=e.request.mode==='navigate'||p.endsWith('/')||p.endsWith('/index.html');
  if(doc)return e.respondWith(caches.open(C).then(async c=>{const net=fetch(e.request,{cache:'no-store'}).then(r=>{if(r&&r.ok)c.put('index.html',r.clone());return r&&r.ok?r:null}).catch(()=>null);
    const slow=new Promise(res=>setTimeout(()=>res(null),5000));return(await Promise.race([net,slow]))||(await c.match('index.html'))||(await net)||Response.error()}));
  e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>null);return hit||(await net)||Response.error()}))});
