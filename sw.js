var CACHE='ginko-v16';
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
  // Network first for API, cache first for assets
  if(e.request.url.includes('workers.dev')){
    e.respondWith(fetch(e.request).catch(function(){return caches.match(e.request);}));
  } else {
    e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request);}));
  }
});
