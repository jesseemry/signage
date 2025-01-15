self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('signageApp')
        .then(cache => {
            return cache.addAll([
                '/signage/',
                'index.html',
                'javascript.js',
                'Stylesheet.css'
            ]);
        })
    );
});

self.addEventListener('online', () => {
    console.log('online')
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage('refresh');
        });
    });
});

self.addEventListener('offline', () => {
    console.log('offline')
});
