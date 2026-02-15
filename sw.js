var CACHE='ginko-v22';
var URLS=['./','./manifest.json'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(names){
    return Promise.all(names.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  // Network first for everything (API + HTML), fallback to cache
  e.respondWith(
    fetch(e.request).then(function(r){
      // Update cache with fresh response
      if(r.ok){
        var clone=r.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,clone);});
      }
      return r;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
