const CACHE_NAME = "boss-timer-cache-v1";
const ASSETS = [
"./",
"./index.html",
"./manifest.json",
"./icons/icon-192.png",
"./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
console.log("📦 Caching app shell");
return cache.addAll(ASSETS);
})
);
self.skipWaiting();
});

self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
)
);
self.clients.claim();
});

self.addEventListener("fetch", (event) => {
const url = new URL(event.request.url);

// Always try network first for the JSON data
if (url.href.includes("jsonbin.io")) {
event.respondWith(
fetch(event.request).catch(() => caches.match(event.request))
);
return;
}

// Cache-first for everything else
event.respondWith(
caches.match(event.request).then((cached) => {
return (
cached ||
fetch(event.request)
.then((res) => {
return caches.open(CACHE_NAME).then((cache) => {
cache.put(event.request, res.clone());
return res;
});
})
.catch(() => caches.match("./index.html"))
);
})
);
});
