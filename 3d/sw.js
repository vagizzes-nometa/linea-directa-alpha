// Línea Directa 3D · f6afc8973e: guarda todo al instalarse. Las páginas buscan primero la versión nueva (4 s); lo pesado sale de lo guardado.
const C = 'ld3d-f6afc8973e', FILES = ['./', 'index.html', 'plaza.html', 'pista.html', 'parque.html', 'plaza.js', 'pista.js', 'parque.js', 'assets.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('ld3d-') && x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url); if (url.origin !== location.origin) return;
  const doc = e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  e.respondWith(caches.open(C).then(async c => {
    const key = url.pathname.endsWith('/') ? 'index.html' : e.request;
    if (doc) {
      const net = fetch(e.request, { cache: 'no-store' }).then(r => { if (r && r.ok) c.put(key, r.clone()); return r && r.ok ? r : null; }).catch(() => null);
      const slow = new Promise(res => setTimeout(() => res(null), 4000));
      return (await Promise.race([net, slow])) || (await c.match(key, { ignoreSearch: true })) || (await net) || Response.error();
    }
    const hit = await c.match(e.request, { ignoreSearch: true }); if (hit) return hit;
    try { const r = await fetch(e.request); if (r && r.ok) c.put(e.request, r.clone()); return r; } catch (err) { return Response.error(); }
  }));
});
