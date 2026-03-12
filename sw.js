const CACHE_NAME = "learn2secure-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html"
];

// Install event – cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event – clean old cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event – offline support
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
        .then(response => response || caches.match("./offline.html"));
    })
  );
});
