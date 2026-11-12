/* Guarda o guia no telemóvel para abrir sem internet. */
var C='guia-v1';
var CORE=['./','./index.html'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  /* a página: tenta a versão nova, se não houver rede usa a guardada */
  if(r.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put('./index.html',cp)});return res})
      .catch(function(){return caches.match('./index.html')}));
    return;
  }
  /* mapa (Leaflet): usa o guardado, senão vai buscar e guarda */
  if(u.hostname==='cdnjs.cloudflare.com'){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)});return res})}));
  }
});
