var dataCacheName = 'VzWDBCache';
var cacheName = 'VzWCache';
var filesToCache = [
  '.',
  'index.html',
  'smartphones.html',
  
  'scripts/app.js',
  'images/vzw-logo-79-60m.png',
  'images/shelf-icon-whyvzw-265h.jpg',
  'images/shelf-icon-deals-265h.jpg',
  'images/shelf-icon-accessories-265h.jpg',
  'images/shelf-icon-tablet-265h.jpg',
  'images/shelf-icon-plans-265h.jpg',
  'images/shelf-icon-smartphone-265h.jpg',
  
  'css/global.min.cb48176e42.css',
  'css/styles-m.css',
  
  'globalnav/fonts/NeueHaasGroteskDisplay.woff2',
  'globalnav/fonts/NeueHaasGroteskDisplayBold.woff2',
  'globalnav/fonts/NeueHaasGroteskDisplayMedium.woff2',
  'globalnav/fonts/NeueHaasGroteskText.woff2',
  'globalnav/fonts/NeueHaasGroteskTextBold.woff2',
  'globalnav/fonts/NeueHaasGroteskTextMedium.woff2',
  'globalnav/fonts/vzw-iconfont.woff',
  
  'scripts/lib.cb2633b320.js',
  'scripts/slick.cb2633b320.js',
  'scripts/countdown.cb2633b320.js',
  'scripts/jquery.lwtCountdown-1.0.cb2633b320.js',
  'scripts/modernizr.cb2633b320.js'
 
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = 'https://publicdata-weather.firebaseio.com/';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
