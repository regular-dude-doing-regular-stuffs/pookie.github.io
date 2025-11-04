const CACHE_NAME = "pookie-boss-timer-v3";
const ASSETS = [
  "index.html",
  "manifest.json",
  "web.css",
  "boss-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});