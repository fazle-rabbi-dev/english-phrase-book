/* Service worker — keeps the phrasebook usable without a network connection.
   Bump CACHE_VERSION whenever the listed files change. */
const CACHE_VERSION = "english-phrase-book-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/favicon.svg",
  "./css/tokens.css",
  "./css/layout.css",
  "./css/components.css",
  "./js/icons.js",
  "./js/data.js",
  "./js/ui.js",
  "./js/theme.js",
  "./js/app.js",
  "./js/offline.js",
];

const INDEX_URL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* Page loads: network first (fresh copy when online), cached shell offline. */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(INDEX_URL, copy));
          }
          return response;
        })
        .catch(() => caches.match(INDEX_URL))
    );
    return;
  }

  /* Everything else: serve from cache instantly, refresh in the background. */
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(request);

      const refresh = fetch(request).then((response) => {
        if (response && response.ok && response.type === "basic") {
          return cache.put(request, response.clone());
        }
      }).catch(() => {
        /* offline or blocked — keep the cached copy */
      });

      if (cached) {
        event.waitUntil(refresh);
        return cached;
      }

      const response = await refresh.then(() => cache.match(request)).catch(() => null);
      return response || Response.error();
    })()
  );
});
