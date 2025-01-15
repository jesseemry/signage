self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('signageApp')
        .then(cache => {
            return cache.addAll([
                '/signage/',
                '/signage/index.html',
                '/signage/javascript.js',
                '/signage/Stylesheet.css'
            ]);
        });
    );
});

self.addEventListener('online', () => {
    console.log('online');
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage('refresh');
        });
    });
});
