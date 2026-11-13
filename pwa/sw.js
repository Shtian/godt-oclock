// Service worker for offline use. The build replaces the two placeholders
// below with a content hash and the list of every emitted file (see vite.config.ts).
const VERSION = "__SW_VERSION__";
const PRECACHE = __SW_PRECACHE__;
const CACHE = `godt-oclock-${VERSION}`;

const url = (path) => new URL(path, self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map(url)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("godt-oclock-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // App shell: every navigation gets the cached start page, so it works fully offline.
  if (request.mode === "navigate") {
    event.respondWith(caches.match(url("./")).then((hit) => hit ?? fetch(request)));
    return;
  }

  event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request)));
});
