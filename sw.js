self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('signageApp')
        .then(cache => {
            return cache.addAll([
                '/index.html',
                '/javascript.js',
                '/Stylesheet.css'
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
