// Línea Directa Alpha · 8c587f213a: con internet abre siempre la última versión; sin conexión, la guardada
const C = 'ld-8c587f213a', FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const doc = e.request.mode === 'navigate' || (p => p.endsWith('/') || p.endsWith('/index.html'))(new URL(e.request.url).pathname);
  // el juego (la página): primero internet, sin caché del navegador; si no hay señal en 4 s, lo guardado
  if (doc) return e.respondWith(caches.open(C).then(async c => {
    const net = fetch(e.request, { cache: 'no-store' }).then(r => { if (r && r.ok) c.put('index.html', r.clone()); return r && r.ok ? r : null; }).catch(() => null);
    const slow = new Promise(res => setTimeout(() => res(null), 4000));
    return (await Promise.race([net, slow])) || (await c.match('index.html')) || (await net) || Response.error();
  }));
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || (e.request.mode === 'navigate' ? c.match('index.html') : Response.error());
  }));
});
