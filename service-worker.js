const CACHE_NAME = 'treino-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/add-treino.html',
    '/styles.css',
    '/treino.js',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Instala o service worker e adiciona arquivos ao cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Faz o fetch dos arquivos do cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

